/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ChevronRight, HelpCircle, Code, Settings, Award } from 'lucide-react';
import { LESSONS } from '../data';
import { Lesson } from '../types';

interface TheorySectionProps {
  completedLessons: string[];
  onLessonComplete: (lessonId: string) => void;
}

export default function TheorySection({ completedLessons, onLessonComplete }: TheorySectionProps) {
  const [activeTopic, setActiveTopic] = useState<string>('python');
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);
  const [quizSelectedIdx, setQuizSelectedIdx] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Topics definitions matching the 9 requested topics
  const TOPICS = [
    { id: 'python', name: 'Python Kingdom' },
    { id: 'statistics', name: 'Statistics Stats' },
    { id: 'math_ml', name: 'Mathematics for ML' },
    { id: 'data_science', name: 'Data Science' },
    { id: 'machine_learning', name: 'Machine Learning' },
    { id: 'deep_learning', name: 'Deep Learning' },
    { id: 'nlp', name: 'NLP & Language' },
    { id: 'generative_ai', name: 'Generative AI' },
    { id: 'computer_vision', name: 'Computer Vision' }
  ];

  const visibleTopics = TOPICS;

  const currentLessons = LESSONS[activeTopic] || LESSONS.python;
  const lesson: Lesson = currentLessons[activeLessonIdx] || currentLessons[0];

  const hasUnlockedCode = completedLessons.includes(lesson.id);

  const checkQuizAnswer = (optionIdx: number) => {
    if (quizAnswered) return;
    setQuizSelectedIdx(optionIdx);
    setQuizAnswered(true);

    if (optionIdx === lesson.quiz.correctIndex) {
      onLessonComplete(lesson.id);
    }
  };

  const handleNextLesson = () => {
    setQuizSelectedIdx(null);
    setQuizAnswered(false);
    if (activeLessonIdx < currentLessons.length - 1) {
      setActiveLessonIdx(prev => prev + 1);
    }
  };

  const selectTopic = (topicId: string) => {
    setActiveTopic(topicId);
    setActiveLessonIdx(0);
    setQuizSelectedIdx(null);
    setQuizAnswered(false);
  };

  return (
    <div id="theory_learning_workspace" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* 1. Sidebar Topic Selector and Syllabus Settings */}
      <div className="space-y-4">

        {/* Modules Navigation */}
        <div className="bg-[#0E0E11] border border-white/10 p-4 rounded-xl space-y-3 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-250 uppercase font-display tracking-wider font-bold">Course Modules</h3>
          </div>
          
          <div className="flex flex-col gap-1.5">
            {visibleTopics.map((topic) => {
              const isSelected = activeTopic === topic.id;
              // Check if user completed some lesson in this topic
              const completedCount = (LESSONS[topic.id] || []).filter(l => completedLessons.includes(l.id)).length;
              const hasCompletedAll = completedCount > 0 && completedCount === (LESSONS[topic.id] || []).length;

              return (
                <button
                  id={`btn_topic_select_${topic.id}`}
                  key={topic.id}
                  onClick={() => selectTopic(topic.id)}
                  className={`flex items-center justify-between text-left px-3.5 py-3 rounded-lg border font-mono text-xs cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-505 text-cyan-400 font-bold shadow-[0_0_15px_rgba(34,211,238,0.05)]'
                      : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-150'
                  }`}
                >
                  <span className="truncate">{topic.name}</span>
                  <div className="flex items-center gap-1.5">
                    {hasCompletedAll && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Lesson Scroller details */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-[#0E0E11] border border-white/10 rounded-xl p-6 space-y-6 shadow-xl">
          
          {/* Header metadata */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                Lesson Modules — Topic: {TOPICS.find(t => t.id === activeTopic)?.name}
              </span>
              <h2 className="text-lg font-bold text-white font-display">{lesson.title}</h2>
            </div>
            
            {hasUnlockedCode && (
              <div className="flex items-center gap-1.5 bg-emerald-950/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-mono">
                <Award className="w-3.5 h-3.5" />
                Lesson Completed
              </div>
            )}
          </div>

          {/* Interactive Slides Carousel / Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap border-b border-white/5 pb-4">
            <span className="text-[10px] font-mono text-slate-400 mr-2 uppercase">Topic Steps:</span>
            {currentLessons.map((l, idx) => {
              const isLActive = idx === activeLessonIdx;
              const isLCompleted = completedLessons.includes(l.id);
              return (
                <button
                  id={`btn_slide_indicator_${l.id}`}
                  key={l.id}
                  onClick={() => {
                    setActiveLessonIdx(idx);
                    setQuizSelectedIdx(null);
                    setQuizAnswered(false);
                  }}
                  className={`px-3 py-1.5 rounded-md font-mono text-[10px] cursor-pointer transition-all flex items-center gap-1 border ${
                    isLActive
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400 font-bold'
                      : 'bg-black/45 border-white/5 text-slate-400 hover:text-slate-150 hover:border-white/10'
                  }`}
                >
                  <span>Slide {idx + 1}</span>
                  {isLCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Lesson Body Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Theory Text column */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">Theoretical Syllabus</h3>
              <div className="text-xs text-slate-300 leading-relaxed space-y-3 font-sans whitespace-pre-wrap">
                {lesson.theory}
              </div>

              {/* Coding Example box */}
              {lesson.examples.map((ex, index) => (
                <div key={index} className="p-4 bg-black/40 rounded-lg border border-white/5 space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-400 font-bold">
                    <Code className="w-3.5 h-3.5" />
                    {ex.title}:
                  </div>
                  <pre className="p-2.5 bg-black/80 text-cyan-400 font-mono text-[11px] rounded border border-white/5 overflow-x-auto">
                    {ex.code}
                  </pre>
                  <p className="text-[11px] text-slate-400 leading-normal italic">{ex.explanation}</p>
                </div>
              ))}
            </div>            {/* Simulated Animated Visualizer & Quiz */}
            <div className="space-y-6">
              
              {/* Visual Simulation Display Pane */}
              <div className="bg-black border border-white/10 p-5 rounded-lg space-y-3.5">
                <div className="flex items-center gap-1.5 bg-[#0E0E11] px-3 py-1 rounded-md border border-white/5 inline-block w-fit">
                  <Settings className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider font-bold animate-pulse">Interactive Process Vector</span>
                </div>

                <div className="h-[140px] bg-[#0E0E11]/80 rounded flex items-center justify-center p-3 text-center border border-white/5">
                  {/* Custom high-fidelity dynamic visualizers reacting to Lesson ID */}
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden font-mono text-xs text-slate-300">
                    
                    {/* Python Module Variables */}
                    {lesson.id === 'py1' && (
                      <div className="space-y-2 text-center animate-pulse">
                        <div className="text-cyan-400 font-bold text-[10px]">Python RAM Allocation</div>
                        <div className="flex items-center justify-center gap-3">
                          <span className="px-2.5 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded text-[10px] text-cyan-300 font-mono">variable (hero_name)</span>
                          <span className="text-slate-400 font-bold">→</span>
                          <span className="px-2.5 py-1 bg-[#121216] border border-white/10 rounded text-[10px] text-emerald-300 font-mono font-bold">"Nico"</span>
                        </div>
                      </div>
                    )}

                    {/* Python Pacing Loops */}
                    {lesson.id === 'py2' && (
                      <div className="space-y-3 text-center w-full max-w-xs">
                        <div className="text-cyan-400 font-bold text-[10px]">For Iterators (for i in range(3))</div>
                        <div className="flex justify-around items-center">
                          <span className="px-2 py-1 border border-cyan-500/30 rounded text-[10px] bg-cyan-505/10 animate-pulse text-cyan-300">i=0 (Walk)</span>
                          <span className="px-2 py-1 border border-cyan-500/30 rounded text-[10px] bg-cyan-505/10 animate-pulse text-cyan-300">i=1 (Walk)</span>
                          <span className="px-2 py-1 border border-cyan-500/30 rounded text-[10px] bg-cyan-505/15 animate-bounce text-emerald-400 font-bold">i=2 (Walk)</span>
                        </div>
                      </div>
                    )}

                    {/* Python If Else Branches */}
                    {lesson.id === 'py3' && (
                      <div className="space-y-2 text-center w-full">
                        <div className="text-yellow-400 font-bold text-[10px]">Conditional Evaluation Gate</div>
                        <div className="flex justify-center items-center gap-1 text-[9px]">
                          <span className="px-1.5 py-0.5 bg-black/50 border border-white/10 rounded text-slate-400">power = 95</span>
                          <span className="text-slate-400 font-mono">→</span>
                          <span className="px-1.5 py-0.5 bg-cyan-950/50 border border-cyan-500 text-cyan-400">if power &gt; 90?</span>
                          <span className="text-emerald-400 font-bold">TRUE</span>
                          <span className="text-slate-400">→</span>
                          <span className="px-1.5 py-0.5 bg-emerald-950/50 border border-emerald-500 text-emerald-400 font-bold">"ULTRA STRIKE"</span>
                        </div>
                      </div>
                    )}

                    {/* Python Def Custom Functions */}
                    {lesson.id === 'py4' && (
                      <div className="space-y-2 text-center w-full max-w-sm">
                        <div className="text-cyan-400 font-bold text-[10px]">Function logical stack execution</div>
                        <div className="flex justify-center items-center gap-2">
                          <span className="px-1.5 py-1 bg-black/60 border border-slate-700 rounded text-[9px]">Input (2.5)</span>
                          <span className="text-slate-450">&gt;&gt;</span>
                          <div className="p-1 px-2.5 bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500 rounded text-[10px] text-cyan-200">
                            def execute_swing() <br /><span className="text-yellow-400 text-[8px]">base_dmg * arg</span>
                          </div>
                          <span className="text-slate-450">&gt;&gt;</span>
                          <span className="px-1.5 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded text-[9px] text-emerald-400 font-bold">Return (50.0)</span>
                        </div>
                      </div>
                    )}

                    {/* Stats mean, median */}
                    {lesson.id === 'stat1' && (
                      <div className="w-full flex flex-col justify-end h-full max-h-[110px] space-y-2">
                        <div className="text-[10px] text-cyan-400 font-bold text-center">Robustness Metrics [1, 2, 100]</div>
                        <div className="flex justify-center items-end gap-5 h-[50px] border-b border-white/10 pb-0.5">
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] text-red-400 font-bold">Mean: 34.3</span>
                            <div className="w-6 h-8 bg-red-500/40 border border-red-500 rounded-t" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] text-emerald-400 font-bold">Median: 2.0</span>
                            <div className="w-6 h-4 bg-emerald-500/40 border border-emerald-500 rounded-t animate-bounce" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Probability & Bayes */}
                    {lesson.id === 'stat2' && (
                      <div className="space-y-2 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">Bayesian Diagnostic Inference</div>
                        <div className="flex justify-center gap-4 text-[9px]">
                          <div className="p-1.5 bg-black/50 border border-white/5 rounded">
                            <span className="block text-[8px] text-slate-450">Prior Glaub</span>
                            <span className="font-bold text-slate-300">P(Glitch) = 5%</span>
                          </div>
                          <span className="text-slate-400 self-center font-bold">+ Scanner Alert</span>
                          <div className="p-1.5 bg-cyan-950/20 border border-cyan-500 rounded animate-pulse">
                            <span className="block text-[8px] text-cyan-450">Posterior Prob</span>
                            <span className="font-bold text-cyan-300">P(Glitch|Alert) = 45%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Normal Curve */}
                    {lesson.id === 'stat3' && (
                      <div className="w-full h-full max-h-[110px] flex flex-col items-center justify-end space-y-1">
                        <div className="text-[10px] text-cyan-400 font-bold text-center">Gaussian Curve &amp; Outliers</div>
                        {/* Simulated bell curve */}
                        <div className="relative w-[180px] h-[55px] flex items-end">
                          <svg className="w-full h-full stroke-cyan-500 fill-cyan-500/10" viewBox="0 0 100 40">
                            <path d="M 0 38 Q 20 38 40 38 T 50 10 T 60 38 Q 80 38 100 38" strokeWidth="1.5" />
                            <line x1="50" y1="10" x2="50" y2="38" stroke="yellow" strokeDasharray="2" strokeWidth="1" />
                          </svg>
                          <span className="absolute left-[45%] top-1 text-[8px] text-yellow-300">Mean (\u03bc)</span>
                          <span className="absolute right-0 bottom-1 text-[7px] text-red-400">Z &gt; +3 (Outlier)</span>
                        </div>
                      </div>
                    )}

                    {/* Mathematics vectors */}
                    {lesson.id === 'math1' && (
                      <div className="space-y-2 text-center">
                        <div className="text-cyan-400 font-bold text-[10px]">2D Translation Vector coordinate grid</div>
                        <div className="flex items-center gap-3 justify-center text-[10px] font-mono">
                          <span className="text-slate-300 font-bold">Base [5, 4]</span>
                          <span className="text-cyan-450 font-bold">+</span>
                          <span className="text-yellow-400 font-bold">Offset [2, -1]</span>
                          <span className="text-slate-450">=</span>
                          <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500 text-cyan-300 rounded font-bold animate-bounce">[7, 3]</span>
                        </div>
                      </div>
                    )}

                    {/* Matrices & Dot Products */}
                    {lesson.id === 'math2' && (
                      <div className="space-y-1.5 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">Synaptic Matrix multiplication (X \u00B7 W)</div>
                        <div className="flex justify-center items-center gap-1.5 text-[9px]">
                          <span className="px-1 py-1 bg-black/60 border border-white/5 rounded">Inputs [1 \u00D7 3]</span>
                          <span className="text-slate-450">&#x2A2F;</span>
                          <span className="px-1 py-1 bg-black/60 border border-white/5 rounded">Weights [3 \u00D7 2]</span>
                          <span className="text-slate-450">&rarr;</span>
                          <span className="px-1.5 py-1 bg-cyan-950/40 border border-cyan-500 text-cyan-300 rounded font-bold">Outputs [1 \u00D7 2]</span>
                        </div>
                      </div>
                    )}

                    {/* Calculus Gradients */}
                    {lesson.id === 'math3' && (
                      <div className="w-full h-full max-h-[110px] flex flex-col justify-end items-center space-y-1.5">
                        <div className="text-[10px] text-cyan-400 font-bold text-center">SGD Gradient descent tangent error valley</div>
                        <div className="relative w-[160px] h-[55px] flex items-end">
                          <svg className="w-full h-full stroke-red-500 fill-none" viewBox="0 0 100 40">
                            <path d="M 10 5 Q 50 45 90 5" strokeWidth="1.5" />
                          </svg>
                          <div className="absolute left-[38%] top-[25px] w-2.5 h-2.5 bg-yellow-400 rounded-full animate-bounce" />
                          <span className="absolute left-10 top-0 text-[7px] text-slate-400">High Loss</span>
                          <span className="text-emerald-400 text-[8px] absolute left-[45%] bottom-1 animate-pulse font-bold">Minimum Error</span>
                        </div>
                      </div>
                    )}

                    {/* Data science pandas */}
                    {lesson.id === 'ds1' && (
                      <div className="w-full max-w-xs space-y-1 text-left text-[9px] font-mono">
                        <div className="text-cyan-400 text-center font-bold text-[10px] pb-1">Pandas Mask Filtering</div>
                        <div className="p-1 px-2 border border-emerald-500/35 bg-emerald-950/20 text-emerald-300 rounded font-bold flex justify-between">
                          <span>Patient 12</span><span>Score: 89</span><span>STATUS: MATCH</span>
                        </div>
                        <div className="p-1 px-2 border border-white/5 bg-black/30 text-slate-500 rounded flex justify-between line-through">
                          <span>Patient 15</span><span>Score: 43</span><span>STATUS: FILTERED</span>
                        </div>
                      </div>
                    )}

                    {/* Data normalization */}
                    {lesson.id === 'ds2' && (
                      <div className="space-y-2 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">Min-Max Scale compression</div>
                        <div className="flex items-center justify-center gap-4 text-[9px]">
                          <div className="text-[9px] text-slate-400">
                            Income: <br /><span className="font-bold text-rose-300">$85,000.00</span>
                          </div>
                          <span className="text-yellow-400 text-xs font-bold font-mono animate-pulse">&rarr; scaler &rarr;</span>
                          <div className="text-[9px] text-emerald-400 font-bold border border-emerald-500 px-2 py-1 rounded bg-emerald-950/20">
                            Scaled vector: <br /><span>0.81</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cleaning Anomalies */}
                    {lesson.id === 'ds3' && (
                      <div className="space-y-2 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">Database Imputation sequence</div>
                        <div className="flex items-center justify-center gap-3">
                          <span className="px-2 py-1 bg-red-950/30 border border-red-500/40 text-red-400 rounded text-[9px]">score: [NaN]</span>
                          <span className="text-yellow-400 text-xs animate-bounce">&rarr;</span>
                          <span className="px-2 py-1 bg-emerald-950/20 border border-emerald-505 text-emerald-400 rounded text-[9px] font-bold">score: [72.5] (Imputed Median!)</span>
                        </div>
                      </div>
                    )}

                    {/* ML models classification */}
                    {lesson.id === 'ml1' && (
                      <div className="w-full h-full max-h-[110px] flex flex-col justify-end items-center space-y-1.5">
                        <div className="text-[10px] text-cyan-400 font-bold text-center">Supervised cluster boundary split</div>
                        <div className="relative w-[150px] h-[55px] border border-white/5 bg-black/20 rounded">
                          <div className="absolute top-1 left-2 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                          <div className="absolute top-3 left-6 w-2 h-2 bg-rose-500 rounded-full" />
                          <div className="absolute bottom-2 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                          <div className="absolute bottom-4 right-10 w-2 h-2 bg-cyan-400 rounded-full" />
                          <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-yellow-400/80 rotate-12" />
                          <span className="absolute left-[54%] top-[10px] text-[7px] text-yellow-300">Boundary</span>
                        </div>
                      </div>
                    )}

                    {/* ML2 continuous vs logistic */}
                    {lesson.id === 'ml2' && (
                      <div className="w-full h-full max-h-[110px] flex flex-col justify-end items-center space-y-1.5">
                        <div className="text-[10px] text-cyan-400 font-bold text-center">Sigmoid logistic activation curve S(z)</div>
                        <div className="relative w-[155px] h-[58px] flex items-center justify-center">
                          <svg className="w-full h-[38px] stroke-cyan-500 fill-none" viewBox="0 0 100 20">
                            <path d="M 10 18 Q 40 18 50 10 T 90 2" strokeWidth="1.5" />
                          </svg>
                          <span className="text-[7px] font-mono text-yellow-300 absolute top-0.5">Threshold 0.5</span>
                        </div>
                      </div>
                    )}

                    {/* Overfitting dilemma */}
                    {lesson.id === 'ml3' && (
                      <div className="w-full h-full max-h-[110px] flex flex-col justify-end items-center space-y-1">
                        <div className="text-[10px] text-cyan-400 font-bold text-center">Overfitted Noise vs Regularized fit</div>
                        <div className="relative w-[150px] h-[55px] border border-white/5 rounded bg-black/10">
                          {/* Wiggly line */}
                          <svg className="absolute inset-0 w-full h-full stroke-rose-500 fill-none opacity-60" viewBox="0 0 100 40">
                            <path d="M 10 30 Q 20 5 30 35 T 50 5 T 70 35 T 90 10" strokeWidth="1" />
                          </svg>
                          {/* Smooth line */}
                          <svg className="absolute inset-0 w-full h-full stroke-emerald-400 fill-none" viewBox="0 0 100 40">
                            <path d="M 10 25 Q 50 15 90 10" strokeWidth="2" />
                          </svg>
                          <span className="absolute bottom-1 left-2 text-[7px] text-emerald-400">Regularized (Broad)</span>
                          <span className="absolute top-1 right-2 text-[7px] text-rose-450">Overfitted (Wiggly)</span>
                        </div>
                      </div>
                    )}

                    {/* Neuron activation */}
                    {lesson.id === 'dl1' && (
                      <div className="space-y-2 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">ReLU Layer Cap activation: max(0, Z)</div>
                        <div className="flex justify-center items-center gap-4 text-[9px]">
                          <span className="px-2 py-1 bg-red-950/20 text-rose-350 border border-red-500/30 rounded">Z = -4.5</span>
                          <span className="text-yellow-400 text-xs font-bold">&rarr; ReLU &rarr;</span>
                          <span className="px-2 py-1 bg-emerald-950/30 text-emerald-400 border border-emerald-500 rounded font-bold animate-pulse">Activation = 0.0</span>
                        </div>
                      </div>
                    )}

                    {/* MLP neural networks backprop */}
                    {lesson.id === 'dl2' && (
                      <div className="w-full h-full max-h-[110px] flex flex-col justify-end items-center space-y-1">
                        <div className="text-[10px] text-cyan-400 font-bold text-center">Multi Layer Perceptron backpropagation</div>
                        <div className="flex items-center gap-4 h-[60px] relative">
                          <div className="flex flex-col gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          </div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400 text-center text-[7px]" />
                          <span className="text-[7px] text-yellow-300 font-bold absolute -bottom-5 left-1 animate-pulse">Chain Rule Derivative Feedback</span>
                        </div>
                      </div>
                    )}

                    {/* Optimizer model */}
                    {lesson.id === 'dl3' && (
                      <div className="space-y-1.5 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">Adam Adaptive Moment Optimizer</div>
                        <div className="flex justify-center gap-2 items-center text-[9px]">
                          <span className="px-2 py-1 bg-slate-900 border border-white/5 rounded">SGD steps [Constant]</span>
                          <span className="text-slate-400">vs</span>
                          <span className="px-2 py-1 bg-cyan-950 border border-cyan-500 text-cyan-300 rounded font-bold animate-pulse">Adam steps [Adaptive Speed]</span>
                        </div>
                      </div>
                    )}

                    {/* NLP token splits */}
                    {lesson.id === 'nlp1' && (
                      <div className="space-y-2 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">Text String Tokenization</div>
                        <div className="flex justify-center items-center gap-1.5 text-[10px] flex-wrap">
                          <span className="px-1.5 py-0.5 bg-black/60 border border-cyan-550 rounded text-cyan-300">"We"</span>
                          <span className="px-1.5 py-0.5 bg-black/60 border border-cyan-550 rounded text-cyan-300">"learn"</span>
                          <span className="px-1.5 py-0.5 bg-black/60 border border-cyan-550 rounded text-cyan-300">"neural"</span>
                          <span className="px-1.5 py-0.5 bg-black/60 border border-cyan-550 rounded text-cyan-305">"paths"</span>
                        </div>
                      </div>
                    )}

                    {/* Embeddings synonym vectors */}
                    {lesson.id === 'nlp2' && (
                      <div className="w-full h-full max-h-[110px] flex flex-col justify-end items-center space-y-1.5">
                        <div className="text-[10px] text-cyan-400 font-bold text-center">Dense Semantic Space proximity</div>
                        <div className="relative w-[140px] h-[55px] border border-white/5 bg-black/30 rounded text-[8px]">
                          <span className="absolute top-2 left-3 text-cyan-300 font-bold">"king"</span>
                          <span className="absolute top-1 left-9 text-cyan-300">"queen"</span>
                          <span className="absolute bottom-2 right-4 text-red-300">"apple"</span>
                          <span className="absolute bottom-5 right-9 text-red-300">"pear"</span>
                        </div>
                      </div>
                    )}

                    {/* Self-Attention transformer */}
                    {lesson.id === 'nlp3' && (
                      <div className="w-full h-full max-h-[110px] flex flex-col justify-end items-center space-y-1.5">
                        <div className="text-[10px] text-cyan-400 font-bold text-center">Query-Key attention connection weights</div>
                        <div className="flex gap-4 text-[9px] relative items-center">
                          <span className="font-bold text-cyan-300 font-sans">"river"</span>
                          <div className="w-12 h-0.5 bg-yellow-400/80 animate-pulse relative" />
                          <span className="font-bold text-cyan-300 font-sans">"bank"</span>
                        </div>
                      </div>
                    )}

                    {/* LLM prompts predict */}
                    {lesson.id === 'genai1' && (
                      <div className="space-y-1 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">Autoregressive prompt completion</div>
                        <div className="text-[9px] bg-black p-1.5 rounded border border-white/5 inline-block text-slate-350">
                          "System accuracy is..." <br />
                          <span className="text-yellow-400 font-bold animate-pulse">[Evaluating next token: "optimal" (P=94%)]</span>
                        </div>
                      </div>
                    )}

                    {/* PEFT LoRA */}
                    {lesson.id === 'genai2' && (
                      <div className="space-y-1.5 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">PEFT LoRA Low Rank Bypass mapping</div>
                        <div className="flex gap-4 justify-center items-center text-[9px]">
                          <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-500 rounded">Base Weights [Frozen 70B]</span>
                          <span className="text-yellow-400 font-bold">+</span>
                          <span className="px-2 py-1 bg-cyan-950 border border-cyan-500 text-cyan-300 rounded font-bold animate-bounce">LoRA Matrix [Trainable 8M]</span>
                        </div>
                      </div>
                    )}

                    {/* Factual grounding RAG */}
                    {lesson.id === 'genai3' && (
                      <div className="space-y-1 text-center w-full max-w-xs">
                        <div className="text-cyan-400 font-bold text-[10px]">Retrieval-Augmented Prompt Grounding</div>
                        <div className="p-1 px-2.5 bg-slate-950 rounded border border-cyan-500/30 text-[8px] text-slate-300">
                          <span className="text-cyan-400 font-bold">Inject Document:</span> "User Nico earned 5 badges." <br />
                          <span className="text-emerald-400 font-bold">Model Output:</span> "Nico has unlocked five platform achievements."
                        </div>
                      </div>
                    )}

                    {/* Matrices primitive CV */}
                    {lesson.id === 'cv1' && (
                      <div className="space-y-1.5 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">RGB Color Channel matrices depth</div>
                        <div className="flex gap-3 justify-center text-[9px]">
                          <span className="px-1.5 py-0.5 bg-red-950/40 border border-red-500/40 text-red-400 rounded">Red Matrix</span>
                          <span className="px-1.5 py-0.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 rounded">Green Matrix</span>
                          <span className="px-1.5 py-0.5 bg-blue-950/40 border border-blue-500/40 text-blue-400 rounded">Blue Matrix</span>
                        </div>
                      </div>
                    )}

                    {/* CNN filter Kernel max pool */}
                    {lesson.id === 'cv2' && (
                      <div className="space-y-2 text-center w-full">
                        <div className="text-cyan-400 font-bold text-[10px]">MaxPooling Kernel compression</div>
                        <div className="flex gap-4 justify-center items-center text-[9px]">
                          <div className="p-1 border border-white/5 bg-black/40 rounded text-slate-400">
                            Grid: [12, 45, 9, 87]
                          </div>
                          <span className="text-yellow-400">&rarr; max &rarr;</span>
                          <div className="p-1 px-2.5 bg-emerald-950/30 border border-emerald-500 text-emerald-400 font-bold rounded animate-pulse">
                            Pooled: [87]
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Segmentation objects */}
                    {lesson.id === 'cv3' && (
                      <div className="w-full h-full max-h-[110px] flex flex-col justify-end items-center space-y-1.5">
                        <div className="text-[10px] text-cyan-400 font-bold text-center">Semantic contours vs Bounding coordinate frame</div>
                        <div className="relative w-[130px] h-[55px] border-2 border-dashed border-cyan-500 rounded bg-cyan-950/15">
                          <span className="absolute top-1 left-1.5 text-[8px] bg-cyan-500 text-black font-bold px-1 rounded uppercase">bounding frame: enemy</span>
                          <div className="absolute inset-4 rounded-full border border-red-500 bg-red-500/10 animate-pulse" />
                          <span className="absolute bottom-1.5 right-2 text-[7px] text-red-400 font-bold">Pixel contour semantic path</span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal bg-[#0E0E11] px-3 py-2 rounded border border-white/5 font-mono">
                  {lesson.visualExplanation}
                </p>
              </div>

              {/* Interactive Quiz card */}
              <div className="bg-black border border-white/10 p-5 rounded-lg space-y-4">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-xs font-bold">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  Topic Screening Quiz:
                </div>

                <div className="text-xs text-slate-100 font-medium font-sans">
                  {lesson.quiz.question}
                </div>

                <div className="space-y-2.5">
                  {lesson.quiz.options.map((option, idx) => {
                    const isSelected = quizSelectedIdx === idx;
                    const isCorrectOption = idx === lesson.quiz.correctIndex;
                    
                    let btnColorClass = 'bg-[#0E0E11] border-white/5 hover:border-white/15 text-slate-300';
                    if (quizAnswered) {
                      if (isCorrectOption) {
                        btnColorClass = 'bg-emerald-950/20 border-emerald-505 text-emerald-450 font-bold';
                      } else if (isSelected) {
                        btnColorClass = 'bg-[#1D1014] border-rose-500 text-rose-400';
                      } else {
                        btnColorClass = 'bg-black border-white/5 text-slate-500';
                      }
                    }

                    return (
                      <button
                        id={`btn_quiz_opt_${idx}`}
                        key={idx}
                        disabled={quizAnswered}
                        onClick={() => checkQuizAnswer(idx)}
                        className={`w-full text-left p-3 text-xs rounded border transition font-mono flex items-center justify-between cursor-pointer ${btnColorClass}`}
                      >
                        <span>{option}</span>
                        {quizAnswered && isCorrectOption && <span className="text-[10px] uppercase font-bold text-emerald-450 bg-emerald-950 px-1.5 py-0.5 rounded">Correct</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Result Explanation */}
                {quizAnswered && (
                  <div className="p-3.5 rounded border border-white/10 text-[11px] leading-relaxed space-y-2 font-mono">
                    <span className="block font-bold text-cyan-400">Explanation:</span>
                    <p className="text-slate-350">{lesson.quiz.explanation}</p>
                    
                    <div className="pt-2 border-t border-white/5 flex justify-between items-center flex-wrap gap-2">
                      <span className="text-[10px] text-slate-455 font-sans italic">
                        {quizSelectedIdx === lesson.quiz.correctIndex 
                          ? '🎉 Correct choice unlocks corresponding game world levels!' 
                          : '❌ Try reading theory slides and recheck answers.'}
                      </span>
                      {activeLessonIdx < currentLessons.length - 1 && (
                        <button
                          id="btn_quiz_next_lesson"
                          onClick={handleNextLesson}
                          className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-500 text-black font-bold text-xs rounded transition cursor-pointer"
                        >
                          Next Module
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
