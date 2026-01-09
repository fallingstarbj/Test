
export interface Question {
  id: number;
  text: string;
  options: { text: string; score: number }[];
}

export interface AssessmentResult {
  score: number;
  level: '优' | '良' | '轻度压力' | '中度压力' | '高压';
  recommendation: string;
  date: string;
}

export interface TherapyScene {
  id: string;
  title: string;
  description: string;
  imagePrompt: string;
  audioPrompt: string;
  videoUrl: string;
  audioUrl: string; // 新增：指向固定的音频资源链接
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  ASSESSMENT = 'assessment',
  THERAPY = 'therapy',
  COUNSELOR = 'counselor'
}
