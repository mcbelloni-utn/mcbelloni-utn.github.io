/**
 * legend.js — Leyenda jerárquica (GIAR → proyectos → subproyectos)
 *
 * Cada ítem tiene hover (highlight) y click (panel de detalle).
 * Los niveles se muestran con indentación progresiva.
 */

import { DATA }                          from "./data.js";
import { nodes, nodeMap, highlight, clearHighlight } from "./graph.js";
import { showPanel }                     from "./panel.js";

export function buildLegend() {
  const container = document.getElementById('legend-items');

  // GIAR — cuenta todos los integrantes del árbol
  const giarNode = nodes.find(n => n.id === 'giar');
  if (giarNode) {
    _addItem(container, giarNode, _subtreeSize('giar'), 0);
  }

  // Proyectos y sus subproyectos
  DATA.proyectos.forEach(proj => {
    const projNode = nodeMap[proj.id];
    if (!projNode) return;

    _addItem(container, projNode, _subtreeSize(proj.id), 1);

    (proj.subproyectos ?? []).forEach(sp => {
      const spNode = nodeMap[sp.id];
      if (!spNode) return;
      _addItem(container, spNode, _subtreeSize(sp.id), 2);
    });
  });
}

// Devuelve el Set de todos los nodeIds que forman el subárbol de nodeId
function _subtreeNodeIds(nodeId) {
  const ids = new Set([nodeId]);
  if (nodeId === 'giar') {
    DATA.proyectos.forEach(p => {
      ids.add(p.id);
      (p.subproyectos ?? []).forEach(sp => ids.add(sp.id));
    });
  } else {
    const proj = DATA.proyectos.find(p => p.id === nodeId);
    if (proj) (proj.subproyectos ?? []).forEach(sp => ids.add(sp.id));
  }
  return ids;
}

// Cuenta personas únicas cuyo pertenece intersecta con el subárbol
function _subtreeSize(nodeId) {
  const subtree = _subtreeNodeIds(nodeId);
  const members = new Set();
  DATA.personas.forEach(p => {
    if (p.pertenece.some(m => subtree.has(m.id))) members.add(p.id);
  });
  return members.size;
}

function _addItem(container, nodeData, count, level) {
  const item = document.createElement('div');
  item.className = `legend-item legend-item--l${level}`;

  const dotSize  = level === 2 ? '5px' : '7px';
  const fontSize = level === 0 ? '1rem' : level === 1 ? '0.95rem' : '0.82rem';

  item.innerHTML = `
    <div class="legend-dot" style="background:${nodeData.color};width:${dotSize};height:${dotSize}"></div>
    <div class="legend-name" style="font-size:${fontSize}">${nodeData.nombre}</div>
    <div class="legend-count">${String(count).padStart(2, '0')}</div>
  `;

  item.addEventListener('mouseenter', () => highlight(_getRelated(nodeData), nodeData.id));
  item.addEventListener('mouseleave', () => clearHighlight());

  // El panel recibe el nodo completo (con type, color, meta, etc.)
  item.addEventListener('click', () => showPanel(nodeData));

  container.appendChild(item);
}

// Solo conexiones de primer orden del nodo (misma lógica que el hover del grafo)
function _getRelated(nodeData) {
  const related = new Set([nodeData.id]);

  if (nodeData.type === 'giar') {
    DATA.proyectos.forEach(p => related.add(p.id));
    DATA.personas.forEach(p => { if (p.pertenece.some(m => m.id === 'giar')) related.add(p.id); });
    return related;
  }

  if (nodeData.type === 'project') {
    related.add('giar');
    const proj = DATA.proyectos.find(p => p.id === nodeData.id);
    (proj?.subproyectos ?? []).forEach(sp => related.add(sp.id));
    DATA.personas.forEach(p => { if (p.pertenece.some(m => m.id === nodeData.id)) related.add(p.id); });
    return related;
  }

  if (nodeData.type === 'subproject') {
    if (nodeData.parentId) related.add(nodeData.parentId);
    DATA.personas.forEach(p => { if (p.pertenece.some(m => m.id === nodeData.id)) related.add(p.id); });
    return related;
  }

  return related;
}
