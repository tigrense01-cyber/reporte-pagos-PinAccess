export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { Cliente, Cedula, Teléfono, Email, Direccion, Referencia, Sector, Fecha, Hora } = req.body;

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN_ACTUALIZACION;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID_ACTUALIZACION;

    if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
      const mensaje = `📋 *ACTUALIZACIÓN DE DATOS*\n\n` +
                    `👤 *Cliente:* ${Cliente}\n` +
                    `🆔 *Cédula:* ${Cedula}\n` +
                    `📞 *WhatsApp:* ${Teléfono}\n` +
                    `📧 *Email:* ${Email}\n` +
                    `🏠 *Dirección:* ${Direccion}\n` +
                    `🗺️ *Referencia:* ${Referencia || 'Ninguna'}\n` +
                    `📍 *Sector / Urb:* ${Sector}\n` +
                    `📅 *Fecha:* ${Fecha} ${Hora}`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: mensaje,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      });
    }

    return res.status(200).json({ success: true, message: 'Actualización procesada con éxito' });

  } catch (error) {
    console.error('Error al procesar la actualización:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}