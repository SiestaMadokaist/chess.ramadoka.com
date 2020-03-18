export enum ST {
  CUSTOMER_NAME = 'CUSTOMER_NAME',
  LAMBDA_ENV = 'LAMBDA_ENV',
  CUSTOMER_ADDRESS = 'CUSTOMER_ADDRESS',
  PUBLIC_KEY = 'PUBLIC_KEY',
  YYYY_MM_DD = 'YYYY_MM_DD',
  PRIVATE_KEY = 'PRIVATE_KEY',
  ADDRESS = 'CRYPTO_ADDRESS',
  PRODUCT_CODE = 'PRODUCT_CODE',
  PRODUCT_NAME = 'PRODUCT_NAME',
  HEXADECIMAL = 'HEXADECIMAL',
  REDEEM_SCRIPT = 'REDEEM_SCRIPT',
  CRYPTOKET_UNIT = 'CRYPTOKET_UNIT',
  MERCHANT_REF_CODE = 'MERCHANT_REF_CODE',
  YYYY_MM_DD_HH_MM_SS = 'YYYY_MM_DD_HH_MM_SS',
  JSON = 'JSON',
  NUMBER = 'NUMBER',
  /**
   * @description
   * typing for a phone-number that match the format of:
   * /+\d+/
   * e.g: +628123456789
   */
  PHONE_NUMBER = 'PHONE_NUMBER',
  /**
   * @description
   * typing for a phone-number that only consist of phone number
   * start with country code
   * e.g: 628123456789
   */
  PHONE_NUMBER_NUMBER_ONLY = 'PHONE_NUMBER_NUMBER_ONLY',
  TXID = 'TXID',
  TX_STATEMENT = 'TX_STATEMENT',
  BTC_ADDRESS_B58 = 'BTC_ADDRESS_B58',
}

export enum UNIT {
  SATOSHI = 'SATOSHI',
  BITCOIN = 'BITCOIN',
}

export enum NT {
  TX_VOUT = 'TX_VOUT',
  MILLISECOND = 'MILLISECOND',
  SECOND = 'SECOND',
  SATOSHI_AMOUNT = 'SATOSHI_AMOUNT',
  BITCOIN_AMOUNT = 'BITCOIN_AMOUNT',
  IDR_AMOUNT = 'IDR_AMOUNT',
  TIMESTAMP = 'TIMESTAMP',
  TS_MILLI = 'TS_MILLI',
}

export type Mutable<T> = {
  -readonly [k in keyof T]: T[k]
};

export type PaginationQuery<T = unknown> = T & { before?: Date, limit?: number };
export type STK = (keyof typeof ST);
export type NTK = (keyof typeof NT);
export type PhantomString<T extends ST> = string & { '__@phantomId'?: T, '__@phantomType'?: 'PhantomString' };
export type PhantomNumber<T extends NT> = number & { '__@phantomId'?: T, '__@phantomType'?: 'PHantomNumber' };
