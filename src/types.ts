export type Difficulty = 'foundation' | 'intermediate';

export type DomainId = 'cloud-concepts' | 'azure-architecture' | 'azure-management';

export interface Domain {
  id: DomainId;
  name: string;
  shortName: string;
  weightRange: string;
  description: string;
}

export interface Topic {
  id: string;
  domainId: DomainId;
  name: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  feedback: string;
}

export interface Question {
  id: string;
  domainId: DomainId;
  topicId: string;
  topicName: string;
  difficulty: Difficulty;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  analogy: string;
  memoryTip: string;
}

export interface ConceptEntry {
  id: string;
  domainId: DomainId;
  topicId: string;
  topicName: string;
  title: string;
  definition: string;
  explanation: string;
  analogy: string;
  confusedWith?: { name: string; distinction: string };
  examTip: string;
}

export interface Attempt {
  id: string;
  questionId: string;
  domainId: DomainId;
  topicId: string;
  topicName: string;
  difficulty: Difficulty;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  timestamp: number;
}

export type PageId = 'home' | 'practice' | 'learn' | 'progress';

export interface ProgressState {
  version: number;
  attempts: Attempt[];
}

export interface BookmarksState {
  version: number;
  conceptIds: string[];
}

export interface ThemeState {
  version: number;
  theme: 'light' | 'dark';
}
