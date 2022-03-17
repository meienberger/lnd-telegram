const INVOICE_CREATED_MESSAGE = (tokens: number) => `🧾 *New invoice created*\n*Amount*: ${tokens?.toLocaleString('en-EN')}`;
const INVOICE_PAID_MESSAGE = (tokens: number) => `✅ *Invoice has been paid*\n*Amount*: ${tokens?.toLocaleString('en-EN')}`;
const INVOICE_CANCELED = (tokens: number) => `❌ *Invoice canceled*\n*Amount*: ${tokens?.toLocaleString('en-EN')}`;

export { INVOICE_CREATED_MESSAGE, INVOICE_PAID_MESSAGE, INVOICE_CANCELED };
