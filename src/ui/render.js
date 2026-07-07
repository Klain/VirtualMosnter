import { speciesById } from '../data/species.js';
import { areas } from '../data/areas.js';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const lcdValue = (value, max = 10) => clamp(Number(value) || 0, 0, max);

const icons = {
  feed: '<path d="M12 3c3 2 5 5 5 9a5 5 0 0 1-10 0c0-4 2-7 5-9Z"/><path d="M9 12h6"/>',
  protein: '<path d="M8 15 15 8a4 4 0 0 1 6 6l-7 7a4 4 0 0 1-6-6Z"/><path d="m12 11 6 6"/>',
  train: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
  cure: '<path d="M12 4v16M4 12h16"/>',
  light: '<path d="M9 18h6M10 22h4M8 10a4 4 0 1 1 8 0c0 2-2 3-2 6h-4c0-3-2-4-2-6Z"/>',
  clean: '<path d="M5 20h14M8 20l2-10h4l2 10M10 10V4h4v6M7 14h10"/>',
  status: '<path d="M4 13h4l2-6 4 12 2-6h4"/>',
  explore: '<path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/>',
  city: '<path d="M4 21V9l5-4 5 4v12M14 21V7h6v14M8 21v-5h2"/>',
  newgen: '<path d="M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  battle: '<path d="m14 4 6 6-10 10H4v-6L14 4Z"/><path d="m13 5 6 6"/>',
  retreat: '<path d="M9 7 4 12l5 5"/><path d="M4 12h16"/>',
  shop: '<path d="M4 10h16l-2 11H6L4 10Z"/><path d="M8 10a4 4 0 0 1 8 0"/>',
  clinic: '<path d="M4 21V7h16v14"/><path d="M12 10v8M8 14h8"/>',
  storage: '<path d="M4 8h16v13H4Z"/><path d="M7 8V4h10v4M4 13h16"/>',
  lock: '<path d="M7 11V8a5 5 0 0 1 10 0v3"/><path d="M6 11h12v10H6Z"/>'
};

function icon(name) {
  return `<svg class="lcd-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] ?? icons.status}</svg>`;
}

function meter(label, value, max = 10) {
  const current = lcdValue(value, max);
  const cells = Array.from({ length: max }, (_, i) => `<span class="meter-cell ${i < current ? 'is-on' : ''}"></span>`).join('');
  return `<div class="lcd-meter"><div class="meter-head"><span>${label}</span><b>${current}/${max}</b></div><div class="meter-track" aria-hidden="true">${cells}</div></div>`;
}

function statusPips(c) {
  const pips = [
    ['HAM', c.hunger >= 7, `${c.hunger}/10`],
    ['TRN', c.training > 0, c.training],
    ['MED', c.sick || c.injuries > 0, c.sick ? 'SICK' : `${c.injuries} INJ`],
    ['LUX', c.lightsOn, c.lightsOn ? 'ON' : 'OFF'],
    ['CLN', !c.dirty, c.dirty ? 'DIRT' : 'OK']
  ];
  return pips.map(([label, on, value]) => `<span class="status-pip ${on ? 'is-on' : ''}"><b>${label}</b>${value}</span>`).join('');
}

function actionButton({ action, panel, label, short, iconName, selected }) {
  const attrs = action ? `data-action="${action}"` : `data-panel="${panel}"`;
  return `<button class="icon-button ${selected ? 'is-selected' : ''}" ${attrs} aria-label="${label}" title="${label}">${icon(iconName)}<span>${short}</span></button>`;
}

function summaryPanel(state) {
  const c = state.creature;
  return `<section class="context-card"><h2>Estado vital</h2><div class="meter-grid">${meter('Hambre', c.hunger)}${meter('Fuerza', c.boost, 8)}${meter('Cansancio', c.tiredness)}${meter('Salud', c.injuries, 5)}</div><div class="stat-grid"><span>Edad<b>${c.ageHours}h</b></span><span>Peso<b>${c.weight}g</b></span><span>Victorias<b>${c.victories}</b></span><span>Gen<b>${c.generation}</b></span></div></section>`;
}

function feedPanel(state) {
  return `<section class="context-card"><h2>Alimentación</h2><p class="lcd-copy">Elige una ración. La proteína aumenta potencia pero también fatiga.</p><div class="choice-grid"><button data-action="feed">${icon('feed')} Carne <b>x${state.inventory.meat ?? 0}</b></button><button data-action="protein">${icon('protein')} Proteína <b>x${state.inventory.protein ?? 0}</b></button></div></section>`;
}

function trainPanel(state) {
  return `<section class="context-card"><h2>Entrenamiento</h2>${meter('Potencia', state.creature.boost, 8)}${meter('Fatiga', state.creature.tiredness)}<button class="wide-action" data-action="train">${icon('train')} Iniciar sesión</button></section>`;
}

function curePanel(state) {
  const c = state.creature;
  return `<section class="context-card"><h2>Clínica portátil</h2><div class="stat-grid"><span>Enfermo<b>${c.sick ? 'SI' : 'NO'}</b></span><span>Heridas<b>${c.injuries}</b></span><span>Medicina<b>x${state.inventory.medicine ?? 0}</b></span><span>Vendas<b>x${state.inventory.bandage ?? 0}</b></span></div><button class="wide-action" data-action="cure">${icon('cure')} Aplicar cura</button></section>`;
}

function explorePanel(state) {
  const active = areas.find(a => a.id === state.island.activeAreaId);
  return `<section class="context-card"><h2>File Island</h2><div class="island-readout"><span>TP <b>${state.island.travelPoints}</b></span><span>EXP <b>${active?.name ?? 'NINGUNA'}</b></span><span>STEP <b>${active ? state.island.encounterIndex + 1 : '-'}</b></span></div><div class="lcd-map">${areas.map((a, i) => {
    const locked = state.island.travelPoints < a.travelCost;
    const activeClass = a.id === state.island.activeAreaId ? 'is-active' : '';
    return `<button class="map-node ${locked ? 'is-locked' : ''} ${activeClass}" data-area="${a.id}" style="--node:${i}" aria-label="Viajar a ${a.name}"><span class="node-dot"></span><b>${a.name}</b><small>${a.travelCost}TP</small></button>`;
  }).join('')}</div><div class="choice-grid"><button data-action="battle">${icon('battle')} Encuentro</button><button data-action="retreat">${icon('retreat')} Retirarse</button></div></section>`;
}

function cityPanel(state) {
  const buildings = [['shop', 'Tienda'], ['clinic', 'Clínica'], ['storage', 'Almacén']];
  return `<section class="context-card"><h2>File City</h2><div class="building-grid">${buildings.map(([key, label]) => {
    const on = state.city.unlocked[key];
    return `<div class="building ${on ? 'is-open' : 'is-locked'}">${icon(key)}<b>${label}</b><span>${on ? 'OPEN' : `${icon('lock')} LOCK`}</span></div>`;
  }).join('')}</div><p class="lcd-copy">NPCs: ${state.city.npcs.length ? state.city.npcs.join(', ') : 'sin reclutas'}</p></section>`;
}

function infoPanel(state) {
  return `<section class="context-card"><h2>Ficha completa</h2>${summaryPanel(state)}<div class="stat-grid dense">${Object.entries(state.creature).map(([k, v]) => `<span>${k}<b>${String(v)}</b></span>`).join('')}</div></section>`;
}

function contextPanel(state, activePanel) {
  if (activePanel === 'feed') return feedPanel(state);
  if (activePanel === 'train') return trainPanel(state);
  if (activePanel === 'cure') return curePanel(state);
  if (activePanel === 'explore') return explorePanel(state);
  if (activePanel === 'city') return cityPanel(state);
  if (activePanel === 'status') return infoPanel(state);
  return summaryPanel(state);
}

export function drawCreature(canvas, state, frame, flash = false) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = flash ? '#d7ddb0' : '#aeb985';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#182311';
  const sp = speciesById[state.creature.species];
  const grid = sp.frames[frame % sp.frames.length];
  const scale = 20;
  const ox = Math.floor((canvas.width - (8 * scale)) / 2);
  const oy = 34 + (frame % 2 ? 2 : 0);
  grid.forEach((row, y) => row.forEach((p, x) => { if (p) ctx.fillRect(ox + x * scale, oy + y * scale, scale - 3, scale - 3); }));
  ctx.fillStyle = '#182311';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(state.creature.alive ? sp.name : 'MEMORIAL', canvas.width / 2, 24);
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`GEN ${state.creature.generation}`, 12, canvas.height - 16);
  ctx.textAlign = 'right';
  ctx.fillText(state.creature.lightsOn ? 'LIGHT' : 'DARK', canvas.width - 12, canvas.height - 16);
}

export function view(state, activePanel = 'status') {
  const c = state.creature;
  const sp = speciesById[c.species];
  const condition = !c.alive ? 'MEMORIAL' : c.sick ? 'SICK' : c.injuries ? 'INJURED' : c.hunger > 7 || c.tiredness > 7 ? 'CARE' : 'OK';
  const menu = [
    { panel: 'feed', label: 'Alimentar', short: 'FOOD', iconName: 'feed' },
    { action: 'protein', label: 'Proteína rápida', short: 'PROT', iconName: 'protein' },
    { panel: 'train', label: 'Entrenar', short: 'TRN', iconName: 'train' },
    { panel: 'cure', label: 'Curar', short: 'MED', iconName: 'cure' },
    { action: 'light', label: 'Luz', short: 'LUX', iconName: 'light' },
    { action: 'clean', label: 'Limpiar', short: 'CLN', iconName: 'clean' },
    { panel: 'explore', label: 'Exploración', short: 'MAP', iconName: 'explore' },
    { panel: 'city', label: 'Ciudad', short: 'CITY', iconName: 'city' },
    { panel: 'status', label: 'Información', short: 'STAT', iconName: 'status' },
    { action: 'newgen', label: 'Nueva generación', short: 'GEN+', iconName: 'newgen' }
  ];
  return `<main class="vm-shell"><header class="topbar"><b>LCD Pocket Creature</b><span>${sp.name}</span><span>GEN ${c.generation}</span><span>${c.ageHours}H</span><strong>${condition}</strong></header><section class="layout"><aside class="device"><div class="device-notch"></div><div class="lcd lcd-screen"><canvas id="screen" width="320" height="240" class="lcd-sprite"></canvas><div class="screen-message">${condition === 'OK' ? 'Sistema estable' : `Estado: ${condition}`}</div></div><div class="status-row">${statusPips(c)}</div><nav class="icon-menu" aria-label="Menu principal">${menu.map(item => actionButton({ ...item, selected: item.panel === activePanel })).join('')}</nav></aside><section class="context-panel"><div class="panel-label">${menu.find(m => m.panel === activePanel)?.label ?? 'Sistema'}</div>${contextPanel(state, activePanel)}</section></section><footer class="system-bar"><span>tick ${state.elapsedTicks}</span><span>TP ${state.island.travelPoints}</span><span>inventory ${Object.values(state.inventory).reduce((a, b) => a + b, 0)}</span></footer><details class="debug-panel"><summary>DEV / Debug</summary><div class="debug-actions"><button data-action="export">Export JSON</button><button data-action="import">Import JSON</button></div><textarea id="savebox" placeholder="export/import JSON"></textarea><pre>${JSON.stringify(state, null, 2)}</pre></details></main>`;
}
