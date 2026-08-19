'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getJobs, Job } from '@/lib/api';

export default function SpecInputPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Form State
  const [majorField, setMajorField] = useState('이공계열');
  const [gpa, setGpa] = useState<string>('');
  const [jobCode, setJobCode] = useState('');
  const [jobCustom, setJobCustom] = useState('');

  // Skills & Tags State
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const [certsInput, setCertsInput] = useState('');
  const [activitiesInput, setActivitiesInput] = useState('');

  useEffect(() => {
    getJobs().then((data) => {
      if (data) setJobs(data);
    }).catch(console.error);
  }, []);

  const handleJobSelect = (job: Job) => {
    setJobCode(job.job_code);
    setSelectedJob(job);
    setSelectedSkills([]); // 직무 변경 시 보유 기술 선택 초기화
  };

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 희망 직무 필수 검증
    if (!jobCode) {
      alert('희망 직무를 선택해 주세요.');
      return;
    }

    if (jobCode === 'other' && !jobCustom.trim()) {
      alert('기타 직무명을 입력해 주세요.');
      return;
    }

    // 2. 준비 중 직무 검증
    if (selectedJob && !selectedJob.is_ready) {
      alert('이 직무는 아직 분석 데이터를 모으는 중입니다.');
      return;
    }

    // 3. 학점 범위 검증
    if (gpa !== '') {
      const gpaNum = parseFloat(gpa);
      if (isNaN(gpaNum) || gpaNum < 0.0 || gpaNum > 4.5) {
        alert('학점은 0.0에서 4.5 사이의 숫자로 입력해 주세요.');
        return;
      }
    }

    // 백엔드 명세 규칙 전송 데이터 (json 규격 일치)
    const payload = {
      year: 3,
      major_field: majorField,
      gpa: gpa ? parseFloat(gpa) : null,
      job_code: jobCode,
      job_custom: jobCode === 'other' ? jobCustom : null,
      certs: certsInput ? certsInput.split(',').map((s) => s.trim()).filter(Boolean) : [],
      activities: activitiesInput ? activitiesInput.split(',').map((s) => s.trim()).filter(Boolean) : [],
      skills: selectedSkills,
    };

    console.log('백엔드로 보낼 전송 데이터:', payload);

    // 로컬 스토리지 보관 후 결과 페이지로 이동
    localStorage.setItem('userSpecPayload', JSON.stringify(payload));
    router.push('/result');
  };

  return (
    <div className="max-w-3xl mx-auto p-8 text-[var(--ink)]">
      <h1 className="text-3xl font-bold mb-8 text-center">내 스펙 입력하기</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. 전공 계열 (선택) */}
        <div>
          <label className="block font-semibold mb-2">전공 계열 (선택)</label>
          <select
            value={majorField}
            onChange={(e) => setMajorField(e.target.value)}
            className="w-full p-3 border rounded-[var(--radius)] text-black"
            style={{ borderColor: 'var(--line)' }}
          >
            <option value="이공계열">이공계열</option>
            <option value="상경계열">상경계열</option>
            <option value="인문사회계열">인문사회계열</option>
            <option value="예체능계열">예체능계열</option>
            <option value="기타">기타</option>
          </select>
        </div>

        {/* 2. 학점 (선택) */}
        <div>
          <label className="block font-semibold mb-2">학점 (선택, 0.0 ~ 4.5)</label>
          <input
            type="number"
            step="0.01"
            placeholder="예: 3.75"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            className="w-full p-3 border rounded-[var(--radius)] text-black"
            style={{ borderColor: 'var(--line)' }}
          />
        </div>

        {/* 3. 희망 직무 (필수) */}
        <div>
          <label className="block font-semibold mb-2">
            희망 직무 <span className="text-red-500">*필수</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {jobs.map((job) => (
              <button
                key={job.job_code}
                type="button"
                onClick={() => handleJobSelect(job)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                  jobCode === job.job_code
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                style={{
                  backgroundColor: jobCode === job.job_code ? 'var(--primary)' : undefined,
                }}
              >
                {job.job_name}
              </button>
            ))}
          </div>

          {/* 기타 선택 시 직접 입력창 */}
          {jobCode === 'other' && (
            <input
              type="text"
              placeholder="직무명을 직접 입력해 주세요"
              value={jobCustom}
              onChange={(e) => setJobCustom(e.target.value)}
              className="w-full p-3 border rounded-[var(--radius)] text-black mt-2"
              style={{ borderColor: 'var(--line)' }}
            />
          )}

          {/* 준비 중 직무 선택 경고 문구 */}
          {selectedJob && !selectedJob.is_ready && (
            <p className="text-amber-600 text-sm mt-2 font-medium">
              ⚠️ 이 직무는 아직 분석 데이터를 모으는 중입니다.
            </p>
          )}
        </div>

        {/* 4. 보유 기술 (신규 - 직무 선택 시에만 노출) */}
        {selectedJob && selectedJob.job_code !== 'other' && (
          <div className="p-5 bg-gray-50 rounded-[var(--radius)] border" style={{ borderColor: 'var(--line)' }}>
            <label className="block font-semibold mb-2">보유 기술 (선택)</label>

            {/* GET /api/jobs 응답 common_skills 체크박스 */}
            {selectedJob.common_skills && selectedJob.common_skills.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {selectedJob.common_skills.map((skill) => (
                  <label key={skill} className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="w-4 h-4 accent-[#F07C1F]"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            )}

            {/* [+ 추가] 직접 입력 */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="기타 기술 직접 입력"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                className="flex-1 p-2 border rounded text-sm text-black"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-2 bg-gray-800 text-white text-sm rounded font-medium"
              >
                [+ 추가]
              </button>
            </div>

            {/* 선택된 태그 목록 및 X 삭제 버튼 */}
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-[#F07C1F] rounded-full text-xs font-bold"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className="hover:text-red-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 5. 자격증 & 대외활동 */}
        <div>
          <label className="block font-semibold mb-2">자격증 (콤마 구분)</label>
          <input
            type="text"
            placeholder="예: 정보처리기사, SQLD"
            value={certsInput}
            onChange={(e) => setCertsInput(e.target.value)}
            className="w-full p-3 border rounded-[var(--radius)] text-black"
            style={{ borderColor: 'var(--line)' }}
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">대외활동 / 경험 (콤마 구분)</label>
          <input
            type="text"
            placeholder="예: 인턴 경험, 팀 프로젝트"
            value={activitiesInput}
            onChange={(e) => setActivitiesInput(e.target.value)}
            className="w-full p-3 border rounded-[var(--radius)] text-black"
            style={{ borderColor: 'var(--line)' }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 text-white font-bold text-lg rounded-[var(--radius)] transition"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          결과 분석하기
        </button>
      </form>
    </div>
  );
}