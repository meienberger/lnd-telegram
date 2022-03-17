import { getWalletInfo } from 'lightning';
import lnd from './lnd';

const checkLightning = async (): Promise<string> => {
  const wallet = await getWalletInfo({ lnd });

  return wallet.public_key;
};

const initialChecks = async (): Promise<void> => {
  await checkLightning();
};

export default initialChecks;
