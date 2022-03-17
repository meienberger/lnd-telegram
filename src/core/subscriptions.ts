import { subscribeToForwards, subscribeToChannels, subscribeToTransactions, subscribeToInvoices } from 'lightning';
import { logChannelEvent, logForwardEvent, logInvoiceEvent, logTransactionEvent } from './log-handlers';
import { Channel, EventTypes, Forward, ChainTransaction, Invoice } from '../types';
import lnd from './lnd';
import logger from '../config/logger/logger';

const handleEvent = (type: EventTypes, data: any) => {
  switch (type) {
    case EventTypes.FORWARD:
      logForwardEvent(data as Forward);

      break;
    case EventTypes.CHANNEL_CLOSED || EventTypes.CHANNEL_OPENED:
      logChannelEvent(data as Channel, type);

      break;
    case EventTypes.TRANSACTION:
      logTransactionEvent(data as ChainTransaction);

      break;
    case EventTypes.INVOICE:
      logInvoiceEvent(data as Invoice);

      break;

    default:
      break;
  }
};

const initSubscriptions = () => {
  try {
    logger.info('🔔 *Logger started* : Subscribing to LND events');

    const subToForwards = subscribeToForwards({ lnd });
    const subToChannels = subscribeToChannels({ lnd });
    const subToTransactions = subscribeToTransactions({ lnd });
    const subToInvoices = subscribeToInvoices({ lnd });

    subToForwards.on('forward', forward => handleEvent(EventTypes.FORWARD, forward));

    /* Channels */
    subToChannels.on('channel_closed', channel => handleEvent(EventTypes.CHANNEL_CLOSED, channel));
    subToChannels.on('channel_opened', channel => handleEvent(EventTypes.CHANNEL_OPENED, channel));

    /* Transactions */
    subToTransactions.on('chain_transaction', transaction => handleEvent(EventTypes.TRANSACTION, transaction));

    /* Invoices */
    subToInvoices.on('invoice_updated', invoice => handleEvent(EventTypes.INVOICE, invoice));
  } catch (error) {
    console.error(error);
  }
};

export { initSubscriptions };
