/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Circle, Trophy, RotateCcw, HelpCircle, ArrowRight, Maximize, Minimize, Play, Pause, Volume2, Mic, GraduationCap } from 'lucide-react';
import { questions, stage2Questions, stage3Questions, Question } from './data/questions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Player = 'X' | 'O';
type CellValue = Player | null;

export default function App() {
  const [gameStarted, setGameStarted] = useState(() => {
    const saved = localStorage.getItem('gameStarted');
    return saved ? JSON.parse(saved) : false;
  });
  const [setupComplete, setSetupComplete] = useState(() => {
    const saved = localStorage.getItem('setupComplete');
    return saved ? JSON.parse(saved) : false;
  });
  const [isPresenter, setIsPresenter] = useState(() => {
    const saved = localStorage.getItem('isPresenter');
    return saved ? JSON.parse(saved) : false;
  });
  const [teamNames, setTeamNames] = useState(() => {
    const saved = localStorage.getItem('teamNames');
    return saved ? JSON.parse(saved) : { X: 'فريق X', O: 'فريق O' };
  });
  const [board, setBoard] = useState<CellValue[]>(() => {
    const saved = localStorage.getItem('board');
    return saved ? JSON.parse(saved) : Array(9).fill(null);
  });
  const [currentPlayer, setCurrentPlayer] = useState<Player>(() => {
    const saved = localStorage.getItem('currentPlayer');
    return (saved as Player) || 'X';
  });
  const [winner, setWinner] = useState<Player | 'Draw' | null>(() => {
    const saved = localStorage.getItem('winner');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showError, setShowError] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<number[]>(() => {
    const saved = localStorage.getItem('usedQuestions');
    return saved ? JSON.parse(saved) : [];
  });
  const [phase, setPhase] = useState<number>(() => {
    const saved = localStorage.getItem('phase');
    return saved ? JSON.parse(saved) : 1;
  });
  const [round, setRound] = useState<number>(() => {
    const saved = localStorage.getItem('round');
    return saved ? JSON.parse(saved) : 1;
  });
  const [roundWins, setRoundWins] = useState<{ X: number; O: number }>(() => {
    const saved = localStorage.getItem('roundWins');
    return saved ? JSON.parse(saved) : { X: 0, O: 0 };
  });
  const [stage2Index, setStage2Index] = useState(0);
  const [stage2ShowOptions, setStage2ShowOptions] = useState(false);
  const [stage2Score, setStage2Score] = useState<{ X: number; O: number }>(() => {
    const saved = localStorage.getItem('stage2Score');
    return saved ? JSON.parse(saved) : { X: 0, O: 0 };
  });
  const [stage3Positions, setStage3Positions] = useState<{ X: number; O: number }>(() => {
    const saved = localStorage.getItem('stage3Positions');
    return saved ? JSON.parse(saved) : { X: 0, O: 0 };
  });
  const [stage3CurrentQuestion, setStage3CurrentQuestion] = useState<Question | null>(null);
  const [showStage3Question, setShowStage3Question] = useState(false);
  const [streaks, setStreaks] = useState<{ X: number; O: number }>({ X: 0, O: 0 });
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [introComplete, setIntroComplete] = useState<boolean>(() => {
    const saved = localStorage.getItem('introComplete');
    return saved ? JSON.parse(saved) : false;
  });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stage3Timer, setStage3Timer] = useState(20);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isZoomTransitionPaused, setIsZoomTransitionPaused] = useState(false);

  // Non-blocking preloading
  useEffect(() => {
    const stage3Urls = stage3Questions.map(q => q.imageUrl).filter((url): url is string => !!url);
    const stage1Urls = [
      "https://www.dropbox.com/scl/fi/g5i22vcxp6ymsykhzw4ff/Photo-11-04-2026-7-54-55-AM.jpg?rlkey=sg4bsp8r42kj58qmdbsbzkxfn&st=803zg5qm&raw=1",
      "https://www.dropbox.com/scl/fi/vzl9tjyod1xe2ycx50xb8/Photo-12-04-2026-1-28-54-PM.jpg?rlkey=eup7txw2qg9omzsminzgbvhsv&st=2k8t0k7z&raw=1",
      "https://www.dropbox.com/scl/fi/7uciimcp5ppj3d3hqni95/Photo-12-04-2026-11-25-57-PM.jpg?rlkey=bw14grx4tpxq8xegf1rpjnyso&st=fqe89yho&raw=1",
      "https://www.dropbox.com/scl/fi/0wbcurmx8uw6fb9gml86n/Photo-13-04-2026-5-17-42-AM.jpg?rlkey=8wgtbf2cx8w2ecu31ayr49amr&st=qaqparq7&raw=1",
      "https://www.dropbox.com/scl/fi/p1zouzii3g8mklhkppoia/Photo-14-04-2026-4-08-42-AM.jpg?rlkey=d8zlfpcfh30oz5goojejt1owj&st=90tgsqog&raw=1"
    ];
    const imageUrls = [...stage1Urls, ...stage3Urls];

    // Cache images in background
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });

    // Proceed immediately
    setImagesLoaded(true);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen changes (e.g., if user presses Esc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameStarted', JSON.stringify(gameStarted));
    localStorage.setItem('setupComplete', JSON.stringify(setupComplete));
    localStorage.setItem('isPresenter', JSON.stringify(isPresenter));
    localStorage.setItem('teamNames', JSON.stringify(teamNames));
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('currentPlayer', currentPlayer);
    localStorage.setItem('winner', JSON.stringify(winner));
    localStorage.setItem('usedQuestions', JSON.stringify(usedQuestions));
    localStorage.setItem('phase', JSON.stringify(phase));
    localStorage.setItem('round', JSON.stringify(round));
    localStorage.setItem('roundWins', JSON.stringify(roundWins));
    localStorage.setItem('stage2Score', JSON.stringify(stage2Score));
    localStorage.setItem('stage3Positions', JSON.stringify(stage3Positions));
    localStorage.setItem('introComplete', JSON.stringify(introComplete));
  }, [gameStarted, setupComplete, introComplete, isPresenter, teamNames, board, currentPlayer, winner, usedQuestions, phase, round, roundWins, stage2Score, stage3Positions]);


  const audioRef = useRef<HTMLVideoElement | null>(null);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && stage3Timer > 0 && !isZoomTransitionPaused) {
      interval = setInterval(() => {
        setStage3Timer(prev => {
          const newValue = prev - 1;
          // Play gentle alert at 5 seconds - using handled audio trigger
          if (newValue === 5) {
            handlePlayAudio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");
          }
          return newValue;
        });
      }, 1000);
    } else if (stage3Timer === 0 && isTimerActive) {
      setIsTimerActive(false);
      setShowImageZoom(false); // Close zoom on timeout
      // Auto-fail on timeout
      setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
      setShowStage3Question(false);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, stage3Timer, currentPlayer, isZoomTransitionPaused]);

  // Reset timer when question opens/closes
  useEffect(() => {
    if (showStage3Question) {
      setStage3Timer(20);
      // Delay starting the timer for 1.5 seconds to give players time to see the content
      const startDelay = setTimeout(() => {
        setIsTimerActive(true);
      }, 1500);
      return () => clearTimeout(startDelay);
    } else {
      setIsTimerActive(false);
      setIsZoomTransitionPaused(false);
    }
  }, [showStage3Question]);

  // Pause timer briefly when zooming to give time for transition without losing countdown
  useEffect(() => {
    if (showImageZoom && isTimerActive) {
      setIsZoomTransitionPaused(true);
      const timer = setTimeout(() => {
        setIsZoomTransitionPaused(false);
      }, 2000);
      return () => {
        clearTimeout(timer);
        setIsZoomTransitionPaused(false);
      };
    }
  }, [showImageZoom, isTimerActive]);

  const handlePlayAudio = useCallback((url: string) => {
    if (!url || !audioRef.current) return;
    
    const video = audioRef.current;
    
    // Stop any current playback
    video.pause();
    video.currentTime = 0;

    // Direct transformation
    let processedUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    if (processedUrl.includes('dropboxusercontent.com') || processedUrl.includes('dropbox.com')) {
      const urlObj = new URL(processedUrl);
      urlObj.searchParams.set('raw', '1');
      urlObj.searchParams.delete('dl');
      processedUrl = urlObj.toString();
    }
    
    video.src = processedUrl;
    video.load();

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Silent fail for professional feel; user will naturally click something else later
        setIsPlaying(false);
      });
    }
  }, []);
  const triggerAudio = (url: string) => {
    // 1. Play locally
    handlePlayAudio(url);
    
    // 2. Broadcast to other tabs
    const channel = new BroadcastChannel('game_sync');
    channel.postMessage({ type: 'PLAY_AUDIO', url });
    channel.close();
  };

  // Sync state between tabs
  useEffect(() => {
    const channel = new BroadcastChannel('game_sync');
    
    if (isPresenter) {
      const broadcastState = () => {
        channel.postMessage({
          type: 'STATE_UPDATE',
          payload: {
            board,
            currentPlayer,
            winner,
            selectedCell,
            currentQuestion,
            showQuestion,
            showError,
            teamNames,
            gameStarted,
            setupComplete,
            introComplete,
            usedQuestions,
            phase,
            round,
            roundWins,
            stage2Score,
            stage3Positions
          }
        });
      };

      broadcastState();

      channel.onmessage = (event) => {
        if (event.data.type === 'REQUEST_STATE') {
          broadcastState();
        }
        if (event.data.type === 'PLAY_AUDIO') {
          handlePlayAudio(event.data.url);
        }
      };
    } else {
      channel.postMessage({ type: 'REQUEST_STATE' });
      
      channel.onmessage = (event) => {
        if (event.data.type === 'STATE_UPDATE') {
          const state = event.data.payload;
          setBoard(state.board);
          setCurrentPlayer(state.currentPlayer);
          setWinner(state.winner);
          setSelectedCell(state.selectedCell);
          setCurrentQuestion(state.currentQuestion);
          setShowQuestion(state.showQuestion);
          setShowError(state.showError);
          setTeamNames(state.teamNames);
          setGameStarted(state.gameStarted);
          setSetupComplete(state.setupComplete);
          setIntroComplete(state.introComplete);
          setUsedQuestions(state.usedQuestions);
          setPhase(state.phase);
          setRound(state.round);
          setRoundWins(state.roundWins);
          setStage2Score(state.stage2Score);
          setStage3Positions(state.stage3Positions);
        }
        if (event.data.type === 'PLAY_AUDIO') {
          handlePlayAudio(event.data.url);
        }
      };
    }

    return () => {
      channel.close();
    };
  }, [
    isPresenter, board, currentPlayer, winner, selectedCell, 
    currentQuestion, showQuestion, showError, teamNames, 
    gameStarted, setupComplete, introComplete, usedQuestions, phase, round, roundWins,
    handlePlayAudio
  ]);

  // Check for winner
  const checkWinner = useCallback((currentBoard: CellValue[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }

    if (currentBoard.every(cell => cell !== null)) {
      return 'Draw';
    }

    return null;
  }, []);

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    setSelectedCell(index);
    
    // Pick a random question that hasn't been used
    const availableQuestions = questions.filter(q => !usedQuestions.includes(q.id));
    const randomQuestion = availableQuestions.length > 0 
      ? availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
      : questions[Math.floor(Math.random() * questions.length)]; // Reset if all used

    setCurrentQuestion(randomQuestion);
    setShowQuestion(true);
  };

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion || selectedCell === null) return;

    if (answerIndex === currentQuestion.correctIndex) {
      // Correct answer
      const newBoard = [...board];
      newBoard[selectedCell] = currentPlayer;
      setBoard(newBoard);
      setUsedQuestions(prev => [...prev, currentQuestion.id]);
      
      const gameWinner = checkWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        if (gameWinner !== 'Draw') {
          setRoundWins(prev => ({
            ...prev,
            [gameWinner as Player]: prev[gameWinner as Player] + 1
          }));
        }
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
      setShowQuestion(false);
    } else {
      // Incorrect answer
      setShowQuestion(false);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }, 2000);
    }
  };

  const resetGame = () => {
    if (winner && winner !== 'Draw') {
      const winnerWins = roundWins[winner as Player];
      if (winnerWins >= 2) {
        setPhase(2);
        setRound(1);
        setRoundWins({ X: 0, O: 0 });
        setUsedQuestions([]);
        setIntroComplete(false); // Reset intro for Phase 2 if needed, or keep it. User didn't specify.
      } else {
        setRound(prev => prev + 1);
      }
    }
    setStage3Positions({ X: 0, O: 0 });
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setSelectedCell(null);
  };

  if (!imagesLoaded) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#f48fb1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full relative bg-black overflow-hidden" dir="rtl">
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Start & Setup Background */}
        <motion.img 
          key="bg-start"
          src="https://www.dropbox.com/scl/fi/g5i22vcxp6ymsykhzw4ff/Photo-11-04-2026-7-54-55-AM.jpg?rlkey=sg4bsp8r42kj58qmdbsbzkxfn&st=803zg5qm&raw=1" 
          alt="Background Start"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: !gameStarted || !setupComplete ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          referrerPolicy="no-referrer"
        />
        {/* Intro Background */}
        <motion.img 
          key="bg-intro"
          src="https://www.dropbox.com/scl/fi/7uciimcp5ppj3d3hqni95/Photo-12-04-2026-11-25-57-PM.jpg?rlkey=bw14grx4tpxq8xegf1rpjnyso&st=fqe89yho&raw=1" 
          alt="Background Intro"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: gameStarted && setupComplete && !introComplete ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          referrerPolicy="no-referrer"
        />
        {/* Game Background */}
        <motion.img 
          key="bg-game"
          src="https://www.dropbox.com/scl/fi/vzl9tjyod1xe2ycx50xb8/Photo-12-04-2026-1-28-54-PM.jpg?rlkey=eup7txw2qg9omzsminzgbvhsv&st=2k8t0k7z&raw=1" 
          alt="Background Game"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: gameStarted && setupComplete && introComplete && phase === 1 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          referrerPolicy="no-referrer"
        />
        {/* Stage 2 Background - Pastel Stage */}
        <motion.img
          key="bg-stage2"
          src="https://www.dropbox.com/scl/fi/0wbcurmx8uw6fb9gml86n/Photo-13-04-2026-5-17-42-AM.jpg?rlkey=8wgtbf2cx8w2ecu31ayr49amr&st=qaqparq7&raw=1"
          alt="Background Stage 2"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: gameStarted && setupComplete && introComplete && phase === 2 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          referrerPolicy="no-referrer"
        />
        {/* Stage 3 Background - Map/Path */}
        <motion.img
          key="bg-stage3"
          src="https://www.dropbox.com/scl/fi/p1zouzii3g8mklhkppoia/Photo-14-04-2026-4-08-42-AM.jpg?rlkey=d8zlfpcfh30oz5goojejt1owj&st=90tgsqog&raw=1"
          alt="Background Stage 3"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: gameStarted && setupComplete && introComplete && phase === 3 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          referrerPolicy="no-referrer"
        />
      </div>

      <AnimatePresence mode="wait">
        {/* Invisible Global Audio/Video Player */}
        <video 
          ref={audioRef}
          className="invisible absolute pointer-events-none w-0 h-0"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          playsInline
        />

        {!gameStarted ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 h-full w-full flex flex-col items-center justify-center" 
          >
            <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] mx-auto overflow-hidden">
              <div className="relative z-10 flex flex-col items-center justify-end h-full pb-[15%]">
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      // Unlock audio context for Safari by playing a silent sound
                      const silent = audioRef.current;
                      if (silent) {
                        silent.volume = 0;
                        silent.play().catch(() => {});
                      }
                      setGameStarted(true);
                    }}
                    className="bg-[#f48fb1] text-white px-5 py-2 rounded-full text-base font-black shadow-[0_4px_0_rgb(194,24,91)] transition-all flex items-center justify-center min-w-[140px]"
                  >
                    <Play className="w-3.5 h-3.5 ml-2" />
                    ابدأ اللعب
                  </motion.button>
              </div>

              <button
                onClick={toggleFullscreen}
                className="absolute bottom-12 left-12 z-20 bg-white/80 p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#2e7d32]"
                title="ملء الشاشة"
              >
                {isFullscreen ? <Minimize className="w-8 h-8" /> : <Maximize className="w-8 h-8" />}
              </button>
            </div>
          </motion.div>
        ) : !setupComplete ? (
          <motion.div 
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 h-full w-full flex flex-col items-center justify-center" 
          >
            <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] mx-auto overflow-hidden flex items-center justify-center">
              <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-6 py-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#c8e6c9]/95 backdrop-blur-md p-8 rounded-[3rem] shadow-2xl w-full space-y-6 border-2 border-white/50"
                >
                  <h2 className="text-3xl font-black text-[#2e7d32] text-center mb-2">إعداد الفرق</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-bold text-[#2e7d32]/70 mb-2">( إسم الفريق الأول )</label>
                      <input 
                        type="text" 
                        value={teamNames.X}
                        onChange={(e) => setTeamNames(prev => ({ ...prev, X: e.target.value }))}
                        className="w-full px-6 py-3 rounded-2xl border-2 border-[#f48fb1]/30 bg-white/50 text-[#2e7d32] text-xl outline-none focus:border-[#f48fb1] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-[#2e7d32]/70 mb-2">( إسم الفريق الثاني )</label>
                      <input 
                        type="text" 
                        value={teamNames.O}
                        onChange={(e) => setTeamNames(prev => ({ ...prev, O: e.target.value }))}
                        className="w-full px-6 py-3 rounded-2xl border-2 border-[#f48fb1]/30 bg-white/50 text-[#2e7d32] text-xl outline-none focus:border-[#f48fb1] transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-4">
                    <button
                      onClick={() => { setIsPresenter(true); setSetupComplete(true); }}
                      className="bg-[#f48fb1] text-white py-4 rounded-2xl text-2xl font-bold shadow-lg hover:bg-[#f06292] transition-all"
                    >
                      دخول المقدم (عرض الإجابات)
                    </button>
                    <button
                      onClick={() => { setIsPresenter(false); setSetupComplete(true); }}
                      className="bg-[#f48fb1]/80 text-white py-4 rounded-2xl text-2xl font-bold shadow-lg hover:bg-[#f48fb1] transition-all"
                    >
                      دخول كلاعبين
                    </button>
                  </div>
                </motion.div>
              </div>

              <button
                onClick={() => setGameStarted(false)}
                className="absolute top-12 right-12 z-20 bg-white/80 p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#2e7d32]"
              >
                <ArrowRight className="w-8 h-8" />
              </button>
            </div>
          </motion.div>
        ) : !introComplete ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 h-full w-full flex flex-col items-center justify-center" 
          >
            <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] mx-auto overflow-hidden">
              <div className="absolute inset-0 z-10">
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIntroComplete(true)}
                  className="absolute bottom-[22%] left-[50%] translate-x-[-50%] bg-[#f48fb1] text-white px-8 py-2.5 rounded-full text-xl font-black shadow-[0_4px_0_rgb(194,24,91)] transition-all flex items-center justify-center min-w-[140px]"
                >
                  ابدأ
                </motion.button>
              </div>

              <button
                onClick={() => { setSetupComplete(false); setIntroComplete(false); }}
                className="absolute top-12 right-12 z-20 bg-white/80 p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#2e7d32]"
              >
                <ArrowRight className="w-8 h-8" />
              </button>
            </div>
          </motion.div>
        ) : phase === 1 ? (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 h-full w-full flex flex-col items-center justify-center" 
          >
            <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] mx-auto overflow-hidden flex flex-col items-center justify-center">
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4 pt-[10vh]">
          {/* Header */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-2"
          >
            <h1 className="text-3xl md:text-5xl font-black text-[#4db6ac] mb-1 drop-shadow-sm">
              المرحلة الأولى
            </h1>
            <div className="flex flex-col gap-1">
              <div className="text-[#4db6ac] font-bold text-lg">
                الجولة {round} من 3
              </div>
              {isPresenter && (
                <div className="bg-[#e0f2f1] text-[#00796b] px-3 py-1 rounded-full text-sm font-bold inline-block self-center">
                  وضع المقدم - الإجابات ظاهرة لك
                </div>
              )}
            </div>
          </motion.div>

          {/* Game Info */}
          <div className="flex gap-6 mb-2 items-center">
            <div className={cn(
              "flex flex-col items-center p-3 rounded-[1.2rem] transition-all duration-300 border-4 bg-white/90 shadow-xl relative",
              currentPlayer === 'X' ? "border-[#f48fb1] scale-105" : "border-transparent opacity-60"
            )}>
              <div className="absolute -top-2 -right-2 bg-[#f48fb1] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
                {roundWins.X}
              </div>
              <span className="text-sm font-bold text-gray-500 mb-1">{teamNames.X}</span>
              <X className="w-8 h-8 text-[#f48fb1]" strokeWidth={4} />
            </div>

            <div className="text-2xl font-black text-[#4db6ac] opacity-30">VS</div>

            <div className={cn(
              "flex flex-col items-center p-3 rounded-[1.2rem] transition-all duration-300 border-4 bg-white/90 shadow-xl relative",
              currentPlayer === 'O' ? "border-[#e0f2f1] scale-105" : "border-transparent opacity-60"
            )}>
              <div className="absolute -top-2 -left-2 bg-[#e0f2f1] text-[#4db6ac] w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
                {roundWins.O}
              </div>
              <span className="text-sm font-bold text-gray-500 mb-1">{teamNames.O}</span>
              <Circle className="w-8 h-8 text-[#4db6ac]" strokeWidth={4} />
            </div>
          </div>

          {/* Game Board */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-3 bg-white/30 p-3 rounded-[2rem] backdrop-blur-sm shadow-2xl border border-white/50"
          >
            {board.map((cell, i) => (
              <motion.button
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + (i * 0.05), type: "spring" }}
                whileHover={{ scale: (cell || !isPresenter) ? 1 : 1.05 }}
                whileTap={{ scale: (cell || !isPresenter) ? 1 : 0.95 }}
                onClick={() => isPresenter && handleCellClick(i)}
                disabled={!!cell || !!winner || showError || !isPresenter}
                className={cn(
                  "w-20 h-20 md:w-28 md:h-28 rounded-[1.2rem] flex items-center justify-center text-3xl md:text-5xl transition-colors duration-300",
                  cell ? "bg-white shadow-inner" : "bg-white/80 hover:bg-white shadow-lg",
                  !cell && !winner && isPresenter && "hover:shadow-2xl cursor-pointer",
                  !isPresenter && "cursor-default"
                )}
              >
              <AnimatePresence mode="wait">
                {cell === 'X' && (
                  <motion.div
                    key="X"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                  >
                    <X className="w-10 h-10 md:w-14 md:h-14 text-[#f48fb1]" strokeWidth={3} />
                  </motion.div>
                )}
                {cell === 'O' && (
                  <motion.div
                    key="O"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Circle className="w-10 h-10 md:w-14 md:h-14 text-[#4db6ac]" strokeWidth={3} />
                  </motion.div>
                )}
                {!cell && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    className="text-gray-300"
                  >
                    <HelpCircle className="w-10 h-10" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </motion.div>

        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: isPresenter ? 1.1 : 1 }}
          whileTap={{ scale: isPresenter ? 0.9 : 1 }}
          onClick={() => isPresenter && resetGame()}
          disabled={!isPresenter}
          className={cn(
            "mt-4 flex items-center gap-2 bg-[#4db6ac] text-white px-6 py-2 rounded-full font-bold shadow-xl transition-colors text-base",
            isPresenter ? "hover:bg-[#00897b] cursor-pointer" : "opacity-50 cursor-default"
          )}
        >
          <RotateCcw className="w-5 h-5" />
          إعادة اللعب
        </motion.button>

        {/* Question Dialog */}
        <Dialog open={showQuestion} onOpenChange={setShowQuestion}>
          <DialogContent className={cn(
            "border-none rounded-[2rem] p-8 max-w-[90vw] md:max-w-md shadow-2xl",
            currentPlayer === 'X' ? "bg-[#f48fb1] text-white" : "bg-[#e0f2f1] text-[#4db6ac]"
          )}>
            <DialogHeader>
              <DialogTitle className={cn(
                "text-center text-2xl font-bold mb-6",
                currentPlayer === 'X' ? "text-white" : "text-[#4db6ac]"
              )}>
                سؤال لـ {currentPlayer === 'X' ? teamNames.X : teamNames.O}
              </DialogTitle>
            </DialogHeader>
            
            {currentQuestion && (
              <div className="space-y-6">
                <p className="text-xl md:text-2xl text-center font-medium leading-relaxed">
                  {currentQuestion.text}
                </p>

                {currentQuestion.audioUrl && (
                  <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-6 h-6 animate-pulse" />
                      <span className="font-bold">استمع للمقطع الصوتي</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => triggerAudio(currentQuestion.audioUrl!)}
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all",
                        currentPlayer === 'X' ? "bg-white text-[#f48fb1]" : "bg-[#4db6ac] text-white"
                      )}
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </motion.button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: isPresenter ? 1.02 : 1, backgroundColor: isPresenter ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: isPresenter ? 0.98 : 1 }}
                      onClick={() => isPresenter && handleAnswer(idx)}
                      disabled={!isPresenter}
                      className={cn(
                        "w-full py-4 px-6 rounded-2xl border-2 text-right text-lg font-bold transition-colors",
                        currentPlayer === 'X' ? "bg-white/10 border-white/20" : "bg-black/5 border-[#4db6ac]/20",
                        isPresenter && idx === currentQuestion.correctIndex && (currentPlayer === 'X' ? "bg-green-400/40 border-green-300" : "bg-[#4db6ac]/20 border-[#00796b]"),
                        !isPresenter && "cursor-default"
                      )}
                    >
                      {option}
                      {isPresenter && idx === currentQuestion.correctIndex && (
                        <span className={cn(
                          "mr-2 text-sm px-2 py-1 rounded-lg",
                          currentPlayer === 'X' ? "bg-white text-[#1b5e20]" : "bg-[#4db6ac] text-white"
                        )}>الإجابة الصحيحة</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Error Overlay */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1.5, rotate: 0 }}
                exit={{ scale: 2, opacity: 0 }}
                className="flex flex-col items-center justify-center p-8"
              >
                <div className="relative">
                  <X 
                    className="w-64 h-64 md:w-96 md:h-96 text-[#f48fb1] drop-shadow-[0_0_15px_rgba(200,230,201,0.8)]" 
                    strokeWidth={12} 
                    style={{ 
                      filter: 'drop-shadow(0 0 2px #c8e6c9) drop-shadow(0 0 2px #c8e6c9) drop-shadow(0 0 2px #c8e6c9)' 
                    }}
                  />
                </div>
                <p className="text-white text-5xl font-black text-center mt-8 drop-shadow-lg scale-75">
                  إجابة خاطئة
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Winner Overlay */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className={cn(
                  "p-12 rounded-[3rem] text-center shadow-2xl max-w-md w-full border-4 border-white",
                  winner === 'X' ? "bg-[#f48fb1] text-white" : 
                  winner === 'O' ? "bg-[#c8e6c9] text-[#2e7d32]" : 
                  "bg-white text-gray-800"
                )}
              >
                <Trophy className={cn(
                  "w-24 h-24 mx-auto mb-6 drop-shadow-lg",
                  winner === 'X' ? "text-white" : "text-yellow-400"
                )} />
                <h2 className="text-4xl font-black mb-4">
                  {winner === 'Draw' ? 'تعادل!' : `فاز ${winner === 'X' ? teamNames.X : teamNames.O}!`}
                </h2>
                <p className={cn(
                  "text-lg mb-8 font-bold opacity-90",
                  winner === 'X' ? "text-white" : "text-[#4db6ac]"
                )}>
                  {phase === 1 ? (
                    winner !== 'Draw' && roundWins[winner as Player] >= 2 
                      ? "مبروك! تم حسم المرحلة الأولى!" 
                      : "استعد للجولة القادمة!"
                  ) : phase === 2 ? (
                    "مبروك! تم حسم المرحلة الثانية!"
                  ) : (
                    "مبروك! تم حسم المرحلة الثالثة والنهائية!"
                  )}
                </p>
                <Button 
                  onClick={() => {
                    if (!isPresenter) return;
                    if (phase === 1) {
                      resetGame();
                    } else if (phase === 2) {
                      setPhase(3);
                      setWinner(null);
                    } else {
                      // Final win, maybe reset to start or just close
                      setWinner(null);
                      setPhase(1);
                      setGameStarted(false);
                      setSetupComplete(false);
                      setIntroComplete(false);
                    }
                  }}
                  disabled={!isPresenter}
                  className={cn(
                    "w-full py-6 text-xl rounded-2xl transition-all font-black shadow-lg",
                    winner === 'X' ? "bg-white text-[#f48fb1] hover:bg-white/90" : 
                    winner === 'O' ? "bg-[#4db6ac] text-white hover:bg-[#00897b]" : 
                    "bg-[#4db6ac] text-white",
                    !isPresenter && "opacity-50 cursor-default"
                  )}
                >
                  {phase === 1 ? (
                    winner !== 'Draw' && roundWins[winner as Player] >= 2 
                      ? "الانتقال للمرحلة الثانية" 
                      : "الجولة التالية"
                  ) : phase === 2 ? (
                    "الانتقال للمرحلة الثالثة"
                  ) : (
                    "العودة للرئيسية"
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        <button
          onClick={() => { setSetupComplete(false); setIntroComplete(false); }}
          className="absolute top-12 right-12 z-20 bg-white/80 p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#4db6ac]"
        >
          <ArrowRight className="w-8 h-8" />
        </button>

        {/* Next Stage Button */}
        <button
          onClick={() => setPhase(2)}
          className="absolute bottom-4 right-12 z-20 bg-[#4db6ac] text-white px-8 py-3 rounded-full text-xl font-black shadow-lg hover:bg-[#00897b] transition-all border-4 border-white"
        >
          المرحلة الثانية
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-12 left-12 z-20 bg-white/80 p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#4db6ac]"
          title="ملء الشاشة"
        >
          {isFullscreen ? <Minimize className="w-8 h-8" /> : <Maximize className="w-8 h-8" />}
        </button>

        {/* Footer */}
        <div className="mt-auto py-6 text-[#4db6ac]/50 font-medium text-lg">
          صنع بكل حب للمجموعات الذكية
        </div>
      </div>
    </div>
  </motion.div>
) : phase === 2 ? (
  <motion.div 
    key="stage2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    className="relative z-10 h-full w-full flex flex-col items-center justify-center p-4 shadow-xl" 
  >
    <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] mx-auto overflow-hidden flex flex-col items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4">
          {/* Stage Area - Centered */}
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl relative">
            {/* Microphone / Audio Trigger */}
            <div className="relative z-20 flex flex-col items-center -translate-y-3">
              {/* Score Counters - Left and Right */}
              <div className="absolute top-1/2 -translate-y-1/2 w-[calc(100%+160px)] md:w-[calc(100%+240px)] flex justify-between pointer-events-none">
                {/* Team X Score */}
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="pointer-events-auto flex flex-col items-center gap-2"
                >
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border-4 border-[#9575cd]/30 shadow-xl min-w-[100px] text-center">
                    <div className="text-[#9575cd] text-sm font-black mb-1">{teamNames.X}</div>
                    <div className="text-4xl font-black text-[#f48fb1]">{stage2Score.X}</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setStage2Score(prev => ({ ...prev, X: Math.max(0, prev.X - 1) }))}
                      className="bg-white/80 w-8 h-8 rounded-full flex items-center justify-center text-[#9575cd] font-bold shadow-md border-2 border-white hover:bg-white"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => setStage2Score(prev => ({ ...prev, X: prev.X + 1 }))}
                      className="bg-[#f48fb1] w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white hover:scale-110 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </motion.div>

                {/* Team O Score */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="pointer-events-auto flex flex-col items-center gap-2"
                >
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border-4 border-[#9575cd]/30 shadow-xl min-w-[100px] text-center">
                    <div className="text-[#9575cd] text-sm font-black mb-1">{teamNames.O}</div>
                    <div className="text-4xl font-black text-[#f48fb1]">{stage2Score.O}</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setStage2Score(prev => ({ ...prev, O: Math.max(0, prev.O - 1) }))}
                      className="bg-white/80 w-8 h-8 rounded-full flex items-center justify-center text-[#9575cd] font-bold shadow-md border-2 border-white hover:bg-white"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => setStage2Score(prev => ({ ...prev, O: prev.O + 1 }))}
                      className="bg-[#f48fb1] w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white hover:scale-110 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  triggerAudio(stage2Questions[stage2Index].audioUrl);
                  setStage2ShowOptions(true);
                }}
                className="w-40 h-40 md:w-56 md:h-56 bg-[#f48fb1] rounded-full flex items-center justify-center cursor-pointer border-8 border-[#9575cd] relative transition-all"
              >
                <Mic className={cn("w-20 h-20 md:w-28 md:h-28 text-[#9575cd]", isPlaying && "animate-pulse")} />
                
                {/* Floating Graduation Caps */}
                {isPlaying && (
                  <>
                    <motion.div 
                      animate={{ y: [-20, -80], x: [0, 40], opacity: [0, 1, 0], rotate: [0, 20] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute top-0 right-0"
                    >
                      <GraduationCap className="w-10 h-10 text-[#fff9c4]" />
                    </motion.div>
                    <motion.div 
                      animate={{ y: [-10, -70], x: [0, -50], opacity: [0, 1, 0], rotate: [0, -25] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                      className="absolute top-4 left-0"
                    >
                      <GraduationCap className="w-8 h-8 text-[#fff9c4]" />
                    </motion.div>
                    <motion.div 
                      animate={{ y: [-30, -100], x: [20, -10], opacity: [0, 1, 0], rotate: [0, 15] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                      className="absolute -top-4 left-1/2"
                    >
                      <GraduationCap className="w-7 h-7 text-[#fff9c4]" />
                    </motion.div>
                  </>
                )}
              </motion.div>
              
              {/* Instruction Label - Fixed height container to prevent layout shift and overlap */}
              <div className="h-24 flex items-center justify-center mt-6">
                <AnimatePresence>
                  {!stage2ShowOptions && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="whitespace-nowrap bg-white/90 backdrop-blur-sm px-8 py-3 rounded-full text-[#9575cd] font-black shadow-lg border-2 border-[#9575cd]/20"
                    >
                      اضغط للميكروفون للاستماع
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Options Area - Positioned closer to the label */}
            <div className="absolute bottom-[7%] left-0 right-0 h-[35%] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {stage2ShowOptions ? (
                  <motion.div 
                    key="options"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4"
                  >
                    {stage2Questions[stage2Index].options.map((opt, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05, backgroundColor: '#fce4ec' }}
                        whileTap={{ scale: 0.95 }}
                        className="py-4 px-6 text-xl font-black rounded-[1.5rem] bg-[#f48fb1] text-[#9575cd] shadow-xl border-4 border-white transition-all"
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Next Stage Button */}
            <button
              onClick={() => setPhase(3)}
              className="absolute bottom-4 right-12 z-20 bg-[#9575cd] text-white px-8 py-3 rounded-full text-xl font-black shadow-lg hover:bg-[#7e57c2] transition-all border-4 border-white"
            >
              المرحلة الثالثة
            </button>

            {/* Back Button */}
            <button
              onClick={() => setPhase(1)}
              className="absolute top-12 right-12 z-20 bg-white/80 p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#9575cd]"
              title="العودة للمرحلة الأولى"
            >
              <ArrowRight className="w-8 h-8" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-12 left-12 z-20 bg-white/80 p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#9575cd]"
              title="ملء الشاشة"
            >
              {isFullscreen ? <Minimize className="w-8 h-8" /> : <Maximize className="w-8 h-8" />}
            </button>
          </div>
        </div>
    </div>
  </motion.div>
) : phase === 3 && gameStarted && setupComplete && introComplete ? (
  <motion.div
    key="stage3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    className="relative z-10 h-full w-full flex flex-col items-center justify-center p-4"
  >
    <div className="relative w-full h-full max-w-6xl mx-auto flex flex-col items-center justify-center">
      {/* Header */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <div className="bg-[#f48fb1] px-8 py-3 rounded-full border-4 border-[#4db6ac] shadow-2xl">
          <h2 className="text-2xl font-black text-white">المرحلة الثالثة: سباق التخرج</h2>
        </div>
      </div>

      {/* Map Area */}
      <div className="w-full flex flex-col gap-12 mt-20">
        {/* Team X Path */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-[#f48fb1] p-2 rounded-lg text-white font-black">{teamNames.X}</div>
            <div className="h-2 flex-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#f48fb1]"
                initial={{ width: 0 }}
                animate={{ width: `${(stage3Positions.X / 20) * 100}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-12 rounded-xl border-2 flex items-center justify-center transition-all",
                  i === 19 ? "bg-[#fff59d] border-[#fbc02d] shadow-lg" : 
                  (stage3Positions.X > i ? "bg-[#f48fb1] border-white shadow-lg" : "bg-white/20 border-white/40")
                )}
              >
                {stage3Positions.X === i && (
                  <motion.div layoutId="cap-x">
                    <GraduationCap className="w-8 h-8 text-white drop-shadow-md" />
                  </motion.div>
                )}
                {i === 19 && <Trophy className={cn("w-7 h-7", stage3Positions.X === 19 ? "text-[#fbc02d]" : "text-yellow-600")} />}
              </div>
            ))}
          </div>
        </div>

        {/* Team O Path */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-[#4db6ac] p-2 rounded-lg text-white font-black">{teamNames.O}</div>
            <div className="h-2 flex-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#4db6ac]"
                initial={{ width: 0 }}
                animate={{ width: `${(stage3Positions.O / 20) * 100}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-12 rounded-xl border-2 flex items-center justify-center transition-all",
                  i === 19 ? "bg-[#fff59d] border-[#fbc02d] shadow-lg" : 
                  (stage3Positions.O > i ? "bg-[#4db6ac] border-white shadow-lg" : "bg-white/20 border-white/40")
                )}
              >
                {stage3Positions.O === i && (
                  <motion.div layoutId="cap-o">
                    <GraduationCap className="w-8 h-8 text-white drop-shadow-md" />
                  </motion.div>
                )}
                {i === 19 && <Trophy className={cn("w-7 h-7", stage3Positions.O === 19 ? "text-[#fbc02d]" : "text-yellow-600")} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-12">
        <Button 
          onClick={() => {
            const available = stage3Questions.filter(q => {
              const isUsed = usedQuestions.includes(q.id);
              const isCorrectTeam = !q.team || q.team === currentPlayer;
              return !isUsed && isCorrectTeam;
            });
            const q = available.length > 0 ? available[0] : stage3Questions[0];
            setStage3CurrentQuestion(q);
            setShowStage3Question(true);
          }}
          className={cn(
            "text-white text-2xl font-black px-12 py-8 rounded-3xl shadow-2xl border-4 border-white transition-all duration-300",
            currentPlayer === 'X' 
              ? "bg-[#f48fb1] hover:bg-[#f06292]" 
              : "bg-[#4db6ac] hover:bg-[#00897b]"
          )}
        >
          سؤال للفريق ({currentPlayer === 'X' ? teamNames.X : teamNames.O})
        </Button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => setPhase(2)}
        className="absolute top-12 right-12 z-20 bg-white/80 p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#4db6ac]"
      >
        <ArrowRight className="w-8 h-8" />
      </button>

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-12 left-12 z-20 bg-white/80 p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#4db6ac]"
        title="ملء الشاشة"
      >
        {isFullscreen ? <Minimize className="w-8 h-8" /> : <Maximize className="w-8 h-8" />}
      </button>
    </div>

    {/* Stage 3 Question Modal */}
    <Dialog open={showStage3Question} onOpenChange={setShowStage3Question}>
      <DialogContent className={cn(
        "w-[90vw] max-w-md h-auto max-h-[90vh] backdrop-blur-xl border-8 rounded-[3rem] p-6 transition-colors duration-500 flex flex-col",
        currentPlayer === 'X' 
          ? "bg-[#fce4ec]/95 border-[#4db6ac]" 
          : "bg-[#e0f2f1]/95 border-[#f48fb1]"
      )}>
        <DialogHeader className="shrink-0">
          <DialogTitle className={cn(
            "text-2xl font-black text-center mb-2",
            currentPlayer === 'X' ? "text-[#f48fb1]" : "text-[#4db6ac]"
          )}>
            سؤال لـ {currentPlayer === 'X' ? teamNames.X : teamNames.O}
          </DialogTitle>
          
          {/* Elegant Timer Design */}
          <div className="flex justify-center mb-4">
            <div className={cn(
              "relative w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-inner overflow-hidden transition-colors duration-300",
              stage3Timer <= 3 ? "border-red-500 bg-red-50 animate-pulse" : 
              currentPlayer === 'X' ? "border-[#f48fb1] bg-white" : "border-[#4db6ac] bg-white"
            )}>
              <motion.div 
                className={cn(
                  "absolute inset-0 opacity-10",
                  stage3Timer <= 3 ? "bg-red-500" : 
                  currentPlayer === 'X' ? "bg-[#f48fb1]" : "bg-[#4db6ac]"
                )}
                initial={{ height: "100%" }}
                animate={{ height: `${(stage3Timer / 20) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
              <span className={cn(
                "text-2xl font-black z-10",
                stage3Timer <= 3 ? "text-red-600" : 
                currentPlayer === 'X' ? "text-[#f48fb1]" : "text-[#4db6ac]"
              )}>
                {stage3Timer}
              </span>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 flex flex-col min-h-0 space-y-4 overflow-hidden">
          {stage3CurrentQuestion?.imageUrl && (
            <div className="flex-1 flex flex-col justify-center items-center min-h-0 overflow-hidden">
              <img 
                src={stage3CurrentQuestion.imageUrl} 
                alt="Question" 
                onClick={() => setShowImageZoom(true)}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-lg border-4 border-white cursor-zoom-in hover:scale-[1.02] transition-transform"
                referrerPolicy="no-referrer"
              />
              <p className="text-[10px] font-bold text-[#f48fb1] mt-2 animate-pulse">
                ( اضغط على الصورة لتكبيرها )
              </p>
            </div>
          )}
          {!stage3CurrentQuestion?.imageUrl && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xl font-black text-gray-800 text-center leading-relaxed">
                {stage3CurrentQuestion?.text}
              </p>
            </div>
          )}
          
          <div className="shrink-0 pt-2">
            {stage3CurrentQuestion?.isPresenterOnly ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    const newPos = Math.min(19, stage3Positions[currentPlayer] + 1);
                    setStage3Positions(prev => ({
                      ...prev,
                      [currentPlayer]: newPos
                    }));
                    
                    const newStreak = streaks[currentPlayer] + 1;
                    setStreaks(prev => ({ ...prev, [currentPlayer]: newStreak }));

                    if (newPos === 19) {
                      setWinner(currentPlayer);
                    }
                    
                    setUsedQuestions(prev => [...prev, stage3CurrentQuestion.id]);
                    setShowStage3Question(false);

                    if (newStreak === 3) {
                      setShowStreakBonus(true);
                    } else {
                      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
                    }
                  }}
                  className="py-4 px-4 text-lg font-black rounded-2xl bg-[#4db6ac] text-white border-2 border-white shadow-lg hover:bg-[#00897b] transition-all"
                >
                  إجابة صحيحة
                </button>
                <button
                  onClick={() => {
                    setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
                    setShowStage3Question(false);
                    setShowError(true);
                    setTimeout(() => {
                      setShowError(false);
                      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
                    }, 2000);
                  }}
                  className="py-4 px-4 text-lg font-black rounded-2xl bg-[#f48fb1] text-white border-2 border-white shadow-lg hover:bg-[#f06292] transition-all"
                >
                  إجابة خاطئة
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {stage3CurrentQuestion?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (i === stage3CurrentQuestion.correctIndex) {
                        const newPos = Math.min(19, stage3Positions[currentPlayer] + 1);
                        setStage3Positions(prev => ({
                          ...prev,
                          [currentPlayer]: newPos
                        }));
                        
                        const newStreak = streaks[currentPlayer] + 1;
                        setStreaks(prev => ({ ...prev, [currentPlayer]: newStreak }));

                        if (newPos === 19) {
                          setWinner(currentPlayer);
                        }
                        
                        setUsedQuestions(prev => [...prev, stage3CurrentQuestion.id]);
                        setShowStage3Question(false);

                        if (newStreak === 3) {
                          setShowStreakBonus(true);
                        } else {
                          setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
                        }
                      } else {
                        setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
                        setShowStage3Question(false);
                        setShowError(true);
                        setTimeout(() => {
                          setShowError(false);
                          setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
                        }, 2000);
                      }
                    }}
                    className={cn(
                      "py-2 px-4 text-base font-black rounded-xl border-2 border-white shadow-md transition-all",
                      currentPlayer === 'X' 
                        ? "bg-white text-[#f48fb1] hover:bg-[#f48fb1] hover:text-white" 
                        : "bg-white text-[#4db6ac] hover:bg-[#4db6ac] hover:text-white"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {isPresenter && stage3CurrentQuestion?.answerText && (
              <div className="mt-2 p-2 bg-white/20 rounded-xl border border-white/30 text-center">
                <p className="text-sm font-bold text-gray-700">الإجابة: {stage3CurrentQuestion.answerText}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Image Zoom Modal */}
    <Dialog open={showImageZoom} onOpenChange={setShowImageZoom}>
      <DialogContent className="max-w-[100vw] w-[100vw] sm:max-w-[100vw] h-[100vh] p-0 bg-black/40 backdrop-blur-md border-none shadow-none flex items-center justify-center z-[100]">
        {stage3CurrentQuestion?.imageUrl && (
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="relative max-w-full max-h-full">
              <img 
                src={stage3CurrentQuestion.imageUrl} 
                alt="Zoomed Question" 
                className="max-w-full max-h-[85vh] object-contain rounded-3xl border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                referrerPolicy="no-referrer"
                onClick={() => setShowImageZoom(false)}
              />
              
              {/* Timer on Zoomed Image - Floating Side Position - Circular with Gradient */}
              <div className="absolute -left-32 top-1/2 -translate-y-1/2 hidden lg:block">
                <div className={cn(
                  "relative w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-2xl overflow-hidden transition-all duration-300",
                  stage3Timer <= 5 ? "border-red-500 bg-red-50 animate-pulse" : 
                  currentPlayer === 'X' ? "border-[#f48fb1] bg-white text-[#f48fb1]" : "border-[#4db6ac] bg-white text-[#4db6ac]"
                )}>
                  <motion.div 
                    className={cn(
                      "absolute inset-0 opacity-10",
                      stage3Timer <= 5 ? "bg-red-500" : 
                      currentPlayer === 'X' ? "bg-[#f48fb1]" : "bg-[#4db6ac]"
                    )}
                    initial={{ height: "100%" }}
                    animate={{ height: `${(stage3Timer / 20) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                  <span className={cn(
                    "text-4xl font-black z-10",
                    stage3Timer <= 5 ? "text-red-600" : "inherit"
                  )}>
                    {stage3Timer}
                  </span>
                </div>
              </div>

              {/* Mobile Timer View - Pill Shape */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 lg:hidden">
                <div className={cn(
                  "px-6 py-2 rounded-full border-4 shadow-xl flex items-center gap-3 transition-all duration-300 overflow-hidden relative",
                  stage3Timer <= 5 ? "border-red-500 bg-white animate-pulse" : 
                  currentPlayer === 'X' ? "border-[#f48fb1] bg-white text-[#f48fb1]" : "border-[#4db6ac] bg-white text-[#4db6ac]"
                )}>
                  <motion.div 
                    className={cn(
                      "absolute inset-0 opacity-10",
                      stage3Timer <= 5 ? "bg-red-500" : 
                      currentPlayer === 'X' ? "bg-[#f48fb1]" : "bg-[#4db6ac]"
                    )}
                    initial={{ width: "100%" }}
                    animate={{ width: `${(stage3Timer / 20) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                  <span className="font-black text-sm z-10">الوقت:</span>
                  <span className={cn(
                    "text-2xl font-black z-10",
                    stage3Timer <= 5 ? "text-red-600" : "inherit"
                  )}>
                    {stage3Timer}
                  </span>
                </div>
              </div>
            </div>

            <button 
              className="absolute top-12 right-12 bg-white/40 hover:bg-white/60 p-4 rounded-full backdrop-blur-xl transition-all shadow-2xl border-2 border-white/50 group"
              onClick={() => setShowImageZoom(false)}
            >
              <X className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Streak Bonus Modal */}
    <Dialog open={showStreakBonus} onOpenChange={setShowStreakBonus}>
      <DialogContent className="max-w-4xl backdrop-blur-xl border-8 border-[#4db6ac] rounded-[3rem] p-8 bg-[#fce4ec]">
        <DialogHeader>
          <DialogTitle className="text-4xl font-black text-center mb-4 text-[#f48fb1] animate-pulse">
            مكافأة !
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-center" dir="rtl">
          <p className="text-xl font-black text-[#f48fb1] leading-relaxed">
            بما أن الفريق {currentPlayer === 'X' ? teamNames.X : teamNames.O} أجاب عن ٣ أسئلة متتالية بدون خطأ، يحق له اختيار إحدى المكافآت التالية:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                const otherPlayer = currentPlayer === 'X' ? 'O' : 'X';
                const newPos = Math.max(0, stage3Positions[otherPlayer] - 1);
                setStage3Positions(prev => ({ ...prev, [otherPlayer]: newPos }));
                setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
                setShowStreakBonus(false);
                setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
              }}
              className="py-4 px-6 text-lg font-black rounded-2xl bg-[#4db6ac] text-white border-4 border-white shadow-xl hover:scale-105 transition-transform flex flex-col items-center justify-center gap-2"
            >
              <span className="leading-tight">إجبار الفريق {currentPlayer === 'X' ? teamNames.O : teamNames.X} على التراجع خطوة</span>
              <span className="text-2xl">🔙</span>
            </button>
            <button
              onClick={() => {
                const newPos = Math.min(19, stage3Positions[currentPlayer] + 1);
                setStage3Positions(prev => ({ ...prev, [currentPlayer]: newPos }));
                setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
                if (newPos === 19) setWinner(currentPlayer);
                setShowStreakBonus(false);
                setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
              }}
              className="py-4 px-6 text-lg font-black rounded-2xl bg-[#4db6ac] text-white border-4 border-white shadow-xl hover:scale-105 transition-transform flex flex-col items-center justify-center gap-2"
            >
              <span className="leading-tight">التقدم خطوة للأمام بدون الحاجة للإجابة عن سؤال</span>
              <span className="text-2xl">🚀</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </motion.div>
    ) : null}
    </AnimatePresence>
    </div>
  );
}
