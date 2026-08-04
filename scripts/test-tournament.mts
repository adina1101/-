import assert from 'node:assert/strict';
import {
  advanceTournament, completeTournamentRound, createTournament, tournamentRatingDelta, tournamentStageName, tournamentTokenReward,
} from '../src/lib/tournament-engine.ts';

let tournament = createTournament('CARDIX Cup', 'durak');
assert.equal(tournament.opponents.length, 3, 'an eight-player bracket needs three player matches');
assert.equal(tournamentStageName(0, true), 'Четвертьфинал');
assert.equal(tournamentRatingDelta(true), 25);
assert.equal(tournamentRatingDelta(false), -18);
assert.equal(tournamentTokenReward(0, true), 10);
assert.equal(tournamentTokenReward(1, true), 10);
assert.equal(tournamentTokenReward(2, true), 10, 'final victory must keep the standard 10-token reward');
assert.equal(tournamentTokenReward(2, false), 0, 'final loss cannot award tokens');

tournament = completeTournamentRound(tournament, true);
assert.equal(tournament.status, 'awaiting-next');
assert.equal(tournament.rounds.length, 1);
tournament = completeTournamentRound(tournament, true);
assert.equal(tournament.rounds.length, 1, 'a match result can only be recorded once');
tournament = advanceTournament(tournament);
assert.equal(tournament.stage, 1, 'winner must advance to semifinal');
tournament = completeTournamentRound(tournament, true);
tournament = advanceTournament(tournament);
tournament = completeTournamentRound(tournament, true);
assert.equal(tournament.status, 'champion', 'three wins must win the tournament');

let eliminated = createTournament('Daily', 'war');
eliminated = completeTournamentRound(eliminated, false);
assert.equal(eliminated.status, 'eliminated');
assert.equal(advanceTournament(eliminated).stage, 0, 'loser cannot advance');
console.log('✓ tournament: quarterfinal, semifinal, final, champion and elimination');
