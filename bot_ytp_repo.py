import logging
import re
import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, ConversationHandler, filters, ContextTypes

# Configuración de logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Token del bot (obtenido de variables de entorno por seguridad)
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# Estados para la conversación de solicitud de servicio
SERVICE_SELECTION, CONTACT_INFO, REQUIREMENTS, CONFIRM_REQUEST = range(4)

# --- Datos de la plataforma (extraídos del repositorio yotepublico/website) ---
SERVICES = {
    "publicacion_integral": {
        "title": "Publicación Integral",
        "price": "400 CUP",
        "description": "Maximiza tu alcance con publicaciones manuales en las principales redes sociales y un diseño de flyer profesional que captura la atención.",
        "features": [
            "Facebook (Perfil + Grupo): Conexión directa con tu audiencia.",
            "WhatsApp (Canal + Comunidad + Grupos): Expansión a través de la mensajería más usada.",
            "Instagram: Impacto visual con contenido de alta calidad.",
            "Telegram: Comunicación segura y eficiente con tus seguidores.",
            "TikTok: Viraliza tu marca con contenido dinámico.",
            "LinkedIn: Profesionaliza tu presencia y genera leads B2B.",
            "Diseño de flyer profesional incluido: Creatividad que vende."
        ],
        "technical_details": "Nuestro equipo de community managers expertos realiza la publicación estratégica en 6 plataformas clave. El diseño del flyer se adapta a la identidad de tu marca y optimizado para cada red social, garantizando máxima visibilidad y engagement. Tiempo de entrega: 24-48 horas tras la aprobación del diseño."
    },
    "plan_whatsapp_pro": {
        "title": "Plan WhatsApp Pro",
        "price": "150 CUP",
        "description": "Un plan especializado para dominar WhatsApp, la plataforma de mensajería líder, asegurando un alcance masivo y una comunicación directa con tus clientes.",
        "features": [
            "Canal WhatsApp: Difusión masiva de tus ofertas y noticias.",
            "Comunidad: Construye lealtad y engagement con grupos segmentados.",
            "Grupos privados: Interacción exclusiva y soporte personalizado.",
            "Estado: Visibilidad constante en el día a día de tus contactos.",
            "Flyer diseñado: Material gráfico optimizado para WhatsApp.",
            "Mensajes personalizados: Comunicación uno a uno efectiva."
        ],
        "technical_details": "Gestión completa de tu estrategia en WhatsApp. Incluye la creación y administración de canales, comunidades y grupos. Los flyers se diseñan específicamente para el formato de WhatsApp, y se implementan estrategias de mensajería para maximizar la tasa de apertura y conversión. Ideal para promociones rápidas y atención al cliente directa."
    },
    "gestion_mensual": {
        "title": "Gestión Mensual",
        "price": "Consultar",
        "description": "Soluciones personalizadas para una gestión integral y continua de tu presencia digital, diseñadas para el crecimiento sostenido de tu marca.",
        "features": [
            "Publicaciones diarias: Contenido fresco y relevante cada día.",
            "Diseño de contenido: Creación de material gráfico y audiovisual.",
            "Gestión de comunidad: Interacción activa y moderación.",
            "Reportes mensuales: Análisis detallado de rendimiento y ROI.",
            "Estrategia personalizada: Adaptada a tus objetivos de negocio."
        ],
        "technical_details": "Desarrollo e implementación de una estrategia de marketing digital 360. Incluye calendario editorial, creación de contenido multimedia (imágenes, videos cortos), gestión de comentarios y mensajes, y reportes de métricas clave (alcance, engagement, conversiones). Sesiones de consultoría periódicas para ajustar la estrategia. Precio bajo consulta según el alcance y la complejidad del plan."
    },
}

FEATURES = [
    { "icon": "📱", "title": "Multi-Red", "description": "Garantizamos tu presencia en todas las plataformas principales donde se encuentra tu audiencia, maximizando tu visibilidad." },
    { "icon": "🎨", "title": "Diseño Profesional", "description": "Nuestros expertos crean flyers y contenido visual de alta calidad, diseñado para captar la atención y comunicar tu mensaje de forma efectiva." },
    { "icon": "⚡", "title": "Rápido y Eficiente", "description": "Implementamos tus campañas y publicaciones en un máximo de 24 horas, asegurando agilidad y respuesta inmediata a las tendencias del mercado." },
    { "icon": "📊", "title": "Resultados Medibles", "description": "Proporcionamos reportes detallados de alcance, interacción y conversión, para que siempre conozcas el impacto real de tu inversión." }
]

FAQ = [
    {
        "question": "¿Cómo puedo solicitar un servicio?",
        "answer": "Puedes usar el comando /request para iniciar el proceso de solicitud, o navegar por nuestros servicios con /services y seleccionar el que te interese."
    },
    {
        "question": "¿Cuáles son los métodos de pago?",
        "answer": "Actualmente aceptamos pagos en CUP. Para más detalles sobre las opciones de pago, por favor, inicia una solicitud de servicio y nuestro equipo te brindará la información necesaria."
    },
    {
        "question": "¿En cuánto tiempo se realizan las publicaciones?",
        "answer": "Para la mayoría de nuestros servicios, las publicaciones se realizan en un plazo de 24 a 48 horas una vez aprobado el diseño y el contenido. Los planes de gestión mensual tienen un calendario editorial continuo."
    },
    {
        "question": "¿Puedo personalizar un plan?",
        "answer": "Sí, ofrecemos planes de Gestión Mensual completamente personalizados. Inicia una solicitud con /request y describe tus necesidades para que podamos diseñar una estrategia a tu medida."
    }
]

# --- Funciones del Bot ---

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Envía un mensaje con el menú principal cuando se emite el comando /start."""
    user = update.effective_user
    welcome_text = (
        f"¡Hola {user.mention_html()}! 🚀\n\n"
        "Soy el bot oficial de **YOTEPUBLICO**, tu aliado estratégico para potenciar tu marca en el ecosistema digital.\n\n"
        "Estamos aquí para ofrecerte soluciones de publicidad y marketing digital que impulsarán tu negocio. Explora nuestros servicios, descubre nuestras ventajas y contáctanos fácilmente.\n\n"
        "¿En qué puedo ayudarte hoy?"
    )
    
    keyboard = [
        [InlineKeyboardButton("Nuestros Servicios 💼", callback_data="main_services")],
        [InlineKeyboardButton("¿Por qué elegirnos? ✨", callback_data="main_features")],
        [InlineKeyboardButton("Preguntas Frecuentes ❓", callback_data="main_faq")],
        [InlineKeyboardButton("Contactar 📞", callback_data="main_contact")],
        [InlineKeyboardButton("Solicitar un Servicio 📝", callback_data="main_request")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_html(welcome_text, reply_markup=reply_markup)

async def main_menu(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra el menú principal."""
    query = update.callback_query
    if query:
        await query.answer()
        await query.edit_message_text(
            text="¿En qué más puedo ayudarte hoy?",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("Nuestros Servicios 💼", callback_data="main_services")],
                [InlineKeyboardButton("¿Por qué elegirnos? ✨", callback_data="main_features")],
                [InlineKeyboardButton("Preguntas Frecuentes ❓", callback_data="main_faq")],
                [InlineKeyboardButton("Contactar 📞", callback_data="main_contact")],
                [InlineKeyboardButton("Solicitar un Servicio 📝", callback_data="main_request")]
            ])
        )
    else:
        await update.message.reply_text(
            text="¿En qué más puedo ayudarte hoy?",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("Nuestros Servicios 💼", callback_data="main_services")],
                [InlineKeyboardButton("¿Por qué elegirnos? ✨", callback_data="main_features")],
                [InlineKeyboardButton("Preguntas Frecuentes ❓", callback_data="main_faq")],
                [InlineKeyboardButton("Contactar 📞", callback_data="main_contact")],
                [InlineKeyboardButton("Solicitar un Servicio 📝", callback_data="main_request")]
            ])
        )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Envía un mensaje de ayuda con los comandos disponibles."""
    help_text = (
        "**Comandos y Opciones Principales:**\n"
        "/start - Inicia el bot y muestra el menú principal.\n"
        "/help - Muestra este mensaje de ayuda.\n"
        "/menu - Accede al menú principal con todas las opciones.\n"
        "/services - Explora nuestro catálogo de servicios.\n"
        "/request - Inicia el proceso para solicitar un servicio.\n"
        "/cancel - Cancela cualquier proceso de solicitud en curso.\n\n"
        "También puedes interactuar con los botones del menú para una experiencia guiada."
    )
    await update.message.reply_text(help_text, parse_mode='Markdown')

async def show_services(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra el catálogo de servicios con botones interactivos."""
    query = update.callback_query
    if query: await query.answer()

    keyboard = []
    for service_id, service_info in SERVICES.items():
        keyboard.append([InlineKeyboardButton(service_info["title"], callback_data=f"service_details_{service_id}")])
    keyboard.append([InlineKeyboardButton("⬅️ Volver al Menú Principal", callback_data="main_menu")])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    text = "**💼 Nuestro Catálogo de Servicios:**\n\nExplora las opciones que tenemos para impulsar tu marca. Selecciona un servicio para ver todos sus detalles técnicos y beneficios.\n\n"\
           "Si ya sabes qué necesitas, puedes usar /request para iniciar una solicitud directamente."
    
    if query:
        await query.edit_message_text(text=text, parse_mode='Markdown', reply_markup=reply_markup)
    else:
        await update.message.reply_text(text=text, parse_mode='Markdown', reply_markup=reply_markup)

async def service_details(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra los detalles técnicos y beneficios de un servicio seleccionado."""
    query = update.callback_query
    await query.answer()
    
    service_id = query.data.replace("service_details_", "")
    service = SERVICES.get(service_id)
    
    if service:
        details_text = f"**✨ {service['title']} ✨**\n\n"
        details_text += f"*Precio:* {service['price']}\n\n"
        details_text += f"*Descripción:* {service['description']}\n\n"
        details_text += "**Características Clave:**\n"
        for feature in service['features']:
            details_text += f"- {feature}\n"
        details_text += f"\n**Detalles Técnicos y Proceso:**\n{service['technical_details']}\n\n"
        details_text += "¿Listo para llevar tu marca al siguiente nivel?"
        
        keyboard = [
            [InlineKeyboardButton("📝 Solicitar este Servicio", callback_data=f"request_service_{service_id}")],
            [InlineKeyboardButton("⬅️ Ver todos los Servicios", callback_data="main_services")],
            [InlineKeyboardButton("🏠 Volver al Menú Principal", callback_data="main_menu")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(text=details_text, parse_mode='Markdown', reply_markup=reply_markup)
    else:
        await query.edit_message_text(text="Servicio no encontrado. Por favor, intenta de nuevo o usa /services.", parse_mode='Markdown')

async def show_features(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra las ventajas competitivas de la agencia."""
    query = update.callback_query
    if query: await query.answer()

    features_text = "**✨ ¿Por qué elegir a YOTEPUBLICO?**\n\n"
    features_text += "Somos tu socio ideal para el crecimiento digital por estas razones clave:\n\n"
    for feature in FEATURES:
        features_text += f"{feature['icon']} **{feature['title']}:** {feature['description']}\n\n"
    features_text += "Nuestra experiencia y compromiso garantizan resultados tangibles para tu negocio."

    keyboard = [
        [InlineKeyboardButton("Nuestros Servicios 💼", callback_data="main_services")],
        [InlineKeyboardButton("🏠 Volver al Menú Principal", callback_data="main_menu")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    if query:
        await query.edit_message_text(text=features_text, parse_mode='Markdown', reply_markup=reply_markup)
    else:
        await update.message.reply_text(text=features_text, parse_mode='Markdown', reply_markup=reply_markup)

async def show_faq(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra las preguntas frecuentes."""
    query = update.callback_query
    if query: await query.answer()

    faq_text = "**❓ Preguntas Frecuentes (FAQ):**\n\n"
    for i, qa in enumerate(FAQ):
        faq_text += f"*{i+1}. {qa['question']}*\n"
        faq_text += f"{qa['answer']}\n\n"
    faq_text += "Si tienes más preguntas, no dudes en contactarnos a través de la opción /contact."

    keyboard = [
        [InlineKeyboardButton("Contactar 📞", callback_data="main_contact")],
        [InlineKeyboardButton("🏠 Volver al Menú Principal", callback_data="main_menu")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    if query:
        await query.edit_message_text(text=faq_text, parse_mode='Markdown', reply_markup=reply_markup)
    else:
        await update.message.reply_text(text=faq_text, parse_mode='Markdown', reply_markup=reply_markup)

async def show_contact(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra la información de contacto."""
    query = update.callback_query
    if query: await query.answer()

    contact_text = "**📞 Contacta con YOTEPUBLICO:**\n\n"
    contact_text += "Estamos listos para escucharte y ayudarte a crecer.\n\n"
    contact_text += "*WhatsApp:* [Envíanos un mensaje](https://wa.me/5350728969)\n"
    contact_text += "*Telegram:* [Chatea con nosotros](https://t.me/yotepublico)\n"
    contact_text += "*Correo Electrónico:* [info@yotepublico.com](mailto:info@yotepublico.com)\n\n"
    contact_text += "¡Esperamos tu mensaje!"

    keyboard = [
        [InlineKeyboardButton("Nuestros Servicios 💼", callback_data="main_services")],
        [InlineKeyboardButton("🏠 Volver al Menú Principal", callback_data="main_menu")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    if query:
        await query.edit_message_text(text=contact_text, parse_mode='Markdown', reply_markup=reply_markup)
    else:
        await update.message.reply_text(text=contact_text, parse_mode='Markdown', reply_markup=reply_markup)

# --- ConversationHandler para Solicitud de Servicio ---

async def request_service_entry(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Punto de entrada para la conversación de solicitud de servicio."""
    query = update.callback_query
    if query:
        await query.answer()
        service_id = query.data.replace("request_service_", "")
        context.user_data["requested_service"] = service_id
        service_title = SERVICES[service_id]["title"]
        await query.edit_message_text(
            f"¡Excelente elección! Has seleccionado el servicio: **{service_title}**.\n\n"
            "Para continuar, por favor, proporciona tu **nombre completo** y un **método de contacto** (ej. correo electrónico, número de teléfono, usuario de Telegram) para que nuestro equipo pueda comunicarse contigo. Asegúrate de que sea un contacto válido.",
            parse_mode='Markdown'
        )
        return CONTACT_INFO
    else:
        keyboard = []
        for service_id, service_info in SERVICES.items():
            keyboard.append([InlineKeyboardButton(service_info["title"], callback_data=f"select_request_service_{service_id}")])
        keyboard.append([InlineKeyboardButton("⬅️ Volver al Menú Principal", callback_data="main_menu")])
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(
            "**📝 Iniciar Solicitud de Servicio:**\n\n"
            "Por favor, selecciona el servicio que te interesa de la lista a continuación o usa /cancel para abortar.",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        return SERVICE_SELECTION

async def select_service_for_request(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja la selección de servicio cuando se inicia la solicitud desde /request o el menú."""
    query = update.callback_query
    await query.answer()
    service_id = query.data.replace("select_request_service_", "")
    context.user_data["requested_service"] = service_id
    service_title = SERVICES[service_id]["title"]
    await query.edit_message_text(
        f"¡Excelente elección! Has seleccionado el servicio: **{service_title}**.\n\n"
        "Para continuar, por favor, proporciona tu **nombre completo** y un **método de contacto** (ej. correo electrónico, número de teléfono, usuario de Telegram) para que nuestro equipo pueda comunicarse contigo. Asegúrate de que sea un contacto válido.",
        parse_mode='Markdown'
    )
    return CONTACT_INFO

async def get_contact_info(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Recopila y valida la información de contacto del usuario."""
    user_input = update.message.text.strip()
    
    # Validación básica de formato de contacto (email o teléfono)
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$"
    phone_regex = r"^\+?\d{8,15}$"
    telegram_user_regex = r"^@[a-zA-Z0-9_]{5,}$"

    if not (re.match(email_regex, user_input) or re.match(phone_regex, user_input) or re.match(telegram_user_regex, user_input)):
        await update.message.reply_text(
            "El formato de contacto no parece válido. Por favor, introduce un correo electrónico, un número de teléfono (con código de país si es posible) o tu usuario de Telegram (ej. @miusuario)."
        )
        return CONTACT_INFO # Permanece en el mismo estado para reintentar

    context.user_data["contact_info"] = user_input
    await update.message.reply_text(
        "¡Gracias! Ahora, por favor, describe brevemente tus **requisitos específicos** o cualquier detalle adicional que consideres importante para el servicio que deseas solicitar. Cuanta más información nos brindes, mejor podremos ayudarte.",
        parse_mode='Markdown'
    )
    return REQUIREMENTS

async def get_requirements(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Recopila los requisitos del servicio y pide confirmación."""
    user_requirements = update.message.text
    context.user_data["requirements"] = user_requirements

    service_id = context.user_data.get("requested_service")
    service_title = SERVICES[service_id]["title"] if service_id else "un servicio no especificado"
    contact_info = context.user_data.get("contact_info", "No proporcionado")

    summary_text = (
        f"**Resumen de tu Solicitud:**\n\n"
        f"*Servicio:* **{service_title}**\n"
        f"*Contacto:* `{contact_info}`\n"
        f"*Requisitos:* {user_requirements}\n\n"
        "¿Es correcta toda la información? Por favor, confirma para enviar tu solicitud a nuestro equipo."
    )

    keyboard = [
        [InlineKeyboardButton("✅ Confirmar y Enviar", callback_data="confirm_request")],
        [InlineKeyboardButton("❌ Cancelar Solicitud", callback_data="cancel_request")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(summary_text, parse_mode='Markdown', reply_markup=reply_markup)
    return CONFIRM_REQUEST

async def confirm_request(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Confirma y finaliza la solicitud del servicio."""
    query = update.callback_query
    await query.answer()

    if query.data == "confirm_request":
        service_id = context.user_data.get("requested_service")
        service_title = SERVICES[service_id]["title"] if service_id else "un servicio no especificado"
        contact_info = context.user_data.get("contact_info", "No proporcionado")
        user_requirements = context.user_data.get("requirements", "No especificados")

        final_confirmation_message = (
            f"¡**Solicitud Recibida con Éxito!** 🎉\n\n"
            f"Agradecemos tu interés en **{service_title}**.\n"
            f"Nuestro equipo ha recibido tus detalles de contacto (`{contact_info}`) y tus requisitos.\n\n"
            "Nos pondremos en contacto contigo a la brevedad posible para discutir los próximos pasos y afinar los detalles. ¡Gracias por confiar en **YOTEPUBLICO** para potenciar tu marca!"
        )
        await query.edit_message_text(final_confirmation_message, parse_mode='Markdown')
        logger.info(f"Nueva solicitud: Servicio={service_title}, Contacto={contact_info}, Requisitos={user_requirements}")

    else: # cancel_request
        await query.edit_message_text("Solicitud cancelada. Puedes iniciar una nueva en cualquier momento con /request.", parse_mode='Markdown')
    
    context.user_data.clear()
    return ConversationHandler.END

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Cancela la conversación de solicitud de servicio."""
    if update.message:
        await update.message.reply_text("Proceso de solicitud cancelado. Puedes iniciar uno nuevo con /request o explorar el menú principal con /start.", parse_mode='Markdown')
    elif update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.edit_message_text("Proceso de solicitud cancelado. Puedes iniciar uno nuevo con /request o explorar el menú principal con /start.", parse_mode='Markdown')
    context.user_data.clear()
    return ConversationHandler.END

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Responde a mensajes que no son comandos ni parte de una conversación activa."""
    await update.message.reply_text(
        "Disculpa, no entendí tu mensaje. Por favor, usa los comandos o las opciones del menú para interactuar conmigo.\n\n"
        "Puedes usar /start para ver el menú principal o /help para ver los comandos disponibles."
    )

def main() -> None:
    """Inicia el bot."""
    if not TOKEN:
        logger.error("No se encontró el token del bot en la variable de entorno TELEGRAM_BOT_TOKEN")
        return

    application = Application.builder().token(TOKEN).build()

    # Manejadores de comandos principales
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("menu", main_menu))
    application.add_handler(CommandHandler("services", show_services))

    # ConversationHandler para la solicitud de servicio
    conv_handler = ConversationHandler(
        entry_points=[
            CommandHandler("request", request_service_entry),
            CallbackQueryHandler(request_service_entry, pattern="^main_request$"),
            CallbackQueryHandler(request_service_entry, pattern="^request_service_")
        ],
        states={
            SERVICE_SELECTION: [CallbackQueryHandler(select_service_for_request, pattern="^select_request_service_")],
            CONTACT_INFO: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_contact_info)],
            REQUIREMENTS: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_requirements)],
            CONFIRM_REQUEST: [CallbackQueryHandler(confirm_request, pattern="^(confirm_request|cancel_request)$")]
        },
        fallbacks=[CommandHandler("cancel", cancel), CallbackQueryHandler(cancel, pattern="^main_menu$")]
    )
    application.add_handler(conv_handler)

    # Manejadores de CallbackQuery para el menú principal
    application.add_handler(CallbackQueryHandler(show_services, pattern="^main_services$"))
    application.add_handler(CallbackQueryHandler(show_features, pattern="^main_features$"))
    application.add_handler(CallbackQueryHandler(show_faq, pattern="^main_faq$"))
    application.add_handler(CallbackQueryHandler(show_contact, pattern="^main_contact$"))
    application.add_handler(CallbackQueryHandler(main_menu, pattern="^main_menu$"))
    application.add_handler(CallbackQueryHandler(service_details, pattern="^service_details_"))

    # Manejador para mensajes de texto no reconocidos
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))

    # Iniciar el bot
    logger.info("Bot iniciado y escuchando...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
