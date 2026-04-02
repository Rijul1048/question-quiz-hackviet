"use client";

import { useState, useEffect, useCallback } from "react";

const DUMMY_PROBLEMS = [
  {
    id: 1,
    title: "The Bridge Crossing ",
    statement: "Four people come to a river in the night. There is a narrow bridge, but it can only hold two people at a time. They have one torch and, because it's night, the torch has to be used when crossing the bridge. Person A can cross the bridge in 1 minute, B in 2 minutes, C in 5 minutes, and D in 8 minutes. When two people cross the bridge together, they must move at the slower person's pace. The question is, can they all get across the bridge if the torch lasts only 15 minutes?",
  },
  {
    id: 2,
    title: "The Three Switches",
    statement: "You are standing outside a closed room. Inside the room, there are three light bulbs. Outside the room, there are three switches, each corresponding to one of the bulbs. You can flip the switches however you like. You are allowed to enter the room only once. How can you determine which switch corresponds to which light bulb?",
  },
  {
    id: 3,
    title: "The Monty Hall Problem",
    statement: "Suppose you're on a game show, and you're given the choice of three doors: Behind one door is a car; behind the others, goats. You pick a door, say No. 1, and the host, who knows what's behind the doors, opens another door, say No. 3, which has a goat. He then says to you, \"Do you want to pick door No. 2?\" Is it to your advantage to switch your choice?",
  },
  {
    id: 4,
    title: "The Burning Ropes",
    statement: "You have two ropes. Each rope takes exactly 60 minutes to burn completely. However, the ropes burn at inconsistent rates (e.g., one part might burn fast, while another burns slow). You have a lighter but no clock or any other way to measure time. How can you measure exactly 45 minutes using only these two ropes and your lighter?",
  }
];

// Start from 30 seconds
const INITIAL_TIME_SECONDS = 30; 

export default function GamePage() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showTimesUp, setShowTimesUp] = useState(false);

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

  // Handle navigation
  const goToNextProblem = useCallback(() => {
    setCurrentProblemIndex((prev) => {
      if (prev < DUMMY_PROBLEMS.length - 1) {
        setTimeLeft(INITIAL_TIME_SECONDS);
        setShowTimesUp(false);
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const goToPrevProblem = useCallback(() => {
    setCurrentProblemIndex((prev) => {
      if (prev > 0) {
        setTimeLeft(INITIAL_TIME_SECONDS);
        setShowTimesUp(false);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          goToNextProblem();
          break;
        case "ArrowLeft":
          goToPrevProblem();
          break;
        case " ":
          e.preventDefault(); // Prevent page scrolling
          setIsTimerRunning((prev) => !prev);
          break;
        case "r":
        case "R":
          setTimeLeft(INITIAL_TIME_SECONDS);
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

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-white font-sans">
      {/* Top Bar */}
      <header className="flex-none flex items-center justify-between px-8 py-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
        <div className="flex-1 text-left">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-400">
            Problem Round
          </h1>
        </div>

        <div className="flex-1 text-center">
          <h2 className="text-3xl font-bold tracking-widest uppercase text-zinc-100">
            Problem {currentProblem.id}
          </h2>
        </div>

        <div className="flex-1 text-right flex justify-end items-center gap-4">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest px-3 py-1 rounded border border-zinc-800 hover:border-zinc-700"
          >
            {isTimerRunning ? 'Pause' : 'Resume'}
          </button>
          <div className={`font-mono text-5xl font-black tracking-tight ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* Center Area */}
      <section className="flex-1 flex flex-col p-8 md:p-12 lg:p-16 overflow-y-auto w-full">
        <div className="space-y-8 md:space-y-12 text-center w-full max-w-7xl m-auto py-4">
          <h3 className="text-3xl md:text-5xl font-extrabold text-white/90 tracking-tight">
            {currentProblem.title}
          </h3>
          <p className="text-2xl md:text-4xl lg:text-5xl font-medium leading-relaxed text-zinc-300 mx-auto text-balance shadow-black drop-shadow-lg">
            {currentProblem.statement}
          </p>
        </div>
      </section>

      {/* Bottom Navigation */}
      <footer className="flex-none flex items-center justify-between px-12 py-8 bg-zinc-950 w-full relative z-10 bottom-0 select-none">

        {/* Previous Button */}
        <button
          onClick={goToPrevProblem}
          disabled={currentProblemIndex === 0}
          className="group flex items-center gap-4 text-xl font-bold tracking-widest uppercase px-8 py-4 rounded-full border-2 border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 disabled:opacity-20 disabled:hover:scale-100 disabled:hover:border-zinc-800 disabled:hover:bg-transparent transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="text-2xl transition-transform group-hover:-translate-x-2">&larr;</span>
          <span>Previous</span>
        </button>

        {/* Progress Dots */}
        <div className="flex gap-3">
          {DUMMY_PROBLEMS.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentProblemIndex ? 'bg-emerald-500 scale-125' : 'bg-zinc-800'}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNextProblem}
          disabled={currentProblemIndex === DUMMY_PROBLEMS.length - 1}
          className="group flex items-center gap-4 text-xl font-bold tracking-widest uppercase px-8 py-4 rounded-full border-2 border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 disabled:opacity-20 disabled:hover:scale-100 disabled:hover:border-zinc-800 disabled:hover:bg-transparent transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span>Next</span>
          <span className="text-2xl transition-transform group-hover:translate-x-2">&rarr;</span>
        </button>

      </footer>

      {/* Time's Up Overlay */}
      {showTimesUp && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-500">
          <div className="text-center transform scale-110 animate-pulse">
            <h1 className="text-8xl md:text-[10rem] font-black text-red-600 tracking-tighter uppercase drop-shadow-[0_0_100px_rgba(220,38,38,0.8)] filter">
              Time&apos;s Up
            </h1>
            <p className="text-red-500/50 mt-4 text-2xl font-bold tracking-widest uppercase">
              Press T to dismiss
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
