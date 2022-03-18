/* eslint-disable @typescript-eslint/naming-convention */
import { Logger } from 'winston';
import {
  FORWARD_FAILED,
  INVOICE_CANCELED,
  INVOICE_CREATED_MESSAGE,
  INVOICE_PAID_MESSAGE,
  CHANNEL_OPENED,
  CHANNEL_CLOSED,
  FORWARD_SUCCESS,
  CHAIN_OUTGOING,
  CHAIN_CONFIRMED,
  CHAIN_INCOMING,
} from '../../config/messages';
import lnd from '../../core/lnd';
import { Forward, EventTypes, Channel, ChainTransaction, Invoice } from '../../types';
import { getChannelNames } from '../helpers/message-helpers';

const logForwardEvent = async (forward: Forward, logger: Logger) => {
  if (forward.tokens && !forward.is_send) {
    const { fee, tokens, is_failed, internal_failure, in_channel, out_channel, is_receive, is_send } = forward;
    const { in: inc, out: outc } = await getChannelNames(in_channel, out_channel, lnd);
    const failure = internal_failure?.replace(/_/gu, ' ');

    if (is_failed) {
      const message = FORWARD_FAILED({ tokens, fee, inc, outc, failure });

      logger.info(message);
    }

    if (!is_failed && !is_receive && !is_send) {
      const message = FORWARD_SUCCESS({ tokens, fee, inc, outc });

      logger.info(message);
    }
  }
};

const logChannelEvent = (channel: Channel, type: EventTypes.CHANNEL_CLOSED | EventTypes.CHANNEL_OPENED, logger: Logger) => {
  try {
    const capacity = channel.capacity?.toLocaleString('en-EN');

    if (type === EventTypes.CHANNEL_CLOSED) {
      const balance = channel.final_local_balance?.toLocaleString('en-EN');
      const message = CHANNEL_CLOSED(channel.partner_public_key.slice(0, 8), capacity, balance);

      logger.info(message);
    }

    if (type === EventTypes.CHANNEL_OPENED) {
      const balance = channel.local_balance?.toLocaleString('en-EN');
      const message = CHANNEL_OPENED(channel.partner_public_key.slice(0, 8), capacity, balance);

      logger.info(message);
    }
  } catch (error) {
    console.error(error);
  }
};

const logTransactionEvent = (transaction: ChainTransaction, logger: Logger) => {
  if (!transaction.is_confirmed && transaction.is_outgoing) {
    const message = CHAIN_OUTGOING(transaction.tokens.toLocaleString('en-EN'), transaction.id);

    logger.info(message);
  }

  if (!transaction.is_confirmed && !transaction.is_outgoing) {
    const message = CHAIN_INCOMING(transaction.tokens.toLocaleString('en-EN'), transaction.id);

    logger.info(message);
  }

  if (transaction.is_confirmed) {
    const message = CHAIN_CONFIRMED(transaction.tokens.toLocaleString('en-EN'), transaction.id);

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
