import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  Filter,
  Trophy,
  BookOpen,
} from 'lucide-react';
import { Lesson, StageId } from '../academy/types';
import { allLessons, ACADEMY_STAGES } from '../academy';
import { UserStats } from '../cases/types';

interface AcademyLessonListProps {
  stats: UserStats;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenGuide?: () => void;
}

export const AcademyLessonList: React.FC<AcademyLessonListProps> = ({
  stats,
  onSelectLesson,
  onOpenGuide,
}) => {
  const [selectedStage, setSelectedStage] = useState<StageId | 'all'>('all');

  const completedLessons = stats.completedLessons || {};
  const completedCount = Object.values(completedLessons).filter((l) => l.completed).length;
  const totalLessons = allLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const filteredLessons =
    selectedStage === 'all'
      ? allLessons
      : allLessons.filter((l) => l.stage === selectedStage);

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-noir-900 via-noir-850 to-noir-950 border border-noir-700/80 rounded-2xl p-5 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3.5 sm:space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[11px] sm:text-xs font-mono font-semibold">
              <GraduationCap className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>HỌC VIỆN SQL TƯƠNG TÁC (INTERACTIVE SQL ACADEMY)</span>
            </div>
            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="px-3 py-1 rounded-full bg-noir-850 hover:bg-noir-800 text-slate-300 hover:text-noir-gold border border-noir-700 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-noir-accent" />
                <span>Sổ Tay Hướng Dẫn</span>
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            LÀM CHỦ TRUY VẤN SQL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-noir-gold to-amber-500">
              TỪ SƠ CẤP ĐẾN KỸ SƯ DỮ LIỆU
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-sans">
            Lộ trình 4 giai đoạn chuẩn quốc tế: Học lý thuyết cô đọng, tương tác trực tiếp trên trình duyệt với SQLite WebAssembly, tự động kiểm thử đáp án và xây dựng các dự án phân tích thực chiến.
          </p>

          {/* Progress Overview Bar */}
          <div className="pt-2 sm:pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Trophy className="w-3.5 h-3.5 text-noir-accent" />
                <span>Tiến độ toàn khóa:</span>
                <strong className="text-slate-200">{completedCount}/{totalLessons} bài học</strong>
              </span>
              <span className="text-noir-gold font-bold">{progressPercent}%</span>
            </div>

            <div className="w-full h-2.5 bg-noir-950 rounded-full border border-noir-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-noir-accent to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACADEMY_STAGES.map((stg) => {
          const stageLessons = allLessons.filter((l) => l.stage === stg.id);
          const stageDone = stageLessons.filter((l) => completedLessons[l.id]?.completed).length;

          return (
            <div
              key={stg.id}
              onClick={() => setSelectedStage(stg.id)}
              className={`p-4 rounded-xl border bg-noir-900/80 transition-all cursor-pointer hover:border-noir-accent/60 flex flex-col justify-between ${
                selectedStage === stg.id
                  ? 'border-noir-accent bg-noir-850 shadow-lg shadow-noir-accent/10'
                  : 'border-noir-800'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Giai đoạn {stg.order}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-noir-800 text-slate-300 border border-noir-700">
                    {stageDone}/{stageLessons.length}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">{stg.title.split(': ')[1]}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {stg.tagline}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-noir-800/60 flex items-center justify-between text-[11px]">
                <span className="text-noir-gold font-mono">{stg.badge}</span>
                <span className="text-slate-500">Xem bài học →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedStage('all')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer flex-shrink-0 ${
              selectedStage === 'all'
                ? 'bg-noir-800 text-noir-gold border border-noir-700 shadow font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Tất Cả ({allLessons.length})</span>
          </button>

          {ACADEMY_STAGES.map((stg) => (
            <button
              key={stg.id}
              onClick={() => setSelectedStage(stg.id)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer flex-shrink-0 ${
                selectedStage === stg.id
                  ? 'bg-noir-800 text-noir-gold border border-noir-700 shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{stg.title.split(': ')[1].split(' (')[0]}</span>
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Hiển thị: {filteredLessons.length} bài học
        </span>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map((lesson) => {
          const isDone = !!completedLessons[lesson.id]?.completed;

          return (
            <div
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className={`group cursor-pointer rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden bg-noir-900/90 shadow-md ${
                isDone
                  ? 'border-emerald-800/70 hover:border-emerald-500 shadow-emerald-950/20'
                  : lesson.isCapstoneProject
                  ? 'border-amber-700/60 hover:border-amber-500 shadow-amber-950/20'
                  : 'border-noir-800 hover:border-noir-accent/70 hover:-translate-y-1'
              }`}
            >
              {/* Capstone Badge / Completed Stamp */}
              {isDone ? (
                <div className="absolute top-3.5 right-3.5 flex items-center space-x-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-600 text-emerald-300 font-bold font-mono">
                  <CheckCircle className="w-3 h-3" />
                  <span>HOÀN THÀNH</span>
                </div>
              ) : lesson.isCapstoneProject ? (
                <div className="absolute top-3.5 right-3.5 flex items-center space-x-1 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950/90 border border-amber-600 text-amber-300 font-bold font-mono">
                  <Sparkles className="w-3 h-3 text-noir-accent" />
                  <span>DỰ ÁN TỔNG KẾT</span>
                </div>
              ) : null}

              <div className="space-y-3">
                {/* Meta Header */}
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-noir-850 border border-noir-750 flex items-center justify-center font-mono text-xs font-bold text-slate-300">
                    {lesson.order < 10 ? `0${lesson.order}` : lesson.order}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {lesson.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-100 group-hover:text-noir-gold transition-colors leading-snug">
                  {lesson.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {lesson.subtitle}
                </p>

                {/* Info row */}
                <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-noir-accent" />
                    <span>{lesson.timeEstimate}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-noir-gold font-mono font-bold">
                    <Award className="w-3.5 h-3.5 text-noir-accent" />
                    <span>+{lesson.xpReward} XP</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-noir-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {lesson.schemas[0]?.name || 'CSDL Sandbox'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLesson(lesson);
                  }}
                  className={`min-h-[40px] text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isDone
                      ? 'bg-noir-800 text-slate-300 hover:bg-noir-750'
                      : 'bg-noir-accent/20 text-noir-gold border border-noir-accent/40 group-hover:bg-noir-accent group-hover:text-noir-950'
                  }`}
                >
                  <span>{isDone ? 'Ôn Tập Lại' : 'Bắt Đầu Học'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
