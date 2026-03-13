# AGENCIA YOTEPUBLICO

**Plataforma profesional de servicios de publicidad y marketing digital**

Agencia especializada en publicaciones en redes sociales, diseño de flyers, gestión de marca y campañas digitales para negocios en Cuba.

---

## 🎯 Características Principales

### Servicios
- **Publicación Integral**: Publicaciones en 6 redes sociales + diseño de flyer (400 CUP)
- **Plan WhatsApp Pro**: Publicación especializada en WhatsApp con máximo alcance (150 CUP)
- **Gestión Mensual**: Planes personalizados para gestión continua de marca

### Diseño & Experiencia
- **Diseño Responsivo**: Interfaz optimizada para desktop, tablet y móvil
- **Sistema de Temas**: Dos modos disponibles
  - Tema Estándar (recomendado): Colores corporativos profesionales
  - Tema Alto Contraste: Blanco y negro para máxima accesibilidad
- **Modo Oscuro**: Soporte completo para tema oscuro del sistema
- **Tipografía Premium**: Poppins (títulos) + Inter (cuerpo)

### SEO & Optimización
- **Schema.org Estructurado**: Datos organizacionales y de servicios
- **Sitemap XML**: Indexación completa de todas las páginas
- **Robots.txt**: Configuración de rastreo para motores de búsqueda
- **Meta Tags Optimizados**: Open Graph, Twitter Card, Canonical URLs
- **Performance**: Optimizaciones de velocidad y Core Web Vitals

### Accesibilidad
- **WCAG AA Compliance**: Cumplimiento de estándares de accesibilidad
- **Alto Contraste**: Modo de alto contraste para usuarios con discapacidades visuales
- **Navegación por Teclado**: Interfaz completamente navegable sin ratón
- **Textos Alternativos**: Descripciones en todas las imágenes

---

## 🏗️ Estructura del Proyecto

```
yotepublico-agency/
├── client/
│   ├── public/
│   │   ├── favicon.jpg           # Logo de la agencia
│   │   ├── manifest.json         # Configuración PWA
│   │   ├── robots.txt            # Instrucciones para buscadores
│   │   ├── sitemap.xml           # Mapa del sitio
│   │   └── .htaccess             # Configuración de servidor
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx          # Página principal
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx  # Gestor de temas
│   │   ├── components/           # Componentes reutilizables
│   │   ├── index.css             # Estilos globales y temas
│   │   ├── App.tsx               # Componente raíz
│   │   └── main.tsx              # Punto de entrada
│   └── index.html                # HTML principal
├── seo-config.json               # Configuración SEO centralizada
└── README.md                      # Este archivo
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores

| Color | Valor | Uso |
|-------|-------|-----|
| Rojo Primario | #E63946 | Botones, enlaces, énfasis |
| Naranja Secundario | #FF8C42 | Acentos, hover effects |
| Gris Oscuro | #1F2937 | Texto principal, fondos |
| Blanco | #FFFFFF | Fondo, texto en oscuro |
| Gris Claro | #F8F9FA | Fondos secundarios |

### Tipografía

- **Display/Títulos**: Poppins Bold (700)
- **Encabezados**: Poppins SemiBold (600)
- **Cuerpo**: Inter Regular (400)
- **Énfasis**: Inter SemiBold (600)

### Temas Disponibles

#### Tema Estándar (Recomendado)
- Fondo blanco limpio
- Colores corporativos vibrantes
- Ideal para profesionalismo y energía

#### Tema Alto Contraste
- Blanco y negro puro
- Máxima legibilidad
- Cumple WCAG AAA
- Ideal para accesibilidad

---

## 🚀 Desarrollo

### Requisitos
- Node.js 22.13.0+
- pnpm 10.4.1+

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/yotepublico/website.git
cd website

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El servidor estará disponible en `http://localhost:3000`

### Comandos Disponibles

```bash
# Desarrollo
pnpm dev          # Iniciar servidor de desarrollo

# Build
pnpm build        # Compilar para producción
pnpm preview      # Vista previa de build

# Calidad
pnpm check        # Verificar tipos TypeScript
pnpm format       # Formatear código con Prettier
```

---

## 📱 Funcionalidades de Tema

### Cambiar Tema Claro/Oscuro
La interfaz detecta automáticamente la preferencia del sistema, pero permite cambio manual mediante el botón en el header.

### Cambiar Estilo de Tema
Selector disponible en el header para cambiar entre:
- **Estándar**: Colores corporativos completos
- **Alto Contraste**: Blanco y negro puro

Las preferencias se guardan en `localStorage` y persisten entre sesiones.

---

## 🔍 SEO & Metadatos

### Archivos de Configuración SEO

1. **robots.txt**: Controla el rastreo de buscadores
2. **sitemap.xml**: Mapa completo del sitio para indexación
3. **manifest.json**: Configuración PWA y metadatos
4. **.htaccess**: Optimizaciones de servidor Apache
5. **seo-config.json**: Configuración centralizada de SEO

### Schema.org Estructurado

La página incluye Schema.org para:
- Información de la organización
- Servicios ofrecidos
- Datos de contacto
- Precios en moneda local

### Meta Tags Optimizados

- Open Graph para redes sociales
- Twitter Card para compartir
- Canonical URLs para evitar contenido duplicado
- Viewport y mobile meta tags

---

## ♿ Accesibilidad

### Características Implementadas

- **Contraste**: Relación de contraste 7:1 en tema estándar, 21:1 en alto contraste
- **Navegación**: Completamente navegable con teclado
- **Semántica**: HTML semántico correcto
- **ARIA**: Etiquetas ARIA apropiadas donde es necesario
- **Enfoque**: Indicadores de enfoque visibles

### Cumplimiento de Estándares

- WCAG 2.1 Nivel AA
- Tema Alto Contraste: WCAG 2.1 Nivel AAA

---

## 📊 Performance

### Optimizaciones Implementadas

- Compresión GZIP en servidor
- Caché del navegador configurado
- Imágenes optimizadas
- CSS y JavaScript minificados
- Lazy loading de recursos

### Objetivos Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

---

## 🔐 Seguridad

### Headers de Seguridad

- X-Frame-Options: Previene clickjacking
- X-Content-Type-Options: Previene MIME sniffing
- X-XSS-Protection: Protección XSS
- Content-Security-Policy: Política de seguridad de contenido

### Archivos Protegidos

- Acceso denegado a archivos de configuración
- Acceso denegado a archivos de entorno
- Acceso denegado a archivos ocultos

---

## 📞 Contacto

- **WhatsApp**: https://wa.me/5350728969
- **Telegram**: https://t.me/yotepublico
- **Email**: info@yotepublico.com

---

## 📄 Licencia

© 2026 AGENCIA YOTEPUBLICO. Todos los derechos reservados.

---

## 🤝 Contribuciones

Para reportar problemas o sugerir mejoras, por favor contacta a través de los canales de comunicación disponibles.

---

**Última actualización**: 13 de Marzo, 2026
