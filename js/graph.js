/**
 * graph.js — Motor de visualización D3
 *
 * Soporta 3 jerarquías: GIAR → proyectos → subproyectos → personas
 *
 * Tipos de nodo: 'giar' | 'project' | 'subproject' | 'person'
 * Tipos de enlace: 'hierarchy' (sólido) | 'membership' (punteado)
 *
 * Exportaciones:
 *   nodes    — array de todos los nodos
 *   nodeMap  — mapa id → nodo no-persona (con colores resueltos)
 *   simulation, svg
 *   highlight(relatedIds), clearHighlight()
 *   onNodeClick(fn)
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { DATA } from "./data.js";
import { isTreeMode } from "./treeLayout.js";

// ─── Jerarquía y estilos de roles ────────────────────────────────────────────

export const ROLE_RANK = {
  'Director': 0, 'Co-Director': 1, 'Lider de Proyecto': 2,
  'Lider de Sub-Proyecto': 3, 'Integrante': 4, 'Oyente': 5,
};

const ROLE_STROKE = {
  'Director': 3.5, 'Co-Director': 3, 'Lider de Proyecto': 2.5,
  'Lider de Sub-Proyecto': 2, 'Integrante': 1.5, 'Oyente': 1.5,
};

export function bestRole(pertenece) {
  let best = Infinity;
  (pertenece ?? []).forEach(m => {
    const r = ROLE_RANK[m.rol] ?? 4;
    if (r < best) best = r;
  });
  if (!isFinite(best)) return 'Integrante';
  return Object.entries(ROLE_RANK).find(([, v]) => v === best)?.[0] ?? 'Integrante';
}

// ─── Resolución de colores CSS ────────────────────────────────────────────────
function resolveColor(c) {
  if (typeof c === 'string' && c.startsWith('var(')) {
    const name = c.match(/--[\w-]+/)[0];
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return c;
}

// ─── Construcción de nodos no-persona ─────────────────────────────────────────

const _giarNode = { ...DATA.giar, type: 'giar', radius: 68 };
_giarNode.color = resolveColor(_giarNode.color);

const _projectNodes = DATA.proyectos.map(({ subproyectos: _s, ...p }) => {
  const n = { ...p, type: 'project', radius: 52 };
  n.color = resolveColor(n.color);
  return n;
});

const _subprojectNodes = DATA.proyectos.flatMap(p =>
  (p.subproyectos ?? []).map(sp => {
    const n = { ...sp, type: 'subproject', radius: 34, parentId: p.id };
    n.color = resolveColor(n.color);
    return n;
  })
);

// Mapa id → nodo para todos los niveles no-persona
export const nodeMap = Object.fromEntries(
  [_giarNode, ..._projectNodes, ..._subprojectNodes].map(n => [n.id, n])
);

// ─── Todos los nodos ──────────────────────────────────────────────────────────

export const nodes = [
  _giarNode,
  ..._projectNodes,
  ..._subprojectNodes,
  ...DATA.personas.map(p => ({ ...p, type: 'person', radius: 26 })),
];

// ─── Enlaces ──────────────────────────────────────────────────────────────────

const links = [];

// GIAR → proyectos
DATA.proyectos.forEach(p => {
  links.push({ source: 'giar', target: p.id, kind: 'hierarchy', color: nodeMap[p.id].color });
});

// proyectos → subproyectos
DATA.proyectos.forEach(p => {
  (p.subproyectos ?? []).forEach(sp => {
    links.push({ source: p.id, target: sp.id, kind: 'hierarchy', color: nodeMap[sp.id].color });
  });
});

// personas → sus nodos
DATA.personas.forEach(p => {
  p.pertenece.forEach(m => {
    links.push({ source: p.id, target: m.id, kind: 'membership', color: nodeMap[m.id]?.color ?? '#888' });
  });
});

// ─── SVG y capas ─────────────────────────────────────────────────────────────

const container = document.querySelector('main');
let width  = container.clientWidth;
let height = container.clientHeight;

export const svg = d3.select('#graph').attr('viewBox', [0, 0, width, height]);

const defs = svg.append('defs');
DATA.personas.forEach(p => {
  defs.append('clipPath')
    .attr('id', `clip-${p.id}`)
    .append('circle').attr('r', 24);
});

const zoomLayer = svg.append('g').attr('class', 'zoom-layer');
export const zoomBehavior = d3.zoom()
  .scaleExtent([0.3, 3])
  .on('zoom', e => zoomLayer.attr('transform', e.transform));
svg.call(zoomBehavior);

const linkLayer = zoomLayer.append('g').attr('class', 'links');
const nodeLayer = zoomLayer.append('g').attr('class', 'nodes');

// ─── Simulación de fuerzas ────────────────────────────────────────────────────

export const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id)
    .distance(l => {
      const s = Math.min(width, height);
      const scale = s < 480 ? 0.5 : s < 700 ? 0.72 : 1;
      if (l.kind === 'membership') return 85 * scale;
      const sid = l.source.id ?? l.source;
      return (sid === 'giar' ? 160 : 115) * scale;
    })
    .strength(l => l.kind === 'hierarchy' ? 0.8 : 0.45))
  .force('charge', d3.forceManyBody().strength(d => {
    if (d.type === 'giar')       return -1600;
    if (d.type === 'project')    return -900;
    if (d.type === 'subproject') return -450;
    return -280;
  }))
  .force('center',  d3.forceCenter(width / 2, height / 2).strength(0.05))
  .force('collide', d3.forceCollide().radius(d => d.radius + 12).strength(0.85))
  .force('x',       d3.forceX(width / 2).strength(0.03))
  .force('y',       d3.forceY(height / 2).strength(0.04));

// ─── Renderizado de enlaces ───────────────────────────────────────────────────

export const linkSel = linkLayer.selectAll('line')
  .data(links)
  .join('line')
  .attr('class',            d => `link link-${d.kind}`)
  .attr('stroke',           d => d.color)
  .attr('stroke-width',     d => d.kind === 'hierarchy' ? 1.5 : 0.8)
  .attr('stroke-opacity',   d => d.kind === 'hierarchy' ? 0.48 : 0.28)
  .attr('stroke-dasharray', d => d.kind === 'membership' ? '2 3' : null);

// ─── Renderizado de nodos ─────────────────────────────────────────────────────

export const nodeSel = nodeLayer.selectAll('g.node')
  .data(nodes)
  .join('g')
  .attr('class', 'node')
  .attr('data-id', d => d.id)
  .call(
    d3.drag()
      .on('start', (e, d) => { if(isTreeMode()) return; if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag',  (e, d) => { if(isTreeMode()) return; d.fx = e.x; d.fy = e.y; })
      .on('end',   (e, d) => { if(isTreeMode()) return; if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
  );

// — GIAR —
const giarSel = nodeSel.filter(d => d.type === 'giar');

giarSel.append('circle')
  .attr('r', d => d.radius)
  .attr('fill', d => d.color)
  .attr('fill-opacity', 0.12);

giarSel.append('circle')
  .attr('r', d => d.radius)
  .attr('fill', 'none')
  .attr('stroke', d => d.color)
  .attr('stroke-opacity', 0.6)
  .attr('stroke-width', 1.5)
  .attr('stroke-dasharray', '4 5');

giarSel.append('text')
  .attr('class', 'giar-label')
  .attr('y', 7)
  .attr('fill', d => d.color)
  .text(d => d.nombre);

// — Proyectos —
const projectSel = nodeSel.filter(d => d.type === 'project');

projectSel.append('circle')
  .attr('r', d => d.radius)
  .attr('fill', d => d.color)
  .attr('fill-opacity', 0.10);

projectSel.append('circle')
  .attr('r', d => d.radius)
  .attr('fill', 'none')
  .attr('stroke', d => d.color)
  .attr('stroke-opacity', 0.55)
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '2 4');

projectSel.append('circle')
  .attr('r', 2.5)
  .attr('fill', d => d.color)
  .attr('fill-opacity', 0.8);

projectSel.append('text')
  .attr('class', 'project-label')
  .attr('y', d => -(d.radius + 8))
  .attr('font-size', 16)
  .attr('fill', d => d.color)
  .text(d => d.nombre);

// — Subproyectos —
const subprojectSel = nodeSel.filter(d => d.type === 'subproject');

subprojectSel.append('circle')
  .attr('r', d => d.radius)
  .attr('fill', d => d.color)
  .attr('fill-opacity', 0.08);

subprojectSel.append('circle')
  .attr('r', d => d.radius)
  .attr('fill', 'none')
  .attr('stroke', d => d.color)
  .attr('stroke-opacity', 0.45)
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '2 3');

subprojectSel.append('text')
  .attr('class', 'project-label')
  .attr('y', d => -(d.radius + 6))
  .attr('font-size', 13)
  .attr('fill', d => d.color)
  .text(d => d.nombre);

// — Personas —
const personSel = nodeSel.filter(d => d.type === 'person');

personSel.append('circle')
  .attr('class', 'node-image-circle')
  .attr('r', 25)
  .attr('fill', 'var(--bg-deep)')
  .attr('stroke', d => nodeMap[d.pertenece[0]?.id]?.color ?? '#888')
  .attr('stroke-width',   d => ROLE_STROKE[bestRole(d.pertenece)])
  .attr('stroke-opacity', d => bestRole(d.pertenece) === 'Oyente' ? 0.45 : 0.85)
  .attr('stroke-dasharray', d => bestRole(d.pertenece) === 'Oyente' ? '3 3' : null);

personSel.append('image')
  .attr('href', d => `img/${d.id}.jpg`)
  .attr('x', -23).attr('y', -23)
  .attr('width', 46).attr('height', 46)
  .attr('clip-path', d => `url(#clip-${d.id})`)
  .attr('preserveAspectRatio', 'xMidYMid slice')
  .each(function(d) {
    const el = this;
    el.onerror = function() {
      el.onerror = function() {
        el.onerror = function() {
          el.setAttribute('href', 'img/placeholder.png');
          el.onerror = null;
        };
        el.setAttribute('href', `img/${d.id}.jpeg`);
      };
      el.setAttribute('href', `img/${d.id}.png`);
    };
  });

personSel.append('circle')
  .attr('r', 23)
  .attr('fill', 'none')
  .attr('stroke', '#000')
  .attr('stroke-opacity', 0.25)
  .attr('stroke-width', 0.5);

personSel.append('text')
  .attr('class', 'node-label')
  .attr('y', 41)
  .text(d => d.nombre);

personSel.append('text')
  .attr('class', 'node-label node-label-last')
  .attr('y', 55)
  .text(d => d.apellido);

// ─── Hover ────────────────────────────────────────────────────────────────────

nodeSel.on('mouseenter', function (event, d) {
  if (_clickSelected !== null) return; // hay selección fija activa, no pisar
  const related = new Set([d.id]);
  links.forEach(l => {
    const s = l.source.id ?? l.source;
    const t = l.target.id ?? l.target;
    if (s === d.id) related.add(t);
    if (t === d.id) related.add(s);
  });
  _applyHighlight(related, d.id);
  if (d.type === 'person') {
    d3.select(this).select('.node-image-circle').attr('r', 28);
  }
});

nodeSel.on('mouseleave', function (event, d) {
  if (_clickSelected !== null) return; // mantener la selección fija
  _clearHighlight();
  if (d.type === 'person') {
    d3.select(this).select('.node-image-circle')
      .attr('r', 25)
      .attr('stroke-width', ROLE_STROKE[bestRole(d.pertenece)]);
  }
});

// ─── Tick ─────────────────────────────────────────────────────────────────────

simulation.on('tick', () => {
  linkSel
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);
  nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
});

// ─── Resize ───────────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  width  = container.clientWidth;
  height = container.clientHeight;
  svg.attr('viewBox', [0, 0, width, height]);
  simulation.force('center', d3.forceCenter(width / 2, height / 2).strength(0.05));
  simulation.alpha(0.3).restart();
});

// ─── API pública ──────────────────────────────────────────────────────────────

// Nodo actualmente fijado por click (null = sin selección)
let _clickSelected = null;

// Retorna el conjunto de IDs del nodo dado + todos sus descendentes
// (jerarquía hacia abajo) + las personas conectadas por membresía a esos nodos
function _getDescendants(startId) {
  const result = new Set([startId]);
  const queue  = [startId];
  while (queue.length > 0) {
    const curr = queue.shift();
    links.forEach(l => {
      const s = l.source.id ?? l.source;
      const t = l.target.id ?? l.target;
      if (l.kind === 'hierarchy' && s === curr && !result.has(t)) {
        result.add(t);
        queue.push(t);
      }
    });
  }
  // Personas cuyo grupo de membresía está en el conjunto
  links.forEach(l => {
    if (l.kind !== 'membership') return;
    const s = l.source.id ?? l.source;
    const t = l.target.id ?? l.target;
    if (result.has(t)) result.add(s);
  });
  return result;
}

// Resalta todos los nodos en relatedIds y los enlaces internos al conjunto
function _applyDescendantHighlight(relatedIds) {
  nodeSel.classed('dimmed', n => !relatedIds.has(n.id));
  linkSel
    .classed('dimmed', l => {
      const s = l.source.id ?? l.source;
      const t = l.target.id ?? l.target;
      return !relatedIds.has(s) || !relatedIds.has(t);
    })
    .attr('stroke-width', l => {
      const s = l.source.id ?? l.source;
      const t = l.target.id ?? l.target;
      const active = relatedIds.has(s) && relatedIds.has(t);
      return active ? (l.kind === 'hierarchy' ? 2.5 : 1.5) : (l.kind === 'hierarchy' ? 1.5 : 0.8);
    })
    .attr('stroke-opacity', l => {
      const s = l.source.id ?? l.source;
      const t = l.target.id ?? l.target;
      const active = relatedIds.has(s) && relatedIds.has(t);
      return active ? (l.kind === 'hierarchy' ? 0.9 : 0.75) : (l.kind === 'hierarchy' ? 0.48 : 0.28);
    });
}

// relatedIds: nodos a resaltar; primaryId: nodo origen del hover/click
// Los links solo se resaltan si el nodo primario es uno de sus extremos
function _applyHighlight(relatedIds, primaryId) {
  nodeSel.classed('dimmed', n => !relatedIds.has(n.id));
  linkSel
    .classed('dimmed', l => {
      const s = l.source.id ?? l.source;
      const t = l.target.id ?? l.target;
      return s !== primaryId && t !== primaryId;
    })
    .attr('stroke-width', l => {
      const s = l.source.id ?? l.source;
      const t = l.target.id ?? l.target;
      const active = s === primaryId || t === primaryId;
      return active ? (l.kind === 'hierarchy' ? 2.5 : 1.5) : (l.kind === 'hierarchy' ? 1.5 : 0.8);
    })
    .attr('stroke-opacity', l => {
      const s = l.source.id ?? l.source;
      const t = l.target.id ?? l.target;
      const active = s === primaryId || t === primaryId;
      return active ? (l.kind === 'hierarchy' ? 0.9 : 0.75) : (l.kind === 'hierarchy' ? 0.48 : 0.28);
    });
}

function _clearHighlight() {
  nodeSel.classed('dimmed', false);
  linkSel
    .classed('dimmed', false)
    .attr('stroke-width',   d => d.kind === 'hierarchy' ? 1.5 : 0.8)
    .attr('stroke-opacity', d => d.kind === 'hierarchy' ? 0.48 : 0.28);
}

export function highlight(relatedIds, primaryId) { _applyHighlight(relatedIds, primaryId); }
export function clearHighlight() { _clearHighlight(); }

// Click-highlight: selecciona un nodo y resalta sus descendentes.
// Si se vuelve a llamar con el mismo id, deselecciona.
export function setClickHighlight(nodeId) {
  if (_clickSelected === nodeId) {
    _clickSelected = null;
    _clearHighlight();
    return;
  }
  _clickSelected = nodeId;
  _applyDescendantHighlight(_getDescendants(nodeId));
}

export function clearClickHighlight() {
  if (_clickSelected === null) return;
  _clickSelected = null;
  _clearHighlight();
}

export function onNodeClick(fn) {
  nodeSel.on('click', (event, d) => { event.stopPropagation(); fn(d); });
}
