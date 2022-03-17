import { AuthenticatedLnd, subscribeToChannels, subscribeToForwards, subscribeToInvoices, subscribeToTransactions } from 'lightning';
import { ChainTransaction, Channel, EventTypes, Invoice } from '../../types';

type Callback = (type: EventTypes, data: unknown) => void;

const forwardSubscription = (lnd: AuthenticatedLnd, callback: Callback) => {
  const subToForwards = subscribeToForwards({ lnd });

  subToForwards.on('forward', forward => callback(EventTypes.FORWARD, forward));
};

const channelSubscription = (lnd: AuthenticatedLnd, callback: Callback) => {
  const subToChannels = subscribeToChannels({ lnd });

  subToChannels.on('channel_closed', (channel: Channel) => callback(EventTypes.CHANNEL_CLOSED, channel));
  subToChannels.on('channel_opened', (channel: Channel) => callback(EventTypes.CHANNEL_OPENED, channel));
};

const transactionSubscription = (lnd: AuthenticatedLnd, callback: Callback) => {
  const subToTransactions = subscribeToTransactions({ lnd });

  subToTransactions.on('chain_transaction', (transaction: ChainTransaction) => callback(EventTypes.TRANSACTION, transaction));
};

const invoiceSubscription = (lnd: AuthenticatedLnd, callback: Callback) => {
  const subToInvoices = subscribeToInvoices({ lnd });

  subToInvoices.on('invoice_updated', (invoice: Invoice) => callback(EventTypes.INVOICE, invoice));
};

export { forwardSubscription, channelSubscription, transactionSubscription, invoiceSubscription };
