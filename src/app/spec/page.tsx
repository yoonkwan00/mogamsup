'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SpecPage() {
  const router = useRouter();

  // 백엔드 필드명에 맞춰 상태 구조 정의
  const [formData, setFormData] = useState({
    school: '',
    major: '',
    grade: '',
    certificates: '', // 화면 입력 시에는 콤마 구분 문자열로 입력받음
    target_job: '',
    experience_text: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { school, major, grade, certificates, target_job, experience_text } = formData;

    // 1. 유효성 검사 (필수 입력값)
    if (!school || !major || !grade || !certificates || !target_job || !experience_text) {
      alert('모든 입력 항목을 빠짐없이 채워주세요!');
      return;
    }

    // 2. 유효성 검사 (학년 1~4 숫자)
    const gradeNum = Number(grade);
    if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 4) {
      alert('학년은 1에서 4 사이의 숫자로만 입력해 주세요. (예: 3)');
      return;
    }

    // 3. 백엔드 Pydantic 모델(UserSpec) 규격에 맞게 데이터 변환
    const requestData = {
      // 임시 session_id 생성 (백엔드 필수 항목)
      session_id: `session_${Date.now()}`,
      school: formData.school,
      major: formData.major,
      grade: `${formData.grade}학년`, // 백엔드 예시 형태인 "2학년" 문자열 규격에 맞춤
      // 콤마(,)로 구분된 자격증 글자들을 배열(list[str])로 변환 및 공백 제거
      certificates: formData.certificates
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== ''),
      target_job: formData.target_job,
      experience_text: formData.experience_text,
    };

    console.log('백엔드로 전송할 데이터:', requestData);

    try {
      const response = await fetch(
        'https://reverence-marshland-evolve.ngrok-free.dev/api/spec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        alert('스펙 정보가 성공적으로 저장되었습니다!');
        router.push('/result');
      } else {
        const errorData = await response.json();
        console.error('백엔드 에러 상세:', errorData);
        alert('서버 제출에 실패했습니다. 입력 양식을 확인해 주세요.');
      }
    } catch (error) {
      console.error('API 연동 중 에러 발생:', error);
      alert('네트워크 에러가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 text-black">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">내 스펙 입력하기</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 학교 */}
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

        {/* 전공 */}
        <div className="space-y-2">
          <label className="block font-medium">전공</label>
          <input
            type="text"
            name="major"
            value={formData.major}
            onChange={handleChange}
            placeholder="예: 컴퓨터공학과"
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        {/* 학년 & 희망직무 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-medium">학년 (1~4 숫자)</label>
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
              name="target_job"
              value={formData.target_job}
              onChange={handleChange}
              placeholder="예: 백엔드 개발자"
              className="w-full p-3 border rounded-lg text-black"
            />
          </div>
        </div>

        {/* 자격증 */}
        <div className="space-y-2">
          <label className="block font-medium">자격증 (콤마로 구분)</label>
          <input
            type="text"
            name="certificates"
            value={formData.certificates}
            onChange={handleChange}
            placeholder="예: 정보처리기사, SQLD"
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        {/* 경험사항 */}
        <div className="space-y-2">
          <label className="block font-medium">경험사항 및 이력 요약</label>
          <textarea
            name="experience_text"
            value={formData.experience_text}
            onChange={handleChange}
            placeholder="프로젝트 경험이나 이력을 자유롭게 적어주세요."
            rows={5}
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        {/* 매칭 시작 버튼 */}
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