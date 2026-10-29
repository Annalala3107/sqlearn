import { StageMeta } from './types';

export const ACADEMY_STAGES: StageMeta[] = [
  {
    id: 'beginner',
    order: 1,
    title: 'Giai Đoạn 1: Nhập Môn (Beginner)',
    badge: 'Mầm Non Dữ Liệu',
    color: 'from-emerald-500/20 to-emerald-950/40 text-emerald-400 border-emerald-800',
    tagline: 'Khám Phá Dữ Liệu & Truy Vấn Đơn Bảng',
    description:
      'Làm quen với tư duy khai báo SQL. Học cách trích xuất, lọc điều kiện số và chuỗi, định dạng tên cột và sắp xếp dữ liệu.',
    targetSkill: 'Thành thạo SELECT, FROM, WHERE, LIKE, IN, IS NULL, ORDER BY, LIMIT.',
  },
  {
    id: 'intermediate',
    order: 2,
    title: 'Giai Đoạn 2: Trung Cấp (Intermediate)',
    badge: 'Thợ Phân Tích',
    color: 'from-amber-500/20 to-amber-950/40 text-amber-400 border-amber-800',
    tagline: 'Tổng Hợp & Kết Nối Đa Bảng (Aggregation & JOINs)',
    description:
      'Nắm vững quan hệ giữa các thực thể CSDL. Ghép nối bảng với INNER/LEFT JOIN và tính toán chỉ số kinh doanh với GROUP BY, HAVING.',
    targetSkill: 'Thành thạo COUNT/SUM/AVG, GROUP BY, HAVING, INNER/LEFT JOIN, Subqueries.',
  },
  {
    id: 'advanced',
    order: 3,
    title: 'Giai Đoạn 3: Nâng Cao (Advanced)',
    badge: 'Chuyên Viên Phân Tích',
    color: 'from-purple-500/20 to-purple-950/40 text-purple-400 border-purple-800',
    tagline: 'Biến Đổi Sâu, Window Functions & CTEs',
    description:
      'Giải quyết các bài toán phân tích chuỗi thời gian, tính toán dồn lũy kế, phân vị xếp hạng, rẽ nhánh logic và truy vấn đệ quy.',
    targetSkill: 'Thành thạo ROW_NUMBER, RANK, LEAD/LAG, SUM OVER, WITH CTE, CASE WHEN, TRANSACTION.',
  },
  {
    id: 'expert',
    order: 4,
    title: 'Giai Đoạn 4: Chuyên Gia (Expert)',
    badge: 'Kỹ Sư Dữ Liệu Cấp Cao',
    color: 'from-rose-500/20 to-rose-950/40 text-rose-400 border-rose-800',
    tagline: 'Kiến Trúc Dữ Liệu, Indexing & Tối Ưu Hiệu Năng',
    description:
      'Thiết kế chuẩn hóa CSDL 3NF, đọc kế hoạch thực thi EXPLAIN, tạo B-Tree Index tối ưu truy vấn lớn, Trigger kiểm toán và Pipeline ETL.',
    targetSkill: 'Thành thạo 3NF Normalization, Indexing Mechanics, EXPLAIN QUERY PLAN, Trigger, Views, ETL.',
  },
];
