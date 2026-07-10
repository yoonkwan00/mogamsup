'use client'; // useState 같은 클라이언트 기능을 쓰기 위해 반드시 최상단에 추가     

import { useState } from 'react';

export default function SpecPage() {
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('입력된 데이터:', formData);
    alert('매칭 시작! (백엔드 API가 준비되면 데이터를 전송할 예정입니다.)');
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
              placeholder="예: 3학년"
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