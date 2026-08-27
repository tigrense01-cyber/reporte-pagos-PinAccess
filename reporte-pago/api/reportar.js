export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { Cliente, Teléfono, Método, Monto, Referencia, Fecha, Hora } = req.body;

    if (!Cliente || !Monto || !Referencia) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
      const mensaje = `🏦 *NUEVO REPORTE DE PAGO*\n\n` +
                      `👤 *Cliente:* ${Cliente}\n` +
                      `📞 *Teléfono:* ${Teléfono}\n` +
                      `💳 *Método:* ${Método}\n` +
                      `💵 *Monto:* ${Monto}\n` +
                      `🔢 *Referencia:* ${Referencia}\n` +
                      `📅 *Fecha:* ${Fecha} ${Hora}`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: mensaje,
          parse_mode: 'Markdown'
        })
      });
    }

    return res.status(200).json({ success: true, message: 'Reporte procesado con éxito' });

  } catch (error) {
    console.error('Error al procesar el reporte:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
