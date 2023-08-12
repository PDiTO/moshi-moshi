export type CovalentItem = {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[] | null;
  logo_url: string;
  last_transferred_at: string;
  native_token: boolean;
  type: string;
  is_spam: boolean;
  balance: string;
  balance_24h: string;
  quote_rate: number | null;
  quote_rate_24h: number | null;
  quote: number | null;
  pretty_quote: string | null;
  quote_24h: number | null;
  pretty_quote_24h: string | null;
  nft_data: any | null;
};

export type CovalentTokenData = {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  chain_name: string;
  items: CovalentItem[];
  pagination: any | null;
};
