/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  theory: string;
  visualExplanation: string;
  examples: Array<{ title: string; code: string; explanation: string }>;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Level {
  id: string;
  worldId: number;
  levelNumber: number;
  title: string;
  description: string;
  challengeText: string;
  language: 'python' | 'javascript' | 'cpp' | 'java' | 'sql';
  starterCode: string;
  expectedOutput: string;
  expectedAction: 'move' | 'collect' | 'walk_loop' | 'attack' | 'jump' | 'boss_fight';
  testCases: Array<{
    input?: string;
    validateFnStr: string; // evaluated to check student code
    errorMessage: string;
  }>;
  hint: string;
  completed?: boolean;
}

export interface World {
  id: number;
  name: string;
  description: string;
  levels: Level[];
}

export interface UserStats {
  xp: number;
  coins: number;
  gems: number;
  streak: number;
  level: number;
  completedLessons: string[]; // lessonIds
  completedLevels: string[]; // levelId strings like "world1_level1"
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  level: number;
  completedProjectsCount: number;
  accuracy: number;
  isCurrentUser?: boolean;
}

export interface RoadmapNode {
  title: string;
  duration: string;
  description: string;
  skills: string[];
  projects: string[];
  status: 'locked' | 'unlocked' | 'completed';
}

export interface AIPlanningRoadmap {
  learningGoal: string;
  estimatedTime: string;
  requiredSkills: string[];
  weeklyPlan: Array<{
    week: string;
    focus: string;
    tasks: string[];
  }>;
  monthlyPlan: Array<{
    month: string;
    goal: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    techStack: string;
  }>;
}

export interface GeneratedProject {
  title: string;
  problemStatement: string;
  datasetSuggestions: string[];
  architecture: string;
  folderStructure: string;
  starterCode: string;
  deploymentGuide: string;
}

export interface InterviewSession {
  topic: 'python' | 'data_science' | 'machine_learning' | 'ai_engineer';
  currentQuestionIndex: number;
  questions: Array<{
    id: string;
    type: 'theory' | 'coding' | 'mcq' | 'behavioral';
    question: string;
    options?: string[];
    correctIndex?: number;
    sampleAnswer?: string;
  }>;
  answers: Array<{
    questionId: string;
    userAnswer: string;
    score?: number;
    feedback?: string;
  }>;
  score?: number;
  overallFeedback?: string;
  isCompleted: boolean;
}
