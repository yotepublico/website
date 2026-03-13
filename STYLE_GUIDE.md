# Guía de Estilos | AGENCIA YOTEPUBLICO

## Filosofía de Diseño

**Modernismo Corporativo Dinámico**: Equilibrio entre profesionalismo corporativo y energía dinámica que comunica movimiento y eficiencia.

---

## 🎨 Paleta de Colores

### Colores Corporativos Principales

```css
--primary: #E63946;      /* Rojo vibrante - Acción, urgencia */
--secondary: #FF8C42;    /* Naranja - Optimismo, creatividad */
--accent: #1F2937;       /* Gris oscuro - Profesionalismo */
--background: #FFFFFF;   /* Blanco - Claridad, confianza */
```

### Colores Semánticos

```css
--success: #10B981;      /* Verde - Éxito, confirmación */
--warning: #F59E0B;      /* Ámbar - Advertencia */
--error: #DC2626;        /* Rojo oscuro - Error, peligro */
--info: #3B82F6;         /* Azul - Información */
```

### Tema Oscuro

```css
--background: #000000;   /* Negro puro */
--foreground: #FFFFFF;   /* Blanco puro */
--card: #1F2937;         /* Gris oscuro */
```

### Tema Alto Contraste

```css
/* Blanco y Negro puro para máxima accesibilidad */
--primary: #000000;
--background: #FFFFFF;
```

---

## 📝 Tipografía

### Familias de Fuentes

| Uso | Fuente | Pesos | Aplicación |
|-----|--------|-------|-----------|
| Títulos | Poppins | 700 (Bold) | h1, h2, h3, títulos principales |
| Encabezados | Poppins | 600 (SemiBold) | h4, h5, h6, subtítulos |
| Cuerpo | Inter | 400 (Regular) | Párrafos, descripciones |
| Énfasis | Inter | 600 (SemiBold) | Texto importante, CTAs |

### Escala de Tamaños

```css
h1: 3rem (48px)      /* Títulos principales */
h2: 2.25rem (36px)   /* Títulos de sección */
h3: 1.875rem (30px)  /* Subtítulos */
h4: 1.5rem (24px)    /* Encabezados pequeños */
p: 1rem (16px)       /* Texto normal */
small: 0.875rem (14px) /* Texto pequeño */
```

### Espaciado de Línea

- Títulos: 1.2
- Cuerpo: 1.6
- Pequeño: 1.5

---

## 🎯 Componentes

### Botones

#### Botón Primario
- Fondo: Rojo vibrante (#E63946)
- Texto: Blanco
- Hover: Rojo más oscuro
- Padding: 0.6rem 1.2rem
- Border-radius: 0.75rem
- Transición: 0.2s

```tsx
<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
  Texto del botón
</Button>
```

#### Botón Secundario
- Fondo: Naranja (#FF8C42)
- Texto: Blanco
- Hover: Naranja más oscuro
- Mismo padding y border-radius

#### Botón Outline
- Borde: 2px sólido
- Fondo: Transparente
- Hover: Fondo sólido
- Transición suave

### Tarjetas

- Fondo: Gris muy claro (#F8F9FA)
- Padding: 1.8rem
- Border-radius: 2rem
- Sombra: 0 20px 35px -8px rgba(0,0,0,0.2)
- Hover: Sombra más profunda
- Transición: 0.3s

```tsx
<Card className="hover:shadow-lg transition-shadow">
  {/* contenido */}
</Card>
```

### Inputs

- Borde: 2px sólido #E5E7EB
- Padding: 0.75rem 1rem
- Border-radius: 1rem
- Foco: Borde primario + sombra
- Transición: 0.2s

---

## 🎬 Animaciones

### Principios

- **Duración**: 250-400ms para transiciones
- **Easing**: ease-out para entrada, ease-in-out para cambios
- **Propósito**: Guiar atención, comunicar feedback
- **Sutileza**: Evitar exceso de movimiento

### Transiciones Comunes

```css
/* Fade in */
opacity: 0 → 1
transition: opacity 300ms ease-out

/* Slide up */
transform: translateY(20px) → translateY(0)
opacity: 0 → 1
transition: all 300ms ease-out

/* Scale hover */
transform: scale(1) → scale(1.05)
transition: transform 200ms ease-out

/* Color change */
background-color: color1 → color2
transition: background-color 250ms ease-in-out
```

### Hover Effects

- Botones: Scale 1.05 + Shadow deeper
- Tarjetas: Shadow deeper + slight lift
- Enlaces: Color change + underline
- Duración: 200ms

---

## 📐 Espaciado

### Escala de Espaciado

```css
0.25rem (4px)
0.5rem (8px)
0.75rem (12px)
1rem (16px)
1.5rem (24px)
2rem (32px)
2.5rem (40px)
3rem (48px)
```

### Márgenes de Sección

- Pequeña: 2rem
- Mediana: 3rem
- Grande: 4rem (desktop), 2rem (mobile)

### Padding de Contenedor

- Mobile: 1rem
- Tablet: 1.5rem
- Desktop: 2rem

---

## 🔲 Bordes y Radios

### Border Radius

```css
--radius-sm: 0.25rem (4px)     /* Inputs, pequeños elementos */
--radius-md: 0.5rem (8px)      /* Botones, elementos medianos */
--radius-lg: 1rem (16px)       /* Tarjetas, modales */
--radius-xl: 2rem (32px)       /* Elementos grandes */
--radius-full: 9999px          /* Píldoras, avatares */
```

### Bordes

- Primario: 1px sólido #E5E7EB
- Énfasis: 2px sólido #E63946
- Sutil: 1px sólido rgba(0,0,0,0.1)

---

## 🌓 Temas

### Tema Estándar

```css
--background: #FFFFFF
--foreground: #1F2937
--primary: #E63946
--secondary: #FF8C42
```

**Uso**: Profesionalismo con energía, interfaz clara y moderna.

### Tema Alto Contraste

```css
--background: #FFFFFF
--foreground: #000000
--primary: #000000
--secondary: #FFFFFF
```

**Uso**: Máxima accesibilidad, cumple WCAG AAA.

### Tema Oscuro

```css
--background: #000000
--foreground: #FFFFFF
--primary: #FF8C42
--secondary: #E63946
```

**Uso**: Reducción de fatiga ocular, preferencia del usuario.

---

## ♿ Accesibilidad

### Contraste

| Elemento | Ratio Requerido | Estándar |
|----------|-----------------|----------|
| Texto normal | 4.5:1 | AA |
| Texto grande | 3:1 | AA |
| Interfaz | 3:1 | AA |
| Alto Contraste | 7:1+ | AAA |

### Enfoque

- Indicador visible en todos los elementos interactivos
- Color: Naranja (#FF8C42) o contraste suficiente
- Ancho: 2px mínimo
- Offset: 2px

### Semántica

- Usar `<button>` para botones, no `<div>`
- Usar `<a>` para enlaces
- Usar `<h1>` a `<h6>` en orden correcto
- Usar `<label>` para inputs
- Usar `<nav>` para navegación

### ARIA

```tsx
/* Botón con ícono */
<button aria-label="Cerrar menú">
  <X />
</button>

/* Enlace externo */
<a href="..." aria-label="Abrir en nueva ventana">
  Enlace
</a>

/* Región viva */
<div aria-live="polite" aria-atomic="true">
  {mensaje}
</div>
```

---

## 📱 Responsive Design

### Breakpoints

```css
mobile: 0px
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile First

Diseñar para mobile primero, luego expandir a desktop.

```tsx
/* Mobile por defecto */
<div className="text-sm">
  {/* Tablet y superior */}
  <div className="md:text-base">
    {/* Desktop */}
    <div className="lg:text-lg">
      Contenido
    </div>
  </div>
</div>
```

---

## 🎯 Mejores Prácticas

### Tipografía
- ✅ Usar Poppins para títulos, Inter para cuerpo
- ✅ Mantener jerarquía clara
- ✅ Líneas no más de 75 caracteres
- ❌ No mezclar más de 2 familias de fuentes

### Colores
- ✅ Usar paleta definida
- ✅ Mantener contraste suficiente
- ✅ Usar colores semánticos correctamente
- ❌ No usar colores al azar

### Espaciado
- ✅ Usar escala de espaciado
- ✅ Mantener consistencia
- ✅ Usar whitespace como elemento de diseño
- ❌ No amontonar elementos

### Animaciones
- ✅ Usar para guiar atención
- ✅ Mantener duración consistente
- ✅ Respetar preferencias de movimiento
- ❌ No animar todo

### Accesibilidad
- ✅ Cumplir WCAG AA mínimo
- ✅ Probar con lector de pantalla
- ✅ Probar navegación por teclado
- ❌ No confiar solo en color

---

## 📋 Checklist de Componentes

Al crear un nuevo componente:

- [ ] Usar tipografía correcta
- [ ] Aplicar colores de la paleta
- [ ] Mantener espaciado consistente
- [ ] Incluir estados (hover, focus, active)
- [ ] Ser responsive
- [ ] Cumplir accesibilidad
- [ ] Documentar uso
- [ ] Probar en temas

---

**Última actualización**: 13 de Marzo, 2026
