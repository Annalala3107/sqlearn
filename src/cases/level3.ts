import { DetectiveCase } from './types';

// =========================================================================
// 🔴 CẤP ĐỘ 3: NÂNG CAO - THÁM TỬ ĐẠI TÀI (10 VỤ ÁN)
// Kỹ năng: Subqueries, CTEs, Window Functions (RANK, LAG), Moving Avg,
// String/Date functions, NOT EXISTS, Recursive CTE, Grand Boss Project
// =========================================================================

export const level3Cases: DetectiveCase[] = [
  // -----------------------------------------------------------------------
  // VỤ ÁN 21: Kế Toán Trưởng Tham Ô
  // -----------------------------------------------------------------------
  {
    id: 'case-021',
    title: 'Vụ án 21: Kế Toán Trưởng Tham Ô',
    slug: 'ke-toan-truong-tham-o',
    difficulty: 'nâng cao',
    category: 'Truy Vấn Lồng: Subquery',
    xpReward: 500,
    timeEstimate: '20-25 phút',
    date: '05/01/1989',
    location: 'Tổng Công ty XNK Lương Thực',
    brief: `Kiểm toán nhà nước phát hiện thất thoát hàng trăm triệu đồng tại Tổng Công ty XNK Lương Thực. Cảnh sát nghi ngờ kẻ tham ô là nhân viên trong phòng Kế toán. 
    
Quy luật tâm lý tội phạm kinh tế: Kẻ tham ô thường vung tay chi tiêu mua sắm xa xỉ bất thường. Dữ liệu thẻ tín dụng cho thấy có kẻ có mức chi tiêu hàng tháng cao gấp 3 lần mức lương TRUNG BÌNH của toàn bộ phòng Kế toán. 
Hãy viết truy vấn lồng (Subquery) tính 'AVG(luong)' của phòng Kế toán và lọc kẻ có mức chi tiêu 'chi_tieu > 3 * (Subquery)'!`,
    clues: [
      'Subquery: (SELECT AVG(luong) FROM nhan_vien WHERE phong_ban = \'Kế toán\').',
      'Điều kiện lọc chính: chi_tieu > 3 * Subquery.',
      'Kẻ tham ô đang sống trong căn hộ cao cấp đứng tên người tình.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Viết Subquery tính lương trung bình `AVG(luong)` của phòng Kế toán.',
        hint: "SELECT AVG(luong) FROM nhan_vien WHERE phong_ban = 'Kế toán';"
      },
      {
        id: 2,
        text: 'Lọc nhân viên có `chi_tieu > 3 * (Subquery)` để vạch trần kẻ tham ô.',
        hint: "SELECT nv.ho_ten, nv.chuc_vu, td.chi_tieu FROM nhan_vien nv JOIN the_tin_dung td ON nv.ma_nv = td.ma_nv WHERE td.chi_tieu > 3 * (SELECT AVG(luong) FROM nhan_vien WHERE phong_ban = 'Kế toán');"
      }
    ],
    schemas: [
      {
        name: 'nhan_vien',
        columns: [
          { name: 'ma_nv', type: 'TEXT PRIMARY KEY', description: 'Mã nhân viên' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên' },
          { name: 'phong_ban', type: 'TEXT', description: 'Phòng ban' },
          { name: 'chuc_vu', type: 'TEXT', description: 'Chức vụ đảm nhiệm' },
          { name: 'luong', type: 'INTEGER', description: 'Lương cơ bản hàng tháng (đồng)' }
        ]
      },
      {
        name: 'the_tin_dung',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã thẻ' },
          { name: 'ma_nv', type: 'TEXT', description: 'Mã nhân viên sở hữu' },
          { name: 'chi_tieu', type: 'INTEGER', description: 'Tổng chi tiêu tháng gần nhất (đồng)' }
        ],
        foreignKeys: [{ fromColumn: 'ma_nv', toTable: 'nhan_vien', toColumn: 'ma_nv' }]
      }
    ],
    starterQuery: `-- Sử dụng Subquery tìm nhân viên chi tiêu gấp 3 lần lương TB phòng Kế toán
SELECT nv.ho_ten, nv.chuc_vu, nv.luong, td.chi_tieu 
FROM nhan_vien nv 
JOIN the_tin_dung td ON nv.ma_nv = td.ma_nv 
WHERE td.chi_tieu > 3 * (
  SELECT AVG(luong) 
  FROM nhan_vien 
  WHERE phong_ban = 'Kế toán'
);`,
    seedSql: [
      `CREATE TABLE nhan_vien (
        ma_nv TEXT PRIMARY KEY,
        ho_ten TEXT,
        phong_ban TEXT,
        chuc_vu TEXT,
        luong INTEGER
      );`,
      `INSERT INTO nhan_vien VALUES
        ('KT01', 'Nguyễn Thị Bích', 'Kế toán', 'Nhân viên thanh toán', 3000000),
        ('KT02', 'Trần Văn Cường', 'Kế toán', 'Kế toán trưởng', 6000000),
        ('KT03', 'Lê Thu Trang', 'Kế toán', 'Thủ quỹ', 3500000),
        ('KD01', 'Hoàng Minh Tuấn', 'Kinh doanh', 'Trưởng phòng', 7000000);`,
      `CREATE TABLE the_tin_dung (
        id INTEGER PRIMARY KEY,
        ma_nv TEXT,
        chi_tieu INTEGER
      );`,
      `INSERT INTO the_tin_dung VALUES
        (1, 'KT01', 2500000),
        (2, 'KT02', 18500000),
        (3, 'KT03', 3100000),
        (4, 'KD01', 8000000);`
    ],
    solution: {
      culprit: 'Trần Văn Cường',
      successTitle: 'Bắt Giữ Kế Toán Trưởng!',
      successMessage: 'Kế toán trưởng Trần Văn Cường chi tiêu tới 18.500.000đ/tháng!',
      explanation: 'Lương trung bình phòng Kế toán là (3tr + 6tr + 3.5tr) / 3 = 4.166.666đ. Mức chi tiêu gấp 3 lần là 12.500.000đ. Trần Văn Cường chi tiêu tới 18.500.000đ vượt xa thu nhập thực tế.',
      referenceQuery: `SELECT nv.ho_ten FROM nhan_vien nv JOIN the_tin_dung td ON nv.ma_nv = td.ma_nv WHERE td.chi_tieu > 3 * (SELECT AVG(luong) FROM nhan_vien WHERE phong_ban = 'Kế toán');`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 22: Dấu Chân Sát Nhân
  // -----------------------------------------------------------------------
  {
    id: 'case-022',
    title: 'Vụ án 22: Dấu Chân Sát Nhân',
    slug: 'dau-chan-sat-nhan',
    difficulty: 'nâng cao',
    category: 'Bảng Tạm: WITH (CTE)',
    xpReward: 500,
    timeEstimate: '20-25 phút',
    date: '10/01/1989',
    location: 'Khu nhà trọ Xóm Chiếu, Quận 4',
    brief: `Vụ án mạng kinh hoàng tại hẻm Xóm Chiếu để lại rất ít manh mối. Đội pháp y thu được mẫu máu hung thủ rơi lại thuộc nhóm máu cực hiếm 'AB-' và dấu vân tay tại chuôi dao có độ trùng khớp trên 95% với tàng thư căn cước. 
    
Kẻ sát nhân dùng tên giả để thuê phòng trọ gần đó. Bạn cần dùng cú pháp bảng tạm 'WITH' (Common Table Expressions):
- CTE 1: Lọc người có nhóm máu 'AB-' từ 'ho_so_y_te'.
- CTE 2: Lọc người có độ trùng khớp vân tay 'do_khop > 95' từ 'giam_dinh_van_tay'.
- Ghép nối 2 CTE này với bảng 'thue_nha_tro' để tìm ra tên sát thủ!`,
    clues: [
      'CTE1: Lọc nhóm máu AB-.',
      'CTE2: Lọc độ trùng khớp vân tay do_khop > 95%.',
      'JOIN 2 CTE với thue_nha_tro qua căn cước CMND.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Tạo CTE1 lọc hồ sơ y tế nhóm máu \'AB-\'.',
        hint: "WITH MauHiếm AS (SELECT cmnd, ho_ten FROM ho_so_y_te WHERE nhom_mau = 'AB-')"
      },
      {
        id: 2,
        text: 'Tạo CTE2 lọc dấu vân tay > 95% và `JOIN` tìm phòng trọ hung thủ đang lẩn trốn.',
        hint: "WITH MauHiem AS (SELECT cmnd, ho_ten FROM ho_so_y_te WHERE nhom_mau = 'AB-'), VanTayKhop AS (SELECT cmnd FROM giam_dinh_van_tay WHERE do_khop > 95) SELECT m.ho_ten, t.ten_gia, t.dia_chi_tro FROM MauHiem m JOIN VanTayKhop v ON m.cmnd = v.cmnd JOIN thue_nha_tro t ON m.cmnd = t.cmnd_that;"
      }
    ],
    schemas: [
      {
        name: 'ho_so_y_te',
        columns: [
          { name: 'cmnd', type: 'TEXT PRIMARY KEY', description: 'Số CMND' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên' },
          { name: 'nhom_mau', type: 'TEXT', description: 'Nhóm máu' }
        ]
      },
      {
        name: 'giam_dinh_van_tay',
        columns: [
          { name: 'cmnd', type: 'TEXT PRIMARY KEY', description: 'Số CMND' },
          { name: 'do_khop', type: 'REAL', description: 'Độ trùng khớp (%)' }
        ],
        foreignKeys: [
          { fromColumn: 'cmnd', toTable: 'ho_so_y_te', toColumn: 'cmnd' }
        ]
      },
      {
        name: 'thue_nha_tro',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã phòng' },
          { name: 'cmnd_that', type: 'TEXT', description: 'CMND thật đối tượng' },
          { name: 'ten_gia', type: 'TEXT', description: 'Tên giả khi thuê' },
          { name: 'dia_chi_tro', type: 'TEXT', description: 'Địa chỉ nhà trọ' }
        ],
        foreignKeys: [{ fromColumn: 'cmnd_that', toTable: 'ho_so_y_te', toColumn: 'cmnd' }]
      }
    ],
    starterQuery: `-- Sử dụng CTE kết hợp hồ sơ máu và giám định vân tay
WITH 
MauHiem AS (
  SELECT cmnd, ho_ten FROM ho_so_y_te WHERE nhom_mau = 'AB-'
),
VanTayKhop AS (
  SELECT cmnd FROM giam_dinh_van_tay WHERE do_khop > 95
)
SELECT m.ho_ten, m.cmnd, t.ten_gia, t.dia_chi_tro 
FROM MauHiem m 
JOIN VanTayKhop v ON m.cmnd = v.cmnd 
JOIN thue_nha_tro t ON m.cmnd = t.cmnd_that;`,
    seedSql: [
      `CREATE TABLE ho_so_y_te (
        cmnd TEXT PRIMARY KEY,
        ho_ten TEXT,
        nhom_mau TEXT
      );`,
      `INSERT INTO ho_so_y_te VALUES
        ('024111', 'Lê Hữu Đạo', 'AB-'),
        ('024222', 'Trần Bá Thắng', 'O+'),
        ('024333', 'Vũ Khắc Khiêm', 'AB-'),
        ('024444', 'Ngô Quốc Bảo', 'A+');`,
      `CREATE TABLE giam_dinh_van_tay (
        cmnd TEXT PRIMARY KEY,
        do_khop REAL
      );`,
      `INSERT INTO giam_dinh_van_tay VALUES
        ('024111', 78.5),
        ('024222', 92.0),
        ('024333', 98.2),
        ('024444', 60.0);`,
      `CREATE TABLE thue_nha_tro (
        id INTEGER PRIMARY KEY,
        cmnd_that TEXT,
        ten_gia TEXT,
        dia_chi_tro TEXT
      );`,
      `INSERT INTO thue_nha_tro VALUES
        (1, '024111', 'Bác Ba Phi', 'Hẻm 45 Đoàn Văn Bơ'),
        (2, '024333', 'Anh Tư Thợ Hàn', 'Phòng 102 Nhà trọ Cây Điệp, Xóm Chiếu');`
    ],
    solution: {
      culprit: 'Vũ Khắc Khiêm',
      successTitle: 'Bắt Đúng Sát Thủ!',
      successMessage: 'Vũ Khắc Khiêm trốn dưới tên giả "Anh Tư Thợ Hàn" đã bị bắt!',
      explanation: 'Vũ Khắc Khiêm (CMND 024333) vừa có nhóm máu AB-, vừa có vân tay khớp tới 98.2% trên chuôi dao và đang lẩn trốn tại phòng trọ Cây Điệp.',
      referenceQuery: `WITH MauHiem AS (SELECT cmnd, ho_ten FROM ho_so_y_te WHERE nhom_mau = 'AB-'), VanTayKhop AS (SELECT cmnd FROM giam_dinh_van_tay WHERE do_khop > 95) SELECT m.ho_ten FROM MauHiem m JOIN VanTayKhop v ON m.cmnd = v.cmnd;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 23: Trùm Bảo Kê Các Quận
  // -----------------------------------------------------------------------
  {
    id: 'case-023',
    title: 'Vụ án 23: Trùm Bảo Kê Các Quận',
    slug: 'trum-bao-ke-cac-quan',
    difficulty: 'nâng cao',
    category: 'Hàm Cửa Sổ: RANK() OVER (PARTITION BY)',
    xpReward: 500,
    timeEstimate: '20-25 phút',
    date: '15/01/1989',
    location: 'Các tụ điểm chợ đầu mối toàn thành phố',
    brief: `Chiến dịch "Bàn Tay Sắt" của công an thành phố đặt mục tiêu triệt phá các băng nhóm bảo kê cưỡng đoạt tài sản của tiểu thương tại các quận. 
    
Ban chỉ đạo yêu cầu: Bắt giữ tên thu tiền bảo kê số 1 (Top 1 thu tiền nhiều nhất) của TỪNG quận trong tuần qua. Hãy dùng hàm cửa sổ 'RANK() OVER (PARTITION BY quan ORDER BY so_tien DESC)' và lọc ra những kẻ xếp hạng 'Rank = 1'!`,
    clues: [
      'Phân vùng theo quận: PARTITION BY quan.',
      'Sắp xếp số tiền thu bảo kê giảm dần: ORDER BY so_tien DESC.',
      'Lọc lấy những kẻ có rank_thu_tien = 1.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Dùng `RANK() OVER (PARTITION BY quan ORDER BY so_tien DESC)` để xếp hạng thu tiền.',
        hint: "SELECT ho_ten, quan, so_tien, RANK() OVER (PARTITION BY quan ORDER BY so_tien DESC) AS xep_hang FROM thu_tien_bao_ke;"
      },
      {
        id: 2,
        text: 'Lấy danh sách trùm bảo kê Top 1 của từng quận (`xep_hang = 1`).',
        hint: "SELECT * FROM (SELECT ho_ten, quan, so_tien, RANK() OVER (PARTITION BY quan ORDER BY so_tien DESC) AS xep_hang FROM thu_tien_bao_ke) WHERE xep_hang = 1;"
      }
    ],
    schemas: [
      {
        name: 'thu_tien_bao_ke',
        description: 'Sổ sách thu tiền bẩn của các trùm giang hồ',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã thu' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên đối tượng' },
          { name: 'quan', type: 'TEXT', description: 'Địa bàn quận' },
          { name: 'so_tien', type: 'INTEGER', description: 'Tổng tiền thu trong tuần (đồng)' }
        ]
      }
    ],
    starterQuery: `-- Xếp hạng trùm bảo kê Top 1 của từng quận bằng Window Function
SELECT ho_ten, quan, so_tien, 
       RANK() OVER (PARTITION BY quan ORDER BY so_tien DESC) AS xep_hang 
FROM thu_tien_bao_ke;`,
    seedSql: [
      `CREATE TABLE thu_tien_bao_ke (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        quan TEXT,
        so_tien INTEGER
      );`,
      `INSERT INTO thu_tien_bao_ke VALUES
        (1, 'Đại Cathay Đệ Tử', 'Quận 1', 45000000),
        (2, 'Tư Mắt Mèo', 'Quận 1', 32000000),
        (3, 'Sáu Hắc Ám', 'Quận 4', 28000000),
        (4, 'Bảy Búa Rìu', 'Quận 4', 52000000),
        (5, 'Hải Phòng Phong', 'Quận 5', 38000000),
        (6, 'Chín Đầu Bò', 'Quận 5', 61000000);`
    ],
    solution: {
      culprit: 'Chín Đầu Bò',
      successTitle: 'Cất Vó Toàn Bộ!',
      successMessage: 'Đã tóm gọn trùm bảo kê số 1 các quận, đặc biệt là Chín Đầu Bò (Quận 5)!',
      explanation: 'Hàm RANK() chỉ ra Top 1 các quận gồm: Đại Cathay Đệ Tử (Quận 1 - 45tr), Bảy Búa Rìu (Quận 4 - 52tr) và trùm lớn nhất Chín Đầu Bò (Quận 5 - 61tr).',
      referenceQuery: `SELECT * FROM (SELECT ho_ten, quan, so_tien, RANK() OVER (PARTITION BY quan ORDER BY so_tien DESC) AS xep_hang FROM thu_tien_bao_ke) WHERE xep_hang = 1;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 24: Đánh Tráo Kim Cương
  // -----------------------------------------------------------------------
  {
    id: 'case-024',
    title: 'Vụ án 24: Đánh Tráo Kim Cương',
    slug: 'danh-trao-kim-cuong',
    difficulty: 'nâng cao',
    category: 'Hàm Cửa Sổ: LAG()',
    xpReward: 500,
    timeEstimate: '20-25 phút',
    date: '18/01/1989',
    location: 'Triển lãm Đá quý Quốc tế',
    brief: `Viên kim cương hồng "Mắt Hổ" đã bị đánh tráo tinh vi bằng một viên đá thủy tinh nhân tạo. Biên bản thẩm định của chuyên gia giám định quốc tế xác nhận lúc 15:30 viên kim cương thật vẫn nằm trong tủ trưng bày. Đến 16:30, khi mở tủ thì phát hiện hàng giả.
    
Điều tra hiện trường: Kẻ đánh tráo đã lợi dụng khoảng trống bảo an để bước vào phòng triển lãm ngay SAU chuyên gia giám định. Hãy dùng hàm cửa sổ 'LAG(chuc_vu) OVER (ORDER BY thoi_gian)' để xem ai là người bước vào ngay sau người có chức vụ 'Chuyên gia'!`,
    clues: [
      'Dùng hàm LAG(chuc_vu) OVER (ORDER BY thoi_gian) để nhìn lại người đi trước.',
      'Tìm người có người đi trước là "Chuyên gia giám định".',
      'Kẻ này có hành vi che giấu vật thể nhỏ trong túi áo.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Dùng `LAG(chuc_vu) OVER (ORDER BY thoi_gian)` để tạo cột chức vụ của người vào trước đó.',
        hint: "SELECT ho_ten, chuc_vu, thoi_gian, LAG(chuc_vu) OVER (ORDER BY thoi_gian) AS nguoi_truoc FROM nhat_ky_trien_lam;"
      },
      {
        id: 2,
        text: 'Tìm người bước vào ngay sau \'Chuyên gia giám định\'.',
        hint: "SELECT * FROM (SELECT ho_ten, chuc_vu, thoi_gian, LAG(chuc_vu) OVER (ORDER BY thoi_gian) AS nguoi_truoc FROM nhat_ky_trien_lam) WHERE nguoi_truoc = 'Chuyên gia giám định';"
      }
    ],
    schemas: [
      {
        name: 'nhat_ky_trien_lam',
        description: 'Camera nhận diện thời gian ra vào phòng Mắt Hổ',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên người vào' },
          { name: 'chuc_vu', type: 'TEXT', description: 'Chức vụ' },
          { name: 'thoi_gian', type: 'TEXT', description: 'Giờ vào phòng (HH:MM)' }
        ]
      }
    ],
    starterQuery: `-- Dùng hàm LAG() để tìm người bước vào ngay sau Chuyên gia giám định
SELECT ho_ten, chuc_vu, thoi_gian,
       LAG(chuc_vu) OVER (ORDER BY thoi_gian) AS chuc_vu_nguoi_truoc 
FROM nhat_ky_trien_lam;`,
    seedSql: [
      `CREATE TABLE nhat_ky_trien_lam (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        chuc_vu TEXT,
        thoi_gian TEXT
      );`,
      `INSERT INTO nhat_ky_trien_lam VALUES
        (1, 'Lê Văn An', 'Bảo vệ ca chiều', '15:10'),
        (2, 'Dr. Robert Chen', 'Chuyên gia giám định', '15:25'),
        (3, 'Thái Vĩnh Kiên', 'Nhiếp ảnh gia', '15:40'),
        (4, 'Trần Minh Hương', 'Khách VIP', '16:05'),
        (5, 'Đỗ Hoàng Bách', 'Trợ lý ban tổ chức', '16:20');`
    ],
    solution: {
      culprit: 'Thái Vĩnh Kiên',
      successTitle: 'Bắt Quả Tang Đánh Tráo!',
      successMessage: 'Thái Vĩnh Kiên bước vào lúc 15:40 ngay sau giám định viên!',
      explanation: 'Hàm LAG() chỉ ra "Thái Vĩnh Kiên" (Nhiếp ảnh gia) bước vào phòng Mắt Hổ lúc 15:40 ngay sau khi Dr. Robert Chen rời đi. Hắn giấu viên kim cương thật trong ống kính máy ảnh.',
      referenceQuery: `SELECT * FROM (SELECT ho_ten, LAG(chuc_vu) OVER (ORDER BY thoi_gian) AS nguoi_truoc FROM nhat_ky_trien_lam) WHERE nguoi_truoc = 'Chuyên gia giám định';`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 25: Thao Túng Sàn Vàng
  // -----------------------------------------------------------------------
  {
    id: 'case-025',
    title: 'Vụ án 25: Thao Túng Sàn Vàng',
    slug: 'thao-tung-san-vang',
    difficulty: 'nâng cao',
    category: 'Trung Bình Trượt: Moving Average (ROWS BETWEEN)',
    xpReward: 500,
    timeEstimate: '20-25 phút',
    date: '22/01/1989',
    location: 'Sở Giao dịch Hàng hóa & Vàng Sài Gòn',
    brief: `Giá vàng tại thị trường tự do biến động dữ dội nghi ngờ do một tài phiệt ngầm gom hàng tạo sóng thao túng. 
    
Thuật toán chống thao túng: Một nhà đầu tư bị coi là bất thường nếu khối lượng giao dịch trong ngày của hắn cao GẤP ĐÔI mức trung bình trượt 3 ngày gần nhất ('ROWS BETWEEN 2 PRECEDING AND CURRENT ROW'). Hãy dùng hàm 'AVG(khoi_luong) OVER(...)' để phát hiện lệnh mua thao túng thị trường!`,
    clues: [
      'Tính Moving Average 3 ngày: AVG(khoi_luong) OVER (PARTITION BY nha_dau_tu ORDER BY ngay ROWS BETWEEN 2 PRECEDING AND CURRENT ROW).',
      'Lọc các bản ghi có khoi_luong > 1.8 * moving_avg để tìm phiên gom hàng đột biến.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Tính Trung bình trượt 3 ngày (`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`).',
        hint: "SELECT nha_dau_tu, ngay, khoi_luong, AVG(khoi_luong) OVER (PARTITION BY nha_dau_tu ORDER BY ngay ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS tb_truot FROM giao_dich_vang;"
      },
      {
        id: 2,
        text: 'So sánh khối lượng hiện tại đột biến cao hơn mức trung bình trượt.',
        hint: "SELECT * FROM (SELECT nha_dau_tu, ngay, khoi_luong, AVG(khoi_luong) OVER (PARTITION BY nha_dau_tu ORDER BY ngay ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS tb_truot FROM giao_dich_vang) WHERE khoi_luong > 1.8 * tb_truot;"
      }
    ],
    schemas: [
      {
        name: 'giao_dich_vang',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã' },
          { name: 'nha_dau_tu', type: 'TEXT', description: 'Tên nhà đầu tư' },
          { name: 'ngay', type: 'TEXT', description: 'Ngày giao dịch' },
          { name: 'khoi_luong', type: 'INTEGER', description: 'Số lượng lượng vàng giao dịch' }
        ]
      }
    ],
    starterQuery: `-- Tính trung bình trượt 3 ngày bằng Window Function
SELECT nha_dau_tu, ngay, khoi_luong,
       ROUND(AVG(khoi_luong) OVER (
         PARTITION BY nha_dau_tu 
         ORDER BY ngay 
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ), 2) AS trung_binh_truot_3ngay 
FROM giao_dich_vang;`,
    seedSql: [
      `CREATE TABLE giao_dich_vang (
        id INTEGER PRIMARY KEY,
        nha_dau_tu TEXT,
        ngay TEXT,
        khoi_luong INTEGER
      );`,
      `INSERT INTO giao_dich_vang VALUES
        (1, 'Đỗ Văn Thành', '1989-01-18', 50),
        (2, 'Đỗ Văn Thành', '1989-01-19', 45),
        (3, 'Đỗ Văn Thành', '1989-01-20', 55),
        (4, 'Đỗ Văn Thành', '1989-01-21', 60),
        (5, 'Bạch Kim Hải', '1989-01-18', 40),
        (6, 'Bạch Kim Hải', '1989-01-19', 50),
        (7, 'Bạch Kim Hải', '1989-01-20', 45),
        (8, 'Bạch Kim Hải', '1989-01-21', 350);`
    ],
    solution: {
      culprit: 'Bạch Kim Hải',
      successTitle: 'Lật Tẩy Thao Túng!',
      successMessage: 'Bạch Kim Hải gom đột biến 350 lượng vàng ngày 21/01!',
      explanation: 'Bạch Kim Hải duy trì mức giao dịch bình thường 40-50 lượng, nhưng đột ngột mua 350 lượng ngày 21/01, cao gấp nhiều lần trung bình trượt 3 ngày nhằm lũng đoạn giá vàng.',
      referenceQuery: `SELECT nha_dau_tu FROM (SELECT nha_dau_tu, khoi_luong, AVG(khoi_luong) OVER (PARTITION BY nha_dau_tu ORDER BY ngay ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS tb FROM giao_dich_vang) WHERE khoi_luong > 1.8 * tb;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 26: Mật Mã Bức Điện Tín
  // -----------------------------------------------------------------------
  {
    id: 'case-026',
    title: 'Vụ án 26: Mật Mã Bức Điện Tín',
    slug: 'mat-ma-buc-dien-tin',
    difficulty: 'nâng cao',
    category: 'Xử Lý Chuỗi: SUBSTR, REPLACE',
    xpReward: 500,
    timeEstimate: '20-25 phút',
    date: '25/01/1989',
    location: 'Trạm phát sóng vô tuyến điện mật',
    brief: `Đài trinh sát kỹ thuật thu chặn được một bức điện tín mã hóa của trùm buôn lậu vũ khí. Nội dung bức điện bị chèn dày đặc các ký tự nhiễu '#'. 
    
Quy tắc giải mã của Cục Cơ mật:
1. Dùng 'REPLACE(noi_dung, '#', '')' để làm sạch nội dung bức điện.
2. Mật danh kẻ nhận hàng được trích xuất từ 4 ký tự cuối của mã vận đơn 'SUBSTR(ma_van_don, -4)'.
Hãy giải mã bức điện và tra cứu mã số tội phạm nguy hiểm này!`,
    clues: [
      'Làm sạch chuỗi: REPLACE(noi_dung, \'#\', \'\').',
      'Cắt 4 ký tự cuối: SUBSTR(ma_van_don, -4).',
      'Đối chiếu mã hồ sơ với tàng thư tội phạm.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Làm sạch bức điện bằng `REPLACE(noi_dung, \'#\', \'\')`.',
        hint: "SELECT id, REPLACE(noi_dung, '#', '') AS noi_dung_sach FROM dien_tin_mat;"
      },
      {
        id: 2,
        text: 'Lấy `SUBSTR(ma_van_don, -4)` để tra cứu hồ sơ tội phạm.',
        hint: "SELECT d.id, SUBSTR(d.ma_van_don, -4) AS ma_toi_pham, tp.ho_ten, tp.biet_danh FROM dien_tin_mat d JOIN ho_so_toi_pham tp ON SUBSTR(d.ma_van_don, -4) = tp.ma_ho_so;"
      }
    ],
    schemas: [
      {
        name: 'dien_tin_mat',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã điện tín' },
          { name: 'ma_van_don', type: 'TEXT', description: 'Mã vận đơn đính kèm' },
          { name: 'noi_dung', type: 'TEXT', description: 'Nội dung chứa ký tự nhiễu #' }
        ],
        foreignKeys: [
          { fromColumn: 'ma_van_don', toTable: 'ho_so_toi_pham', toColumn: 'ma_ho_so' }
        ]
      },
      {
        name: 'ho_so_toi_pham',
        columns: [
          { name: 'ma_ho_so', type: 'TEXT PRIMARY KEY', description: 'Mã hồ sơ (4 ký tự)' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên tội phạm' },
          { name: 'biet_danh', type: 'TEXT', description: 'Biệt danh giang hồ' }
        ]
      }
    ],
    starterQuery: `-- Làm sạch nội dung điện tín và trích xuất 4 ký tự cuối
SELECT d.id, 
       REPLACE(d.noi_dung, '#', '') AS noi_dung_giai_ma, 
       SUBSTR(d.ma_van_don, -4) AS ma_ho_so_nhan 
FROM dien_tin_mat d;`,
    seedSql: [
      `CREATE TABLE dien_tin_mat (
        id INTEGER PRIMARY KEY,
        ma_van_don TEXT,
        noi_dung TEXT
      );`,
      `INSERT INTO dien_tin_mat VALUES
        (1, 'VN-EXP-7788', 'H#À#N#G# V#Ề# B#Ế#N# L#Ú#C# 0#2#H# S#Á#N#G'),
        (2, 'VN-EXP-9900', 'T#I#Ề#N# Đ#Ã# C#H#U#Y#Ể#N# Q#U#A# P#H#Á#P');`,
      `CREATE TABLE ho_so_toi_pham (
        ma_ho_so TEXT PRIMARY KEY,
        ho_ten TEXT,
        biet_danh TEXT
      );`,
      `INSERT INTO ho_so_toi_pham VALUES
        ('7788', 'Lưu Cẩm Bình', 'Bình Ma Quỷ'),
        ('9900', 'Đặng Thế Cường', 'Cường Rồng Vàng'),
        ('1122', 'Trần Hùng Sơn', 'Sơn Cụt');`
    ],
    solution: {
      culprit: 'Lưu Cẩm Bình',
      successTitle: 'Giải Mã Thành Công!',
      successMessage: 'Bức điện tín vũ khí gửi cho Lưu Cẩm Bình (Bình Ma Quỷ)!',
      explanation: 'Nội dung làm sạch: "HÀNG VỀ BẾN LÚC 02H SÁNG". Mã vận đơn VN-EXP-7788 có 4 số cuối là 7788, tương ứng với trùm buôn vũ khí Lưu Cẩm Bình.',
      referenceQuery: `SELECT tp.ho_ten FROM dien_tin_mat d JOIN ho_so_toi_pham tp ON SUBSTR(d.ma_van_don, -4) = tp.ma_ho_so WHERE d.id = 1;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 27: Mã Độc Giờ Giới Nghiêm
  // -----------------------------------------------------------------------
  {
    id: 'case-027',
    title: 'Vụ án 27: Mã Độc Giờ Giới Nghiêm',
    slug: 'ma-doc-gio-gioi-nghiem',
    difficulty: 'nâng cao',
    category: 'Thời Gian: STRFTIME, DATEDIFF',
    xpReward: 500,
    timeEstimate: '20-25 phút',
    date: '28/01/1989',
    location: 'Trung tâm Tính toán Dữ liệu Viễn thông',
    brief: `Hệ thống máy chủ viễn thông bị hacker cài cắm virus gián điệp vào ban đêm. 
    
Dấu vết kỹ thuật số: Kẻ tấn công lợi dụng giờ giới nghiêm từ 01:00 đến 04:00 sáng để kết nối. Để tránh bị tường lửa phát hiện, hắn thực hiện phiên truy cập siêu chớp nhoáng với thời lượng kết nối dưới 120 giây. 
Hãy dùng hàm trích xuất giờ 'STRFTIME('%H', thoi_gian_dang_nhap)' trong SQLite và tính thời lượng phiên để tìm địa chỉ IP và tài khoản của kẻ xâm nhập!`,
    clues: [
      'Trích xuất giờ: STRFTIME(\'%H\', thoi_gian_vao) BETWEEN \'01\' AND \'03\'.',
      'Thời lượng kết nối: thoi_luong_giay < 120.',
      'Tài khoản sử dụng có quyền quản trị viên bị đánh cắp.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Lọc kết nối trong khoảng 1h đến 4h sáng (`STRFTIME(\'%H\', thoi_gian_vao) BETWEEN \'01\' AND \'03\'`).',
        hint: "SELECT * FROM nhat_ky_dang_nhap WHERE strftime('%H', thoi_gian_vao) BETWEEN '01' AND '03';"
      },
      {
        id: 2,
        text: 'Thêm điều kiện thời lượng kết nối ngắn dưới 120 giây.',
        hint: "SELECT tai_khoan, dia_chi_ip, thoi_gian_vao, thoi_luong_giay FROM nhat_ky_dang_nhap WHERE strftime('%H', thoi_gian_vao) BETWEEN '01' AND '03' AND thoi_luong_giay < 120;"
      }
    ],
    schemas: [
      {
        name: 'nhat_ky_dang_nhap',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã phiên' },
          { name: 'tai_khoan', type: 'TEXT', description: 'Tên tài khoản login' },
          { name: 'dia_chi_ip', type: 'TEXT', description: 'Địa chỉ IP terminal' },
          { name: 'thoi_gian_vao', type: 'TEXT', description: 'Thời điểm đăng nhập (YYYY-MM-DD HH:MM:SS)' },
          { name: 'thoi_luong_giay', type: 'INTEGER', description: 'Thời gian duy trì kết nối (giây)' }
        ]
      }
    ],
    starterQuery: `-- Lọc các phiên truy cập lúc 1h - 4h sáng và dưới 120 giây
SELECT tai_khoan, dia_chi_ip, thoi_gian_vao, thoi_luong_giay 
FROM nhat_ky_dang_nhap 
WHERE strftime('%H', thoi_gian_vao) BETWEEN '01' AND '03' 
  AND thoi_luong_giay < 120;`,
    seedSql: [
      `CREATE TABLE nhat_ky_dang_nhap (
        id INTEGER PRIMARY KEY,
        tai_khoan TEXT,
        dia_chi_ip TEXT,
        thoi_gian_vao TEXT,
        thoi_luong_giay INTEGER
      );`,
      `INSERT INTO nhat_ky_dang_nhap VALUES
        (1, 'admin_backup', '192.168.1.10', '1989-01-28 01:15:20', 3600),
        (2, 'sys_shadow', '10.0.0.99', '1989-01-28 02:40:10', 85),
        (3, 'operator_01', '192.168.1.15', '1989-01-28 08:30:00', 14400),
        (4, 'network_diag', '192.168.1.20', '1989-01-28 03:10:00', 450);`
    ],
    solution: {
      culprit: 'sys_shadow',
      successTitle: 'Truy Vết Thành Công!',
      successMessage: 'Tài khoản độc sys_shadow (IP: 10.0.0.99) đăng nhập lúc 02:40!',
      explanation: 'Tài khoản sys_shadow đăng nhập lúc 02:40:10 sáng và ngắt kết nối sau đúng 85 giây (< 120s), là hành vi cấy mã độc điển hình.',
      referenceQuery: `SELECT tai_khoan, dia_chi_ip FROM nhat_ky_dang_nhap WHERE strftime('%H', thoi_gian_vao) BETWEEN '01' AND '03' AND thoi_luong_giay < 120;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 28: Kẻ Xóa Dấu Vết
  // -----------------------------------------------------------------------
  {
    id: 'case-028',
    title: 'Vụ án 28: Kẻ Xóa Dấu Vết',
    slug: 'ke-xoa-dau-vet-audit-log',
    difficulty: 'nâng cao',
    category: 'Kiểm Toán Dữ Liệu: NOT EXISTS',
    xpReward: 500,
    timeEstimate: '20-25 phút',
    date: '02/02/1989',
    location: 'Tàng thư Hồ sơ Căn cước Tư pháp',
    brief: `Một cán bộ thoái hóa biến chất trong tàng thư tư pháp đã nhận tiền hối lộ để bí mật xóa sạch hồ sơ tiền án tiền sự của một tay trùm buôn lậu khét tiếng khỏi bảng 'ho_so_hinh_su'.
    
Kẻ gian không ngờ rằng hệ thống cơ sở dữ liệu có cơ chế ghi vết tự động ('audit_log'). Mọi thao tác đều được lưu lại. 
Hồ sơ bị xóa trái phép là hồ sơ CÓ mã trong 'audit_log' nhưng 'NOT EXISTS' (không còn tồn tại) trong bảng 'ho_so_hinh_su'. Hãy dùng toán tử 'NOT EXISTS' để vạch trần mã hồ sơ bị xóa và cán bộ đã thực hiện thao tác!`,
    clues: [
      'NOT EXISTS kiểm tra sự không tồn tại của bản ghi trong bảng chính.',
      'WHERE NOT EXISTS (SELECT 1 FROM ho_so_hinh_su hs WHERE hs.ma_ho_so = a.ma_ho_so).',
      'Cán bộ thực hiện lệnh DELETE lưu trong audit_log.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Tìm các mã hồ sơ có trong `audit_log` nhưng `NOT EXISTS` trong `ho_so_hinh_su`.',
        hint: "SELECT * FROM audit_log a WHERE NOT EXISTS (SELECT 1 FROM ho_so_hinh_su hs WHERE hs.ma_ho_so = a.ma_ho_so);"
      },
      {
        id: 2,
        text: 'Xác định cán bộ đã thực hiện lệnh xóa phi pháp này.',
        hint: "SELECT a.ma_ho_so, a.hanh_dong, a.can_bo_thao_tac, a.thoi_gian FROM audit_log a WHERE NOT EXISTS (SELECT 1 FROM ho_so_hinh_su hs WHERE hs.ma_ho_so = a.ma_ho_so);"
      }
    ],
    schemas: [
      {
        name: 'ho_so_hinh_su',
        columns: [
          { name: 'ma_ho_so', type: 'TEXT PRIMARY KEY', description: 'Mã hồ sơ án tích' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên đối tượng' },
          { name: 'toi_danh', type: 'TEXT', description: 'Tội danh tuyên án' }
        ]
      },
      {
        name: 'audit_log',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã log kiểm toán' },
          { name: 'ma_ho_so', type: 'TEXT', description: 'Mã hồ sơ tác động' },
          { name: 'hanh_dong', type: 'TEXT', description: 'INSERT / UPDATE / DELETE' },
          { name: 'can_bo_thao_tac', type: 'TEXT', description: 'Tên cán bộ thực hiện' },
          { name: 'thoi_gian', type: 'TEXT', description: 'Thời gian thao tác' }
        ],
        foreignKeys: [
          { fromColumn: 'ma_ho_so', toTable: 'ho_so_hinh_su', toColumn: 'ma_ho_so' }
        ]
      }
    ],
    starterQuery: `-- Sử dụng NOT EXISTS tìm hồ sơ đã bị xóa khỏi hệ thống
SELECT a.ma_ho_so, a.hanh_dong, a.can_bo_thao_tac, a.thoi_gian 
FROM audit_log a 
WHERE NOT EXISTS (
  SELECT 1 
  FROM ho_so_hinh_su hs 
  WHERE hs.ma_ho_so = a.ma_ho_so
);`,
    seedSql: [
      `CREATE TABLE ho_so_hinh_su (
        ma_ho_so TEXT PRIMARY KEY,
        ho_ten TEXT,
        toi_danh TEXT
      );`,
      `INSERT INTO ho_so_hinh_su VALUES
        ('HS-01', 'Lê Văn Tèo', 'Trộm cắp xe đạp'),
        ('HS-03', 'Nguyễn Thị Hoa', 'Buôn bán hàng cấm');`,
      `CREATE TABLE audit_log (
        id INTEGER PRIMARY KEY,
        ma_ho_so TEXT,
        hanh_dong TEXT,
        can_bo_thao_tac TEXT,
        thoi_gian TEXT
      );`,
      `INSERT INTO audit_log VALUES
        (1, 'HS-01', 'INSERT', 'Nguyễn Văn Minh', '1989-02-01 08:00'),
        (2, 'HS-02', 'DELETE', 'Trần Đình Trọng (Phó Phòng)', '1989-02-01 23:45'),
        (3, 'HS-03', 'INSERT', 'Nguyễn Văn Minh', '1989-02-02 09:15');`
    ],
    solution: {
      culprit: 'Trần Đình Trọng',
      successTitle: 'Vạch Mặt Kẻ Biến Chất!',
      successMessage: 'Trần Đình Trọng đã lén xóa hồ sơ HS-02 lúc nửa đêm!',
      explanation: 'Hồ sơ HS-02 có trong audit_log với hành động DELETE do Trần Đình Trọng thực hiện lúc 23:45 và hoàn toàn biến mất trong bảng ho_so_hinh_su (NOT EXISTS).',
      referenceQuery: `SELECT a.can_bo_thao_tac FROM audit_log a WHERE NOT EXISTS (SELECT 1 FROM ho_so_hinh_su hs WHERE hs.ma_ho_so = a.ma_ho_so);`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 29: Dòng Tiền Đa Cấp
  // -----------------------------------------------------------------------
  {
    id: 'case-029',
    title: 'Vụ án 29: Dòng Tiền Đa Cấp',
    slug: 'dong-tien-da-cap-recursive-cte',
    difficulty: 'nâng cao',
    category: 'Đệ Quy: Recursive CTE (WITH RECURSIVE)',
    xpReward: 500,
    timeEstimate: '25-30 phút',
    date: '05/02/1989',
    location: 'Mạng lưới tài chính ngầm Nam Kỳ',
    brief: `Số tiền 500 lượng vàng từ vụ cướp ngân hàng lớn đã bị phân tán qua một mạng lưới tài khoản trung gian tinh vi hình cây (A -> B -> C -> D -> Trùm Cuối). Mỗi lần chuyển khoản, kẻ chuyển đều dùng bí danh khác nhau để đánh lạc hướng cơ quan điều tra.
    
Tài khoản ban đầu của vụ cướp là 'TK_CUOP_01'. Bạn cần sử dụng truy vấn đệ quy 'WITH RECURSIVE' để lần theo chuỗi chuyển tiền 'tk_nguon = tk_dich' đến cấp độ 4 (depth = 4) để bắt tên Trùm cuối đang nắm giữ số tiền cướp!`,
    clues: [
      'Điểm xuất phát: tk_nguon = \'TK_CUOP_01\', cap_do = 1.',
      'Đệ quy: JOIN giao_dich_chuyen_tien g ON cte.tk_dich = g.tk_nguon.',
      'Dừng tại cap_do = 4 để lấy tài khoản và danh tính của Trùm Cuối.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Viết `WITH RECURSIVE` bắt đầu từ tài khoản nguồn \'TK_CUOP_01\'.',
        hint: "WITH RECURSIVE ChuoiTien AS (SELECT tk_nguon, tk_dich, 1 AS cap_do FROM giao_dich_chuyen_tien WHERE tk_nguon = 'TK_CUOP_01' UNION ALL SELECT g.tk_nguon, g.tk_dich, c.cap_do + 1 FROM giao_dich_chuyen_tien g JOIN ChuoiTien c ON g.tk_nguon = c.tk_dich WHERE c.cap_do < 4)"
      },
      {
        id: 2,
        text: 'Lấy thông tin tài khoản và chủ sở hữu ở cấp độ 4.',
        hint: "WITH RECURSIVE ChuoiTien AS (SELECT tk_nguon, tk_dich, 1 AS cap_do FROM giao_dich_chuyen_tien WHERE tk_nguon = 'TK_CUOP_01' UNION ALL SELECT g.tk_nguon, g.tk_dich, c.cap_do + 1 FROM giao_dich_chuyen_tien g JOIN ChuoiTien c ON g.tk_nguon = c.tk_dich WHERE c.cap_do < 4) SELECT c.cap_do, c.tk_dich, tk.chu_tk FROM ChuoiTien c JOIN tai_khoan tk ON c.tk_dich = tk.so_tk WHERE c.cap_do = 4;"
      }
    ],
    schemas: [
      {
        name: 'giao_dich_chuyen_tien',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã giao dịch' },
          { name: 'tk_nguon', type: 'TEXT', description: 'Tài khoản chuyển' },
          { name: 'tk_dich', type: 'TEXT', description: 'Tài khoản nhận' },
          { name: 'so_vang', type: 'INTEGER', description: 'Lượng vàng' }
        ],
        foreignKeys: [
          { fromColumn: 'tk_dich', toTable: 'tai_khoan', toColumn: 'so_tk' }
        ]
      },
      {
        name: 'tai_khoan',
        columns: [
          { name: 'so_tk', type: 'TEXT PRIMARY KEY', description: 'Số tài khoản' },
          { name: 'chu_tk', type: 'TEXT', description: 'Họ tên chủ tài khoản' }
        ]
      }
    ],
    starterQuery: `-- Truy vết chuỗi rửa tiền đa cấp bằng Recursive CTE
WITH RECURSIVE ChuoiTien AS (
  SELECT tk_nguon, tk_dich, 1 AS cap_do 
  FROM giao_dich_chuyen_tien 
  WHERE tk_nguon = 'TK_CUOP_01'
  
  UNION ALL
  
  SELECT g.tk_nguon, g.tk_dich, c.cap_do + 1 
  FROM giao_dich_chuyen_tien g 
  JOIN ChuoiTien c ON g.tk_nguon = c.tk_dich 
  WHERE c.cap_do < 4
)
SELECT c.cap_do, c.tk_nguon, c.tk_dich, tk.chu_tk 
FROM ChuoiTien c 
JOIN tai_khoan tk ON c.tk_dich = tk.so_tk;`,
    seedSql: [
      `CREATE TABLE giao_dich_chuyen_tien (
        id INTEGER PRIMARY KEY,
        tk_nguon TEXT,
        tk_dich TEXT,
        so_vang INTEGER
      );`,
      `INSERT INTO giao_dich_chuyen_tien VALUES
        (1, 'TK_CUOP_01', 'TK_F1_A', 500),
        (2, 'TK_F1_A', 'TK_F2_B', 500),
        (3, 'TK_F2_B', 'TK_F3_C', 500),
        (4, 'TK_F3_C', 'TK_BOSS_FINAL', 500);`,
      `CREATE TABLE tai_khoan (
        so_tk TEXT PRIMARY KEY,
        chu_tk TEXT
      );`,
      `INSERT INTO tai_khoan VALUES
        ('TK_CUOP_01', 'Tài khoản Vụ Cướp'),
        ('TK_F1_A', 'Nguyễn Tấn Đạt (Gạch nối 1)'),
        ('TK_F2_B', 'Lê Hữu Nghị (Gạch nối 2)'),
        ('TK_F3_C', 'Bùi Đình Cẩn (Gạch nối 3)'),
        ('TK_BOSS_FINAL', 'Tạ Bá Hào (Ông Trùm)');`
    ],
    solution: {
      culprit: 'Tạ Bá Hào',
      successTitle: 'Bắt Trọn Trùm Cuối!',
      successMessage: 'Tạ Bá Hào là điểm dừng cuối cùng của toàn bộ 500 lượng vàng!',
      explanation: 'Truy vấn Recursive CTE lần qua 4 mắt xích (TK_CUOP_01 -> TK_F1_A -> TK_F2_B -> TK_F3_C -> TK_BOSS_FINAL) dẫn thẳng đến tài khoản của Tạ Bá Hào.',
      referenceQuery: `WITH RECURSIVE ChuoiTien AS (SELECT tk_nguon, tk_dich, 1 AS cap_do FROM giao_dich_chuyen_tien WHERE tk_nguon = 'TK_CUOP_01' UNION ALL SELECT g.tk_nguon, g.tk_dich, c.cap_do + 1 FROM giao_dich_chuyen_tien g JOIN ChuoiTien c ON g.tk_nguon = c.tk_dich WHERE c.cap_do < 4) SELECT tk.chu_tk FROM ChuoiTien c JOIN tai_khoan tk ON c.tk_dich = tk.so_tk WHERE c.cap_do = 4;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 30: Chuyên Án Bóng Ma Ngầm (Boss Level)
  // -----------------------------------------------------------------------
  {
    id: 'case-030',
    title: 'Vụ án 30: Chuyên Án Bóng Ma Ngầm (Boss Level)',
    slug: 'chuyen-an-bong-ma-ngam-boss',
    difficulty: 'nâng cao',
    category: 'Đại Kết Cục: CTEs + Window Functions + Multi Join',
    xpReward: 1000,
    timeEstimate: '30-40 phút',
    date: '10/02/1989',
    location: 'Tổng hành dinh Cảnh sát Điều tra TP.HCM',
    brief: `Đây là trận đánh quyết định cuối cùng trong toàn bộ chiến dịch: Lật tẩy kẻ đứng đầu tổ chức tội phạm mang bí danh "Bóng Ma Ngầm" - kẻ thao túng toàn bộ thế giới ngầm suốt nhiều năm qua.
    
Hồ sơ tình báo tuyệt mật đưa ra 3 điều kiện nhận diện ông trùm:
1. **CTE Tài Chính:** Đứng TOP 1 về tổng số tiền nhận từ các giao dịch ngầm ('RANK() OVER (ORDER BY SUM(so_tien) DESC) = 1').
2. **CTE Liên Lạc:** Đã thực hiện cuộc gọi chỉ đạo đến ít nhất 3 đàn em khác nhau ('COUNT(DISTINCT so_nhan) >= 3').
3. **Vỏ Bọc Hợp Pháp:** Trong danh bạ công dân, hắn đội lốt một 'Thương nhân' hoặc 'Luật sư'.
Hãy viết câu lệnh SQL tối thượng kết hợp toàn bộ kỹ năng đỉnh cao để phá đảo trò chơi!`,
    clues: [
      'CTE1: Tính tổng tiền nhận và xếp hạng RANK() Top 1.',
      'CTE2: Gom nhóm cuộc gọi và đếm COUNT(DISTINCT so_nhan) >= 3.',
      'JOIN 2 CTE với danh_ba_cong_dan và lọc nghe_nghiep IN (\'Thương nhân\', \'Luật sư\').'
    ],
    objectives: [
      {
        id: 1,
        text: 'Tạo CTE1 Tài chính: Tính tổng tiền và dùng `RANK()` tìm top 1 thu nhập ngầm.',
        hint: "WITH TaiChinh AS (SELECT nguoi_nhan_id, RANK() OVER (ORDER BY SUM(so_tien) DESC) as rank_tien FROM giao_dich_ngam GROUP BY nguoi_nhan_id)"
      },
      {
        id: 2,
        text: 'Tạo CTE2 Liên lạc: Tìm người gọi chỉ đạo `>= 3` đàn em khác nhau.',
        hint: "LienLac AS (SELECT nguoi_goi_id FROM cuoc_goi GROUP BY nguoi_goi_id HAVING COUNT(DISTINCT so_nhan) >= 3)"
      },
      {
        id: 3,
        text: '`JOIN` chốt hạ với bảng `danh_ba_cong_dan` để vạch trần Trùm Bóng Ma Ngầm!',
        hint: "SELECT cd.ho_ten, cd.nghe_nghiep, cd.dia_chi FROM TaiChinh tc JOIN LienLac ll ON tc.nguoi_nhan_id = ll.nguoi_goi_id JOIN danh_ba_cong_dan cd ON tc.nguoi_nhan_id = cd.id WHERE tc.rank_tien = 1 AND (cd.nghe_nghiep LIKE '%Thương nhân%' OR cd.nghe_nghiep LIKE '%Luật sư%');"
      }
    ],
    schemas: [
      {
        name: 'giao_dich_ngam',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã giao dịch' },
          { name: 'nguoi_nhan_id', type: 'INTEGER', description: 'ID người nhận tiền' },
          { name: 'so_tien', type: 'INTEGER', description: 'Số tiền giao dịch (USD)' }
        ],
        foreignKeys: [
          { fromColumn: 'nguoi_nhan_id', toTable: 'danh_ba_cong_dan', toColumn: 'id' }
        ]
      },
      {
        name: 'cuoc_goi',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã cuộc gọi' },
          { name: 'nguoi_goi_id', type: 'INTEGER', description: 'ID người thực hiện cuộc gọi' },
          { name: 'so_nhan', type: 'TEXT', description: 'Số điện thoại đàn em' }
        ],
        foreignKeys: [
          { fromColumn: 'nguoi_goi_id', toTable: 'danh_ba_cong_dan', toColumn: 'id' }
        ]
      },
      {
        name: 'danh_ba_cong_dan',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã công dân' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên' },
          { name: 'nghe_nghiep', type: 'TEXT', description: 'Nghề nghiệp đăng ký' },
          { name: 'dia_chi', type: 'TEXT', description: 'Địa chỉ cư trú' }
        ]
      }
    ],
    starterQuery: `-- CÂU LỆNH TỐI THƯỢNG: Phá đảo chuyên án Bóng Ma Ngầm
WITH 
TaiChinh AS (
  SELECT nguoi_nhan_id, 
         SUM(so_tien) AS tong_thu_nhap,
         RANK() OVER (ORDER BY SUM(so_tien) DESC) AS rank_tien 
  FROM giao_dich_ngam 
  GROUP BY nguoi_nhan_id
),
LienLac AS (
  SELECT nguoi_goi_id, 
         COUNT(DISTINCT so_nhan) AS so_dan_em 
  FROM cuoc_goi 
  GROUP BY nguoi_goi_id 
  HAVING COUNT(DISTINCT so_nhan) >= 3
)
SELECT cd.id, cd.ho_ten, cd.nghe_nghiep, cd.dia_chi, 
       tc.tong_thu_nhap, ll.so_dan_em 
FROM TaiChinh tc 
JOIN LienLac ll ON tc.nguoi_nhan_id = ll.nguoi_goi_id 
JOIN danh_ba_cong_dan cd ON tc.nguoi_nhan_id = cd.id 
WHERE tc.rank_tien = 1 
  AND (cd.nghe_nghiep LIKE '%Thương nhân%' OR cd.nghe_nghiep LIKE '%Luật sư%');`,
    seedSql: [
      `CREATE TABLE giao_dich_ngam (
        id INTEGER PRIMARY KEY,
        nguoi_nhan_id INTEGER,
        so_tien INTEGER
      );`,
      `INSERT INTO giao_dich_ngam VALUES
        (1, 101, 150000),
        (2, 102, 280000),
        (3, 101, 450000),
        (4, 103, 120000),
        (5, 102, 190000);`,
      `CREATE TABLE cuoc_goi (
        id INTEGER PRIMARY KEY,
        nguoi_goi_id INTEGER,
        so_nhan TEXT
      );`,
      `INSERT INTO cuoc_goi VALUES
        (1, 101, '090111111'),
        (2, 101, '090222222'),
        (3, 101, '090333333'),
        (4, 101, '090444444'),
        (5, 102, '090111111'),
        (6, 102, '090222222'),
        (7, 103, '090555555');`,
      `CREATE TABLE danh_ba_cong_dan (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        nghe_nghiep TEXT,
        dia_chi TEXT
      );`,
      `INSERT INTO danh_ba_cong_dan VALUES
        (101, 'Hàn Thế Long', 'Thương nhân Cổ phần Vận tải', 'Dinh Thự số 1 Bến Vân Đồn, Q4'),
        (102, 'Vũ Bá Thông', 'Chủ gara xe hơi', 'Nguyễn Biểu, Q5'),
        (103, 'Đỗ Hoàng Dũng', 'Môi giới chứng khoán', 'Hàm Nghi, Q1');`
    ],
    solution: {
      culprit: 'Hàn Thế Long',
      successTitle: 'CHÚC MỪNG BẬC THẦY SQL THÁM TỬ!',
      successMessage: 'Bạn đã phá đảo toàn bộ 30 vụ án và bắt gọn Trùm Bóng Ma Hàn Thế Long!',
      explanation: 'Hàn Thế Long (id = 101) thu về 600.000 USD (Rank 1 toàn thành phố), chỉ đạo 4 đàn em khác nhau và đội lốt một thương nhân danh tiếng. Bạn chính thức đạt danh hiệu THẦN THÁM BẬC THẦY!',
      referenceQuery: `WITH TaiChinh AS (SELECT nguoi_nhan_id, RANK() OVER (ORDER BY SUM(so_tien) DESC) as rk FROM giao_dich_ngam GROUP BY nguoi_nhan_id), LienLac AS (SELECT nguoi_goi_id FROM cuoc_goi GROUP BY nguoi_goi_id HAVING COUNT(DISTINCT so_nhan) >= 3) SELECT cd.ho_ten FROM TaiChinh tc JOIN LienLac ll ON tc.nguoi_nhan_id = ll.nguoi_goi_id JOIN danh_ba_cong_dan cd ON tc.nguoi_nhan_id = cd.id WHERE tc.rk = 1 AND (cd.nghe_nghiep LIKE '%Thương nhân%' OR cd.nghe_nghiep LIKE '%Luật sư%');`
    }
  }
];
