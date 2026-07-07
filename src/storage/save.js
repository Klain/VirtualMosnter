import { createGame } from '../core/game.js';
const KEY='lcd-vpet-save-v1';
export function loadGame() { const raw=localStorage.getItem(KEY); if(!raw)return createGame(); try { const parsed=JSON.parse(raw); return parsed.schemaVersion===1? parsed : createGame(); } catch { return createGame(); } }
export function saveGame(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
export function exportGame(s){ return JSON.stringify(s,null,2); }
export function importGame(json) { const parsed=JSON.parse(json); if(parsed.schemaVersion!==1) throw new Error('Schema no soportado'); return parsed; }
