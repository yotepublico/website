import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, ConversationHandler, filters, ContextTypes

# Configuración de logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Token del bot
TOKEN = "8612369288:AAEoHV7O7VhMJlR_lPmUV4IZYK95Al8qk5M"

# Estados para la conversación de solicitud de servicio
SERVICE_SELECTION, CONTACT_INFO, REQUIREMENTS = range(3)

# Información de servicios extraída del repositorio
SERVICES = {
    "publicacion_integral": {
        "title": "Publicación Integral",
        "price": "400 CUP",
        "description": "Publicación manual en 6 redes sociales + diseño de flyer profesional",
        "features": ["Facebook (Perfil + Grupo)", "WhatsApp (Canal + Comunidad + Grupos)", "Instagram", "Telegram", "TikTok", "LinkedIn", "Diseño de flyer incluido"],
    },
    "plan_whatsapp_pro": {
        "title": "Plan WhatsApp Pro",
        "price": "150 CUP",
        "description": "Publicación especializada en WhatsApp con máximo alcance",
        "features": ["Canal WhatsApp", "Comunidad", "Grupos privados", "Estado", "Flyer diseñado", "Mensajes personalizados"],
    },
    "gestion_mensual": {
        "title": "Gestión Mensual",
        "price": "Consultar",
        "description": "Planes personalizados para gestión continua de tu marca",
        "features": ["Publicaciones diarias", "Diseño de contenido", "Gestión de comunidad", "Reportes mensuales", "Estrategia personalizada"],
    },
}

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Envía un mensaje con el logotipo cuando se emite el comando /start."""
    user = update.effective_user
    logo_path = "/home/ubuntu/yotepublico_website/assets/images/logo.jpg"
    
    welcome_text = rf"¡Hola {user.mention_html()}! 🚀\n\nSoy el bot oficial de **YOTEPUBLICO**. Estamos aquí para amplificar tu marca en todas las redes sociales.\n\nUsa /services para ver nuestro catálogo o /request para solicitar un servicio directamente."
    
    try:
        with open(logo_path, 'rb') as photo:
            await update.message.reply_photo(
                photo=photo,
                caption=welcome_text,
                parse_mode='HTML'
            )
    except Exception as e:
        logger.error(f"Error enviando logo: {e}")
        await update.message.reply_html(welcome_text)

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Envía un mensaje cuando se emite el comando /help."""
    help_text = (
        "Comandos disponibles:\n"
        "/start - Iniciar el bot\n"
        "/help - Mostrar este mensaje de ayuda\n"
        "/services - Ver nuestro catálogo de servicios\n"
        "/request - Iniciar el proceso de solicitud de un servicio\n"
        "/cancel - Cancelar una solicitud en curso\n"
    )
    await update.message.reply_text(help_text)

async def show_services(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra el catálogo de servicios con botones interactivos."""
    keyboard = []
    for service_id, service_info in SERVICES.items():
        keyboard.append([InlineKeyboardButton(service_info["title"], callback_data=f"service_{service_id}")])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Aquí están nuestros servicios:\n\n" +
                                     "Selecciona uno para ver más detalles o usa /request para solicitarlo directamente.",
                                     reply_markup=reply_markup)

async def service_details(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra los detalles de un servicio seleccionado."""
    query = update.callback_query
    await query.answer()
    
    service_id = query.data.replace("service_", "")
    service = SERVICES.get(service_id)
    
    if service:
        details_text = f"*{service['title']}*\n"
        details_text += f"Precio: {service['price']}\n"
        details_text += f"Descripción: {service['description']}\n\n"
        details_text += "Características:\n"
        for feature in service['features']:
            details_text += f"- {feature}\n"
        
        keyboard = [[InlineKeyboardButton("Solicitar este servicio", callback_data=f"request_{service_id}")]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(text=details_text, parse_mode='Markdown', reply_markup=reply_markup)
    else:
        await query.edit_message_text(text="Servicio no encontrado.")

async def request_service_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Inicia la conversación para solicitar un servicio."""
    query = update.callback_query
    if query:
        await query.answer()
        service_id = query.data.replace("request_", "")
        context.user_data["requested_service"] = service_id
        service_title = SERVICES[service_id]["title"]
        await query.edit_message_text(f"Has seleccionado \"{service_title}\". Por favor, proporciona tu nombre y un método de contacto (ej. correo electrónico, número de teléfono, usuario de Telegram) para que podamos contactarte.")
        return CONTACT_INFO
    else:
        keyboard = []
        for service_id, service_info in SERVICES.items():
            keyboard.append([InlineKeyboardButton(service_info["title"], callback_data=f"select_request_{service_id}")])
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text("Selecciona un servicio para solicitar:", reply_markup=reply_markup)
        return SERVICE_SELECTION

async def select_service_for_request(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja la selección de servicio cuando se inicia la solicitud desde /request."""
    query = update.callback_query
    await query.answer()
    service_id = query.data.replace("select_request_", "")
    context.user_data["requested_service"] = service_id
    service_title = SERVICES[service_id]["title"]
    await query.edit_message_text(f"Has seleccionado \"{service_title}\". Por favor, proporciona tu nombre y un método de contacto (ej. correo electrónico, número de teléfono, usuario de Telegram) para que podamos contactarte.")
    return CONTACT_INFO

async def get_contact_info(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Recopila la información de contacto del usuario."""
    user_contact = update.message.text
    context.user_data["contact_info"] = user_contact
    await update.message.reply_text("Gracias. Ahora, por favor, describe brevemente tus requisitos o cualquier detalle adicional para el servicio.")
    return REQUIREMENTS

async def get_requirements(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Recopila los requisitos del servicio y finaliza la solicitud."""
    user_requirements = update.message.text
    service_id = context.user_data.get("requested_service")
    service_title = SERVICES[service_id]["title"] if service_id else "un servicio no especificado"
    contact_info = context.user_data.get("contact_info", "No proporcionado")

    confirmation_message = (
        f"¡Solicitud recibida!\n\n"
        f"Servicio: {service_title}\n"
        f"Contacto: {contact_info}\n"
        f"Requisitos: {user_requirements}\n\n"
        "Nos pondremos en contacto contigo a la brevedad posible. ¡Gracias por confiar en YOTEPUBLICO!"
    )
    await update.message.reply_text(confirmation_message)

    context.user_data.clear()
    return ConversationHandler.END

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Cancela la conversación de solicitud de servicio."""
    await update.message.reply_text("Solicitud cancelada. Puedes iniciar una nueva en cualquier momento con /request.")
    context.user_data.clear()
    return ConversationHandler.END

def main() -> None:
    """Inicia el bot."""
    application = Application.builder().token(TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("services", show_services))

    application.add_handler(CallbackQueryHandler(service_details, pattern=r"^service_.*"))

    conv_handler = ConversationHandler(
        entry_points=[
            CommandHandler("request", request_service_start),
            CallbackQueryHandler(request_service_start, pattern=r"^request_.*"),
        ],
        states={
            SERVICE_SELECTION: [
                CallbackQueryHandler(select_service_for_request, pattern=r"^select_request_.*"),
            ],
            CONTACT_INFO: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_contact_info)],
            REQUIREMENTS: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_requirements)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )
    application.add_handler(conv_handler)

    logger.info("Bot iniciado. Presiona Ctrl+C para detener.")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
