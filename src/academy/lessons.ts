import { Lesson } from './types';

export const allLessons: Lesson[] = [
  // =========================================================================
  // GIAI ĐOẠN 1: NHẬP MÔN (BEGINNER) - BƯỚC ĐẦU LÀM QUEN VỚI DỮ LIỆU 🚀
  // =========================================================================
  {
    id: 'sql-101',
    order: 1,
    stage: 'beginner',
    stageTitle: 'Giai Đoạn 1: Nhập Môn',
    title: 'BÀI 1: SELECT & FROM - Lời Chào Sân Với Dữ Liệu 👋',
    subtitle: 'Nắm vững câu thần chú để gọi tài liệu ra khỏi chiếc tủ hồ sơ CSDL',
    category: 'Truy Vấn Căn Bản',
    timeEstimate: '10 phút',
    xpReward: 50,
    concept: `
### 📖 Lý thuyết Cốt lõi
Hãy tưởng tượng cơ sở dữ liệu của bạn như một file Excel khổng lồ chứa nhiều bảng (Table) khác nhau.
Để lấy dữ liệu ra, bạn chỉ cần trả lời 2 câu hỏi:
1. Bạn muốn lấy cột nào? 👉 Dùng **\`SELECT\`**
2. Từ bảng nào? 👉 Dùng **\`FROM\`**

💡 **Mẹo nhỏ:** Nếu bạn muốn lấy **TẤT CẢ** các cột trong bảng, hãy dùng dấu sao \`*\`.
    `,
    syntaxExample: `-- 1. Lấy một số cột cụ thể (tên và chuyên ngành) từ bảng sinh viên
SELECT full_name, major 
FROM students;

-- 2. Lấy toàn bộ thông tin tất cả các cột bằng dấu sao (*)
SELECT * 
FROM students;`,
    schemas: [
      {
        name: 'Movies',
        description: 'Kho dữ liệu điện ảnh toàn cầu',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã phim' },
          { name: 'title', type: 'TEXT', description: 'Tên bộ phim' },
          { name: 'director', type: 'TEXT', description: 'Đạo diễn' },
          { name: 'release_year', type: 'INTEGER', description: 'Năm phát hành' },
          { name: 'genre', type: 'TEXT', description: 'Thể loại phim' },
          { name: 'revenue', type: 'INTEGER', description: 'Doanh thu phòng vé ($)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Movies (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        director TEXT NOT NULL,
        release_year INTEGER NOT NULL,
        genre TEXT NOT NULL,
        revenue INTEGER NOT NULL
      );`,
      `INSERT INTO Movies VALUES
        (1, 'Inception', 'Christopher Nolan', 2010, 'Action', 836800000),
        (2, 'Interstellar', 'Christopher Nolan', 2014, 'Sci-Fi', 701700000),
        (3, 'Avatar: The Way of Water', 'James Cameron', 2022, 'Action', 2320000000),
        (4, 'The Dark Knight', 'Christopher Nolan', 2008, 'Action', 1006000000),
        (5, 'Titanic', 'James Cameron', 1997, 'Romance', 2257000000),
        (6, 'Oppenheimer', 'Christopher Nolan', 2023, 'Drama', 957000000);`,
    ],
    exercise: {
      goal: 'Trích xuất danh sách gồm 2 cột: tên phim (title) và năm phát hành (release_year) từ bảng Movies',
      taskDescription:
        `🎬 **Bối cảnh:** Bạn đang tiếp quản kho lưu trữ điện ảnh toàn cầu. Quản lý rạp chiếu cần một danh mục tóm tắt các tác phẩm để chuẩn bị cho tuần lễ phim cổ điển.

🎯 **Yêu cầu cụ thể:**
- Truy vấn dữ liệu từ bảng **\`Movies\`**.
- Chỉ chọn ra đúng 2 cột: tên phim (**\`title\`**) và năm phát hành (**\`release_year\`**).
- Không lấy các cột khác để báo cáo ngắn gọn, đúng trọng tâm.

💡 **Mẹo:** Dùng cấu trúc: \`SELECT cot_1, cot_2 FROM ten_bang;\`. Đừng quên kết thúc câu lệnh bằng dấu chấm phẩy (\`;\`).`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT title, release_year FROM Movies;`,
      hints: [
        'Cấu trúc cơ bản: SELECT tên_cột_1, tên_cột_2 FROM tên_bảng;',
        'Ở bài này, hai cột cần chọn là title và release_year, lấy từ bảng Movies.',
      ],
      explanation:
        'Chính xác! Bạn vừa gọi thành công tài liệu từ chiếc tủ hồ sơ CSDL ra màn hình.',
    },
    quizzes: [
      {
        question: 'Ký tự nào dùng để chọn TẤT CẢ các cột trong SQL?',
        options: ['Dấu sao (*)', 'Dấu cộng (+)', 'Chữ ALL', 'Dấu chấm (.)'],
        answerIndex: 0,
        explanation: 'Dấu sao (*) trong mệnh đề SELECT đại diện cho việc lấy tất cả các cột của bảng.',
      },
    ],
  },

  {
    id: 'sql-102',
    order: 2,
    stage: 'beginner',
    stageTitle: 'Giai Đoạn 1: Nhập Môn',
    title: 'BÀI 2: LỌC DỮ LIỆU (WHERE) - Bộ Lọc Thần Kỳ 🔍',
    subtitle: 'Lọc ra đúng những dòng dữ liệu bạn cần giống như lọc hàng Shopee',
    category: 'Bộ Lọc Dữ Liệu',
    timeEstimate: '12 phút',
    xpReward: 60,
    concept: `
### 📖 Lý thuyết Cốt lõi
Rất hiếm khi chúng ta cần xem *toàn bộ* hàng ngàn dòng dữ liệu. Bạn sẽ cần "lọc" chúng giống như cách bạn lọc sản phẩm trên Shopee (chỉ xem hàng dưới 100k chẳng hạn).
Trong SQL, chúng ta dùng từ khóa **\`WHERE\`** (Ở đâu / Nơi mà) để lọc ra các dòng thỏa mãn điều kiện.

Các toán tử so sánh cơ bản:
- \`=\`: Bằng
- \`>\`: Lớn hơn
- \`<\`: Nhỏ hơn
- \`<>\` hoặc \`!=\`: Khác (Không bằng)
    `,
    syntaxExample: `-- 1. Lọc khách hàng sống tại Hà Nội (chuỗi văn bản đặt trong dấu nháy đơn ' ')
SELECT * 
FROM customers 
WHERE city = 'Hanoi';

-- 2. Lọc các hóa đơn có giá trị lớn hơn 500$ (số không cần dấu nháy)
SELECT order_id, amount 
FROM invoices 
WHERE amount > 500;`,
    schemas: [
      {
        name: 'Movies',
        description: 'Kho dữ liệu điện ảnh',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã phim' },
          { name: 'title', type: 'TEXT', description: 'Tên bộ phim' },
          { name: 'director', type: 'TEXT', description: 'Đạo diễn' },
          { name: 'release_year', type: 'INTEGER', description: 'Năm phát hành' },
          { name: 'genre', type: 'TEXT', description: 'Thể loại' },
          { name: 'revenue', type: 'INTEGER', description: 'Doanh thu' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Movies (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        director TEXT NOT NULL,
        release_year INTEGER NOT NULL,
        genre TEXT NOT NULL,
        revenue INTEGER NOT NULL
      );`,
      `INSERT INTO Movies VALUES
        (1, 'Inception', 'Christopher Nolan', 2010, 'Action', 836800000),
        (2, 'Interstellar', 'Christopher Nolan', 2014, 'Sci-Fi', 701700000),
        (3, 'Avatar', 'James Cameron', 2009, 'Action', 2923000000),
        (4, 'The Dark Knight', 'Christopher Nolan', 2008, 'Action', 1006000000),
        (5, 'Titanic', 'James Cameron', 1997, 'Romance', 2257000000);`,
    ],
    exercise: {
      goal: 'Lọc toàn bộ thông tin các bộ phim của đạo diễn Christopher Nolan',
      taskDescription:
        `🎬 **Bối cảnh:** Để chuẩn bị cho buổi tọa đàm về điện ảnh nghệ thuật, ban tổ chức muốn tổng hợp lại toàn bộ các siêu phẩm của vị đạo diễn lừng danh **Christopher Nolan**.

🎯 **Yêu cầu cụ thể:**
- Lấy **tất cả các cột** (\`*\`) từ bảng dữ liệu **\`Movies\`**.
- Áp dụng mệnh đề lọc **\`WHERE\`** với điều kiện đạo diễn: \`director = 'Christopher Nolan'\`.

💡 **Lưu ý:** Tên riêng hoặc chuỗi ký tự trong SQL luôn phải đặt trong cặp dấu nháy đơn (ví dụ \`'Christopher Nolan'\`), phân biệt chính xác chữ hoa và chữ thường.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT * FROM Movies WHERE director = 'Christopher Nolan';`,
      hints: [
        'Sử dụng câu lệnh: SELECT * FROM Movies WHERE director = \'...\';',
        'Nhớ viết hoa chữ Christopher Nolan đúng chính tả và đặt trong cặp dấu nháy đơn.',
      ],
      explanation:
        'Tuyệt vời! Bạn đã sử dụng bộ lọc thần kỳ WHERE để trích xuất chính xác phim của đạo diễn Christopher Nolan.',
    },
    quizzes: [
      {
        question: 'Mệnh đề nào dùng để lọc dữ liệu trong SQL?',
        options: ['WHERE', 'FILTER', 'FIND', 'SEARCH'],
        answerIndex: 0,
        explanation: 'Mệnh đề WHERE dùng để áp dụng điều kiện lọc trên từng dòng dữ liệu trong bảng.',
      },
    ],
  },

  {
    id: 'sql-103',
    order: 3,
    stage: 'beginner',
    stageTitle: 'Giai Đoạn 1: Nhập Môn',
    title: 'BÀI 3: AND, OR, NOT - Kết Hợp Điều Kiện 🧩',
    subtitle: 'Nối các tiêu chí lọc phức tạp cho bài toán thực tế',
    category: 'Bộ Lọc Dữ Liệu',
    timeEstimate: '12 phút',
    xpReward: 60,
    concept: `
### 📖 Lý thuyết Cốt lõi
Cuộc sống không phải lúc nào cũng chỉ có 1 điều kiện. Đôi khi bạn muốn mua một chiếc điện thoại "Rẻ" **VÀ** "Đẹp". SQL cung cấp cho bạn 3 công cụ nối điều kiện:
- **\`AND\` (Và):** Dữ liệu phải thỏa mãn CẢ HAI điều kiện (Rất khắt khe).
- **\`OR\` (Hoặc):** Dữ liệu chỉ cần thỏa mãn MỘT TRONG HAI điều kiện là được (Dễ dãi).
- **\`NOT\` (Không):** Lọc ra những dữ liệu KHÔNG thỏa mãn điều kiện đó.
    `,
    syntaxExample: `-- 1. Lấy sản phẩm thuộc ngành 'Điện tử' VÀ có giá dưới 300$
SELECT product_name, price, category 
FROM products 
WHERE category = 'Electronics' AND price < 300;

-- 2. Lấy sản phẩm hết hàng (stock = 0) HOẶC trạng thái 'Ngừng kinh doanh'
SELECT product_name, status 
FROM products 
WHERE stock_quantity = 0 OR status = 'Discontinued';`,
    schemas: [
      {
        name: 'employees',
        description: 'Bảng nhân sự công ty',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã nhân viên' },
          { name: 'name', type: 'TEXT', description: 'Tên nhân viên' },
          { name: 'department', type: 'TEXT', description: 'Phòng ban' },
          { name: 'salary', type: 'INTEGER', description: 'Mức lương ($)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        salary INTEGER NOT NULL
      );`,
      `INSERT INTO employees VALUES
        (1, 'Nguyen Van A', 'IT', 2500),
        (2, 'Tran Thi B', 'HR', 1500),
        (3, 'Le Van C', 'IT', 1800),
        (4, 'Pham Thi D', 'Sales', 2200),
        (5, 'Hoang Van E', 'Marketing', 1900);`,
    ],
    exercise: {
      goal: 'Tìm nhân viên làm việc tại phòng \'IT\' HOẶC có mức lương trên 2000$',
      taskDescription:
        `🏢 **Bối cảnh:** Phòng Nhân sự (HR) cần lập danh sách để trao thưởng cuối năm cho những nhân sự chủ chốt hoặc nhân sự thuộc bộ phận kỹ thuật mũi nhọn.

🎯 **Yêu cầu cụ thể:**
- Lấy toàn bộ thông tin (\`*\`) từ bảng nhân sự **\`employees\`**.
- Lọc dữ liệu thỏa mãn **ít nhất một trong hai** điều kiện sau (sử dụng toán tử **\`OR\`**):
  1. Nhân viên thuộc phòng Công nghệ: \`department = 'IT'\`.
  2. HOẶC nhân viên có mức lương cao: \`salary > 2000\` (bất kể phòng ban nào).

💡 **Lưu ý:** Toán tử \`OR\` chỉ cần 1 trong 2 vế điều kiện đúng là bản ghi sẽ được trả về.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT * FROM employees WHERE department = 'IT' OR salary > 2000;`,
      hints: [
        'Cấu trúc: SELECT * FROM employees WHERE điều_kiện_1 OR điều_kiện_2;',
        'Hai điều kiện ở đây là: department = \'IT\' và salary > 2000.',
      ],
      explanation:
        'Chính xác! Toán tử OR giúp bạn gom các nhân viên thỏa mãn ít nhất một trong hai tiêu chí.',
    },
    quizzes: [
      {
        question: 'Nếu muốn lấy dữ liệu thỏa mãn điều kiện A HOẶC điều kiện B, ta dùng từ khóa nào?',
        options: ['OR', 'AND', 'EITHER', 'ANY'],
        answerIndex: 0,
        explanation: 'Từ khóa OR kiểm tra nếu một trong hai điều kiện đúng thì bản ghi sẽ được chọn.',
      },
    ],
  },

  {
    id: 'sql-104',
    order: 4,
    stage: 'beginner',
    stageTitle: 'Giai Đoạn 1: Nhập Môn',
    title: 'BÀI 4: ORDER BY & LIMIT - Bảng Vàng Danh Dự 🏆',
    subtitle: 'Sắp xếp danh sách đẹp mắt và hiển thị Top các giá trị cao/thấp nhất',
    category: 'Sắp Xếp & Phân Trang',
    timeEstimate: '12 phút',
    xpReward: 60,
    concept: `
### 📖 Lý thuyết Cốt lõi
Sau khi đã lọc được dữ liệu bằng \`WHERE\`, bạn sẽ muốn sắp xếp và giới hạn kết quả trả về:

- **\`ORDER BY [tên_cột]\` (Sắp xếp theo thứ tự):**
  - **\`ASC\` (Ascending - Tăng dần):** Sắp xếp từ nhỏ đến lớn (1 → 10, A → Z). Đây là thứ tự **mặc định** trong SQL (nếu không ghi rõ ASC hay DESC, SQL tự hiểu là \`ASC\`).
  - **\`DESC\` (Descending - Giảm dần):** Sắp xếp từ lớn đến nhỏ (10 → 1, Z → A). Thường dùng khi muốn tìm điểm cao nhất, giá đắt nhất, hoặc dữ liệu mới nhất...

- **\`LIMIT [số_lượng]\` (Giới hạn số dòng):**
  - Giúp bạn chỉ lấy đúng số lượng dòng mong muốn tính từ trên xuống (ví dụ \`LIMIT 5\` sẽ lấy đúng 5 dòng đầu tiên).
  - Khi kết hợp với \`ORDER BY\`, ta sẽ có công thức hoàn hảo để lấy danh sách **Top N** (ví dụ: Top 3 học sinh giỏi nhất, Top 10 video xem nhiều nhất).
    `,
    syntaxExample: `-- 1. Tìm Top 5 học sinh có điểm thi cao nhất (sắp xếp giảm dần DESC)
SELECT student_name, score 
FROM students 
ORDER BY score DESC 
LIMIT 5;

-- 2. Sắp xếp danh sách nhân viên theo bảng chữ cái A-Z (tăng dần ASC)
SELECT full_name, department 
FROM employees 
ORDER BY full_name ASC;`,
    schemas: [
      {
        name: 'products',
        description: 'Bảng sản phẩm cửa hàng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã hàng' },
          { name: 'name', type: 'TEXT', description: 'Tên sản phẩm' },
          { name: 'price', type: 'INTEGER', description: 'Giá bán ($)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL
      );`,
      `INSERT INTO products VALUES
        (1, 'Bàn phím cơ Pro', 120),
        (2, 'Chuột không dây Silent', 45),
        (3, 'Tai nghe Chống ồn', 250),
        (4, 'Miếng lót chuột Gaming', 15),
        (5, 'Cáp sạc Type-C siêu bền', 20),
        (6, 'Giá đỡ Laptop kim loại', 35);`,
    ],
    exercise: {
      goal: 'Lấy ra thông tin Top 3 sản phẩm rẻ nhất (giá tăng dần ASC)',
      taskDescription:
        `🛒 **Bối cảnh:** Cửa hàng công nghệ chuẩn bị chạy chiến dịch Flash Sale "Giá Rẻ Bất Ngờ". Bạn cần tìm ra 3 sản phẩm có mức giá thấp nhất để đặt lên vị trí nổi bật nhất của trang chủ.

🎯 **Yêu cầu cụ thể:**
- Lấy toàn bộ thông tin (\`*\`) từ bảng sản phẩm **\`products\`**.
- Sắp xếp dữ liệu theo giá bán (**\`price\`**) từ rẻ nhất đến đắt nhất (dùng **\`ORDER BY price ASC\`**).
- Giới hạn kết quả chỉ lấy đúng 3 sản phẩm rẻ nhất (dùng **\`LIMIT 3\`**).

💡 **Mẹo:** \`ASC\` là viết tắt của Ascending (tăng dần). Khi muốn tìm giá rẻ nhất, thấp nhất, hãy luôn sắp xếp \`ASC\`.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT * FROM products ORDER BY price ASC LIMIT 3;`,
      hints: [
        'Sắp xếp giá tăng dần từ nhỏ tới lớn: ORDER BY price ASC',
        'Giới hạn 3 dòng kết quả đầu tiên: LIMIT 3',
      ],
      explanation:
        'Rất tốt! Cú pháp ORDER BY ... ASC LIMIT 3 giúp bạn lấy chuẩn xác Top 3 sản phẩm giá mềm nhất.',
    },
    quizzes: [
      {
        question: 'Lệnh nào dùng để sắp xếp kết quả giảm dần trong SQL?',
        options: ['DESC', 'ASC', 'DOWN', 'REVERSE'],
        answerIndex: 0,
        explanation: 'Từ khóa DESC (Descending) dùng để sắp xếp dữ liệu theo thứ tự giảm dần.',
      },
    ],
  },

  {
    id: 'sql-105',
    order: 5,
    stage: 'beginner',
    stageTitle: 'Giai Đoạn 1: Nhập Môn',
    title: '🎬 MINI-PROJECT: "Trợ Lý Cửa Hàng Băng Đĩa"',
    subtitle: 'Vận dụng toàn bộ kiến thức Chặng 1 để giải cứu quản lý cửa hàng phim',
    category: 'Mini-Project Tổng Kết',
    timeEstimate: '20 phút',
    xpReward: 120,
    isCapstoneProject: true,
    concept: `
### 🎬 Bối cảnh Dự án
Chúc mừng! Nhờ kỹ năng SQL xuất sắc, bạn vừa được nhận làm Trợ lý Quản lý Cửa hàng Băng đĩa lớn nhất thành phố. Quản lý cửa hàng đang cần gấp một báo cáo để lên kế hoạch nhập hàng tuần tới.

### 📋 Nhiệm vụ từ Quản lý:
*"Cậu hãy tìm cho tôi danh sách **10 bộ phim Hành động (Action) phát hành sau năm 2010, có doanh thu cao nhất** nhé. Tôi chỉ cần cậu báo cáo tên phim (\`title\`) và doanh thu (\`revenue\`) thôi."*

### 💡 Hướng dẫn từng bước (Hints):
1. Chọn cột nào? (\`SELECT title, revenue\`)
2. Từ đâu? (\`FROM Movies\`)
3. Điều kiện lọc là gì? Chú ý có 2 điều kiện nhé (\`WHERE genre = 'Action' AND release_year > 2010\`)
4. Sắp xếp thế nào? Doanh thu cao nhất thì phải xếp giảm dần (\`ORDER BY revenue DESC\`)
5. Lấy bao nhiêu bộ phim? (\`LIMIT 10\`)
    `,
    syntaxExample: `-- Cú pháp tổng hợp hoàn chỉnh kết hợp cả 5 mệnh đề trong SQL:
SELECT customer_name, total_spent 
FROM customers 
WHERE country = 'Vietnam' AND total_spent > 1000 
ORDER BY total_spent DESC 
LIMIT 5;`,
    schemas: [
      {
        name: 'Movies',
        description: 'Bảng quản lý danh mục phim cửa hàng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã phim' },
          { name: 'title', type: 'TEXT', description: 'Tên phim' },
          { name: 'genre', type: 'TEXT', description: 'Thể loại' },
          { name: 'release_year', type: 'INTEGER', description: 'Năm phát hành' },
          { name: 'revenue', type: 'INTEGER', description: 'Doanh thu phòng vé ($)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Movies (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        genre TEXT NOT NULL,
        release_year INTEGER NOT NULL,
        revenue INTEGER NOT NULL
      );`,
      `INSERT INTO Movies VALUES
        (1, 'The Dark Knight', 'Action', 2008, 1006000000),
        (2, 'The Avengers', 'Action', 2012, 1518000000),
        (3, 'Inception', 'Action', 2010, 836800000),
        (4, 'Avengers: Endgame', 'Action', 2019, 2797000000),
        (5, 'Mad Max: Fury Road', 'Action', 2015, 380400000),
        (6, 'John Wick: Chapter 4', 'Action', 2023, 440100000),
        (7, 'Titanic', 'Romance', 1997, 2257000000),
        (8, 'Spider-Man: No Way Home', 'Action', 2021, 1921000000),
        (9, 'Interstellar', 'Sci-Fi', 2014, 701700000),
        (10, 'Top Gun: Maverick', 'Action', 2022, 1495000000),
        (11, 'Black Panther', 'Action', 2018, 1349000000),
        (12, 'Skyfall', 'Action', 2012, 1108000000),
        (13, 'Mission: Impossible - Fallout', 'Action', 2018, 791600000);`,
    ],
    exercise: {
      goal: 'Báo cáo Top 10 phim Hành động phát hành sau năm 2010 có doanh thu cao nhất',
      taskDescription:
        `🎬 **Bối cảnh:** Bạn vừa nhận chức Trợ lý Quản lý Cửa hàng Băng đĩa lớn nhất thành phố. Quản lý cần gấp một danh mục 10 bộ phim Hành động ăn khách nhất thời gian qua để lên đơn đặt hàng nhập khẩu.

🎯 **Yêu cầu cụ thể (Quy trình 5 bước chuẩn):**
1. **SELECT:** Chỉ lấy 2 cột: tên phim (\`title\`) và doanh thu phòng vé (\`revenue\`).
2. **FROM:** Truy vấn từ bảng phim **\`Movies\`**.
3. **WHERE:** Áp dụng đồng thời 2 điều kiện lọc (dùng \`AND\`):
   - Thể loại phim Hành động: \`genre = 'Action'\`.
   - Năm phát hành sau năm 2010: \`release_year > 2010\`.
4. **ORDER BY:** Doanh thu cao nhất thì phải xếp giảm dần: \`ORDER BY revenue DESC\`.
5. **LIMIT:** Chỉ lấy ra đúng Top 10 bộ phim đầu bảng: \`LIMIT 10\`.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT title, revenue FROM Movies WHERE genre = 'Action' AND release_year > 2010 ORDER BY revenue DESC LIMIT 10;`,
      hints: [
        'Lần lượt sắp xếp: SELECT title, revenue FROM Movies WHERE genre = \'Action\' AND release_year > 2010 ORDER BY ... LIMIT ...;',
        'Doanh thu cao nhất thì xếp giảm dần bằng DESC, giới hạn 10 phim bằng LIMIT 10.',
      ],
      explanation:
        'VINH DANH NGƯỜI GÁC CỔNG DỮ LIỆU! Bạn đã vượt qua toàn bộ thử thách của Giai đoạn 1 một cách ngoạn mục!',
    },
  },

  // =========================================================================
  // GIAI ĐOẠN 2: TRUNG CẤP (INTERMEDIATE) - PHÂN TÍCH VÀ KẾT NỐI DỮ LIỆU 🧠
  // =========================================================================
  {
    id: 'sql-201',
    order: 6,
    stage: 'intermediate',
    stageTitle: 'Giai Đoạn 2: Trung Cấp',
    title: 'BÀI 1: AGGREGATE FUNCTIONS - "Chiếc Máy Tính Bỏ Túi" Của SQL 🧮',
    subtitle: 'Nắm vững các hàm tổng hợp tính toán tức thì chỉ số doanh thu',
    category: 'Tổng Hợp Dữ Liệu',
    timeEstimate: '15 phút',
    xpReward: 80,
    concept: `
### 📖 Lý thuyết Cốt lõi
Nếu sếp hỏi bạn: *"Tháng này chúng ta bán được bao nhiêu tiền?"*, bạn không thể in ra hàng ngàn dòng hóa đơn rồi tự bấm máy tính được. SQL trang bị sẵn cho bạn các **Hàm tổng hợp (Aggregate Functions)** để làm việc đó trong chớp mắt:
- \`COUNT()\`: Đếm số lượng dòng.
- \`SUM()\`: Tính tổng.
- \`AVG()\`: Tính trung bình cộng (Average).
- \`MAX()\`: Tìm giá trị lớn nhất.
- \`MIN()\`: Tìm giá trị nhỏ nhất.
    `,
    syntaxExample: `-- 1. Tính mức lương trung bình và mức lương cao nhất của công ty
SELECT AVG(salary) AS avg_salary, MAX(salary) AS max_salary 
FROM employees;

-- 2. Đếm tổng số lượng nhân viên đang làm việc
SELECT COUNT(*) AS total_staff 
FROM employees;`,
    schemas: [
      {
        name: 'Orders',
        description: 'Bảng theo dõi đơn hàng bán lẻ',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã đơn' },
          { name: 'customer_id', type: 'INTEGER', description: 'Mã khách' },
          { name: 'amount', type: 'INTEGER', description: 'Giá trị đơn ($)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Orders (
        id INTEGER PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        amount INTEGER NOT NULL
      );`,
      `INSERT INTO Orders VALUES
        (1, 101, 150),
        (2, 102, 320),
        (3, 101, 450),
        (4, 103, 80),
        (5, 102, 600);`,
    ],
    exercise: {
      goal: 'Tính Tổng doanh thu (total_revenue) và Tổng số đơn hàng (total_orders) từ bảng Orders',
      taskDescription:
        `📊 **Bối cảnh:** Kế toán trưởng cần chốt số liệu tài chính tháng này để báo cáo trước Hội đồng Quản trị.

🎯 **Yêu cầu cụ thể:**
- Truy vấn từ bảng đơn hàng **\`Orders\`**.
- Tính tổng giá trị tất cả đơn hàng (\`amount\`), đặt tên cột là **\`total_revenue\`** (dùng \`SUM(amount) AS total_revenue\`).
- Đếm tổng số lượng đơn hàng đã bán ra, đặt tên cột là **\`total_orders\`** (dùng \`COUNT(*) AS total_orders\`).

💡 **Mẹo:** Dùng từ khóa \`AS\` để đặt bí danh cho cột tính toán, giúp kết quả hiển thị rõ ràng, chuyên nghiệp.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT SUM(amount) AS total_revenue, COUNT(*) AS total_orders FROM Orders;`,
      hints: [
        'Cấu trúc: SELECT SUM(cột) AS tên_mới_1, COUNT(*) AS tên_mới_2 FROM tên_bảng;',
        'Cột cần tính tổng là amount, đặt bí danh là total_revenue.',
      ],
      explanation:
        'Bạn vừa làm công việc của kế toán trong vòng 2 giây! ✅ Pass xuất sắc!',
    },
    quizzes: [
      {
        question: 'Hàm nào trong SQL dùng để đếm số lượng dòng dữ liệu?',
        options: ['COUNT()', 'SUM()', 'NUMBER()', 'TOTAL()'],
        answerIndex: 0,
        explanation: 'Hàm COUNT(*) dùng để đếm tổng số lượng bản ghi trả về.',
      },
    ],
  },

  {
    id: 'sql-202',
    order: 7,
    stage: 'intermediate',
    stageTitle: 'Giai Đoạn 2: Trung Cấp',
    title: 'BÀI 2: GROUP BY & HAVING - Nghệ Thuật Chia Để Trị 📦',
    subtitle: 'Gom nhóm theo từng thực thể và lọc kết quả sau khi đã tổng hợp',
    category: 'Tổng Hợp Dữ Liệu',
    timeEstimate: '18 phút',
    xpReward: 90,
    concept: `
### 📖 Lý thuyết Cốt lõi
Dùng hàm tổng hợp ở Bài 1 sẽ gom *toàn bộ* dữ liệu thành 1 dòng duy nhất. Nhưng nếu sếp muốn biết *"Doanh thu **của từng** phòng ban là bao nhiêu?"* thì sao?
- **\`GROUP BY\`**: Giúp bạn gom nhóm dữ liệu theo một tiêu chí nào đó (Ví dụ: Gom nhóm theo phòng ban).
- **\`HAVING\`**: Nếu \`WHERE\` dùng để lọc từng *dòng*, thì \`HAVING\` dùng để lọc các *nhóm* SAU KHI đã dùng \`GROUP BY\`.
    `,
    syntaxExample: `-- 1. Đếm số lượng sản phẩm của từng ngành hàng
SELECT category, COUNT(*) AS total_products 
FROM products 
GROUP BY category;

-- 2. Lọc ra các ngành hàng có số lượng trên 10 sản phẩm
SELECT category, COUNT(*) AS total_products 
FROM products 
GROUP BY category 
HAVING COUNT(*) > 10;`,
    schemas: [
      {
        name: 'Orders',
        description: 'Bảng đơn hàng bán buôn',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã đơn' },
          { name: 'customer_id', type: 'INTEGER', description: 'Mã khách' },
          { name: 'amount', type: 'INTEGER', description: 'Số tiền' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Orders (
        id INTEGER PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        amount INTEGER NOT NULL
      );`,
      `INSERT INTO Orders VALUES
        (1, 101, 100), (2, 101, 150), (3, 101, 200), (4, 101, 250), (5, 101, 300), (6, 101, 350),
        (7, 102, 500), (8, 102, 600), (9, 103, 50);`,
    ],
    exercise: {
      goal: 'Tìm các mã khách hàng có tổng số đơn hàng đã mua lớn hơn 5',
      taskDescription:
        `🎁 **Bối cảnh:** Đội ngũ Chăm sóc khách hàng chuẩn bị tặng quà tri ân cho các khách hàng trung thành nhất (những người mua sắm thường xuyên).

🎯 **Yêu cầu cụ thể:**
- Truy vấn từ bảng đơn hàng **\`Orders\`**.
- Gom nhóm dữ liệu theo từng khách hàng bằng **\`GROUP BY customer_id\`**.
- Lấy ra 2 cột: mã khách hàng (\`customer_id\`) và tổng số đơn (\`COUNT(*) AS total_orders\`).
- Dùng **\`HAVING COUNT(*) > 5\`** để chỉ giữ lại những khách hàng có hơn 5 đơn hàng.

💡 **Lưu ý:** \`WHERE\` dùng để lọc dòng trước khi gom nhóm, còn \`HAVING\` dùng để lọc nhóm sau khi \`GROUP BY\`.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT customer_id, COUNT(*) AS total_orders FROM Orders GROUP BY customer_id HAVING COUNT(*) > 5;`,
      hints: [
        'Gom nhóm theo mã khách hàng: GROUP BY customer_id',
        'Lọc nhóm sau khi đếm: HAVING COUNT(*) > 5',
      ],
      explanation:
        'Tuyệt vời! Bạn đã lọc ra chính xác khách hàng 101 với 6 đơn hàng thỏa mãn điều kiện HAVING.',
    },
    quizzes: [
      {
        question: 'Điểm khác biệt chính giữa WHERE và HAVING là gì?',
        options: [
          'WHERE lọc dòng trước khi gom nhóm, HAVING lọc nhóm sau khi GROUP BY',
          'WHERE chỉ dùng cho số, HAVING chỉ dùng cho chữ',
          'HAVING chạy nhanh hơn WHERE',
          'Không có điểm khác nhau nào',
        ],
        answerIndex: 0,
        explanation: 'WHERE lọc các bản ghi độc lập trước khi thực hiện gom nhóm; HAVING lọc các nhóm dữ liệu sau khi hàm tổng hợp đã được tính.',
      },
    ],
  },

  {
    id: 'sql-203',
    order: 8,
    stage: 'intermediate',
    stageTitle: 'Giai Đoạn 2: Trung Cấp',
    title: 'BÀI 3: INNER & LEFT JOIN - Tuyệt Chiêu Ghép "Lego" 🧩',
    subtitle: 'Nối các mảnh ghép dữ liệu từ nhiều bảng thành bức tranh hoàn chỉnh',
    category: 'Ghép Bảng (JOINs)',
    timeEstimate: '20 phút',
    xpReward: 90,
    concept: `
### 📖 Lý thuyết Cốt lõi
Trong thực tế, dữ liệu không bao giờ nằm chung ở một bảng. Tên khách hàng nằm ở bảng \`Customers\`, nhưng tiền mua hàng lại nằm ở bảng \`Orders\`. Để phân tích, ta phải "nối" (JOIN) chúng lại với nhau thông qua một cột chung (thường là \`ID\`).
- **\`INNER JOIN\`**: Chỉ lấy những dữ liệu **có sự khớp nhau** ở cả 2 bảng (Phần giao nhau).
- **\`LEFT JOIN\`**: Lấy **tất cả** dữ liệu ở bảng bên trái, và những dữ liệu khớp ở bảng bên phải (Nếu không khớp, dữ liệu bên phải sẽ trả về rỗng - NULL).
    `,
    syntaxExample: `-- Ghép bảng khách hàng (customers) với bảng hóa đơn (orders) qua cột customer_id
SELECT c.customer_name, o.order_date, o.total_amount 
FROM customers c 
INNER JOIN orders o ON c.id = o.customer_id;`,
    schemas: [
      {
        name: 'Students',
        description: 'Bảng học sinh',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã học sinh' },
          { name: 'student_name', type: 'TEXT', description: 'Tên học sinh' },
        ],
      },
      {
        name: 'Scores',
        description: 'Bảng điểm thi',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã kết quả' },
          { name: 'student_id', type: 'INTEGER', description: 'Mã học sinh (FK)' },
          { name: 'score', type: 'INTEGER', description: 'Điểm số' },
        ],
        foreignKeys: [
          { fromColumn: 'student_id', toTable: 'Students', toColumn: 'id' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Students (
        id INTEGER PRIMARY KEY,
        student_name TEXT NOT NULL
      );`,
      `CREATE TABLE Scores (
        id INTEGER PRIMARY KEY,
        student_id INTEGER NOT NULL,
        score INTEGER NOT NULL
      );`,
      `INSERT INTO Students VALUES
        (1, 'Nguyen Van An'),
        (2, 'Tran Thi Binh'),
        (3, 'Le Van Cuong');`,
      `INSERT INTO Scores VALUES
        (101, 1, 95),
        (102, 2, 88);`,
    ],
    exercise: {
      goal: 'Ghép tên sinh viên (student_name) với điểm số (score) bằng INNER JOIN',
      taskDescription:
        `🎓 **Bối cảnh:** Trường đại học lưu hồ sơ sinh viên ở bảng \`Students\` và bảng điểm ở bảng \`Scores\`. Phòng Đào tạo cần ghép 2 bảng này để in phiếu điểm chính thức.

🎯 **Yêu cầu cụ thể:**
- Đặt bí danh cho 2 bảng: \`Students A\` và \`Scores B\` (dùng \`FROM Students A INNER JOIN Scores B\`).
- Xác định điều kiện liên kết khóa ngoại: **\`ON A.id = B.student_id\`**.
- Chỉ chọn ra đúng 2 cột hiển thị: tên sinh viên (**\`A.student_name\`**) và điểm số (**\`B.score\`**).

💡 **Mẹo:** \`INNER JOIN\` chỉ giữ lại các dòng mà khóa chung xuất hiện đầy đủ ở cả hai bảng.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT A.student_name, B.score FROM Students A INNER JOIN Scores B ON A.id = B.student_id;`,
      hints: [
        'Cấu trúc: SELECT A.student_name, B.score FROM Students A INNER JOIN Scores B ON A.id = B.student_id;',
        'Hãy chú ý chỉ định rõ tên bảng hoặc bí danh trước tên cột để tránh trùng lặp.',
      ],
      explanation:
        'Chính xác! Học sinh Le Van Cuong (id=3) chưa có điểm nên không xuất hiện trong kết quả của INNER JOIN.',
    },
    quizzes: [
      {
        question: 'Khi dùng LEFT JOIN, nếu một dòng ở bảng bên trái không có dòng tương ứng ở bảng bên phải, các cột bên phải sẽ có giá trị gì?',
        options: ['NULL', '0', 'Báo lỗi', 'Bị xóa bỏ'],
        answerIndex: 0,
        explanation: 'LEFT JOIN luôn giữ toàn bộ bảng trái; các cột bên phải nếu không khớp sẽ tự động điền NULL.',
      },
    ],
  },

  {
    id: 'sql-204',
    order: 9,
    stage: 'intermediate',
    stageTitle: 'Giai Đoạn 2: Trung Cấp',
    title: 'BÀI 4: CASE WHEN - Tạo Quy Luật Của Riêng Bạn 🏷️',
    subtitle: 'Mệnh đề IF-THEN-ELSE để phân loại dữ liệu theo ý muốn',
    category: 'Biến Đổi Dữ Liệu',
    timeEstimate: '18 phút',
    xpReward: 90,
    concept: `
### 📖 Lý thuyết Cốt lõi
Nếu bạn đã từng dùng hàm \`IF\` trong Excel hoặc lập trình, thì **\`CASE WHEN\`** chính là phiên bản SQL của nó. Nó cho phép bạn đánh giá các điều kiện (IF-THEN-ELSE) để tạo ra một cột dữ liệu hoàn toàn mới dựa trên các quy luật do bạn tự định nghĩa.
    `,
    syntaxExample: `-- Phân loại mức thu nhập nhân viên theo mức lương
SELECT name, salary, 
  CASE 
    WHEN salary >= 3000 THEN 'Thu Nhập Cao' 
    WHEN salary >= 1500 THEN 'Thu Nhập Trung Bình' 
    ELSE 'Thu Nhập Khởi Điểm' 
  END AS income_level 
FROM employees;`,
    schemas: [
      {
        name: 'Customers',
        description: 'Bảng khách hàng thành viên',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã khách' },
          { name: 'customer_name', type: 'TEXT', description: 'Tên khách hàng' },
          { name: 'points', type: 'INTEGER', description: 'Điểm tích lũy' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Customers (
        id INTEGER PRIMARY KEY,
        customer_name TEXT NOT NULL,
        points INTEGER NOT NULL
      );`,
      `INSERT INTO Customers VALUES
        (1, 'Pham Nhat Vuong', 1500),
        (2, 'Nguyen Thi Thao', 450),
        (3, 'Tran Dinh Long', -10),
        (4, 'Do Anh Dung', 2000);`,
    ],
    exercise: {
      goal: 'Phân loại khách hàng vào cột Segment: > 1000 là \'VIP\', >= 0 là \'Normal\', còn lại là \'Spam\'',
      taskDescription:
        `🏷️ **Bối cảnh:** Team Marketing muốn gửi email ưu đãi theo phân khúc khách hàng dựa trên điểm tích lũy (\`points\`).

🎯 **Yêu cầu cụ thể:**
- Truy vấn từ bảng khách hàng **\`Customers\`**.
- Lấy 3 cột: **\`customer_name\`**, **\`points\`**, và cột phân loại mới đặt tên là **\`Segment\`**.
- Cột \`Segment\` dùng \`CASE WHEN\` với quy tắc:
  - \`WHEN points > 1000 THEN 'VIP'\`
  - \`WHEN points >= 0 THEN 'Normal'\`
  - \`ELSE 'Spam'\`
  - Kết thúc bằng \`END AS Segment\`.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT customer_name, points, CASE WHEN points > 1000 THEN 'VIP' WHEN points >= 0 THEN 'Normal' ELSE 'Spam' END AS Segment FROM Customers;`,
      hints: [
        'Cấu trúc: CASE WHEN điều_kiện_1 THEN \'kết_quả_1\' WHEN ... ELSE \'kết_quả_cuối\' END AS Segment',
        'Thứ tự xét điều kiện: points > 1000 trước, sau đó points >= 0, cuối cùng là ELSE \'Spam\'.',
      ],
      explanation:
        'Xuất sắc! Bạn đã làm chủ cấu trúc CASE WHEN để phân loại khách hàng một cách thông minh.',
    },
    quizzes: [
      {
        question: 'Từ khóa nào dùng để kết thúc một khối CASE WHEN trong SQL?',
        options: ['END', 'FINISH', 'STOP', 'DONE'],
        answerIndex: 0,
        explanation: 'Mọi biểu thức CASE WHEN bắt buộc phải được đóng bằng từ khóa END.',
      },
    ],
  },

  {
    id: 'sql-205',
    order: 10,
    stage: 'intermediate',
    stageTitle: 'Giai Đoạn 2: Trung Cấp',
    title: '🎬 MINI-PROJECT: "Báo Cáo Thương Mại Điện Tử (E-Commerce)"',
    subtitle: 'Thử thách kết hợp TẤT CẢ kỹ năng JOIN, GROUP BY và CASE WHEN',
    category: 'Mini-Project Tổng Kết',
    timeEstimate: '25 phút',
    xpReward: 150,
    isCapstoneProject: true,
    concept: `
### 🎬 Bối cảnh Dự án
Sếp lớn vừa giao cho bạn một bài toán kinh điển của dân phân tích dữ liệu: *"Hãy tìm ra cho tôi 5 khách hàng VIP nhất tháng này để gửi quà tri ân!"*

### 📋 Cơ sở dữ liệu: Bạn có 3 bảng:
1. \`Users\` (\`id\`, \`name\`)
2. \`Orders\` (\`id\`, \`user_id\`, \`product_id\`)
3. \`Products\` (\`id\`, \`price\`)

### 🎯 Nhiệm vụ:
Tính tổng số tiền mà **mỗi người dùng** đã chi tiêu. Sau đó, phân loại họ thành:
- Chi tiêu > 500$: 'Thành viên Vàng'
- Chi tiêu > 200$: 'Thành viên Bạc'
- Còn lại: 'Thành viên Đồng'
Chỉ xuất ra danh sách **Top 5 người dùng chi tiêu nhiều nhất**.
    `,
    syntaxExample: `-- Mẫu kết hợp JOIN 3 bảng + GROUP BY + CASE WHEN + ORDER BY + LIMIT:
SELECT d.driver_name, 
  SUM(p.amount) AS total_earned,
  CASE 
    WHEN SUM(p.amount) > 10000 THEN 'Hạng Kim Cương'
    WHEN SUM(p.amount) > 5000 THEN 'Hạng Vàng'
    ELSE 'Hạng Tiêu Chuẩn'
  END AS driver_tier
FROM drivers d
JOIN trips t ON d.id = t.driver_id
JOIN payments p ON t.id = p.trip_id
GROUP BY d.driver_name
ORDER BY total_earned DESC
LIMIT 10;`,
    schemas: [
      {
        name: 'Users',
        description: 'Bảng người dùng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã người dùng' },
          { name: 'name', type: 'TEXT', description: 'Họ tên' },
        ],
      },
      {
        name: 'Orders',
        description: 'Bảng đơn hàng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã đơn' },
          { name: 'user_id', type: 'INTEGER', description: 'Mã người dùng' },
          { name: 'product_id', type: 'INTEGER', description: 'Mã sản phẩm' },
        ],
        foreignKeys: [
          { fromColumn: 'user_id', toTable: 'Users', toColumn: 'id' },
          { fromColumn: 'product_id', toTable: 'Products', toColumn: 'id' },
        ],
      },
      {
        name: 'Products',
        description: 'Bảng sản phẩm',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã sản phẩm' },
          { name: 'price', type: 'INTEGER', description: 'Giá tiền ($)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);`,
      `CREATE TABLE Products (id INTEGER PRIMARY KEY, price INTEGER NOT NULL);`,
      `CREATE TABLE Orders (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, product_id INTEGER NOT NULL);`,
      `INSERT INTO Users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'David'), (5, 'Emma'), (6, 'Frank');`,
      `INSERT INTO Products VALUES (101, 300), (102, 250), (103, 80), (104, 50);`,
      `INSERT INTO Orders VALUES
        (1, 1, 101), (2, 1, 102), (3, 1, 103),
        (4, 2, 101), (5, 2, 103),
        (6, 3, 101),
        (7, 4, 104),
        (8, 5, 102), (9, 5, 101);`,
    ],
    exercise: {
      goal: 'Báo cáo Top 5 khách hàng chi tiêu nhiều nhất kèm phân hạng thành viên',
      taskDescription:
        `🛒 **Bối cảnh:** Sàn thương mại điện tử cần bảng vinh danh Top 5 khách hàng chi tiêu khủng nhất mùa sale, đồng thời tự động trao danh hiệu thành viên tương ứng.

🎯 **Yêu cầu cụ thể:**
1. **JOIN 3 bảng:** Nối bảng \`Users U\` với \`Orders O\` qua \`U.id = O.user_id\`, sau đó nối tiếp với \`Products P\` qua \`O.product_id = P.id\`.
2. **Gom nhóm:** Dùng \`GROUP BY U.name\` theo từng khách hàng.
3. **Cột hiển thị:**
   - \`U.name\` (Tên khách hàng).
   - \`SUM(P.price) AS total_spent\` (Tổng tiền chi mua hàng).
   - Cột phân hạng \`membership_tier\` bằng \`CASE WHEN\`:
     - \`SUM(P.price) > 500\` -> \`'Thành viên Vàng'\`
     - \`SUM(P.price) > 200\` -> \`'Thành viên Bạc'\`
     - Còn lại -> \`'Thành viên Đồng'\`
4. **Sắp xếp & Giới hạn:** \`ORDER BY total_spent DESC LIMIT 5\`.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT U.name, SUM(P.price) AS total_spent, CASE WHEN SUM(P.price) > 500 THEN 'Thành viên Vàng' WHEN SUM(P.price) > 200 THEN 'Thành viên Bạc' ELSE 'Thành viên Đồng' END AS membership_tier FROM Users U JOIN Orders O ON U.id = O.user_id JOIN Products P ON O.product_id = P.id GROUP BY U.name ORDER BY total_spent DESC LIMIT 5;`,
      hints: [
        'Nối 3 bảng: FROM Users U JOIN Orders O ON U.id = O.user_id JOIN Products P ON O.product_id = P.id',
        'Nhớ tính SUM(P.price) AS total_spent và gom nhóm GROUP BY U.name trước khi ORDER BY và LIMIT.',
      ],
      explanation:
        'VINH DANH BẬC THẦY KẾT NỐI! Bạn đã hoàn thành xuất sắc Mini-Project Giai đoạn 2 và sẵn sàng tiến vào Giai đoạn Nâng cao!',
    },
  },

  // =========================================================================
  // GIAI ĐOẠN 3: NÂNG CAO (ADVANCED) - MỞ KHÓA "SIÊU NĂNG LỰC" SQL 🦸‍♂️
  // =========================================================================
  {
    id: 'sql-301',
    order: 11,
    stage: 'advanced',
    stageTitle: 'Giai Đoạn 3: Nâng Cao',
    title: 'BÀI 1: SUBQUERIES & CTES - Nghệ Thuật Viết Code "Sạch" 🧹',
    subtitle: 'Tạm biệt Spaghetti Code với Common Table Expressions (WITH)',
    category: 'Biến Đổi Nâng Cao',
    timeEstimate: '20 phút',
    xpReward: 110,
    concept: `
### 📖 Lý thuyết Cốt lõi
Thỉnh thoảng, bạn cần lấy kết quả của một câu truy vấn này làm đầu vào cho một câu truy vấn khác:
- **Subquery (Truy vấn lồng):** Là việc nhét một câu \`SELECT\` vào bên trong mệnh đề \`WHERE\` hoặc \`FROM\`. Nếu lồng 3-4 lớp, code sẽ như một mớ bòng bong (Spaghetti code).
- **CTE (Common Table Expression - \`WITH\`):** Là "vị cứu tinh". Nó giúp bạn định nghĩa một (hoặc nhiều) "bảng tạm thời" ở ngay đầu file. Code sẽ đọc từ trên xuống dưới, cực kỳ rõ ràng, logic và dễ gỡ lỗi (debug).
    `,
    syntaxExample: `-- Định nghĩa CTE bảng tạm chứa các phòng ban công nghệ, sau đó lọc nhân viên
WITH TechDepartments AS (
  SELECT dept_id 
  FROM departments 
  WHERE field = 'Technology'
)
SELECT employee_name, salary 
FROM employees 
WHERE dept_id IN (SELECT dept_id FROM TechDepartments);`,
    schemas: [
      {
        name: 'Customers',
        description: 'Bảng khách hàng',
        columns: [
          { name: 'customer_id', type: 'INTEGER PRIMARY KEY', description: 'Mã khách' },
          { name: 'name', type: 'TEXT', description: 'Tên' },
          { name: 'city', type: 'TEXT', description: 'Thành phố' },
        ],
      },
      {
        name: 'Orders',
        description: 'Bảng đơn hàng',
        columns: [
          { name: 'order_id', type: 'INTEGER PRIMARY KEY', description: 'Mã đơn' },
          { name: 'customer_id', type: 'INTEGER', description: 'Mã khách' },
          { name: 'amount', type: 'INTEGER', description: 'Số tiền' },
        ],
        foreignKeys: [
          { fromColumn: 'customer_id', toTable: 'Customers', toColumn: 'customer_id' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Customers (customer_id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL);`,
      `CREATE TABLE Orders (order_id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, amount INTEGER NOT NULL);`,
      `INSERT INTO Customers VALUES (1, 'Nam', 'Hanoi'), (2, 'Hoa', 'Saigon'), (3, 'Tuan', 'Hanoi'), (4, 'Linh', 'Danang');`,
      `INSERT INTO Orders VALUES (101, 1, 1200), (102, 2, 800), (103, 3, 1500), (104, 4, 300);`,
    ],
    exercise: {
      goal: 'Dùng CTE Hanoi_Customers để tìm các đơn hàng của khách hàng ở Hà Nội',
      taskDescription:
        `🧹 **Bối cảnh:** Chi nhánh giao vận Hà Nội cần trích xuất toàn bộ đơn hàng của khách hàng cư trú tại Hà Nội để điều phối nhân viên bưu điện phát bưu phẩm.

🎯 **Yêu cầu cụ thể:**
1. Tạo bảng tạm (CTE) tên là **\`Hanoi_Customers\`**:
   \`WITH Hanoi_Customers AS (SELECT customer_id FROM Customers WHERE city = 'Hanoi')\`
2. Truy vấn toàn bộ cột (\`*\`) từ bảng **\`Orders\`**.
3. Điều kiện lọc: Mã khách hàng phải nằm trong bảng tạm vừa tạo:
   \`WHERE customer_id IN (SELECT customer_id FROM Hanoi_Customers)\`.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `WITH Hanoi_Customers AS (SELECT customer_id FROM Customers WHERE city = 'Hanoi') SELECT * FROM Orders WHERE customer_id IN (SELECT customer_id FROM Hanoi_Customers);`,
      hints: [
        'Cú pháp CTE: WITH Tên_Bảng_Tạm AS (truy vấn con) SELECT * FROM bảng_chính WHERE ...;',
        'Trong bài này: WITH Hanoi_Customers AS (SELECT customer_id FROM Customers WHERE city = \'Hanoi\') ...',
      ],
      explanation:
        'Tuyệt vời! CTE giúp code của bạn có cấu trúc module hóa, rõ ràng và dễ bảo trì.',
    },
    quizzes: [
      {
        question: 'Từ khóa nào dùng để bắt đầu định nghĩa một CTE trong SQL?',
        options: ['WITH', 'LET', 'DEFINE', 'TABLE'],
        answerIndex: 0,
        explanation: 'Từ khóa WITH được chuẩn SQL dùng để khởi tạo một hoặc nhiều Common Table Expression.',
      },
    ],
  },

  {
    id: 'sql-302',
    order: 12,
    stage: 'advanced',
    stageTitle: 'Giai Đoạn 3: Nâng Cao',
    title: 'BÀI 2: WINDOW FUNCTIONS 1 - Bảng Xếp Hạng Thông Minh 🏅',
    subtitle: 'Thực hiện phép tính xếp hạng trên nhóm dữ liệu mà VẪN GIỮ NGUYÊN từng dòng',
    category: 'Window Functions',
    timeEstimate: '20 phút',
    xpReward: 120,
    concept: `
### 📖 Lý thuyết Cốt lõi
\`GROUP BY\` rất tốt, nhưng nó có một nhược điểm chí mạng: Nó "nuốt chửng" các dòng chi tiết và gộp chúng lại thành 1 dòng.
**Window Functions (Hàm Cửa sổ)** cho phép bạn thực hiện các phép tính tổng hợp (như xếp hạng, tính tổng) trên một nhóm dữ liệu, nhưng **VẪN GIỮ NGUYÊN** số lượng dòng ban đầu.

Các hàm xếp hạng phổ biến:
- \`ROW_NUMBER()\`: Đánh số thứ tự 1, 2, 3... (Không bao giờ trùng lặp).
- \`RANK()\`: Xếp hạng, nếu 2 người bằng điểm nhau cùng hạng 1, người tiếp theo sẽ là hạng 3 (nhảy cóc).
- \`DENSE_RANK()\`: Giống \`RANK\`, nhưng người tiếp theo sẽ là hạng 2 (không nhảy cóc).
    `,
    syntaxExample: `-- Xếp hạng điểm số học sinh theo từng khối lớp bằng RANK() OVER(PARTITION BY...)
SELECT student_name, grade_level, score,
  RANK() OVER(
    PARTITION BY grade_level 
    ORDER BY score DESC
  ) AS class_rank 
FROM student_scores;`,
    schemas: [
      {
        name: 'Sales',
        description: 'Doanh số nhân viên phòng kinh doanh',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'ID' },
          { name: 'employee_name', type: 'TEXT', description: 'Tên nhân viên' },
          { name: 'department', type: 'TEXT', description: 'Phòng ban' },
          { name: 'revenue', type: 'INTEGER', description: 'Doanh thu đạt được' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Sales (
        id INTEGER PRIMARY KEY,
        employee_name TEXT NOT NULL,
        department TEXT NOT NULL,
        revenue INTEGER NOT NULL
      );`,
      `INSERT INTO Sales VALUES
        (1, 'Alice', 'B2B', 80000),
        (2, 'Bob', 'B2B', 95000),
        (3, 'Charlie', 'B2C', 60000),
        (4, 'David', 'B2C', 75000),
        (5, 'Emma', 'B2B', 95000);`,
    ],
    exercise: {
      goal: 'Xếp hạng doanh thu nhân viên trong nội bộ từng phòng ban bằng RANK() OVER(...)',
      taskDescription:
        `🏅 **Bối cảnh:** Công ty muốn trao giải thưởng "Nhân viên xuất sắc nhất tháng" cho từng phòng ban độc lập. Bạn cần tính thứ hạng doanh thu trong nội bộ mỗi phòng ban mà không làm mất đi thông tin từng nhân viên.

🎯 **Yêu cầu cụ thể:**
- Truy vấn từ bảng bán hàng **\`Sales\`**.
- Chọn các cột: \`employee_name\`, \`department\`, \`revenue\`.
- Tạo cột thứ hạng đặt tên là **\`dept_rank\`** bằng hàm cửa sổ:
  \`RANK() OVER(PARTITION BY department ORDER BY revenue DESC) AS dept_rank\`.

💡 **Mẹo:** \`PARTITION BY department\` giúp chia nhỏ dữ liệu theo từng phòng ban, sau đó \`ORDER BY revenue DESC\` sẽ xếp hạng từ 1, 2, 3... riêng biệt cho mỗi phòng ban đó.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT employee_name, department, revenue, RANK() OVER(PARTITION BY department ORDER BY revenue DESC) as dept_rank FROM Sales;`,
      hints: [
        'Cấu trúc: RANK() OVER(PARTITION BY cột_nhóm ORDER BY cột_xếp_hạng DESC) AS tên_cột',
        'Ở bài này, ta phân chia theo department và sắp xếp giảm dần theo revenue.',
      ],
      explanation:
        'Chính xác! Cửa sổ phân vùng (PARTITION BY) giúp bạn tính toán độc lập cho từng phòng ban mà không làm gộp dữ liệu.',
    },
    quizzes: [
      {
        question: 'Nếu 2 người đồng hạng 1, hàm RANK() sẽ xếp người tiếp theo là hạng mấy?',
        options: ['Hạng 3', 'Hạng 2', 'Hạng 1', 'Báo lỗi'],
        answerIndex: 0,
        explanation: 'Hàm RANK() có cơ chế nhảy cóc thứ hạng khi có giá trị trùng lặp, nên người tiếp theo sẽ là hạng 3.',
      },
    ],
  },

  {
    id: 'sql-303',
    order: 13,
    stage: 'advanced',
    stageTitle: 'Giai Đoạn 3: Nâng Cao',
    title: 'BÀI 3: WINDOW FUNCTIONS 2 - Du Hành Thời Gian ⏳',
    subtitle: 'So sánh dữ liệu dòng hiện tại với dòng quá khứ/tương lai cùng LAG và LEAD',
    category: 'Window Functions',
    timeEstimate: '20 phút',
    xpReward: 120,
    concept: `
### 📖 Lý thuyết Cốt lõi
Làm sao để so sánh doanh thu tháng này với tháng trước mà không cần phải nhân bản bảng và JOIN phức tạp? Window Functions mang đến cho bạn cỗ máy thời gian:
- **\`LAG(cột, n)\`**: Lấy giá trị của dòng **trước** đó \`n\` bước (Nhìn về quá khứ).
- **\`LEAD(cột, n)\`**: Lấy giá trị của dòng **sau** đó \`n\` bước (Nhìn tới tương lai).
    `,
    syntaxExample: `-- So sánh số bước chân hôm nay với hôm qua bằng hàm LAG()
SELECT log_date, steps_count,
  LAG(steps_count, 1) OVER(ORDER BY log_date) AS yesterday_steps,
  steps_count - LAG(steps_count, 1) OVER(ORDER BY log_date) AS step_difference
FROM fitness_tracker;`,
    schemas: [
      {
        name: 'Revenue_Data',
        description: 'Báo cáo doanh thu hàng tháng',
        columns: [
          { name: 'month', type: 'TEXT PRIMARY KEY', description: 'Tháng tài chính' },
          { name: 'revenue', type: 'INTEGER', description: 'Doanh thu ($)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Revenue_Data (
        month TEXT PRIMARY KEY,
        revenue INTEGER NOT NULL
      );`,
      `INSERT INTO Revenue_Data VALUES
        ('2026-01', 50000),
        ('2026-02', 62000),
        ('2026-03', 58000),
        ('2026-04', 75000),
        ('2026-05', 90000);`,
    ],
    exercise: {
      goal: 'Tính doanh thu tháng trước (prev_revenue) và mức chênh lệch tăng trưởng (growth_amount)',
      taskDescription:
        `⏳ **Bối cảnh:** Giám đốc tài chính (CFO) yêu cầu phân tích mức tăng trưởng doanh thu theo tháng (Month-over-Month Growth) để đánh giá tốc độ mở rộng kinh doanh.

🎯 **Yêu cầu cụ thể:**
- Truy vấn từ bảng **\`Revenue_Data\`**.
- Lấy 2 cột gốc: **\`month\`** và **\`revenue\`**.
- Tạo cột **\`prev_revenue\`** (doanh thu tháng liền kề trước đó):
  \`LAG(revenue, 1) OVER(ORDER BY month) AS prev_revenue\`.
- Tạo cột **\`growth_amount\`** (mức chênh lệch so với tháng trước):
  \`revenue - LAG(revenue, 1) OVER(ORDER BY month) AS growth_amount\`.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT month, revenue, LAG(revenue, 1) OVER(ORDER BY month) AS prev_revenue, revenue - LAG(revenue, 1) OVER(ORDER BY month) AS growth_amount FROM Revenue_Data;`,
      hints: [
        'Dùng hàm LAG(revenue, 1) OVER(ORDER BY month) để lấy giá trị dòng trước đó.',
        'Để tính growth_amount, lấy revenue trừ đi chính biểu thức LAG() đó.',
      ],
      explanation:
        'Rất xuất sắc! Bạn vừa tính toán chỉ số MoM Growth cốt lõi của mọi công ty công nghệ.',
    },
    quizzes: [
      {
        question: 'Hàm nào dùng để nhìn về tương lai (lấy giá trị của dòng kế tiếp)?',
        options: ['LEAD()', 'LAG()', 'NEXT()', 'FUTURE()'],
        answerIndex: 0,
        explanation: 'Hàm LEAD(cột, n) lấy giá trị của dòng phía sau (kế tiếp) trong phân vùng cửa sổ.',
      },
    ],
  },

  {
    id: 'sql-304',
    order: 14,
    stage: 'advanced',
    stageTitle: 'Giai Đoạn 3: Nâng Cao',
    title: 'BÀI 4: XỬ LÝ CHUỖI & THỜI GIAN - "Gọt Dũa" Dữ Liệu Thô 🛠️',
    subtitle: 'Sử dụng các dao mổ chuỗi để trích xuất thông tin sạch từ dữ liệu lộn xộn',
    category: 'Xử Lý Dữ Liệu',
    timeEstimate: '18 phút',
    xpReward: 110,
    concept: `
### 📖 Lý thuyết Cốt lõi
Dữ liệu thực tế thường rất lộn xộn. Bạn cần các "dao mổ" sắc bén để trích xuất thông tin:
- \`SUBSTR(cột, vị_trí_bắt_đầu, độ_dài)\`: Cắt một đoạn chuỗi.
- \`INSTR(cột, 'ký_tự')\`: Tìm vị trí đầu tiên của một ký tự trong chuỗi (Ví dụ: vị trí dấu \`@\` trong email).
- Kết hợp \`SUBSTR(email, INSTR(email, '@') + 1)\` để lấy toàn bộ tên miền sau dấu \`@\`.
    `,
    syntaxExample: `-- Trích xuất tên đăng nhập (phần đứng TRƯỚC dấu @) từ cột email
SELECT email, 
  SUBSTR(email, 1, INSTR(email, '@') - 1) AS username 
FROM accounts;`,
    schemas: [
      {
        name: 'Users',
        description: 'Danh sách tài khoản người dùng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã người dùng' },
          { name: 'name', type: 'TEXT', description: 'Tên người dùng' },
          { name: 'email', type: 'TEXT', description: 'Địa chỉ email' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );`,
      `INSERT INTO Users VALUES
        (1, 'Nguyen Van A', 'nguyenvana@gmail.com'),
        (2, 'Tran Thi B', 'tranthib@yahoo.com'),
        (3, 'Le Van C', 'levanc@outlook.com'),
        (4, 'Pham Thi D', 'phanthid@gmail.com');`,
    ],
    exercise: {
      goal: 'Trích xuất tên miền (email_domain) đứng ngay sau ký tự @ từ cột email',
      taskDescription:
        `🛠️ **Bối cảnh:** Bộ phận Kỹ thuật và Marketing cần thống kê tỷ lệ người dùng sử dụng các nhà cung cấp email (như gmail.com, outlook.com, icloud.com...) để tối ưu hóa tỷ lệ gửi thư thành công.

🎯 **Yêu cầu cụ thể:**
- Truy vấn từ bảng người dùng **\`Users\`**.
- Chọn cột **\`email\`**.
- Tạo cột thứ hai đặt tên là **\`email_domain\`** bằng cách phối hợp 2 hàm chuỗi trong SQLite:
  1. \`INSTR(email, '@')\`: Tìm vị trí xuất hiện của dấu \`@\`.
  2. \`SUBSTR(email, INSTR(email, '@') + 1)\`: Cắt chuỗi bắt đầu từ ký tự ngay sau dấu \`@\` cho đến hết.
  3. Đặt bí danh: \`AS email_domain\`.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT email, SUBSTR(email, INSTR(email, '@') + 1) AS email_domain FROM Users;`,
      hints: [
        'Cấu trúc: SUBSTR(chuỗi, vị_trí_bắt_đầu)',
        'Vị trí bắt đầu sau ký tự @ là: INSTR(email, \'@\') + 1',
      ],
      explanation:
        'Tuyệt vời! Bạn đã gọt giũa dữ liệu chuỗi thô thành các domain sạch sẽ cho đội Marketing.',
    },
    quizzes: [
      {
        question: 'Đoạn code sau trả về cái gì:\nWITH CTE AS (SELECT user_id, order_date, ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY order_date ASC) as rn FROM Orders) SELECT * FROM CTE WHERE rn = 1;',
        options: [
          'Đơn hàng đầu tiên (cũ nhất) của mỗi người dùng',
          'Đơn hàng mới nhất của mỗi người dùng',
          'Tất cả đơn hàng của người dùng số 1',
          'Báo lỗi cú pháp',
        ],
        answerIndex: 0,
        explanation: 'Vì ORDER BY order_date ASC sắp xếp ngày cũ nhất lên đầu, rn = 1 sẽ chọn ra đơn hàng đầu tiên trong lịch sử của từng người dùng.',
      },
    ],
  },

  {
    id: 'sql-305',
    order: 15,
    stage: 'advanced',
    stageTitle: 'Giai Đoạn 3: Nâng Cao',
    title: '🎬 MINI-PROJECT: "Chuyên Gia Phân Tích Chứng Khoán" 📈',
    subtitle: 'Xây dựng siêu truy vấn tính biến động giá và đường trung bình động 7 ngày (Moving Average)',
    category: 'Mini-Project Tổng Kết',
    timeEstimate: '30 phút',
    xpReward: 180,
    isCapstoneProject: true,
    concept: `
### 🎬 Bối cảnh Dự án
Bạn được tuyển dụng vào một quỹ phòng hộ (Hedge Fund). Sếp giao cho bạn một bảng dữ liệu lịch sử giá cổ phiếu mã "AAPL" (\`Stock_Prices\`) gồm 2 cột: \`trade_date\` (Ngày giao dịch) và \`close_price\` (Giá đóng cửa).

### 📋 Nhiệm vụ từ Sếp:
*"Tôi cần một bảng báo cáo cho thấy biến động giá của từng ngày so với ngày hôm trước. Đặc biệt, hãy tính cho tôi **Đường trung bình động 7 ngày (7-day Moving Average)** để tôi xem xu hướng đang tăng hay giảm!"*

### 💡 Hướng dẫn từng bước (Hints):
1. Dùng hàm \`LAG()\` để tạo cột \`prev_price\` (giá ngày hôm trước).
2. Tạo cột \`price_change\` = \`close_price - prev_price\`.
3. Dùng hàm \`CASE WHEN\` tạo cột \`trend\`: Nếu giá tăng thì 'UP', giảm thì 'DOWN', bằng thì 'FLAT'.
4. **Boss Level:** Để tính trung bình 7 ngày qua, dùng: \`AVG(close_price) OVER (ORDER BY trade_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7d\`.
    `,
    syntaxExample: `-- Mẫu phân tích chuỗi thời gian: tính chênh lệch, phân loại xu hướng và trung bình trượt 3 ngày:
SELECT record_date, temperature,
  LAG(temperature) OVER(ORDER BY record_date) AS prev_temp,
  temperature - LAG(temperature) OVER(ORDER BY record_date) AS temp_change,
  CASE 
    WHEN temperature > LAG(temperature) OVER(ORDER BY record_date) THEN 'WARMER'
    WHEN temperature < LAG(temperature) OVER(ORDER BY record_date) THEN 'COOLER'
    ELSE 'SAME'
  END AS weather_trend,
  AVG(temperature) OVER(
    ORDER BY record_date 
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS moving_avg_3d
FROM daily_weather;`,
    schemas: [
      {
        name: 'Stock_Prices',
        description: 'Lịch sử giá đóng cửa cổ phiếu công nghệ',
        columns: [
          { name: 'trade_date', type: 'TEXT PRIMARY KEY', description: 'Ngày giao dịch' },
          { name: 'close_price', type: 'INTEGER', description: 'Giá đóng cửa ($)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Stock_Prices (
        trade_date TEXT PRIMARY KEY,
        close_price INTEGER NOT NULL
      );`,
      `INSERT INTO Stock_Prices VALUES
        ('2026-10-01', 150),
        ('2026-10-02', 155),
        ('2026-10-03', 153),
        ('2026-10-04', 160),
        ('2026-10-05', 162),
        ('2026-10-06', 158),
        ('2026-10-07', 165),
        ('2026-10-08', 170);`,
    ],
    exercise: {
      goal: 'Xây dựng bảng phân tích biến động giá, xu hướng và đường trung bình động 7 ngày',
      taskDescription:
        `📈 **Bối cảnh:** Bạn là chuyên gia phân tích định lượng (Quantitative Analyst) tại một quỹ đầu tư tài chính. Bạn cần xây dựng bộ chỉ số kỹ thuật phục vụ thuật toán giao dịch tự động từ bảng dữ liệu lịch sử giá \`Stock_Prices\` gồm 2 cột \`trade_date\` và \`close_price\`.

🎯 **Yêu cầu cụ thể:**
Trích xuất các cột sau theo thứ tự:
1. \`trade_date\`, \`close_price\` (Dữ liệu gốc).
2. \`LAG(close_price) OVER(ORDER BY trade_date) AS prev_price\` (Giá đóng cửa phiên trước).
3. \`close_price - LAG(close_price) OVER(ORDER BY trade_date) AS price_change\` (Mức biến động giá).
4. Cột \`trend\` (Xu hướng giá): Dùng \`CASE WHEN\`:
   - \`close_price > prev\` -> \`'UP'\`
   - \`close_price < prev\` -> \`'DOWN'\`
   - Còn lại -> \`'FLAT'\`
5. \`AVG(close_price) OVER(ORDER BY trade_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7d\` (Đường trung bình động 7 ngày).`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `SELECT trade_date, close_price, LAG(close_price) OVER(ORDER BY trade_date) AS prev_price, close_price - LAG(close_price) OVER(ORDER BY trade_date) AS price_change, CASE WHEN close_price > LAG(close_price) OVER(ORDER BY trade_date) THEN 'UP' WHEN close_price < LAG(close_price) OVER(ORDER BY trade_date) THEN 'DOWN' ELSE 'FLAT' END AS trend, AVG(close_price) OVER(ORDER BY trade_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7d FROM Stock_Prices;`,
      hints: [
        'Phân loại xu hướng: CASE WHEN close_price > LAG(close_price) OVER(...) THEN \'UP\' ... END AS trend',
        'Tính trung bình động 7 ngày: AVG(close_price) OVER(ORDER BY trade_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7d',
      ],
      explanation:
        'VINH DANH BẬC THẦY LOGIC! Bạn đã làm chủ siêu năng lực phân tích dữ liệu tài chính đỉnh cao của Giai đoạn 3!',
    },
  },

  // =========================================================================
  // GIAI ĐOẠN 4: CHUYÊN GIA (EXPERT) - THIẾT KẾ VÀ TỐI ƯU HÓA HỆ THỐNG ⚙️
  // =========================================================================
  {
    id: 'sql-401',
    order: 16,
    stage: 'expert',
    stageTitle: 'Giai Đoạn 4: Chuyên Gia',
    title: 'BÀI 1: DML (THAY ĐỔI DỮ LIỆU) - Kẻ Kiến Tạo & Kẻ Hủy Diệt 🛠️',
    subtitle: 'Thực thi INSERT, UPDATE, DELETE an toàn và nguyên tắc sống còn với WHERE',
    category: 'Thao Tác Dữ Liệu (DML)',
    timeEstimate: '20 phút',
    xpReward: 130,
    concept: `
### 📖 Lý thuyết Cốt lõi
DML (Data Manipulation Language) là nhóm các câu lệnh dùng để thao tác với dữ liệu bên trong bảng:
- **\`INSERT INTO\`**: Thêm dữ liệu mới (Ví dụ: Một người dùng vừa đăng ký tài khoản).
- **\`UPDATE\`**: Cập nhật dữ liệu cũ (Ví dụ: Đổi mật khẩu, tăng lương).
- **\`DELETE\`**: Xóa dữ liệu (Ví dụ: Hủy tài khoản).

🚨 **Nguyên tắc sống còn:** Luôn luôn, KHÔNG BAO GIỜ được quên mệnh đề \`WHERE\` khi dùng \`UPDATE\` hoặc \`DELETE\`. Nếu quên, bạn sẽ vô tình xóa hoặc sửa TẤT CẢ dữ liệu trong cơ sở dữ liệu của công ty!
    `,
    syntaxExample: `-- Giảm giá 15% cho toàn bộ sản phẩm thuộc danh mục 'Thời trang' đã qua mùa
UPDATE Products 
SET price = price * 0.85 
WHERE category = 'Fashion';

-- Truy vấn kiểm tra lại dữ liệu sau khi sửa đổi
SELECT * FROM Products;`,
    schemas: [
      {
        name: 'Employees',
        description: 'Bảng nhân sự công ty',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'ID' },
          { name: 'name', type: 'TEXT', description: 'Tên nhân viên' },
          { name: 'department', type: 'TEXT', description: 'Phòng ban' },
          { name: 'salary', type: 'INTEGER', description: 'Mức lương ($)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        salary INTEGER NOT NULL
      );`,
      `INSERT INTO Employees VALUES
        (1, 'Alex', 'IT', 2000),
        (2, 'Sarah', 'HR', 1500),
        (3, 'David', 'IT', 2500);`,
    ],
    exercise: {
      goal: 'Cập nhật tăng 10% lương cho nhân viên phòng IT và kiểm tra lại kết quả',
      taskDescription:
        `🛠️ **Bối cảnh:** Công ty vừa có một năm tài chính khởi sắc nhờ đóng góp to lớn của đội ngũ công nghệ. Hội đồng quản trị đã phê duyệt quyết định tăng 10% lương cơ bản cho toàn thể chuyên viên phòng Công nghệ thông tin (IT).

🎯 **Yêu cầu cụ thể:**
1. Thực hiện lệnh cập nhật dữ liệu **\`UPDATE\`** trên bảng **\`Employees\`**:
   - Tăng lương 10%: \`SET salary = salary * 1.1\`.
   - Điều kiện chỉ áp dụng cho phòng IT: \`WHERE department = 'IT'\`.
2. Ngay sau lệnh UPDATE, chạy câu lệnh kiểm tra kết quả:
   \`SELECT * FROM Employees;\`.

💡 **Lưu ý:** Hai câu lệnh được ngăn cách bằng dấu chấm phẩy (\`;\`). Luôn có thói quen kiểm tra điều kiện WHERE trước khi chạy UPDATE để tránh sửa nhầm toàn bộ bảng!`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `UPDATE Employees SET salary = salary * 1.1 WHERE department = 'IT'; SELECT * FROM Employees;`,
      hints: [
        'Lệnh 1: UPDATE Employees SET salary = salary * 1.1 WHERE department = \'IT\';',
        'Lệnh 2 (đặt ngay sau dấu chấm phẩy): SELECT * FROM Employees;',
      ],
      explanation:
        'Cảm ơn sếp! Phòng IT đã nhận được lương mới tăng 10% đúng chuẩn DML an toàn!',
    },
    quizzes: [
      {
        question: 'Điều gì sẽ xảy ra nếu bạn chạy lệnh "DELETE FROM Users;" mà quên mệnh đề WHERE?',
        options: [
          'Toàn bộ tất cả dữ liệu trong bảng Users sẽ bị xóa sạch vĩnh viễn!',
          'Hệ thống sẽ tự động hỏi xác nhận',
          'Không có gì xảy ra vì lệnh bị lỗi cú pháp',
          'Chỉ xóa dòng đầu tiên',
        ],
        answerIndex: 0,
        explanation: 'Nếu thiếu WHERE, câu lệnh DELETE sẽ xóa toàn bộ các hàng trong bảng.',
      },
    ],
  },

  {
    id: 'sql-402',
    order: 17,
    stage: 'expert',
    stageTitle: 'Giai Đoạn 4: Chuyên Gia',
    title: 'BÀI 2: DDL & CONSTRAINTS - Xây Dựng Nền Móng 🏗️',
    subtitle: 'Tạo bảng CREATE TABLE, thiết lập khóa chính, khóa ngoại và ràng buộc CASCADE',
    category: 'Định Nghĩa CSDL (DDL)',
    timeEstimate: '25 phút',
    xpReward: 140,
    concept: `
### 📖 Lý thuyết Cốt lõi
DDL (Data Definition Language) dùng để định nghĩa cấu trúc của cơ sở dữ liệu bằng lệnh **\`CREATE TABLE\`**.
Khi tạo bảng, bạn phải quy định:
1. **Kiểu dữ liệu:** \`INT\` (số nguyên), \`VARCHAR\` (chuỗi văn bản), \`DATE\` (ngày tháng).
2. **Ràng buộc (Constraints):**
   - **Primary Key (Khóa chính - PK):** Cột định danh độc nhất cho mỗi dòng (như số CCCD).
   - **Foreign Key (Khóa ngoại - FK):** Dùng để liên kết bảng này với bảng kia.

🔥 **Sức mạnh của \`CASCADE\`:** Nếu một "Tác giả" bị xóa, bạn có muốn tất cả "Sách" của họ tự động bị xóa theo không? Hãy thêm \`ON DELETE CASCADE\` vào Khóa ngoại!
    `,
    syntaxExample: `-- Tạo bảng danh mục và bảng sản phẩm có liên kết ràng buộc khóa ngoại ON DELETE CASCADE
CREATE TABLE Categories (
  category_id INT PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL
);

CREATE TABLE Items (
  item_id INT PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE CASCADE
);`,
    schemas: [
      {
        name: 'Authors',
        description: 'Bảng tác giả',
        columns: [
          { name: 'id', type: 'INT PRIMARY KEY', description: 'Mã tác giả' },
          { name: 'name', type: 'VARCHAR(100)', description: 'Tên tác giả' },
        ],
      },
      {
        name: 'Books',
        description: 'Bảng đầu sách phát hành',
        columns: [
          { name: 'book_id', type: 'INT PRIMARY KEY', description: 'Mã sách' },
          { name: 'title', type: 'VARCHAR(200)', description: 'Tựa sách' },
          { name: 'author_id', type: 'INT', description: 'Mã tác giả (FK CASCADE)' },
        ],
        foreignKeys: [
          { fromColumn: 'author_id', toTable: 'Authors', toColumn: 'id' },
        ],
      },
    ],
    seedSql: [
      `-- Database trống sẵn sàng cho DDL`,
      `CREATE TABLE SystemInit (id INT PRIMARY KEY);`,
    ],
    exercise: {
      goal: 'Viết script tạo 2 bảng Authors và Books có ràng buộc khóa ngoại ON DELETE CASCADE',
      taskDescription:
        `🏗️ **Bối cảnh:** Bạn là Kỹ sư Dữ liệu (Data Engineer) chịu trách nhiệm thiết kế cấu trúc CSDL cho nền tảng thư viện điện tử. Cần đảm bảo tính toàn vẹn dữ liệu: khi một tác giả bị xóa, toàn bộ tác phẩm của tác giả đó cũng tự động bị xóa theo.

🎯 **Yêu cầu cụ thể:**
1. Tạo bảng **\`Authors\`** với các cột:
   - \`id INT PRIMARY KEY\`
   - \`name VARCHAR(100)\`
2. Tạo bảng **\`Books\`** với các cột:
   - \`book_id INT PRIMARY KEY\`
   - \`title VARCHAR(200)\`
   - \`author_id INT\`
   - Ràng buộc khóa ngoại: \`FOREIGN KEY (author_id) REFERENCES Authors(id) ON DELETE CASCADE\`
3. Chạy lệnh xác minh các bảng đã tạo thành công:
   \`SELECT name FROM sqlite_master WHERE type='table' AND name IN ('Authors', 'Books');\``,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `CREATE TABLE Authors ( id INT PRIMARY KEY, name VARCHAR(100) ); CREATE TABLE Books ( book_id INT PRIMARY KEY, title VARCHAR(200), author_id INT, FOREIGN KEY (author_id) REFERENCES Authors(id) ON DELETE CASCADE ); SELECT name FROM sqlite_master WHERE type='table' AND name IN ('Authors', 'Books');`,
      hints: [
        'Định nghĩa khóa ngoại ở cuối câu lệnh CREATE TABLE Books: FOREIGN KEY (author_id) REFERENCES Authors(id) ON DELETE CASCADE',
        'Đừng quên câu lệnh kiểm tra cuối cùng: SELECT name FROM sqlite_master WHERE type=\'table\' AND name IN (\'Authors\', \'Books\');',
      ],
      explanation:
        'Chính xác! Bạn vừa kiến tạo nền móng CSDL vững chắc với toàn vẹn tham chiếu CASCADE.',
    },
    quizzes: [
      {
        question: 'Ràng buộc ON DELETE CASCADE có tác dụng gì?',
        options: [
          'Tự động xóa các bản ghi con ở bảng tham chiếu khi bản ghi cha bị xóa',
          'Ngăn chặn không cho xóa bản ghi cha',
          'Đổi giá trị khóa ngoại thành số 0',
          'Nhân đôi số lượng bản ghi',
        ],
        answerIndex: 0,
        explanation: 'ON DELETE CASCADE đảm bảo tính toàn vẹn: Khi thực thể cha bị xóa, toàn bộ thực thể con liên quan tự động được dọn dẹp sạch sẽ.',
      },
    ],
  },

  {
    id: 'sql-403',
    order: 18,
    stage: 'expert',
    stageTitle: 'Giai Đoạn 4: Chuyên Gia',
    title: 'BÀI 3: VIEWS & TRIGGERS - Vệ Sĩ Bảo Mật & Robot Tự Động 🤖',
    subtitle: 'Tạo bảng ảo VIEW che giấu dữ liệu nhạy cảm và TRIGGER tự động kích hoạt',
    category: 'Bảo Mật & Tự Động Hóa',
    timeEstimate: '20 phút',
    xpReward: 140,
    concept: `
### 📖 Lý thuyết Cốt lõi
- **VIEW (Bảng ảo):** Giả sử bảng \`Users\` chứa cả mật khẩu và số thẻ tín dụng. Bạn muốn cho team Marketing xem thông tin người dùng (tên, email) nhưng tuyệt đối không cho xem dữ liệu nhạy cảm. Hãy tạo một **\`VIEW\`**. Nó giống như một tấm gương phản chiếu chỉ những cột bạn cho phép.
- **TRIGGER (Cò súng/Robot):** Là những đoạn code tự động chạy khi có sự kiện xảy ra. Ví dụ: Trigger tự động ghi log vào bảng kiểm toán mỗi khi có ai đó dùng lệnh \`UPDATE\` lương.
    `,
    syntaxExample: `-- Tạo View che giấu thông tin mức lương và số căn cước của nhân sự
CREATE VIEW PublicStaff AS 
SELECT employee_id, full_name, department, email 
FROM company_staff;

-- Truy vấn dữ liệu qua View như một bảng thực tế
SELECT * FROM PublicStaff;`,
    schemas: [
      {
        name: 'Users',
        description: 'Bảng người dùng chứa cả dữ liệu nhạy cảm',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'ID' },
          { name: 'name', type: 'TEXT', description: 'Tên' },
          { name: 'email', type: 'TEXT', description: 'Email' },
          { name: 'password_hash', type: 'TEXT', description: 'Mật khẩu mã hóa (NHẠY CẢM)' },
          { name: 'credit_card', type: 'TEXT', description: 'Số thẻ tín dụng (BÍ MẬT)' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        credit_card TEXT NOT NULL
      );`,
      `INSERT INTO Users VALUES
        (1, 'Alice', 'alice@corp.com', 'hash_secret_123', '4111-2222-3333-4444'),
        (2, 'Bob', 'bob@corp.com', 'hash_secret_456', '5500-6666-7777-8888');`,
    ],
    exercise: {
      goal: 'Tạo View PublicUsers bảo mật chỉ hiển thị id, name, email từ bảng Users',
      taskDescription:
        `🤖 **Bối cảnh:** Để tuân thủ quy định bảo mật an toàn thông tin cá nhân (GDPR), bộ phận Marketing không được phép nhìn thấy mật khẩu mã hóa (\`password_hash\`) và số thẻ tín dụng (\`credit_card\`) của khách hàng.

🎯 **Yêu cầu cụ thể:**
1. Tạo một khung nhìn ảo (View) có tên là **\`PublicUsers\`**:
   \`CREATE VIEW PublicUsers AS SELECT id, name, email FROM Users;\`
2. Thực hiện câu lệnh truy vấn từ View vừa tạo để kiểm tra dữ liệu hiển thị:
   \`SELECT * FROM PublicUsers;\`.

💡 **Mẹo:** View hoạt động như một bảng ảo không tốn dung lượng lưu trữ thực tế, giúp phân quyền và che chắn các trường dữ liệu nhạy cảm cực kỳ hiệu quả.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `CREATE VIEW PublicUsers AS SELECT id, name, email FROM Users; SELECT * FROM PublicUsers;`,
      hints: [
        'Cấu trúc tạo View: CREATE VIEW Tên_View AS SELECT cột_1, cột_2 FROM Bảng;',
        'Sau khi tạo View, viết tiếp câu lệnh SELECT * FROM PublicUsers; để kiểm tra kết quả.',
      ],
      explanation:
        'Rất xuất sắc! View PublicUsers đã bảo vệ an toàn tuyệt đối các thông tin nhạy cảm của khách hàng.',
    },
    quizzes: [
      {
        question: 'View có lưu trữ một bản sao dữ liệu vật lý riêng trên ổ cứng không?',
        options: [
          'Không, View là bảng ảo lưu câu lệnh truy vấn và trích xuất dữ liệu trực tiếp từ bảng gốc',
          'Có, nó tạo ra một file vật lý riêng',
          'Có, nhưng bị xóa sau khi tắt máy',
          'Chỉ lưu các cột số',
        ],
        answerIndex: 0,
        explanation: 'View trong chuẩn SQL là bảng ảo (Virtual Table), không chiếm thêm dung lượng lưu trữ cho dữ liệu bên trong.',
      },
    ],
  },

  {
    id: 'sql-404',
    order: 19,
    stage: 'expert',
    stageTitle: 'Giai Đoạn 4: Chuyên Gia',
    title: 'BÀI 4: TỐI ƯU HÓA (INDEXING) - Mục Lục Của Dữ Liệu ⚡',
    subtitle: 'Tăng tốc độ truy vấn từ 10 giây xuống 0.05 giây với cơ chế B-Tree Index',
    category: 'Tối Ưu & Chỉ Mục',
    timeEstimate: '20 phút',
    xpReward: 150,
    concept: `
### 📖 Lý thuyết Cốt lõi
Thử tưởng tượng bạn tìm từ khóa "SQL" trong một cuốn sách giáo khoa dày 1000 trang không có Mục lục. Bạn sẽ phải lật từng trang một (Full Table Scan). Rất chậm!
Nếu cuốn sách có trang Mục lục (Index) chứa các từ khóa và số trang tương ứng, bạn sẽ tìm thấy trong 2 giây.

**Index (Chỉ mục)** trong SQL hoạt động y hệt như vậy. Việc đánh Index lên một cột sẽ giúp các truy vấn \`WHERE\`, \`JOIN\` trên cột đó nhanh gấp hàng ngàn lần. 

⚖️ *Đánh đổi: Tạo Index tốn dung lượng ổ cứng và làm chậm quá trình INSERT/UPDATE (vì mỗi lần thêm dữ liệu mới, hệ thống phải cập nhật lại Mục lục).*
    `,
    syntaxExample: `-- Tạo Index (chỉ mục) trên cột order_date để tăng tốc độ tìm kiếm đơn hàng theo ngày
CREATE INDEX idx_order_date ON Orders(order_date);

-- Kiểm tra danh sách các Index hiện có trong hệ thống
SELECT name FROM sqlite_master WHERE type='index';`,
    schemas: [
      {
        name: 'Customers',
        description: 'Bảng khách hàng triệu dòng',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'ID' },
          { name: 'name', type: 'TEXT', description: 'Tên' },
          { name: 'phone', type: 'TEXT', description: 'Số điện thoại' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE Customers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL
      );`,
      `INSERT INTO Customers VALUES
        (1, 'Nguyen Van A', '0912345678'),
        (2, 'Tran Thi B', '0987654321');`,
    ],
    exercise: {
      goal: 'Tạo chỉ mục idx_phone trên cột phone của bảng Customers để tối ưu tốc độ tìm kiếm',
      taskDescription:
        `⚡ **Bối cảnh:** Tổng đài CSKH phản ánh ứng dụng tra cứu số điện thoại khách hàng thường xuyên bị chậm và treo khi lượng dữ liệu phình to lên hàng triệu dòng.

🎯 **Yêu cầu cụ thể:**
1. Tạo một chỉ mục (Index) có tên là **\`idx_phone\`** trên cột **\`phone\`** của bảng **\`Customers\`**:
   \`CREATE INDEX idx_phone ON Customers(phone);\`
2. Chạy câu lệnh kiểm tra sự tồn tại của Index vừa tạo trong danh mục hệ thống SQLite:
   \`SELECT name FROM sqlite_master WHERE type='index' AND name='idx_phone';\`.

💡 **Mẹo:** Index hoạt động giống như mục lục của một cuốn sách giáo khoa, giúp CSDL tìm đến thẳng trang chứa thông tin thay vì phải đọc quét từng trang một (Full Table Scan).`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `CREATE INDEX idx_phone ON Customers(phone); SELECT name FROM sqlite_master WHERE type='index' AND name='idx_phone';`,
      hints: [
        'Cú pháp tạo Index: CREATE INDEX tên_index ON tên_bảng(tên_cột);',
        'Ở bài này: CREATE INDEX idx_phone ON Customers(phone);',
      ],
      explanation:
        'Hệ thống đang chạy lại truy vấn... Thời gian phản hồi: 0.05 giây! Chúc mừng bạn đã giải cứu hệ thống thành công! 🚀',
    },
    quizzes: [
      {
        question: 'Bạn được giao thiết kế cột lưu trữ Số CCCD/Passport của người dùng. Kiểu dữ liệu và Ràng buộc (Constraint) nào là phù hợp nhất?',
        options: [
          'Kiểu VARCHAR, Ràng buộc UNIQUE',
          'Kiểu INT, Ràng buộc PRIMARY KEY',
          'Kiểu VARCHAR, không cần ràng buộc',
          'Kiểu FLOAT',
        ],
        answerIndex: 0,
        explanation: 'CCCD thường có số 0 ở đầu (001...) nên không dùng INT được. Và người dùng có thể chưa cập nhật CCCD nên nó không bắt buộc là PK, nhưng phải là UNIQUE để tránh trùng lặp.',
      },
    ],
  },

  {
    id: 'sql-405',
    order: 20,
    stage: 'expert',
    stageTitle: 'Giai Đoạn 4: Chuyên Gia',
    title: '🎬 TỐT NGHIỆP: "Thiết Kế Database Cho App Đặt Xe (Ride-Hailing)" 🚖',
    subtitle: 'Dựng toàn bộ lược đồ CSDL thực chiến từ con số 0 cho ứng dụng gọi xe công nghệ',
    category: 'Capstone Project Tốt Nghiệp',
    timeEstimate: '40 phút',
    xpReward: 250,
    isCapstoneProject: true,
    concept: `
### 🎬 Bối cảnh Dự án Tốt Nghiệp
Bạn vừa trúng tuyển vị trí Data Engineer tại một Startup công nghệ gọi xe (giống Grab/Uber). Công ty đang xây dựng tính năng từ con số 0. Sếp đưa cho bạn một bản phác thảo (ERD) và yêu cầu bạn viết script SQL để dựng Database.

### 📋 Yêu cầu thiết kế:
1. Tạo bảng \`Riders\` (Khách hàng): Gồm \`id\` (Khóa chính), \`name\`, \`phone\` (Duy nhất - UNIQUE).
2. Tạo bảng \`Drivers\` (Tài xế): Gồm \`id\` (Khóa chính), \`name\`, \`license_plate\`.
3. Tạo bảng \`Rides\` (Chuyến xe): Gồm \`id\` (Khóa chính), \`rider_id\` (Khóa ngoại), \`driver_id\` (Khóa ngoại), \`status\` (VD: 'completed', 'canceled').
4. Tối ưu hóa: Tạo một **Index** trên cột \`status\` của bảng \`Rides\` vì team vận hành thường xuyên lọc các chuyến xe bị 'canceled'.
5. Khởi tạo: \`INSERT\` 1 dòng dữ liệu mẫu vào bảng \`Riders\`.
    `,
    syntaxExample: `-- Mẫu kiến trúc DDL hoàn chỉnh cho nền tảng giao hàng (Food Delivery):
CREATE TABLE Restaurants (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(200)
);

CREATE TABLE Couriers (
  id INT PRIMARY KEY,
  courier_name VARCHAR(100) NOT NULL,
  vehicle_plate VARCHAR(20) UNIQUE
);

CREATE TABLE Deliveries (
  id INT PRIMARY KEY,
  restaurant_id INT,
  courier_id INT,
  status VARCHAR(30),
  FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id),
  FOREIGN KEY (courier_id) REFERENCES Couriers(id)
);

CREATE INDEX idx_delivery_status ON Deliveries(status);`,
    schemas: [
      {
        name: 'Riders',
        description: 'Bảng khách hàng đặt chuyến',
        columns: [
          { name: 'id', type: 'INT PRIMARY KEY', description: 'Mã khách hàng' },
          { name: 'name', type: 'VARCHAR(100)', description: 'Tên khách' },
          { name: 'phone', type: 'VARCHAR(20) UNIQUE', description: 'Số điện thoại' },
        ],
      },
      {
        name: 'Drivers',
        description: 'Bảng tài xế công nghệ',
        columns: [
          { name: 'id', type: 'INT PRIMARY KEY', description: 'Mã tài xế' },
          { name: 'name', type: 'VARCHAR(100)', description: 'Tên tài xế' },
          { name: 'license_plate', type: 'VARCHAR(20)', description: 'Biển số xe' },
        ],
      },
      {
        name: 'Rides',
        description: 'Bảng theo dõi chuyến xe',
        columns: [
          { name: 'id', type: 'INT PRIMARY KEY', description: 'Mã chuyến xe' },
          { name: 'rider_id', type: 'INT', description: 'Mã khách hàng (FK)' },
          { name: 'driver_id', type: 'INT', description: 'Mã tài xế (FK)' },
          { name: 'status', type: 'VARCHAR(50)', description: 'Trạng thái chuyến' },
        ],
        foreignKeys: [
          { fromColumn: 'rider_id', toTable: 'Riders', toColumn: 'id' },
          { fromColumn: 'driver_id', toTable: 'Drivers', toColumn: 'id' },
        ],
      },
    ],
    seedSql: [
      `CREATE TABLE InitApp (id INT PRIMARY KEY);`,
    ],
    exercise: {
      goal: 'Dựng trọn vẹn lược đồ CSDL chuẩn cho App Đặt xe công nghệ (Ride-Hailing)',
      taskDescription:
        `🚖 **ĐỒ ÁN TỐT NGHIỆP THÁM TỬ DỮ LIỆU CẤP CAO:**
Chúc mừng bạn đã đi đến chặng cuối cùng của học viện! Là Kiến trúc sư Dữ liệu Trưởng, bạn được giao trọng trách thiết kế nền tảng CSDL cho ứng dụng gọi xe công nghệ mới.

🎯 **5 Tiêu chuẩn Kỹ thuật bắt buộc phải hoàn thành trong 1 Script:**
1. Tạo bảng hành khách **\`Riders\`**: \`id INT PRIMARY KEY\`, \`name VARCHAR(100)\`, \`phone VARCHAR(20) UNIQUE\`.
2. Tạo bảng tài xế **\`Drivers\`**: \`id INT PRIMARY KEY\`, \`name VARCHAR(100)\`, \`license_plate VARCHAR(20)\`.
3. Tạo bảng chuyến đi **\`Rides\`**: \`id INT PRIMARY KEY\`, \`rider_id INT\`, \`driver_id INT\`, \`status VARCHAR(50)\`, có 2 khóa ngoại liên kết tới \`Riders(id)\` và \`Drivers(id)\`.
4. Tạo chỉ mục **\`idx_rides_status\`** trên cột \`status\` của bảng \`Rides\`.
5. Thêm 1 dòng mẫu vào bảng Riders: \`INSERT INTO Riders (id, name, phone) VALUES (1, 'Nguyen Van Khach', '0912345678');\` và kiểm tra qua \`SELECT name FROM sqlite_master WHERE type IN ('table', 'index');\`.`,
      starterQuery: '-- Viết code của bạn ở đây:\n',
      expectedQuery: `CREATE TABLE Riders ( id INT PRIMARY KEY, name VARCHAR(100), phone VARCHAR(20) UNIQUE ); CREATE TABLE Drivers ( id INT PRIMARY KEY, name VARCHAR(100), license_plate VARCHAR(20) ); CREATE TABLE Rides ( id INT PRIMARY KEY, rider_id INT, driver_id INT, status VARCHAR(50), FOREIGN KEY (rider_id) REFERENCES Riders(id), FOREIGN KEY (driver_id) REFERENCES Drivers(id) ); CREATE INDEX idx_rides_status ON Rides(status); INSERT INTO Riders (id, name, phone) VALUES (1, 'Nguyen Van Khach', '0912345678'); SELECT name FROM sqlite_master WHERE type IN ('table', 'index');`,
      hints: [
        'Lần lượt tạo 3 bảng: Riders -> Drivers -> Rides (vì Rides chứa khóa ngoại của 2 bảng kia).',
        'Nhớ tạo Index: CREATE INDEX idx_rides_status ON Rides(status); sau đó INSERT mẫu và kiểm tra qua sqlite_master.',
      ],
      explanation:
        'VINH DANH CHỨNG NHẬN SQL MASTER! Bạn đã kiến tạo thành công toàn bộ hệ thống cơ sở dữ liệu thực chiến và hoàn thành trọn vẹn lộ trình 4 giai đoạn!',
    },
  },
];
