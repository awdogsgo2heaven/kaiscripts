////////////////////////////////////////
// Requires pg-promise v3.7.0 or later.
////////////////////////////////////////

/// <reference path="./pg.d.ts" />
/// <reference path="./pg-minify.d.ts" />

declare module "pg-promise" {

  import * as pg from "pg";
  import * as pgMinify from "pg-minify";

  // Base database protocol
  // API: http://vitaly-t.github.io/pg-promise/Database.html
  interface BaseProtocol {

    // generic query method;
    query(query: any, values?: any, qrm?: pgPromise.queryResult): Promise<Object|Object[]|void>;

    // result-specific methods;
    none(query: any, values?: any): Promise<void>;
    one(query: any, values?: any): Promise<Object>;
    oneOrNone(query: any, values?: any): Promise<Object|void>;
    many(query: any, values?: any): Promise<Object[]>;
    manyOrNone(query: any, values?: any): Promise<Object[]>;
    any(query: any, values?: any): Promise<Object[]>;

    result(query: any, values?: any): Promise<pg.Result>;

    stream(qs: Object, init: Function): Promise<{ processed: number, duration: number }>;

    func(funcName: string, values?: any[]| any, qrm?: pgPromise.queryResult): Promise<Object|Object[]|void>;
    proc(procName: string, values?: any[]| any): Promise<Object|void>;

    task(cb: TaskCallback): Promise<any>;
    task(tag: any, cb: TaskCallback): Promise<any>;

    tx(cb: TaskCallback): Promise<any>;
    tx(tag: any, cb: TaskCallback): Promise<any>;
  }

  // Database full protocol;
  // API: http://vitaly-t.github.io/pg-promise/Database.html
  interface Database extends BaseProtocol {
    connect(): Promise<Connection>;
  }

  // Database connected manually;
  interface Connection extends BaseProtocol {
    done(): void;
  }

  interface TaskCallback {
    (t: Task): any;
  }

  // Task/Transaction interface;
  // API: http://vitaly-t.github.io/pg-promise/Task.html
  interface Task extends BaseProtocol {

    // SPEX API: https://github.com/vitaly-t/spex/blob/master/docs/code/batch.md
    batch(values: any[], cb?: Function): Promise<any[]>;
    batch(values: any[], options: { cb?: Function }): Promise<any[]>;

    // SPEX API: https://github.com/vitaly-t/spex/blob/master/docs/code/page.md
    page(source: Function, dest?: Function, limit?: number): Promise<{ pages: number, total: number, duration: number }>;
    page(source: Function, options: { dest?: Function, limit?: number }): Promise<{ pages: number, total: number, duration: number }>;

    // SPEX API: https://github.com/vitaly-t/spex/blob/master/docs/code/sequence.md
    sequence(source: Function, dest?: Function, limit?: number, track?: boolean): Promise<any>;
    sequence(source: Function, options: { dest?: Function, limit?: number, track?: boolean }): Promise<any>;

    ctx: TaskContext;
  }

  // Query formatting namespace;
  // API: http://vitaly-t.github.io/pg-promise/formatting.html
  interface Formatting {
    array(arr: any[]): string;

    bool(value: any): string;

    buffer(obj: Object, raw?: boolean): string;

    csv(values: any): string;

    date(d: Date|Function, raw?: boolean): string;

    format(query: string, values?: any, options?: { partial?: boolean }): string;

    func(func: Function, raw?: boolean, obj?: Object): string;

    json(obj: any, raw?: boolean): string;

    name(name: string|Function): string;

    number(value: number|Function): string;

    text(value: any, raw?: boolean): string;

    value(value: any): string;
  }

  // Generic Event Context interface;
  // See: http://vitaly-t.github.io/pg-promise/global.html#event:query
  interface EventContext {
    client: pg.Client;
    cn?: any;
    query?: any;
    params?: any;
    ctx?: TaskContext;
  }

  // Event context extension for tasks/transactions;
  // See: http://vitaly-t.github.io/pg-promise/global.html#event:query
  interface TaskContext {
    isTX: boolean;
    start: Date;
    finish?: Date;
    tag?: any;
    success?: boolean;
    result?: any;
    context?: Object;
  }

  // Database connection configuration interface;
  // See: https://github.com/brianc/node-postgres/blob/master/lib/connection-parameters.js#L36
  interface Config {
    host?: string,
    port?: number,
    database: string,
    user?: string,
    password?: string,
    ssl?: boolean,
    binary?: boolean,
    client_encoding?: string,
    application_name?: string,
    fallback_application_name?: string
  }

  // Transaction Isolation Level;
  // API: http://vitaly-t.github.io/pg-promise/global.html#isolationLevel
  enum isolationLevel {
    none = 0,
    serializable = 1,
    repeatableRead = 2,
    readCommitted = 3
  }

  // Transaction Mode class;
  // API: http://vitaly-t.github.io/pg-promise/TransactionMode.html
  class TransactionMode {
    constructor(tiLevel?: isolationLevel, readOnly?: boolean, deferrable?: boolean);
    constructor(options: { tiLevel?: isolationLevel, readOnly?: boolean, deferrable?: boolean });
  }

  // Query Result Error;
  // API: http://vitaly-t.github.io/pg-promise/QueryResultError.html
  class QueryResultError implements Error {
    name: string;
    message: string;
    result: pg.Result;
    received: number;
    code: queryResultErrorCode;
    query: string;
    values: any;
  }

  // Query Result Error Code;
  // API: http://vitaly-t.github.io/pg-promise/global.html#queryResultErrorCode
  enum queryResultErrorCode {
    noData = 0,
    notEmpty = 1,
    multiple = 2
  }

  // Errors namespace
  // API: http://vitaly-t.github.io/pg-promise/errors.html
  interface Errors {
    QueryResultError: typeof QueryResultError;
    queryResultErrorCode: typeof queryResultErrorCode;
  }

  // Transaction Mode namespace;
  // API: http://vitaly-t.github.io/pg-promise/txMode.html
  interface TXMode {
    isolationLevel: typeof isolationLevel,
    TransactionMode: typeof TransactionMode
  }

  // Post-initialization interface;
  // API: http://vitaly-t.github.io/pg-promise/module-pg-promise.html
  interface pgMain {
    (cn: string|Config): Database,
    PromiseAdapter: typeof pgPromise.PromiseAdapter;
    QueryFile: typeof pgPromise.QueryFile;
    queryResult: typeof pgPromise.queryResult;
    minify: typeof pgMinify,
    errors: Errors;
    txMode: TXMode;
    as: Formatting;
    end: Function,
    pg: pg.PG
  }

  // Main protocol of the library;
  // API: http://vitaly-t.github.io/pg-promise/module-pg-promise.html
  namespace pgPromise {
    export var minify: typeof pgMinify;

        // Query Result Mask;
        // API: http://vitaly-t.github.io/pg-promise/global.html#queryResult
        export enum queryResult {
    one = 1,
    many = 2,
    none = 4,
    any = 6
  }

  // Query File class;
  // API: http://vitaly-t.github.io/pg-promise/QueryFile.html
  export class QueryFile {
    constructor(file: string, options?: {
      debug?: boolean,
      minify?: boolean|'after',
      compress?: boolean,
      params?: any
            });
}

// Promise Adapter class;
// API: http://vitaly-t.github.io/pg-promise/PromiseAdapter.html
export class PromiseAdapter {
  constructor(create: (cb) => Object, resolve: (data: any) => void, reject: (reason: any) => void);
}

export var txMode: TXMode;
export var errors: Errors;
export var as: Formatting;

    }

// Default library interface (before initialization)
// API: http://vitaly-t.github.io/pg-promise/module-pg-promise.html
function pgPromise(options?: {
  pgFormatting?: boolean;
  pgNative?: boolean,
  promiseLib?: any;
  connect?: (client: pg.Client) => void;
  disconnect?: (client: pg.Client) => void;
  query?: (e: EventContext) => void;
  receive?: (data: any[], result: any, e: EventContext) => void;
  task?: (e: EventContext) => void;
  transact?: (e: EventContext) => void;
  error?: (err: any, e: EventContext) => void;
  extend?: (obj: any) => void;
  noLocking?: boolean;
  capSQL?: boolean;
}): pgMain;

export =pgPromise;

}
