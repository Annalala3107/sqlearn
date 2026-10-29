import { StageMeta } from './types';

export const ACADEMY_STAGES: StageMeta[] = [
  {
    id: 'beginner',
    order: 1,
    title: 'Giai Đoạn 1: Nhập Môn (Beginner)',
    badge: 'Người Gác Cổng Dữ Liệu',
    color: 'from-emerald-500/20 to-emerald-950/40 text-emerald-400 border-emerald-800',
    tagline: 'Bước đầu làm quen với dữ liệu & Chiếc tủ hồ sơ',
    description:
      'Hiểu cơ sở dữ liệu đơn giản là những chiếc "tủ hồ sơ" ngăn nắp. Dùng SQL như một "câu thần chú" để gọi chính xác những tài liệu mình cần.',
    targetSkill: 'Thành thạo SELECT, FROM, WHERE, AND, OR, NOT, ORDER BY, LIMIT.',
  },
  {
    id: 'intermediate',
    order: 2,
    title: 'Giai Đoạn 2: Trung Cấp (Intermediate)',
    badge: 'Bậc Thầy Kết Nối',
    color: 'from-amber-500/20 to-amber-950/40 text-amber-400 border-amber-800',
    tagline: 'Phân tích dữ liệu & Tuyệt chiêu ghép Lego đa bảng',
    description:
      'Bắt đầu công việc thực sự của một Data Analyst: Nhào nặn dữ liệu với hàm tổng hợp, chia để trị với GROUP BY/HAVING và ghép Lego với JOINs.',
    targetSkill: 'Thành thạo COUNT, SUM, AVG, GROUP BY, HAVING, INNER/LEFT JOIN, CASE WHEN.',
  },
  {
    id: 'advanced',
    order: 3,
    title: 'Giai Đoạn 3: Nâng Cao (Advanced)',
    badge: 'Bậc Thầy Logic',
    color: 'from-purple-500/20 to-purple-950/40 text-purple-400 border-purple-800',
    tagline: 'Mở khóa "Siêu năng lực" SQL & Du hành thời gian',
    description:
      'Vượt qua giới hạn GROUP BY thông thường. Viết code sạch với CTEs, xếp hạng không gộp dòng với Window Functions, so sánh thời gian với LAG/LEAD.',
    targetSkill: 'Thành thạo Subqueries, WITH CTEs, ROW_NUMBER/RANK, LAG/LEAD, String & Date functions.',
  },
  {
    id: 'expert',
    order: 4,
    title: 'Giai Đoạn 4: Chuyên Gia (Expert)',
    badge: 'Chứng Nhận SQL Master',
    color: 'from-rose-500/20 to-rose-950/40 text-rose-400 border-rose-800',
    tagline: 'Thiết kế nền móng, bảo mật & Tối ưu hóa hệ thống',
    description:
      'Vùng đất của Data Engineer và DBA: Thao tác DML an toàn, kiến tạo bảng DDL & Ràng buộc Constraints, tạo VIEW bảo mật và cắm INDEX siêu tốc.',
    targetSkill: 'Thành thạo DML (INSERT/UPDATE/DELETE), DDL (CREATE TABLE/CASCADE), VIEW, TRIGGER, INDEXING.',
  },
];
