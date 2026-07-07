import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, tick, train } from '../src/core/game.js';
import { winChance, battle } from '../src/core/battle.js';
test('tick aumenta hambre deterministamente',()=>{ let s=createGame(); for(let i=0;i<4;i++)s=tick(s); assert.equal(s.creature.hunger,1); });
test('entrenar sube training y boost',()=>{ const s=train(createGame()); assert.equal(s.creature.training,1); assert.equal(s.creature.boost,1); });
test('combate aplica boost con clamp sobre 16',()=>{ assert.equal(winChance('A','A',20,0),15/16); assert.equal(winChance('A','A',0,20),1/16); });
test('combate usa roll inyectable para pruebas',()=>{ assert.equal(battle('baby','baby',0,0,0).victory,true); assert.equal(battle('baby','baby',0,0,0.99).victory,false); });
