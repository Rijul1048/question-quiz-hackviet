"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Pause, 
  Play, 
  Clock, 
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Code2,
  Terminal
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DUMMY_PROBLEMS = [
  {
    id: 1,
    title: "Function Arithmetic",
    statement: "What will be the output?",
    code: `FUNCTION f(a, b)
    RETURN (a + b) * (a - b)
ENDFUNCTION
PRINT f(5, 3)`,
    options: ["16", "8", "2", "14", "4"],
    correctAnswerIndex: 0,
    category: "Programming Logic",
    difficulty: "Easy"
  },
  {
    id: 2,
    title: "Variable Operations",
    statement: "What will be the output?",
    code: `SET a = 3
SET b = a + 1
SET c = a * b - b
PRINT c`,
    options: ["12", "16", "10", "6", "8"],
    correctAnswerIndex: 4,
    category: "Programming Logic",
    difficulty: "Easy"
  },
  {
    id: 3,
    title: "Mathematical Function",
    statement: "What will be the output?",
    code: `FUNCTION mystery(n)
    RETURN n * (n + 1) / 2
ENDFUNCTION
PRINT mystery(7)`,
    options: ["14", "49", "56", "21", "28"],
    correctAnswerIndex: 4,
    category: "Programming Logic",
    difficulty: "Easy"
  },
  {
    id: 4,
    title: "Array Manipulation",
    statement: "What will be the output?",
    code: `SET arr = [10, 20, 30, 40, 50]
FOR i = 0 TO 2
    arr[i] = arr[i] + i * 5
ENDFOR
PRINT arr[2]`,
    options: ["50", "35", "45", "30", "40"],
    correctAnswerIndex: 4,
    category: "Programming Logic",
    difficulty: "Medium"
  },
  {
    id: 5,
    title: "Quadratic Expression",
    statement: "What will be the output?",
    code: `FUNCTION apply(x)
    RETURN x * x - 3 * x + 2
ENDFUNCTION
PRINT apply(4)`,
    options: ["4", "2", "8", "6", "10"],
    correctAnswerIndex: 3,
    category: "Programming Logic",
    difficulty: "Easy"
  },
  {
    id: 6,
    title: "Array Indexing",
    statement: "What will be the output?",
    code: `SET arr = [2, 4, 6, 8]
SET x = arr[1] + arr[3]
PRINT x`,
    options: ["8", "6", "10", "12", "14"],
    correctAnswerIndex: 3,
    category: "Programming Logic",
    difficulty: "Easy"
  },
  {
    id: 7,
    title: "Conditional Logic",
    statement: "What will be the output?",
    code: `SET x = 3
SET y = 4
IF x * y > 10 THEN
    PRINT x + y
ELSE
    PRINT x * y
ENDIF`,
    options: ["3", "4", "10", "12", "7"],
    correctAnswerIndex: 4,
    category: "Programming Logic",
    difficulty: "Easy"
  },
  {
    id: 8,
    title: "Function Difference",
    statement: "What will be the output?",
    code: `FUNCTION f(x)
    RETURN x * x - x
ENDFUNCTION
PRINT f(5) - f(3)`,
    options: ["8", "10", "14", "6", "12"],
    correctAnswerIndex: 2,
    category: "Programming Logic",
    difficulty: "Medium"
  },
  {
    id: 9,
    title: "Arithmetic Expression",
    statement: "What will be the output?",
    code: `SET x = 3
SET y = 2
SET z = x * x + y * y
PRINT z - x`,
    options: ["7", "9", "10", "11", "8"],
    correctAnswerIndex: 2,
    category: "Programming Logic",
    difficulty: "Easy"
  },
  {
    id: 10,
    title: "Loop Calculation",
    statement: "What will be the output?",
    code: `SET x = 1
FOR i = 1 TO 4
    x = x + i
    x = x - 1
ENDFOR
PRINT x`,
    options: ["4", "5", "6", "7", "8"],
    correctAnswerIndex: 3,
    category: "Programming Logic",
    difficulty: "Medium"
  }
];

const INITIAL_TIME_SECONDS = 30;

export default function GamePage() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showTimesUp, setShowTimesUp] = useState(false);
  const [direction, setDirection] = useState(0); 
  
  // MCQ Specific State
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const currentProblem = DUMMY_PROBLEMS[currentProblemIndex];

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTimerRunning, timeLeft]);

  // Handle time's up trigger
  useEffect(() => {
    if (timeLeft === 0) {
      setShowTimesUp(true);
      try {
         const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
         audio.play().catch(() => {});
      } catch (e) {}
    }
  }, [timeLeft]);

  // Reset states for current problem
  const resetProblemState = () => {
    setSelectedIndices([]);
    setIsAnswerRevealed(false);
    setTimeLeft(INITIAL_TIME_SECONDS);
    setShowTimesUp(false);
  };

  // Handle navigation
  const goToNextProblem = useCallback(() => {
    if (currentProblemIndex < DUMMY_PROBLEMS.length - 1) {
      setDirection(1);
      setCurrentProblemIndex((prev) => prev + 1);
      resetProblemState();
    }
  }, [currentProblemIndex]);

  const goToPrevProblem = useCallback(() => {
    if (currentProblemIndex > 0) {
      setDirection(-1);
      setCurrentProblemIndex((prev) => prev - 1);
      resetProblemState();
    }
  }, [currentProblemIndex]);

  // Selection logic
  const handleOptionSelect = (index: number) => {
    if (isAnswerRevealed) return; 
    
    setSelectedIndices((prev) => [...prev, index]);
    setIsAnswerRevealed(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        handleOptionSelect(parseInt(e.key) - 1);
      }

      switch (e.key) {
        case "ArrowRight":
          goToNextProblem();
          break;
        case "ArrowLeft":
          goToPrevProblem();
          break;
        case " ":
          e.preventDefault();
          setIsTimerRunning((prev) => !prev);
          break;
        case "r":
        case "R":
          resetProblemState();
          break;
        case "t":
        case "T":
          setShowTimesUp((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextProblem, goToPrevProblem]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    })
  };

  return (
    <main className="relative flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-white font-sans bg-grid">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 flex-none flex items-center justify-between px-4 md:px-8 py-4 md:py-6 glass border-b-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <Code2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-widest uppercase text-indigo-400">
              Coding Challenge
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Hack Viet 2026</p>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900/50 rounded-full border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-sm md:text-base font-bold tracking-tight text-zinc-100">
              QUESTION {currentProblem.id}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 mr-2">
            <button 
              onClick={resetProblemState}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
              title="Reset Question (R)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
              title={isTimerRunning ? "Pause (Space)" : "Resume (Space)"}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
          
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300",
            timeLeft <= 10 
              ? "bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          )}>
            <Clock className={cn("w-5 h-5", timeLeft <= 10 && "animate-pulse")} />
            <span className="font-mono text-xl md:text-2xl font-black tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area - Split Screen */}
      <section className="relative flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentProblemIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="flex flex-col lg:flex-row w-full h-full p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8"
          >
            {/* Left Column: Code Display (60%) */}
            <div className="flex-1 lg:flex-[1.5] flex flex-col min-h-0">
               <div className="flex-1 glass-card rounded-3xl overflow-hidden flex flex-col border border-white/5">
                 <div className="flex-none px-6 py-4 bg-zinc-900/50 border-b border-zinc-800/50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Terminal className="w-4 h-4 text-zinc-500" />
                     <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">
                       {currentProblem.category}.src
                     </span>
                   </div>
                   <div className="flex gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-red-500/20" />
                     <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                     <div className="w-2 h-2 rounded-full bg-green-500/20" />
                   </div>
                 </div>
                 
                 <div className="flex-1 overflow-auto p-6 md:p-8 font-mono text-sm md:text-2xl lg:text-3xl leading-relaxed bg-[#0a0a0c]">
                    <pre className="text-indigo-100 selection:bg-indigo-500/30">
                      <code>{currentProblem.code}</code>
                    </pre>
                 </div>
               </div>
            </div>

            {/* Right Column: Question + Options (40%) */}
            <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto pr-1">
               {/* Question Section */}
               <div className="glass-card rounded-[2rem] p-6 md:p-8 relative overflow-hidden flex-none border border-indigo-500/5">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                        {currentProblem.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        {currentProblem.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                      {currentProblem.statement}
                    </h3>
                  </div>
               </div>

               {/* Options Stack */}
               <div className="flex flex-col gap-3 md:gap-4 flex-none pb-4">
                 {currentProblem.options.map((option, idx) => {
                    const isSelected = selectedIndices.includes(idx);
                    const isCorrect = idx === currentProblem.correctAnswerIndex;
                    
                    return (
                      <motion.button
                        key={idx}
                        whileHover={!isAnswerRevealed ? { x: 5, backgroundColor: "rgba(24, 24, 27, 0.8)" } : {}}
                        whileTap={!isAnswerRevealed ? { scale: 0.98 } : {}}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswerRevealed}
                        className={cn(
                          "relative flex items-center gap-4 p-4 md:p-5 rounded-2xl border text-left transition-all duration-300",
                          !isAnswerRevealed && "glass-card border-white/5 hover:border-indigo-500/30",
                          isAnswerRevealed && isCorrect && "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
                          isAnswerRevealed && !isCorrect && isSelected && "bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
                          isAnswerRevealed && !isCorrect && !isSelected && "opacity-20 border-zinc-900 grayscale"
                        )}
                      >
                        <div className={cn(
                          "flex-none flex items-center justify-center w-9 h-9 rounded-xl border font-black text-sm transition-all duration-300",
                          !isAnswerRevealed && "bg-zinc-800 border-zinc-700 text-zinc-500",
                          isAnswerRevealed && isCorrect && "bg-emerald-500 border-emerald-400 text-black shadow-lg",
                          isAnswerRevealed && !isCorrect && isSelected && "bg-red-500 border-red-400 text-white shadow-lg"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        
                        <span className="flex-1 text-sm md:text-base font-bold tracking-tight">
                          {option}
                        </span>

                        {isAnswerRevealed && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-in zoom-in-50 duration-300" />
                        )}
                        {isAnswerRevealed && !isCorrect && isSelected && (
                          <XCircle className="w-5 h-5 text-red-500 animate-in zoom-in-50 duration-300" />
                        )}
                      </motion.button>
                    );
                 })}
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Footer Navigation */}
      <footer className="relative z-20 flex-none px-4 md:px-8 py-4 md:py-6 flex items-center justify-between gap-4 glass border-t-0">
        <button
          onClick={goToPrevProblem}
          disabled={currentProblemIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-widest hover:border-indigo-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {DUMMY_PROBLEMS.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentProblemIndex ? 1 : -1);
                  setCurrentProblemIndex(idx);
                  resetProblemState();
                }}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === currentProblemIndex ? "w-6 bg-indigo-500" : "w-1.5 bg-zinc-800 hover:bg-zinc-700"
                )}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            Progress
          </span>
        </div>

        <button
          onClick={goToNextProblem}
          disabled={currentProblemIndex === DUMMY_PROBLEMS.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 shadow-lg disabled:opacity-20 disabled:pointer-events-none transition-all group"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>

      {/* Time's Up Overlay */}
      <AnimatePresence>
        {showTimesUp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl px-4"
          >
             <button 
                onClick={() => setShowTimesUp(false)}
                className="absolute top-8 right-8 p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex p-4 bg-red-500/10 border border-red-500/20 rounded-3xl mb-8">
                <AlertCircle className="w-12 h-12 text-red-500 animate-bounce" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase mb-2">
                TIME&apos;S UP
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-12">
                The round has concluded
              </p>
              
              <div className="mt-12">
                 <p className="text-zinc-400 text-lg font-bold tracking-widest uppercase">
                    Press <kbd className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white mx-2">T</kbd> to dismiss
                 </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
