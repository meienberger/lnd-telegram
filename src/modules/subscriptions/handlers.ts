import { logChannelEvent, logForwardEvent, logInvoiceEvent, logTransactionEvent } from '../logger/handlers';
import { ChainTransaction, Channel, EventTypes, Forward, Invoice } from '../../types';
import { telegramLogger } from '../logger';

const handleSubscriptonEvent = (type: EventTypes, data: unknown) => {
  switch (type) {
    case EventTypes.FORWARD:
      logForwardEvent(data as Forward, telegramLogger);

      break;
    case EventTypes.CHANNEL_CLOSED || EventTypes.CHANNEL_OPENED:
      logChannelEvent(data as Channel, type, telegramLogger);

      break;
    case EventTypes.TRANSACTION:
      logTransactionEvent(data as ChainTransaction, telegramLogger);

      break;
    case EventTypes.INVOICE:
      logInvoiceEvent(data as Invoice, telegramLogger);

      break;

    default:
      break;
  }
};

export { handleSubscriptonEvent };
