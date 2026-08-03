import assert from 'node:assert/strict';
import { completeStreakDay, initialStreak, type StreakState } from '../src/lib/streak.ts';

const first = completeStreakDay(initialStreak, '2026-08-01');
assert.equal(first.streak.current, 1);
assert.equal(first.streak.freezes, 3);

const nextDay = completeStreakDay(first.streak, '2026-08-02');
assert.equal(nextDay.streak.current, 2);
assert.equal(nextDay.freezesUsed, 0);

const frozenDay = completeStreakDay(nextDay.streak, '2026-08-04');
assert.equal(frozenDay.streak.current, 3);
assert.equal(frozenDay.streak.freezes, 2);
assert.equal(frozenDay.freezesUsed, 1);

const sameDay = completeStreakDay(frozenDay.streak, '2026-08-04');
assert.deepEqual(sameDay.streak, frozenDay.streak);

const protectedState: StreakState = { ...initialStreak, current: 9, freezes: 3, lastPlayedDate: '2026-08-01' };
const protectedResult = completeStreakDay(protectedState, '2026-08-05');
assert.equal(protectedResult.streak.current, 10);
assert.equal(protectedResult.streak.freezes, 0);

const expired = completeStreakDay({ ...protectedState, freezes: 10 }, '2026-08-06');
assert.equal(expired.streak.current, 1);
assert.equal(expired.streak.freezes, 10);

const milestone = completeStreakDay({ ...initialStreak, current: 19, lastPlayedDate: '2026-08-02' }, '2026-08-03');
assert.equal(milestone.streak.current, 20);
assert.equal(milestone.reward, 20);
assert.equal(milestone.streak.title, 'Крутой');

const milestone40 = completeStreakDay({ ...initialStreak, current: 39, lastPlayedDate: '2026-08-02' }, '2026-08-03');
assert.equal(milestone40.reward, 40);
assert.equal(milestone40.streak.title, 'Просто босс');

console.log('✓ streak growth, freezes, expiry, milestones and titles');
