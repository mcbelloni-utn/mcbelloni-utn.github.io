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


// Carga datos desde Google Sheets usando la API de tu Web App de Google Apps Script
// URL de tu Web App de Google Apps Script
const URL_API = "https://script.google.com/macros/s/AKfycbzN-oFai6uJk5b4IKp1WkDfHSoUNgINkftWKMgOSOfco67vgqC3UWkjtIY7k0sf2rIPEQ/exec";

//let personas = [];

async function cargarDatosSheet() {
  try {
    const response = await fetch(URL_API);
    const personas = await response.json();
    
    // Aquí tienes los datos listos para usar en tu JS
    console.log("Datos cargados:", personas);
        
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }

  return personas;
}

cargarDatosSheet();


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

  personas : personas, // Cargados dinámicamente desde Google Sheets (ver función cargarDatosSheet() más arriba)

  /*
  // ── Personas ───────────────────────────────────────────────────────────────
  personas: [
     // — Gestión ───────────────────────────────────────────────────────────────
    {
      id: 'p1', nombre: 'Marcelo', apellido: 'Belloni',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/mcbelloni/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Esp.', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }, { id: 'rover', rol: 'Director' }, { id: 'labo', rol: 'Director' }],
    },
	{
      id: 'p2', nombre: 'Gonzalo', apellido: 'Ruiz',
      rol: 'Electrónica',
      linkedin: 'https://www.linkedin.com/in/gonzalo-javier-ruiz-8b7638b3/',
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Ing.', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }],
    },
	{
      id: 'p3', nombre: 'Jaqueline', apellido: 'Pineda',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Mecánica', 'Nivel': 'Estudiante', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }],
    },
	{
      id: 'p4', nombre: 'Pablo', apellido: 'Andura',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }],
    },
	{
      id: 'p5', nombre: 'Lisandro', apellido: 'Martinez',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }],
    },
	{
      id: 'p6', nombre: 'Franco', apellido: 'Lopez',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }],
    },
	{
      id: 'p7', nombre: 'Mikael', apellido: 'Ubieta',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Mecánica', 'Nivel': 'Estudiante', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }],
    },
	{
      id: 'p8', nombre: 'Pablo', apellido: 'Gómez',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }],
    },
	{
      id: 'p9', nombre: 'Valentina', apellido: 'Koutaras',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }],
    },
	{
      id: 'p10', nombre: 'Santiago', apellido: 'Sedoff',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }],
    },
	{
      id: 'p11', nombre: 'Máximo', apellido: 'Monelos Bournot',
      rol: 'Electrónica',
      linkedin: null,
      meta: { 'Especialidad': 'Ing. Electrónica', 'Nivel': 'Estudiante', 'Año de incorporación': '2026' },
      pertenece: [{ id: 'gestion', rol: 'Equipo Gestión' }],
    },
  ],*/
};
