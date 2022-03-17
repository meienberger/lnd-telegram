import initialChecks from './core/checks';
import { initSubscriptions } from './core/subscriptions';

const main = async () => {
  try {
    await initialChecks();
  } catch (error) {
    console.error(error);
  }

  initSubscriptions();
};

main();
