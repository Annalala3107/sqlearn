import React, { useState, useEffect } from 'react';
import { PenLine, Save, Check } from 'lucide-react';
import { progressService } from '../services/progressService';

interface DetectiveNotesProps {
  caseId: string;
}

export const DetectiveNotes: React.FC<DetectiveNotesProps> = ({ caseId }) => {
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setNote(progressService.getCaseNote(caseId));
  }, [caseId]);

  const handleChange = (val: string) => {
    setNote(val);
    progressService.saveCaseNote(caseId, val);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addTemplate = (text: string) => {
    const updated = note ? `${note}\n${text}` : text;
    handleChange(updated);
  };

  return (
    <div className="bg-noir-900 border border-noir-800 rounded-xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-noir-800">
        <div className="flex items-center space-x-2 text-noir-gold font-cinzel font-semibold text-base">
          <PenLine className="w-5 h-5 text-noir-accent" />
          <h2>Sổ Tay Điều Tra Của Thám Tử</h2>
        </div>
        <div className="flex items-center space-x-1 text-xs text-slate-400">
          {isSaved ? (
            <span className="text-emerald-400 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>Đã lưu tự động</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-slate-500">
              <Save className="w-3.5 h-3.5" />
              <span>Tự động lưu vào máy</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 text-xs text-slate-400 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-slate-500 font-semibold flex-shrink-0">Mẫu ghi chép:</span>
        <button
          onClick={() => addTemplate('- Nghi phạm chính: ')}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 text-slate-300 border border-noir-750 flex-shrink-0 transition-colors active:scale-95"
        >
          + Nghi phạm
        </button>
        <button
          onClick={() => addTemplate('- Bằng chứng ngoại phạm: ')}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 text-slate-300 border border-noir-750 flex-shrink-0 transition-colors active:scale-95"
        >
          + Bằng chứng
        </button>
        <button
          onClick={() => addTemplate('- Khung giờ gây án: ')}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 text-slate-300 border border-noir-750 flex-shrink-0 transition-colors active:scale-95"
        >
          + Khung giờ
        </button>
      </div>

      <textarea
        value={note}
        onChange={(e) => handleChange(e.target.value)}
        maxLength={5000}
        placeholder="Ghi chép các giả thuyết, tên nghi phạm, mốc thời gian hoặc manh mối bạn phát hiện từ các truy vấn SQL tại đây..."
        className="w-full h-48 sm:h-44 p-3.5 sm:p-3 bg-noir-950/70 border border-noir-800 rounded-xl text-slate-200 text-base sm:text-sm font-sans placeholder-slate-600 focus:outline-none focus:border-noir-accent/60 leading-relaxed resize-y"
      />
    </div>
  );
};
