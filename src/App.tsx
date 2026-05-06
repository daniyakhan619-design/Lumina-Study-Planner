/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Moon, 
  Sun, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface StudyDay {
  id: string;
  dayNumber: number;
  date: Date;
  duration: number;
  topic: string;
  intensity: 'low' | 'medium' | 'high';
  completed: boolean;
}

export default function App() {
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [plan, setPlan] = useState<StudyDay[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState<StudyDay | null>(null);

  // Initialize theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Derived study tips based on subject
  const studyIntelligence = useMemo(() => {
    const s = subject.toLowerCase();
    const isMathSci = s.includes('math') || s.includes('physic') || s.includes('chem') || s.includes('calc') || s.includes('bio') || s.includes('stat');
    
    if (isMathSci) {
      return {
        type: 'analytical',
        method: 'Variable-Based Practice',
        approach: 'Solve 5-10 past paper problems. Focus on understanding the derivation, not just the formula.',
        tip: 'Math is a language of patterns. Don\'t just read—write!',
        icon: <TrendingUp className="text-orange-500" />
      };
    }
    return {
      type: 'theoretical',
      method: 'Active Recall / Blurred Sheets',
      approach: 'Read a section, close the book, and write down everything you remember in a mind map.',
      tip: 'Memory is built by retrieval, not review. Test yourself early.',
      icon: <BookOpen className="text-blue-500" />
    };
  }, [subject]);

  const generatePlan = () => {
    if (!subject || !examDate || hoursPerDay <= 0) return;

    setIsGenerating(true);
    
    setTimeout(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(examDate);
      target.setHours(0, 0, 0, 0);

      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        setIsGenerating(false);
        return;
      }

      const newPlan: StudyDay[] = [];
      const topics = [
        "Core Concepts & Fundamentals",
        "Key Theories & Applications",
        "In-depth Topic Analysis",
        "Problem Solving & Case Studies",
        "Advanced Practical Exercises",
        "Comprehensive Review Session",
        "Mock Exam & Final Refresh"
      ];

      for (let i = 1; i <= diffDays; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i - 1);
        
        let intensity: 'low' | 'medium' | 'high' = 'medium';
        const progress = i / diffDays;
        
        if (progress < 0.2) intensity = 'low';
        else if (progress > 0.8) intensity = 'low'; 
        else intensity = 'high';

        newPlan.push({
          id: Math.random().toString(36).substr(2, 9),
          dayNumber: i,
          date: currentDate,
          duration: hoursPerDay,
          topic: topics[Math.floor(Math.random() * topics.length)],
          intensity,
          completed: false
        });
      }

      setPlan(newPlan);
      setIsGenerating(false);
    }, 1500);
  };

  const toggleDayCompletion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't open the modal when clicking the checkbox
    setPlan(prev => prev ? prev.map(day => 
      day.id === id ? { ...day, completed: !day.completed } : day
    ) : null);
  };

  const resetProgress = () => {
    setPlan(prev => prev ? prev.map(day => ({ ...day, completed: false })) : null);
  };

  const resetPlan = () => {
    setPlan(null);
    setSubject('');
    setExamDate('');
    setHoursPerDay(2);
  };

  const completedCount = useMemo(() => plan?.filter(d => d.completed).length || 0, [plan]);
  const progressPercentage = useMemo(() => {
    if (!plan || plan.length === 0) return 0;
    return Math.round((completedCount / plan.length) * 100);
  }, [plan, completedCount]);

  return (
    <div className="min-h-screen bg-soft-bg dark:bg-slate-900 transition-colors duration-500 overflow-x-hidden pb-20">
      {/* Header */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-brand-primary rounded-xl text-white shadow-lg shadow-brand-primary/20">
            <GraduationCap size={24} />
          </div>
          <span className="font-serif text-2xl font-semibold tracking-tight text-slate-800 dark:text-white">
            Lumina<span className="text-brand-primary">Plan</span>
          </span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-8">
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700"
            >
              <div className="max-w-lg mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-serif font-semibold text-slate-800 dark:text-white">
                    Master Your Goals
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400">
                    Tell us what you're studying, and we'll craft a path to excellence.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Subject Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <BookOpen size={16} className="text-brand-primary" />
                      Subject Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Molecular Biology"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Date Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Calendar size={16} className="text-brand-primary" />
                      Exam Date
                    </label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Hours Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Clock size={16} className="text-brand-primary" />
                        Daily Commitment
                      </label>
                      <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full">
                        {hoursPerDay} Hours
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      <span>Light</span>
                      <span>Intense</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!subject || !examDate || isGenerating}
                  onClick={generatePlan}
                  className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
                    !subject || !examDate
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-brand-primary/30'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Sparkles size={24} />
                      </motion.div>
                      Analyzing curriculum...
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      Generate Plan
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <button 
                    onClick={resetPlan}
                    className="text-xs font-bold text-brand-primary uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity"
                  >
                    <ChevronRight size={14} className="rotate-180" />
                    New Subject
                  </button>
                  <h2 className="text-4xl font-serif font-bold text-slate-800 dark:text-white capitalize leading-tight">
                    {subject} <br />
                    <span className="text-slate-400 font-light text-2xl italic">Mission Control</span>
                  </h2>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-6">
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sessions Done</span>
                      <p className="text-2xl font-serif font-bold text-brand-primary">{completedCount}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100 dark:bg-slate-700" />
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hours Left</span>
                      <p className="text-2xl font-serif font-bold text-brand-primary">{(plan.length - completedCount) * hoursPerDay}</p>
                    </div>
                  </div>
                  <button 
                    onClick={resetProgress}
                    className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 transition-colors shadow-sm self-center"
                    title="Reset All Progress"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Progress Section with Smart Tips */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <TrendingUp size={16} className="text-brand-primary" />
                        Course Completion
                      </span>
                      <span className="font-bold text-brand-primary">{progressPercentage}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-1 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full shadow-lg shadow-brand-primary/20"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-4 items-start">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                      {studyIntelligence.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Expert Recommendation</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">"{studyIntelligence.tip}"</p>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-primary text-white p-8 rounded-[2.5rem] shadow-xl shadow-brand-primary/20 space-y-4">
                  <div className="p-3 bg-white/20 w-fit rounded-2xl backdrop-blur-sm">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-bold">Pro Methodology</h3>
                  <p className="text-sm text-brand-primary-foreground/80 leading-relaxed">
                    Try the <strong>{studyIntelligence.method}</strong> for this session. It will help lock in the {studyIntelligence.type} patterns of your subject.
                  </p>
                </div>
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plan.map((day, index) => (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedDay(day)}
                    className={`group relative p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden ${
                      day.completed 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' 
                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-xl'
                    }`}
                  >
                    <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-2xl font-bold text-xs uppercase tracking-widest ${
                          day.completed ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                        }`}>
                          Day {day.dayNumber}
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleDayCompletion(day.id, e)}
                          className={`p-2 rounded-xl transition-all ${
                            day.completed 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-slate-100 dark:bg-slate-900 text-slate-300 hover:text-emerald-500'
                          }`}
                        >
                          <CheckCircle2 size={22} />
                        </motion.button>
                      </div>

                      <div className="space-y-1">
                        <p className={`text-xs font-medium ${day.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                        <h3 className={`text-xl font-semibold leading-tight transition-all duration-300 ${
                          day.completed ? 'text-slate-400 line-through opacity-70' : 'text-slate-800 dark:text-white group-hover:text-brand-primary'
                        }`}>
                          {day.topic}
                        </h3>
                      </div>

                      <div className={`pt-4 border-t flex justify-between items-center ${
                         day.completed ? 'border-emerald-100 dark:border-emerald-900/30' : 'border-slate-50 dark:border-slate-700'
                      }`}>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Clock size={14} className={day.completed ? 'text-emerald-400' : 'text-brand-primary'} />
                          <span className="text-sm font-medium">{day.duration}h</span>
                        </div>
                        <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                          day.intensity === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 
                          day.intensity === 'medium' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {day.intensity}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Execution Guidance Modal */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh] perspective-1000"
            >
              <div className="relative h-32 bg-gradient-to-br from-brand-primary to-brand-secondary p-8 flex items-end">
                <button 
                  onClick={() => setSelectedDay(null)}
                  className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur-md"
                >
                  <Trash2 size={18} className="rotate-45" />
                </button>
                <div className="text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Day {selectedDay.dayNumber} Strategy</p>
                  <h2 className="text-2xl font-serif font-bold line-clamp-1">{selectedDay.topic}</h2>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Method Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-2">
                    <Clock className="text-brand-primary" size={20} />
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Method</h4>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Pomodoro Focus</p>
                    <p className="text-[10px] text-slate-500 italic">25min study / 5min reset</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-2">
                    <Sparkles className="text-brand-secondary" size={20} />
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Technique</h4>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{studyIntelligence.method}</p>
                    <p className="text-[10px] text-slate-500 italic">Active Recall focused</p>
                  </div>
                </div>

                {/* Detailed Approach */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <AlertCircle size={16} className="text-brand-primary" />
                    How to Execute This Session
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                    <ul className="space-y-4">
                      <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed capitalize">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 shrink-0" />
                        {studyIntelligence.approach}
                      </li>
                      <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 shrink-0" />
                        Apply the <strong>80/20 Rule</strong>: Identify the core 20% of content that will account for 80% of exam value.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Final Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    toggleDayCompletion(selectedDay.id, e as any);
                    setSelectedDay(null);
                  }}
                  className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    selectedDay.completed 
                      ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300' 
                      : 'bg-brand-primary text-white shadow-brand-primary/20'
                  }`}
                >
                  {selectedDay.completed ? (
                    <>Return to Planner</>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Mark as Complete
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full opacity-40 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-brand-secondary/10 blur-[150px] rounded-full" />
      </div>
    </div>
  );
}
