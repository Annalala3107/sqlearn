import { DetectiveCase } from './types';

// =========================================================================
// 🟢 CẤP ĐỘ 1: DỄ - THÁM TỬ TẬP SỰ (10 VỤ ÁN)
// Kỹ năng: SELECT, WHERE, LIKE, AND/OR, ORDER BY, LIMIT, BETWEEN, IS NULL...
// =========================================================================

export const level1Cases: DetectiveCase[] = [
  // -----------------------------------------------------------------------
  // VỤ ÁN 01: Chiếc Cặp Mất Tích Tại Quán Bar Đêm
  // -----------------------------------------------------------------------
  {
    id: 'case-001',
    title: 'Vụ án 01: Chiếc Cặp Mất Tích Tại Quán Bar Đêm',
    slug: 'chiec-cap-mat-tich-quan-bar',
    difficulty: 'dễ',
    category: 'Cơ Bản: SELECT, WHERE, LIKE',
    xpReward: 100,
    timeEstimate: '10-15 phút',
    date: '20/11/1988',
    location: 'Quán bar Đêm Không Ngủ, Quận 1',
    brief: `Đêm 20/11/1988, tại quán bar "Đêm Không Ngủ", chiếc cặp da đen chứa tài liệu mật của tập đoàn Viễn Đông bị mất cắp. Nhân chứng là người pha chế cho biết một gã đàn ông mặc áo măng tô sẫm màu, có vết sẹo đặc trưng trên mặt vội vã rời đi qua cửa sau lúc 22:00.
    
Nhiệm vụ của bạn: Tra cứu hiện trường vụ án, truy quét danh sách nghi phạm mang áo măng tô và có vết sẹo, sau đó kiểm tra biên bản lời khai để lật tẩy thủ phạm.`,
    clues: [
      'Hiện trường ghi nhận vụ trộm tại địa điểm có tên liên quan đến quán bar.',
      'Kẻ trộm mặc áo măng tô và có vết sẹo nhận dạng trên mặt.',
      'Biên bản lời khai của kẻ tình nghi thể hiện sự lúng túng khi nhắc đến chiếc cặp.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Tìm bản ghi hiện trường vụ trộm tại quán bar trong bảng `hien_truong` (`WHERE dia_diem LIKE \'%Quán bar%\'`).',
        hint: "SELECT * FROM hien_truong WHERE dia_diem LIKE '%Quán bar%';"
      },
      {
        id: 2,
        text: 'Lọc danh sách `nghi_pham` có `trang_phuc` chứa \'áo măng tô\' và `dac_diem_nhan_dang` chứa \'vết sẹo\'.',
        hint: "SELECT * FROM nghi_pham WHERE trang_phuc LIKE '%măng tô%' AND dac_diem_nhan_dang LIKE '%vết sẹo%';"
      },
      {
        id: 3,
        text: 'Xem `loi_khai` của nghi phạm khớp nhất để xác nhận hành vi trộm cắp.',
        hint: "SELECT * FROM loi_khai WHERE nghi_pham_id = 4;"
      }
    ],
    schemas: [
      {
        name: 'hien_truong',
        description: 'Hồ sơ ghi nhận hiện trường các vụ án',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã hồ sơ' },
          { name: 'ngay', type: 'TEXT', description: 'Ngày xảy ra' },
          { name: 'loai_an', type: 'TEXT', description: 'Loại án' },
          { name: 'dia_diem', type: 'TEXT', description: 'Địa điểm' },
          { name: 'mo_ta', type: 'TEXT', description: 'Mô tả hiện trường' }
        ]
      },
      {
        name: 'nghi_pham',
        description: 'Hồ sơ nhân thân các đối tượng tình nghi',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã nghi phạm' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên' },
          { name: 'gioi_tinh', type: 'TEXT', description: 'Giới tính' },
          { name: 'chieu_cao', type: 'INTEGER', description: 'Chiều cao (cm)' },
          { name: 'trang_phuc', type: 'TEXT', description: 'Trang phục lúc gây án' },
          { name: 'dac_diem_nhan_dang', type: 'TEXT', description: 'Đặc điểm nhận diện' }
        ]
      },
      {
        name: 'loi_khai',
        description: 'Biên bản thẩm vấn nghi phạm',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã biên bản' },
          { name: 'nghi_pham_id', type: 'INTEGER', description: 'Khóa ngoại trỏ đến nghi_pham(id)' },
          { name: 'noi_dung_loi_khai', type: 'TEXT', description: 'Lời khai của đối tượng' }
        ],
        foreignKeys: [{ fromColumn: 'nghi_pham_id', toTable: 'nghi_pham', toColumn: 'id' }]
      }
    ],
    starterQuery: `-- Bắt đầu điều tra: Khảo sát hiện trường vụ án tại quán bar
SELECT * FROM hien_truong WHERE dia_diem LIKE '%Quán bar%';`,
    seedSql: [
      `CREATE TABLE hien_truong (
        id INTEGER PRIMARY KEY,
        ngay TEXT,
        loai_an TEXT,
        dia_diem TEXT,
        mo_ta TEXT
      );`,
      `INSERT INTO hien_truong VALUES 
        (1, '1988-11-18', 'Trộm cắp', 'Khách sạn Caravelle', 'Mất một vòng ngọc bích trong phòng 304.'),
        (2, '1988-11-19', 'Ẩu đả', 'Bến cảng Bạch Đằng', 'Xô xát giành kiện hàng lậu.'),
        (3, '1988-11-20', 'Trộm cắp', 'Quán bar Đêm Không Ngủ', 'Một chiếc cặp da đen tài liệu mật bị lấy mất lúc 22:00. Kẻ trộm mặc áo măng tô sẫm màu, có vết sẹo dài bên má tháo chạy qua cửa sau.'),
        (4, '1988-11-20', 'Cướp giật', 'Đường Đồng Khởi', 'Giật túi xách.');`,
      `CREATE TABLE nghi_pham (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        gioi_tinh TEXT,
        chieu_cao INTEGER,
        trang_phuc TEXT,
        dac_diem_nhan_dang TEXT
      );`,
      `INSERT INTO nghi_pham VALUES
        (1, 'Trần Minh Tâm', 'Nam', 170, 'Áo sơ mi trắng', 'Đeo kính cận, nốt ruồi cằm'),
        (2, 'Lê Hoàng Phong', 'Nam', 178, 'Áo khoác da đen', 'Hình xăm rồng trên cổ'),
        (3, 'Nguyễn Thị Mai', 'Nữ', 165, 'Đầm dạ hội đỏ', 'Tóc xoăn nâu'),
        (4, 'Vũ Đình Trọng', 'Nam', 176, 'Áo măng tô sẫm màu', 'Vết sẹo dài bên má trái'),
        (5, 'Đặng Quốc Huy', 'Nam', 168, 'Áo len xám', 'Mắt một mí, có ria mép');`,
      `CREATE TABLE loi_khai (
        id INTEGER PRIMARY KEY,
        nghi_pham_id INTEGER,
        noi_dung_loi_khai TEXT
      );`,
      `INSERT INTO loi_khai VALUES
        (1, 1, 'Tôi ngồi uống rượu ở quầy bar với bạn từ 20h đến 23h, không hề rời chỗ.'),
        (2, 2, 'Tôi chỉ ghé mua bao thuốc lá rồi đi ngay lúc 21h30.'),
        (3, 3, 'Tôi đi cùng bạn trai đến nghe nhạc Jazz.'),
        (4, 4, 'Tôi có vào quán lúc 21h45. Nhưng lúc 22h tôi chỉ vội ra lấy xe... Thề là tôi không biết cái cặp da đen nào hết! Tại sao các anh lại hỏi về cái cặp da màu đen?!'),
        (5, 5, 'Tôi làm bảo vệ ca đêm tại đây.');`
    ],
    solution: {
      culprit: 'Vũ Đình Trọng',
      successTitle: 'Phá Án Thành Công!',
      successMessage: 'Vũ Đình Trọng chính là kẻ trộm chiếc cặp da đen!',
      explanation: 'Vũ Đình Trọng khớp chính xác nhận dạng mặc áo măng tô và có vết sẹo bên má. Trong lời khai, hắn tự "lạy ông tôi ở bụi này" khi thốt lên: "Tại sao các anh lại hỏi về cái cặp da màu đen?!" dù cảnh sát chưa hề tiết lộ màu sắc chiếc cặp bị mất.',
      referenceQuery: `SELECT np.ho_ten, np.trang_phuc, np.dac_diem_nhan_dang, lk.noi_dung_loi_khai
FROM nghi_pham np
JOIN loi_khai lk ON np.id = lk.nghi_pham_id
WHERE np.trang_phuc LIKE '%măng tô%' AND np.dac_diem_nhan_dang LIKE '%vết sẹo%';`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 02: Vòng Ngọc Bích Ở Khách Sạn Caravelle
  // -----------------------------------------------------------------------
  {
    id: 'case-002',
    title: 'Vụ án 02: Vòng Ngọc Bích Ở Khách Sạn Caravelle',
    slug: 'vong-ngoc-bich-caravelle',
    difficulty: 'dễ',
    category: 'So Sánh: =, >, <, AND',
    xpReward: 100,
    timeEstimate: '10-15 phút',
    date: '18/11/1988',
    location: 'Khách sạn Caravelle, Phòng VIP 304',
    brief: `Đêm ngày 18/11/1988, chiếc vòng ngọc bích gia bảo trị giá hàng trăm lượng vàng của nữ minh tinh Hồng Kông lưu trú tại phòng VIP 304 khách sạn Caravelle đã bị đánh cắp. 
    
Bảo vệ khách sạn phát hiện cửa sổ ban công bị cạy và có camera hành lang ghi lại bóng dáng thủ phạm là một phụ nữ có vóc dáng rất cao (trên 1m68). Hãy truy vấn dữ liệu hiện trường và lọc danh sách nghi phạm nữ cao trên 1m68 để tìm ra thủ phạm.`,
    clues: [
      'Vụ án diễn ra vào ngày 1988-11-18 tại Khách sạn Caravelle.',
      'Thủ phạm là Nữ và có chiều cao trên 1m68.',
      'Chỉ có một nữ nghi phạm cao vượt trội khớp hoàn toàn với camera hành lang.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Lấy thông tin từ `hien_truong` vào ngày \'1988-11-18\'.',
        hint: "SELECT * FROM hien_truong WHERE ngay = '1988-11-18';"
      },
      {
        id: 2,
        text: 'Truy vấn `nghi_pham` với điều kiện `gioi_tinh = \'Nữ\' AND chieu_cao > 168`.',
        hint: "SELECT * FROM nghi_pham WHERE gioi_tinh = 'Nữ' AND chieu_cao > 168;"
      }
    ],
    schemas: [
      {
        name: 'hien_truong',
        description: 'Nhật ký các vụ án',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã' },
          { name: 'ngay', type: 'TEXT', description: 'Ngày xảy ra' },
          { name: 'dia_diem', type: 'TEXT', description: 'Khách sạn/Địa điểm' },
          { name: 'mo_ta', type: 'TEXT', description: 'Ghi chép khám nghiệm' }
        ]
      },
      {
        name: 'nghi_pham',
        description: 'Danh sách khách lưu trú khả nghi',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã nghi phạm' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên đối tượng' },
          { name: 'gioi_tinh', type: 'TEXT', description: 'Giới tính' },
          { name: 'chieu_cao', type: 'INTEGER', description: 'Chiều cao (cm)' },
          { name: 'phong_o', type: 'TEXT', description: 'Số phòng lưu trú' }
        ]
      }
    ],
    starterQuery: `-- Kiểm tra hiện trường ngày 18/11/1988
SELECT * FROM hien_truong WHERE ngay = '1988-11-18';`,
    seedSql: [
      `CREATE TABLE hien_truong (
        id INTEGER PRIMARY KEY,
        ngay TEXT,
        dia_diem TEXT,
        mo_ta TEXT
      );`,
      `INSERT INTO hien_truong VALUES
        (1, '1988-11-18', 'Khách sạn Caravelle', 'Mất một vòng ngọc bích trong phòng VIP 304. Camera sảnh lầu 3 thấy một phụ nữ dáng cao trên 1m68 lén vào ban công.');`,
      `CREATE TABLE nghi_pham (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        gioi_tinh TEXT,
        chieu_cao INTEGER,
        phong_o TEXT
      );`,
      `INSERT INTO nghi_pham VALUES
        (1, 'Lý Tiểu Lan', 'Nữ', 160, 'Phòng 301'),
        (2, 'Trương Thúy Nga', 'Nữ', 172, 'Phòng 306'),
        (3, 'Đỗ Mạnh Cường', 'Nam', 175, 'Phòng 308'),
        (4, 'Phạm Kim Chi', 'Nữ', 165, 'Phòng 302'),
        (5, 'Hoàng Nhật Minh', 'Nam', 180, 'Phòng 305');`
    ],
    solution: {
      culprit: 'Trương Thúy Nga',
      successTitle: 'Bắt Đúng Thủ Phạm!',
      successMessage: 'Trương Thúy Nga đã bị bắt giữ cùng tang vật chiếc vòng ngọc bích!',
      explanation: 'Truy vấn `SELECT * FROM nghi_pham WHERE gioi_tinh = \'Nữ\' AND chieu_cao > 168;` trả về duy nhất Trương Thúy Nga (172cm), ở phòng 306 đối diện phòng nạn nhân.',
      referenceQuery: `SELECT * FROM nghi_pham WHERE gioi_tinh = 'Nữ' AND chieu_cao > 168;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 03: Bóng Đen Đường Đồng Khởi
  // -----------------------------------------------------------------------
  {
    id: 'case-003',
    title: 'Vụ án 03: Bóng Đen Đường Đồng Khởi',
    slug: 'bong-den-dong-khoi',
    difficulty: 'dễ',
    category: 'Tập Hợp: IN, NOT, OR',
    xpReward: 100,
    timeEstimate: '10-15 phút',
    date: '20/11/1988',
    location: 'Góc đường Đồng Khởi - Lê Lợi, Quận 1',
    brief: `Vụ cướp giật túi xách táo tợn xảy ra trước cửa tiệm may lúc chập tối. Nạn nhân kịp nhìn thấy kẻ cướp tẩu thoát trên một chiếc xe máy số: hoặc xe Honda Dream, hoặc Honda Cub 81. Đặc biệt, nhân chứng khẳng định chắc chắn chiếc xe KHÔNG phải màu xanh.
    
Hãy tra cứu bảng phương tiện để tìm ra chiếc xe gây án và chủ nhân đứng tên!`,
    clues: [
      'Loại xe gây án nằm trong danh sách: Dream hoặc Cub 81.',
      'Màu xe khác màu Xanh (NOT Xanh).',
      'Chủ xe có tiền án cướp giật trên địa bàn.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Lọc bảng `phuong_tien` với điều kiện `loai_xe IN (\'Dream\', \'Cub 81\')`.',
        hint: "SELECT * FROM phuong_tien WHERE loai_xe IN ('Dream', 'Cub 81');"
      },
      {
        id: 2,
        text: 'Thêm điều kiện `mau_xe != \'Xanh\'` (hoặc NOT) để tìm chiếc xe nghi vấn nhất.',
        hint: "SELECT * FROM phuong_tien WHERE loai_xe IN ('Dream', 'Cub 81') AND mau_xe != 'Xanh';"
      }
    ],
    schemas: [
      {
        name: 'phuong_tien',
        description: 'Đăng ký xe lưu thông khu vực xảy ra vụ án',
        columns: [
          { name: 'bien_so', type: 'TEXT PRIMARY KEY', description: 'Biển kiểm soát' },
          { name: 'chu_xe', type: 'TEXT', description: 'Tên chủ xe' },
          { name: 'loai_xe', type: 'TEXT', description: 'Dòng xe (Dream, Cub 81, Vespa...)' },
          { name: 'mau_xe', type: 'TEXT', description: 'Màu sơn' }
        ]
      }
    ],
    starterQuery: `-- Truy vấn phương tiện nghi vấn
SELECT * FROM phuong_tien WHERE loai_xe IN ('Dream', 'Cub 81');`,
    seedSql: [
      `CREATE TABLE phuong_tien (
        bien_so TEXT PRIMARY KEY,
        chu_xe TEXT,
        loai_xe TEXT,
        mau_xe TEXT
      );`,
      `INSERT INTO phuong_tien VALUES
        ('51A-1234', 'Nguyễn Tấn Đạt', 'Dream', 'Xanh'),
        ('52B-5678', 'Bùi Văn Hùng', 'Cub 81', 'Đỏ Đun'),
        ('51C-9999', 'Trần Thế Vinh', 'Vespa', 'Trắng'),
        ('53D-4321', 'Vũ Quốc Bảo', 'Cub 81', 'Xanh'),
        ('52E-8888', 'Lê Công Thành', 'Simson', 'Vàng');`
    ],
    solution: {
      culprit: 'Bùi Văn Hùng',
      successTitle: 'Lần Ra Dấu Vết!',
      successMessage: 'Đã bắt giữ Bùi Văn Hùng cùng chiếc xe Cub 81 màu Đỏ Đun!',
      explanation: 'Trong số các xe Dream và Cub 81, chỉ có chiếc Cub 81 biển 52B-5678 của Bùi Văn Hùng mang màu Đỏ Đun (khác màu Xanh). Kiểm tra cốp xe thu giữ được túi xách của nạn nhân.',
      referenceQuery: `SELECT * FROM phuong_tien WHERE loai_xe IN ('Dream', 'Cub 81') AND mau_xe != 'Xanh';`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 04: Kẻ Lừa Đảo Ga Sài Gòn
  // -----------------------------------------------------------------------
  {
    id: 'case-004',
    title: 'Vụ án 04: Kẻ Lừa Đảo Ga Sài Gòn',
    slug: 'lua-dao-ga-sai-gon',
    difficulty: 'dễ',
    category: 'Mẫu Ký Tự: LIKE (T__g)',
    xpReward: 100,
    timeEstimate: '10-15 phút',
    date: '22/11/1988',
    location: 'Quảng trường Ga Sài Gòn, Quận 3',
    brief: `Một đường dây bán vé tàu hỏa giả vừa bị phanh phui tại ga Sài Gòn. Nhiều hành khách nghèo mua phải vé giả không được lên tàu. Theo lời khai của một nạn nhân, tên cò mồi có đưa chứng minh thư và xưng tên là một từ 4 chữ cái, bắt đầu bằng chữ 'T' và kết thúc bằng chữ 'g' (Ví dụ: Tùng, Tăng...). 
    
Hãy dùng toán tử 'LIKE' với ký tự đại diện gạch dưới '_' để khoanh vùng kẻ lừa đảo này!`,
    clues: [
      'Tên nghi phạm có đúng 4 chữ cái.',
      'Ký tự đầu là T, ký tự cuối là g (dạng T__g).',
      'Hắn thường xuyên xuất hiện ở phòng vé số 2.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Lọc bảng `nghi_pham` với điều kiện `ten LIKE \'T__g\'`.',
        hint: "SELECT * FROM nghi_pham WHERE ten LIKE 'T__g';"
      },
      {
        id: 2,
        text: 'Trích xuất thông tin quê quán và tiền án của hắn.',
        hint: "SELECT ho_ten, que_quan, tien_an FROM nghi_pham WHERE ten LIKE 'T__g';"
      }
    ],
    schemas: [
      {
        name: 'nghi_pham',
        description: 'Danh sách các đối tượng môi giới tại ga',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên đầy đủ' },
          { name: 'ten', type: 'TEXT', description: 'Tên gọi' },
          { name: 'que_quan', type: 'TEXT', description: 'Quê quán' },
          { name: 'tien_an', type: 'TEXT', description: 'Hồ sơ tiền án' }
        ]
      }
    ],
    starterQuery: `-- Lọc các đối tượng có tên 4 chữ cái bắt đầu bằng T, kết thúc bằng g
SELECT * FROM nghi_pham WHERE ten LIKE 'T__g';`,
    seedSql: [
      `CREATE TABLE nghi_pham (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        ten TEXT,
        que_quan TEXT,
        tien_an TEXT
      );`,
      `INSERT INTO nghi_pham VALUES
        (1, 'Đinh Xuân Thành', 'Thành', 'Hải Phòng', 'Không'),
        (2, 'Nguyễn Văn Tùng', 'Tùng', 'Nam Định', 'Lừa đảo vé tàu năm 1986'),
        (3, 'Lê Quốc Thắng', 'Thắng', 'Thanh Hóa', 'Trộm cắp vặt'),
        (4, 'Phạm Anh Tuấn', 'Tuấn', 'Hà Nội', 'Không'),
        (5, 'Trần Khắc Trung', 'Trung', 'Nghệ An', 'Gây rối trật tự');`
    ],
    solution: {
      culprit: 'Nguyễn Văn Tùng',
      successTitle: 'Lật Tẩy Cò Vé!',
      successMessage: 'Kẻ bán vé giả Nguyễn Văn Tùng đã bị bắt tại cửa ga!',
      explanation: 'Trong số các nghi phạm, chỉ có "Tùng" có đúng 4 chữ cái thỏa mãn `LIKE \'T__g\'` (2 chữ cái ở giữa), đồng thời từng có tiền án lừa đảo vé tàu.',
      referenceQuery: `SELECT * FROM nghi_pham WHERE ten LIKE 'T__g';`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 05: Cuộc Ẩu Đả Bến Bạch Đằng
  // -----------------------------------------------------------------------
  {
    id: 'case-005',
    title: 'Vụ án 05: Cuộc Ẩu Đả Bến Bạch Đằng',
    slug: 'au-da-ben-bach-dang',
    difficulty: 'dễ',
    category: 'Khoảng Giá Trị: BETWEEN',
    xpReward: 100,
    timeEstimate: '10-15 phút',
    date: '19/11/1988',
    location: 'Cầu cảng số 3, Bến Bạch Đằng',
    brief: `Vào lúc nửa đêm tại Bến Bạch Đằng xảy ra một vụ ẩu đả kịch liệt giữa hai nhóm bốc vác nhằm tranh giành một kiện hàng lậu vừa được bốc dỡ từ tàu biển nước ngoài. 
    
Nguồn tin trinh sát cho hay kiện hàng chứa súng ngắn và kim loại quý, có trọng lượng ước tính trong khoảng từ 50kg đến 80kg và được xuất kho ngay trong đêm xảy ra vụ ẩu đả. Hãy tra cứu nhật ký kho để tìm ra kiện hàng và người ký nhận!`,
    clues: [
      'Kiện hàng có trọng lượng nằm trong khoảng từ 50kg đến 80kg (BETWEEN 50 AND 80).',
      'Người ký nhận kiện hàng này là kẻ đầu sỏ tổ chức vụ ẩu đả.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Tra cứu `nhat_ky_kho` tìm các kiện hàng có `trong_luong BETWEEN 50 AND 80`.',
        hint: "SELECT * FROM nhat_ky_kho WHERE trong_luong BETWEEN 50 AND 80;"
      },
      {
        id: 2,
        text: 'Lấy tên người ký nhận và số hiệu kiện hàng.',
        hint: "SELECT ma_kien, ten_hang, trong_luong, nguoi_ky_nhan FROM nhat_ky_kho WHERE trong_luong BETWEEN 50 AND 80;"
      }
    ],
    schemas: [
      {
        name: 'nhat_ky_kho',
        description: 'Sổ lưu chuyển hàng hóa tại cầu cảng',
        columns: [
          { name: 'ma_kien', type: 'TEXT PRIMARY KEY', description: 'Mã kiện hàng' },
          { name: 'ten_hang', type: 'TEXT', description: 'Khai báo tên hàng' },
          { name: 'trong_luong', type: 'REAL', description: 'Trọng lượng (kg)' },
          { name: 'nguoi_ky_nhan', type: 'TEXT', description: 'Người ký nhận xuất kho' },
          { name: 'gio_xuat', type: 'TEXT', description: 'Giờ xuất hàng' }
        ]
      }
    ],
    starterQuery: `-- Tìm kiện hàng có trọng lượng từ 50kg đến 80kg
SELECT * FROM nhat_ky_kho WHERE trong_luong BETWEEN 50 AND 80;`,
    seedSql: [
      `CREATE TABLE nhat_ky_kho (
        ma_kien TEXT PRIMARY KEY,
        ten_hang TEXT,
        trong_luong REAL,
        nguoi_ky_nhan TEXT,
        gio_xuat TEXT
      );`,
      `INSERT INTO nhat_ky_kho VALUES
        ('PKG-01', 'Vải sợi bông', 120.5, 'Lâm Bốc Vác', '21:30'),
        ('PKG-02', 'Linh kiện máy may', 68.0, 'Trần Búa Tạ', '23:45'),
        ('PKG-03', 'Hạt cà phê', 250.0, 'Ngô Văn Tàu', '22:15'),
        ('PKG-04', 'Đồ sành sứ mỹ nghệ', 42.0, 'Đặng Cò Mồi', '20:00'),
        ('PKG-05', 'Dầu dừa đóng thùng', 95.0, 'Lê Văn Bảy', '23:10');`
    ],
    solution: {
      culprit: 'Trần Búa Tạ',
      successTitle: 'Bắt Trọn Kiện Hàng!',
      successMessage: 'Trần Búa Tạ đã bị bắt khi đang áp tải kiện hàng PKG-02!',
      explanation: 'Kiện hàng PKG-02 nặng 68.0 kg (nằm trọn trong khoảng BETWEEN 50 AND 80) do trùm giang hồ cảng "Trần Búa Tạ" ký nhận xuất kho lúc 23:45 ngay trước vụ ẩu đả.',
      referenceQuery: `SELECT * FROM nhat_ky_kho WHERE trong_luong BETWEEN 50 AND 80;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 06: Dấu Vết Kho Vàng Đông Dương
  // -----------------------------------------------------------------------
  {
    id: 'case-006',
    title: 'Vụ án 06: Dấu Vết Kho Vàng Đông Dương',
    slug: 'kho-vang-dong-duong',
    difficulty: 'dễ',
    category: 'Sắp Xếp & Giới Hạn: ORDER BY, LIMIT',
    xpReward: 100,
    timeEstimate: '10-15 phút',
    date: '21/11/1988',
    location: 'Ngân hàng Đông Dương, Quận 1',
    brief: `Rạng sáng ngày 21/11, bảo vệ phát hiện có dấu hiệu cạy phá két phụ kho vàng tại cửa số 'KHO_01'. Đầu đọc thẻ từ cửa lưu lại toàn bộ thời gian quẹt thẻ của nhân viên. 
    
Kẻ đột nhập chắc chắn là một trong 3 người quẹt thẻ vào kho muộn nhất trước khi hệ thống báo động kích hoạt lúc 02:00 sáng. Hãy dùng 'ORDER BY' và 'LIMIT 3' để lọc ra 3 người cuối cùng này!`,
    clues: [
      'Cửa kho bị đột nhập có mã là KHO_01.',
      'Sắp xếp thời gian quẹt thẻ giảm dần (mới nhất lên đầu) và lấy 3 người sau cùng.',
      'Kẻ khả nghi nhất trong 3 người có hành vi bất minh.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Truy vấn `nhat_ky_the_tu` tại cửa \'KHO_01\'.',
        hint: "SELECT * FROM nhat_ky_the_tu WHERE ma_cua = 'KHO_01';"
      },
      {
        id: 2,
        text: 'Sắp xếp `thoi_gian_quet DESC` và lấy `LIMIT 3` để tìm 3 người cuối cùng vào kho.',
        hint: "SELECT * FROM nhat_ky_the_tu WHERE ma_cua = 'KHO_01' ORDER BY thoi_gian_quet DESC LIMIT 3;"
      }
    ],
    schemas: [
      {
        name: 'nhat_ky_the_tu',
        description: 'Lịch sử quẹt thẻ từ kiểm soát ra vào kho',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã lượt quẹt' },
          { name: 'nhan_vien_id', type: 'INTEGER', description: 'Mã nhân viên' },
          { name: 'ten_nhan_vien', type: 'TEXT', description: 'Họ tên nhân viên' },
          { name: 'ma_cua', type: 'TEXT', description: 'Mã cửa kho' },
          { name: 'thoi_gian_quet', type: 'TEXT', description: 'Thời gian quẹt (YYYY-MM-DD HH:MM)' }
        ]
      }
    ],
    starterQuery: `-- Tìm 3 người quẹt thẻ vào KHO_01 muộn nhất
SELECT * FROM nhat_ky_the_tu 
WHERE ma_cua = 'KHO_01' 
ORDER BY thoi_gian_quet DESC 
LIMIT 3;`,
    seedSql: [
      `CREATE TABLE nhat_ky_the_tu (
        id INTEGER PRIMARY KEY,
        nhan_vien_id INTEGER,
        ten_nhan_vien TEXT,
        ma_cua TEXT,
        thoi_gian_quet TEXT
      );`,
      `INSERT INTO nhat_ky_the_tu VALUES
        (1, 101, 'Võ Minh Trí', 'KHO_01', '1988-11-20 18:30'),
        (2, 102, 'Đào Văn Hậu', 'KHO_02', '1988-11-20 20:10'),
        (3, 103, 'Trương Gia Kiệt', 'KHO_01', '1988-11-20 21:45'),
        (4, 104, 'Nguyễn Hải Đăng', 'KHO_01', '1988-11-21 00:15'),
        (5, 105, 'Bạch Doãn Khải', 'KHO_01', '1988-11-21 01:20'),
        (6, 106, 'Phan Bá Tuấn', 'KHO_01', '1988-11-21 01:52');`
    ],
    solution: {
      culprit: 'Phan Bá Tuấn',
      successTitle: 'Bắt Quả Tang!',
      successMessage: 'Phan Bá Tuấn chính là kẻ quẹt thẻ muộn nhất lúc 01:52!',
      explanation: 'Truy vấn `ORDER BY thoi_gian_quet DESC LIMIT 3` tại KHO_01 cho ra: Phan Bá Tuấn (01:52), Bạch Doãn Khải (01:20), Nguyễn Hải Đăng (00:15). Tuấn là người cuối cùng bước vào chỉ 8 phút trước khi chuông báo cạy két vang lên.',
      referenceQuery: `SELECT * FROM nhat_ky_the_tu WHERE ma_cua = 'KHO_01' ORDER BY thoi_gian_quet DESC LIMIT 3;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 07: Bức Mật Thư Nhà Hát Lớn
  // -----------------------------------------------------------------------
  {
    id: 'case-007',
    title: 'Vụ án 07: Bức Mật Thư Nhà Hát Lớn',
    slug: 'mat-thu-nha-hat-lon',
    difficulty: 'dễ',
    category: 'Giá Trị Trống: IS NULL',
    xpReward: 100,
    timeEstimate: '10-15 phút',
    date: '25/11/1988',
    location: 'Nhà Hát Thành Phố, Hàng ghế VIP A',
    brief: `Trong đêm diễn giao hưởng tại Nhà Hát Lớn, một bức mật thư gián điệp đã được bí mật dán dưới gầm ghế thuộc hàng ghế VIP 'A'. Toàn bộ khán giả ngồi hàng ghế A bắt buộc phải đăng ký thông tin cá nhân.
    
Cảnh sát phát hiện kẻ cài cắm thư đã cố tình bỏ trống số CMND ('so_cmnd IS NULL') khi lấy vé để che giấu tung tích. Hãy lọc bảng khách mời VIP để tìm ra danh tính kẻ này!`,
    clues: [
      'Vị trí mật thư nằm ở hàng ghế A.',
      'Kẻ gián điệp không khai báo số CMND (so_cmnd IS NULL).'
    ],
    objectives: [
      {
        id: 1,
        text: 'Lọc bảng `khach_moi_vip` ở hàng ghế \'A\'.',
        hint: "SELECT * FROM khach_moi_vip WHERE hang_ghe = 'A';"
      },
      {
        id: 2,
        text: 'Tìm những khách có `so_cmnd IS NULL` tại hàng ghế này.',
        hint: "SELECT * FROM khach_moi_vip WHERE hang_ghe = 'A' AND so_cmnd IS NULL;"
      }
    ],
    schemas: [
      {
        name: 'khach_moi_vip',
        description: 'Danh sách khách mời dự khán phòng VIP',
        columns: [
          { name: 'so_ghe', type: 'TEXT PRIMARY KEY', description: 'Số ghế (A1, A2...)' },
          { name: 'hang_ghe', type: 'TEXT', description: 'Hàng ghế' },
          { name: 'ten_khach', type: 'TEXT', description: 'Tên khách mời' },
          { name: 'so_cmnd', type: 'TEXT', description: 'Số CMND đăng ký' },
          { name: 'chuc_vu', type: 'TEXT', description: 'Chức danh ghi trên vé' }
        ]
      }
    ],
    starterQuery: `-- Tìm khách hàng ghế A bỏ trống số CMND
SELECT * FROM khach_moi_vip WHERE hang_ghe = 'A' AND so_cmnd IS NULL;`,
    seedSql: [
      `CREATE TABLE khach_moi_vip (
        so_ghe TEXT PRIMARY KEY,
        hang_ghe TEXT,
        ten_khach TEXT,
        so_cmnd TEXT,
        chuc_vu TEXT
      );`,
      `INSERT INTO khach_moi_vip VALUES
        ('A1', 'A', 'Trần Đình Trọng', '023456789', 'Doanh nhân'),
        ('A2', 'A', 'Vương Kỳ Sơn', '023112233', 'Giáo sư'),
        ('A3', 'A', 'Hoàng Minh Gián', NULL, 'Khách ngoại giao'),
        ('A4', 'A', 'Lê Bích Thủy', '023998877', 'Nhà sưu tầm'),
        ('B1', 'B', 'Ngô Quốc Cường', NULL, 'Nhiếp ảnh gia');`
    ],
    solution: {
      culprit: 'Hoàng Minh Gián',
      successTitle: 'Bóc Trần Gián Điệp!',
      successMessage: 'Hoàng Minh Gián ở ghế A3 chính là kẻ đã gài bức mật thư!',
      explanation: 'Tại hàng ghế A, chỉ có Hoàng Minh Gián (ghế A3) có `so_cmnd IS NULL`. Khám xét đồ đạc của hắn phát hiện các cuộn vi phim chứa tài liệu quốc phòng.',
      referenceQuery: `SELECT * FROM khach_moi_vip WHERE hang_ghe = 'A' AND so_cmnd IS NULL;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 08: Đuổi Hình Bắt Chữ
  // -----------------------------------------------------------------------
  {
    id: 'case-008',
    title: 'Vụ án 08: Đuổi Hình Bắt Chữ',
    slug: 'duoi-hinh-bat-chu-ngan-phieu',
    difficulty: 'dễ',
    category: 'Chuỗi Ký Tự: LENGTH, UPPER',
    xpReward: 100,
    timeEstimate: '10-15 phút',
    date: '26/11/1988',
    location: 'Phòng giao dịch Thương Tín Sài Gòn',
    brief: `Ngân hàng Thương Tín phát hiện một ngân phiếu giả mạo vừa được chi trả với số tiền cực lớn. Quy chuẩn ngân phiếu hợp pháp luôn có mã số đúng 6 ký tự. Kẻ làm giả do sơ suất trong máy in ấn ngầm đã phát hành một mã ngân phiếu dài bất thường (trên 8 ký tự).
    
Hãy lọc bảng 'giao_dich' để tìm giao dịch có 'LENGTH(ma_ngan_phieu) > 8' và chuẩn hóa tên kẻ nhận tiền bằng hàm 'UPPER'!`,
    clues: [
      'Mã ngân phiếu giả dài hơn 8 ký tự (LENGTH > 8).',
      'Chuẩn hóa tên bằng UPPER để đối chiếu với lệnh truy nã toàn quốc.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Lọc bảng `giao_dich` có `LENGTH(ma_ngan_phieu) > 8`.',
        hint: "SELECT * FROM giao_dich WHERE LENGTH(ma_ngan_phieu) > 8;"
      },
      {
        id: 2,
        text: 'Hiển thị tên người nhận bằng hàm `UPPER(ten_nguoi_nhan)`.',
        hint: "SELECT ma_ngan_phieu, UPPER(ten_nguoi_nhan) AS ten_in_hoa, so_tien FROM giao_dich WHERE LENGTH(ma_ngan_phieu) > 8;"
      }
    ],
    schemas: [
      {
        name: 'giao_dich',
        description: 'Nhật ký thanh toán ngân phiếu trong ngày',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã giao dịch' },
          { name: 'ma_ngan_phieu', type: 'TEXT', description: 'Mã số in trên ngân phiếu' },
          { name: 'ten_nguoi_nhan', type: 'TEXT', description: 'Họ tên người lĩnh tiền' },
          { name: 'so_tien', type: 'INTEGER', description: 'Số tiền rút (đồng)' }
        ]
      }
    ],
    starterQuery: `-- Tìm ngân phiếu có độ dài mã > 8 ký tự
SELECT ma_ngan_phieu, UPPER(ten_nguoi_nhan) AS ten_uppercase, so_tien 
FROM giao_dich 
WHERE LENGTH(ma_ngan_phieu) > 8;`,
    seedSql: [
      `CREATE TABLE giao_dich (
        id INTEGER PRIMARY KEY,
        ma_ngan_phieu TEXT,
        ten_nguoi_nhan TEXT,
        so_tien INTEGER
      );`,
      `INSERT INTO giao_dich VALUES
        (1, 'NP1234', 'Lê Hữu Nghĩa', 500000),
        (2, 'NP5678', 'Trịnh Cẩm Tú', 320000),
        (3, 'NP9988776655', 'tạ quang bửu', 8500000),
        (4, 'NP3344', 'Đoàn Văn Phát', 120000),
        (5, 'NP7711', 'Mai Thu Hà', 450000);`
    ],
    solution: {
      culprit: 'Tạ Quang Bửu',
      successTitle: 'Vạch Mặt Kẻ Giả Mạo!',
      successMessage: 'Tạ Quang Bửu đã bị bắt giữ khi chuẩn bị lên máy bay tẩu thoát!',
      explanation: 'Mã ngân phiếu NP9988776655 có chiều dài lên tới 12 ký tự (lớn hơn 8). Tên người nhận được hiển thị là "TẠ QUANG BỬU", kẻ cầm đầu xưởng in giả mạo.',
      referenceQuery: `SELECT ma_ngan_phieu, UPPER(ten_nguoi_nhan) AS ten_in_hoa, so_tien FROM giao_dich WHERE LENGTH(ma_ngan_phieu) > 8;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 09: Bóng Ma Thư Viện
  // -----------------------------------------------------------------------
  {
    id: 'case-009',
    title: 'Vụ án 09: Bóng Ma Thư Viện',
    slug: 'bong-ma-thu-vien',
    difficulty: 'dễ',
    category: 'Tổng Hợp Đơn: MAX',
    xpReward: 100,
    timeEstimate: '10-15 phút',
    date: '28/11/1988',
    location: 'Thư viện Khoa học Tổng hợp',
    brief: `Cuốn sách cổ duy nhất còn lại ghi chép bản đồ kho báu cổ mang tên 'Dư Địa Chí' trong phòng đọc đặc biệt đã bị rạch mất 3 trang quan trọng. Thủ thư cho biết kẻ phá hoại đã ngồi lại phòng mượn cuốn sách này trong thời gian lâu nhất trong ngày để chờ lúc nhân viên lơ là nhằm ra tay.
    
Hãy tính thời gian mượn lớn nhất 'MAX(thoi_gian_muon)' của cuốn 'Dư Địa Chí' để xác định độc giả thủ phạm!`,
    clues: [
      'Tên cuốn sách bị rạch là "Dư Địa Chí".',
      'Thủ phạm là người giữ sách lâu nhất (MAX thoi_gian_muon tính theo phút).'
    ],
    objectives: [
      {
        id: 1,
        text: 'Tìm thời gian mượn cao nhất `MAX(thoi_gian_muon)` của sách \'Dư Địa Chí\'.',
        hint: "SELECT MAX(thoi_gian_muon) FROM muon_tra_sach WHERE ten_sach = 'Dư Địa Chí';"
      },
      {
        id: 2,
        text: 'Lấy ID và họ tên độc giả tương ứng với lượt mượn lâu nhất này.',
        hint: "SELECT * FROM muon_tra_sach WHERE ten_sach = 'Dư Địa Chí' ORDER BY thoi_gian_muon DESC LIMIT 1;"
      }
    ],
    schemas: [
      {
        name: 'muon_tra_sach',
        description: 'Sổ theo dõi mượn sách phòng tư liệu quý',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã phiếu' },
          { name: 'ten_sach', type: 'TEXT', description: 'Tên sách mượn' },
          { name: 'doc_gia_id', type: 'INTEGER', description: 'Mã số độc giả' },
          { name: 'ten_doc_gia', type: 'TEXT', description: 'Tên độc giả' },
          { name: 'thoi_gian_muon', type: 'INTEGER', description: 'Thời gian mượn (phút)' }
        ]
      }
    ],
    starterQuery: `-- Tìm người mượn cuốn 'Dư Địa Chí' lâu nhất
SELECT * FROM muon_tra_sach 
WHERE ten_sach = 'Dư Địa Chí' 
ORDER BY thoi_gian_muon DESC 
LIMIT 1;`,
    seedSql: [
      `CREATE TABLE muon_tra_sach (
        id INTEGER PRIMARY KEY,
        ten_sach TEXT,
        doc_gia_id INTEGER,
        ten_doc_gia TEXT,
        thoi_gian_muon INTEGER
      );`,
      `INSERT INTO muon_tra_sach VALUES
        (1, 'Đại Nam Nhất Thống Chí', 201, 'Vũ Tri Thức', 45),
        (2, 'Dư Địa Chí', 202, 'Nguyễn Hoài Nam', 60),
        (3, 'Dư Địa Chí', 203, 'Đỗ Khắc Tiệp', 180),
        (4, 'Dư Địa Chí', 204, 'Lâm Thanh Phong', 90),
        (5, 'Gia Định Thành Thông Chí', 205, 'Trần Văn Học', 120);`
    ],
    solution: {
      culprit: 'Đỗ Khắc Tiệp',
      successTitle: 'Tìm Thấy Kẻ Rạch Sách!',
      successMessage: 'Đỗ Khắc Tiệp đã bị bắt và thu hồi 3 trang sách cổ bị rạch!',
      explanation: 'Đỗ Khắc Tiệp mượn cuốn "Dư Địa Chí" với thời gian kỷ lục 180 phút (gấp đôi người khác). Khám xét cặp của Tiệp tìm thấy dao lam và 3 trang sách cổ giấu trong lót cặp.',
      referenceQuery: `SELECT * FROM muon_tra_sach WHERE ten_sach = 'Dư Địa Chí' ORDER BY thoi_gian_muon DESC LIMIT 1;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 10: Tiệc Rượu Độc Thượng Lưu
  // -----------------------------------------------------------------------
  {
    id: 'case-010',
    title: 'Vụ án 10: Tiệc Rượu Độc Thượng Lưu',
    slug: 'tiec-ruou-doc-thuong-luu',
    difficulty: 'dễ',
    category: 'Tổng Hợp Cấp 1: BETWEEN, LIKE, OR',
    xpReward: 100,
    timeEstimate: '10-15 phút',
    date: '30/11/1988',
    location: 'Biệt thự Bến Thành, Quận 1',
    brief: `Trong bữa tiệc rượu thượng lưu, ông chủ tiệm vàng lớn nhất Chợ Lớn đã trúng độc thạch tín trong ly cocktail. 
    
Bồi bàn làm chứng: Ly rượu được phục vụ tại quầy bar chính. Kẻ khả nghi tiếp cận quầy bar trong khoảng thời gian từ 20:00:00 đến 20:15:00. Đặc biệt, chất độc đòi hỏi người có chuyên môn ngành Y hoặc Dược mới có thể pha chế chuẩn xác. 
Hãy vận dụng tổng hợp kỹ năng Cấp độ 1 để truy tìm kẻ hạ độc!`,
    clues: [
      'Thời điểm kẻ gian tiếp cận quầy bar: gio_den BETWEEN \'20:00:00\' AND \'20:15:00\'.',
      'Nghề nghiệp của đối tượng có liên quan đến \'Y tế\' hoặc \'Dược\'.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Lọc `khach_du_tiec` có `gio_den BETWEEN \'20:00:00\' AND \'20:15:00\'.',
        hint: "SELECT * FROM khach_du_tiec WHERE gio_den BETWEEN '20:00:00' AND '20:15:00';"
      },
      {
        id: 2,
        text: 'Kết hợp điều kiện nghề nghiệp: `(nghe_nghiep LIKE \'%Y tế%\' OR nghe_nghiep LIKE \'%Dược%\')`.',
        hint: "SELECT * FROM khach_du_tiec WHERE gio_den BETWEEN '20:00:00' AND '20:15:00' AND (nghe_nghiep LIKE '%Y tế%' OR nghe_nghiep LIKE '%Dược%');"
      }
    ],
    schemas: [
      {
        name: 'khach_du_tiec',
        description: 'Danh sách khách mời dự dạ tiệc',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã số khách' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên khách' },
          { name: 'nghe_nghiep', type: 'TEXT', description: 'Nghề nghiệp công tác' },
          { name: 'gio_den', type: 'TEXT', description: 'Giờ đến quầy bar (HH:MM:SS)' },
          { name: 'quan_he_nan_nhan', type: 'TEXT', description: 'Mối quan hệ với nạn nhân' }
        ]
      }
    ],
    starterQuery: `-- Lọc đối tượng đến quầy bar 20:00 - 20:15 và làm nghề Y/Dược
SELECT * FROM khach_du_tiec 
WHERE gio_den BETWEEN '20:00:00' AND '20:15:00' 
  AND (nghe_nghiep LIKE '%Y tế%' OR nghe_nghiep LIKE '%Dược%');`,
    seedSql: [
      `CREATE TABLE khach_du_tiec (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        nghe_nghiep TEXT,
        gio_den TEXT,
        quan_he_nan_nhan TEXT
      );`,
      `INSERT INTO khach_du_tiec VALUES
        (1, 'Trần Minh Quân', 'Luật sư thương mại', '20:05:00', 'Đối tác làm ăn'),
        (2, 'Bác sĩ Lê Thị Nhàn', 'Bác sĩ Y tế tư nhân', '20:10:00', 'Chủ nợ cũ'),
        (3, 'Dược sĩ Hoàng Đức', 'Kinh doanh Dược phẩm', '19:45:00', 'Bạn thời niên thiếu'),
        (4, 'Phạm Thành Long', 'Kỹ sư cơ khí', '20:12:00', 'Khách quen'),
        (5, 'Võ Tuyết Mai', 'Giáo viên', '20:30:00', 'Họ hàng xa');`
    ],
    solution: {
      culprit: 'Bác sĩ Lê Thị Nhàn',
      successTitle: 'Lật Tẩy Kẻ Đầu Độc!',
      successMessage: 'Bác sĩ Lê Thị Nhàn đã phải cúi đầu nhận tội hạ độc!',
      explanation: 'Bác sĩ Lê Thị Nhàn vừa đến quầy bar lúc 20:10:00 (trong khung 20:00-20:15) vừa làm nghề Y tế và đang có mâu thuẫn nợ nần lớn với nạn nhân.',
      referenceQuery: `SELECT * FROM khach_du_tiec WHERE gio_den BETWEEN '20:00:00' AND '20:15:00' AND (nghe_nghiep LIKE '%Y tế%' OR nghe_nghiep LIKE '%Dược%');`
    }
  }
];
