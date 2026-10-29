import { DetectiveCase } from '../cases/types';

// Declare sql.js window type
declare global {
  interface Window {
    initSqlJs: any;
  }
}

export interface QueryExecutionResult {
  success: boolean;
  columns: string[];
  values: any[][];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
  vietnameseHelp?: string;
  smartCoachAdvice?: string;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private SQL: any = null;
  private db: any = null;
  private currentCaseId: string | null = null;
  private isInitializing: boolean = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getCurrentCaseId(): string | null {
    return this.currentCaseId;
  }

  public async init(): Promise<void> {
    if (this.SQL) return;
    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    this.initPromise = new Promise(async (resolve, reject) => {
      try {
        if (!window.initSqlJs) {
          throw new Error('Thư viện sql.js chưa được tải vào trang.');
        }

        this.SQL = await window.initSqlJs({
          locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
        });

        this.isInitializing = false;
        resolve();
      } catch (err) {
        this.isInitializing = false;
        console.error('Không thể khởi tạo SQLite WebAssembly:', err);
        reject(err);
      }
    });

    return this.initPromise;
  }

  public async loadDatabase(id: string, seedSql: string[]): Promise<void> {
    await this.init();

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
      for (const statement of seedSql) {
        if (statement.trim()) {
          this.db!.run(statement);
        }
      }
      this.currentCaseId = id;
    } catch (err) {
      console.error('Lỗi khi nạp dữ liệu CSDL:', err);
      throw err;
    }
  }

  public async loadCase(detectiveCase: DetectiveCase): Promise<void> {
    return this.loadDatabase(detectiveCase.id, detectiveCase.seedSql);
  }

  /**
   * NHÓM 2: SIẾT CHẶT BỘ MÁY CHẤM BÀI & CHỐNG HACK (Anti-Cheat & Strict Syntax Validator)
   */
  public verifyQuery(
    userSql: string,
    expectedSql: string
  ): {
    isCorrect: boolean;
    userResult: QueryExecutionResult;
    expectedResult: QueryExecutionResult;
    feedback: string;
  } {
    const rawUserSql = userSql.trim();
    const upperUser = rawUserSql.toUpperCase();
    const upperExpected = expectedSql.toUpperCase();

    // 1. Kiểm tra truy vấn trống
    if (!rawUserSql) {
      return {
        isCorrect: false,
        userResult: this.runQuery(''),
        expectedResult: this.runQuery(expectedSql),
        feedback: 'Vui lòng viết câu truy vấn SQL trước khi bấm Kiểm tra kết quả.',
      };
    }

    // 2. Chống Hardcode: Nếu bài tập yêu cầu truy vấn bảng (có FROM) mà học viên không có FROM
    if (upperExpected.includes('FROM ') && !upperUser.includes('FROM ')) {
      const userRes = this.runQuery(rawUserSql);
      return {
        isCorrect: false,
        userResult: userRes,
        expectedResult: this.runQuery(expectedSql),
        feedback: '🚨 PHÁT HIỆN TRUY VẤN HARDCODE! Bạn không được xuất dữ liệu tĩnh mà bắt buộc phải dùng mệnh đề FROM để truy xuất dữ liệu từ bảng thực tế.',
      };
    }

    // 3. Ràng buộc từ khóa bắt buộc theo đề bài (Strict Skill Enforcement)
    const requiredKeywords: { keyword: string; name: string }[] = [];

    if (upperExpected.includes('LEFT JOIN') || upperExpected.includes('INNER JOIN') || upperExpected.includes(' JOIN ')) {
      requiredKeywords.push({ keyword: 'JOIN', name: 'ghép bảng (JOIN)' });
    }
    if (upperExpected.includes('GROUP BY')) {
      requiredKeywords.push({ keyword: 'GROUP BY', name: 'gom nhóm (GROUP BY)' });
    }
    if (upperExpected.includes('HAVING ')) {
      requiredKeywords.push({ keyword: 'HAVING', name: 'lọc nhóm (HAVING)' });
    }
    if (upperExpected.includes('WITH ')) {
      requiredKeywords.push({ keyword: 'WITH', name: 'bảng tạm Common Table Expression (WITH / CTE)' });
    }
    if (upperExpected.includes(' OVER(') || upperExpected.includes(' OVER (')) {
      requiredKeywords.push({ keyword: 'OVER', name: 'hàm cửa sổ (Window Function OVER)' });
    }
    if (upperExpected.includes('CASE ') && upperExpected.includes('WHEN ')) {
      requiredKeywords.push({ keyword: 'CASE', name: 'biểu thức rẽ nhánh (CASE WHEN ... END)' });
    }
    if (upperExpected.includes('UNION ')) {
      requiredKeywords.push({ keyword: 'UNION', name: 'hợp tập hợp (UNION)' });
    }

    for (const req of requiredKeywords) {
      if (!upperUser.includes(req.keyword)) {
        const userRes = this.runQuery(rawUserSql);
        return {
          isCorrect: false,
          userResult: userRes,
          expectedResult: this.runQuery(expectedSql),
          feedback: `⚠️ THIẾU KỸ NĂNG CỐT LÕI! Thử thách này được thiết kế để rèn luyện kỹ năng ${req.name}. Câu lệnh của bạn bắt buộc phải chứa từ khóa '${req.keyword}'.`,
        };
      }
    }

    // 4. Chạy câu truy vấn của học viên và đáp án chuẩn trên cùng database
    const userResult = this.runQuery(rawUserSql);
    const expectedResult = this.runQuery(expectedSql);

    if (!userResult.success) {
      return {
        isCorrect: false,
        userResult,
        expectedResult,
        feedback: `Lỗi truy vấn SQL: ${userResult.error || 'Câu lệnh chưa hợp lệ.'}`,
      };
    }

    if (!expectedResult.success) {
      return {
        isCorrect: false,
        userResult,
        expectedResult,
        feedback: 'Không thể đối chiếu đáp án kỳ vọng của hệ thống. Vui lòng liên hệ ban quản trị.',
      };
    }

    // 5. Đối chiếu số dòng dữ liệu trả về
    if (userResult.rowCount !== expectedResult.rowCount) {
      return {
        isCorrect: false,
        userResult,
        expectedResult,
        feedback: `Kết quả trả về ${userResult.rowCount} dòng, nhưng đáp án chuẩn cần ${expectedResult.rowCount} dòng. Hãy xem lại điều kiện lọc WHERE / HAVING.`,
      };
    }

    // 6. Đối chiếu số lượng cột
    if (userResult.columns.length !== expectedResult.columns.length) {
      return {
        isCorrect: false,
        userResult,
        expectedResult,
        feedback: `Số lượng cột trả về chưa chính xác (trả về ${userResult.columns.length} cột, chuẩn cần ${expectedResult.columns.length} cột). Kiểm tra lại danh sách cột sau SELECT.`,
      };
    }

    // 7. Đối chiếu toàn bộ dữ liệu (từng hàng, từng ô)
    const normalizeCell = (v: any) =>
      v === null || v === undefined ? 'null' : String(v).trim().toLowerCase();

    for (let r = 0; r < userResult.values.length; r++) {
      const uRow = userResult.values[r];
      const eRow = expectedResult.values[r];
      for (let c = 0; c < uRow.length; c++) {
        if (normalizeCell(uRow[c]) !== normalizeCell(eRow[c])) {
          return {
            isCorrect: false,
            userResult,
            expectedResult,
            feedback: `Dữ liệu tại dòng ${r + 1}, cột '${userResult.columns[c]}' chưa khớp (Nhận được: "${uRow[c]}", Kỳ vọng: "${eRow[c]}"). Kiểm tra lại điều kiện lọc hoặc thứ tự ORDER BY.`,
          };
        }
      }
    }

    return {
      isCorrect: true,
      userResult,
      expectedResult,
      feedback: '🎉 CHÍNH XÁC HOÀN TOÀN! Bạn đã làm chủ kiến thức và giải quyết xuất sắc thử thách này.',
    };
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
      const { vietnameseHelp, smartCoachAdvice } = this.translateSqlError(originalError, trimmed);

      return {
        success: false,
        columns: [],
        values: [],
        rowCount: 0,
        executionTimeMs,
        error: originalError,
        vietnameseHelp,
        smartCoachAdvice,
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

  /**
   * NHÓM 5: HỆ THỐNG TRỢ LÝ SƯ PHẠM THÂN THIỆN (Smart Error Coach)
   * Bắt các lỗi phổ biến của SQLite WASM và giải thích bằng sư phạm trực quan
   */
  private translateSqlError(
    error: string,
    userQuery: string
  ): { vietnameseHelp: string; smartCoachAdvice?: string } {
    const lowerErr = error.toLowerCase();
    const upperQuery = userQuery.toUpperCase();

    // 1. Lỗi viết nhầm từ khóa SQL kinh điển
    if (upperQuery.includes(' FORM ')) {
      return {
        vietnameseHelp: 'Phát hiện lỗi chính tả từ khóa: Bạn đang viết "FORM" thay vì "FROM".',
        smartCoachAdvice: '💡 Mẹo nhanh: Sửa chữ FORM thành FROM (ví dụ: SELECT * FROM ten_bang).',
      };
    }
    if (upperQuery.includes(' SELCT ') || upperQuery.includes(' SELEC ')) {
      return {
        vietnameseHelp: 'Phát hiện lỗi chính tả: Bạn gõ nhầm từ khóa SELECT.',
        smartCoachAdvice: '💡 Hãy kiểm tra lại từ đầu tiên trong câu lệnh truy vấn.',
      };
    }
    if (upperQuery.includes(' WHER ')) {
      return {
        vietnameseHelp: 'Phát hiện lỗi chính tả: Bạn gõ nhầm từ khóa WHERE.',
        smartCoachAdvice: '💡 Hãy viết đúng chính tả là WHERE có chữ E ở cuối.',
      };
    }

    // 2. Lỗi dùng hàm tổng hợp Aggregate trong mệnh đề WHERE
    if (lowerErr.includes('misuse of aggregate') || lowerErr.includes('aggregate function')) {
      return {
        vietnameseHelp: 'Lỗi dùng hàm tổng hợp (COUNT, SUM, AVG, MAX, MIN) trong mệnh đề WHERE.',
        smartCoachAdvice: '💡 Nguyên tắc sống còn: Mệnh đề WHERE lọc từng dòng trước khi gom nhóm, nên KHÔNG ĐƯỢC chứa hàm tổng hợp. Nếu bạn muốn lọc nhóm (ví dụ: đếm số đơn > 5), hãy dùng "GROUP BY ... HAVING COUNT(*) > 5"!',
      };
    }

    // 3. Lỗi không tìm thấy bảng
    if (lowerErr.includes('no such table')) {
      const match = error.match(/no such table:\s*(\w+)/i);
      const tbl = match ? match[1] : '';
      return {
        vietnameseHelp: `Không tìm thấy bảng '${tbl}' trong cơ sở dữ liệu vụ án.`,
        smartCoachAdvice: `💡 Kiểm tra lại tab "Sơ đồ CSDL": Tên bảng trong SQL phân biệt chữ hoa/thường, không chứa dấu cách hoặc dấu tiếng Việt. Bạn có gõ thừa hoặc thiếu ký tự nào không?`,
      };
    }

    // 4. Lỗi không tìm thấy cột
    if (lowerErr.includes('no such column')) {
      const match = error.match(/no such column:\s*([\w.]+)/i);
      const col = match ? match[1] : '';
      return {
        vietnameseHelp: `Không tìm thấy cột '${col}' trong bảng bạn đang truy vấn.`,
        smartCoachAdvice: `💡 Mẹo cho Thám tử: Hãy đối chiếu danh sách các cột ở tab Lược Đồ / Sơ Đồ CSDL. Nếu bạn so sánh chuỗi chữ (ví dụ tên đối tượng), hãy chắc chắn đã bọc chữ trong dấu nháy đơn '...', nếu không SQL sẽ tưởng đó là tên một cột!`,
      };
    }

    // 5. Lỗi trùng tên cột trong phép JOIN (Ambiguous column)
    if (lowerErr.includes('ambiguous column name')) {
      const match = error.match(/ambiguous column name:\s*([\w.]+)/i);
      const col = match ? match[1] : '';
      return {
        vietnameseHelp: `Cột '${col}' xuất hiện ở cả hai bảng đang ghép nối (JOIN).`,
        smartCoachAdvice: `💡 Cách sửa: SQLite không biết bạn muốn lấy cột này từ bảng nào. Hãy chỉ rõ tiền tố tên bảng: ví dụ viết "a.${col}" hoặc "ten_bang.${col}" thay vì chỉ viết "${col}".`,
      };
    }

    // 6. Lỗi đảo thứ tự mệnh đề SQL
    const orderIndex = upperQuery.indexOf('ORDER BY');
    const whereIndex = upperQuery.indexOf('WHERE');
    if (orderIndex > -1 && whereIndex > -1 && orderIndex < whereIndex) {
      return {
        vietnameseHelp: 'Thứ tự các mệnh đề SQL bị sai vị trí.',
        smartCoachAdvice: '💡 Cấu trúc chuẩn của SQL: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT. Mệnh đề WHERE bắt buộc phải đứng trước ORDER BY!',
      };
    }

    // 7. Lỗi cú pháp chung (Syntax error)
    if (lowerErr.includes('syntax error')) {
      return {
        vietnameseHelp: 'Lỗi cú pháp câu lệnh SQL.',
        smartCoachAdvice: '💡 Hãy kiểm tra 3 vị trí thường gặp nhất: (1) Thiếu dấu phẩy giữa các cột ở SELECT; (2) Quên đóng dấu nháy đơn \' cho chuỗi văn bản; (3) Quên đóng ngoặc đơn ) trong hàm hoặc phép toán.',
      };
    }

    return {
      vietnameseHelp: 'Đã xảy ra lỗi khi thực thi câu lệnh SQL. Vui lòng kiểm tra lại cấu trúc câu lệnh.',
      smartCoachAdvice: '💡 Thử xem lại phần Manh mối điều tra hoặc tham khảo Sổ tay hướng dẫn để biết cú pháp chính xác.',
    };
  }
}

export const databaseService = DatabaseService.getInstance();
