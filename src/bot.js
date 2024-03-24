const TelegramBot = require('node-telegram-bot-api');
const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Замените на токен вашего бота

const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Привет, ты написал мне: "${msg.text}"`);
});

// Экспортируем объект бота для использования в других файлах
module.exports = bot;