/* eslint-disable @typescript-eslint/naming-convention */
import { Logger } from 'winston';
import { FORWARD_FAILED, INVOICE_CANCELED, INVOICE_CREATED_MESSAGE, INVOICE_PAID_MESSAGE, CHANNEL_OPENED, CHANNEL_CLOSED } from '../../config/messages';
import lnd from '../../core/lnd';
import { Forward, EventTypes, Channel, ChainTransaction, Invoice } from '../../types';
import { getChannelNames } from '../helpers/message-helpers';

const logForwardEvent = async (forward: Forward, logger: Logger) => {
  if (forward.tokens && !forward.is_send) {
    const { fee, tokens, is_failed, internal_failure, in_channel, out_channel } = forward;
    const { in: inc, out: outc } = await getChannelNames(in_channel, out_channel, lnd);
    const failure = internal_failure?.replace(/_/gu, ' ');

    if (is_failed) {
      const message = FORWARD_FAILED({ tokens, fee, inc, outc, failure });

      logger.info(message);
    }

    // TODO: Other events

    // if (forward.is_receive) {
    //   title = '⏮ *Received Forward event*';
    // }

    // let title = '🔀 *New Forward event*';
  }
};

const logChannelEvent = async (channel: Channel, type: EventTypes.CHANNEL_CLOSED | EventTypes.CHANNEL_OPENED, logger: Logger) => {
  const { in: inc } = await getChannelNames(channel.partner_public_key, channel.partner_public_key, lnd);
  const capacity = channel.capacity?.toLocaleString('en-EN');

  if (type === EventTypes.CHANNEL_CLOSED) {
    const balance = channel.final_local_balance?.toLocaleString('en-EN');
    const message = CHANNEL_CLOSED(inc, capacity, balance);

    logger.info(message);
  }

  if (type === EventTypes.CHANNEL_OPENED) {
    const balance = channel.local_balance?.toLocaleString('en-EN');
    const message = CHANNEL_OPENED(inc, capacity, balance);

    logger.info(message);
  }
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
    logger.info(INVOICE_CREATED_MESSAGE(invoice.tokens));
  }

  if (invoice.is_confirmed) {
    logger.info(INVOICE_PAID_MESSAGE(invoice.tokens));
  }

  if (invoice.is_canceled) {
    logger.info(INVOICE_CANCELED(invoice.tokens));
  }
};

export { logForwardEvent, logChannelEvent, logTransactionEvent, logInvoiceEvent };
