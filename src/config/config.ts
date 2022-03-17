import * as dotenv from 'dotenv';
import lnService from 'lightning';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  dotenv.config();
} else {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}

const { NODE_ENV = 'development', APP_LND_IP = '127.0.0.1', APP_LND_PORT = '10009', TLS_CERT = '', ADMIN_MACAROON = '', TELEGRAM_API_TOKEN = '', TELEGRAM_CHAT_ID = '' } = process.env;

const missing = [];

if (!APP_LND_IP) missing.push('APP_LND_IP');

if (!APP_LND_PORT) missing.push('APP_LND_PORT');

if (!TLS_CERT) missing.push('TLS_CERT');

if (!ADMIN_MACAROON) missing.push('ADMIN_MACAROON');

if (!TELEGRAM_API_TOKEN) missing.push('TELEGRAM_API_TOKEN');

if (!TELEGRAM_CHAT_ID) missing.push('TELEGRAM_CHAT_ID');

if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

interface IConfig {
  NODE_ENV: string;
  lnd: lnService.LndAuthenticationWithMacaroon;
  telegram: {
    token: string;
    chatId: number;
  };
}

const config: IConfig = {
  NODE_ENV,
  lnd: {
    socket: `${APP_LND_IP}:${APP_LND_PORT}`,
    cert: TLS_CERT,
    macaroon: ADMIN_MACAROON,
  },
  telegram: {
    token: TELEGRAM_API_TOKEN,
    chatId: Number(TELEGRAM_CHAT_ID),
  },
};

export default config;
