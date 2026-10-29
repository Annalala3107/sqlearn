import { DetectiveCase } from './types';

export const case001: DetectiveCase = {
  id: 'case-001',
  title: 'Chiếc Cặp Mất Tích Tại Quán Bar Đêm',
  slug: 'chiec-cap-mat-tich',
  difficulty: 'dễ',
  category: 'Nhập Môn SQL (SELECT, WHERE, LIKE)',
  xpReward: 100,
  timeEstimate: '10-15 phút',
  date: '20/11/1988',
  location: 'Quán bar Đêm Không Ngủ, Quận 1',
  brief: `Đêm ngày 20 tháng 11 năm 1988, trong tiếng nhạc Jazz và làn khói thuốc mờ ảo tại quán bar "Đêm Không Ngủ", một chiếc cặp da đen chứa tài liệu thương mại tối mật của tập đoàn Viễn Đông đã không cánh mà bay. 
  
Theo lời khai sơ bộ từ người pha chế, vào khoảng 22 giờ, một gã đàn ông mặc áo măng tô sẫm màu đã vội vã rời khỏi quán qua cửa sau. Đội điều tra đã thu thập dữ liệu hiện trường, danh sách khách có mặt và ghi nhận lời thẩm vấn. 

Là thám tử điều tra phụ trách vụ này, nhiệm vụ của bạn là dùng các truy vấn SQL để tra cứu hiện trường, khoanh vùng nghi phạm và vạch mặt kẻ trộm.`,
  clues: [
    'Vụ án xảy ra tại địa điểm có tên liên quan đến quán bar.',
    'Nhân chứng nhớ gã đàn ông mặc áo măng tô và có vết sẹo đặc trưng trên mặt.',
    'Bản ghi lời khai sẽ lật tẩy sơ hở của thủ phạm khi bị thẩm vấn.'
  ],
  objectives: [
    {
      id: 1,
      text: 'Tìm bản ghi hiện trường vụ trộm tại quán bar trong bảng `hien_truong` để lấy mô tả chi tiết.',
      hint: "Sử dụng SELECT * FROM hien_truong; sau đó dùng WHERE dia_diem LIKE '%...%' với tên địa điểm được đề cập trong hồ sơ."
    },
    {
      id: 2,
      text: 'Lọc danh sách `nghi_pham` để tìm đối tượng có trang phục và đặc điểm nhân dạng khớp với lời khai nhân chứng.',
      hint: "Kiểm tra các cột trang_phuc và dac_diem_nhan_dang trong bảng nghi_pham bằng mệnh đề WHERE kết hợp toán tử LIKE và AND."
    },
    {
      id: 3,
      text: 'Xem `loi_khai` của nghi phạm khớp nhất để xác nhận hành vi phạm tội.',
      hint: "Tra cứu bảng loi_khai với điều kiện nghi_pham_id khớp với id của nghi phạm bạn vừa khoanh vùng."
    }
  ],
  schemas: [
    {
      name: 'hien_truong',
      description: 'Ghi nhận các vụ án và manh mối thu thập từ hiện trường trong thành phố',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã số hồ sơ vụ án' },
        { name: 'ngay', type: 'TEXT', description: 'Ngày xảy ra sự việc (YYYY-MM-DD)' },
        { name: 'loai_an', type: 'TEXT', description: 'Loại hình tội phạm (Trộm cắp, Giết người, Tống tiền)' },
        { name: 'dia_diem', type: 'TEXT', description: 'Địa điểm xảy ra vụ án' },
        { name: 'mo_ta', type: 'TEXT', description: 'Ghi chép chi tiết từ cảnh sát tuần tra' }
      ]
    },
    {
      name: 'nghi_pham',
      description: 'Hồ sơ nhân thân của các đối tượng nghi vấn có mặt gần khu vực hiện trường',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã số nhận diện nghi phạm' },
        { name: 'ho_ten', type: 'TEXT', description: 'Họ và tên đối tượng' },
        { name: 'gioi_tinh', type: 'TEXT', description: 'Giới tính (Nam / Nữ)' },
        { name: 'chieu_cao', type: 'INTEGER', description: 'Chiều cao ước tính (cm)' },
        { name: 'trang_phuc', type: 'TEXT', description: 'Trang phục đối tượng mặc tối hôm đó' },
        { name: 'dac_diem_nhan_dang', type: 'TEXT', description: 'Đặc điểm ngoại hình đặc biệt' }
      ]
    },
    {
      name: 'loi_khai',
      description: 'Biên bản lấy lời khai chi tiết tại đồn cảnh sát',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY', description: 'Mã biên bản' },
        { name: 'nghi_pham_id', type: 'INTEGER', description: 'Khóa ngoại trỏ đến nghi_pham(id)' },
        { name: 'noi_dung_loi_khai', type: 'TEXT', description: 'Toàn văn lời khai của đối tượng' }
      ],
      foreignKeys: [
        { fromColumn: 'nghi_pham_id', toTable: 'nghi_pham', toColumn: 'id' }
      ]
    }
  ],
  starterQuery: `-- Bắt đầu điều tra: Khảo sát sơ bộ hiện trường các vụ án gần đây
SELECT * FROM hien_truong;`,
  seedSql: [
    `CREATE TABLE hien_truong (
      id INTEGER PRIMARY KEY,
      ngay TEXT,
      loai_an TEXT,
      dia_diem TEXT,
      mo_ta TEXT
    );`,
    `INSERT INTO hien_truong VALUES 
      (1, '1988-11-18', 'Trộm cắp', 'Khách sạn Caravelle', 'Mất một vòng ngọc bích trong phòng 304. Cửa sổ bị cạy từ bên ngoài.'),
      (2, '1988-11-19', 'Ẩu đả', 'Bến cảng Bạch Đằng', 'Vụ xô xát giữa hai nhóm bốc vác, không có thiệt hại tính mạng.'),
      (3, '1988-11-20', 'Trộm cắp', 'Quán bar Đêm Không Ngủ', 'Một chiếc cặp tài liệu tuyệt mật bị lấy mất lúc 22:00. Nhân chứng thấy gã đàn ông mặc áo măng tô sẫm màu có vết sẹo dài bên má trái tháo chạy.'),
      (4, '1988-11-20', 'Cướp giật', 'Đường Đồng Khởi', 'Một phụ nữ bị giật túi xách khi đang chờ taxi.'),
      (5, '1988-11-21', 'Trộm cắp', 'Ngân hàng Đông Dương', 'Kẻ trộm đột nhập vào kho chứa thư tín nhưng bị chuông báo động dọa chạy.');`,
    
    `CREATE TABLE nghi_pham (
      id INTEGER PRIMARY KEY,
      ho_ten TEXT,
      gioi_tinh TEXT,
      chieu_cao INTEGER,
      trang_phuc TEXT,
      dac_diem_nhan_dang TEXT
    );`,
    `INSERT INTO nghi_pham VALUES
      (101, 'Vũ Đức Nam', 'Nam', 172, 'Áo khoác da đen, quần jean', 'Đeo kính râm, hình xăm rồng trên cổ tay'),
      (102, 'Trần Mạnh Long', 'Nam', 178, 'Áo măng tô kaki xám, mũ phớt', 'Vết sẹo dài 5cm bên má trái, giọng khàn'),
      (103, 'Lê Hoàng Phong', 'Nam', 175, 'Áo vest đen, cà vạt đỏ', 'Râu quai nón, mắt đeo kính cận'),
      (104, 'Nguyễn Văn Toàn', 'Nam', 168, 'Áo măng tô dạ đen, găng tay da', 'Sẹo nhỏ ở mu bàn tay phải'),
      (105, 'Bùi Thị Thanh Nga', 'Nữ', 162, 'Váy dạ hội đỏ', 'Nốt ruồi duyên dưới cằm trái'),
      (106, 'Phạm Quốc Hùng', 'Nam', 182, 'Áo khoác gió xanh navy', 'Có vết bớt lớn sau gáy');`,

    `CREATE TABLE loi_khai (
      id INTEGER PRIMARY KEY,
      nghi_pham_id INTEGER,
      noi_dung_loi_khai TEXT
    );`,
    `INSERT INTO loi_khai VALUES
      (201, 101, 'Tối hôm đó tôi ngồi uống bia ở góc phố với mấy người bạn đến tận 23 giờ, có chủ quán làm chứng.'),
      (202, 102, 'Tôi chỉ ghé vào quán bar Đêm Không Ngủ để gặp đối tác kinh doanh. Nhưng khi phát hiện chiếc cặp tài liệu để hớ hênh trên bàn VIP, lòng tham nổi lên nên tôi đã ôm nó lẻn ra lối thoát hiểm phía sau.'),
      (203, 103, 'Tôi đang bận xử lý sổ sách kế toán trong văn phòng tầng 2 suốt cả buổi tối.'),
      (204, 104, 'Đúng là tôi có mặc áo măng tô, nhưng tôi đến ga xe lửa lúc 21h30 để đón người thân từ Hà Nội vào.'),
      (205, 105, 'Tôi chỉ ngồi nghe ca sĩ hát bài ca phòng trà, không hề để ý ai cầm cặp hay đi đâu.');`
  ],
  solution: {
    culprit: 'Trần Mạnh Long',
    successTitle: 'Phá Án Thành Công! Thủ Phạm Đã Lộ Diện!',
    successMessage: 'Xuất sắc lắm, Thám tử! Trần Mạnh Long đã phải cúi đầu nhận tội trước những bằng chứng thép bạn thu thập được.',
    explanation: `Phân tích suy luận:
1. Bạn tra cứu bảng \`hien_truong\` và phát hiện lời khai nhân chứng tại 'Quán bar Đêm Không Ngủ': thủ phạm là người đàn ông mặc "áo măng tô", có "vết sẹo dài bên má trái".
2. Tra cứu bảng \`nghi_pham\`, đối tượng có đặc điểm trùng khớp 100% chính là Trần Mạnh Long (ID: 102).
3. Truy vấn bảng \`loi_khai\` của Trần Mạnh Long xác nhận lời thú tội gã đã ôm chiếc cặp lẻn ra cửa sau.`,
    referenceQuery: `SELECT np.ho_ten, np.trang_phuc, np.dac_diem_nhan_dang, lk.noi_dung_loi_khai 
FROM nghi_pham np 
JOIN loi_khai lk ON np.id = lk.nghi_pham_id 
WHERE np.trang_phuc LIKE '%măng tô%' AND np.dac_diem_nhan_dang LIKE '%sẹo%má trái%';`
  }
};
