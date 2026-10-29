import { Lesson } from './types';

export const allLessons: Lesson[] = [
  // =========================================================================
  // GIAI ĐOẠN 1: NHẬP MÔN (BEGINNER)
  // =========================================================================
  {
    id: 'sql-101',
    order: 1,
    stage: 'beginner',
    stageTitle: 'Giai Đoạn 1: Nhập Môn',
    title: 'Khám Phá CSDL & Lệnh SELECT, FROM',
    subtitle: 'Nắm vững câu lệnh khai báo nền tảng đầu tiên trong SQL',
    category: 'Truy Vấn Căn Bản',
    timeEstimate: '10 phút',
    xpReward: 50,
    concept: `
### 1. Cơ sở dữ liệu quan hệ (RDBMS) là gì?
Cơ sở dữ liệu quan hệ lưu trữ dữ liệu dưới dạng các **bảng (Tables)** gồm:
- **Hàng (Rows / Records):** Đại diện cho một đối tượng cụ thể (ví dụ: một cuốn sách, một người dùng).
- **Cột (Columns / Fields):** Đại diện cho các thuộc tính đặc trưng (ví dụ: tên, giá tiền, ngày tạo).

### 2. Tư duy khai báo của SQL
SQL là ngôn ngữ khai báo (*Declarative*): Bạn **không cần chỉ định máy tính phải chạy vòng lặp for/while như thế nào**, bạn chỉ cần khai báo **dữ liệu bạn muốn nhận được là gì**:
\`\`\`sql
SELECT cot_1, cot_2 FROM ten_bang;
\`\`\`
Dấu sao (\`*\`) đại diện cho việc lấy toàn bộ tất cả các cột của bảng.
    `,
    syntaxExample: `-- Lấy tất cả thông tin
SELECT * FROM san_pham;

-- Chỉ lấy các cột cần thiết (Khuyên dùng để tối ưu hiệu năng)
SELECT ten_san_pham, gia_niem_yet FROM san_pham;`,
    schemas: [
      {
        name: 'san_pham',
        description: 'Bảng quản lý danh mục sản phẩm đồ công nghệ',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã định danh sản phẩm' },
          { name: 'ten_san_pham', type: 'TEXT', description: 'Tên thương mại sản phẩm' },
          { name: 'danh_muc', type: 'TEXT', description: 'Phân loại hàng hóa' },
          { name: 'gia_niem_yet', type: 'INTEGER', description: 'Giá bán đề xuất (VNĐ)' },
          { name: 'so_luong_kho', type: 'INTEGER', description: 'Số lượng tồn trong kho' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE san_pham (
        id INTEGER PRIMARY KEY,
        ten_san_pham TEXT NOT NULL,
        danh_muc TEXT NOT NULL,
        gia_niem_yet INTEGER NOT NULL,
        so_luong_kho INTEGER NOT NULL
      );`,
      `INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia_niem_yet, so_luong_kho) VALUES
        (1, 'Bàn phím cơ Không dây K3', 'Phụ kiện', 1850000, 45),
        (2, 'Chuột công thái học Master 3S', 'Phụ kiện', 2490000, 30),
        (3, 'Màn hình UltraSharp 27 inch', 'Màn hình', 11500000, 12),
        (4, 'Tai nghe Chống ồn WH-1000XM5', 'Âm thanh', 8490000, 20),
        (5, 'Đèn kẹp màn hình chống cận', 'Phụ kiện', 890000, 60);`,
    ],
    exercise: {
      goal: 'Trích xuất tên và giá bán của toàn bộ sản phẩm trong kho hàng',
      taskDescription:
        'Viết câu truy vấn SQL trích xuất danh sách gồm 2 cột: `ten_san_pham` và `gia_niem_yet` từ bảng `san_pham`.',
      starterQuery: `-- Bài 1.1: Trích xuất tên sản phẩm và giá niêm yết\nSELECT `,
      expectedQuery: `SELECT ten_san_pham, gia_niem_yet FROM san_pham;`,
      hints: [
        'Dùng câu lệnh SELECT theo sau là tên 2 cột cách nhau bởi dấu phẩy (,).',
        'Cú pháp chuẩn: SELECT ten_san_pham, gia_niem_yet FROM san_pham;',
      ],
      explanation:
        'Chính xác! Lựa chọn chính xác các cột cần lấy thay vì SELECT * giúp giảm thiểu băng thông mạng và tối ưu tốc độ đọc bộ nhớ của CSDL.',
    },
    quizzes: [
      {
        question: 'Dấu sao (*) trong câu lệnh "SELECT * FROM nhan_vien;" có ý nghĩa gì?',
        options: [
          'Chỉ lấy dòng đầu tiên của bảng',
          'Lấy tất cả các cột trong bảng',
          'Đếm tổng số bản ghi trong bảng',
          'Nhân đôi giá trị của tất cả các cột số',
        ],
        answerIndex: 1,
        explanation: 'Dấu sao (*) trong mệnh đề SELECT là ký tự đại diện (wildcard) chỉ thị việc lấy toàn bộ các cột của bảng dữ liệu.',
      },
    ],
  },

  {
    id: 'sql-102',
    order: 2,
    stage: 'beginner',
    stageTitle: 'Giai Đoạn 1: Nhập Môn',
    title: 'Lọc Dữ Liệu Có Điều Kiện Với WHERE',
    subtitle: 'Sử dụng toán tử so sánh để trích xuất chính xác bản ghi mong muốn',
    category: 'Bộ Lọc Dữ Liệu',
    timeEstimate: '12 phút',
    xpReward: 60,
    concept: `
### Mệnh đề WHERE lọc bản ghi như thế nào?
Mệnh đề \`WHERE\` kiểm tra điều kiện logic trên từng hàng dữ liệu:
- Nếu điều kiện trả về \`TRUE\`: Bản ghi được giữ lại trong kết quả.
- Nếu trả về \`FALSE\` hoặc \`NULL\`: Bản ghi bị loại bỏ.

### Các toán tử so sánh phổ biến:
- \`=\`: Bằng nhau.
- \`<>\` hoặc \`!=\`: Khác nhau.
- \`>\`, \`<\`, \`>=\`, \`<=\`: So sánh lớn hơn, nhỏ hơn.
- \`BETWEEN a AND b\`: Nằm trong đoạn từ a đến b (bao gồm cả a và b).
    `,
    syntaxExample: `-- Lấy các đơn hàng có giá trị trên 1 triệu đồng
SELECT ma_don, tong_tien 
FROM don_hang 
WHERE tong_tien >= 1000000;

-- Lọc khách hàng trong độ tuổi thanh niên
SELECT ho_ten, tuoi 
FROM khach_hang 
WHERE tuoi BETWEEN 18 AND 25;`,
    schemas: [
      {
        name: 'don_hang',
        description: 'Bảng theo dõi giao dịch bán lẻ',
        columns: [
          { name: 'ma_don', type: 'TEXT PRIMARY KEY', description: 'Mã đơn hàng duy nhất' },
          { name: 'khach_hang', type: 'TEXT', description: 'Tên người mua' },
          { name: 'gia_tri', type: 'INTEGER', description: 'Giá trị đơn hàng (VNĐ)' },
          { name: 'trang_thai', type: 'TEXT', description: 'Trạng thái thanh toán' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE don_hang (
        ma_don TEXT PRIMARY KEY,
        khach_hang TEXT NOT NULL,
        gia_tri INTEGER NOT NULL,
        trang_thai TEXT NOT NULL
      );`,
      `INSERT INTO don_hang VALUES
        ('DH-01', 'Trần Văn An', 450000, 'ĐÃ GIAO'),
        ('DH-02', 'Lê Thị Bình', 1200000, 'ĐÃ GIAO'),
        ('DH-03', 'Hoàng Minh Tuấn', 2500000, 'CHỜ XỬ LÝ'),
        ('DH-04', 'Đặng Thu Thảo', 850000, 'ĐÃ HỦY'),
        ('DH-05', 'Ngô Quốc Bảo', 3100000, 'ĐÃ GIAO');`,
    ],
    exercise: {
      goal: 'Lọc các đơn hàng có giá trị từ 1,000,000 VNĐ trở lên',
      taskDescription:
        'Viết câu lệnh SQL trích xuất tất cả các cột (`*`) từ bảng `don_hang` với điều kiện `gia_tri >= 1000000`.',
      starterQuery: `-- Lọc đơn hàng có giá trị >= 1 triệu VNĐ\nSELECT * FROM don_hang WHERE `,
      expectedQuery: `SELECT * FROM don_hang WHERE gia_tri >= 1000000;`,
      hints: [
        'Sử dụng toán tử so sánh >= sau cột gia_tri.',
        'Cú pháp hoàn chỉnh: SELECT * FROM don_hang WHERE gia_tri >= 1000000;',
      ],
      explanation:
        'Tuyệt vời! Bạn đã lọc thành công các đơn hàng thỏa mãn điều kiện ngân sách.',
    },
    quizzes: [
      {
        question: 'Điều kiện "tuoi BETWEEN 20 AND 30" có lấy những người đúng 20 tuổi và 30 tuổi không?',
        options: [
          'Có, toán tử BETWEEN bao gồm cả hai mốc giá trị biên',
          'Không, chỉ lấy từ 21 đến 29',
          'Chỉ lấy 20 tuổi, không lấy 30 tuổi',
          'Tùy thuộc vào phiên bản CSDL',
        ],
        answerIndex: 0,
        explanation: 'Toán tử BETWEEN a AND b trong chuẩn ANSI SQL tương đương với điều kiện: val >= a AND val <= b (bao gồm cả hai biên).',
      },
    ],
  },

  {
    id: 'sql-103',
    order: 3,
    stage: 'beginner',
    stageTitle: 'Giai Đoạn 1: Nhập Môn',
    title: 'Lọc Nâng Cao Với LIKE, IN & IS NULL',
    subtitle: 'Tìm kiếm chuỗi gần đúng và xử lý giá trị khuyết thiếu trong CSDL',
    category: 'Bộ Lọc Dữ Liệu',
    timeEstimate: '15 phút',
    xpReward: 70,
    concept: `
### 1. Khớp chuỗi mờ với toán tử LIKE
- Ký tự \`%\`: Đại diện cho 0, 1 hoặc nhiều ký tự bất kỳ.
  - \`LIKE 'Nguyễn%'\`: Bắt đầu bằng chữ "Nguyễn".
  - \`LIKE '%gmail.com'\`: Kết thúc bằng đuôi "gmail.com".
  - \`LIKE '%VIP%'\`: Chứa chữ "VIP" ở bất kỳ vị trí nào.

### 2. Danh sách lựa chọn với IN
Thay vì viết chuỗi \`OR\` dài dòng (\`tp = 'HN' OR tp = 'SG' OR tp = 'DN'\`), bạn viết ngắn gọn:
\`\`\`sql
WHERE thanh_pho IN ('Hà Nội', 'TP.HCM', 'Đà Nẵng');
\`\`\`

### 3. Kiểm tra giá trị rỗng NULL
Trong CSDL quan hệ, \`NULL\` nghĩa là **dữ liệu chưa được ghi nhận**. Không thể so sánh bằng \`= NULL\`, bắt buộc phải dùng:
\`\`\`sql
WHERE so_dien_thoai IS NULL;
WHERE so_dien_thoai IS NOT NULL;
\`\`\`
    `,
    syntaxExample: `-- Tìm khách hàng chưa đăng ký số điện thoại và ở Hà Nội
SELECT ho_ten, email 
FROM khach_hang 
WHERE so_dien_thoai IS NULL 
  AND thanh_pho = 'Hà Nội';`,
    schemas: [
      {
        name: 'khach_hang',
        description: 'Bảng quản lý hồ sơ thông tin khách hàng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã khách hàng' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên đầy đủ' },
          { name: 'email', type: 'TEXT', description: 'Địa chỉ thư điện tử' },
          { name: 'thanh_pho', type: 'TEXT', description: 'Tỉnh/Thành phố sinh sống' },
          { name: 'so_dien_thoai', type: 'TEXT', description: 'Số liên hệ (có thể rỗng)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE khach_hang (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT NOT NULL,
        email TEXT NOT NULL,
        thanh_pho TEXT NOT NULL,
        so_dien_thoai TEXT
      );`,
      `INSERT INTO khach_hang VALUES
        (1, 'Nguyễn Anh Dũng', 'dung.nguyen@fpt.edu.vn', 'Hà Nội', '0912345678'),
        (2, 'Trần Thu Hà', 'ha.tran@gmail.com', 'TP.HCM', NULL),
        (3, 'Nguyễn Thị Mai', 'mai.nguyen@yahoo.com', 'Đà Nẵng', '0987654321'),
        (4, 'Phạm Quốc Cường', 'cuong.pham@fpt.edu.vn', 'Hà Nội', NULL),
        (5, 'Đỗ Mỹ Linh', 'linh.do@gmail.com', 'Hải Phòng', '0905123987');`,
    ],
    exercise: {
      goal: 'Tìm khách hàng họ "Nguyễn" và chưa cập nhật số điện thoại',
      taskDescription:
        "Viết câu lệnh SELECT trích xuất các khách hàng có họ bắt đầu bằng 'Nguyễn%' đồng thời số điện thoại bị rỗng (`so_dien_thoai IS NULL`).",
      starterQuery: `-- Tìm khách hàng họ Nguyễn chưa có SĐT\nSELECT * FROM khach_hang \nWHERE `,
      expectedQuery: `SELECT * FROM khach_hang WHERE ho_ten LIKE 'Nguyễn%' AND so_dien_thoai IS NULL;`,
      hints: [
        "Sử dụng toán tử ho_ten LIKE 'Nguyễn%'",
        "Kết hợp toán tử AND so_dien_thoai IS NULL (chú ý: không viết = NULL).",
      ],
      explanation:
        'Xuất sắc! Bạn đã hiểu rõ cách phối hợp phép lọc chuỗi ký tự đại diện và xử lý giá trị NULL.',
    },
    quizzes: [
      {
        question: 'Tại sao câu lệnh "WHERE so_dien_thoai = NULL" không bao giờ trả về dữ liệu?',
        options: [
          'Vì trong SQL, NULL đại diện cho giá trị chưa biết (unknown), mọi phép so sánh với toán tử = đều trả về UNKNOWN',
          'Vì SQLite không hỗ trợ giá trị NULL',
          'Vì từ khóa NULL phải viết trong dấu nháy đơn',
          'Vì lệnh WHERE chỉ hỗ trợ số nguyên',
        ],
        answerIndex: 0,
        explanation: 'Theo chuẩn SQL ba giá trị logic (Three-valued logic), bất kỳ phép so sánh bằng (=) nào với NULL đều sinh ra UNKNOWN (không phải TRUE), do đó phải dùng IS NULL.',
      },
    ],
  },

  {
    id: 'sql-104',
    order: 4,
    stage: 'beginner',
    stageTitle: 'Giai Đoạn 1: Nhập Môn',
    title: 'Sắp Xếp ORDER BY & Phân Trang Với LIMIT, OFFSET',
    subtitle: 'Sắp xếp dữ liệu theo thứ tự ưu tiên và chia trang hiển thị giao diện',
    category: 'Sắp Xếp & Phân Trang',
    timeEstimate: '12 phút',
    xpReward: 60,
    concept: `
### 1. Sắp xếp thứ tự với ORDER BY
- \`ASC\` (Mặc định): Sắp xếp tăng dần (từ nhỏ đến lớn, A $\\rightarrow$ Z).
- \`DESC\`: Sắp xếp giảm dần (từ lớn đến nhỏ, Z $\\rightarrow$ A).
- Có thể sắp xếp trên nhiều cột: \`ORDER BY phong_ban ASC, luong DESC\`.

### 2. Giới hạn số dòng với LIMIT & OFFSET
- \`LIMIT n\`: Chỉ lấy tối đa $n$ dòng kết quả.
- \`OFFSET k\`: Bỏ qua $k$ dòng đầu tiên.
- Ứng dụng phân trang: Trang 1: \`LIMIT 10 OFFSET 0\`, Trang 2: \`LIMIT 10 OFFSET 10\`.
    `,
    syntaxExample: `-- Lấy top 3 sinh viên có điểm thi cao nhất
SELECT ho_ten, diem_so 
FROM sinh_vien 
ORDER BY diem_so DESC 
LIMIT 3;`,
    schemas: [
      {
        name: 'sinh_vien',
        description: 'Bảng theo dõi thành tích học tập sinh viên',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã số sinh viên' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ tên sinh viên' },
          { name: 'chuyen_nganh', type: 'TEXT', description: 'Ngành học' },
          { name: 'gpa', type: 'REAL', description: 'Điểm trung bình tích lũy thang điểm 4.0' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE sinh_vien (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT NOT NULL,
        chuyen_nganh TEXT NOT NULL,
        gpa REAL NOT NULL
      );`,
      `INSERT INTO sinh_vien VALUES
        (101, 'Vũ Hải Nam', 'Khoa học dữ liệu', 3.82),
        (102, 'Bùi Phương Linh', 'Hệ thống thông tin', 3.91),
        (103, 'Đỗ Hoàng Quân', 'Khoa học dữ liệu', 3.45),
        (104, 'Nguyễn Trúc Quỳnh', 'Kỹ thuật phần mềm', 3.75),
        (105, 'Lê Quốc Hưng', 'Khoa học dữ liệu', 3.65),
        (106, 'Phạm Mai Anh', 'Hệ thống thông tin', 3.95);`,
    ],
    exercise: {
      goal: 'Tìm sinh viên có điểm GPA cao nhất ngành Khoa học dữ liệu',
      taskDescription:
        "Viết câu lệnh SELECT trích xuất sinh viên thuộc ngành `chuyen_nganh = 'Khoa học dữ liệu'`, sắp xếp GPA giảm dần và lấy duy nhất 1 sinh viên dẫn đầu (`LIMIT 1`).",
      starterQuery: `-- Top 1 GPA Khoa học dữ liệu\nSELECT ho_ten, gpa FROM sinh_vien\nWHERE chuyen_nganh = 'Khoa học dữ liệu'\nORDER BY `,
      expectedQuery: `SELECT ho_ten, gpa FROM sinh_vien WHERE chuyen_nganh = 'Khoa học dữ liệu' ORDER BY gpa DESC LIMIT 1;`,
      hints: [
        'Sắp xếp gpa giảm dần bằng ORDER BY gpa DESC',
        'Giới hạn kết quả trả về 1 dòng bằng LIMIT 1',
      ],
      explanation:
        'Chính xác! Kết hợp ORDER BY DESC và LIMIT là khuôn mẫu kinh điển để tìm giá trị cực đại (Top-N queries) trong mọi bài toán dữ liệu.',
    },
    quizzes: [
      {
        question: 'Câu lệnh "SELECT * FROM bang ORDER BY cot_a ASC, cot_b DESC;" có ý nghĩa gì?',
        options: [
          'Sắp xếp cot_a tăng dần, nếu cot_a trùng nhau thì sắp xếp cot_b giảm dần',
          'Chỉ sắp xếp theo cot_b vì nó nằm sau',
          'Sắp xếp ngẫu nhiên giữa hai cột',
          'Gây lỗi cú pháp vì ORDER BY chỉ nhận 1 cột',
        ],
        answerIndex: 0,
        explanation: 'SQL hỗ trợ đa mức sắp xếp (multi-column sort): Cột đứng trước được ưu tiên sắp xếp trước, cột đứng sau dùng để phân định thứ tự khi cột trước có giá trị bằng nhau.',
      },
    ],
  },

  {
    id: 'sql-105',
    order: 5,
    stage: 'beginner',
    stageTitle: 'Giai Đoạn 1: Nhập Môn',
    title: 'Dự Án Tổng Kết: Quản Lý Nhân Sự & Điểm Danh Doanh Nghiệp',
    subtitle: 'Thực chiến tổng hợp kiến thức giai đoạn 1 trên CSDL công ty công nghệ',
    category: 'Mini-Project Tổng Kết',
    timeEstimate: '20 phút',
    xpReward: 120,
    isCapstoneProject: true,
    concept: `
### Thử Thách Dự Án Giai Đoạn 1
Chúc mừng bạn đã hoàn thành các bài học cốt lõi của Giai đoạn Nhập môn! 
Bây giờ, bạn đóng vai trò là **Chuyên viên Phân tích Dữ liệu Nội bộ** của công ty TechVN.

Ban Giám Đốc yêu cầu bạn lập báo cáo danh sách các nhân viên:
1. Thuộc phòng ban **Kỹ thuật** hoặc **Dữ liệu**.
2. Có mức lương từ **18,000,000 VNĐ** trở lên.
3. Có ngày vào làm việc (\`ngay_vao_lam\`) từ năm 2023 trở lại đây (\`>= '2023-01-01'\`).
4. Kết quả cần sắp xếp theo **mức lương giảm dần**, nếu lương bằng nhau thì sắp xếp theo **họ tên tăng dần**.
    `,
    syntaxExample: `-- Cấu trúc gợi ý
SELECT ho_ten, phong_ban, luong, ngay_vao_lam
FROM nhan_vien
WHERE phong_ban IN (...)
  AND luong >= ...
  AND ngay_vao_lam >= ...
ORDER BY luong DESC, ho_ten ASC;`,
    schemas: [
      {
        name: 'nhan_vien',
        description: 'Hồ sơ nhân viên chính thức công ty TechVN',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã nhân viên' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên nhân viên' },
          { name: 'phong_ban', type: 'TEXT', description: 'Phòng ban làm việc' },
          { name: 'luong', type: 'INTEGER', description: 'Lương cơ bản tháng (VNĐ)' },
          { name: 'ngay_vao_lam', type: 'TEXT', description: 'Ngày ký hợp đồng (YYYY-MM-DD)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE nhan_vien (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT NOT NULL,
        phong_ban TEXT NOT NULL,
        luong INTEGER NOT NULL,
        ngay_vao_lam TEXT NOT NULL
      );`,
      `INSERT INTO nhan_vien VALUES
        (1, 'Phạm Hoàng Long', 'Kỹ thuật', 22000000, '2023-04-15'),
        (2, 'Nguyễn Diệu Linh', 'Nhân sự', 16000000, '2022-08-01'),
        (3, 'Trần Minh Đức', 'Dữ liệu', 25000000, '2023-01-10'),
        (4, 'Lê Văn Cường', 'Kỹ thuật', 17500000, '2023-06-20'),
        (5, 'Đặng Mai Phương', 'Dữ liệu', 22000000, '2024-02-01'),
        (6, 'Vũ Thành Trung', 'Kinh doanh', 24000000, '2023-03-12');`,
    ],
    exercise: {
      goal: 'Lập danh sách nhân sự thỏa mãn toàn bộ tiêu chí của Ban Giám Đốc',
      taskDescription:
        "Trích xuất `ho_ten, phong_ban, luong, ngay_vao_lam` của các nhân viên thuộc phòng 'Kỹ thuật' hoặc 'Dữ liệu', có lương >= 18000000, vào làm từ '2023-01-01', sắp xếp `luong DESC, ho_ten ASC`.",
      starterQuery: `-- Dự án Giai đoạn 1: Báo cáo nhân sự ưu tú\nSELECT ho_ten, phong_ban, luong, ngay_vao_lam\nFROM nhan_vien\nWHERE `,
      expectedQuery: `SELECT ho_ten, phong_ban, luong, ngay_vao_lam FROM nhan_vien WHERE phong_ban IN ('Kỹ thuật', 'Dữ liệu') AND luong >= 18000000 AND ngay_vao_lam >= '2023-01-01' ORDER BY luong DESC, ho_ten ASC;`,
      hints: [
        "Dùng phong_ban IN ('Kỹ thuật', 'Dữ liệu')",
        "Kết hợp AND luong >= 18000000 AND ngay_vao_lam >= '2023-01-01'",
        'Sắp xếp cuối cùng: ORDER BY luong DESC, ho_ten ASC',
      ],
      explanation:
        'XUẤT SẮC! Bạn đã chính thức vượt qua Giai Đoạn 1: Nhập Môn với dự án tổng kết hoàn hảo!',
    },
  },

  // =========================================================================
  // GIAI ĐOẠN 2: TRUNG CẤP (INTERMEDIATE)
  // =========================================================================
  {
    id: 'sql-201',
    order: 6,
    stage: 'intermediate',
    stageTitle: 'Giai Đoạn 2: Trung Cấp',
    title: 'Hàm Tổng Hợp Dữ Liệu: COUNT, SUM, AVG, MIN, MAX',
    subtitle: 'Rút trích các chỉ số thống kê đo lường hiệu quả kinh doanh',
    category: 'Tổng Hợp Dữ Liệu',
    timeEstimate: '15 phút',
    xpReward: 80,
    concept: `
### Các hàm tổng hợp cốt lõi (Aggregate Functions)
- \`COUNT(*)\`: Đếm tổng số lượng hàng được quét.
- \`COUNT(cot)\`: Đếm số lượng giá trị không bị \`NULL\`.
- \`SUM(cot_so)\`: Tính tổng các giá trị số.
- \`AVG(cot_so)\`: Tính giá trị trung bình cộng.
- \`MIN(cot)\` / \`MAX(cot)\`: Tìm giá trị nhỏ nhất và lớn nhất.

> [!NOTE]
> Khi sử dụng hàm tổng hợp mà không có \`GROUP BY\`, câu truy vấn sẽ luôn trả về duy nhất **1 dòng kết quả**.
    `,
    syntaxExample: `SELECT 
  COUNT(*) AS tong_so_sach,
  AVG(gia_ban) AS gia_trung_binh,
  MAX(gia_ban) AS sach_dat_nhat
FROM kho_sach;`,
    schemas: [
      {
        name: 'kho_sach',
        description: 'Bảng quản lý tựa sách và tồn kho nhà sách',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã sách' },
          { name: 'ten_sach', type: 'TEXT', description: 'Tên tác phẩm' },
          { name: 'the_loai', type: 'TEXT', description: 'Thể loại sách' },
          { name: 'gia_ban', type: 'INTEGER', description: 'Giá bán niêm yết (VNĐ)' },
          { name: 'so_luong', type: 'INTEGER', description: 'Số lượng sách trong kho' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE kho_sach (
        id INTEGER PRIMARY KEY,
        ten_sach TEXT NOT NULL,
        the_loai TEXT NOT NULL,
        gia_ban INTEGER NOT NULL,
        so_luong INTEGER NOT NULL
      );`,
      `INSERT INTO kho_sach VALUES
        (1, 'Học SQL Thực Chiến', 'Công nghệ', 150000, 80),
        (2, 'Nhập Môn Khoa Học Dữ Liệu', 'Công nghệ', 220000, 45),
        (3, 'Tâm Lý Học Về Tiền', 'Kinh tế', 180000, 110),
        (4, 'Khởi Nghiệp Tinh Gọn', 'Kinh tế', 165000, 60),
        (5, 'Thiết Kế CSDL Hiện Đại', 'Công nghệ', 280000, 25);`,
    ],
    exercise: {
      goal: 'Tính tổng số lượng sách và giá bán bình quân của thể loại Công nghệ',
      taskDescription:
        "Viết câu lệnh SELECT tính `SUM(so_luong) AS tong_kho` và `AVG(gia_ban) AS gia_tb` cho các cuốn sách thuộc `the_loai = 'Công nghệ'`.",
      starterQuery: `-- Tính tổng kho và giá trung bình sách Công nghệ\nSELECT `,
      expectedQuery: `SELECT SUM(so_luong) AS tong_kho, AVG(gia_ban) AS gia_tb FROM kho_sach WHERE the_loai = 'Công nghệ';`,
      hints: [
        "Sử dụng SUM(so_luong) AS tong_kho, AVG(gia_ban) AS gia_tb",
        "Lọc điều kiện trước: WHERE the_loai = 'Công nghệ'",
      ],
      explanation:
        'Chính xác! Bạn đã nắm chắc kỹ thuật kết hợp mệnh đề WHERE lọc trước khi hàm tổng hợp thực thi.',
    },
    quizzes: [
      {
        question: 'Điều gì xảy ra khi hàm SUM() gặp một giá trị NULL trong cột tính toán?',
        options: [
          'Hàm SUM tự động bỏ qua các giá trị NULL và chỉ tính tổng các giá trị hợp lệ',
          'Trả về lỗi cú pháp',
          'Toàn bộ kết quả SUM sẽ trở thành NULL',
          'Coi giá trị NULL là số âm',
        ],
        answerIndex: 0,
        explanation: 'Chuẩn ANSI SQL quy định các hàm tổng hợp như SUM, AVG, MIN, MAX tự động bỏ qua (ignore) các giá trị NULL trong quá trình tính toán.',
      },
    ],
  },

  {
    id: 'sql-202',
    order: 7,
    stage: 'intermediate',
    stageTitle: 'Giai Đoạn 2: Trung Cấp',
    title: 'Gom Nhóm GROUP BY & Bộ Lọc Sau Nhóm HAVING',
    subtitle: 'Phân tích dữ liệu theo từng nhóm danh mục và lọc kết quả tổng hợp',
    category: 'Tổng Hợp Dữ Liệu',
    timeEstimate: '18 phút',
    xpReward: 90,
    concept: `
### 1. Gom nhóm với GROUP BY
\`GROUP BY\` chia các hàng thành các nhóm dựa trên giá trị của một hoặc nhiều cột. Sau đó, các hàm tổng hợp (\`COUNT\`, \`SUM\`, \`AVG\`) được áp dụng độc lập cho từng nhóm.

### 2. Sự khác biệt cốt tử giữa WHERE và HAVING:
| Tiêu chí | Mệnh đề WHERE | Mệnh đề HAVING |
| :--- | :--- | :--- |
| **Thời điểm thực thi** | Lọc **trước** khi gom nhóm | Lọc **sau** khi đã gom nhóm |
| **Dùng với hàm tổng hợp** | ❌ Không được phép (\`WHERE COUNT(*) > 5\` lỗi) | ✅ Được phép (\`HAVING COUNT(*) > 5\`) |
| **Phạm vi lọc** | Từng dòng dữ liệu cá lẻ | Cả một nhóm dữ liệu |
    `,
    syntaxExample: `-- Tìm các phòng ban có lương trung bình trên 20 triệu
SELECT phong_ban, AVG(luong) AS luong_tb, COUNT(*) AS so_luong
FROM nhan_vien
GROUP BY phong_ban
HAVING AVG(luong) > 20000000;`,
    schemas: [
      {
        name: 'giao_dich',
        description: 'Chi tiết các giao dịch mua hàng theo khách',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã giao dịch' },
          { name: 'khach_hang_id', type: 'INTEGER', description: 'Mã khách hàng' },
          { name: 'so_tien', type: 'INTEGER', description: 'Giá trị giao dịch (VNĐ)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE giao_dich (
        id INTEGER PRIMARY KEY,
        khach_hang_id INTEGER NOT NULL,
        so_tien INTEGER NOT NULL
      );`,
      `INSERT INTO giao_dich VALUES
        (1, 101, 500000),
        (2, 102, 1200000),
        (3, 101, 800000),
        (4, 103, 2000000),
        (5, 101, 1500000),
        (6, 102, 300000);`,
    ],
    exercise: {
      goal: 'Tìm khách hàng đã mua từ 2 đơn trở lên và có tổng chi tiêu trên 2,000,000 VNĐ',
      taskDescription:
        'Viết truy vấn trích xuất `khach_hang_id`, số lượng đơn `COUNT(*) AS tong_don`, và tổng tiền `SUM(so_tien) AS tong_chi_tieu` từ bảng `giao_dich`, gom nhóm theo `khach_hang_id` và lọc với `HAVING COUNT(*) >= 2 AND SUM(so_tien) > 2000000`.',
      starterQuery: `-- Tìm khách hàng VIP theo tiêu chí HAVING\nSELECT khach_hang_id, COUNT(*) AS tong_don, SUM(so_tien) AS tong_chi_tieu\nFROM giao_dich\nGROUP BY `,
      expectedQuery: `SELECT khach_hang_id, COUNT(*) AS tong_don, SUM(so_tien) AS tong_chi_tieu FROM giao_dich GROUP BY khach_hang_id HAVING COUNT(*) >= 2 AND SUM(so_tien) > 2000000;`,
      hints: [
        'Gom nhóm: GROUP BY khach_hang_id',
        'Lọc nhóm: HAVING COUNT(*) >= 2 AND SUM(so_tien) > 2000000',
      ],
      explanation:
        'Rất xuất sắc! Bạn đã phân biệt và áp dụng chuẩn xác mệnh đề HAVING để lọc kết quả tổng hợp.',
    },
    quizzes: [
      {
        question: 'Câu lệnh sau đây bị lỗi ở đâu: "SELECT phong_ban FROM nhan_vien WHERE COUNT(*) > 5 GROUP BY phong_ban;"?',
        options: [
          'Hàm COUNT(*) không được phép đặt trong mệnh đề WHERE; phải dùng HAVING COUNT(*) > 5 đặt sau GROUP BY',
          'Không được phép GROUP BY trên cột phong_ban',
          'Phải viết GROUP BY trước WHERE',
          'Câu lệnh không có lỗi',
        ],
        answerIndex: 0,
        explanation: 'Mệnh đề WHERE thực thi trước khi các hàm tổng hợp được tính toán, do đó không thể chứa hàm tổng hợp. Cần chuyển điều kiện sang HAVING sau GROUP BY.',
      },
    ],
  },

  {
    id: 'sql-203',
    order: 8,
    stage: 'intermediate',
    stageTitle: 'Giai Đoạn 2: Trung Cấp',
    title: 'Kết Nối Bảng Cốt Lõi Với INNER JOIN',
    subtitle: 'Nối các thực thể dữ liệu bằng khóa ngoại (Foreign Key)',
    category: 'Ghép Bảng (JOINs)',
    timeEstimate: '20 phút',
    xpReward: 90,
    concept: `
### Tại sao cần tách nhiều bảng & JOIN?
Để tránh trùng lặp dữ liệu, thông tin khách hàng được lưu ở bảng \`khach_hang\`, còn đơn hàng lưu ở \`don_hang\`. Hai bảng được liên kết với nhau qua **Khóa chính (Primary Key - PK)** và **Khóa ngoại (Foreign Key - FK)**.

### Bản chất của INNER JOIN
\`INNER JOIN\` chỉ giữ lại những hàng mà điều kiện kết nối (\`ON\`) trả về \`TRUE\` ở **cả hai bảng**. Những hàng ở bảng A không có bản ghi tương ứng ở bảng B sẽ bị loại bỏ.
    `,
    syntaxExample: `SELECT dh.ma_don, kh.ho_ten, dh.so_tien
FROM don_hang dh
INNER JOIN khach_hang kh ON dh.khach_hang_id = kh.id;`,
    schemas: [
      {
        name: 'khach_hang',
        description: 'Bảng người dùng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã khách hàng' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên khách' },
          { name: 'thanh_pho', type: 'TEXT', description: 'Thành phố' },
        ],
      },
      {
        name: 'hoa_don',
        description: 'Bảng hóa đơn bán hàng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã hóa đơn' },
          { name: 'khach_hang_id', type: 'INTEGER', description: 'Mã khách (FK)' },
          { name: 'tong_tien', type: 'INTEGER', description: 'Giá trị hóa đơn' },
        ],
        foreignKeys: [{ fromColumn: 'khach_hang_id', toTable: 'khach_hang', toColumn: 'id' }],
      },
    ],
    seedSql: [
      `CREATE TABLE khach_hang (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT NOT NULL,
        thanh_pho TEXT NOT NULL
      );`,
      `CREATE TABLE hoa_don (
        id INTEGER PRIMARY KEY,
        khach_hang_id INTEGER NOT NULL,
        tong_tien INTEGER NOT NULL,
        FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id)
      );`,
      `INSERT INTO khach_hang VALUES
        (1, 'Đặng Thái Sơn', 'Hà Nội'),
        (2, 'Nguyễn Hồng Nhung', 'Đà Nẵng'),
        (3, 'Trịnh Công Sơn', 'TP.HCM');`,
      `INSERT INTO hoa_don VALUES
        (1001, 1, 450000),
        (1002, 1, 950000),
        (1003, 2, 1200000);`,
    ],
    exercise: {
      goal: 'Ghép bảng hóa đơn và khách hàng để lấy tên người mua cùng tổng tiền',
      taskDescription:
        'Sử dụng `INNER JOIN` nối bảng `hoa_don` (đặt bí danh `hd`) với `khach_hang` (đặt bí danh `kh`) trên điều kiện `hd.khach_hang_id = kh.id`. Trích xuất các cột: `hd.id AS ma_hoa_don`, `kh.ho_ten`, `hd.tong_tien`.',
      starterQuery: `-- Ghép nối bảng hoa_don và khach_hang bằng INNER JOIN\nSELECT hd.id AS ma_hoa_don, kh.ho_ten, hd.tong_tien\nFROM hoa_don hd\nINNER JOIN `,
      expectedQuery: `SELECT hd.id AS ma_hoa_don, kh.ho_ten, hd.tong_tien FROM hoa_don hd INNER JOIN khach_hang kh ON hd.khach_hang_id = kh.id;`,
      hints: [
        'Cú pháp: INNER JOIN khach_hang kh ON hd.khach_hang_id = kh.id',
      ],
      explanation:
        'Chính xác! Bạn thấy rằng khách hàng Trịnh Công Sơn (id=3) chưa mua hàng nên không xuất hiện trong kết quả của INNER JOIN.',
    },
    quizzes: [
      {
        question: 'Nếu Bảng A có 5 dòng và Bảng B có 0 dòng, kết quả INNER JOIN giữa A và B sẽ có bao nhiêu dòng?',
        options: [
          '0 dòng',
          '5 dòng',
          'NULL dòng',
          'Báo lỗi runtime',
        ],
        answerIndex: 0,
        explanation: 'Vì INNER JOIN đòi hỏi điều kiện kết nối phải thỏa mãn ở cả hai phía, nếu một bảng có 0 dòng thì kết quả luôn là 0 dòng.',
      },
    ],
  },

  {
    id: 'sql-204',
    order: 9,
    stage: 'intermediate',
    stageTitle: 'Giai Đoạn 2: Trung Cấp',
    title: 'Kết Nối Mở Rộng LEFT JOIN & Phát Hiện Dữ Liệu Rỗng',
    subtitle: 'Giữ lại toàn bộ dữ liệu bảng chính và truy tìm các bản ghi mồ côi',
    category: 'Ghép Bảng (JOINs)',
    timeEstimate: '20 phút',
    xpReward: 100,
    concept: `
### Bản chất của LEFT JOIN
\`LEFT JOIN\` giữ lại **toàn bộ các dòng của bảng bên trái (Left table)**:
- Nếu bảng bên phải có dữ liệu khớp: Lấy dữ liệu bình thường.
- Nếu bảng bên phải không có dữ liệu khớp: Các cột của bảng bên phải tự động điền giá trị \`NULL\`.

### Kỹ thuật thần thánh: "Tìm đối tượng chưa từng hành động"
\`\`\`sql
-- Tìm khách hàng chưa từng mua bất kỳ đơn hàng nào
SELECT kh.ho_ten
FROM khach_hang kh
LEFT JOIN don_hang dh ON kh.id = dh.khach_hang_id
WHERE dh.id IS NULL;
\`\`\`
    `,
    syntaxExample: `SELECT tg.ten_tac_gia, COUNT(sp.id) AS so_tac_pham
FROM tac_gia tg
LEFT JOIN sach sp ON tg.id = sp.tac_gia_id
GROUP BY tg.id, tg.ten_tac_gia;`,
    schemas: [
      {
        name: 'khoa_hoc',
        description: 'Danh mục khóa học',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã khóa học' },
          { name: 'ten_khoa', type: 'TEXT', description: 'Tên khóa đào tạo' },
        ],
      },
      {
        name: 'hoc_vien',
        description: 'Danh sách học viên đăng ký',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã học viên' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên học viên' },
          { name: 'khoa_hoc_id', type: 'INTEGER', description: 'Mã khóa học đã ghi danh' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE khoa_hoc (
        id INTEGER PRIMARY KEY,
        ten_khoa TEXT NOT NULL
      );`,
      `CREATE TABLE hoc_vien (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT NOT NULL,
        khoa_hoc_id INTEGER
      );`,
      `INSERT INTO khoa_hoc VALUES
        (1, 'SQL Nền Tảng'),
        (2, 'Python Phân Tích Dữ Liệu'),
        (3, 'Machine Learning Chuyên Sâu');`,
      `INSERT INTO hoc_vien VALUES
        (101, 'Vũ Quốc Huy', 1),
        (102, 'Trần Minh Tâm', 1),
        (103, 'Đỗ Bích Phương', 2);`,
    ],
    exercise: {
      goal: 'Tìm những khóa học chưa có bất kỳ học viên nào đăng ký',
      taskDescription:
        'Sử dụng `LEFT JOIN` nối bảng `khoa_hoc` (kh) với `hoc_vien` (hv) trên điều kiện `kh.id = hv.khoa_hoc_id`. Lọc lấy các khóa học chưa có học viên nào (`WHERE hv.id IS NULL`), hiển thị cột `kh.ten_khoa`.',
      starterQuery: `-- Tìm khóa học chưa có học viên đăng ký\nSELECT kh.ten_khoa\nFROM khoa_hoc kh\nLEFT JOIN `,
      expectedQuery: `SELECT kh.ten_khoa FROM khoa_hoc kh LEFT JOIN hoc_vien hv ON kh.id = hv.khoa_hoc_id WHERE hv.id IS NULL;`,
      hints: [
        'LEFT JOIN hoc_vien hv ON kh.id = hv.khoa_hoc_id',
        'Thêm điều kiện: WHERE hv.id IS NULL',
      ],
      explanation:
        'Tuyệt vời! Khóa học "Machine Learning Chuyên Sâu" chưa có học viên nào và đã được phát hiện chính xác.',
    },
    quizzes: [
      {
        question: 'Khi dùng LEFT JOIN, các dòng ở bảng bên phải không khớp với bảng bên trái sẽ hiển thị giá trị gì?',
        options: [
          'Giá trị NULL',
          'Chuỗi rỗng ""',
          'Số 0',
          'Bị loại bỏ hoàn toàn',
        ],
        answerIndex: 0,
        explanation: 'Với LEFT JOIN, khi không có hàng nào ở bảng bên phải khớp với bảng bên trái, SQL sẽ lấp đầy các cột của bảng bên phải bằng giá trị NULL.',
      },
    ],
  },

  {
    id: 'sql-205',
    order: 10,
    stage: 'intermediate',
    stageTitle: 'Giai Đoạn 2: Trung Cấp',
    title: 'Dự Án Tổng Kết: Phân Tích Doanh Số & Giỏ Hàng Sàn TMĐT',
    subtitle: 'Tổng hợp sức mạnh JOINs và GROUP BY trên lược đồ CSDL thương mại điện tử thực tế',
    category: 'Mini-Project Tổng Kết',
    timeEstimate: '25 phút',
    xpReward: 150,
    isCapstoneProject: true,
    concept: `
### Thử Thách Dự Án Giai Đoạn 2
Bạn là **Lead Data Analyst** của sàn thương mại điện tử ShoppyVN.
Hệ thống gồm 2 bảng:
- \`danh_muc\`: Danh mục ngành hàng.
- \`don_hang\`: Chi tiết doanh thu theo danh mục.

Ban Giám Đốc muốn một báo cáo tổng hợp:
1. Hiển thị tên danh mục (\`ten_danh_muc\`).
2. Tổng doanh thu tích lũy (\`SUM(tong_tien) AS doanh_thu\`).
3. Tổng số lượng đơn đặt (\`COUNT(dh.id) AS so_don\`).
4. **Phải hiển thị tất cả các danh mục** (danh mục nào chưa có đơn hàng thì số đơn là 0 và doanh thu có thể là NULL hoặc 0).
5. Chỉ lấy các danh mục có doanh thu từ 5,000,000 VNĐ trở lên hoặc danh mục mới chưa có doanh thu.
    `,
    syntaxExample: `SELECT dm.ten_danh_muc, SUM(dh.tong_tien) AS doanh_thu, COUNT(dh.id) AS so_don
FROM danh_muc dm
LEFT JOIN don_hang dh ON dm.id = dh.danh_muc_id
GROUP BY dm.id, dm.ten_danh_muc;`,
    schemas: [
      {
        name: 'danh_muc',
        description: 'Bảng danh mục sản phẩm',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã danh mục' },
          { name: 'ten_danh_muc', type: 'TEXT', description: 'Tên danh mục' },
        ],
      },
      {
        name: 'don_hang',
        description: 'Bảng đơn hàng bán ra',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã đơn' },
          { name: 'danh_muc_id', type: 'INTEGER', description: 'Mã danh mục' },
          { name: 'tong_tien', type: 'INTEGER', description: 'Doanh số (VNĐ)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE danh_muc (
        id INTEGER PRIMARY KEY,
        ten_danh_muc TEXT NOT NULL
      );`,
      `CREATE TABLE don_hang (
        id INTEGER PRIMARY KEY,
        danh_muc_id INTEGER NOT NULL,
        tong_tien INTEGER NOT NULL
      );`,
      `INSERT INTO danh_muc VALUES
        (1, 'Điện Thoại & Phụ Kiện'),
        (2, 'Thời Trang Nam'),
        (3, 'Đồ Gia Dụng'),
        (4, 'Sách & Văn Phòng Phẩm');`,
      `INSERT INTO don_hang VALUES
        (101, 1, 15000000),
        (102, 1, 8500000),
        (103, 2, 3200000),
        (104, 3, 6200000);`,
    ],
    exercise: {
      goal: 'Báo cáo doanh số và số đơn theo từng danh mục',
      taskDescription:
        'Sử dụng `LEFT JOIN` giữa `danh_muc` (dm) và `don_hang` (dh) trên `dm.id = dh.danh_muc_id`, gom nhóm `dm.ten_danh_muc`, tính `COUNT(dh.id) AS so_don` và `SUM(dh.tong_tien) AS doanh_thu`, sắp xếp `doanh_thu DESC`.',
      starterQuery: `-- Báo cáo doanh số ShoppyVN\nSELECT dm.ten_danh_muc, COUNT(dh.id) AS so_don, SUM(dh.tong_tien) AS doanh_thu\nFROM danh_muc dm\nLEFT JOIN `,
      expectedQuery: `SELECT dm.ten_danh_muc, COUNT(dh.id) AS so_don, SUM(dh.tong_tien) AS doanh_thu FROM danh_muc dm LEFT JOIN don_hang dh ON dm.id = dh.danh_muc_id GROUP BY dm.ten_danh_muc ORDER BY doanh_thu DESC;`,
      hints: [
        'LEFT JOIN don_hang dh ON dm.id = dh.danh_muc_id',
        'GROUP BY dm.ten_danh_muc',
        'ORDER BY doanh_thu DESC',
      ],
      explanation:
        'XUẤT SẮC! Bạn đã làm chủ hoàn toàn các kỹ năng tổng hợp và kết nối đa bảng của Giai đoạn 2!',
    },
  },

  // =========================================================================
  // GIAI ĐOẠN 3: NÂNG CAO (ADVANCED)
  // =========================================================================
  {
    id: 'sql-301',
    order: 11,
    stage: 'advanced',
    stageTitle: 'Giai Đoạn 3: Nâng Cao',
    title: 'Hàm Cửa Sổ (Window Functions): ROW_NUMBER & RANK',
    subtitle: 'Tính toán phân vị xếp hạng mà không làm gộp dòng như GROUP BY',
    category: 'Window Functions',
    timeEstimate: '20 phút',
    xpReward: 110,
    concept: `
### Window Function là gì?
Khác với \`GROUP BY\` gom nhiều dòng thành 1 dòng, **Window Function** tính toán trên một "cửa sổ các dòng liên quan" nhưng **giữ nguyên từng dòng chi tiết**.

### Cú pháp cốt lõi:
\`\`\`sql
FUNCTION() OVER (
  PARTITION BY cot_chia_nhom 
  ORDER BY cot_sap_xep [ASC|DESC]
)
\`\`\`

### So sánh các hàm xếp hạng:
- \`ROW_NUMBER()\`: Đánh số thứ tự liên tục 1, 2, 3, 4 (luôn duy nhất, không trùng).
- \`RANK()\`: Khi có điểm bằng nhau thì cùng hạng, nhưng **nhảy cóc** thứ hạng tiếp theo (1, 2, 2, 4).
- \`DENSE_RANK()\`: Cùng hạng thì chia sẻ thứ hạng, **không nhảy cóc** (1, 2, 2, 3).
    `,
    syntaxExample: `SELECT 
  ho_ten, phong_ban, luong,
  DENSE_RANK() OVER (PARTITION BY phong_ban ORDER BY luong DESC) AS hang_luong
FROM nhan_vien;`,
    schemas: [
      {
        name: 'doanh_so',
        description: 'Doanh số bán hàng của nhân viên theo tháng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'ID' },
          { name: 'thang', type: 'TEXT', description: 'Tháng giao dịch' },
          { name: 'nhan_vien', type: 'TEXT', description: 'Tên nhân viên' },
          { name: 'doanh_thu', type: 'INTEGER', description: 'Doanh thu đạt được' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE doanh_so (
        id INTEGER PRIMARY KEY,
        thang TEXT NOT NULL,
        nhan_vien TEXT NOT NULL,
        doanh_thu INTEGER NOT NULL
      );`,
      `INSERT INTO doanh_so VALUES
        (1, '2026-09', 'Nguyễn Văn A', 45000000),
        (2, '2026-09', 'Trần Thị B', 62000000),
        (3, '2026-09', 'Lê Văn C', 38000000),
        (4, '2026-10', 'Nguyễn Văn A', 58000000),
        (5, '2026-10', 'Trần Thị B', 51000000);`,
    ],
    exercise: {
      goal: 'Xếp hạng nhân viên đạt doanh số cao nhất trong từng tháng',
      taskDescription:
        'Sử dụng hàm `DENSE_RANK() OVER (PARTITION BY thang ORDER BY doanh_thu DESC) AS xep_hang` để xếp hạng các nhân viên theo từng tháng. Trích xuất `thang, nhan_vien, doanh_thu, xep_hang`.',
      starterQuery: `-- Xếp hạng nhân viên trong từng tháng\nSELECT thang, nhan_vien, doanh_thu,\n       DENSE_RANK() OVER (`,
      expectedQuery: `SELECT thang, nhan_vien, doanh_thu, DENSE_RANK() OVER (PARTITION BY thang ORDER BY doanh_thu DESC) AS xep_hang FROM doanh_so;`,
      hints: [
        'Cú pháp: DENSE_RANK() OVER (PARTITION BY thang ORDER BY doanh_thu DESC) AS xep_hang',
      ],
      explanation:
        'Chính xác! Bạn thấy mỗi tháng (thang) được chia thành một phân vùng (partition) độc lập để xếp hạng.',
    },
    quizzes: [
      {
        question: 'Nếu hai người cùng có điểm cao nhất là 10, người thứ ba được 9 điểm thì hàm RANK() sẽ gán thứ hạng người thứ ba là bao nhiêu?',
        options: [
          'Hạng 3 (vì RANK nhảy cóc: 1, 1, 3)',
          'Hạng 2 (vì RANK không nhảy cóc)',
          'Hạng 1.5',
          'Báo lỗi',
        ],
        answerIndex: 0,
        explanation: 'Hàm RANK() sẽ nhảy cóc vị trí: hai người đầu đồng hạng 1, vị trí hạng 2 bị chiếm giữ, nên người tiếp theo nhận hạng 3.',
      },
    ],
  },

  {
    id: 'sql-302',
    order: 12,
    stage: 'advanced',
    stageTitle: 'Giai Đoạn 3: Nâng Cao',
    title: 'Phân Tích Chuỗi Thời Gian: LEAD, LAG & Lũy Kế',
    subtitle: 'Tính toán tốc độ tăng trưởng doanh thu so với kỳ trước (MoM Growth)',
    category: 'Window Functions',
    timeEstimate: '20 phút',
    xpReward: 120,
    concept: `
### 1. Hàm độ trễ LEAD và LAG
- \`LAG(cot, n)\`: Lấy giá trị của dòng phía trước ($n$ bước). Mặc định $n=1$. Dùng để so sánh giá trị hôm nay với hôm qua.
- \`LEAD(cot, n)\`: Lấy giá trị của dòng kế tiếp trong tương lai.

### 2. Tính tổng dồn lũy kế (Running Total)
\`\`\`sql
SUM(doanh_thu) OVER (ORDER BY ngay) AS tong_luy_ke
\`\`\`
Phép tính này cộng dồn từng dòng từ đầu danh sách cho đến thời điểm dòng hiện tại.
    `,
    syntaxExample: `SELECT 
  ngay, doanh_thu,
  SUM(doanh_thu) OVER (ORDER BY ngay) AS luy_ke,
  LAG(doanh_thu, 1) OVER (ORDER BY ngay) AS doanh_thu_hom_qua
FROM doanh_thu_ngay;`,
    schemas: [
      {
        name: 'doanh_thu_ngay',
        description: 'Báo cáo doanh thu từng ngày trong tuần',
        columns: [
          { name: 'ngay', type: 'TEXT PRIMARY KEY', description: 'Ngày ghi nhận' },
          { name: 'doanh_thu', type: 'INTEGER', description: 'Doanh thu đạt được trong ngày' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE doanh_thu_ngay (
        ngay TEXT PRIMARY KEY,
        doanh_thu INTEGER NOT NULL
      );`,
      `INSERT INTO doanh_thu_ngay VALUES
        ('2026-10-01', 12000000),
        ('2026-10-02', 15000000),
        ('2026-10-03', 11000000),
        ('2026-10-04', 18000000),
        ('2026-10-05', 20000000);`,
    ],
    exercise: {
      goal: 'Tính tổng lũy kế doanh thu qua từng ngày',
      taskDescription:
        'Trích xuất `ngay`, `doanh_thu` và tính cột `SUM(doanh_thu) OVER (ORDER BY ngay) AS luy_ke` từ bảng `doanh_thu_ngay`.',
      starterQuery: `-- Tính lũy kế doanh thu theo ngày\nSELECT ngay, doanh_thu,\n       SUM(doanh_thu) OVER (`,
      expectedQuery: `SELECT ngay, doanh_thu, SUM(doanh_thu) OVER (ORDER BY ngay) AS luy_ke FROM doanh_thu_ngay;`,
      hints: [
        'Cú pháp: SUM(doanh_thu) OVER (ORDER BY ngay) AS luy_ke',
      ],
      explanation:
        'Rất tốt! Running Total là một trong những chỉ số quan trọng nhất trong mọi Dashboard phân tích tài chính.',
    },
    quizzes: [
      {
        question: 'Dòng đầu tiên khi sử dụng hàm LAG(doanh_thu, 1) sẽ trả về giá trị gì?',
        options: [
          'NULL (vì không có dòng nào phía trước nó)',
          'Số 0',
          'Báo lỗi out of bounds',
          'Giá trị của chính dòng đó',
        ],
        answerIndex: 0,
        explanation: 'Do dòng đầu tiên không có bản ghi đứng trước, LAG(..., 1) mặc định trả về NULL.',
      },
    ],
  },

  {
    id: 'sql-303',
    order: 13,
    stage: 'advanced',
    stageTitle: 'Giai Đoạn 3: Nâng Cao',
    title: 'Biểu Thức Bảng Phổ Thông WITH CTE & Tái Sử Dụng',
    subtitle: 'Viết code SQL sạch sẽ, module hóa và dễ bảo trì với Common Table Expressions',
    category: 'Biến Đổi Nâng Cao',
    timeEstimate: '20 phút',
    xpReward: 120,
    concept: `
### Tại sao nên dùng CTE thay vì Subquery lồng nhau?
Subquery lồng nhiều lớp làm câu lệnh SQL trở thành "mớ bòng bong" khó đọc và khó debug. Mệnh đề \`WITH\` định nghĩa một bảng tạm thời có tên rõ ràng:
\`\`\`sql
WITH BangTam_A AS (
  SELECT ...
),
BangTam_B AS (
  SELECT ... FROM BangTam_A
)
SELECT * FROM BangTam_B;
\`\`\`
    `,
    syntaxExample: `WITH DoanhThuTungVung AS (
  SELECT khu_vuc, SUM(doanh_so) AS tong_ds
  FROM cua_hang
  GROUP BY khu_vuc
)
SELECT khu_vuc, tong_ds
FROM DoanhThuTungVung
WHERE tong_ds > 100000000;`,
    schemas: [
      {
        name: 'nhan_vien',
        description: 'Bảng nhân viên và mức lương',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã nhân viên' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên' },
          { name: 'phong_ban', type: 'TEXT', description: 'Phòng ban' },
          { name: 'luong', type: 'INTEGER', description: 'Lương tháng' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE nhan_vien (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT NOT NULL,
        phong_ban TEXT NOT NULL,
        luong INTEGER NOT NULL
      );`,
      `INSERT INTO nhan_vien VALUES
        (1, 'Lê Hồng Quang', 'IT', 28000000),
        (2, 'Phan Bích Nga', 'IT', 22000000),
        (3, 'Đỗ Mạnh Thắng', 'Marketing', 19000000),
        (4, 'Nguyễn Kiều Trang', 'Marketing', 24000000),
        (5, 'Trần Quốc Tuấn', 'HR', 17000000);`,
    ],
    exercise: {
      goal: 'Dùng CTE tính lương trung bình từng phòng, sau đó lọc phòng có lương TB > 20 triệu',
      taskDescription:
        'Tạo CTE `LuongTrungBinh` gồm `phong_ban` và `AVG(luong) AS luong_tb` từ bảng `nhan_vien` (GROUP BY phong_ban). Truy vấn từ CTE này với điều kiện `luong_tb > 20000000`.',
      starterQuery: `-- Sử dụng CTE WITH để tính toán trung bình\nWITH LuongTrungBinh AS (\n  SELECT phong_ban, AVG(luong) AS luong_tb\n  FROM nhan_vien\n  GROUP BY phong_ban\n)\nSELECT `,
      expectedQuery: `WITH LuongTrungBinh AS (SELECT phong_ban, AVG(luong) AS luong_tb FROM nhan_vien GROUP BY phong_ban) SELECT phong_ban, luong_tb FROM LuongTrungBinh WHERE luong_tb > 20000000;`,
      hints: [
        'Hoàn thiện câu SELECT từ bảng tạm: SELECT phong_ban, luong_tb FROM LuongTrungBinh WHERE luong_tb > 20000000;',
      ],
      explanation:
        'Tuyệt vời! CTE giúp code của bạn có cấu trúc tuần tự từ trên xuống dưới, cực kỳ dễ đọc và mở rộng.',
    },
    quizzes: [
      {
        question: 'Một bảng tạm CTE định nghĩa trong mệnh đề WITH có lưu trữ dữ liệu vĩnh viễn trên ổ cứng không?',
        options: [
          'Không, CTE chỉ tồn tại trong phạm vi thực thi của câu truy vấn đó',
          'Có, nó tạo ra một bảng thật trong CSDL',
          'Có, nhưng tự xóa sau 24 giờ',
          'Tùy vào câu lệnh COMMIT',
        ],
        answerIndex: 0,
        explanation: 'CTE là một cấu trúc tạm thời trong bộ nhớ chỉ tồn tại trong vòng đời thực thi của câu lệnh đơn lẻ.',
      },
    ],
  },

  {
    id: 'sql-304',
    order: 14,
    stage: 'advanced',
    stageTitle: 'Giai Đoạn 3: Nâng Cao',
    title: 'Rẽ Nhánh Logic Với CASE WHEN & Hàm COALESCE',
    subtitle: 'Thực thi logic if-else trực tiếp trong câu lệnh SQL',
    category: 'Biến Đổi Nâng Cao',
    timeEstimate: '18 phút',
    xpReward: 110,
    concept: `
### 1. Mệnh đề CASE WHEN ... THEN ... ELSE ... END
Cho phép bạn phân loại dữ liệu theo điều kiện:
\`\`\`sql
SELECT ho_ten,
  CASE 
    WHEN tuoi >= 60 THEN 'Người cao tuổi'
    WHEN tuoi >= 18 THEN 'Người trưởng thành'
    ELSE 'Chưa thành niên'
  END AS nhom_tuoi
FROM dan_cu;
\`\`\`

### 2. Hàm thay thế giá trị khuyết COALESCE
\`COALESCE(val1, val2, ...)\` trả về **giá trị đầu tiên khác NULL** trong danh sách đối số.
\`\`\`sql
SELECT ho_ten, COALESCE(so_dien_thoai, email, 'Chưa có thông tin liên hệ') AS lien_he
FROM khach_hang;
\`\`\`
    `,
    syntaxExample: `SELECT ten_san_pham, gia,
  CASE 
    WHEN gia > 10000000 THEN 'Cao Cấp'
    WHEN gia >= 3000000 THEN 'Trung Cấp'
    ELSE 'Phổ Thông'
  END AS phan_khuc
FROM san_pham;`,
    schemas: [
      {
        name: 'hoi_vien',
        description: 'Thông tin điểm tích lũy của khách hàng thân thiết',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã hội viên' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên hội viên' },
          { name: 'diem_tich_luy', type: 'INTEGER', description: 'Điểm thưởng' },
          { name: 'so_dien_thoai', type: 'TEXT', description: 'SĐT (có thể rỗng)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE hoi_vien (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT NOT NULL,
        diem_tich_luy INTEGER NOT NULL,
        so_dien_thoai TEXT
      );`,
      `INSERT INTO hoi_vien VALUES
        (1, 'Phạm Nhật Vượng', 5500, '0981112233'),
        (2, 'Nguyễn Thị Phương Thảo', 2800, NULL),
        (3, 'Trần Đình Long', 850, '0913334455'),
        (4, 'Hồ Hùng Anh', 150, NULL);`,
    ],
    exercise: {
      goal: 'Phân hạng hội viên: >= 3000: VIP, >= 1000: Vàng, còn lại: Chuẩn',
      taskDescription:
        "Trích xuất `ho_ten`, `diem_tich_luy`, phân loại `hang_the` bằng `CASE WHEN diem_tich_luy >= 3000 THEN 'VIP' WHEN diem_tich_luy >= 1000 THEN 'Vàng' ELSE 'Chuẩn' END AS hang_the` và dùng `COALESCE(so_dien_thoai, 'Chưa có SĐT') AS sdt`.",
      starterQuery: `-- Phân hạng hội viên với CASE WHEN và COALESCE\nSELECT ho_ten, diem_tich_luy,\n       CASE \n         WHEN `,
      expectedQuery: `SELECT ho_ten, diem_tich_luy, CASE WHEN diem_tich_luy >= 3000 THEN 'VIP' WHEN diem_tich_luy >= 1000 THEN 'Vàng' ELSE 'Chuẩn' END AS hang_the, COALESCE(so_dien_thoai, 'Chưa có SĐT') AS sdt FROM hoi_vien;`,
      hints: [
        "CASE WHEN diem_tich_luy >= 3000 THEN 'VIP' WHEN diem_tich_luy >= 1000 THEN 'Vàng' ELSE 'Chuẩn' END AS hang_the",
        "COALESCE(so_dien_thoai, 'Chưa có SĐT') AS sdt",
      ],
      explanation:
        'Chính xác! Kết hợp CASE WHEN và COALESCE tạo ra các bảng dữ liệu sạch sẽ, thân thiện cho tầng giao diện người dùng.',
    },
    quizzes: [
      {
        question: 'Nếu tất cả các điều kiện WHEN đều sai và không có mệnh đề ELSE, khối CASE sẽ trả về giá trị gì?',
        options: [
          'NULL',
          'Chuỗi rỗng',
          'Báo lỗi biên dịch',
          'Số 0',
        ],
        answerIndex: 0,
        explanation: 'Nếu không có điều kiện nào thỏa mãn và không khai báo ELSE, biểu thức CASE WHEN mặc định trả về giá trị NULL.',
      },
    ],
  },

  {
    id: 'sql-305',
    order: 15,
    stage: 'advanced',
    stageTitle: 'Giai Đoạn 3: Nâng Cao',
    title: 'Dự Án Tổng Kết: Báo Cáo Doanh Thu Định Kỳ SaaS (MRR) & Tăng Trưởng',
    subtitle: 'Ứng dụng Window Functions và CTEs để tính toán chỉ số tăng trưởng định kỳ doanh nghiệp',
    category: 'Mini-Project Tổng Kết',
    timeEstimate: '30 phút',
    xpReward: 180,
    isCapstoneProject: true,
    concept: `
### Thử Thách Dự Án Giai Đoạn 3
Bạn là **Senior Analytics Engineer** của một công ty phần mềm SaaS.
Bảng \`doanh_thu_thang\` ghi nhận doanh thu định kỳ theo tháng (\`thang\`, \`doanh_thu\`).

Ban Điều Hành yêu cầu bạn xây dựng truy vấn chuyên nghiệp:
1. Hiển thị \`thang\` và \`doanh_thu\` hiện tại.
2. Dùng hàm \`LAG()\` để lấy doanh thu của tháng liền trước (\`doanh_thu_thang_truoc\`).
3. Tính mức tăng trưởng chênh lệch tuyệt đối: \`doanh_thu - doanh_thu_thang_truoc\` đặt tên là \`chenh_lech\`.
4. Tính tổng doanh thu tích lũy từ đầu năm đến tháng hiện tại (\`SUM OVER ORDER BY thang\`) đặt tên là \`tong_luy_ke\`.
    `,
    syntaxExample: `WITH DoanhThuWithLag AS (
  SELECT thang, doanh_thu,
         LAG(doanh_thu, 1) OVER (ORDER BY thang) AS dt_truoc,
         SUM(doanh_thu) OVER (ORDER BY thang) AS luy_ke
  FROM doanh_thu_thang
)
SELECT thang, doanh_thu, dt_truoc,
       (doanh_thu - dt_truoc) AS tang_truong,
       luy_ke
FROM DoanhThuWithLag;`,
    schemas: [
      {
        name: 'doanh_thu_thang',
        description: 'Báo cáo doanh thu thuê bao SaaS theo tháng',
        columns: [
          { name: 'thang', type: 'TEXT PRIMARY KEY', description: 'Tháng tài chính (YYYY-MM)' },
          { name: 'doanh_thu', type: 'INTEGER', description: 'Tổng doanh thu định kỳ MRR (VNĐ)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE doanh_thu_thang (
        thang TEXT PRIMARY KEY,
        doanh_thu INTEGER NOT NULL
      );`,
      `INSERT INTO doanh_thu_thang VALUES
        ('2026-01', 100000000),
        ('2026-02', 125000000),
        ('2026-03', 140000000),
        ('2026-04', 135000000),
        ('2026-05', 180000000);`,
    ],
    exercise: {
      goal: 'Lập báo cáo hoàn chỉnh gồm doanh thu, tháng trước, mức tăng trưởng và lũy kế',
      taskDescription:
        'Sử dụng CTE để lấy `thang`, `doanh_thu`, `LAG(doanh_thu, 1) OVER (ORDER BY thang) AS doanh_thu_truoc`, `SUM(doanh_thu) OVER (ORDER BY thang) AS luy_ke`, sau đó trích xuất `thang, doanh_thu, doanh_thu_truoc, (doanh_thu - doanh_thu_truoc) AS tang_truong, luy_ke`.',
      starterQuery: `-- Báo cáo tài chính SaaS MRR\nWITH BaoCaoMRR AS (\n  SELECT thang, doanh_thu,\n         LAG(doanh_thu, 1) OVER (ORDER BY thang) AS doanh_thu_truoc,\n         SUM(doanh_thu) OVER (ORDER BY thang) AS luy_ke\n  FROM doanh_thu_thang\n)\nSELECT `,
      expectedQuery: `WITH BaoCaoMRR AS (SELECT thang, doanh_thu, LAG(doanh_thu, 1) OVER (ORDER BY thang) AS doanh_thu_truoc, SUM(doanh_thu) OVER (ORDER BY thang) AS luy_ke FROM doanh_thu_thang) SELECT thang, doanh_thu, doanh_thu_truoc, (doanh_thu - doanh_thu_truoc) AS tang_truong, luy_ke FROM BaoCaoMRR;`,
      hints: [
        'Truy vấn ngoài: SELECT thang, doanh_thu, doanh_thu_truoc, (doanh_thu - doanh_thu_truoc) AS tang_truong, luy_ke FROM BaoCaoMRR;',
      ],
      explanation:
        'XUẤT SẮC ĐỈNH CAO! Bạn đã áp dụng thành công những kỹ thuật phân tích dữ liệu nâng cao phức tạp nhất của Giai đoạn 3!',
    },
  },

  // =========================================================================
  // GIAI ĐOẠN 4: CHUYÊN GIA (EXPERT)
  // =========================================================================
  {
    id: 'sql-401',
    order: 16,
    stage: 'expert',
    stageTitle: 'Giai Đoạn 4: Chuyên Gia',
    title: 'Thiết Kế Lược Đồ CSDL & Chuẩn Hóa 3NF',
    subtitle: 'Tư duy kiến trúc sư CSDL: Tránh dị thường dữ liệu và loại bỏ trùng lặp dư thừa',
    category: 'Kiến Trúc & Tối Ưu',
    timeEstimate: '25 phút',
    xpReward: 140,
    concept: `
### Các cấp độ chuẩn hóa (Normalization)
1. **1NF (Dạng chuẩn 1):** Mỗi ô dữ liệu là nguyên tử (Atomic), không lưu danh sách mảng nhiều giá trị trong 1 ô.
2. **2NF (Dạng chuẩn 2):** Đạt 1NF và mọi thuộc tính không khóa phải phụ thuộc hoàn toàn vào toàn bộ khóa chính (áp dụng khi khóa chính gồm nhiều cột).
3. **3NF (Dạng chuẩn 3):** Đạt 2NF và không có thuộc tính không khóa nào phụ thuộc bắc cầu (\`A -> B -> C\`) vào khóa chính.
    `,
    syntaxExample: `-- Tạo bảng chuẩn 3NF có ràng buộc khóa ngoại
CREATE TABLE khach_hang (
  id INTEGER PRIMARY KEY,
  ho_ten TEXT NOT NULL
);

CREATE TABLE don_hang (
  id INTEGER PRIMARY KEY,
  khach_hang_id INTEGER NOT NULL,
  ngay_tao TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE
);`,
    schemas: [
      {
        name: 'hoa_don_chuan',
        description: 'Bảng hóa đơn chuẩn hóa 3NF',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã hóa đơn' },
          { name: 'ma_khach', type: 'INTEGER', description: 'Mã khách hàng' },
          { name: 'tong_tien', type: 'INTEGER', description: 'Số tiền thanh toán' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE hoa_don_chuan (
        id INTEGER PRIMARY KEY,
        ma_khach INTEGER NOT NULL,
        tong_tien INTEGER NOT NULL
      );`,
      `INSERT INTO hoa_don_chuan VALUES
        (1, 101, 1500000),
        (2, 102, 2400000),
        (3, 101, 800000);`,
    ],
    exercise: {
      goal: 'Truy vấn kiểm tra tính toàn vẹn dữ liệu của các hóa đơn có giá trị lớn hơn mức trung bình',
      taskDescription:
        'Viết câu truy vấn trích xuất `id, ma_khach, tong_tien` từ `hoa_don_chuan` có `tong_tien > (SELECT AVG(tong_tien) FROM hoa_don_chuan)`.',
      starterQuery: `-- Lọc hóa đơn trên mức trung bình\nSELECT id, ma_khach, tong_tien FROM hoa_don_chuan WHERE tong_tien > `,
      expectedQuery: `SELECT id, ma_khach, tong_tien FROM hoa_don_chuan WHERE tong_tien > (SELECT AVG(tong_tien) FROM hoa_don_chuan);`,
      hints: [
        'Dùng Scalar Subquery: WHERE tong_tien > (SELECT AVG(tong_tien) FROM hoa_don_chuan)',
      ],
      explanation:
        'Chính xác! Cấu trúc dữ liệu chuẩn hóa giúp các truy vấn tổng hợp chạy tin cậy và không bao giờ bị lệch số liệu do cập nhật dị thường.',
    },
    quizzes: [
      {
        question: 'Dạng chuẩn 3 (3NF) giải quyết vấn đề gì trong cơ sở dữ liệu?',
        options: [
          'Loại bỏ sự phụ thuộc bắc cầu (transitive dependency) giữa các cột không khóa',
          'Tăng gấp đôi tốc độ truy vấn SELECT',
          'Tự động mã hóa mật khẩu người dùng',
          'Xóa toàn bộ các bảng phụ',
        ],
        answerIndex: 0,
        explanation: 'Chuẩn 3NF đảm bảo rằng mọi cột không khóa chỉ phụ thuộc duy nhất vào Khóa chính, không được phụ thuộc gián tiếp qua một cột không khóa khác.',
      },
    ],
  },

  {
    id: 'sql-402',
    order: 17,
    stage: 'expert',
    stageTitle: 'Giai Đoạn 4: Chuyên Gia',
    title: 'Chỉ Mục (INDEX) & Kế Hoạch Thực Thi EXPLAIN QUERY PLAN',
    subtitle: 'Nắm vững cơ chế B-Tree Index và kỹ thuật viết câu truy vấn SARGable',
    category: 'Hiệu Năng & Chỉ Mục',
    timeEstimate: '25 phút',
    xpReward: 150,
    concept: `
### 1. Chỉ mục (Index) tăng tốc truy vấn ra sao?
Nếu không có Index, CSDL phải quét từng dòng dữ liệu từ đầu đến cuối (**Full Table Scan** - độ phức tạp $\\mathcal{O}(N)$).
Khi có Index B-Tree, CSDL tra cứu bằng cây nhị phân cân bằng với độ phức tạp $\\mathcal{O}(\\log N)$, nhanh hơn hàng ngàn lần trên bảng triệu dòng!

### 2. Kế hoạch thực thi với EXPLAIN QUERY PLAN
Thêm từ khóa \`EXPLAIN QUERY PLAN\` trước câu lệnh SQL để xem cách Database Engine diễn dịch:
- \`SCAN TABLE ten_bang\`: Cảnh báo chậm! Quét toàn bộ bảng.
- \`SEARCH TABLE ten_bang USING INDEX idx_ten\`: Tối ưu! Dùng chỉ mục.
    `,
    syntaxExample: `-- Tạo chỉ mục trên cột email
CREATE UNIQUE INDEX idx_kh_email ON khach_hang(email);

-- Xem kế hoạch thực thi
EXPLAIN QUERY PLAN 
SELECT * FROM khach_hang WHERE email = 'test@gmail.com';`,
    schemas: [
      {
        name: 'tai_khoan',
        description: 'Bảng tài khoản người dùng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã số' },
          { name: 'email', type: 'TEXT', description: 'Email đăng nhập' },
          { name: 'so_du', type: 'INTEGER', description: 'Số dư ví' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE tai_khoan (
        id INTEGER PRIMARY KEY,
        email TEXT NOT NULL,
        so_du INTEGER NOT NULL
      );`,
      `CREATE INDEX idx_tk_email ON tai_khoan(email);`,
      `INSERT INTO tai_khoan VALUES
        (1, 'alex@tech.vn', 5000000),
        (2, 'sarah@fin.vn', 12000000),
        (3, 'david@corp.vn', 8500000);`,
    ],
    exercise: {
      goal: 'Xem kế hoạch thực thi EXPLAIN QUERY PLAN khi tìm kiếm bằng email',
      taskDescription:
        "Chạy câu lệnh `EXPLAIN QUERY PLAN SELECT * FROM tai_khoan WHERE email = 'alex@tech.vn';` để kiểm tra SQLite có sử dụng chỉ mục `idx_tk_email` hay không.",
      starterQuery: `-- Xem kế hoạch thực thi EXPLAIN QUERY PLAN\nEXPLAIN QUERY PLAN SELECT * FROM tai_khoan WHERE email = 'alex@tech.vn';`,
      expectedQuery: `EXPLAIN QUERY PLAN SELECT * FROM tai_khoan WHERE email = 'alex@tech.vn';`,
      hints: [
        "Chỉ cần chạy câu lệnh: EXPLAIN QUERY PLAN SELECT * FROM tai_khoan WHERE email = 'alex@tech.vn';",
      ],
      explanation:
        'Tuyệt vời! Kết quả hiển thị "SEARCH TABLE tai_khoan USING INDEX idx_tk_email" chứng minh truy vấn đã tối ưu triệt để nhờ Index.',
    },
    quizzes: [
      {
        question: 'Tại sao câu lệnh "WHERE UPPER(email) = \'A@B.COM\'" thường không dùng được Index thông thường trên cột email?',
        options: [
          'Vì khi bọc hàm UPPER() lên cột, giá trị bị biến đổi khiến CSDL không thể tra cứu trực tiếp trên cây B-Tree của cột gốc (Non-SARGable)',
          'Vì hàm UPPER bị cấm trong SQL',
          'Vì email luôn phải viết thường',
          'Không có lý do nào, nó vẫn dùng Index bình thường',
        ],
        answerIndex: 0,
        explanation: 'Áp dụng hàm tính toán lên cột tìm kiếm làm mất tính chất SARGable (Search Argument Able), buộc CSDL phải tính hàm cho từng dòng trong bảng.',
      },
    ],
  },

  {
    id: 'sql-403',
    order: 18,
    stage: 'expert',
    stageTitle: 'Giai Đoạn 4: Chuyên Gia',
    title: 'Khung Nhìn VIEW & TRIGGER Ghi Log Kiểm Toán Tự Động',
    subtitle: 'Bảo mật dữ liệu với VIEW và tự động hóa kiểm soát với TRIGGER',
    category: 'Tự Động Hóa & Kiểm Soát',
    timeEstimate: '20 phút',
    xpReward: 140,
    concept: `
### 1. Khung nhìn ảo (VIEW)
VIEW là một câu truy vấn được lưu lại dưới dạng bảng ảo, giúp:
- Đơn giản hóa các câu lệnh JOIN phức tạp cho người dùng cuối.
- Che giấu các cột nhạy cảm (như mật khẩu, số căn cước).

### 2. Bộ kích hoạt tự động (TRIGGER)
TRIGGER là khối mã tự động chạy khi có sự kiện \`INSERT\`, \`UPDATE\`, hoặc \`DELETE\` xảy ra trên một bảng:
- \`NEW.cot\`: Truy cập dữ liệu dòng mới vừa thêm/sửa.
- \`OLD.cot\`: Truy cập dữ liệu dòng cũ trước khi sửa/xóa.
    `,
    syntaxExample: `-- Tạo view báo cáo
CREATE VIEW v_nhan_vien_it AS
SELECT ho_ten, luong FROM nhan_vien WHERE phong_ban = 'IT';

-- Xem dữ liệu từ View
SELECT * FROM v_nhan_vien_it;`,
    schemas: [
      {
        name: 'san_pham_gia',
        description: 'Bảng giá sản phẩm',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã hàng' },
          { name: 'ten', type: 'TEXT', description: 'Tên hàng' },
          { name: 'gia', type: 'INTEGER', description: 'Giá tiền' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE san_pham_gia (
        id INTEGER PRIMARY KEY,
        ten TEXT NOT NULL,
        gia INTEGER NOT NULL
      );`,
      `CREATE TABLE lich_su_gia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        san_pham_id INTEGER,
        gia_cu INTEGER,
        gia_moi INTEGER
      );`,
      `CREATE TRIGGER trg_log_gia
      AFTER UPDATE OF gia ON san_pham_gia
      BEGIN
        INSERT INTO lich_su_gia (san_pham_id, gia_cu, gia_moi)
        VALUES (OLD.id, OLD.gia, NEW.gia);
      END;`,
      `INSERT INTO san_pham_gia VALUES (1, 'Bàn Phím Cơ', 1500000);`,
      `UPDATE san_pham_gia SET gia = 1800000 WHERE id = 1;`,
    ],
    exercise: {
      goal: 'Xem nhật ký kiểm toán giá vừa được Trigger tự động ghi nhận',
      taskDescription:
        'Sau khi sản phẩm được cập nhật giá từ 1,500,000 lên 1,800,000 VNĐ, hãy viết câu lệnh `SELECT * FROM lich_su_gia;` để kiểm tra bảng nhật ký tự động.',
      starterQuery: `-- Kiểm tra log tự động từ Trigger\nSELECT * FROM lich_su_gia;`,
      expectedQuery: `SELECT * FROM lich_su_gia;`,
      hints: ['Chỉ cần gõ: SELECT * FROM lich_su_gia;'],
      explanation:
        'Tuyệt vời! Bạn thấy rằng Trigger đã tự động ghi lại giá cũ (1500000) và giá mới (1800000) mà không cần code ứng dụng phải viết 2 câu lệnh!',
    },
  },

  {
    id: 'sql-404',
    order: 19,
    stage: 'expert',
    stageTitle: 'Giai Đoạn 4: Chuyên Gia',
    title: 'Kỹ Thuật Upsert (INSERT ON CONFLICT) & Data Pipelines',
    subtitle: 'Nền tảng xử lý dữ liệu cho Kỹ sư Dữ liệu (Data Engineer)',
    category: 'Data Engineering',
    timeEstimate: '20 phút',
    xpReward: 150,
    concept: `
### Kỹ thuật Upsert (Update or Insert)
Trong các đường ống dẫn dữ liệu (ETL/ELT Pipelines), khi nhận một bản ghi:
- Nếu bản ghi **chưa tồn tại**: Thêm mới (\`INSERT\`).
- Nếu bản ghi **đã tồn tại** (trùng khóa chính hoặc UNIQUE): Cập nhật giá trị mới (\`UPDATE\`).

Cú pháp SQLite / PostgreSQL chuẩn:
\`\`\`sql
INSERT INTO thong_ke (ngay, luot_xem)
VALUES ('2026-10-29', 100)
ON CONFLICT(ngay) DO UPDATE SET 
  luot_xem = luot_xem + EXCLUDED.luot_xem;
\`\`\`
    `,
    syntaxExample: `INSERT INTO diem_so (id, diem) VALUES (1, 95)
ON CONFLICT(id) DO UPDATE SET diem = EXCLUDED.diem;`,
    schemas: [
      {
        name: 'kho_tong',
        description: 'Tồn kho tổng hợp theo mã sản phẩm',
        columns: [
          { name: 'sku', type: 'TEXT PRIMARY KEY', description: 'Mã hàng' },
          { name: 'so_luong', type: 'INTEGER', description: 'Số lượng hàng' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE kho_tong (
        sku TEXT PRIMARY KEY,
        so_luong INTEGER NOT NULL
      );`,
      `INSERT INTO kho_tong VALUES ('SKU-01', 50);`,
    ],
    exercise: {
      goal: 'Thực hiện phép Upsert cộng dồn tồn kho hàng hóa',
      taskDescription:
        "Viết câu lệnh INSERT nhập thêm 30 đơn vị cho 'SKU-01', nếu đã có thì cộng dồn: `INSERT INTO kho_tong (sku, so_luong) VALUES ('SKU-01', 30) ON CONFLICT(sku) DO UPDATE SET so_luong = so_luong + EXCLUDED.so_luong;` sau đó chạy `SELECT * FROM kho_tong;`.",
      starterQuery: `-- Upsert cộng dồn hàng tồn kho\nINSERT INTO kho_tong (sku, so_luong) VALUES ('SKU-01', 30)\nON CONFLICT(sku) DO UPDATE SET so_luong = so_luong + EXCLUDED.so_luong;\nSELECT * FROM kho_tong;`,
      expectedQuery: `INSERT INTO kho_tong (sku, so_luong) VALUES ('SKU-01', 30) ON CONFLICT(sku) DO UPDATE SET so_luong = so_luong + EXCLUDED.so_luong; SELECT * FROM kho_tong;`,
      hints: [
        'Dùng từ khóa ON CONFLICT(sku) DO UPDATE SET so_luong = so_luong + EXCLUDED.so_luong;',
      ],
      explanation:
        'Chính xác! Tồn kho đã tăng từ 50 lên 80 một cách an toàn và nhất quán (Idempotent Pipeline).',
    },
  },

  {
    id: 'sql-405',
    order: 20,
    stage: 'expert',
    stageTitle: 'Giai Đoạn 4: Chuyên Gia',
    title: 'Dự Án Tốt Nghiệp Chuyên Gia: Hệ Thống Phát Hiện Gian Lận Giao Dịch',
    subtitle: 'Đỉnh cao kỹ năng phân tích và kỹ thuật dữ liệu giải quyết bài toán tài chính phức tạp',
    category: 'Capstone Project Tốt Nghiệp',
    timeEstimate: '40 phút',
    xpReward: 250,
    isCapstoneProject: true,
    concept: `
### Đồ Án Tốt Nghiệp: Fraud Detection Engine
Chào mừng bạn đến với thử thách cuối cùng của Lộ trình Chuyên Gia SQL!
Bạn được giao nhiệm vụ viết thuật toán SQL phát hiện **giao dịch tài chính đáng ngờ (Fraud Transactions)** cho một ngân hàng lớn:

**Luật phát hiện gian lận (Fraud Rules):**
1. Một chủ thẻ thực hiện 2 giao dịch liên tiếp cách nhau **dưới 10 phút** nhưng lại diễn ra ở **2 thành phố khác nhau** (Bất khả thi về mặt di chuyển vật lý).
2. Hãy dùng hàm \`LAG() OVER (PARTITION BY ma_the ORDER BY thoi_gian)\` để so sánh thành phố và mốc thời gian giữa 2 giao dịch kế cận!
    `,
    syntaxExample: `WITH GiaoDichTruoc AS (
  SELECT id, ma_the, thanh_pho, thoi_gian,
         LAG(thanh_pho) OVER (PARTITION BY ma_the ORDER BY thoi_gian) AS tp_truoc
  FROM giao_dich
)
SELECT * FROM GiaoDichTruoc WHERE thanh_pho <> tp_truoc;`,
    schemas: [
      {
        name: 'giao_dich_ngan_hang',
        description: 'Nhật ký các giao dịch thẻ tín dụng thời gian thực',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã giao dịch' },
          { name: 'ma_the', type: 'TEXT', description: 'Số thẻ tín dụng' },
          { name: 'thanh_pho', type: 'TEXT', description: 'Địa điểm phát sinh giao dịch' },
          { name: 'so_tien', type: 'INTEGER', description: 'Giá trị' },
          { name: 'thoi_gian', type: 'TEXT', description: 'Thời điểm (YYYY-MM-DD HH:MM:SS)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE giao_dich_ngan_hang (
        id INTEGER PRIMARY KEY,
        ma_the TEXT NOT NULL,
        thanh_pho TEXT NOT NULL,
        so_tien INTEGER NOT NULL,
        thoi_gian TEXT NOT NULL
      );`,
      `INSERT INTO giao_dich_ngan_hang VALUES
        (1, 'THE-9999', 'Hà Nội', 2000000, '2026-10-29 10:00:00'),
        (2, 'THE-9999', 'TP.HCM', 15000000, '2026-10-29 10:05:00'),
        (3, 'THE-8888', 'Đà Nẵng', 500000, '2026-10-29 11:00:00'),
        (4, 'THE-8888', 'Đà Nẵng', 700000, '2026-10-29 11:30:00'),
        (5, 'THE-7777', 'Hải Phòng', 3500000, '2026-10-29 12:00:00');`,
    ],
    exercise: {
      goal: 'Lập danh sách các giao dịch gian lận do thay đổi thành phố bất thường',
      taskDescription:
        'Sử dụng CTE `TruyVet` với `LAG(thanh_pho) OVER (PARTITION BY ma_the ORDER BY thoi_gian) AS tp_truoc`, sau đó lọc ra các giao dịch có `tp_truoc IS NOT NULL AND thanh_pho <> tp_truoc`. Trích xuất `id, ma_the, thanh_pho, tp_truoc, so_tien, thoi_gian`.',
      starterQuery: `-- Đồ án Tốt nghiệp: Phát hiện gian lận thẻ\nWITH TruyVet AS (\n  SELECT id, ma_the, thanh_pho, so_tien, thoi_gian,\n         LAG(thanh_pho) OVER (PARTITION BY ma_the ORDER BY thoi_gian) AS tp_truoc\n  FROM giao_dich_ngan_hang\n)\nSELECT `,
      expectedQuery: `WITH TruyVet AS (SELECT id, ma_the, thanh_pho, so_tien, thoi_gian, LAG(thanh_pho) OVER (PARTITION BY ma_the ORDER BY thoi_gian) AS tp_truoc FROM giao_dich_ngan_hang) SELECT id, ma_the, thanh_pho, tp_truoc, so_tien, thoi_gian FROM TruyVet WHERE tp_truoc IS NOT NULL AND thanh_pho <> tp_truoc;`,
      hints: [
        'Lọc điều kiện: WHERE tp_truoc IS NOT NULL AND thanh_pho <> tp_truoc',
      ],
      explanation:
        'VINH DANH CHUYÊN GIA DỮ LIỆU! Bạn đã hoàn thành xuất sắc đồ án Capstone và làm chủ toàn diện ngôn ngữ SQL từ Nhập môn đến Chuyên gia cấp cao!',
    },
  },
];
