import { DetectiveCase } from './types';

// =========================================================================
// 🟡 CẤP ĐỘ 2: TRUNG BÌNH - THÁM TỬ CHÍNH THỨC (10 VỤ ÁN)
// Kỹ năng: JOIN, GROUP BY, HAVING, COUNT/SUM/AVG, CASE WHEN, UNION, SELF JOIN
// =========================================================================

export const level2Cases: DetectiveCase[] = [
  // -----------------------------------------------------------------------
  // VỤ ÁN 11: Đường Dây Cổ Vật Chợ Lớn
  // -----------------------------------------------------------------------
  {
    id: 'case-011',
    title: 'Vụ án 11: Đường Dây Cổ Vật Chợ Lớn',
    slug: 'duong-day-co-vat-cho-lon',
    difficulty: 'trung bình',
    category: 'Liên Kết: INNER JOIN (2 Bảng)',
    xpReward: 250,
    timeEstimate: '15-20 phút',
    date: '05/12/1988',
    location: 'Chợ Lớn, Quận 5',
    brief: `Bảo vật hoàng gia "Ấn Rồng Vàng" vừa bị tuồn ra chợ đen qua một đường dây buôn lậu đồ cổ xuyên quốc gia. Đội cảnh sát kinh tế đã thu giữ được cuốn sổ ghi chép mật mã các giao dịch ngầm, nhưng tên người mua chỉ được lưu dưới dạng mã số ID.
    
Nhiệm vụ của bạn là sử dụng kỹ thuật 'INNER JOIN' ghép bảng 'giao_dich_ngam' với bảng 'nghi_pham' thông qua 'nghi_pham_id' để tìm ra kẻ đã chi tiền mua "Ấn Rồng Vàng"!`,
    clues: [
      'Tên món hàng cổ vật bị đánh cắp là "Ấn Rồng Vàng".',
      'Cần kết nối khóa ngoại giao_dich_ngam.nghi_pham_id với nghi_pham.id.',
      'Kẻ mua là một đại gia bất động sản có vỏ bọc trí thức.'
    ],
    objectives: [
      {
        id: 1,
        text: '`INNER JOIN` bảng `giao_dich_ngam` và `nghi_pham` thông qua `nghi_pham_id`.',
        hint: "SELECT * FROM giao_dich_ngam g JOIN nghi_pham np ON g.nghi_pham_id = np.id;"
      },
      {
        id: 2,
        text: 'Lọc món hàng \'Ấn Rồng Vàng\' để hiển thị danh tính thật của kẻ mua.',
        hint: "SELECT np.ho_ten, np.nghe_nghiep, g.mon_hang, g.gia_tien FROM giao_dich_ngam g JOIN nghi_pham np ON g.nghi_pham_id = np.id WHERE g.mon_hang = 'Ấn Rồng Vàng';"
      }
    ],
    schemas: [
      {
        name: 'giao_dich_ngam',
        description: 'Sổ cái ghi chép giao dịch cổ vật chợ đen',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã giao dịch' },
          { name: 'mon_hang', type: 'TEXT', description: 'Tên cổ vật' },
          { name: 'gia_tien', type: 'INTEGER', description: 'Giá thanh toán (USD)' },
          { name: 'nghi_pham_id', type: 'INTEGER', description: 'Mã số người mua' },
          { name: 'ngay_giao_dich', type: 'TEXT', description: 'Ngày giao hàng' }
        ],
        foreignKeys: [{ fromColumn: 'nghi_pham_id', toTable: 'nghi_pham', toColumn: 'id' }]
      },
      {
        name: 'nghi_pham',
        description: 'Hồ sơ nhân thân các tay buôn đồ cổ',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã định danh' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên' },
          { name: 'nghe_nghiep', type: 'TEXT', description: 'Vỏ bọc nghề nghiệp' },
          { name: 'dia_chi', type: 'TEXT', description: 'Địa chỉ cư trú' }
        ]
      }
    ],
    starterQuery: `-- Ghép 2 bảng để tìm kẻ mua Ấn Rồng Vàng
SELECT np.ho_ten, np.nghe_nghiep, g.mon_hang, g.gia_tien 
FROM giao_dich_ngam g 
JOIN nghi_pham np ON g.nghi_pham_id = np.id 
WHERE g.mon_hang = 'Ấn Rồng Vàng';`,
    seedSql: [
      `CREATE TABLE nghi_pham (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        nghe_nghiep TEXT,
        dia_chi TEXT
      );`,
      `INSERT INTO nghi_pham VALUES
        (1, 'Lý Triệu Phú', 'Kinh doanh tiệm vàng', 'Trần Hưng Đạo, Q5'),
        (2, 'Hứa Vĩnh Lộc', 'Nhà sưu tập tư nhân', 'Nguyễn Trãi, Q5'),
        (3, 'Trần Bửu Toàn', 'Kỹ sư kiến trúc', 'Lê Thánh Tôn, Q1'),
        (4, 'Quách Ngọc Sơn', 'Môi giới bất động sản', 'Hùng Vương, Q5');`,
      `CREATE TABLE giao_dich_ngam (
        id INTEGER PRIMARY KEY,
        mon_hang TEXT,
        gia_tien INTEGER,
        nghi_pham_id INTEGER,
        ngay_giao_dich TEXT
      );`,
      `INSERT INTO giao_dich_ngam VALUES
        (101, 'Bình Gốm Chu Đậu', 15000, 1, '1988-12-01'),
        (102, 'Tượng Phật Đồng Khảm Bạc', 28000, 3, '1988-12-03'),
        (103, 'Ấn Rồng Vàng', 95000, 2, '1988-12-04'),
        (104, 'Tranh Thủy Mặc Cổ', 12000, 4, '1988-12-05');`
    ],
    solution: {
      culprit: 'Hứa Vĩnh Lộc',
      successTitle: 'Thu Hồi Cổ Vật!',
      successMessage: 'Hứa Vĩnh Lộc đã bị bắt tại biệt thự riêng cùng chiếc Ấn Rồng Vàng!',
      explanation: 'Câu lệnh `INNER JOIN` kết nối giao dịch số 103 ("Ấn Rồng Vàng") với `nghi_pham.id = 2`, vạch trần đại gia Hứa Vĩnh Lộc đã chi 95.000 USD mua bảo vật hoàng gia.',
      referenceQuery: `SELECT np.ho_ten, g.mon_hang, g.gia_tien FROM giao_dich_ngam g JOIN nghi_pham np ON g.nghi_pham_id = np.id WHERE g.mon_hang = 'Ấn Rồng Vàng';`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 12: Bằng Chứng Ngoại Phạm Giả
  // -----------------------------------------------------------------------
  {
    id: 'case-012',
    title: 'Vụ án 12: Bằng Chứng Ngoại Phạm Giả',
    slug: 'ngoai-pham-gia-rap-phim',
    difficulty: 'trung bình',
    category: 'Ngoại Phạm: LEFT JOIN, IS NULL',
    xpReward: 250,
    timeEstimate: '15-20 phút',
    date: '08/12/1988',
    location: 'Rạp chiếu phim Rex, Quận 1',
    brief: `Trong vụ ám hại tại công viên lúc 21h, 5 kẻ tình nghi đều đồng thanh khai rằng họ đang ngồi trong rạp Rex xem bộ phim chiếu rạp bom tấn cùng suất chiếu. 
    
Tuy nhiên, hệ thống cửa soát vé rạp Rex có lưu lại mã vé của tất cả khán giả thực tế bước qua cổng. Kẻ nói dối chắc chắn sẽ không có mã vé trong hệ thống. Hãy dùng 'LEFT JOIN' giữa danh sách nghi phạm với vé rạp phim để tìm ra kẻ có 'ma_ve IS NULL'!`,
    clues: [
      'Cả 5 nghi phạm đều khai đi xem phim lúc 21h tại rạp Rex.',
      'Sử dụng LEFT JOIN từ bảng nghi_pham sang bảng ve_rap_phim.',
      'Kẻ nói dối sẽ có ve_rap_phim.ma_ve IS NULL.'
    ],
    objectives: [
      {
        id: 1,
        text: '`LEFT JOIN` bảng `nghi_pham` với `ve_rap_phim` theo `ho_ten`.',
        hint: "SELECT np.ho_ten, v.ma_ve, v.phim FROM nghi_pham np LEFT JOIN ve_rap_phim v ON np.ho_ten = v.ten_khan_gia;"
      },
      {
        id: 2,
        text: 'Lọc tìm kẻ có `ma_ve IS NULL` để vạch trần lời khai man.',
        hint: "SELECT np.ho_ten, np.loi_khai FROM nghi_pham np LEFT JOIN ve_rap_phim v ON np.ho_ten = v.ten_khan_gia WHERE v.ma_ve IS NULL;"
      }
    ],
    schemas: [
      {
        name: 'nghi_pham',
        description: 'Danh sách đối tượng tình nghi',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ tên đối tượng' },
          { name: 'loi_khai', type: 'TEXT', description: 'Lời khai ngoại phạm' }
        ]
      },
      {
        name: 've_rap_phim',
        description: 'Dữ liệu cuống vé quét qua cổng rạp Rex tối 08/12',
        columns: [
          { name: 'ma_ve', type: 'TEXT PRIMARY KEY', description: 'Số seri vé' },
          { name: 'ten_khan_gia', type: 'TEXT', description: 'Tên người mua vé' },
          { name: 'phim', type: 'TEXT', description: 'Tên phim' },
          { name: 'suat_chieu', type: 'TEXT', description: 'Giờ chiếu' }
        ],
        foreignKeys: [
          { fromColumn: 'ten_khan_gia', toTable: 'nghi_pham', toColumn: 'ho_ten' }
        ]
      }
    ],
    starterQuery: `-- Tìm nghi phạm nói dối bằng LEFT JOIN và IS NULL
SELECT np.ho_ten, np.loi_khai, v.ma_ve 
FROM nghi_pham np 
LEFT JOIN ve_rap_phim v ON np.ho_ten = v.ten_khan_gia 
WHERE v.ma_ve IS NULL;`,
    seedSql: [
      `CREATE TABLE nghi_pham (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        loi_khai TEXT
      );`,
      `INSERT INTO nghi_pham VALUES
        (1, 'Đoàn Hùng Dũng', 'Tôi ngồi ở hàng ghế F xem phim suốt từ 20h30 đến 22h30.'),
        (2, 'Vũ Hải Triều', 'Tôi đi xem phim cùng với bạn gái, có mua bắp rang bơ.'),
        (3, 'Lê Bá Phước', 'Tôi xem phim một mình ở rạp Rex tối đó.'),
        (4, 'Trần Khang Ninh', 'Tôi mua vé xem phim và ngồi ở hàng ghế G.'),
        (5, 'Nguyễn Tuấn Kiệt', 'Tôi ngồi ngay gần cửa thoát hiểm rạp chiếu.');`,
      `CREATE TABLE ve_rap_phim (
        ma_ve TEXT PRIMARY KEY,
        ten_khan_gia TEXT,
        phim TEXT,
        suat_chieu TEXT
      );`,
      `INSERT INTO ve_rap_phim VALUES
        ('REX-901', 'Đoàn Hùng Dũng', 'Ván Bài Lật Ngửa', '20:30'),
        ('REX-902', 'Vũ Hải Triều', 'Ván Bài Lật Ngửa', '20:30'),
        ('REX-904', 'Trần Khang Ninh', 'Ván Bài Lật Ngửa', '20:30'),
        ('REX-905', 'Nguyễn Tuấn Kiệt', 'Ván Bài Lật Ngửa', '20:30');`
    ],
    solution: {
      culprit: 'Lê Bá Phước',
      successTitle: 'Lật Tẩy Ngoại Phạm!',
      successMessage: 'Lê Bá Phước không hề có vé xem phim tại rạp Rex tối hôm đó!',
      explanation: 'Kết quả `LEFT JOIN ... WHERE v.ma_ve IS NULL` chỉ ra duy nhất Lê Bá Phước không hề có cuống vé được quét vào cổng. Hắn đã thuê người làm chứng giả nhưng bị hệ thống dữ liệu bóc trần.',
      referenceQuery: `SELECT np.ho_ten FROM nghi_pham np LEFT JOIN ve_rap_phim v ON np.ho_ten = v.ten_khan_gia WHERE v.ma_ve IS NULL;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 13: Cuộc Gọi Tống Tiền Nửa Đêm
  // -----------------------------------------------------------------------
  {
    id: 'case-013',
    title: 'Vụ án 13: Cuộc Gọi Tống Tiền Nửa Đêm',
    slug: 'cuoc-goi-tong-tien',
    difficulty: 'trung bình',
    category: 'Gom Nhóm: GROUP BY, COUNT, HAVING',
    xpReward: 250,
    timeEstimate: '15-20 phút',
    date: '10/12/1988',
    location: 'Tổng đài bưu điện trung tâm Sài Gòn',
    brief: `Một gia đình thương gia giàu có liên tục nhận được các cuộc gọi nặc danh đe dọa bắt cóc con gái và tống tiền 50 cây vàng. Nạn nhân cho biết kẻ tống tiền gọi tới số nhà của họ dồn dập hơn 5 lần chỉ trong một đêm để khủng bố tinh thần.
    
Cảnh sát đã trích xuất nhật ký viễn thông toàn bộ các cuộc gọi đến số nạn nhân '08-8291234'. Hãy dùng 'GROUP BY' và 'HAVING COUNT(*) > 5' để tìm ra số bốt điện thoại công cộng mà kẻ tống tiền sử dụng!`,
    clues: [
      'Số điện thoại của nạn nhân là 08-8291234.',
      'Gom nhóm theo so_nguoi_goi và đếm số cuộc gọi.',
      'Kẻ tống tiền gọi nhiều hơn 5 lần (HAVING COUNT(*) > 5).'
    ],
    objectives: [
      {
        id: 1,
        text: 'Lọc `nhat_ky_cuoc_goi` đến số của nạn nhân (\'08-8291234\').',
        hint: "SELECT * FROM nhat_ky_cuoc_goi WHERE so_nhan = '08-8291234';"
      },
      {
        id: 2,
        text: '`GROUP BY` số người gọi, dùng `HAVING COUNT(*) > 5` để tìm ra số điện thoại thủ phạm.',
        hint: "SELECT so_nguoi_goi, COUNT(*) AS so_lan_goi FROM nhat_ky_cuoc_goi WHERE so_nhan = '08-8291234' GROUP BY so_nguoi_goi HAVING COUNT(*) > 5;"
      }
    ],
    schemas: [
      {
        name: 'nhat_ky_cuoc_goi',
        description: 'Dữ liệu chuyển mạch bưu điện trong đêm',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã cuộc gọi' },
          { name: 'so_nguoi_goi', type: 'TEXT', description: 'Số thuê bao gọi' },
          { name: 'so_nhan', type: 'TEXT', description: 'Số người nhận' },
          { name: 'thoi_gian', type: 'TEXT', description: 'Giờ gọi' },
          { name: 'thoi_luong_giay', type: 'INTEGER', description: 'Thời lượng (giây)' }
        ],
        foreignKeys: [
          { fromColumn: 'so_nguoi_goi', toTable: 'danh_ba_thue_bao', toColumn: 'so_dien_thoai' }
        ]
      },
      {
        name: 'danh_ba_thue_bao',
        description: 'Thông tin chủ thuê bao bưu điện',
        columns: [
          { name: 'so_dien_thoai', type: 'TEXT PRIMARY KEY', description: 'Số thuê bao' },
          { name: 'chu_so_huu', type: 'TEXT', description: 'Tên cá nhân/Địa điểm đặt máy' }
        ]
      }
    ],
    starterQuery: `-- Tìm số máy gọi đến nạn nhân hơn 5 lần trong đêm
SELECT so_nguoi_goi, COUNT(*) AS tong_cuoc_goi 
FROM nhat_ky_cuoc_goi 
WHERE so_nhan = '08-8291234' 
GROUP BY so_nguoi_goi 
HAVING COUNT(*) > 5;`,
    seedSql: [
      `CREATE TABLE nhat_ky_cuoc_goi (
        id INTEGER PRIMARY KEY,
        so_nguoi_goi TEXT,
        so_nhan TEXT,
        thoi_gian TEXT,
        thoi_luong_giay INTEGER
      );`,
      `INSERT INTO nhat_ky_cuoc_goi VALUES
        (1, '08-8991111', '08-8291234', '22:15', 30),
        (2, '08-8772222', '08-8291234', '22:30', 45),
        (3, '08-8889999', '08-8291234', '23:05', 20),
        (4, '08-8889999', '08-8291234', '23:15', 15),
        (5, '08-8889999', '08-8291234', '23:30', 40),
        (6, '08-8889999', '08-8291234', '23:45', 25),
        (7, '08-8889999', '08-8291234', '00:10', 35),
        (8, '08-8889999', '08-8291234', '00:25', 50),
        (9, '08-8991111', '08-8291234', '00:40', 10);`,
      `CREATE TABLE danh_ba_thue_bao (
        so_dien_thoai TEXT PRIMARY KEY,
        chu_so_huu TEXT
      );`,
      `INSERT INTO danh_ba_thue_bao VALUES
        ('08-8991111', 'Trần Hữu Danh (Bạn làm ăn)'),
        ('08-8772222', 'Hiệu thuốc Tây số 5'),
        ('08-8889999', 'Lê Hắc Long (Bốt điện thoại Bến Xe Miền Tây)');`
    ],
    solution: {
      culprit: 'Lê Hắc Long',
      successTitle: 'Bắt Giữ Kẻ Tống Tiền!',
      successMessage: 'Lê Hắc Long đã bị trinh sát bắt phục kích ngay tại bốt điện thoại!',
      explanation: 'Số điện thoại 08-8889999 đã thực hiện liên tiếp 6 cuộc gọi trong đêm (HAVING COUNT(*) > 5). Tra cứu danh bạ trỏ về bốt điện thoại công cộng do Lê Hắc Long sử dụng.',
      referenceQuery: `SELECT so_nguoi_goi, COUNT(*) FROM nhat_ky_cuoc_goi WHERE so_nhan = '08-8291234' GROUP BY so_nguoi_goi HAVING COUNT(*) > 5;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 14: Rửa Tiền Tại Đại Thế Giới
  // -----------------------------------------------------------------------
  {
    id: 'case-014',
    title: 'Vụ án 14: Rửa Tiền Tại Đại Thế Giới',
    slug: 'rua-tien-dai-the-gioi',
    difficulty: 'trung bình',
    category: 'Tổng Hợp Doanh Thu: SUM, GROUP BY, HAVING',
    xpReward: 250,
    timeEstimate: '15-20 phút',
    date: '12/12/1988',
    location: 'Sòng bạc Đại Thế Giới (Casino Grand Monde), Chợ Lớn',
    brief: `Một đường dây tội phạm có tổ chức đang biến sòng bạc ngầm Đại Thế Giới thành trạm rửa tiền phi pháp. Kẻ cầm đầu sử dụng nhiều tay chân để đổi lượng lớn tiền mặt thành phỉnh cược rồi lập tức đổi ngược lại lấy séc thanh toán quốc tế vượt quá 100.000 USD trong ngày.
    
Hãy gom nhóm các giao dịch đổi phỉnh theo 'khach_id', tính tổng số tiền 'SUM(so_tien)' và lọc 'HAVING SUM(so_tien) > 100000' sắp xếp giảm dần để vạch mặt tên trùm rửa tiền!`,
    clues: [
      'Gom nhóm theo khach_id và tính SUM(so_tien).',
      'Điều kiện lọc nhóm: HAVING SUM(so_tien) > 100000.',
      'Sắp xếp giảm dần (ORDER BY SUM(so_tien) DESC).'
    ],
    objectives: [
      {
        id: 1,
        text: 'Gom nhóm giao dịch theo `khach_id` và tính tổng tiền quy đổi `SUM(so_tien)`.',
        hint: "SELECT khach_id, SUM(so_tien) AS tong_tien FROM giao_dich_song_bac GROUP BY khach_id;"
      },
      {
        id: 2,
        text: 'Lọc nhóm `HAVING SUM(so_tien) > 100000` và sắp xếp `ORDER BY tong_tien DESC`.',
        hint: "SELECT khach_id, SUM(so_tien) AS tong_tien FROM giao_dich_song_bac GROUP BY khach_id HAVING SUM(so_tien) > 100000 ORDER BY tong_tien DESC;"
      }
    ],
    schemas: [
      {
        name: 'giao_dich_song_bac',
        description: 'Lịch sử đổi phỉnh lấy tiền tại quầy thu ngân',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã phiếu đổi' },
          { name: 'khach_id', type: 'INTEGER', description: 'Mã khách' },
          { name: 'so_tien', type: 'INTEGER', description: 'Số tiền quy đổi (USD)' },
          { name: 'hinh_thuc', type: 'TEXT', description: 'Tiền mặt sang Séc / Phỉnh' }
        ],
        foreignKeys: [
          { fromColumn: 'khach_id', toTable: 'khach_choi', toColumn: 'id' }
        ]
      },
      {
        name: 'khach_choi',
        description: 'Thông tin tài khoản hội viên sòng bài',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã khách' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên con bạc / Nghi phạm' },
          { name: 'quoc_tich', type: 'TEXT', description: 'Quốc tịch' }
        ]
      }
    ],
    starterQuery: `-- Tính tổng tiền đổi phỉnh vượt quá 100.000 USD
SELECT kc.ho_ten, SUM(g.so_tien) AS tong_tien_rua 
FROM giao_dich_song_bac g 
JOIN khach_choi kc ON g.khach_id = kc.id 
GROUP BY g.khach_id, kc.ho_ten 
HAVING SUM(g.so_tien) > 100000 
ORDER BY tong_tien_rua DESC;`,
    seedSql: [
      `CREATE TABLE khach_choi (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        quoc_tich TEXT
      );`,
      `INSERT INTO khach_choi VALUES
        (1, 'Lưu Đại Lượng', 'Việt Nam'),
        (2, 'Tạ Chí Thành', 'Hồng Kông'),
        (3, 'Trần Bát Giới', 'Đài Loan'),
        (4, 'Phạm Kim Quy', 'Việt Nam');`,
      `CREATE TABLE giao_dich_song_bac (
        id INTEGER PRIMARY KEY,
        khach_id INTEGER,
        so_tien INTEGER,
        hinh_thuc TEXT
      );`,
      `INSERT INTO giao_dich_song_bac VALUES
        (1, 1, 25000, 'Phỉnh sang Séc'),
        (2, 2, 40000, 'Phỉnh sang Séc'),
        (3, 1, 30000, 'Phỉnh sang Séc'),
        (4, 3, 15000, 'Phỉnh sang Séc'),
        (5, 2, 85000, 'Phỉnh sang Séc'),
        (6, 4, 12000, 'Phỉnh sang Séc'),
        (7, 1, 15000, 'Phỉnh sang Séc');`
    ],
    solution: {
      culprit: 'Tạ Chí Thành',
      successTitle: 'Chặn Đứng Đường Dây Rửa Tiền!',
      successMessage: 'Tạ Chí Thành đã rửa tới 125.000 USD trong ngày tại sòng bạc!',
      explanation: 'Tạ Chí Thành (khach_id = 2) thực hiện 2 lần đổi tiền (40.000 + 85.000 = 125.000 USD), là người duy nhất vượt ngưỡng 100.000 USD quy định kiểm soát.',
      referenceQuery: `SELECT khach_id, SUM(so_tien) FROM giao_dich_song_bac GROUP BY khach_id HAVING SUM(so_tien) > 100000;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 15: Gián Điệp Hai Mang
  // -----------------------------------------------------------------------
  {
    id: 'case-015',
    title: 'Vụ án 15: Gián Điệp Hai Mang',
    slug: 'gian-diep-hai-mang',
    difficulty: 'trung bình',
    category: 'Liên Kết Đa Bảng: Multi-JOIN (3 Bảng)',
    xpReward: 250,
    timeEstimate: '15-20 phút',
    date: '15/12/1988',
    location: 'Viện Nghiên cứu Chiến lược Quốc gia',
    brief: `Bản thiết kế tuyệt mật "Hồ Sơ Phượng Hoàng" đã bị chụp lén và gửi ra nước ngoài. Cơ quan an ninh tình báo nhận định kẻ phản bội là nhân viên trong viện, người này vừa có quyền truy cập vào phòng máy chủ lưu trữ hồ sơ, vừa bất ngờ nhận được khoản tiền chuyển ngoại tệ kếch xù vào tài khoản bí mật tại ngân hàng Thụy Sĩ (số dư > 50.000 USD).
    
Hãy thực hiện 'JOIN' đồng thời 3 bảng: 'nhan_vien', 'nhat_ky_truy_cap', và 'tai_khoan_ngan_hang' để lột mặt nạ tên gián điệp hai mang!`,
    clues: [
      'Nghi phạm truy cập tài liệu có mã "HO_SO_PHUONG_HOANG".',
      'Tài khoản ngân hàng Thụy Sĩ có số dư lớn hơn 50.000 USD.',
      'Cần kết nối 3 bảng qua ma_nhan_vien.'
    ],
    objectives: [
      {
        id: 1,
        text: '`JOIN` 3 bảng: `nhan_vien`, `nhat_ky_truy_cap`, `tai_khoan_ngan_hang`.',
        hint: "FROM nhan_vien nv JOIN nhat_ky_truy_cap nk ON nv.ma_nv = nk.ma_nv JOIN tai_khoan_ngan_hang tk ON nv.ma_nv = tk.ma_nv"
      },
      {
        id: 2,
        text: 'Lọc người truy cập tài liệu \'HO_SO_PHUONG_HOANG\' VÀ có `so_du_usd > 50000`.',
        hint: "WHERE nk.tai_lieu = 'HO_SO_PHUONG_HOANG' AND tk.so_du_usd > 50000;"
      }
    ],
    schemas: [
      {
        name: 'nhan_vien',
        columns: [
          { name: 'ma_nv', type: 'TEXT PRIMARY KEY', description: 'Mã nhân viên' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ tên nhân viên' },
          { name: 'phong_ban', type: 'TEXT', description: 'Phòng ban trực thuộc' }
        ]
      },
      {
        name: 'nhat_ky_truy_cap',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã lần mở máy' },
          { name: 'ma_nv', type: 'TEXT', description: 'Mã nhân viên' },
          { name: 'tai_lieu', type: 'TEXT', description: 'Tên tài liệu mở' },
          { name: 'ngay_gio', type: 'TEXT', description: 'Thời điểm truy cập' }
        ],
        foreignKeys: [{ fromColumn: 'ma_nv', toTable: 'nhan_vien', toColumn: 'ma_nv' }]
      },
      {
        name: 'tai_khoan_ngan_hang',
        columns: [
          { name: 'so_tk', type: 'TEXT PRIMARY KEY', description: 'Số tài khoản' },
          { name: 'ma_nv', type: 'TEXT', description: 'Mã nhân viên sở hữu' },
          { name: 'ngan_hang', type: 'TEXT', description: 'Ngân hàng lưu ký' },
          { name: 'so_du_usd', type: 'INTEGER', description: 'Số dư ngoại tệ (USD)' }
        ],
        foreignKeys: [{ fromColumn: 'ma_nv', toTable: 'nhan_vien', toColumn: 'ma_nv' }]
      }
    ],
    starterQuery: `-- Ghép 3 bảng tìm gián điệp hai mang
SELECT nv.ho_ten, nv.phong_ban, nk.tai_lieu, tk.so_du_usd 
FROM nhan_vien nv 
JOIN nhat_ky_truy_cap nk ON nv.ma_nv = nk.ma_nv 
JOIN tai_khoan_ngan_hang tk ON nv.ma_nv = tk.ma_nv 
WHERE nk.tai_lieu = 'HO_SO_PHUONG_HOANG' AND tk.so_du_usd > 50000;`,
    seedSql: [
      `CREATE TABLE nhan_vien (
        ma_nv TEXT PRIMARY KEY,
        ho_ten TEXT,
        phong_ban TEXT
      );`,
      `INSERT INTO nhan_vien VALUES
        ('NV01', 'Lê Khắc Tiêu', 'Phòng Lưu trữ Mật'),
        ('NV02', 'Bùi Đình Cẩn', 'Phòng Kỹ thuật Mật mã'),
        ('NV03', 'Hoàng Minh Tâm', 'Phòng Hành chính Tổng hợp'),
        ('NV04', 'Vũ Quốc Toản', 'Phòng Tác chiến Điện tử');`,
      `CREATE TABLE nhat_ky_truy_cap (
        id INTEGER PRIMARY KEY,
        ma_nv TEXT,
        tai_lieu TEXT,
        ngay_gio TEXT
      );`,
      `INSERT INTO nhat_ky_truy_cap VALUES
        (1, 'NV01', 'HO_SO_PHUONG_HOANG', '1988-12-14 22:30'),
        (2, 'NV02', 'HO_SO_PHUONG_HOANG', '1988-12-15 01:15'),
        (3, 'NV03', 'BAO_CAO_HANH_CHINH', '1988-12-15 08:00'),
        (4, 'NV04', 'BAN_DO_HAI_QUAN', '1988-12-15 09:30');`,
      `CREATE TABLE tai_khoan_ngan_hang (
        so_tk TEXT PRIMARY KEY,
        ma_nv TEXT,
        ngan_hang TEXT,
        so_du_usd INTEGER
      );`,
      `INSERT INTO tai_khoan_ngan_hang VALUES
        ('TK-CH-01', 'NV01', 'UBS Thụy Sĩ', 1500),
        ('TK-CH-02', 'NV02', 'Credit Suisse Thụy Sĩ', 120000),
        ('TK-VN-03', 'NV03', 'Ngân hàng Ngoại Thương VN', 500),
        ('TK-CH-04', 'NV04', 'UBS Thụy Sĩ', 8000);`
    ],
    solution: {
      culprit: 'Bùi Đình Cẩn',
      successTitle: 'Bắt Trọn Điệp Viên!',
      successMessage: 'Bùi Đình Cẩn chính là tên gián điệp hai mang bán tài liệu mật!',
      explanation: 'Bùi Đình Cẩn (NV02) đã mở HO_SO_PHUONG_HOANG lúc 01:15 rạng sáng và sở hữu tài khoản Credit Suisse với số dư lên tới 120.000 USD.',
      referenceQuery: `SELECT nv.ho_ten FROM nhan_vien nv JOIN nhat_ky_truy_cap nk ON nv.ma_nv = nk.ma_nv JOIN tai_khoan_ngan_hang tk ON nv.ma_nv = tk.ma_nv WHERE nk.tai_lieu = 'HO_SO_PHUONG_HOANG' AND tk.so_du_usd > 50000;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 16: Kẻ Đứng Sau Màn Gió
  // -----------------------------------------------------------------------
  {
    id: 'case-016',
    title: 'Vụ án 16: Kẻ Đứng Sau Màn Gió',
    slug: 'ke-dung-sau-man-gio',
    difficulty: 'trung bình',
    category: 'Tự Liên Kết: SELF JOIN',
    xpReward: 250,
    timeEstimate: '15-20 phút',
    date: '18/12/1988',
    location: 'Trại tạm giam Chí Hòa, Phòng hỏi cung',
    brief: `Sau nhiều ngày mai phục, lực lượng cảnh sát hình sự đã tóm gọn tên tay sai cộm cán Lê Văn Tám khi hắn đang giao dịch ma túy. Tại phòng thẩm vấn, Tám ngoan cố không khai tên ông trùm chỉ đạo mà chỉ thách thức: "Các người có giỏi thì tìm trong sơ đồ tổ chức của tổ chức Hắc Long xem ai là sếp trực tiếp của tao!".
    
Trong bảng 'bang_dang', mỗi thành viên có cột 'cap_tren_id' trỏ đến 'id' của chính kẻ cầm đầu cấp trên. Hãy dùng kỹ thuật 'SELF JOIN' để lột mặt kẻ đứng sau giật dây Lê Văn Tám!`,
    clues: [
      'Bảng bang_dang chứa cả cấp dưới và cấp trên (cap_tren_id = id).',
      'SELF JOIN: bang_dang a JOIN bang_dang b ON a.cap_tren_id = b.id.',
      'Lọc điều kiện a.ho_ten = \'Lê Văn Tám\' để lấy ra tên của b.'
    ],
    objectives: [
      {
        id: 1,
        text: '`SELF JOIN` bảng `bang_dang` với chính nó (`a.cap_tren_id = b.id`).',
        hint: "SELECT a.ho_ten AS cap_duoi, b.ho_ten AS cap_tren FROM bang_dang a JOIN bang_dang b ON a.cap_tren_id = b.id;"
      },
      {
        id: 2,
        text: 'Trích xuất tên của `b` (cấp trên) khi `a.ho_ten = \'Lê Văn Tám\'`.',
        hint: "SELECT b.ho_ten AS trum_chi_dao, b.chuc_danh FROM bang_dang a JOIN bang_dang b ON a.cap_tren_id = b.id WHERE a.ho_ten = 'Lê Văn Tám';"
      }
    ],
    schemas: [
      {
        name: 'bang_dang',
        description: 'Sơ đồ cây tổ chức thế giới ngầm Hắc Long',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã số thành viên' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên thành viên' },
          { name: 'chuc_danh', type: 'TEXT', description: 'Cấp bậc trong băng' },
          { name: 'cap_tren_id', type: 'INTEGER', description: 'Mã ID của người chỉ huy trực tiếp' }
        ],
        foreignKeys: [{ fromColumn: 'cap_tren_id', toTable: 'bang_dang', toColumn: 'id' }]
      }
    ],
    starterQuery: `-- SELF JOIN để tìm kẻ chỉ huy trực tiếp của Lê Văn Tám
SELECT a.ho_ten AS ten_tay_sai, b.ho_ten AS ten_ong_trum, b.chuc_danh 
FROM bang_dang a 
JOIN bang_dang b ON a.cap_tren_id = b.id 
WHERE a.ho_ten = 'Lê Văn Tám';`,
    seedSql: [
      `CREATE TABLE bang_dang (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        chuc_danh TEXT,
        cap_tren_id INTEGER
      );`,
      `INSERT INTO bang_dang VALUES
        (1, 'Trần Thiết Bích', 'Lão Đại (Tổng Tư Lệnh)', NULL),
        (2, 'Vương Hắc Hổ', 'Đường Chủ Chợ Lớn', 1),
        (3, 'Lâm Báo Đen', 'Đường Chủ Bến Tàu', 1),
        (4, 'Lê Văn Tám', 'Đội trưởng Hành động', 2),
        (5, 'Đỗ Cửu Ca', 'Tổ trưởng Bảo kê', 3),
        (6, 'Ngô Phi Ưng', 'Tay súng', 4);`
    ],
    solution: {
      culprit: 'Vương Hắc Hổ',
      successTitle: 'Lật Mặt Đường Chủ!',
      successMessage: 'Vương Hắc Hổ chính là kẻ đứng sau chỉ đạo Lê Văn Tám!',
      explanation: 'Truy vấn SELF JOIN cho thấy `Lê Văn Tám` (id = 4) có `cap_tren_id = 2`, trỏ chính xác về Đường Chủ Chợ Lớn "Vương Hắc Hổ".',
      referenceQuery: `SELECT b.ho_ten FROM bang_dang a JOIN bang_dang b ON a.cap_tren_id = b.id WHERE a.ho_ten = 'Lê Văn Tám';`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 17: Án Trộm Kép
  // -----------------------------------------------------------------------
  {
    id: 'case-017',
    title: 'Vụ án 17: Án Trộm Kép',
    slug: 'an-trom-kep-quan-1-quan-5',
    difficulty: 'trung bình',
    category: 'Hợp Tập Hợp: UNION, GROUP BY',
    xpReward: 250,
    timeEstimate: '15-20 phút',
    date: '20/12/1988',
    location: 'Quận 1 và Quận 5, TP.HCM',
    brief: `Trong cùng một buổi chiều, hai vụ trộm tiệm vàng liên tiếp xảy ra tại Quận 1 và Quận 5 với cùng thủ đoạn đột nhập lỗ thông gió. Đồn cảnh sát hai quận độc lập lập danh sách các đối tượng khả nghi lảng vảng gần hiện trường vào sổ lưu trữ riêng.
    
Ban chuyên án nhận định: Kẻ gây án là kẻ duy nhất xuất hiện đồng thời trong cả hai danh sách của đồn Q1 và đồn Q5. Hãy dùng 'UNION ALL' gộp dữ liệu hai đồn và 'GROUP BY' số CMND tìm kẻ có 'COUNT(*) = 2'!`,
    clues: [
      'Gộp danh sách hai đồn bằng UNION ALL.',
      'Gom nhóm theo so_cmnd và ho_ten.',
      'Kẻ xuất hiện ở cả 2 nơi sẽ có COUNT(*) = 2.'
    ],
    objectives: [
      {
        id: 1,
        text: '`UNION ALL` danh sách khả nghi từ 2 đồn cảnh sát `nhan_chung_q1` và `nhan_chung_q5`.',
        hint: "SELECT so_cmnd, ho_ten FROM nhan_chung_q1 UNION ALL SELECT so_cmnd, ho_ten FROM nhan_chung_q5;"
      },
      {
        id: 2,
        text: '`GROUP BY` số CMND, tìm người có `COUNT(*) = 2`.',
        hint: "SELECT so_cmnd, ho_ten, COUNT(*) AS so_lan_xuat_hien FROM (SELECT so_cmnd, ho_ten FROM nhan_chung_q1 UNION ALL SELECT so_cmnd, ho_ten FROM nhan_chung_q5) GROUP BY so_cmnd, ho_ten HAVING COUNT(*) = 2;"
      }
    ],
    schemas: [
      {
        name: 'nhan_chung_q1',
        description: 'Đối tượng khả nghi tại hiện trường tiệm vàng Quận 1',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã' },
          { name: 'so_cmnd', type: 'TEXT', description: 'Số CMND' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ tên' },
          { name: 'gio_thay', type: 'TEXT', description: 'Giờ phát hiện' }
        ]
      },
      {
        name: 'nhan_chung_q5',
        description: 'Đối tượng khả nghi tại hiện trường tiệm vàng Quận 5',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã' },
          { name: 'so_cmnd', type: 'TEXT', description: 'Số CMND' },
          { name: 'ho_ten', type: 'TEXT', description: 'Họ tên' },
          { name: 'gio_thay', type: 'TEXT', description: 'Giờ phát hiện' }
        ],
        foreignKeys: [
          { fromColumn: 'so_cmnd', toTable: 'nhan_chung_q1', toColumn: 'so_cmnd' }
        ]
      }
    ],
    starterQuery: `-- UNION ALL và GROUP BY tìm kẻ xuất hiện ở cả hai hiện trường
SELECT so_cmnd, ho_ten, COUNT(*) AS tong_so_lan 
FROM (
  SELECT so_cmnd, ho_ten FROM nhan_chung_q1 
  UNION ALL 
  SELECT so_cmnd, ho_ten FROM nhan_chung_q5
) 
GROUP BY so_cmnd, ho_ten 
HAVING COUNT(*) = 2;`,
    seedSql: [
      `CREATE TABLE nhan_chung_q1 (
        id INTEGER PRIMARY KEY,
        so_cmnd TEXT,
        ho_ten TEXT,
        gio_thay TEXT
      );`,
      `INSERT INTO nhan_chung_q1 VALUES
        (1, '023111', 'Nguyễn Tấn Lực', '14:30'),
        (2, '023222', 'Trần Siêu Trộm', '15:10'),
        (3, '023333', 'Phan Văn Đạt', '15:40');`,
      `CREATE TABLE nhan_chung_q5 (
        id INTEGER PRIMARY KEY,
        so_cmnd TEXT,
        ho_ten TEXT,
        gio_thay TEXT
      );`,
      `INSERT INTO nhan_chung_q5 VALUES
        (1, '023444', 'Lê Hữu Nghị', '17:00'),
        (2, '023222', 'Trần Siêu Trộm', '17:45'),
        (3, '023555', 'Hoàng Thái Hậu', '18:15');`
    ],
    solution: {
      culprit: 'Trần Siêu Trộm',
      successTitle: 'Phá Vụ Án Kép!',
      successMessage: 'Trần Siêu Trộm (CMND: 023222) đã bị bắt với tang vật cả 2 tiệm vàng!',
      explanation: 'Chỉ duy nhất "Trần Siêu Trộm" (CMND 023222) có mặt ở cả hai bảng hồ sơ của Q1 và Q5 (COUNT(*) = 2). Hắn dùng xe máy phân khối lớn di chuyển giữa 2 quận.',
      referenceQuery: `SELECT ho_ten FROM (SELECT so_cmnd, ho_ten FROM nhan_chung_q1 UNION ALL SELECT so_cmnd, ho_ten FROM nhan_chung_q5) GROUP BY so_cmnd, ho_ten HAVING COUNT(*) = 2;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 18: Vượt Ngục Khám Chí Hòa
  // -----------------------------------------------------------------------
  {
    id: 'case-018',
    title: 'Vụ án 18: Vượt Ngục Khám Chí Hòa',
    slug: 'vuot-nguc-kham-chi-hoa',
    difficulty: 'trung bình',
    category: 'Phân Loại Điều Kiện: CASE WHEN',
    xpReward: 250,
    timeEstimate: '15-20 phút',
    date: '22/12/1988',
    location: 'Trại giam Chí Hòa, Khu Bát Quái',
    brief: `Một âm mưu vượt ngục quy mô lớn sắp diễn ra tại Khu Bát Quái trại giam Chí Hòa. Nguồn tin nội gián báo về kẻ chủ mưu là tên phạm nhân thuộc diện phân loại "Đặc biệt nguy hiểm". 
    
Tiêu chí phân loại của trại giam: Những tù nhân có số lần vi phạm kỷ luật từ 3 lần trở lên VÀ mức án trên 15 năm tù được xếp vào diện 'Đặc biệt nguy hiểm'. Hãy dùng biểu thức 'CASE WHEN' để rà soát toàn bộ tù nhân và chỉ điểm kẻ cầm đầu!`,
    clues: [
      'CASE WHEN: vi_pham >= 3 AND an_tu > 15 THEN \'Đặc biệt nguy hiểm\' ELSE \'Bình thường\' END.',
      'Lọc những phạm nhân rơi vào nhóm \'Đặc biệt nguy hiểm\'.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Dùng `CASE WHEN` phân loại tù nhân theo tiêu chí vi phạm >= 3 và án > 15 năm.',
        hint: "SELECT ho_ten, an_tu, vi_pham, CASE WHEN vi_pham >= 3 AND an_tu > 15 THEN 'Đặc biệt nguy hiểm' ELSE 'Bình thường' END AS phan_loai FROM tu_nhan;"
      },
      {
        id: 2,
        text: 'Lọc danh sách các phạm nhân thuộc nhóm \'Đặc biệt nguy hiểm\'.',
        hint: "SELECT * FROM (SELECT ho_ten, an_tu, vi_pham, CASE WHEN vi_pham >= 3 AND an_tu > 15 THEN 'Đặc biệt nguy hiểm' ELSE 'Bình thường' END AS phan_loai FROM tu_nhan) WHERE phan_loai = 'Đặc biệt nguy hiểm';"
      }
    ],
    schemas: [
      {
        name: 'tu_nhan',
        description: 'Hồ sơ phạm nhân khu Bát Quái Chí Hòa',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã số tù' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên phạm nhân' },
          { name: 'an_tu', type: 'INTEGER', description: 'Mức án tuyên phạt (năm)' },
          { name: 'vi_pham', type: 'INTEGER', description: 'Số lần vi phạm nội quy' },
          { name: 'buong_giam', type: 'TEXT', description: 'Số buồng giam' }
        ]
      }
    ],
    starterQuery: `-- Phân loại tù nhân bằng CASE WHEN
SELECT ho_ten, an_tu, vi_pham, buong_giam,
  CASE 
    WHEN vi_pham >= 3 AND an_tu > 15 THEN 'Đặc biệt nguy hiểm'
    ELSE 'Bình thường'
  END AS muc_do_nguy_hiem 
FROM tu_nhan;`,
    seedSql: [
      `CREATE TABLE tu_nhan (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        an_tu INTEGER,
        vi_pham INTEGER,
        buong_giam TEXT
      );`,
      `INSERT INTO tu_nhan VALUES
        (1, 'Lê Văn Luyện', 10, 4, 'B-01'),
        (2, 'Trịnh Tam Ca', 20, 5, 'B-04'),
        (3, 'Đỗ Văn Bình', 18, 1, 'B-02'),
        (4, 'Phạm Quốc Cường', 8, 2, 'B-03'),
        (5, 'Bùi Đình Trọng', 12, 3, 'B-05');`
    ],
    solution: {
      culprit: 'Trịnh Tam Ca',
      successTitle: 'Ngăn Chặn Vượt Ngục!',
      successMessage: 'Trịnh Tam Ca ở buồng B-04 chính là kẻ cầm đầu chuẩn bị vượt ngục!',
      explanation: 'Trịnh Tam Ca có mức án 20 năm (>15) và đã 5 lần vi phạm kỷ luật (>=3), là phạm nhân duy nhất rơi vào diện "Đặc biệt nguy hiểm". Lực lượng an ninh lục soát buồng B-04 phát hiện lưỡi cưa sắt giấu trong ống tre.',
      referenceQuery: `SELECT ho_ten FROM tu_nhan WHERE vi_pham >= 3 AND an_tu > 15;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 19: Chênh Lệch Hàng Cảng
  // -----------------------------------------------------------------------
  {
    id: 'case-019',
    title: 'Vụ án 19: Chênh Lệch Hàng Cảng',
    slug: 'chenh-lech-hang-cang-sai-gon',
    difficulty: 'trung bình',
    category: 'Toán Tử Phép Trừ Trong JOIN: (thuc_te - to_khai) > 500',
    xpReward: 250,
    timeEstimate: '15-20 phút',
    date: '25/12/1988',
    location: 'Cảng Tân Thuận, Quận 7',
    brief: `Hải quan phát hiện một công ty xuất nhập khẩu có hành vi gian lận thương mại nghiêm trọng: nhập khẩu máy móc công nghiệp nặng nhưng giấu hàng chục thùng rượu ngoại và thuốc lá lậu bên trong container.
    
Quy trình kiểm tra: Hải quan đối chiếu trọng lượng khai báo trên giấy tờ 'to_khai' và số cân thực tế 'thuc_te' tại trạm cân điện tử cảng. Container gian lận là container có độ chênh lệch trọng lượng '(thuc_te.trong_luong - to_khai.trong_luong) > 500' kg. Hãy kết nối 2 bảng và tìm ra công ty buôn lậu!`,
    clues: [
      'JOIN 2 bảng theo ma_container.',
      'Điều kiện lọc toán học: (thuc_te.trong_luong - to_khai.trong_luong) > 500.',
      'Tìm tên doanh nghiệp đứng tên mở tờ khai.'
    ],
    objectives: [
      {
        id: 1,
        text: '`JOIN` bảng `to_khai` và `thuc_te` theo `ma_container`.',
        hint: "SELECT * FROM to_khai tk JOIN thuc_te tt ON tk.ma_container = tt.ma_container;"
      },
      {
        id: 2,
        text: 'Lọc điều kiện `(tt.trong_luong - tk.trong_luong) > 500` để phát hiện hàng lậu.',
        hint: "SELECT tk.ma_container, tk.doanh_nghiep, (tt.trong_luong - tk.trong_luong) AS do_chenh_kg FROM to_khai tk JOIN thuc_te tt ON tk.ma_container = tt.ma_container WHERE (tt.trong_luong - tk.trong_luong) > 500;"
      }
    ],
    schemas: [
      {
        name: 'to_khai',
        description: 'Tờ khai hải quan khai báo hàng hóa',
        columns: [
          { name: 'ma_container', type: 'TEXT PRIMARY KEY', description: 'Số container' },
          { name: 'doanh_nghiep', type: 'TEXT', description: 'Tên công ty đứng tên' },
          { name: 'hang_hoa', type: 'TEXT', description: 'Tên hàng khai báo' },
          { name: 'trong_luong', type: 'REAL', description: 'Trọng lượng khai (kg)' }
        ]
      },
      {
        name: 'thuc_te',
        description: 'Số liệu trạm cân điện tử kiểm hóa cảng',
        columns: [
          { name: 'ma_container', type: 'TEXT PRIMARY KEY', description: 'Số container' },
          { name: 'trong_luong', type: 'REAL', description: 'Trọng lượng cân thực (kg)' },
          { name: 'gio_can', type: 'TEXT', description: 'Giờ qua trạm cân' }
        ],
        foreignKeys: [{ fromColumn: 'ma_container', toTable: 'to_khai', toColumn: 'ma_container' }]
      }
    ],
    starterQuery: `-- Tính chênh lệch trọng lượng thực tế so với tờ khai > 500kg
SELECT tk.ma_container, tk.doanh_nghiep, tk.hang_hoa,
       tk.trong_luong AS khai_bao, tt.trong_luong AS thuc_te,
       (tt.trong_luong - tk.trong_luong) AS chenh_lech_kg 
FROM to_khai tk 
JOIN thuc_te tt ON tk.ma_container = tt.ma_container 
WHERE (tt.trong_luong - tk.trong_luong) > 500;`,
    seedSql: [
      `CREATE TABLE to_khai (
        ma_container TEXT PRIMARY KEY,
        doanh_nghiep TEXT,
        hang_hoa TEXT,
        trong_luong REAL
      );`,
      `INSERT INTO to_khai VALUES
        ('CONT-01', 'Công ty Dệt May Thắng Lợi', 'Vải thô', 12000.0),
        ('CONT-02', 'Công ty XNK Vạn Phát', 'Máy dệt kim', 8500.0),
        ('CONT-03', 'Công ty Cơ khí Đồng Tâm', 'Thép tấm', 25000.0),
        ('CONT-04', 'Công ty Nông Sản Á Châu', 'Hạt điều', 15000.0);`,
      `CREATE TABLE thuc_te (
        ma_container TEXT PRIMARY KEY,
        trong_luong REAL,
        gio_can TEXT
      );`,
      `INSERT INTO thuc_te VALUES
        ('CONT-01', 12050.0, '08:30'),
        ('CONT-02', 9250.0, '09:15'),
        ('CONT-03', 25020.0, '10:00'),
        ('CONT-04', 15100.0, '10:45');`
    ],
    solution: {
      culprit: 'Công ty XNK Vạn Phát',
      successTitle: 'Bắt Trọn Hàng Lậu!',
      successMessage: 'Container CONT-02 của Công ty Vạn Phát thừa tới 750kg hàng lậu!',
      explanation: 'Container CONT-02 khai báo 8.500kg nhưng thực tế cân nặng 9.250kg, chênh lệch tới 750kg (vượt xa ngưỡng 500kg). Kiểm hóa phát hiện 2.000 chai rượu ngoại nhập lậu.',
      referenceQuery: `SELECT tk.doanh_nghiep FROM to_khai tk JOIN thuc_te tt ON tk.ma_container = tt.ma_container WHERE (tt.trong_luong - tk.trong_luong) > 500;`
    }
  },

  // -----------------------------------------------------------------------
  // VỤ ÁN 20: Án Mạng Biệt Thự Hoa Hồng
  // -----------------------------------------------------------------------
  {
    id: 'case-020',
    title: 'Vụ án 20: Án Mạng Biệt Thự Hoa Hồng',
    slug: 'an-mang-biet-thu-hoa-hong',
    difficulty: 'trung bình',
    category: 'Tổng Hợp Cấp 2: Multi-Table Aggregation',
    xpReward: 250,
    timeEstimate: '15-20 phút',
    date: '30/12/1988',
    location: 'Biệt thự Hoa Hồng, Bán đảo Thanh Đa',
    brief: `Vào đêm tất niên định mệnh tại Biệt thự Hoa Hồng, nhà sưu tập tranh nổi tiếng bị sát hại dã man và nhiều bức tranh triệu đô biến mất. 
    
Đội điều tra tổng hợp manh mối từ hai nguồn:
1. Cảm biến ra vào ghi nhận kẻ thủ ác đã ở trong biệt thự tổng thời gian trên 30 phút ('SUM(so_phut) > 30').
2. Sổ giao dịch chợ đen cho thấy hắn đã bán ra ít nhất 3 bức tranh cổ ('COUNT(*) >= 3').
Hãy kết hợp các bảng để tìm ra tên sát thủ kiêm trộm tranh chuyên nghiệp!`,
    clues: [
      'Gom nhóm cam_bien_ra_vao theo nghi_pham_id: SUM(so_phut) > 30.',
      'Gom nhóm giao_dich_cho_den theo nghi_pham_id: COUNT(*) >= 3 tranh.',
      'Kẻ thủ ác phải thỏa mãn cả 2 điều kiện trên.'
    ],
    objectives: [
      {
        id: 1,
        text: 'Tìm danh sách nghi phạm ở trong biệt thự trên 30 phút (`SUM(so_phut) > 30`).',
        hint: "SELECT nghi_pham_id, SUM(so_phut) FROM cam_bien_ra_vao GROUP BY nghi_pham_id HAVING SUM(so_phut) > 30;"
      },
      {
        id: 2,
        text: '`JOIN` với lịch sử bán tranh chợ đen để tìm kẻ đã tẩu tán >= 3 bức tranh.',
        hint: "SELECT np.ho_ten, SUM(cb.so_phut) AS tong_phut, COUNT(gd.id) AS so_tranh_ban FROM nghi_pham np JOIN cam_bien_ra_vao cb ON np.id = cb.nghi_pham_id JOIN giao_dich_cho_den gd ON np.id = gd.nghi_pham_id GROUP BY np.id, np.ho_ten HAVING SUM(cb.so_phut) > 30 AND COUNT(gd.id) >= 3;"
      }
    ],
    schemas: [
      {
        name: 'nghi_pham',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã' },
          { name: 'ho_ten', type: 'TEXT', description: 'Tên đối tượng' },
          { name: 'quan_he', type: 'TEXT', description: 'Quan hệ với chủ biệt thự' }
        ]
      },
      {
        name: 'cam_bien_ra_vao',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã' },
          { name: 'nghi_pham_id', type: 'INTEGER', description: 'Mã nghi phạm' },
          { name: 'so_phut', type: 'INTEGER', description: 'Số phút lưu lại' }
        ],
        foreignKeys: [{ fromColumn: 'nghi_pham_id', toTable: 'nghi_pham', toColumn: 'id' }]
      },
      {
        name: 'giao_dich_cho_den',
        columns: [
          { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã giao dịch' },
          { name: 'nghi_pham_id', type: 'INTEGER', description: 'Mã người bán' },
          { name: 'ten_tranh', type: 'TEXT', description: 'Bức tranh bán ra' }
        ],
        foreignKeys: [{ fromColumn: 'nghi_pham_id', toTable: 'nghi_pham', toColumn: 'id' }]
      }
    ],
    starterQuery: `-- Tổng hợp điều tra: Thời gian ở hiện trường > 30p và bán >= 3 tranh
SELECT np.ho_ten, SUM(cb.so_phut) AS tong_thoi_gian, COUNT(gd.id) AS so_tranh 
FROM nghi_pham np 
JOIN cam_bien_ra_vao cb ON np.id = cb.nghi_pham_id 
JOIN giao_dich_cho_den gd ON np.id = gd.nghi_pham_id 
GROUP BY np.id, np.ho_ten 
HAVING SUM(cb.so_phut) > 30 AND COUNT(gd.id) >= 3;`,
    seedSql: [
      `CREATE TABLE nghi_pham (
        id INTEGER PRIMARY KEY,
        ho_ten TEXT,
        quan_he TEXT
      );`,
      `INSERT INTO nghi_pham VALUES
        (1, 'Đỗ Khắc Huân', 'Cháu ruột thừa kế'),
        (2, 'Vũ Thành An', 'Nhà phục chế tranh'),
        (3, 'Lâm Gia Bách', 'Thương gia buôn đồ cổ');`,
      `CREATE TABLE cam_bien_ra_vao (
        id INTEGER PRIMARY KEY,
        nghi_pham_id INTEGER,
        so_phut INTEGER
      );`,
      `INSERT INTO cam_bien_ra_vao VALUES
        (1, 1, 15),
        (2, 2, 20),
        (3, 2, 25),
        (4, 3, 10);`,
      `CREATE TABLE giao_dich_cho_den (
        id INTEGER PRIMARY KEY,
        nghi_pham_id INTEGER,
        ten_tranh TEXT
      );`,
      `INSERT INTO giao_dich_cho_den VALUES
        (1, 1, 'Thiếu Nữ Bên Hoa Huệ'),
        (2, 2, 'Mùa Thu Hà Nội'),
        (3, 2, 'Chân Dung Tự Họa'),
        (4, 2, 'Cảnh Phố Cổ'),
        (5, 3, 'Bình Hoa Hồng');`
    ],
    solution: {
      culprit: 'Vũ Thành An',
      successTitle: 'Vạch Mặt Kẻ Sát Nhân!',
      successMessage: 'Vũ Thành An vừa ở hiện trường 45 phút vừa tẩu tán 3 bức tranh!',
      explanation: 'Vũ Thành An có tổng thời gian lưu lại biệt thự là 45 phút (20 + 25 > 30 phút) và đã đem bán 3 bức tranh cổ ở chợ đen, khớp hoàn toàn với hồ sơ điều tra.',
      referenceQuery: `SELECT np.ho_ten FROM nghi_pham np JOIN cam_bien_ra_vao cb ON np.id = cb.nghi_pham_id JOIN giao_dich_cho_den gd ON np.id = gd.nghi_pham_id GROUP BY np.id, np.ho_ten HAVING SUM(cb.so_phut) > 30 AND COUNT(gd.id) >= 3;`
    }
  }
];
