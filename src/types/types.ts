import { GetInvoiceResult, GetChainTransactionsResult } from 'lightning';

enum EventTypes {
  FORWARD = 'forward',
  CHANNEL_CLOSED = 'channel_closed',
  CHANNEL_OPENED = 'channel_opened',
  TRANSACTION = 'chain_transaction',
  INVOICE = 'invoice_updated',
}

type Forward = {
  in_channel: string;
  out_channel: string;
  tokens: number;
  fee: number;
  is_failed: boolean;
  is_receive: boolean;
  is_send: boolean;
  internal_failure: string;
};

type Channel = {
  capacity: number;
  partner_public_key: string;
  transaction_id: string;

  // Close
  final_local_balance?: number;
  is_partner_closed?: boolean;
  is_cooperative_close?: boolean;
  is_remote_force_close?: boolean;

  // Open
  commit_transaction_fee?: number;
  is_private?: boolean;
  local_balance?: number;
  remote_balance?: number;
};

type ChainTransaction = GetChainTransactionsResult['transactions'][0];

type Invoice = GetInvoiceResult;

export { EventTypes, Forward, Channel, ChainTransaction, Invoice };
