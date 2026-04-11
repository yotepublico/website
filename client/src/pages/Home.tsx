import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { ServiceRequestDialog } from "@/components/ServiceRequestDialog";

/**
 * AGENCIA YOTEPUBLICO - Página Principal
 * 
 * Diseño: Modernismo Corporativo Dinámico
 * Tipografía: Poppins (títulos) + Inter (cuerpo)
 * Colores: Rojo vibrante (#E63946), Naranja (#FF8C42), Gris oscuro (#1F2937)
 * Filosofía: Profesionalismo con energía dinámica
 */

export default function Home() {
  const { theme, toggleTheme, themeStyle, setThemeStyle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const services = [
    {
      title: "Publicación Integral",
      price: "400 CUP",
      description: "Publicación manual en 6 redes sociales + diseño de flyer profesional",
      features: ["Facebook (Perfil + Grupo)", "WhatsApp (Canal + Comunidad + Grupos)", "Instagram", "Telegram", "TikTok", "LinkedIn", "Diseño de flyer incluido"],
    },
    {
      title: "Plan WhatsApp Pro",
      price: "150 CUP",
      description: "Publicación especializada en WhatsApp con máximo alcance",
      features: ["Canal WhatsApp", "Comunidad", "Grupos privados", "Estado", "Flyer diseñado", "Mensajes personalizados"],
    },
    {
      title: "Gestión Mensual",
      price: "Consultar",
      description: "Planes personalizados para gestión continua de tu marca",
      features: ["Publicaciones diarias", "Diseño de contenido", "Gestión de comunidad", "Reportes mensuales", "Estrategia personalizada"],
    },
  ];

  const features = [
    { icon: "📱", title: "Multi-Red", description: "Presencia en todas las plataformas principales" },
    { icon: "🎨", title: "Diseño Profesional", description: "Flyers y contenido diseñado por expertos" },
    { icon: "⚡", title: "Rápido y Eficiente", description: "Publicación en 24 horas máximo" },
    { icon: "📊", title: "Resultados Medibles", description: "Reportes de alcance e impacto" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/new_logo.png" alt="YOTEPUBLICO" className="h-12 w-auto" />
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#servicios" className="text-sm font-medium hover:text-primary transition-colors">
              Servicios
            </a>
            <a href="#ventajas" className="text-sm font-medium hover:text-primary transition-colors">
              Ventajas
            </a>
            <a href="#contacto" className="text-sm font-medium hover:text-primary transition-colors">
              Contacto
            </a>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Cambiar tema"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
              
              {/* Theme Style Selector */}
              <select
                value={themeStyle}
                onChange={(e) => setThemeStyle(e.target.value as 'standard' | 'highcontrast')}
                className="hidden md:inline-block px-3 py-1 text-sm bg-muted text-foreground rounded-lg border border-border hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <option value="standard">Estándar</option>
                <option value="highcontrast">Alto Contraste</option>
              </select>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* CTA Button */}
            <Button className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground">
              Contactar
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="container py-4 flex flex-col gap-4">
              <a href="#servicios" className="text-sm font-medium hover:text-primary transition-colors">
                Servicios
              </a>
              <a href="#ventajas" className="text-sm font-medium hover:text-primary transition-colors">
                Ventajas
              </a>
              <a href="#contacto" className="text-sm font-medium hover:text-primary transition-colors">
                Contacto
              </a>
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-muted rounded-lg transition-colors flex-1"
                >
                  {theme === 'light' ? <Moon className="h-4 w-4 mx-auto" /> : <Sun className="h-4 w-4 mx-auto" />}
                </button>
                <select
                  value={themeStyle}
                  onChange={(e) => setThemeStyle(e.target.value as 'standard' | 'highcontrast')}
                  className="flex-1 px-3 py-2 text-sm bg-muted text-foreground rounded-lg border border-border"
                >
                  <option value="standard">Estándar</option>
                  <option value="highcontrast">Alto Contraste</option>
                </select>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/new_banner.png)'}}>
        <div className="absolute inset-0 -z-10 bg-black/40"></div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/20 text-white rounded-full text-sm font-semibold backdrop-blur-sm">
                <span className="text-lg">📢</span>
                Agencia de Publicidad Profesional
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Amplifica tu marca en
              <span className="block text-orange-300 mt-2">todas las redes sociales</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Publicaciones profesionales, diseño de flyers, gestión de comunidad y estrategia digital. Todo lo que necesita tu negocio para crecer en línea.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Planes
            </Button>
              <Button size="lg" variant="outline">
                Conocer Más
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 text-sm">
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground">Clientes Satisfechos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-muted-foreground">Publicaciones Exitosas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-muted-foreground">Redes Sociales</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 md:py-32 bg-card">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Planes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a las necesidades de tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-4xl font-bold text-primary">{service.price}</div>
                  <ul className="space-y-3">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary font-bold mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => {
                      setSelectedService(service);
                      setDialogOpen(true);
                    }}
                  >
                    Seleccionar Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="ventajas" className="py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">¿Por qué elegirnos?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Somos especialistas en llevar tu marca al siguiente nivel
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">¿Listo para crecer?</h2>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Contacta con nosotros hoy y descubre cómo podemos transformar tu presencia digital
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => window.location.href = 'https://wa.me/5350728969'}
            >
              Contactar por WhatsApp
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => window.location.href = 'mailto:info@yotepublico.com'}
            >
              Enviar Email
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-lg text-primary mb-4">AGENCIA YOTEPUBLICO</div>
              <p className="text-sm text-muted-foreground">
                Tu socio en publicidad y marketing digital
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Publicaciones</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Diseño</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Gestión</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Portafolio</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://wa.me/5350728969" className="hover:text-primary transition-colors">WhatsApp</a></li>
                <li><a href="https://t.me/yotepublico" className="hover:text-primary transition-colors">Telegram</a></li>
                <li><a href="mailto:info@yotepublico.com" className="hover:text-primary transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 AGENCIA YOTEPUBLICO. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Service Request Dialog */}
      <ServiceRequestDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        service={selectedService} 
      />
    </div>
  );
}
