import { DetectiveCase } from './types';

export const case003: DetectiveCase = {
  id: 'case-003',
  title: 'Bí Ẩn Vụ Ám Sát Trong Biệt Thự Cổ',
  slug: 'am-sat-biet-thu-co',
  difficulty: 'nâng cao',
  category: 'Chuyên Sâu SQL (Subquery, Aggregation & Forensic Evidence)',
  xpReward: 500,
  timeEstimate: '20-30 phút',
  date: '02/10/2004',
  location: 'Biệt thự Hoa Hồng, Đà Lạt',
  brief: `Vào tối ngày 02 tháng 10 năm 2004, trong buổi dạ tiệc mừng thọ lần thứ 70 của triệu phú bất động sản Lý Khắc Cường, thảm kịch kinh hoàng đã xảy ra. Vào lúc 21:20, quản gia hốt hoảng phát hiện ông Lý đã gục chết trên bàn làm việc trong Phòng Đọc Sách tầng 2. Cạnh thi thể là ly rượu vang đỏ còn sót lại độc tố Xyanua cực mạnh.

Cánh cổng biệt thự đã bị khóa chặt do mưa bão lớn, chứng tỏ hung thủ chỉ có thể là 1 trong 5 vị khách thân cận tham dự tiệc tối hôm đó. 

Đội ngũ giám định pháp y và cảnh sát kỹ thuật hình sự đã ghi nhận toàn bộ lịch trình di chuyển trong các phòng, các cuộc gọi điện thoại bí mật ra bên ngoài và mẫu vật chứng tại hiện trường.

Hãy vận dụng toàn bộ kỹ năng SQL nâng cao của một thám tử kỳ cựu để kết hợp chứng cứ ngoại phạm, lịch trình và bằng chứng pháp y nhằm tìm ra tên sát nhân máu lạnh!`,
  clues: [
    'Nạn nhân uống phải chất độc tại "Phòng Đọc Sách" trong khoảng từ 20:50 đến 21:15.',
    'Báo cáo pháp y chỉ ra hung thủ thuận tay trái, chiều cao từ 175cm trở lên.',
    'Có một cuộc gọi bí mật đến số điện thoại đen của chợ đen thuốc độc (+84-90-POISON) vào khoảng 21:00 - 21:10.'
  ],
  objectives: [
    {
      id: 1,
      text: 'Xem báo cáo trong bảng `bang_chung_phap_y` để xác định các đặc điểm sinh trắc học và dấu vết tại hiện trường.',
      hint: "Khảo sát bảng bang_chung_phap_y để tìm kiếm manh mối về vị trí ly rượu, mẫu tóc và dấu vân tay."
    },
    {
      id: 2,
      text: 'Tìm danh sách khách có mặt tại "Phòng Đọc Sách" trong khung giờ gây án bằng cách truy vấn `lich_trinh_di_chuyen`.',
      hint: "Dùng JOIN giữa lich_trinh_di_chuyen và khach_moi, lọc theo phong = 'Phòng Đọc Sách' để xem ai đã bước vào phòng."
    },
    {
      id: 3,
      text: 'Kết hợp điều kiện nhân trắc học (chiều cao, tay thuận) và cuộc gọi trong `cuoc_goi_bi_mat` để vạch trần kẻ thủ ác.',
      hint: "Đối chiếu số điện thoại trong khach_moi với so_goi trong cuoc_goi_bi_mat để nghe lại nội dung ghi âm đáng ngờ."
    }
  ],
  schemas: [
    {
      name: 'khach_moi',
      description: 'Hồ sơ cá nhân và nhân trắc học của các vị khách dự tiệc',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã định danh khách' },
        { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên khách mời' },
        { name: 'quan_he', type: 'TEXT', description: 'Mối quan hệ với nạn nhân' },
        { name: 'chieu_cao', type: 'INTEGER', description: 'Chiều cao (cm)' },
        { name: 'tay_thuan', type: 'TEXT', description: 'Tay thuận (Trái / Phải)' },
        { name: 'so_dien_thoai', type: 'TEXT UNIQUE', description: 'Số điện thoại cá nhân' }
      ]
    },
    {
      name: 'lich_trinh_di_chuyen',
      description: 'Lịch trình di chuyển của từng khách do camera hành lang ghi lại',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã lần di chuyển' },
        { name: 'khach_id', type: 'INTEGER', description: 'Khóa ngoại trỏ đến khach_moi(id)' },
        { name: 'phong', type: 'TEXT', description: 'Phòng khách bước vào' },
        { name: 'gio_vao', type: 'TEXT', description: 'Thời điểm vào phòng (HH:MM)' },
        { name: 'gio_ra', type: 'TEXT', description: 'Thời điểm rời phòng (HH:MM)' }
      ],
      foreignKeys: [
        { fromColumn: 'khach_id', toTable: 'khach_moi', toColumn: 'id' }
      ]
    },
    {
      name: 'cuoc_goi_bi_mat',
      description: 'Dữ liệu các cuộc gọi phát đi từ tổng đài trạm viễn thông biệt thự',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã cuộc gọi' },
        { name: 'so_goi', type: 'TEXT', description: 'Số điện thoại người gọi (khóa ngoại trỏ đến khach_moi.so_dien_thoai)' },
        { name: 'so_nhan', type: 'TEXT', description: 'Số điện thoại người nhận' },
        { name: 'gio_goi', type: 'TEXT', description: 'Thời gian gọi (HH:MM)' },
        { name: 'thoi_luong_giay', type: 'INTEGER', description: 'Thời lượng đàm thoại (giây)' },
        { name: 'noi_dung_ghi_am', type: 'TEXT', description: 'Bản trích sao ghi âm cuộc trò chuyện' }
      ],
      foreignKeys: [
        { fromColumn: 'so_goi', toTable: 'khach_moi', toColumn: 'so_dien_thoai' }
      ]
    },
    {
      name: 'bang_chung_phap_y',
      description: 'Kết luận giám định khoa học hình sự từ hiện trường',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã vật chứng' },
        { name: 'loai_dau_vet', type: 'TEXT', description: 'Vân tay, vết máu, mẫu tóc, chất độc' },
        { name: 'vi_tri', type: 'TEXT', description: 'Nơi phát hiện vật chứng' },
        { name: 'ket_qua_giam_dinh', type: 'TEXT', description: 'Kết luận chi tiết của bác sĩ pháp y' }
      ]
    }
  ],
  starterQuery: `-- Bắt đầu điều tra: Xem danh sách các vị khách có mặt tại biệt thự
SELECT * FROM khach_moi;`,
  seedSql: [
    `CREATE TABLE khach_moi (
      id INTEGER PRIMARY KEY,
      ho_ten TEXT,
      quan_he TEXT,
      chieu_cao INTEGER,
      tay_thuan TEXT,
      so_dien_thoai TEXT
    );`,
    `INSERT INTO khach_moi VALUES
      (1, 'Lý Gia Huy', 'Cháu trai ruột & người thừa kế thứ hai', 179, 'Trái', '0903-888-111'),
      (2, 'Vương Thục Quyên', 'Vợ thứ ba của nạn nhân', 165, 'Phải', '0903-888-222'),
      (3, 'Luật sư Trần Đình Quý', 'Luật sư quản lý di chúc riêng', 176, 'Phải', '0903-888-333'),
      (4, 'Bác sĩ Đỗ Trọng Khoa', 'Bác sĩ gia đình chăm sóc sức khỏe', 174, 'Trái', '0903-888-444'),
      (5, 'Chu Minh Triết', 'Đối tác kinh doanh đang nợ nần', 181, 'Phải', '0903-888-555');`,

    `CREATE TABLE lich_trinh_di_chuyen (
      id INTEGER PRIMARY KEY,
      khach_id INTEGER,
      phong TEXT,
      gio_vao TEXT,
      gio_ra TEXT
    );`,
    `INSERT INTO lich_trinh_di_chuyen VALUES
      (1, 1, 'Đại Sảnh Tiệc', '19:00', '20:45'),
      (2, 2, 'Đại Sảnh Tiệc', '19:00', '21:15'),
      (3, 3, 'Phòng Đọc Sách', '20:00', '20:30'),
      (4, 1, 'Phòng Đọc Sách', '20:55', '21:10'),
      (5, 4, 'Ban Công Tầng 1', '20:50', '21:15'),
      (6, 5, 'Phòng Bida', '20:30', '21:10'),
      (7, 3, 'Vườn Hoa Sau Nhà', '20:40', '21:15'),
      (8, 2, 'Phòng Đọc Sách', '21:18', '21:20');`,

    `CREATE TABLE cuoc_goi_bi_mat (
      id INTEGER PRIMARY KEY,
      so_goi TEXT,
      so_nhan TEXT,
      gio_goi TEXT,
      thoi_luong_giay INTEGER,
      noi_dung_ghi_am TEXT
    );`,
    `INSERT INTO cuoc_goi_bi_mat VALUES
      (1, '0903-888-222', '0908-111-222', '19:45', 120, 'Nói chuyện với thợ may áo dài về tiệc tối.'),
      (2, '0903-888-555', '0912-333-444', '20:45', 60, 'Gọi cho sàn chứng khoán hỏi báo giá cổ phiếu.'),
      (3, '0903-888-111', '+84-90-POISON', '21:06', 28, 'Mọi việc đã xong xuôi. Chất độc tan rất nhanh trong rượu vang. Chuẩn bị đường dây tẩu thoát cho tôi.'),
      (4, '0903-888-333', '0905-777-888', '21:12', 45, 'Xác nhận lịch hẹn công chứng di chúc vào sáng thứ Hai.');`,

    `CREATE TABLE bang_chung_phap_y (
      id INTEGER PRIMARY KEY,
      loai_dau_vet TEXT,
      vi_tri TEXT,
      ket_qua_giam_dinh TEXT
    );`,
    `INSERT INTO bang_chung_phap_y VALUES
      (1, 'Dấu vân tay ngón cái', 'Quai cầm ly rượu vang pha lê', 'Dấu vân tay xoáy thuận bàn tay trái, góc cầm cho thấy nghi phạm thuận tay trái.'),
      (2, 'Sợi tóc', 'Cổ áo nạn nhân', 'Mẫu tóc ngắn nam giới, nhóm máu O, chiều cao ước tính của người đứng đối diện tối thiểu 175cm.'),
      (3, 'Độc chất', 'Cặn đáy ly rượu vang', 'Xyanua dạng lỏng nguyên chất không màu không mùi, gây ngừng tim chỉ sau 3-5 phút ngấm thuốc.');`
  ],
  solution: {
    culprit: 'Lý Gia Huy',
    successTitle: 'Thần Thám Phá Án! Tên Sát Nhân Máu Lạnh Sa Lưới!',
    successMessage: 'Tài trí xuất chúng! Trước chuỗi bằng chứng pháp y không thể chối cãi, người cháu trai Lý Gia Huy đã phải thú nhận tội ác tày trời nhằm chiếm đoạt tài sản thừa kế.',
    explanation: `Phân tích suy luận:
1. Kết quả \`bang_chung_phap_y\` xác định: hung thủ thuận tay trái, chiều cao >= 175cm.
2. Kiểm tra \`khach_moi\`, người thỏa mãn cả 2 điều kiện này chỉ có duy nhất Lý Gia Huy (cao 179cm, thuận tay trái).
3. Kiểm tra \`lich_trinh_di_chuyen\`, Lý Gia Huy ở một mình cùng nạn nhân trong 'Phòng Đọc Sách' từ 20:55 đến 21:10 (đúng khung giờ độc phát tác).
4. Kiểm tra \`cuoc_goi_bi_mat\`, đúng lúc 21:06, số điện thoại của Lý Gia Huy đã gọi cho đầu nậu thuốc độc xác nhận đã bỏ chất độc vào ly rượu vang.`,
    referenceQuery: `SELECT km.ho_ten, km.chieu_cao, km.tay_thuan, lt.phong, lt.gio_vao, lt.gio_ra, cg.gio_goi, cg.noi_dung_ghi_am
FROM khach_moi km
JOIN lich_trinh_di_chuyen lt ON km.id = lt.khach_id
JOIN cuoc_goi_bi_mat cg ON km.so_dien_thoai = cg.so_goi
WHERE lt.phong = 'Phòng Đọc Sách' 
  AND km.tay_thuan = 'Trái' 
  AND km.chieu_cao >= 175;`
  }
};
