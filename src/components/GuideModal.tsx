import React, { useState } from 'react';
import {
  X,
  BookOpen,
  GraduationCap,
  Briefcase,
  Terminal,
  Database,
  KeyRound,
  Link as LinkIcon,
  Play,
  Copy,
  Check,
  Sparkles,
  Lightbulb,
  Keyboard,
  ArrowRight,
  ShieldAlert,
  Code2,
  Wand2,
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAcademy?: () => void;
  onNavigateToCases?: () => void;
  onRestartTour?: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAcademy,
  onNavigateToCases,
  onRestartTour,
}) => {
  const [activeTab, setActiveTab] = useState<'start' | 'tools' | 'schema' | 'cheatsheet'>('start');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const cheatSheetItems = [
    {
      keyword: 'SELECT ... FROM',
      meaning: 'Lấy dữ liệu từ các cột trong bảng',
      example: 'SELECT ten, tuoi, dia_chi FROM nghi_pham;',
      note: 'Dùng SELECT * để xem toàn bộ các cột.',
    },
    {
      keyword: 'WHERE',
      meaning: 'Lọc các dòng thỏa mãn điều kiện',
      example: "SELECT * FROM nghi_pham WHERE gioi_tinh = 'Nam' AND chieu_cao > 175;",
      note: 'Kết hợp AND (đồng thời), OR (hoặc), NOT (phủ định).',
    },
    {
      keyword: 'LIKE & % (Tìm kiếm mẫu)',
      meaning: 'Tìm kiếm chuỗi ký tự gần đúng trong văn bản',
      example: "SELECT * FROM nhan_chung WHERE loi_khai LIKE '%áo khoác đen%';",
      note: "Dấu % đại diện cho 0 hoặc nhiều ký tự bất kỳ.",
    },
    {
      keyword: 'IN & BETWEEN',
      meaning: 'Lọc theo tập hợp giá trị hoặc khoảng số/ngày',
      example: "SELECT * FROM camera WHERE khu_vuc IN ('Cổng chính', 'Hành lang B') AND thoi_gian BETWEEN '20:00' AND '22:30';",
      note: 'Giúp câu truy vấn ngắn gọn hơn nhiều so với việc lặp lại OR.',
    },
    {
      keyword: 'ORDER BY & LIMIT',
      meaning: 'Sắp xếp thứ tự và giới hạn số dòng trả về',
      example: 'SELECT * FROM giao_dich ORDER BY so_tien DESC LIMIT 5;',
      note: 'ASC (tăng dần - mặc định), DESC (giảm dần). Thường dùng tìm Top giao dịch đáng ngờ.',
    },
    {
      keyword: 'INNER JOIN',
      meaning: 'Ghép 2 bảng dựa trên khóa liên kết chung',
      example: 'SELECT K.ten, C.thoi_gian FROM khach_san K JOIN camera C ON K.id = C.khach_id;',
      note: 'Chỉ trả về các bản ghi có khóa khớp nhau ở cả 2 bảng.',
    },
    {
      keyword: 'LEFT JOIN',
      meaning: 'Giữ lại toàn bộ bảng bên trái dù bảng bên phải không có dữ liệu',
      example: 'SELECT N.ten, B.bang_chung FROM nghi_pham N LEFT JOIN chung_cu B ON N.id = B.nghi_pham_id;',
      note: 'Rất hữu ích khi tìm kiếm người không có chứng cứ ngoại phạm (NULL).',
    },
    {
      keyword: 'GROUP BY & HAVING',
      meaning: 'Gom nhóm dữ liệu và lọc sau khi tính toán',
      example: 'SELECT phong_ban, COUNT(*), AVG(luong) FROM nhan_vien GROUP BY phong_ban HAVING COUNT(*) > 3;',
      note: 'WHERE lọc dòng trước khi gom nhóm, HAVING lọc nhóm sau khi gom nhóm.',
    },
    {
      keyword: 'WITH ... AS (CTE)',
      meaning: 'Tạo bảng tạm thời giúp truy vấn phức tạp trở nên mạch lạc',
      example: 'WITH top_cuoc_goi AS (\n  SELECT sdt, COUNT(*) as so_lan FROM nhat_ky_goi GROUP BY sdt\n)\nSELECT * FROM top_cuoc_goi WHERE so_lan >= 5;',
      note: 'Đặc biệt quan trọng trong các chuyên án Cấp 3: Nâng Cao.',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-noir-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-noir-900 border border-noir-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-noir-950/80 overflow-hidden text-slate-200 animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-noir-800 bg-noir-850/80 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-noir-800 border border-amber-500/30 flex items-center justify-center text-noir-gold" aria-hidden="true">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="guide-modal-title" className="text-base sm:text-lg font-bold text-slate-100 font-cinzel">
                  SỔ TAY TÂN THỦ &amp; HƯỚNG DẪN SỬ DỤNG
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-noir-accent/20 text-noir-gold border border-noir-accent/40 font-semibold">
                  Field Manual
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lộ trình học, mẹo công cụ, gợi ý code và bảng tra cứu nhanh SQL cho thám tử số
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-noir-800 flex items-center justify-center transition-colors cursor-pointer focus-ring"
            aria-label="Đóng sổ tay hướng dẫn"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Tab Navigation */}
        <nav
          aria-label="Các mục trong sổ tay"
          className="flex items-center border-b border-noir-800 bg-noir-950/60 px-4 sm:px-7 overflow-x-auto no-scrollbar gap-2 py-2 flex-shrink-0"
        >
          <button
            onClick={() => setActiveTab('start')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors flex-shrink-0 cursor-pointer focus-ring ${
              activeTab === 'start'
                ? 'bg-noir-800 text-noir-gold border border-noir-700 shadow font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-noir-accent" aria-hidden="true" />
            <span>1. Chọn Lộ Trình</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors flex-shrink-0 cursor-pointer focus-ring ${
              activeTab === 'tools'
                ? 'bg-noir-800 text-sky-300 border border-noir-700 shadow font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span>2. Cách Viết &amp; Chạy SQL</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors flex-shrink-0 cursor-pointer focus-ring ${
              activeTab === 'schema'
                ? 'bg-noir-800 text-emerald-300 border border-noir-700 shadow font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>3. Đọc Sơ Đồ CSDL</span>
          </button>

          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors flex-shrink-0 cursor-pointer focus-ring ${
              activeTab === 'cheatsheet'
                ? 'bg-noir-800 text-purple-300 border border-noir-700 shadow font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
            <span>4. Tra Cứu Nhanh (Cheat Sheet)</span>
          </button>
        </nav>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: GETTING STARTED */}
          {activeTab === 'start' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-noir-850 to-noir-900 border border-noir-accent/30 flex items-start space-x-3.5">
                <Lightbulb className="w-5 h-5 text-noir-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-100 text-sm">
                    Lời khuyên vàng cho người mới bắt đầu:
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-[13px] text-pretty">
                    SQL không khó! Hãy nghĩ SQL như một loại <strong className="text-noir-gold">"ngôn ngữ giao tiếp"</strong> với cơ sở dữ liệu: Bạn chỉ cần nói rõ bạn muốn lấy <em>cột dữ liệu gì</em> và từ <em>bảng nào</em>, máy chủ sẽ tự động tìm kiếm và trả kết quả cho bạn.
                  </p>
                </div>
              </div>

              {/* Restart Spotlight Interactive Walkthrough Button */}
              {onRestartTour && (
                <button
                  onClick={() => {
                    onClose();
                    onRestartTour();
                  }}
                  className="w-full p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-noir-850 to-amber-500/20 border border-noir-accent/50 hover:border-noir-accent text-noir-gold hover:text-amber-300 flex items-center justify-between text-xs font-semibold transition-all active:scale-[0.99] cursor-pointer shadow-md focus-ring"
                >
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-noir-accent flex-shrink-0" aria-hidden="true" />
                    <span>Mở Lại Tour Hướng Dẫn Tương Tác (Spotlight Walkthrough)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                </button>
              )}

              {/* 2 Modes Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Academy Mode Card */}
                <div className="p-5 rounded-2xl bg-noir-850 border border-sky-500/30 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center space-x-1.5 text-sky-400 font-mono text-xs font-bold uppercase">
                        <GraduationCap className="w-4 h-4" aria-hidden="true" />
                        <span>Học Viện SQL (Academy)</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                        Khuyên dùng cho Newbie
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-100">
                      Bắt đầu từ con số 0 với 20 bài học tương tác
                    </h4>
                    <p className="text-xs text-slate-300 text-pretty">
                      Lộ trình 4 giai đoạn chuẩn: Nhập môn &rarr; Trung cấp &rarr; Nâng cao &rarr; Chuyên gia. Mỗi bài có lý thuyết cô đọng, bài tập code trực tiếp có chấm điểm tự động và câu hỏi trắc nghiệm củng cố.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-noir-800 flex items-center justify-between">
                    <span className="text-slate-400 text-xs tabular-nums">20 bài học + 4 Mini-Project</span>
                    {onNavigateToAcademy && (
                      <button
                        onClick={() => {
                          onNavigateToAcademy();
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center space-x-1 transition-colors cursor-pointer focus-ring"
                      >
                        <span>Vào Học Ngay</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Case Mode Card */}
                <div className="p-5 rounded-2xl bg-noir-850 border border-amber-500/30 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center space-x-1.5 text-noir-gold font-mono text-xs font-bold uppercase">
                        <Briefcase className="w-4 h-4 text-noir-accent" aria-hidden="true" />
                        <span>Phá Án Trinh Thám (Noir Cases)</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                        Thực chiến kịch tính
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-100">
                      Vạch mặt kẻ thủ ác bằng truy vấn dữ liệu thực tế
                    </h4>
                    <p className="text-xs text-slate-300 text-pretty">
                      Hóa thân thành Thám tử số: Đọc hồ sơ vụ án hiện trường, kiểm tra lời khai nhân chứng, truy vấn nhật ký camera, giao dịch ngân hàng và đối chiếu chứng cứ ngoại phạm để kết án thủ phạm.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-noir-800 flex items-center justify-between">
                    <span className="text-slate-400 text-xs tabular-nums">30 chuyên án (10 Dễ &bull; 10 Vừa &bull; 10 Khó)</span>
                    {onNavigateToCases && (
                      <button
                        onClick={() => {
                          onNavigateToCases();
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-noir-gold hover:bg-amber-400 text-noir-950 font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer focus-ring"
                      >
                        <span>Xem Danh Sách Án</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3 Step Flow */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 text-sm">
                  Quy trình 3 bước phá một bài tập hoặc vụ án:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-noir-950 border border-noir-800 space-y-1.5">
                    <div className="w-6 h-6 rounded-lg bg-noir-800 text-noir-gold font-mono font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <span className="font-bold text-slate-200 block text-xs">Xem Đề &amp; Lược Đồ</span>
                    <p className="text-[11px] text-slate-400">
                      Đọc kỹ hồ sơ vụ án hoặc yêu cầu đề bài. Bấm tab "Lược Đồ &amp; Sơ Đồ" để quan sát cấu trúc bảng và các mối quan hệ khóa chính / khóa ngoại.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-noir-950 border border-noir-800 space-y-1.5">
                    <div className="w-6 h-6 rounded-lg bg-noir-800 text-sky-400 font-mono font-bold flex items-center justify-center text-xs">
                      2
                    </div>
                    <span className="font-bold text-slate-200 block text-xs">Viết &amp; Gợi Ý Code</span>
                    <p className="text-[11px] text-slate-400">
                      Gõ câu lệnh trong SQL Editor. Hệ thống sẽ tự động hiển thị gợi ý từ khóa và tên cột. Bấm <code>Ctrl + Enter</code> để chạy thử tức thì.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-noir-950 border border-noir-800 space-y-1.5">
                    <div className="w-6 h-6 rounded-lg bg-noir-800 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                      3
                    </div>
                    <span className="font-bold text-slate-200 block text-xs">Nộp Bài &amp; Phá Án</span>
                    <p className="text-[11px] text-slate-400">
                      Kiểm tra bảng kết quả khớp với mục tiêu, sau đó bấm <strong>"Nộp Bài"</strong> để nhận điểm kinh nghiệm XP và vạch mặt kẻ thủ ác!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TOOLS & EDITOR */}
          {activeTab === 'tools' && (
            <div className="space-y-5">
              {/* Feature highlight: Autocomplete & Suggestions */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 via-noir-850 to-sky-950/20 border border-sky-800/50 space-y-2">
                <div className="flex items-center space-x-2 text-sky-300 font-bold">
                  <Code2 className="w-4 h-4 text-sky-400" aria-hidden="true" />
                  <span>Tính Năng Gợi Ý Code Thông Minh (SQL Autocomplete)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed text-pretty">
                  Khi bạn gõ bất kỳ chữ cái nào trong khung soạn thảo SQL, hệ thống sẽ tự động quét cơ sở dữ liệu hiện tại và gợi ý:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-noir-950/90 border border-noir-800">
                    <strong className="text-amber-400 block mb-0.5">Từ Khóa SQL</strong>
                    <span className="text-slate-400 text-[11px]">SELECT, WHERE, JOIN, GROUP BY, ORDER BY, HAVING…</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-noir-950/90 border border-noir-800">
                    <strong className="text-sky-400 block mb-0.5">Tên Bảng CSDL</strong>
                    <span className="text-slate-400 text-[11px]">nghi_pham, camera_log, cuoc_goi, giao_dich…</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-noir-950/90 border border-noir-800">
                    <strong className="text-emerald-400 block mb-0.5">Tên Cột Chi Tiết</strong>
                    <span className="text-slate-400 text-[11px]">id, ten, thoi_gian, dia_diem, so_tien…</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  💡 Nhấn phím <code>Tab</code> hoặc <code>Enter</code> để chèn nhanh từ khóa được chọn. Dùng phím mũi tên Lên/Xuống để đổi lựa chọn.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-noir-850 border border-noir-800 space-y-2">
                  <div className="flex items-center space-x-2 text-sky-400 font-bold">
                    <Keyboard className="w-4 h-4" aria-hidden="true" />
                    <span>Phím Tắt Siêu Tốc</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Khi đang soạn thảo code trong ô SQL Editor:
                  </p>
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-lg bg-noir-950 border border-noir-800 font-mono text-xs flex items-center justify-between">
                      <span className="text-slate-300">Chạy câu lệnh nhanh:</span>
                      <span className="px-2 py-0.5 rounded bg-noir-800 text-noir-gold border border-noir-700 font-bold">
                        Ctrl + Enter
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-noir-950 border border-noir-800 font-mono text-xs flex items-center justify-between">
                      <span className="text-slate-300">Bật/tắt bảng gợi ý:</span>
                      <span className="px-2 py-0.5 rounded bg-noir-800 text-sky-300 border border-noir-700 font-bold">
                        Ctrl + Space
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Trên máy tính Mac: dùng phím <code>Cmd + Enter</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-noir-850 border border-noir-800 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <Play className="w-4 h-4" aria-hidden="true" />
                    <span>Chạy Thử vs Nộp Bài</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li>
                      <strong className="text-slate-100">Chạy Truy Vấn (Execute):</strong> Giúp bạn xem bảng dữ liệu thực tế để đối chiếu manh mối, không giới hạn số lần chạy.
                    </li>
                    <li>
                      <strong className="text-emerald-300">Nộp Bài / Kết Án:</strong> Chấm điểm tự động với đáp án chuẩn, tích lũy điểm XP và lưu tiến trình vào máy.
                    </li>
                  </ul>
                  <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-400">
                    <Wand2 className="w-3.5 h-3.5 text-noir-accent" aria-hidden="true" />
                    <span>Nút "Định dạng" giúp tự động thụt lề chuẩn phong cách SQL chuyên nghiệp.</span>
                  </div>
                </div>
              </div>

              {/* Error messages guidance */}
              <div className="p-4 rounded-xl bg-noir-850 border border-noir-800 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                  <span>Khi Gặp Lỗi Màu Đỏ Thì Làm Gì?</span>
                </div>
                <p className="text-xs text-slate-300">
                  Lỗi trong SQL là người bạn tốt nhất giúp bạn học nhanh hơn. Đừng lo lắng!
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-noir-950 border border-rose-900/40 text-slate-300">
                    <code className="text-rose-400 font-bold">no such table: XYZ</code>: Tên bảng không tồn tại. Hãy xem lại tab "Lược Đồ" để gõ đúng tên bảng (chú ý chữ hoa/thường).
                  </div>
                  <div className="p-2.5 rounded-lg bg-noir-950 border border-rose-900/40 text-slate-300">
                    <code className="text-rose-400 font-bold">no such column: ABC</code>: Tên cột không chính xác hoặc bạn quên gõ dấu phẩy giữa các cột.
                  </div>
                  <div className="p-2.5 rounded-lg bg-noir-950 border border-rose-900/40 text-slate-300">
                    <code className="text-rose-400 font-bold">near "...": syntax error</code>: Lỗi cú pháp SQL. Kiểm tra xem bạn có quên dấu nháy đơn <code>'giá trị'</code> cho chuỗi văn bản, hoặc quên dấu chấm phẩy <code>;</code> ở cuối không.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEMA & ER DIAGRAM */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-300 text-pretty">
                Hiểu được cách dữ liệu được tổ chức sẽ giúp bạn viết bất kỳ câu lệnh SQL phức tạp nào một cách tự tin:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-noir-850 border border-noir-800 space-y-2">
                  <div className="flex items-center space-x-2 text-noir-gold font-bold">
                    <KeyRound className="w-4 h-4 text-noir-accent" aria-hidden="true" />
                    <span>Khóa Chính (PK - Primary Key)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Là cột chứa giá trị <strong>duy nhất</strong> để định danh mỗi dòng dữ liệu (tương tự như số <em>Căn cước công dân</em> hoặc <em>Biển số xe</em>). Không có hai dòng nào có cùng khóa chính.
                  </p>
                  <div className="font-mono text-[11px] bg-noir-950 p-2 rounded border border-noir-800 text-noir-gold">
                    Ví dụ: id INTEGER PRIMARY KEY
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-noir-850 border border-noir-800 space-y-2">
                  <div className="flex items-center space-x-2 text-sky-400 font-bold">
                    <LinkIcon className="w-4 h-4 text-sky-400" aria-hidden="true" />
                    <span>Khóa Ngoại (FK - Foreign Key)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Là chiếc <strong>cầu nối</strong> liên kết giữa 2 bảng. Cột này tham chiếu tới Khóa chính (PK) của bảng khác để bạn có thể dùng lệnh <code>JOIN</code> ghép chúng lại với nhau.
                  </p>
                  <div className="font-mono text-[11px] bg-noir-950 p-2 rounded border border-noir-800 text-sky-300">
                    Ví dụ: nghi_pham_id &rarr; nghi_pham(id)
                  </div>
                </div>
              </div>

              {/* How to use Interactive ER Diagram */}
              <div className="p-4 rounded-xl bg-noir-850 border border-noir-800 space-y-2">
                <h4 className="font-bold text-slate-200 text-xs sm:text-sm">
                  Cách dùng Sơ Đồ ER Trực Quan:
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>Kéo thả sơ đồ:</strong> Nhấn giữ chuột trái vào khoảng trống và rê chuột để di chuyển góc nhìn toàn cảnh.
                  </li>
                  <li>
                    <strong>Di chuyển từng bảng:</strong> Nhấn giữ vào thanh tiêu đề của bảng và kéo đến vị trí bạn muốn sắp xếp.
                  </li>
                  <li>
                    <strong>Phóng to / thu nhỏ:</strong> Dùng con lăn chuột hoặc cụm nút <code>+ / -</code> ở góc sơ đồ.
                  </li>
                  <li>
                    <strong>Nút Play (▷) trên bảng:</strong> Bấm vào nút này để tự động nạp nhanh câu lệnh <code>SELECT * FROM ten_bang LIMIT 10;</code> vào ô soạn thảo.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: CHEATSHEET */}
          {activeTab === 'cheatsheet' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Nhấn nút chép để sao chép nhanh câu lệnh mẫu vào bảng soạn thảo:
                </p>
              </div>

              <div className="space-y-3">
                {cheatSheetItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-noir-850 border border-noir-800 hover:border-noir-700 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm">
                          {item.keyword}
                        </span>
                        <span className="text-[11px] text-slate-400 hidden sm:inline">&bull;</span>
                        <span className="text-xs text-slate-300 font-medium">{item.meaning}</span>
                      </div>

                      <button
                        onClick={() => handleCopy(item.example, idx)}
                        className="px-2.5 py-1 rounded-lg bg-noir-900 hover:bg-noir-750 border border-noir-800 text-slate-300 hover:text-white transition-colors text-[11px] flex items-center space-x-1 cursor-pointer flex-shrink-0 focus-ring"
                        title="Sao chép ví dụ"
                        aria-label={`Sao chép cú pháp ${item.keyword}`}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                            <span className="text-emerald-400">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" aria-hidden="true" />
                            <span>Chép</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="bg-noir-950 p-2.5 rounded-lg border border-noir-800/80 font-mono text-[11px] sm:text-xs text-sky-300 overflow-x-auto whitespace-pre-wrap">
                      <code>{item.example}</code>
                    </pre>

                    <div className="text-[11px] text-slate-400 italic">
                      💡 {item.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-noir-800 bg-noir-850/80 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          <span className="text-xs text-slate-400 flex items-center space-x-1">
            <span>Mở lại sổ tay này bất cứ lúc nào qua nút</span>
            <strong className="text-noir-gold">"Hướng Dẫn"</strong>
            <span>trên thanh menu.</span>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-noir-accent hover:bg-amber-400 text-noir-950 font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 focus-ring"
          >
            Đã Hiểu &amp; Bắt Đầu Học Ngay
          </button>
        </div>
      </div>
    </div>
  );
};
