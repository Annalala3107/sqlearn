import initSqlJs, { Database, SqlValue } from 'sql.js';
import { DetectiveCase } from '../cases/types';

export interface QueryExecutionResult {
  success: boolean;
  columns: string[];
  values: SqlValue[][];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
  vietnameseHelp?: string;
}

class DatabaseService {
  private static instance: DatabaseService;
  private SQL: any = null;
  private db: Database | null = null;
  private currentCaseId: string | null = null;
  private isInitializing: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initSql(): Promise<void> {
    if (this.SQL) return;
    if (this.isInitializing) return this.isInitializing;

    this.isInitializing = (async () => {
      try {
        this.SQL = await initSqlJs({
          locateFile: (file) => `/${file}`,
        });
      } catch (err) {
        console.error('Không thể khởi tạo SQLite WebAssembly:', err);
        throw err;
      } finally {
        this.isInitializing = null;
      }
    })();

    return this.isInitializing;
  }

  public async loadCase(detectiveCase: DetectiveCase): Promise<void> {
    await this.initSql();

    if (this.currentCaseId === detectiveCase.id && this.db) {
      return; // Case is already loaded
    }

    if (this.db) {
      try {
        this.db.close();
      } catch (e) {
        console.warn('Đóng db cũ:', e);
      }
      this.db = null;
    }

    this.db = new this.SQL.Database();

    try {
      for (const statement of detectiveCase.seedSql) {
        if (statement.trim()) {
          this.db!.run(statement);
        }
      }
      this.currentCaseId = detectiveCase.id;
    } catch (err) {
      console.error('Lỗi khi nạp dữ liệu vụ án:', err);
      throw err;
    }
  }

  public runQuery(sql: string): QueryExecutionResult {
    if (!this.db) {
      return {
        success: false,
        columns: [],
        values: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: 'Cơ sở dữ liệu vụ án chưa được khởi tạo.',
        vietnameseHelp: 'Vui lòng chọn hoặc làm mới lại hồ sơ vụ án.',
      };
    }

    const trimmed = sql.trim();
    if (!trimmed) {
      return {
        success: false,
        columns: [],
        values: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: 'Truy vấn SQL trống.',
        vietnameseHelp: 'Hãy viết một câu lệnh SQL (ví dụ: SELECT * FROM hien_truong;).',
      };
    }

    const startTime = performance.now();

    try {
      const results = this.db.exec(trimmed);
      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

      if (!results || results.length === 0) {
        return {
          success: true,
          columns: [],
          values: [],
          rowCount: 0,
          executionTimeMs,
        };
      }

      // Return the result of the last executed statement in the batch
      const lastResult = results[results.length - 1];
      return {
        success: true,
        columns: lastResult.columns,
        values: lastResult.values,
        rowCount: lastResult.values.length,
        executionTimeMs,
      };
    } catch (err: any) {
      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      const originalError = err?.message || String(err);
      const vietnameseHelp = this.translateSqlError(originalError);

      return {
        success: false,
        columns: [],
        values: [],
        rowCount: 0,
        executionTimeMs,
        error: originalError,
        vietnameseHelp,
      };
    }
  }

  public getTablePreview(tableName: string, limit: number = 5): QueryExecutionResult {
    return this.runQuery(`SELECT * FROM ${tableName} LIMIT ${limit};`);
  }

  public getTableCount(tableName: string): number {
    if (!this.db) return 0;
    try {
      const res = this.db.exec(`SELECT COUNT(*) as cnt FROM ${tableName};`);
      if (res && res[0] && res[0].values[0]) {
        return Number(res[0].values[0][0]);
      }
    } catch (e) {
      console.warn('Không thể đếm số dòng bảng:', tableName, e);
    }
    return 0;
  }

  private translateSqlError(error: string): string {
    const lower = error.toLowerCase();
    if (lower.includes('no such table')) {
      const match = error.match(/no such table:\s*(\w+)/i);
      const tbl = match ? match[1] : '';
      return `Không tìm thấy bảng '${tbl}'. Hãy kiểm tra lại tên bảng ở cột 'Lược đồ CSDL' bên trái (chú ý phân biệt chữ hoa/thường hoặc gõ sai chính tả).`;
    }
    if (lower.includes('no such column')) {
      const match = error.match(/no such column:\s*(\w+)/i);
      const col = match ? match[1] : '';
      return `Không tìm thấy cột '${col}'. Hãy đối chiếu với danh sách các cột trong bảng bạn đang truy vấn.`;
    }
    if (lower.includes('syntax error')) {
      return `Lỗi cú pháp SQL. Kiểm tra lại dấu phẩy, dấu nháy đơn '', hoặc từ khóa như SELECT, FROM, WHERE, JOIN có bị gõ nhầm hay thiếu không.`;
    }
    if (lower.includes('ambiguous column name')) {
      return `Tên cột bị trùng lặp giữa hai bảng trong phép JOIN. Hãy đặt tiền tố tên bảng trước tên cột (ví dụ: nhan_vien.id thay vì chỉ viết id).`;
    }
    return 'Đã xảy ra lỗi khi thực thi câu lệnh SQL. Vui lòng kiểm tra lại cấu trúc câu lệnh.';
  }
}

export const databaseService = DatabaseService.getInstance();
