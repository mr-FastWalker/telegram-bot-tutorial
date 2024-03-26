const TelegramBotApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./src/options');

const token = '6806566598:AAFotS6Ffr6Crd9DEI80D-8ixIo2FOTfU7E';

const bot = new TelegramBotApi(token, {polling: true});

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/myName', description: 'Показать имя пользователя' },
    { command: '/game', description: 'Игра угадай число' },
  ])

  bot.on("polling_error", err => console.log(err.data.error.message));

  const chats = {};

  const makeRandomNumber = (chatId) => {
    chats[chatId] = Math.floor(Math.random() * 10);
  };

  bot.on('message', async (msg) => {
    const { text, chat: { id: chatId } } = msg;
    console.log('message: ', msg)

    if (text === '/start') {
      return bot.sendMessage(chatId, 'Привет, я тренировочный бот');
    }
    if (text === '/myName') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/9b3/6f4/9b36f4d8-203f-3e1e-b31f-78519f4f9ba4/1.webp');
      return bot.sendMessage(chatId, `${msg.from.first_name || 'Unknown'} ${msg.from.last_name || ''}`);
    }
    if (text === '/game') {
      await bot.sendMessage(chatId, `я загадываю число от 0 до 9`);
      makeRandomNumber(chatId);
      return bot.sendMessage(chatId, `Отгадай число`, gameOptions);
    }
    return bot.sendMessage(chatId, "Я не знаю что ответить на это сообщение.");
  });

  bot.on('callback_query', async (msg) => {
    const { data, message: { chat: { id: chatId } } } = msg;
    console.log('callback_query: ', msg)

    if (data === '/playAgain') {
      makeRandomNumber(chatId);
      return bot.sendMessage(chatId, `Отгадай число`, gameOptions);
    }

    await bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);
    if (parseInt(data, 10) === chats[chatId]) {
      return await bot.sendMessage(chatId, `Поздравляю, ты угадал число ${chats[chatId]}`, againOptions);
    } else {
      console.log('chats: ', chats, 'data: ', data);
      return await bot.sendMessage(chatId, `Не угадал, попробуй еще раз (было ${chats[chatId]})`, againOptions);
    }
  });
};

start();