/**
 * panel.js — Panel de detalle lateral
 *
 * Tipos de nodo soportados: 'giar' | 'project' | 'subproject' | 'person'
 * La metadata de proyectos/subproyectos se muestra como "*clave*: valor".
 * Al clickear una persona se muestra su foto.
 */

import { DATA } from "./data.js";
import { nodeMap } from "./graph.js";

const panel        = document.getElementById('panel');
const panelContent = document.getElementById('panel-content');

panel.addEventListener('click', e => e.stopPropagation());

export function showPanel(d) {
  panelContent.innerHTML = _html(d);
  panel.classList.add('visible');
  panel.scrollTop = 0;
  const photoImg = panelContent.querySelector('.panel-photo img[data-person-id]');
  if (photoImg) {
    const pid = photoImg.dataset.personId;
    photoImg.onerror = function() {
      this.onerror = function() {
        this.onerror = function() {
          this.src = 'img/placeholder.png';
          this.onerror = null;
        };
        this.src = `img/${pid}.jpeg`;
      };
      this.src = `img/${pid}.png`;
    };
  }
}

export function hidePanel() {
  panel.classList.remove('visible');
}

// ─── Despacho por tipo ────────────────────────────────────────────────────────

function _html(d) {
  if (d.type === 'person')     return _personHTML(d);
  if (d.type === 'giar')       return _giarHTML(d);
  if (d.type === 'project')    return _projectHTML(d);
  if (d.type === 'subproject') return _subprojectHTML(d);
  return '';
}

// ─── Helper: bloque de metadata ───────────────────────────────────────────────

function _metaHTML(meta) {
  if (!meta || Object.keys(meta).length === 0) return '';
  return `
    <div class="panel-meta">
      ${Object.entries(meta).map(([k, v]) =>
        `<div class="panel-meta-item"><em>${k}</em>: ${v}</div>`
      ).join('')}
    </div>
  `;
}

// ─── Helper: lista de nodos con dot de color ──────────────────────────────────

function _dotList(items) {
  return `
    <div class="panel-projects">
      ${items.map(({ color, label, role }) => `
        <div class="panel-project">
          <div class="panel-project-dot" style="background:${color}"></div>
          <div class="panel-project-info">
            <span>${label}</span>
            ${role ? `<div class="panel-project-role">${role}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ─── Plantillas por tipo ──────────────────────────────────────────────────────

const _linkedinIcon = `<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

function _personHTML(d) {
  const memberships = (d.pertenece ?? [])
    .map(m => ({ node: nodeMap[m.id], rol: m.rol }))
    .filter(m => m.node);
  return `
    <div class="panel-eyebrow">Integrante</div>
    <div class="panel-photo"><img src="img/${d.id}.jpg" data-person-id="${d.id}" alt="${d.nombre} ${d.apellido}"></div>
    <div class="panel-name">${d.nombre} <em>${d.apellido}</em></div>
    <div class="panel-role">${d.rol || ''}</div>
    ${_metaHTML(d.meta)}
    ${d.linkedin ? `
      <a class="panel-linkedin" href="${d.linkedin}" target="_blank" rel="noopener noreferrer">
        ${_linkedinIcon} Ver perfil
      </a>
    ` : ''}
    ${memberships.length ? `
      <div class="panel-divider"></div>
      <div class="panel-eyebrow" style="margin-bottom:0.7rem">Pertenece a</div>
      ${_dotList(memberships.map(m => ({ color: m.node.color, label: m.node.nombre, role: m.rol })))}
    ` : ''}
  `;
}

function _giarHTML(d) {
  const direct = DATA.personas.filter(p => p.pertenece.some(m => m.id === 'giar'));
  return `
    <div class="panel-eyebrow">Organización</div>
    <div class="panel-name" style="color:${d.color}"><em>${d.nombre}</em></div>
    ${_metaHTML(d.meta)}
    <div class="panel-divider"></div>
    <div class="panel-eyebrow" style="margin-bottom:0.7rem">Proyectos</div>
    ${_dotList(DATA.proyectos.map(p => ({ color: nodeMap[p.id]?.color ?? '#888', label: p.nombre })))}
    ${direct.length ? `
      <div class="panel-divider"></div>
      <div class="panel-eyebrow" style="margin-bottom:0.7rem">Integrantes directos</div>
      ${_dotList(direct.map(p => ({
        color: d.color,
        label: `${p.nombre} ${p.apellido}`,
        role: p.pertenece.find(m => m.id === 'giar')?.rol,
      })))}
    ` : ''}
  `;
}

function _projectHTML(d) {
  const proj = DATA.proyectos.find(p => p.id === d.id);
  const subs  = proj?.subproyectos ?? [];
  const direct = DATA.personas.filter(p => p.pertenece.some(m => m.id === d.id));
  return `
    <div class="panel-eyebrow">Proyecto</div>
    <div class="panel-name" style="color:${d.color}"><em>${d.nombre}</em></div>
    ${_metaHTML(d.meta)}
    ${subs.length ? `
      <div class="panel-divider"></div>
      <div class="panel-eyebrow" style="margin-bottom:0.7rem">Subproyectos</div>
      ${_dotList(subs.map(sp => ({ color: nodeMap[sp.id]?.color ?? '#888', label: sp.nombre })))}
    ` : ''}
    ${direct.length ? `
      <div class="panel-divider"></div>
      <div class="panel-eyebrow" style="margin-bottom:0.7rem">Integrantes directos</div>
      ${_dotList(direct.map(p => ({
        color: d.color,
        label: `${p.nombre} ${p.apellido}`,
        role: p.pertenece.find(m => m.id === d.id)?.rol,
      })))}
    ` : ''}
  `;
}

function _subprojectHTML(d) {
  const members = DATA.personas.filter(p => p.pertenece.some(m => m.id === d.id));
  return `
    <div class="panel-eyebrow">Subproyecto</div>
    <div class="panel-name" style="color:${d.color}"><em>${d.nombre}</em></div>
    ${_metaHTML(d.meta)}
    ${members.length ? `
      <div class="panel-divider"></div>
      <div class="panel-eyebrow" style="margin-bottom:0.7rem">Equipo · ${members.length} integrante${members.length === 1 ? '' : 's'}</div>
      ${_dotList(members.map(p => ({
        color: d.color,
        label: `${p.nombre} ${p.apellido}`,
        role: p.pertenece.find(m => m.id === d.id)?.rol,
      })))}
    ` : ''}
  `;
}
