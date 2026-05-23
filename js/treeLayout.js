/**
 * treeLayout.js — Vista de árbol descendente
 *
 * Alterna entre el modo de fuerzas libre y un árbol jerárquico top-down
 * donde cada persona aparece bajo su subproyecto de mayor rol.
 *
 * Las personas con múltiples membresías se posicionan en el nodo donde
 * tienen el rol de mayor jerarquía (Director > Co-Director > Líder > Integrante > Oyente).
 *
 * Exportaciones:
 *   isTreeMode()      — boolean, estado actual
 *   applyTreeLayout() — activa el árbol con animación
 *   clearTreeLayout() — vuelve al modo libre con animación
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { DATA } from "./data.js";
import { nodes, simulation, svg, nodeSel, linkSel, zoomBehavior, ROLE_RANK } from "./graph.js";

// ─── Etiquetas y colores por rol ──────────────────────────────────────────────

const ROLE_LABEL = {
  'Director':              'Director',
  'Co-Director':           'Co-Director',
  'Lider de Proyecto':     'Líder',
  'Lider de Sub-Proyecto': 'Líder',
  'Integrante':            'Integrante',
  'Oyente':                'Oyente',
};

const ROLE_COLOR = {
  'Director':              '#d4a574',
  'Co-Director':           '#d97757',
  'Lider de Proyecto':     '#a8809b',
  'Lider de Sub-Proyecto': '#8a9a7b',
  'Integrante':            '#7a96a4',
  'Oyente':                '#6f5f4e',
};

// ─── Estado ───────────────────────────────────────────────────────────────────

let _isTree = false;
export const isTreeMode = () => _isTree;

// ─── Construcción de la jerarquía ─────────────────────────────────────────────

function _primaryMembership(persona) {
  return persona.pertenece.reduce((best, m) => {
    const rank = ROLE_RANK[m.rol] ?? 4;
    const bestRank = best ? (ROLE_RANK[best.rol] ?? 4) : Infinity;
    return rank < bestRank ? m : best;
  }, null);
}

function _buildTree() {
  // Asignar cada persona al nodo de su mejor rol
  const assignment = new Map(); // personId → { id: nodeId, rol }
  DATA.personas.forEach(p => {
    const primary = _primaryMembership(p);
    if (primary) assignment.set(p.id, primary);
  });

  const personsOf = nodeId =>
    DATA.personas
      .filter(p => assignment.get(p.id)?.id === nodeId)
      .sort((a, b) =>
        (ROLE_RANK[assignment.get(a.id)?.rol] ?? 4) -
        (ROLE_RANK[assignment.get(b.id)?.rol] ?? 4)
      )
      .map(p => ({ id: p.id, assignment: assignment.get(p.id) }));

  return {
    id: 'giar',
    children: [
      ...personsOf('giar'),
      ...DATA.proyectos.map(proj => ({
        id: proj.id,
        children: [
          ...personsOf(proj.id),
          ...(proj.subproyectos ?? []).map(sp => ({
            id: sp.id,
            children: personsOf(sp.id),
          })),
        ],
      })),
    ],
  };
}

// ─── API pública ──────────────────────────────────────────────────────────────

export function applyTreeLayout() {
  _isTree = true;

  const container = document.querySelector('main');
  const W = container.clientWidth;
  const H = container.clientHeight;

  const root = d3.hierarchy(_buildTree());

  // Ancho mínimo por hoja: evita solapamiento horizontal sin importar cuántos nodos haya
  const numLeaves = root.leaves().length;
  const treeW = Math.max(W * 0.86, numLeaves * 68);
  const treeH = H * 0.76;

  d3.tree()
    .size([treeW, treeH])
    .separation((a, b) => a.parent === b.parent ? 1 : 1.4)
    (root);

  // Centra el árbol; si treeW > W el zoom-to-fit lo encuadrará
  const offsetX = (W - treeW) / 2;
  const offsetY = H * 0.09;

  const posMap    = new Map(); // nodeId → {x, y}
  const assignMap = new Map(); // personId → {id, rol}

  root.each(n => {
    posMap.set(n.data.id, { x: n.x + offsetX, y: n.y + offsetY });
    if (n.data.assignment) assignMap.set(n.data.id, n.data.assignment);
  });

  // Y de la capa más profunda (integrantes/oyentes sin ajuste)
  const depthY = new Map();
  root.each(n => { if (!depthY.has(n.depth)) depthY.set(n.depth, posMap.get(n.data.id).y); });
  const leafY = depthY.get(Math.max(...depthY.keys()));

  // Ajuste vertical por rol + fix de colisión horizontal para Dir/Co-Dir
  assignMap.forEach((assignment, personId) => {
    const parentPos = posMap.get(assignment.id);
    const personPos = posMap.get(personId);
    if (!parentPos || !personPos) return;

    if (assignment.rol === 'Director' || assignment.rol === 'Co-Director') {
      personPos.y = parentPos.y;
      // Si d3.tree() colocó a la persona en el mismo X que su padre
      // (ocurre cuando el nodo tiene un único hijo), desplazarla horizontalmente
      const parentRadius = nodes.find(n => n.id === assignment.id)?.radius ?? 34;
      const minH = parentRadius + 26 + 18;
      if (Math.abs(personPos.x - parentPos.x) < minH) {
        personPos.x = parentPos.x + (personPos.x >= parentPos.x ? minH : -minH);
      }
    } else if (assignment.rol === 'Lider de Sub-Proyecto' || assignment.rol === 'Lider de Proyecto') {
      personPos.y = parentPos.y + (leafY - parentPos.y) * 0.42;
    }
    // Integrante y Oyente permanecen en la posición calculada por d3.tree()
  });

  // Zoom-to-fit: encuadra todo el árbol en pantalla sea cual sea su tamaño
  const PAD = 75;
  let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
  posMap.forEach(pos => {
    bx0 = Math.min(bx0, pos.x - 74); bx1 = Math.max(bx1, pos.x + 74);
    by0 = Math.min(by0, pos.y - 74); by1 = Math.max(by1, pos.y + 74);
  });
  const bw = bx1 - bx0, bh = by1 - by0;
  const scale = Math.min((W - PAD * 2) / bw, (H - PAD * 2) / bh);
  const tx = (W - bw * scale) / 2 - bx0 * scale;
  const ty = (H - bh * scale) / 2 - by0 * scale;

  // Fijar posiciones y parar la simulación
  simulation.stop();
  nodes.forEach(n => {
    const pos = posMap.get(n.id);
    if (pos) { n.x = pos.x; n.y = pos.y; n.fx = pos.x; n.fy = pos.y; }
  });

  const t = d3.transition().duration(750).ease(d3.easeCubicInOut);

  nodeSel.transition(t)
    .attr('transform', d => `translate(${d.x},${d.y})`);

  linkSel.transition(t)
    .attr('x1', l => l.source.x).attr('y1', l => l.source.y)
    .attr('x2', l => l.target.x).attr('y2', l => l.target.y)
    .attr('stroke-opacity', l => l.kind === 'hierarchy' ? 0.7 : 0.05)
    .attr('stroke-width',   l => l.kind === 'hierarchy' ? 2   : 0.8);

  svg.transition(t).call(zoomBehavior.transform,
    d3.zoomIdentity.translate(tx, ty).scale(scale));

  _showRoleBadges(assignMap, 680);
}

export function clearTreeLayout() {
  _isTree = false;

  // Ocultar y eliminar badges
  d3.selectAll('.role-badge')
    .transition().duration(250)
    .attr('opacity', 0)
    .remove();

  // Liberar nodos
  nodes.forEach(n => { n.fx = null; n.fy = null; });

  // Restaurar estilos de los enlaces
  linkSel.transition().duration(600)
    .attr('stroke-opacity', l => l.kind === 'hierarchy' ? 0.48 : 0.28)
    .attr('stroke-width',   l => l.kind === 'hierarchy' ? 1.5  : 0.8);

  simulation.alpha(0.6).restart();
}

// ─── Badges de rol ────────────────────────────────────────────────────────────

function _showRoleBadges(assignMap, delay) {
  nodeSel
    .filter(d => d.type === 'person' && assignMap.has(d.id))
    .each(function(d) {
      const { rol } = assignMap.get(d.id);
      const g = d3.select(this);

      // Eliminar badge anterior si existe
      g.select('.role-badge').remove();

      const label = ROLE_LABEL[rol] ?? rol;
      const color = ROLE_COLOR[rol] ?? '#888';
      const pw = Math.max(label.length * 5.8 + 14, 44);

      const badge = g.append('g')
        .attr('class', 'role-badge')
        .attr('transform', 'translate(0,70)')
        .attr('opacity', 0);

      // Fondo del badge
      badge.append('rect')
        .attr('x', -pw / 2).attr('y', 0)
        .attr('width', pw).attr('height', 15)
        .attr('rx', 2)
        .attr('fill', color).attr('fill-opacity', 0.18)
        .attr('stroke', color).attr('stroke-opacity', 0.55).attr('stroke-width', 0.5);

      // Texto del badge
      badge.append('text')
        .attr('x', 0).attr('y', 11)
        .attr('class', 'role-badge-text')
        .attr('text-anchor', 'middle')
        .attr('fill', color)
        .text(label);

      badge.transition().delay(delay).duration(350).attr('opacity', 1);
    });
}
