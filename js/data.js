/**
 * data.js — Fuente de verdad del organigrama
 *
 * Estructura de 3 jerarquías:
 *   GIAR → proyectos → subproyectos → personas
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
  giar: {
    id:     'giar',
    nombre: 'GIAR',
    color:  '#0E68D8',
    meta: {
      'Institución': 'UTN.BA',
      'Grupo':        'Inteligencia Artificial y Robótica',
    },
  },

  // ── Proyectos (con subproyectos opcionales) ────────────────────────────────
  proyectos: [
    {
      id:     'nanosats',
      nombre: 'Nanosatélites',
      color:  'var(--c-amber)',
      meta: {
        'Título del proyecto': 'Diseño e implementación del sistema de una computadora de a bordo destinada a nanosatélites',
        'Código': 'BACCEC748',
        'Categoría': 'Electrónica, Computación y Comunicaciones',
        'Año de inicio': '2026',
        'Año de finalización': '2029',
      },
      subproyectos: [
        {
          id:     'HW',
          nombre: 'Hardware',
          color:  'var(--c-coral)',
          meta:   { 'Objetivo': 'Diseño, implementación y validación del circuito impreso de la OBC' },
        },
        {
          id:     'SW',
          nombre: 'Flight Software',
          color:  'var(--c-sage)',
          meta:   { 'Objetivo': 'Migración de cFS al micro seleccionado' },
        },
        {
          id:     'payload',
          nombre: 'Dosimeter Payload',
          color:  'var(--c-olive)',
          meta:   {
            'Objetivo': 'Diseño, implementación y validación de una carga útil basada en dosimetría gamma y detección de SEUs',
            'Colaboración': 'FiUBA'
          },
        },
        {
          id:     'rf',
          nombre: 'RF',
          color:  'var(--c-plum)',
          meta:   { 'Objetivo': 'Sin definir.' },
        },
        {
          id:     'concurso',
          nombre: 'CubeDesign',
          color:  'var(--c-amber)',
          meta:   { 'Objetivo': 'Ganar concurso CubeDesign y capacitar a los estudiantes involucrados en sistemas aeroespaciales' },
        },
        {
          id:     'antartida',
          nombre: 'Antártida',
          color:  'var(--c-steel)',
          meta:   {
            'Objetivo': 'Desarrollo de sistema autónomo para la captura y transmisión de datos científicos de mediante LoRaWAN',
            'Colaboración': 'Instituto Antártico Argentino (IAA)'
          },
        },
      ],
    },
  ],

  // ── Personas ───────────────────────────────────────────────────────────────
  personas: [
    // — Inactivos ─────────────────────────────────────────────────────────────
    {
      id: 'p1', nombre: 'Matias', apellido: 'Hampel',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'PhD', 'Año de incorporación': '2023' },
      pertenece: [{ id: 'nanosats', rol: 'Oyente' }],
    },
    {
      id: 'p2', nombre: 'Agustin', apellido: 'Diaz Antuña',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Ingeniero/Grado', 'Año de incorporación': '2024' },
      pertenece: [{ id: 'nanosats', rol: 'Oyente' }],
    },
    {
      id: 'p3', nombre: 'Juan', apellido: 'Alarcón',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/juan-alarc%C3%B3n-aa553612a/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Ingeniero/Grado', 'Año de incorporación': '2023' },
      pertenece: [{ id: 'nanosats', rol: 'Co-Director' }],
    },
    {
      id: 'p4', nombre: 'Lucio', apellido: 'Colautti',
      rol: 'Mecánica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Mecánica', 'Nivel': 'Tesista Grado', 'Año de incorporación': '2025' },
      pertenece: [{ id: 'nanosats', rol: 'Oyente' }],
    },
    {
      id: 'p5', nombre: 'Manuel Elias', apellido: 'Garcia Redondo',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'PhD', 'Año de incorporación': '2023' },
      pertenece: [{ id: 'nanosats', rol: 'Oyente' }],
    },
    {
      id: 'p6', nombre: 'Felipe', apellido: 'Nirino',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Ingeniero/Grado', 'Año de incorporación': '2023' },
      pertenece: [{ id: 'nanosats', rol: 'Oyente' }],
    },
    {
      id: 'p7', nombre: 'Joaquin', apellido: 'Cibeira',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Tesista Grado', 'Año de incorporación': '2024' },
      pertenece: [{ id: 'nanosats', rol: 'Oyente' }],
    },
    // — Concurso CubeDesign ────────────────────────────────────────────────────
    {
      id: 'p8', nombre: 'Uriel', apellido: 'Madias',
      rol: 'Mecánica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Mecánica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2025' },
      pertenece: [{ id: 'concurso', rol: 'Integrante' }],
    },
    {
      id: 'p9', nombre: 'Constanza', apellido: 'Bianco',
      rol: 'Sistemas',
      linkedin: 'https://www.linkedin.com/in/constanza-bianco-aa5980204/',
      meta: { 'Especialidad': 'Ing. Sistemas', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'concurso', rol: 'Integrante' }],
    },
    {
      id: 'p10', nombre: 'Ana', apellido: 'Luna Elizalde',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/ana-luna-elizalde',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'concurso', rol: 'Integrante' }],
    },
    {
      id: 'p11', nombre: 'Ramiro', apellido: 'Molina Gonzalez',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/ramiro-molina-gonzalez-b5767432b/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'concurso', rol: 'Integrante' }],
    },
    {
      id: 'p12', nombre: 'Jeanette Maricel', apellido: 'Molina Ramirez',
      rol: 'Industrial',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Industrial', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'concurso', rol: 'Lider de Sub-Proyecto' }],
    },
    {
      id: 'p13', nombre: 'Juan Manuel', apellido: 'Rodríguez Aguado',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'concurso', rol: 'Integrante' }],
    },
    {
      id: 'p14', nombre: 'Delfina', apellido: 'Bianco',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'concurso', rol: 'Integrante' }],
    },
    // — Dosímetro ─────────────────────────────────────────────────────────────
    {
      id: 'p15', nombre: 'Francisco', apellido: 'Dominguez',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/francisco-andr%C3%A9s-dominguez-89a65826b/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Ingeniero/Grado', 'Año de incorporación': '2024' },
      pertenece: [{ id: 'payload', rol: 'Integrante' }],
    },
    // — Gestión ───────────────────────────────────────────────────────────────
    {
      id: 'p16', nombre: 'Sebastian', apellido: 'Verrastro',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/sebastian-verrastro/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Master', 'Año de incorporación': '2023' },
      pertenece: [{ id: 'giar', rol: 'Director' }, { id: 'nanosats', rol: 'Director' }],
    },
    {
      id: 'p17', nombre: 'Facundo Daniel', apellido: 'Repetto',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/facundo-d-repetto/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Tesista Grado', 'Año de incorporación': '2025' },
      pertenece: [{ id: 'HW', rol: 'Lider de Sub-Proyecto' }],
    },
    {
      id: 'p18', nombre: 'Alessandro', apellido: 'Ghezzo',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/alessandro-ghezzo/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Tesista Grado', 'Año de incorporación': '2025' },
      pertenece: [{ id: 'rf', rol: 'Lider de Sub-Proyecto' }],
    },
    {
      id: 'p19', nombre: 'Lucas', apellido: 'Liaño',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/lucasliano/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Tesista Grado', 'Año de incorporación': '2023' },
      pertenece: [{ id: 'nanosats', rol: 'Co-Director' }],
    },
    {
      id: 'p20', nombre: 'Ezequiel', apellido: 'Maceda',
      rol: 'Sistemas',
      linkedin: 'https://www.linkedin.com/in/gabriel-ezequiel-maceda/',
      meta: { 'Especialidad': 'Ing. Sistemas', 'Nivel': 'Ingeniero/Grado', 'Año de incorporación': '2025' },
      pertenece: [{ id: 'SW', rol: 'Integrante' }],
    },
    // — Hardware ──────────────────────────────────────────────────────────────
    {
      id: 'p21', nombre: 'Federico', apellido: 'Albero',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/albero-federico/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'HW', rol: 'Integrante' }],
    },
    {
      id: 'p22', nombre: 'Manuel', apellido: 'Cortes',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/manuelcortess/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2025' },
      pertenece: [{ id: 'HW', rol: 'Integrante' }, { id: 'antartida', rol: 'Integrante' }],
    },
    {
      id: 'p23', nombre: 'Guido', apellido: 'Cucciniello',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'HW', rol: 'Integrante' }],
    },
    {
      id: 'p24', nombre: 'Fausto', apellido: 'Mongini',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/fausto-mongini-16a716157/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2025' },
      pertenece: [{ id: 'antartida', rol: 'Lider de Sub-Proyecto' }, { id: 'HW', rol: 'Integrante' }],
    },
    {
      id: 'p25', nombre: 'Geronimo', apellido: 'Santano',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'HW', rol: 'Integrante' }],
    },
    {
      id: 'p26', nombre: 'Lucas', apellido: 'Sasson',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/lucas-sasson-08bb14230/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2025' },
      pertenece: [{ id: 'HW', rol: 'Integrante' }],
    },
    {
      id: 'p27', nombre: 'Nicolas', apellido: 'Trombetta',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'HW', rol: 'Integrante' }],
    },
    // — RF ────────────────────────────────────────────────────────────────────
    {
      id: 'p28', nombre: 'Fernando', apellido: 'Fiamberti',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Master', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'rf', rol: 'Integrante' }],
    },
    {
      id: 'p29', nombre: 'Francisco', apellido: 'Sthal',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Ingeniero/Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'rf', rol: 'Integrante' }],
    },
    // — Software de Vuelo ─────────────────────────────────────────────────────
    {
      id: 'p30', nombre: 'Claudio', apellido: 'Grasso',
      rol: 'Otro',
      linkedin: 'https://www.linkedin.com/in/claudio-grasso-a211116/',
      meta: { 'Especialidad': 'Otro', 'Nivel': 'Ingeniero/Grado', 'Año de incorporación': '2025' },
      pertenece: [{ id: 'SW', rol: 'Integrante' }],
    },
    {
      id: 'p31', nombre: 'Pablo', apellido: 'Maiolo',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/pablo-maiolo-193622116/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Ingeniero/Grado', 'Año de incorporación': '2024' },
      pertenece: [{ id: 'SW', rol: 'Integrante' }],
    },
    {
      id: 'p32', nombre: 'Santiago Puebla', apellido: 'Paris',
      rol: 'Sistemas',
      linkedin: 'www.linkedin.com/in/santiago-paris-puebla',
      meta: { 'Especialidad': 'Ing. Sistemas', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'SW', rol: 'Integrante' }],
    },
    {
      id: 'p33', nombre: 'José Antonio', apellido: 'Quispealaya',
      rol: 'Sistemas',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Sistemas', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2023' },
      pertenece: [{ id: 'SW', rol: 'Integrante' }],
    },
    {
      id: 'p34', nombre: 'Aylen', apellido: 'Mendiolar Colombo',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/aylen-27-mc/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'antartida', rol: 'Integrante' }],
    },
    {
      id: 'p35', nombre: 'Matias', apellido: 'Armando Palma',
      rol: 'Electrónica',
      linkedin: 'http://www.linkedin.com/in/matias-armando-palma-870b2727b',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'antartida', rol: 'Integrante' }],
    },
    {
      id: 'p36', nombre: 'Valentin Anibal', apellido: 'Dorrego',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/valentin-anibal-dorrego-a881a523a/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante Grado', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'antartida', rol: 'Integrante' }],
    },
  ],
};
