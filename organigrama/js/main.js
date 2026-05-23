/**
 * main.js — Punto de entrada de la aplicación
 *
 * Responsabilidades:
 *   • Importar e inicializar todos los módulos
 *   • Registrar el callback de click en nodos (wiring entre graph y panel)
 *   • Registrar el click global en el SVG para cerrar el panel
 *
 * Al agregar nuevas funcionalidades, este es el lugar donde conectarlas
 * con los módulos existentes.
 */

import { svg, onNodeClick, setClickHighlight, clearClickHighlight } from "./graph.js";
import { showPanel, hidePanel } from "./panel.js";
import { buildLegend } from "./legend.js";
import { applyTreeLayout, clearTreeLayout, isTreeMode } from "./treeLayout.js";

// Click en un nodo: abre el panel Y resalta sus descendentes
onNodeClick(d => {
  showPanel(d);
  setClickHighlight(d.id);
});

// Click en el fondo: cierra el panel Y limpia el highlight
svg.on('click', () => {
  hidePanel();
  clearClickHighlight();
});

// Botón cerrar panel (mobile)
document.getElementById('btn-panel-close').addEventListener('click', () => {
  hidePanel();
  clearClickHighlight();
});

// Texto del footer adaptado a dispositivos táctiles
if (window.matchMedia('(pointer: coarse)').matches) {
  document.querySelector('footer').innerHTML =
    'toca para ver detalles <span>·</span> pellizca para zoom';
}

// Construye la leyenda lateral
buildLegend();

// Toggle de vista árbol / libre
const btn     = document.getElementById('btn-tree');
const btnLabel = document.getElementById('btn-tree-label');
btn.addEventListener('click', () => {
  if (isTreeMode()) {
    clearTreeLayout();
    btn.classList.remove('active');
    btnLabel.textContent = 'Vista árbol';
  } else {
    applyTreeLayout();
    btn.classList.add('active');
    btnLabel.textContent = 'Vista libre';
  }
});

// Carga datos desde Google Sheets usando la API de tu Web App de Google Apps Script
// URL de tu Web App de Google Apps Script
const URL_API = "https://script.google.com/macros/s/AKfycbyvdbVkjqfBRvj6kv9kMVM7zOTPiJpVYb7ZJl73Fwyk7FN78Dvrn2c3HgAsG8QiqfCmng/exec";

async function cargarDatosSheet() {
  try {
    const response = await fetch(URL_API);
    const datos = await response.json();
    
    // Aquí tienes los datos listos para usar en tu JS
    console.log("Datos cargados:", datos);
    
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
}

cargarDatosSheet();