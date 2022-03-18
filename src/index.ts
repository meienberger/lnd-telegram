import initialChecks from './core/checks';
import lnd from './core/lnd';
import { channelSubscription, forwardSubscription, handleSubscriptonEvent, invoiceSubscription, transactionSubscription } from './modules/subscriptions';

const main = async () => {
  try {
    await initialChecks();
  } catch {
    console.error('⚠️ Unable to connect to LND instance');
  }

  forwardSubscription(lnd, handleSubscriptonEvent);
  channelSubscription(lnd, handleSubscriptonEvent);
  transactionSubscription(lnd, handleSubscriptonEvent);
  invoiceSubscription(lnd, handleSubscriptonEvent);
};

main();
