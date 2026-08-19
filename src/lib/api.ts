// 1. 입력 폼용 직무 정보 인터페이스
export interface Job {
  job_code: string;
  job_name: string;
  is_ready: boolean;
  common_skills: string[];
}

// 2. 결과 화면 데이터 인터페이스 (이미지 데이터 구조 고정 반영)
export interface CoverageItem {
  have: number;
  total: number;
}

export interface SkillItem {
  name: string;
  freq: number;
  count: number;
  have: boolean;
  type: string;
}

export interface Top3Item {
  name: string;
  type: string;
  freq: number;
  count: number;
}

export interface PreferredItem {
  name: string;
  type: string;
  freq: number;
  count: number;
}

export interface CertItem {
  name: string;
  freq: number;
  count: number;
  exam_label: string;
}

export interface AnalysisResultData {
  job_name: string;
  match_score: number;
  total_required: number;
  total_have: number;
  posting_count: number;
  collected_period: string;
  coverage: {
    기술: CoverageItem;
    자격증: CoverageItem;
    어학: CoverageItem;
    경험: CoverageItem;
  };
  skills: SkillItem[];
  top3: Top3Item[];
  preferred: PreferredItem[];
  certs: CertItem[];
}

// GET /api/jobs 백엔드 연동 모듈 (Mock 데이터)
export async function getJobs(): Promise<Job[]> {
  return [
    {
      job_code: 'backend',
      job_name: '백엔드 개발자',
      is_ready: true,
      common_skills: ['Python', 'Java', 'SQL', 'Spring', 'Git', 'AWS', 'Docker', 'Linux'],
    },
    {
      job_code: 'frontend',
      job_name: '프론트엔드 개발자',
      is_ready: true,
      common_skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML/CSS', 'Git'],
    },
    {
      job_code: 'designer',
      job_name: 'UI/UX 디자이너',
      is_ready: true,
      common_skills: ['Figma', 'Photoshop', 'Illustrator'],
    },
    {
      job_code: 'ai_data',
      job_name: 'AI/데이터 엔지니어',
      is_ready: false,
      common_skills: ['Python', 'PyTorch', 'Pandas', 'SQL'],
    },
    {
      job_code: 'other',
      job_name: '기타 (직접 입력)',
      is_ready: true,
      common_skills: [],
    },
  ];
}

// 결과 화면용 Mock 데이터
export const MOCK_ANALYSIS_DATA: AnalysisResultData = {
  job_name: "백엔드 개발자",
  match_score: 42,
  total_required: 10,
  total_have: 4,
  posting_count: 40,
  collected_period: "2026.06.01 - 08.20",
  coverage: {
    기술: { have: 4, total: 10 },
    자격증: { have: 1, total: 3 },
    어학: { have: 0, total: 1 },
    경험: { have: 2, total: 4 }
  },
  skills: [
    { name: "Python", freq: 71, count: 28, have: true, type: "기술" },
    { name: "SQL", freq: 65, count: 26, have: true, type: "기술" },
    { name: "Linux", freq: 60, count: 24, have: true, type: "기술" },
    { name: "Git", freq: 55, count: 22, have: true, type: "기술" },
    { name: "REST API", freq: 58, count: 23, have: false, type: "기술" },
    { name: "Java", freq: 50, count: 20, have: false, type: "기술" },
    { name: "AWS", freq: 45, count: 18, have: false, type: "기술" },
    { name: "Docker", freq: 40, count: 16, have: false, type: "기술" },
    { name: "Spring", freq: 35, count: 14, have: false, type: "기술" },
    { name: "Kubernetes", freq: 27, count: 11, have: false, type: "기술" }
  ],
  top3: [
    { name: "REST API", type: "기술", freq: 58, count: 23 },
    { name: "Java", type: "기술", freq: 50, count: 20 },
    { name: "AWS", type: "기술", freq: 45, count: 18 }
  ],
  preferred: [
    { name: "Kubernetes", type: "기술", freq: 27, count: 11 }
  ],
  certs: [
    { name: "정보처리기사", freq: 43, count: 17, exam_label: "09.02 접수" }
  ]
};