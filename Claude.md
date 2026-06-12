# CLAUDE.md

## Objetivo General

Este proyecto corresponde a un sitio web informativo orientado a producción.

La referencia principal de diseño, estructura, experiencia visual y componentes es `index.html`.

Todas las páginas existentes y futuras deben mantener coherencia visual con respecto a dicha referencia.

Antes de realizar cambios, analiza completamente el repositorio para comprender la estructura actual, detectar inconsistencias y proponer mejoras alineadas con los objetivos descritos en este documento.

---

# Prioridades del Proyecto

Priorizar siempre en este orden:

1. Funcionalidad.
2. Estabilidad.
3. Rendimiento.
4. Coherencia visual.
5. Mantenibilidad.
6. SEO básico.

No sacrificar funcionalidad por efectos visuales.

No sacrificar rendimiento por animaciones innecesarias.

---

# Diseño y Experiencia de Usuario

## Fuente de verdad

`index.html` es la referencia principal.

Analiza:

* Colores.
* Tipografía.
* Espaciados.
* Bordes.
* Sombras.
* Componentes.
* Estructura visual.
* Comportamiento responsive.

Las demás páginas deben adaptarse a este sistema visual.

---

## Consistencia

Corregir:

* Componentes duplicados.
* Estilos inconsistentes.
* Tamaños de fuente incoherentes.
* Márgenes irregulares.
* Diferencias visuales entre páginas.

Crear una experiencia uniforme en todo el sitio.

---

# Responsive Design

El sitio debe ofrecer una experiencia consistente y profesional en todos los dispositivos y resoluciones.

## Dispositivos Objetivo

Verificar y adaptar el diseño para:

* Smartphones pequeños.
* Smartphones modernos.
* Tablets en orientación vertical y horizontal.
* Laptops.
* Monitores de escritorio.
* Pantallas grandes y ultrawide.

## Requisitos

* Priorizar una experiencia Mobile First.
* Evitar cualquier tipo de scroll horizontal.
* Mantener una navegación clara e intuitiva.
* Garantizar una correcta visualización del contenido en cualquier resolución.
* Mantener la coherencia visual respecto a `index.html`.
* Preservar la identidad visual y el branding existente.

## Correcciones Permitidas

Corregir cuando sea necesario:

* Elementos desalineados.
* Espaciados inconsistentes.
* Componentes que rompan el layout.
* Imágenes deformadas o desproporcionadas.
* Texto demasiado pequeño o difícil de leer.
* Botones difíciles de interactuar en dispositivos táctiles.
* Secciones con exceso o falta de espacio.
* Problemas de flexbox o grid.
* Componentes que se superpongan entre sí.

## Menú y Navegación

* Adaptar correctamente el menú para dispositivos móviles.
* Mantener accesibles todas las opciones de navegación.
* Garantizar una experiencia fluida tanto con mouse como con pantalla táctil.

## Contenido

* Mantener una jerarquía visual clara.
* Evitar líneas de texto excesivamente largas.
* Garantizar una correcta lectura en cualquier tamaño de pantalla.
* Adaptar imágenes, tarjetas y secciones informativas de manera proporcional.

## Restricciones

* No alterar el branding principal.
* No modificar colores o tipografías sin justificación.
* No eliminar contenido importante.
* No romper funcionalidades existentes.
* No realizar cambios visuales radicales únicamente por razones responsive.

## Resultado Esperado

El sitio debe verse profesional, moderno, ordenado y completamente funcional en cualquier dispositivo, manteniendo la misma identidad visual, coherencia de diseño y calidad de experiencia que la versión de escritorio.

---

# Optimización

## CSS

* Eliminar reglas duplicadas.
* Agrupar estilos repetidos.
* Reducir complejidad innecesaria.
* Mantener legibilidad.

## JavaScript

* Eliminar código muerto.
* Eliminar funciones sin uso.
* Reducir listeners innecesarios.
* Mantener código limpio y entendible.

## Recursos

Optimizar:

* Imágenes.
* SVG.
* Fuentes.
* Archivos CSS.
* Archivos JS.

Objetivo:

* Carga rápida.
* Bajo consumo de recursos.
* Excelente experiencia en dispositivos móviles.

---

# Estructura del Proyecto

Organizar carpetas cuando sea necesario.

Ejemplo deseado:

/
├── index.html
├── pages/
├── assets/
│ ├── images/
│ ├── icons/
│ └── logos/
├── css/
├── js/
└── articles/

Evitar archivos duplicados.

Evitar nombres ambiguos.

Mantener estructura clara y escalable.

---

# GitHub Pages

Este proyecto será desplegado inicialmente mediante GitHub Pages.

Por lo tanto:

## Obligatorio

Usar rutas relativas.

Ejemplo correcto:

./css/styles.css

../assets/logo.png

Ejemplo incorrecto:

C:/Users/...
D:/Proyectos/...
file:///...

Eliminar cualquier referencia exclusiva del entorno local.

Verificar que todo funcione correctamente desde GitHub Pages.

---

# Artículos

Analizar las páginas de artículos existentes.

Objetivos:

* Mantener coherencia visual.
* Mantener navegación consistente.
* Reutilizar componentes.
* Estandarizar encabezados.
* Estandarizar pies de página.
* Estandarizar formato de contenido.

Si faltan artículos o plantillas:

Crear estructuras reutilizables siguiendo el diseño principal del sitio.

---

# Formulario de Contacto

Implementar una solución funcional para recepción de correos.

Requisitos:

* Validación de campos.
* Retroalimentación visual al usuario.
* Mensajes de error claros.
* Confirmación de envío exitosa.
* Compatible con GitHub Pages.

Preferir soluciones sin backend propio cuando sea posible.

Ejemplos aceptables:

* EmailJS
* Formspree
* Web3Forms

---

# Diseño del Correo

Los correos recibidos deben tener una estructura profesional.

Incluir cuando sea posible:

* Logo de la empresa.
* Nombre del remitente.
* Correo electrónico.
* Teléfono.
* Asunto.
* Mensaje.

Mantener una apariencia profesional y fácil de leer.

---

# Accesibilidad

Verificar:

* Contraste adecuado.
* Etiquetas de formularios.
* Textos alternativos en imágenes.
* Navegación por teclado cuando aplique.

---

# SEO Básico

Verificar:

* title
* meta description
* favicon
* encabezados semánticos
* estructura HTML correcta

No implementar SEO avanzado salvo que sea necesario.

---

# Seguridad

No exponer:

* Claves privadas.
* Tokens.
* Secretos.
* Credenciales.

No almacenar información sensible en el frontend.

---

# Antes de Aplicar Cambios

Generar un análisis con:

1. Problemas detectados.
2. Cambios propuestos.
3. Impacto esperado.
4. Archivos afectados.

Esperar aprobación antes de realizar modificaciones masivas.

---

# Regla Final

Realizar cambios mínimos pero efectivos.

Priorizar calidad, estabilidad, rendimiento y coherencia visual sobre la cantidad de modificaciones.
