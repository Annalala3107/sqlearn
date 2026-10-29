import React, { useState, useRef } from 'react';
import { X, Download, Upload, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { progressService } from '../services/progressService';
import { UserStats } from '../cases/types';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatsRestored: (newStats: UserStats) => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  onStatsRestored,
}) => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Export File
  const handleExport = () => {
    try {
      const jsonStr = progressService.exportProgressJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `sqlearn_backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: 'Đã xuất file sao lưu thành công! Bạn có thể lưu giữ tệp tin này an toàn trên máy.',
      });
    } catch (e: any) {
      setStatusMessage({
        type: 'error',
        text: `Lỗi xuất file: ${e?.message || 'Không thể tạo file'}`,
      });
    }
  };

  // Handle Import File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = progressService.importProgressJson(content);
      if (res.success && res.updatedStats) {
        setStatusMessage({ type: 'success', text: res.message });
        onStatsRestored(res.updatedStats);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    };
    reader.onerror = () => {
      setStatusMessage({ type: 'error', text: 'Không thể đọc nội dung tệp tin đã chọn.' });
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-noir-900 border border-noir-700 rounded-2xl sm:rounded-3xl shadow-2xl p-6 z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-noir-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-noir-800 border border-noir-accent/40 flex items-center justify-center text-noir-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                Sao Lưu & Khôi Phục Tiến Độ
              </h3>
              <p className="text-[11px] text-slate-400">
                Bảo toàn dữ liệu học tập khi đổi thiết bị hoặc xóa cache
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-noir-800 hover:bg-noir-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl flex items-center space-x-2 text-xs font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Actions Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Action 1: Export */}
          <div className="bg-noir-950 p-4 rounded-xl border border-noir-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center space-x-2 text-noir-gold text-xs font-bold mb-1">
                <Download className="w-4 h-4" />
                <span>1. XUẤT SAO LƯU</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tải về tệp tin <code className="text-noir-gold">.json</code> chứa toàn bộ số điểm XP, danh hiệu, các vụ án và bài học đã mở khóa.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="w-full py-2.5 px-3 rounded-xl bg-noir-800 hover:bg-noir-750 text-noir-gold border border-noir-accent/40 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tải File .JSON Về Máy</span>
            </button>
          </div>

          {/* Action 2: Import */}
          <div className="bg-noir-950 p-4 rounded-xl border border-noir-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold mb-1">
                <Upload className="w-4 h-4" />
                <span>2. KHÔI PHỤC</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Nạp lại tệp tin sao lưu trước đó để phục hồi 100% tiến trình học tập của bạn trên máy này.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Chọn Tệp JSON Để Nạp</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-slate-400 text-center">
          💡 Dữ liệu được mã hóa JSON an toàn chuẩn client-side, không tải bất kỳ thông tin nhạy cảm nào lên server lạ.
        </p>
      </div>
    </div>
  );
};
