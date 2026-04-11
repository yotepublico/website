import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Mail } from "lucide-react";

interface ServiceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    title: string;
    price: string;
    description: string;
    features: string[];
  } | null;
}

export function ServiceRequestDialog({ open, onOpenChange, service }: ServiceRequestDialogProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    businessName: "",
    adTitle: "",
    adDescription: "",
    adImage: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        adImage: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      adImage: null,
    }));
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generateEmailContent = () => {
    const emailBody = `
SOLICITUD DE PLAN DE SERVICIOS - YOTEPUBLICO

=== DATOS DEL CLIENTE ===
Nombre: ${formData.clientName}
Email: ${formData.clientEmail}
Teléfono: ${formData.clientPhone}
Nombre del Negocio: ${formData.businessName}

=== DATOS DEL ANUNCIO ===
Título: ${formData.adTitle}
Descripción: ${formData.adDescription}

=== PLAN SELECCIONADO ===
Plan: ${service?.title}
Precio: ${service?.price}
Descripción: ${service?.description}

Características incluidas:
${service?.features.map((f) => `- ${f}`).join("\n")}

=== IMAGEN DEL ANUNCIO ===
${formData.adImage ? `Archivo adjunto: ${formData.adImage.name}` : "Sin imagen adjunta"}

---
Este mensaje fue generado desde la plataforma YOTEPUBLICO
Fecha: ${new Date().toLocaleString("es-ES")}
    `.trim();

    return emailBody;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.clientName ||
      !formData.clientEmail ||
      !formData.businessName ||
      !formData.adTitle ||
      !service
    ) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);

    try {
      const emailBody = generateEmailContent();
      const subject = `Solicitud de Plan: ${service.title} - ${formData.businessName}`;
      const recipientEmail = "info@yotepublico.com";

      // Crear mailto con el contenido
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

      // Abrir cliente de correo
      window.location.href = mailtoLink;

      // Mostrar mensaje de éxito
      setTimeout(() => {
        alert("Se abrirá tu cliente de correo con la solicitud pre-completada. Por favor revisa y envía el correo.");
        setFormData({
          clientName: "",
          clientEmail: "",
          clientPhone: "",
          businessName: "",
          adTitle: "",
          adDescription: "",
          adImage: null,
        });
        setPreviewImage(null);
        onOpenChange(false);
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Plan: {service.title}</DialogTitle>
          <DialogDescription>
            Completa el formulario con tus datos y los detalles de tu anuncio. Enviaremos la solicitud por correo electrónico.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resumen del Plan */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan Seleccionado</p>
                  <p className="text-lg font-bold text-primary">{service.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Precio</p>
                  <p className="text-lg font-bold text-primary">{service.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datos del Cliente */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Datos del Cliente</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nombre Completo *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  placeholder="Tu nombre"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email *</Label>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Teléfono</Label>
                <Input
                  id="clientPhone"
                  name="clientPhone"
                  placeholder="+53 5350728969"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Nombre del Negocio *</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  placeholder="Tu negocio o marca"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Datos del Anuncio */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Datos del Anuncio</h3>

            <div className="space-y-2">
              <Label htmlFor="adTitle">Título del Anuncio *</Label>
              <Input
                id="adTitle"
                name="adTitle"
                placeholder="Ej: Oferta especial de verano"
                value={formData.adTitle}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adDescription">Descripción del Anuncio</Label>
              <Textarea
                id="adDescription"
                name="adDescription"
                placeholder="Describe tu anuncio, promoción o contenido..."
                value={formData.adDescription}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            {/* Imagen del Anuncio */}
            <div className="space-y-2">
              <Label htmlFor="adImage">Imagen del Anuncio</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                {previewImage ? (
                  <div className="space-y-3">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cambiar imagen
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer space-y-2"
                  >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Haz clic para subir una imagen o arrastra aquí
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF (máx. 5MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="adImage"
                  name="adImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Mail className="h-4 w-4 mr-2" />
              {isSubmitting ? "Enviando..." : "Enviar por Email"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
