# Security Specification — Hotel Putri Sari HMS & Channel Manager

## 1. Data Invariants
1. **Identity Ownership Invariant**: Every document in `/rooms/{roomId}`, `/reservations/{reservationId}`, `/expenses/{expenseId}`, and `/settings/{settingId}` must have `ownerId == request.auth.uid` and require `request.auth.token.email_verified == true` (or bootstrapped admin `jajapintravel@gmail.com` with `email_verified == true`).
2. **Immutable Ownership & Creation Time**: `ownerId` and `createdAt` can never be mutated during an `update` operation (`incoming().ownerId == existing().ownerId` and `incoming().createdAt == existing().createdAt`).
3. **Server Timestamp Integrity**: Every `create` operation must set `createdAt == request.time` (where present) and `updatedAt == request.time`. Every `update` operation must set `updatedAt == request.time`.
4. **Strict Key & Enum Enforcement**: Every collection enforces exact `hasAll` and `hasOnly` key sets on creation, and explicit action-based `affectedKeys().hasOnly(...)` on update wrapped inside `isValid[Entity](incoming())`.
5. **Path ID Hardening**: All single-document operations (`get`, `create`, `update`, `delete`) validate document IDs using `isValidId(id)` matching `^[a-zA-Z0-9_\-]+$` with length `<= 128`.
6. **Query Enforcer on List**: All `allow list` rules explicitly validate `resource.data.ownerId == request.auth.uid` (or `isAdmin()`).

## 2. The "Dirty Dozen" Payloads
1. **Unverified Admin Email Spoof**: `{ auth: { uid: "spoof", token: { email: "jajapintravel@gmail.com", email_verified: false } } }` -> Rejected (`PERMISSION_DENIED`).
2. **Shadow Field Injection on Room Create**: `{ ...validRoom, isSuperRoom: true }` -> Rejected by `data.keys().hasOnly(...)` (`PERMISSION_DENIED`).
3. **Cross-Tenant Owner Spoofing on Reservation Create**: `{ ...validReservation, ownerId: "other_user_uid" }` -> Rejected by `data.ownerId == request.auth.uid` (`PERMISSION_DENIED`).
4. **Update-Gap Value Poisoning on Room Update**: Updating `status` to `"HackedStatus"` -> Rejected because `isValidRoom(incoming())` wraps the `allow update` rule (`PERMISSION_DENIED`).
5. **Immutable Field Mutation on Reservation Update**: Changing `createdAt` or `ownerId` during `update` -> Rejected by immutability guard (`PERMISSION_DENIED`).
6. **Client Timestamp Forgery**: Setting `updatedAt` to a past/future timestamp instead of `request.time` -> Rejected (`PERMISSION_DENIED`).
7. **ID Poisoning Attack**: Creating `/rooms/invalid$id!with*spaces` -> Rejected by `isValidId(roomId)` (`PERMISSION_DENIED`).
8. **Denial-of-Wallet Oversized String**: Creating an Expense with a 5,000-character `description` -> Rejected by `data.description.size() <= 200` (`PERMISSION_DENIED`).
9. **Negative Revenue/Expense Injection**: Creating an Expense with `amount: -500000` -> Rejected by `data.amount >= 0` (`PERMISSION_DENIED`).
10. **Invalid OTA Channel Enum**: Creating a Reservation with `channel: "UnknownOTA"` -> Rejected by enum allowlist (`PERMISSION_DENIED`).
11. **Unauthorized Blanket List Query**: Listing `/reservations` without filtering by `ownerId == request.auth.uid` -> Rejected by `resource.data.ownerId == request.auth.uid` (`PERMISSION_DENIED`).
12. **Unauthorised Field Update on Room Housekeeping**: Modifying `roomNumber` during a status update action -> Rejected by `affectedKeys().hasOnly(...)` (`PERMISSION_DENIED`).

## 3. Red Team Conflict Report
- **Identity Spoofing**: Blocked on all 4 collections via `data.ownerId == request.auth.uid` and `request.auth.token.email_verified == true`.
- **State Shortcutting**: Room and Reservation statuses are strictly constrained to valid enums (`Available`, `Occupied`, `Dirty`, `Maintenance` and `Confirmed`, `Checked-In`, `Checked-Out`, `Cancelled`).
- **Resource Poisoning**: All strings have explicit `.size()` upper bounds matching `firebase-blueprint.json`, and all path IDs require `isValidId()`.
- **Value Poisoning on Update**: Every `allow update` block begins with `isValid[Entity](incoming())` before checking `affectedKeys().hasOnly(...)`.
