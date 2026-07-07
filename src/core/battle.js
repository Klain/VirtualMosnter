import { battleMatrix } from '../data/battle.js';
import { speciesById } from '../data/species.js';
import { clamp } from './game.js';
export function winChance(own, enemy, ownBoost=0, enemyBoost=0){ return clamp(battleMatrix[own][enemy]+ownBoost-enemyBoost,1,15)/16; }
export function battle(ownSpecies, enemySpecies, ownBoost=0, enemyBoost=0, roll=Math.random()){ const own=speciesById[ownSpecies].battleSlot; const enemy=speciesById[enemySpecies].battleSlot; const chance=winChance(own,enemy,ownBoost,enemyBoost); return { victory: roll < chance, chance, ownSlot: own, enemySlot: enemy }; }