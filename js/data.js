/**
 * data.js — Fuente de verdad del organigrama
 *
 * Estructura de 3 jerarquías:
 *   LABO → proyectos → subproyectos → personas
 *
 * Las personas pueden pertenecer a cualquier nivel via el campo `pertenece`.
 * Los proyectos y subproyectos aceptan un objeto `meta` con pares clave-valor
 * que se muestran en el panel de detalle como "*clave*: valor".
 *
 * ─── CAMPOS DE PERSONA ──────────────────────────────────────────────────────
 *   rol        — título / cargo mostrado en el panel
 *   linkedin   — URL al perfil de LinkedIn (null si no aplica)
 *   meta       — objeto clave-valor: Especialidad, Institución, etc.
 *   pertenece  — [{id, rol}] donde rol ∈ Director | Co-Director |
 *                Lider de Proyecto | Lider de Sub-Proyecto | Integrante | Oyente
 *
 * ─── COLORES DISPONIBLES ────────────────────────────────────────────────────
 *   var(--c-amber)  var(--c-coral)  var(--c-sage)
 *   var(--c-plum)   var(--c-olive)  var(--c-steel)
 *   O cualquier hex: '#e07b54'
 */

export const DATA = {

  // ── Nodo raíz ──────────────────────────────────────────────────────────────
  labo: {
    id:     'labo',
    nombre: 'Lab. Robótica',
    color:  '#0E68D8',
    meta: {
      'Institución': 'UTN.Avellaneda',
      'Grupo':        'Laboratorio de Robótica',
    },
  },

  // ── Proyectos (con subproyectos opcionales) ────────────────────────────────
  proyectos: [
    {
      id:     'gestion',
      nombre: 'Equipo de Gestión',
      color:  'var(--c-amber)',
      meta: {
        'Título del proyecto': 'Equipo de Gestión del Laboratorio',
        'Código': '---',
        'Categoría': 'Electrónica, Computación y Comunicaciones',
        'Año de inicio': '---',
        'Año de finalización': '---',
      },
	},
	{
      id:     'rover',
      nombre: 'TALOS (Rover Lunar)',
      color:  'var(--c-amber)',
      meta: {
        'Título del proyecto': 'Diseño e implementación de un rover lunar con IA embebida',
        'Código': '1047',
        'Categoría': 'Electrónica, Computación y Comunicaciones',
        'Año de inicio': '2027',
        'Año de finalización': '2030',
      },
      subproyectos: [
        {
          id:     'OBC',
          nombre: 'OBC',
          color:  'var(--c-coral)',
          meta:   { 'Objetivo': 'Diseño, implementación y validación de la IA y Navegación' },
        },
        {
          id:     'POT',
          nombre: 'Potencia',
          color:  'var(--c-sage)',
          meta:   { 'Objetivo': 'EPS' },
        },
        {
          id:     'CIEN',
          nombre: 'Ciencia',
          color:  'var(--c-sage)',
          meta:   { 'Objetivo': 'EPS' },
        },
        {
          id:     'ESTR',
          nombre: 'Diseño estructural',
          color:  'var(--c-olive)',
          meta:   {
            'Objetivo': 'Diseño estructural',
            'Colaboración': 'Dto. Ing. Mecánica',
          },
        },
        {
          id:     'LAB',
          nombre: 'Laboratorio Físico Químico',
          color:  'var(--c-plum)',
          meta:   {
			 'Objetivo': 'Sin definir.', 
			 'Colaboración': 'Dto. Ing. Química',
		  },
        },
      ],
    },
  ],

  // ── Personas ───────────────────────────────────────────────────────────────
  personas: [
     // — Gestión ───────────────────────────────────────────────────────────────
    {
      id: 'p1', nombre: 'Marcelo', apellido: 'Belloni',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/mcbelloni/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Esp.', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'labo', rol: 'Director' }, { id: 'rover', rol: 'Director' }],
    },
    // — Inactivos ─────────────────────────────────────────────────────────────
    {
      id: 'p20', nombre: 'Sapo', apellido: 'Pepe',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'PhD', 'Año de incorporación': '2023' },
      pertenece: [{ id: 'rover', rol: 'Oyente' }],
    },
  ],
};
