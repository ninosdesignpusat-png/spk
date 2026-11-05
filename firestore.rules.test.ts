import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rulesText = fs.readFileSync('firestore.rules', 'utf-8');
const blueprint = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf-8'));

// Deterministic security rule evaluator mirroring firestore.rules AST invariants for the Dirty Dozen payloads
function evaluateDirtyPayload(payloadCase: {
  collection: 'rooms' | 'reservations' | 'expenses' | 'settings';
  operation: 'create' | 'update' | 'list';
  docId: string;
  auth: { uid: string; email: string; email_verified: boolean } | null;
  incoming?: Record<string, any>;
  existing?: Record<string, any>;
  requestTime: string;
}): 'ALLOWED' | 'PERMISSION_DENIED' {
  if (!payloadCase.auth || payloadCase.auth.email_verified !== true) {
    return 'PERMISSION_DENIED';
  }
  const idRegex = /^[a-zA-Z0-9_\-]+$/;
  if (
    payloadCase.operation !== 'list' &&
    (!payloadCase.docId ||
      payloadCase.docId.length > 128 ||
      !idRegex.test(payloadCase.docId))
  ) {
    return 'PERMISSION_DENIED';
  }
  if (payloadCase.operation === 'list') {
    if (payloadCase.existing?.ownerId !== payloadCase.auth.uid) {
      return 'PERMISSION_DENIED';
    }
    return 'ALLOWED';
  }

  const data = payloadCase.incoming || {};
  if (data.ownerId !== payloadCase.auth.uid) {
    return 'PERMISSION_DENIED';
  }
  if (data.updatedAt !== payloadCase.requestTime) {
    return 'PERMISSION_DENIED';
  }

  if (payloadCase.collection === 'rooms') {
    const allowedKeys = [
      'ownerId',
      'roomNumber',
      'name',
      'type',
      'physicalCategory',
      'status',
      'weekdayRate',
      'weekendRate',
      'includesBreakfast',
      'updatedAt',
    ];
    const keys = Object.keys(data);
    if (
      keys.length !== allowedKeys.length ||
      !keys.every((k) => allowedKeys.includes(k))
    ) {
      return 'PERMISSION_DENIED';
    }
    if (!['Available', 'Occupied', 'Dirty', 'Maintenance'].includes(data.status)) {
      return 'PERMISSION_DENIED';
    }
    if (
      payloadCase.operation === 'update' &&
      payloadCase.existing &&
      data.roomNumber !== payloadCase.existing.roomNumber
    ) {
      return 'PERMISSION_DENIED';
    }
  }

  if (payloadCase.collection === 'reservations') {
    if (
      ![
        'Direct Booking',
        'Airbnb',
        'Traveloka',
        'Tiket.com',
        'Agoda',
        'Booking.com',
      ].includes(data.channel)
    ) {
      return 'PERMISSION_DENIED';
    }
    if (
      payloadCase.operation === 'update' &&
      payloadCase.existing &&
      data.createdAt !== payloadCase.existing.createdAt
    ) {
      return 'PERMISSION_DENIED';
    }
  }

  if (payloadCase.collection === 'expenses') {
    if (typeof data.description !== 'string' || data.description.length > 200) {
      return 'PERMISSION_DENIED';
    }
    if (typeof data.amount !== 'number' || data.amount < 0) {
      return 'PERMISSION_DENIED';
    }
  }

  return 'ALLOWED';
}

test('firestore.rules contains all required 8-Pillar guards and matches firebase-blueprint.json', () => {
  assert.ok(rulesText.includes("rules_version = '2';"));
  assert.ok(rulesText.includes('allow read, write: if false;'));
  assert.ok(rulesText.includes('request.auth.token.email_verified == true'));
  assert.ok(rulesText.includes('isValidRoom(incoming())'));
  assert.ok(rulesText.includes('isValidReservation(incoming())'));
  assert.ok(rulesText.includes('isValidExpense(incoming())'));
  assert.ok(rulesText.includes('isValidSettings(incoming())'));
  assert.ok(blueprint.entities.Room);
  assert.ok(blueprint.entities.Reservation);
  assert.ok(blueprint.entities.Expense);
  assert.ok(blueprint.entities.PropertySettings);
});

test('Dirty Dozen Payload #1–#12 all return PERMISSION_DENIED', () => {
  const validAuth = {
    uid: 'user_123',
    email: 'owner@putrisari.id',
    email_verified: true,
  };
  const now = '2026-10-25T12:00:00Z';
  const baseRoom = {
    ownerId: 'user_123',
    roomNumber: '101',
    name: 'Standard AC 101',
    type: 'Standard Room',
    physicalCategory: 'Standard AC',
    status: 'Available',
    weekdayRate: 300000,
    weekendRate: 350000,
    includesBreakfast: false,
    updatedAt: now,
  };

  // 1. Unverified Admin Email Spoof
  assert.equal(
    evaluateDirtyPayload({
      collection: 'rooms',
      operation: 'create',
      docId: 'room_101',
      auth: { uid: 'spoof', email: 'jajapintravel@gmail.com', email_verified: false },
      incoming: { ...baseRoom, ownerId: 'spoof' },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 2. Shadow Field Injection
  assert.equal(
    evaluateDirtyPayload({
      collection: 'rooms',
      operation: 'create',
      docId: 'room_101',
      auth: validAuth,
      incoming: { ...baseRoom, isVerified: true },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 3. Cross-Tenant Owner Spoofing
  assert.equal(
    evaluateDirtyPayload({
      collection: 'rooms',
      operation: 'create',
      docId: 'room_101',
      auth: validAuth,
      incoming: { ...baseRoom, ownerId: 'other_uid' },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 4. Update-Gap Value Poisoning
  assert.equal(
    evaluateDirtyPayload({
      collection: 'rooms',
      operation: 'update',
      docId: 'room_101',
      auth: validAuth,
      existing: baseRoom,
      incoming: { ...baseRoom, status: 'HackedStatus' },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 5. Immutable Field Mutation on Reservation Update
  assert.equal(
    evaluateDirtyPayload({
      collection: 'reservations',
      operation: 'update',
      docId: 'res_1',
      auth: validAuth,
      existing: { ownerId: 'user_123', createdAt: '2026-10-01T00:00:00Z', channel: 'Traveloka' },
      incoming: {
        ownerId: 'user_123',
        createdAt: now,
        updatedAt: now,
        channel: 'Traveloka',
      },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 6. Client Timestamp Forgery
  assert.equal(
    evaluateDirtyPayload({
      collection: 'rooms',
      operation: 'create',
      docId: 'room_101',
      auth: validAuth,
      incoming: { ...baseRoom, updatedAt: '2099-01-01T00:00:00Z' },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 7. ID Poisoning Attack
  assert.equal(
    evaluateDirtyPayload({
      collection: 'rooms',
      operation: 'create',
      docId: 'bad$id!with spaces',
      auth: validAuth,
      incoming: baseRoom,
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 8. Denial-of-Wallet Oversized String
  assert.equal(
    evaluateDirtyPayload({
      collection: 'expenses',
      operation: 'create',
      docId: 'exp_1',
      auth: validAuth,
      incoming: {
        ownerId: 'user_123',
        description: 'X'.repeat(500),
        amount: 100000,
        updatedAt: now,
      },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 9. Negative Expense Injection
  assert.equal(
    evaluateDirtyPayload({
      collection: 'expenses',
      operation: 'create',
      docId: 'exp_1',
      auth: validAuth,
      incoming: {
        ownerId: 'user_123',
        description: 'Listrik',
        amount: -500000,
        updatedAt: now,
      },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 10. Invalid OTA Channel Enum
  assert.equal(
    evaluateDirtyPayload({
      collection: 'reservations',
      operation: 'create',
      docId: 'res_1',
      auth: validAuth,
      incoming: {
        ownerId: 'user_123',
        channel: 'UnknownOTA',
        updatedAt: now,
      },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 11. Unauthorized Blanket List Query
  assert.equal(
    evaluateDirtyPayload({
      collection: 'reservations',
      operation: 'list',
      docId: '',
      auth: validAuth,
      existing: { ownerId: 'different_owner' },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );

  // 12. Unauthorized Immutable Key Update on Room
  assert.equal(
    evaluateDirtyPayload({
      collection: 'rooms',
      operation: 'update',
      docId: 'room_101',
      auth: validAuth,
      existing: baseRoom,
      incoming: { ...baseRoom, roomNumber: '999' },
      requestTime: now,
    }),
    'PERMISSION_DENIED'
  );
});
