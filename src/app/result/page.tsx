'use client';

import ResultBlocks from '@/components/ResultBlocks';
import { MOCK_ANALYSIS_DATA } from '@/lib/api';
import Link from 'next/link';

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">스펙 분석 결과</h1>
        <Link href="/spec-input" className="text-sm font-semibold text-amber-600 hover:underline">
          ← 다시 입력하기
        </Link>
      </div>

      <ResultBlocks data={MOCK_ANALYSIS_DATA} />
    </div>
  );
}