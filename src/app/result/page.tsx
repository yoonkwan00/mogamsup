// src/app/result/page.tsx
'use client';

import Link from 'next/link';

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-blue-600">🎉 매칭 분석 완료!</h1>
        <p className="text-gray-600">
          입력하신 스펙 데이터를 바탕으로 최적의 기업 및 직무를 추천해 드립니다.
        </p>
        
        <div className="p-4 bg-gray-100 rounded-lg text-left text-sm space-y-2">
          <p className="font-semibold text-gray-700">추천 결과 미리보기:</p>
          <p>• 백엔드/AI 기반 매칭 로직 작동 중...</p>
        </div>

        <Link 
          href="/spec" 
          className="inline-block w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          다시 작성하기
        </Link>
      </div>
    </div>
  );
}