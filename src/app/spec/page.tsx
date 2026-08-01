'use client'; // useState 같은 클라이언트 기능을 쓰기 위해 반드시 최상단에 추가     

import { useState } from 'react';
import { useRouter } from 'next/navigation'; //페이지 이동을 위한 hook 추가

export default function SpecPage() {
  const router = useRouter();
  // 1. 입력 항목들을 하나의 상태(State)로 관리하기
  const [formData, setFormData] = useState({
    school: '',
    major: '',
    grade: '',
    certifications: '',
    desiredJob: '',
    experience: '',
  });

  // 2. 입력값이 바뀔 때마다 상태를 업데이트하는 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 3. 버튼을 눌렀을 때 실행될 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { school, major, grade, certifications, desiredJob, experience } = formData;

    // -----------------------------------------------------------
    // 폼 검증 로직 1: 모든 필드가 비어있지 않은지 확인 (필드 필수)
    // -----------------------------------------------------------
    if (!school || !major || !grade || !certifications || !desiredJob || !experience) {
      alert('모든 입력 항목을 빠짐없이 채워주세요!');
      return;
    }

    // -----------------------------------------------------------
    // 폼 검증 로직 2: 학년은 1~4 숫자만 허용
    // -----------------------------------------------------------
    // '3학년' 대신 '3'처럼 숫자로 받아오거나 숫자 부분만 추출/체크
    const gradeNum = Number(grade);
    if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 4) {
      alert('학년은 1에서 4 사이의 숫자로만 입력해 주세요. (예: 3)');
      return;
    }

    // [Mock 테스트 확인용] 콘솔창에 전송될 JSON 데이터 출력
    console.log(' 백엔드로 전송될 JSON 데이터:', JSON.stringify(formData, null, 2));

    try {
      // -----------------------------------------------------------
      // 백엔드 POST /api/spec과 연동
      // (백엔드가 완전히 준비되기 전에는 Next.js 자체 API 또는 Mock API 역할을 수행)
      // -----------------------------------------------------------
      const response = await fetch('/api/spec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('스펙 정보가 성공적으로 제출되었습니다!');
        
        // -----------------------------------------------------------
        // 제출 성공 시 결과 화면(/result)으로 이동
        // -----------------------------------------------------------
        router.push('/result');
      } else {
        alert('서버 제출에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('API 연동 중 에러 발생:', error);
      alert('네트워크 에러가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">내 스펙 입력하기</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 각 입력 항목들 */}
        <div className="space-y-2">
          <label className="block font-medium">학교</label>
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            placeholder="예: 전남대학교"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">전공</label>
          <input
            type="text"
            name="major"
            value={formData.major}
            onChange={handleChange}
            placeholder="예: 인공지능학부"
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-medium">학년</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="예: 3"
              className="w-full p-3 border rounded-lg text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">희망직무</label>
            <input
              type="text"
              name="desiredJob"
              value={formData.desiredJob}
              onChange={handleChange}
              placeholder="예: 프론트엔드 개발자"
              className="w-full p-3 border rounded-lg text-black"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">자격증</label>
          <input
            type="text"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            placeholder="예: 정보처리기사, SQLD (콤마로 구분)"
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">경험사항</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="인턴, 프로젝트, 수상 경력 등을 자유롭게 적어주세요."
            rows={5}
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          매칭 시작
        </button>
      </form>
    </div>
  );
}