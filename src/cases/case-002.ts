import { DetectiveCase } from './types';

export const case002: DetectiveCase = {
  id: 'case-002',
  title: 'Vụ Trộm Kim Cương Bảo Tàng Hoàng Gia',
  slug: 'trom-kim-cuong-bao-tang',
  difficulty: 'trung bình',
  category: 'Trung Cấp SQL (INNER JOIN, WHERE, DATETIME)',
  xpReward: 250,
  timeEstimate: '15-20 phút',
  date: '14/04/1995',
  location: 'Bảo tàng Lịch sử & Cổ vật Hoàng Gia',
  brief: `Viên kim cương vô giá "Ngôi Sao Phương Đông" trưng bày tại Phòng Bảo Vật số 01 đã bị đánh cắp trong đêm 14 rạng sáng 15 tháng 4. Hệ thống điện của bảo tàng đột ngột bị sập nguồn trong 15 phút (từ 23:40 đến 23:55). Khi máy phát điện dự phòng khởi động lại, chiếc lồng kính cường lực đã bị cắt khóa tinh vi và viên kim cương biến mất.

Cảnh sát nhận định đây là vụ trộm có sự tiếp tay của nội gián. Kẻ trộm phải có thẻ từ an ninh để mở cửa phòng trưng bày trong thời gian cúp điện. Bên cạnh đó, điều tra tài chính phát hiện sáng hôm sau có một nhân viên bảo tàng nhận được số tiền chuyển khoản bất thường lên tới 2 tỷ đồng.

Hãy sử dụng các kỹ thuật JOIN bảng và lọc dữ liệu để tìm ra nội gián đã thực hiện phi vụ này!`,
  clues: [
    'Phòng xảy ra vụ trộm là "Phòng Bảo Vật 01".',
    'Thời điểm kẻ trộm vào phòng là từ 23:40 đến 23:55 đêm ngày 1995-04-14.',
    'Kẻ trộm là nhân viên bảo tàng và nhận được số tiền chuyển khoản bất minh hơn 1 tỷ đồng vào sáng ngày 1995-04-15.'
  ],
  objectives: [
    {
      id: 1,
      text: 'Kiểm tra `nhat_ky_quet_the` tại "Phòng Bảo Vật 01" trong khoảng thời gian cúp điện (23:40 đến 23:55).',
      hint: "Sử dụng WHERE phong = 'Phòng Bảo Vật 01' kết hợp toán tử BETWEEN ... AND ... với cột thoi_gian."
    },
    {
      id: 2,
      text: 'JOIN bảng `nhat_ky_quet_the` với `nhan_vien` bằng `ma_the` để xác định danh tính nhân viên đã quẹt thẻ.',
      hint: "Sử dụng cú pháp: FROM nhat_ky_quet_the JOIN nhan_vien ON nhat_ky_quet_the.ma_the = nhan_vien.ma_the."
    },
    {
      id: 3,
      text: 'Đối chiếu với bảng `giao_dich_ngan_hang` để kiểm tra các giao dịch nhận tiền bất minh lớn.',
      hint: "Lọc bảng giao_dich_ngan_hang với điều kiện so_tien lớn và đối chiếu ho_ten_chu_tk với danh sách nghi vấn."
    }
  ],
  schemas: [
    {
      name: 'nhan_vien',
      description: 'Danh sách cán bộ nhân viên công tác tại bảo tàng',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã nhân viên' },
        { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên nhân viên' },
        { name: 'chuc_vu', type: 'TEXT', description: 'Vị trí công tác' },
        { name: 'phong_ban', type: 'TEXT', description: 'Bộ phận trực thuộc' },
        { name: 'ma_the', type: 'TEXT UNIQUE', description: 'Mã thẻ từ quẹt cửa kiểm soát' }
      ]
    },
    {
      name: 'nhat_ky_quet_the',
      description: 'Dữ liệu thời gian thực từ đầu đọc thẻ từ các phòng chức năng',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã lần quẹt thẻ' },
        { name: 'ma_the', type: 'TEXT', description: 'Mã thẻ quẹt (khóa ngoại trỏ đến nhan_vien.ma_the)' },
        { name: 'phong', type: 'TEXT', description: 'Tên phòng quét thẻ' },
        { name: 'thoi_gian', type: 'TEXT', description: 'Thời điểm quẹt thẻ (YYYY-MM-DD HH:MM:SS)' },
        { name: 'trang_thai', type: 'TEXT', description: 'Cho phép (Hợp lệ) hoặc Từ chối' }
      ],
      foreignKeys: [
        { fromColumn: 'ma_the', toTable: 'nhan_vien', toColumn: 'ma_the' }
      ]
    },
    {
      name: 'giao_dich_ngan_hang',
      description: 'Lịch sử giao dịch tài chính bị cơ quan điều tra phong tỏa và sao kê',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã giao dịch' },
        { name: 'ho_ten_chu_tk', type: 'TEXT', description: 'Chủ tài khoản thụ hưởng (khóa ngoại trỏ đến nhan_vien.ho_ten)' },
        { name: 'so_tien', type: 'INTEGER', description: 'Số tiền giao dịch (VND)' },
        { name: 'thoi_gian', type: 'TEXT', description: 'Thời điểm nhận tiền' },
        { name: 'noi_dung', type: 'TEXT', description: 'Nội dung đính kèm giao dịch' }
      ],
      foreignKeys: [
        { fromColumn: 'ho_ten_chu_tk', toTable: 'nhan_vien', toColumn: 'ho_ten' }
      ]
    }
  ],
  starterQuery: `-- Bắt đầu điều tra: Kiểm tra danh sách nhân viên và nhật ký quẹt thẻ
SELECT * FROM nhan_vien;`,
  seedSql: [
    `CREATE TABLE nhan_vien (
      id INTEGER PRIMARY KEY,
      ho_ten TEXT,
      chuc_vu TEXT,
      phong_ban TEXT,
      ma_the TEXT UNIQUE
    );`,
    `INSERT INTO nhan_vien VALUES
      (1, 'GS. Hà Văn Vĩnh', 'Giám đốc chuyên môn', 'Ban Giám đốc', 'CARD-001'),
      (2, 'Trần Thu Thảo', 'Bảo quản viên cổ vật', 'Phòng Hiện vật', 'CARD-002'),
      (3, 'Đoàn Quốc Bảo', 'Kỹ thuật viên hệ thống camera & điện lực', 'Tổ Kỹ thuật an ninh', 'CARD-003'),
      (4, 'Lâm Thanh Hải', 'Đội trưởng bảo vệ ca đêm', 'Đội Bảo vệ', 'CARD-004'),
      (5, 'Ngô Gia Huy', 'Nhân viên vệ sinh ca đêm', 'Tổ Hậu cần', 'CARD-005'),
      (6, 'Hoàng Minh Tuấn', 'Hướng dẫn viên cao cấp', 'Phòng Thuyết minh', 'CARD-006');`,

    `CREATE TABLE nhat_ky_quet_the (
      id INTEGER PRIMARY KEY,
      ma_the TEXT,
      phong TEXT,
      thoi_gian TEXT,
      trang_thai TEXT
    );`,
    `INSERT INTO nhat_ky_quet_the VALUES
      (1, 'CARD-001', 'Phòng Giám đốc', '1995-04-14 18:30:12', 'Hợp lệ'),
      (2, 'CARD-004', 'Cổng Chính', '1995-04-14 20:00:00', 'Hợp lệ'),
      (3, 'CARD-005', 'Hành lang Tầng 1', '1995-04-14 21:15:30', 'Hợp lệ'),
      (4, 'CARD-002', 'Phòng Hiện vật', '1995-04-14 22:10:00', 'Hợp lệ'),
      (5, 'CARD-004', 'Phòng Bảo Vật 01', '1995-04-14 22:30:00', 'Hợp lệ'),
      (6, 'CARD-003', 'Phòng Máy Phát Điện', '1995-04-14 23:35:10', 'Hợp lệ'),
      (7, 'CARD-003', 'Phòng Bảo Vật 01', '1995-04-14 23:46:18', 'Hợp lệ'),
      (8, 'CARD-005', 'Khu vệ sinh', '1995-04-14 23:50:00', 'Hợp lệ'),
      (9, 'CARD-004', 'Phòng Bảo Vật 01', '1995-04-14 23:58:20', 'Hợp lệ'),
      (10, 'CARD-003', 'Cửa Thoát Hiểm Phía Tây', '1995-04-15 00:05:12', 'Hợp lệ');`,

    `CREATE TABLE giao_dich_ngan_hang (
      id INTEGER PRIMARY KEY,
      ho_ten_chu_tk TEXT,
      so_tien INTEGER,
      thoi_gian TEXT,
      noi_dung TEXT
    );`,
    `INSERT INTO giao_dich_ngan_hang VALUES
      (501, 'Trần Thu Thảo', 15000000, '1995-04-14 10:00:00', 'Lương tháng 04'),
      (502, 'Lâm Thanh Hải', 8500000, '1995-04-14 10:05:00', 'Lương tháng 04'),
      (503, 'Đoàn Quốc Bảo', 9200000, '1995-04-14 10:10:00', 'Lương tháng 04'),
      (504, 'Ngô Gia Huy', 6000000, '1995-04-14 10:15:00', 'Lương tháng 04'),
      (505, 'Đoàn Quốc Bảo', 2000000000, '1995-04-15 08:30:00', 'Thanh toan hop dong dac biet tu tai khoan Thuy Si - ST-992'),
      (506, 'Hoàng Minh Tuấn', 20000000, '1995-04-15 09:12:00', 'Tien thuong huong dan tour');`
  ],
  solution: {
    culprit: 'Đoàn Quốc Bảo',
    successTitle: 'Phá Án Thành Công! Nội Gián Đã Bị Vạch Trần!',
    successMessage: 'Tài tình lắm thám tử! Kỹ thuật viên Đoàn Quốc Bảo đã không thể chối cãi khi bản đối soát thẻ từ và dòng tiền bất minh được phơi bày.',
    explanation: `Phân tích suy luận:
1. Bạn kiểm tra \`nhat_ky_quet_the\` và phát hiện trong khoảng thời gian cúp điện (23:40 - 23:55), chỉ có duy nhất thẻ \`CARD-003\` quẹt vào 'Phòng Bảo Vật 01' lúc 23:46:18.
2. Dùng \`JOIN\` với bảng \`nhan_vien\`, thẻ \`CARD-003\` thuộc về Đoàn Quốc Bảo - Kỹ thuật viên hệ thống an ninh và điện lực. Gã đã tự ngắt cầu dao để tạo hiện trường giả cúp điện.
3. Kiểm tra \`giao_dich_ngan_hang\`, đúng 8h30 sáng hôm sau gã nhận 2,000,000,000 VND từ một tài khoản ngoại quốc nặc danh.`,
    referenceQuery: `SELECT nv.ho_ten, nv.chuc_vu, nk.phong, nk.thoi_gian, gd.so_tien, gd.noi_dung
FROM nhat_ky_quet_the nk
JOIN nhan_vien nv ON nk.ma_the = nv.ma_the
LEFT JOIN giao_dich_ngan_hang gd ON nv.ho_ten = gd.ho_ten_chu_tk
WHERE nk.phong = 'Phòng Bảo Vật 01' 
  AND nk.thoi_gian BETWEEN '1995-04-14 23:40:00' AND '1995-04-14 23:55:00';`
  }
};
