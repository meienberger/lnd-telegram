type ForwardEventArgs = {
  tokens: number;
  fee: number;
  failure?: string;
  inc?: string;
  outc?: string;
};

// Invoices events
const INVOICE_CREATED_MESSAGE = (tokens: number) => `๐งพ *New invoice created*\n*Amount*: ${tokens?.toLocaleString('en-EN')}`;
const INVOICE_PAID_MESSAGE = (tokens: number) => `โ *Invoice has been paid*\n*Amount*: ${tokens?.toLocaleString('en-EN')}`;
const INVOICE_CANCELED = (tokens: number) => `โ *Invoice canceled*\n*Amount*: ${tokens?.toLocaleString('en-EN')}`;

// Forward events
const FORWARD_FAILED = ({ tokens, fee, inc, outc, failure }: ForwardEventArgs) => {
  return `โ *Failed Forward event*\n*In Channel*: ${inc}\n*Out Channel*: ${outc}\n*Tokens*: ${tokens?.toLocaleString('en-EN')}\n*Fee*: ${fee.toLocaleString('en-EN')}${failure}`;
};

const FORWARD_SUCCESS = ({ tokens, fee, inc, outc }: ForwardEventArgs) => {
  return `๐ *New Forward event*\n*In Channel*: ${inc}\n*Out Channel*: ${outc}\n*Tokens*: ${tokens?.toLocaleString('en-EN')}\n*Fee*: ${fee.toLocaleString('en-EN')}`;
};

// Channel events
const CHANNEL_OPENED = (partner?: string, capacity?: string, balance?: string) => `๐ *Channel opened*\n*Partner*: ${partner}\n*Capacity*: ${capacity}\n*Local balance*: ${balance}`;
const CHANNEL_CLOSED = (partner?: string, capacity?: string, balance?: string) => `๐ *Channel closed*\n*Partner*: ${partner}\n*Capacity*: ${capacity}\n*Final local balance*: ${balance}`;

// Chain transaction events
const CHAIN_OUTGOING = (tokens: string, id: string) => `๐ *New outgoing chain transaction*\n*Amount*: ${tokens}\n[See in explorer](https://mempool.space/tx/${id})`;
const CHAIN_CONFIRMED = (tokens: string, id: string) => `โ *Transaction confirmed*\n*Amount*: ${tokens}\n[See in explorer](https://mempool.space/tx/${id})`;
const CHAIN_INCOMING = (tokens: string, id: string) => `๐ *New incoming chain transaction*\n*Amount*: ${tokens}\n[See in explorer](https://mempool.space/tx/${id})`;

export { INVOICE_CREATED_MESSAGE, INVOICE_PAID_MESSAGE, INVOICE_CANCELED, FORWARD_FAILED, CHANNEL_OPENED, CHANNEL_CLOSED, FORWARD_SUCCESS, CHAIN_OUTGOING, CHAIN_CONFIRMED, CHAIN_INCOMING };
