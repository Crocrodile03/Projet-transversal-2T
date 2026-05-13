declare module 'better-sqlite3' {
  interface RunResult {
    changes: number;
    lastInsertRowid: number;
  }

  interface Database {
    prepare(sql: string): Statement;
    close(): void;
  }

  interface Statement {
    run(...params: any[]): RunResult;
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }

  export default class Database {
    constructor(filename: string, options?: { readonly?: boolean });
    prepare(sql: string): Statement;
    close(): void;
  }
}
