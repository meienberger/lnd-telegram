import { createLogger } from 'winston';
import TelegramLogger, { FormatOptions } from 'winston-telegram';
import config from '..';

const telegramFormat = (options: FormatOptions) => {
  return options.message;
};

const telegramLogger = createLogger({
  level: 'info',
  transports: [],
});

telegramLogger.add(
  new TelegramLogger({
    parseMode: 'MarkdownV2',
    token: config.telegram.token,
    chatId: config.telegram.chatId,
    formatMessage: telegramFormat,
    handleExceptions: true,
  }),
);

export default telegramLogger;
