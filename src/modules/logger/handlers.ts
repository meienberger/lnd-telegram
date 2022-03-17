import { getChannels } from 'lightning';
import { Logger } from 'winston';
import { INVOICE_CANCELED, INVOICE_CREATED_MESSAGE, INVOICE_PAID_MESSAGE } from '../../config/messages';
import lnd from '../../core/lnd';
import { Forward, EventTypes, Channel, ChainTransaction, Invoice } from '../../types';

const logForwardEvent = async (forward: Forward, logger: Logger) => {
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

const logChannelEvent = (channel: Channel, type: EventTypes.CHANNEL_CLOSED | EventTypes.CHANNEL_OPENED, logger: Logger) => {
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

const logTransactionEvent = (transaction: ChainTransaction, logger: Logger) => {
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

const logInvoiceEvent = (invoice: Invoice, logger: Logger) => {
  if (!invoice.is_confirmed) {
    logger.info(INVOICE_CREATED_MESSAGE);
  }

  if (invoice.is_confirmed) {
    logger.info(INVOICE_PAID_MESSAGE);
  }

  if (invoice.is_canceled) {
    logger.info(INVOICE_CANCELED);
  }
};

export { logForwardEvent, logChannelEvent, logTransactionEvent, logInvoiceEvent };
