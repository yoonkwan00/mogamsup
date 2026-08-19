'use client';

import { AnalysisResultData, CoverageItem } from '@/lib/api';

export default function ResultBlocks({ data }: { data: AnalysisResultData }) {
  // 2. 커버리지 카드 분모 0 예외 처리 ("해당 없음")
  const renderCoverageCard = (title: string, item?: CoverageItem) => {
    if (!item || item.total === 0) {
      return (
        <div className="p-4 bg-white border rounded-[var(--radius)] shadow-sm" style={{ borderColor: 'var(--line)' }}>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-base font-bold text-gray-400">해당 없음</p>
        </div>
      );
    }
    return (
      <div className="p-4 bg-white border rounded-[var(--radius)] shadow-sm" style={{ borderColor: 'var(--line)' }}>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-xl font-bold text-gray-800">{item.have} / {item.total}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8 text-[var(--ink)] max-w-4xl mx-auto py-6">
      {/* 블록 1: 매칭 점수 */}
      <div className="p-6 bg-white border rounded-[var(--radius)] shadow-sm flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-6">
          <span className="text-5xl font-extrabold" style={{ color: 'var(--primary)' }}>
            {data.match_score}%
          </span>
          <div>
            <h3 className="text-lg font-bold">요구 역량 {data.total_required}개 중 {data.total_have}개 보유</h3>
            <p className="text-sm text-gray-500">{data.job_name} 분석 결과입니다.</p>
          </div>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>공고 {data.posting_count}건 분석</p>
          <p>수집 기간: {data.collected_period}</p>
        </div>
      </div>

      {/* 블록 2: 커버리지 카드 4개 (기술 / 자격증 / 어학 / 경험) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {renderCoverageCard('기술', data.coverage?.기술)}
        {renderCoverageCard('자격증', data.coverage?.자격증)}
        {renderCoverageCard('어학', data.coverage?.어학)}
        {renderCoverageCard('경험', data.coverage?.경험)}
      </div>

      {/* 블록 3: 요구 역량 차트 (핵심) */}
      <div className="p-6 bg-white border rounded-[var(--radius)] shadow-sm" style={{ borderColor: 'var(--line)' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">요구 역량 분석 차트</h3>
          {/* 범례 */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: 'var(--primary)' }}></span> 보유
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border border-dashed border-gray-400 rounded-sm bg-gray-50"></span> 미보유
            </span>
          </div>
        </div>

        {/* 가로 막대 10개 */}
        <div className="space-y-3">
          {data.skills?.map((item) => (
            <div key={item.name} className="flex items-center gap-3 text-sm">
              <span className="w-28 text-right font-semibold truncate">{item.name}</span>
              <div className="flex-1 bg-gray-100 h-6 rounded overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-500 ${
                    item.have
                      ? 'bg-[var(--primary)]'
                      : 'border-2 border-dashed border-gray-400 bg-transparent'
                  }`}
                  style={{
                    width: `${item.freq}%`,
                    backgroundColor: item.have ? 'var(--primary)' : 'transparent',
                  }}
                />
              </div>
              <span className="w-12 text-xs font-bold text-gray-600">{item.freq}%</span>
            </div>
          ))}
        </div>

        {/* 블록 3-2: 먼저 채울 3가지 */}
        <div className="mt-8 p-4 bg-orange-50 rounded-[var(--radius)] border border-orange-200">
          <h4 className="font-bold text-sm text-amber-900 mb-2">💡 우선 보충 추천 역량 Top 3</h4>
          <div className="flex gap-2">
            {data.top3?.map((item) => (
              <span key={item.name} className="px-3 py-1 bg-white border border-amber-300 text-amber-900 rounded-full text-xs font-bold">
                {item.name} ({item.freq}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 블록 4: 우대 사항 */}
      <div className="p-6 bg-white border rounded-[var(--radius)] shadow-sm" style={{ borderColor: 'var(--line)' }}>
        <h3 className="text-lg font-bold mb-4">우대 사항</h3>
        <div className="flex flex-wrap gap-3">
          {data.preferred?.map((item) => (
            <span key={item.name} className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 font-medium">
              {item.name} <strong style={{ color: 'var(--primary)' }} className="ml-1">{item.freq}%</strong>
            </span>
          ))}
        </div>
      </div>

      {/* 블록 5: 추천 자격증 */}
      <div className="p-6 bg-white border rounded-[var(--radius)] shadow-sm" style={{ borderColor: 'var(--line)' }}>
        <h3 className="text-lg font-bold mb-4">추천 자격증</h3>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600">
              <th className="p-3">자격증명</th>
              <th className="p-3">요구 비율</th>
              <th className="p-3">일정 / 비고</th>
            </tr>
          </thead>
          <tbody>
            {data.certs?.map((cert) => (
              <tr key={cert.name} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold">{cert.name}</td>
                <td className="p-3 font-bold" style={{ color: 'var(--primary)' }}>{cert.freq}%</td>
                <td className="p-3 text-gray-500">{cert.exam_label ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}