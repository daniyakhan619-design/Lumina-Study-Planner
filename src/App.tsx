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
}

export default function App() {
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [plan, setPlan] = useState<StudyDay[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const generatePlan = () => {
    if (!subject || !examDate || hoursPerDay <= 0) return;

    setIsGenerating(true);
    
    // Simulate AI processing time
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
        
        // Pseudo-AI Logic: Distribute intensity
        // Earlier days are foundational, middle days are heavy, last days are review
        let intensity: 'low' | 'medium' | 'high' = 'medium';
        const progress = i / diffDays;
        
        if (progress < 0.2) intensity = 'low';
        else if (progress > 0.8) intensity = 'low'; // Tapering before exam
        else intensity = 'high';

        newPlan.push({
          id: Math.random().toString(36).substr(2, 9),
          dayNumber: i,
          date: currentDate,
          duration: hoursPerDay,
          topic: topics[Math.floor(Math.random() * topics.length)],
          intensity
        });
      }

      setPlan(newPlan);
      setIsGenerating(false);
    }, 1500);
  };

  const resetPlan = () => {
    setPlan(null);
    setSubject('');
    setExamDate('');
    setHoursPerDay(2);
  };

  const progressPercentage = useMemo(() => {
    if (!plan) return 0;
    // Simple mock progress - in a real app this would be driven by "completed" states
    return Math.min(100, Math.round((7 / (plan.length || 7)) * 100));
  }, [plan]);

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
                    Reset Inputs
                  </button>
                  <h2 className="text-4xl font-serif font-bold text-slate-800 dark:text-white capitalize">
                    {subject} <span className="text-slate-400 font-light">Journey</span>
                  </h2>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-8">
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Days Total</span>
                    <p className="text-2xl font-serif font-bold text-brand-primary">{plan.length}</p>
                  </div>
                  <div className="w-px h-10 bg-slate-100 dark:bg-slate-700 px-0" />
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hours Target</span>
                    <p className="text-2xl font-serif font-bold text-brand-primary">{plan.length * hoursPerDay}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <TrendingUp size={16} className="text-brand-primary" />
                    Overall Readiness
                  </span>
                  <span className="font-bold text-brand-primary">{progressPercentage}%</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                  />
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
                    className="group relative bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                  >
                    {/* Intensity Indicator */}
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 flex items-end justify-start p-6 ${
                      day.intensity === 'high' ? 'bg-red-500' : 
                      day.intensity === 'medium' ? 'bg-brand-primary' : 'bg-emerald-500'
                    }`}>
                    </div>

                    <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 font-bold text-xs uppercase tracking-widest">
                          Day {day.dayNumber}
                        </div>
                        <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                          day.intensity === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                          day.intensity === 'medium' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                        }`}>
                          {day.intensity} Intensity
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-medium">
                          {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white leading-tight group-hover:text-brand-primary transition-colors">
                          {day.topic}
                        </h3>
                      </div>

                      <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Clock size={14} className="text-brand-primary" />
                          <span className="text-sm font-medium">{day.duration} Hours</span>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"
                        >
                          <CheckCircle2 size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Motivational Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-brand-primary/5 dark:bg-brand-primary/10 p-10 rounded-[3rem] text-center space-y-4 border border-brand-primary/10"
              >
                <div className="inline-block p-4 bg-white dark:bg-slate-800 rounded-full shadow-md text-brand-primary">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">You've got this!</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Consistency is the key to brilliance. Follow this roadmap, stay focused, and success will follow.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full opacity-40 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-brand-secondary/10 blur-[150px] rounded-full" />
      </div>
    </div>
  );
}
