import { create } from "zustand";

export type SummaryResponse = {
  title: string;
  bullets: string[];
  paragraph: string;
};

export type Flashcard = {
  question: string;
  answer: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
};

export type TopicItem = {
  topic: string;
  subtopics: string[];
};

export type ExplanationResponse = {
  mode: "simple" | "exam" | "technical";
  explanation: string;
};

export type QAResponse = {
  question: string;
  answer: string;
  confidence: number;
};

export type ResourceItem = {
  title: string;
  type: "video" | "article";
  url: string;
  reason: string;
};

export type StudyModeTab =
  | "summary"
  | "flashcards"
  | "quiz"
  | "topics"
  | "explanation"
  | "qa"
  | "resources";

type StudyState = {
  sessionId?: string;
  filename?: string;
  chunkCount: number;
  currentTab: StudyModeTab;
  isUploading: boolean;
  isLoading: boolean;
  error?: string;
  summary?: SummaryResponse;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  topics: TopicItem[];
  explanation?: ExplanationResponse;
  qaHistory: QAResponse[];
  resources: ResourceItem[];
  setSession: (data: { sessionId: string; filename: string; chunkCount: number }) => void;
  setTab: (tab: StudyModeTab) => void;
  setUploading: (val: boolean) => void;
  setLoading: (val: boolean) => void;
  setError: (msg?: string) => void;
  setSummary: (data: SummaryResponse) => void;
  setFlashcards: (data: Flashcard[]) => void;
  setQuiz: (data: QuizQuestion[]) => void;
  setTopics: (data: TopicItem[]) => void;
  setExplanation: (data: ExplanationResponse) => void;
  addQA: (data: QAResponse) => void;
  setResources: (data: ResourceItem[]) => void;
};

export const useStudyStore = create<StudyState>((set) => ({
  sessionId: undefined,
  filename: undefined,
  chunkCount: 0,
  currentTab: "summary",
  isUploading: false,
  isLoading: false,
  error: undefined,
  summary: undefined,
  flashcards: [],
  quiz: [],
  topics: [],
  explanation: undefined,
  qaHistory: [],
  resources: [],
  setSession: ({ sessionId, filename, chunkCount }) =>
    set({
      sessionId,
      filename,
      chunkCount,
      error: undefined,
    }),
  setTab: (tab) => set({ currentTab: tab }),
  setUploading: (val) => set({ isUploading: val }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (msg) => set({ error: msg }),
  setSummary: (data) => set({ summary: data }),
  setFlashcards: (data) => set({ flashcards: data }),
  setQuiz: (data) => set({ quiz: data }),
  setTopics: (data) => set({ topics: data }),
  setExplanation: (data) => set({ explanation: data }),
  addQA: (data) =>
    set((state) => ({
      qaHistory: [...state.qaHistory, data],
    })),
  setResources: (data) => set({ resources: data }),
}));

