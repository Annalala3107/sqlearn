export interface BridgeLink {
  lessonId: string;
  lessonTitle: string;
  caseId: string;
  caseTitle: string;
  skillName: string;
  casePitch: string;
  lessonPitch: string;
}

export const BRIDGE_LINKS: BridgeLink[] = [
  {
    lessonId: 'sql-101',
    lessonTitle: 'BÀI 1: SELECT & FROM - Lời Chào Sân Với Dữ Liệu 👋',
    caseId: 'case-001',
    caseTitle: 'Vụ án 01: Chiếc Cặp Mất Tích Tại Quán Bar Đêm',
    skillName: 'SELECT & FROM',
    casePitch: 'Khám xét hiện trường quán bar và trích xuất danh sách nhân chứng!',
    lessonPitch: 'Chưa quen cấu trúc bảng? Học bài SELECT & FROM cơ bản ngay.',
  },
  {
    lessonId: 'sql-102',
    lessonTitle: 'BÀI 2: LỌC DỮ LIỆU (WHERE) - Bộ Lọc Thần Kỳ 🔍',
    caseId: 'case-002',
    caseTitle: 'Vụ án 02: Vòng Ngọc Bích Ở Khách Sạn Caravelle',
    skillName: 'WHERE & Toán Tử So Sánh',
    casePitch: 'Áp dụng bộ lọc WHERE lọc ngay nữ nghi phạm cao trên 1m68!',
    lessonPitch: 'Chưa biết cách dùng mệnh đề WHERE? Xem lý thuyết chi tiết tại đây.',
  },
  {
    lessonId: 'sql-103',
    lessonTitle: 'BÀI 3: AND, OR, NOT - Kết Hợp Điều Kiện 🧩',
    caseId: 'case-003',
    caseTitle: 'Vụ án 03: Bóng Đen Đường Đồng Khởi',
    skillName: 'AND, OR, NOT',
    casePitch: 'Khoanh vùng chiếc xe gây tai nạn với nhiều điều kiện kết hợp!',
    lessonPitch: 'Ôn tập cách kết hợp logic AND/OR/NOT để lọc dữ liệu phức tạp.',
  },
  {
    lessonId: 'sql-104',
    lessonTitle: 'BÀI 4: ORDER BY & LIMIT - Bảng Vàng Danh Dự 🏆',
    caseId: 'case-004',
    caseTitle: 'Vụ án 04: Kẻ Lừa Đảo Ga Sài Gòn',
    skillName: 'ORDER BY & LIMIT',
    casePitch: 'Sắp xếp danh sách tiền án tìm ra tên tội phạm sừng sỏ nhất!',
    lessonPitch: 'Xem hướng dẫn sắp xếp tăng giảm và giới hạn số lượng kết quả.',
  },
  {
    lessonId: 'sql-105',
    lessonTitle: '🎬 MINI-PROJECT GIAI ĐOẠN 1: Báo Cáo Doanh Thu Phim',
    caseId: 'case-005',
    caseTitle: 'Vụ án 05: Cuộc Ẩu Đả Bến Bạch Đằng',
    skillName: 'Tổng Hợp Giai Đoạn 1',
    casePitch: 'Điều tra kiện hàng lậu nặng nhất bến cảng bằng kỹ năng Giai đoạn 1!',
    lessonPitch: 'Ôn luyện toàn bộ kỹ năng cơ bản Giai đoạn 1 qua Mini-Project.',
  },
  {
    lessonId: 'sql-201',
    lessonTitle: 'BÀI 1: AGGREGATE FUNCTIONS - "Chiếc Máy Tính Bỏ Túi" 🧮',
    caseId: 'case-008',
    caseTitle: 'Vụ án 08: Đuổi Hình Bắt Chữ',
    skillName: 'COUNT, SUM, AVG',
    casePitch: 'Tính toán tổng số tiền ngân phiếu bị tẩu tán trong đêm!',
    lessonPitch: 'Xem lại cách tính tổng SUM và đếm COUNT với hàm tổng hợp.',
  },
  {
    lessonId: 'sql-202',
    lessonTitle: 'BÀI 2: GROUP BY & HAVING - Nghệ Thuật Chia Để Trị 📦',
    caseId: 'case-013',
    caseTitle: 'Vụ án 13: Cuộc Gọi Tống Tiền Nửa Đêm',
    skillName: 'GROUP BY & HAVING',
    casePitch: 'Gom nhóm số điện thoại và dùng HAVING COUNT(*) > 5 bắt kẻ tống tiền!',
    lessonPitch: 'Chưa phân biệt được WHERE và HAVING? Đọc bài học GROUP BY ngay.',
  },
  {
    lessonId: 'sql-203',
    lessonTitle: 'BÀI 3: INNER & LEFT JOIN - Tuyệt Chiêu Ghép "Lego" 🧩',
    caseId: 'case-012',
    caseTitle: 'Vụ án 12: Bằng Chứng Ngoại Phạm Giả',
    skillName: 'LEFT JOIN & IS NULL',
    casePitch: 'Dùng LEFT JOIN ghép danh sách nghi phạm với vé rạp Rex để lật tẩy kẻ nói dối!',
    lessonPitch: 'Cần hiểu rõ cách hoạt động của INNER và LEFT JOIN? Nhấp vào đây.',
  },
  {
    lessonId: 'sql-204',
    lessonTitle: 'BÀI 4: CASE WHEN - Tạo Quy Luật Của Riêng Bạn 🏷️',
    caseId: 'case-016',
    caseTitle: 'Vụ án 16: Kẻ Đứng Sau Màn Gió',
    skillName: 'CASE WHEN & Phân Cấp',
    casePitch: 'Truy vết cấu trúc thứ bậc ngầm gián tiếp điều khiển đàn em!',
    lessonPitch: 'Học cách chia nhánh logic IF-THEN-ELSE với cú pháp CASE WHEN.',
  },
  {
    lessonId: 'sql-205',
    lessonTitle: '🎬 MINI-PROJECT GIAI ĐOẠN 2: Báo Cáo E-Commerce',
    caseId: 'case-014',
    caseTitle: 'Vụ án 14: Rửa Tiền Tại Đại Thế Giới',
    skillName: 'Multi-JOIN & GROUP BY',
    casePitch: 'Gom nhóm giao dịch sòng bạc và lọc ra kẻ rửa trên 100.000 USD!',
    lessonPitch: 'Thực hành kết hợp JOIN, GROUP BY và CASE WHEN trong Mini-Project.',
  },
  {
    lessonId: 'sql-301',
    lessonTitle: 'BÀI 1: SUBQUERIES & CTES - Nghệ Thuật Viết Code Đẳng Cấp 🚀',
    caseId: 'case-022',
    caseTitle: 'Vụ án 22: Dấu Chân Sát Nhân',
    skillName: 'Common Table Expressions (WITH)',
    casePitch: 'Viết 2 khối CTE kết hợp mẫu máu AB- và giám định vân tay bắt sát thủ!',
    lessonPitch: 'Tìm hiểu sức mạnh của bảng tạm WITH (CTE) để viết code sạch và module hóa.',
  },
  {
    lessonId: 'sql-302',
    lessonTitle: 'BÀI 2: WINDOW FUNCTIONS 1 - Bảng Xếp Hạng Thông Minh 🏅',
    caseId: 'case-025',
    caseTitle: 'Vụ án 25: Thao Túng Sàn Vàng',
    skillName: 'Window Functions (RANK, OVER)',
    casePitch: 'Dùng Window Function tính trung bình trượt vạch mặt kẻ gom vàng thao túng giá!',
    lessonPitch: 'Học cách tính xếp hạng RANK() mà vẫn giữ nguyên số lượng dòng dữ liệu.',
  },
  {
    lessonId: 'sql-304',
    lessonTitle: 'BÀI 4: XỬ LÝ CHUỖI & THỜI GIAN - Vũ Khí Làm Sạch Dữ Liệu 🧹',
    caseId: 'case-026',
    caseTitle: 'Vụ án 26: Mật Mã Bức Điện Tín',
    skillName: 'Xử lý chuỗi (SUBSTR, REPLACE)',
    casePitch: 'Dùng REPLACE lọc ký tự nhiễu # và trích xuất 4 ký tự cuối mã vận đơn!',
    lessonPitch: 'Nắm vững các hàm cắt chuỗi SUBSTR, REPLACE và trích xuất ngày tháng.',
  },
  {
    lessonId: 'sql-405',
    lessonTitle: '🎬 TỐT NGHIỆP: Thiết Kế Database Cho App Đặt Xe (Ride-Hailing) 🚖',
    caseId: 'case-030',
    caseTitle: 'Vụ án 30: Chuyên Án Bóng Ma Ngầm (Boss Level)',
    skillName: 'Đại Kết Cục: Toàn Bộ Kỹ Năng Đỉnh Cao',
    casePitch: 'Trận đánh cuối cùng: Kết hợp CTEs, Window Function và Multi-JOIN để hạ gục Trùm Bóng Ma!',
    lessonPitch: 'Chinh phục Đồ Án Tốt Nghiệp thiết kế toàn bộ CSDL thực chiến từ con số 0.',
  },
];

export class BridgeService {
  public static getRelatedCaseForLesson(lessonId: string): BridgeLink | undefined {
    return BRIDGE_LINKS.find((b) => b.lessonId === lessonId);
  }

  public static getRelatedLessonForCase(caseId: string): BridgeLink | undefined {
    return BRIDGE_LINKS.find((b) => b.caseId === caseId);
  }
}
