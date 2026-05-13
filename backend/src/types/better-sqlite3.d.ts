declare module 'better-sqlite3' {
  interface RunResult {
    changes: number;
    lastInsertRowid: number;
  }

  interface Statement {
    run(...params: any[]): RunResult;
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }

  class Database {
    constructor(filename: string, options?: { readonly?: boolean });
    prepare(sql: string): Statement;
    close(): void;
  }

  export = Database;
}
