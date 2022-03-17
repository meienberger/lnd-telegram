import { getChannels } from 'lightning';
import lnd from './lnd';
import { Forward, EventTypes, Channel, ChainTransaction, Invoice } from '../types';
import logger from '../config/logger/logger';

const logForwardEvent = async (forward: Forward) => {
  try {
    if (forward.tokens) {
      const { channels } = await getChannels({ lnd });

      const inChannel = channels.find(channel => channel.id === forward.in_channel)?.partner_public_key;
      const outChannel = channels.find(channel => channel.id === forward.out_channel)?.partner_public_key;

      let title = '🔀 *New Forward event*';
      let failure = '';

      if (forward.is_failed) {
        title = '❌ *Failed Forward event*';
        failure = `\n*Failure*: ${forward.internal_failure?.replace(/_/gu, ' ')}`;
      }

      if (forward.is_receive) {
        title = '⏮ *Received Forward event*';
      }

      if (forward.is_send) {
        title = '📤 *Sent payment*';
      }

      const message = `${title}\n*In Channel*: ${inChannel?.slice(0, 8)}\n*Out Channel*: ${outChannel?.slice(0, 8)}\n*Tokens*: ${forward.tokens?.toLocaleString(
        'en-EN',
      )}\n*Fee*: ${forward.fee?.toLocaleString('en-EN')}${failure}`;

      logger.info(message);
    }
  } catch (error) {
    console.error(error);
  }
};

const logChannelEvent = (channel: Channel, type: EventTypes.CHANNEL_CLOSED | EventTypes.CHANNEL_OPENED) => {
  let title = '';
  let balance = '';

  if (type === EventTypes.CHANNEL_CLOSED) {
    title = '🔔 *Channel closed*';
    balance = `\n*Final Balance*: ${channel.final_local_balance?.toLocaleString('en-EN')}`;
  }

  if (type === EventTypes.CHANNEL_OPENED) {
    title = '🔔 *Channel opened*';
    balance = `\n*Balance*: ${channel.local_balance?.toLocaleString('en-EN')}`;
  }

  const message = `${title}\n*Partner*: ${channel.partner_public_key?.slice(0, 8)}\n*Capacity*: ${channel.capacity?.toLocaleString('en-EN')}${balance}`;

  logger.info(message);
};

const logTransactionEvent = (transaction: ChainTransaction) => {
  let message = '';

  if (!transaction.is_confirmed && transaction.is_outgoing) {
    message = `🕚 *New outgoing chain transaction*\n*Amount*: ${transaction.tokens?.toLocaleString('en-EN')}\n[See in explorer](https://mempool.space/tx/${transaction.id})`;
  }

  if (transaction.is_confirmed && transaction.is_outgoing) {
    message = `✅ *Transaction confirmed*\n*Amount*: ${transaction.tokens?.toLocaleString('en-EN')}\n[See in explorer](https://mempool.space/tx/${transaction.id})`;
  }

  if (message) {
    logger.info(message);
  }
};

const logInvoiceEvent = (invoice: Invoice) => {
  let message = '';

  if (!invoice.is_confirmed) {
    message = `🧾 *New invoice created*\n*Amount*: ${invoice.tokens?.toLocaleString('en-EN')}`;
  }

  if (invoice.is_confirmed) {
    message = `✅ *Invoice has been paid*\n*Amount*: ${invoice.tokens?.toLocaleString('en-EN')}`;
  }

  if (invoice.is_canceled) {
    message = `❌ *Invoice canceled*\n*Amount*: ${invoice.tokens?.toLocaleString('en-EN')}`;
  }

  if (message) {
    logger.info(message);
  }
};

export { logForwardEvent, logChannelEvent, logTransactionEvent, logInvoiceEvent };
