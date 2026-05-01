/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Circle, Trophy, RotateCcw, HelpCircle, ArrowRight, ArrowLeft, ChevronRight, Maximize, Minimize, Play, Pause, Volume2, Mic, GraduationCap, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
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

const CLICK_SOUND = "https://dl.dropboxusercontent.com/scl/fi/wz4bav0qfdu0wglyjru32/.mp3?rlkey=gp021yidx9izg72n2kanzudmm&st=amsnyyry&raw=1";
const CORRECT_SOUND = "https://dl.dropboxusercontent.com/scl/fi/toq4aevnvj8nlnuf8708u/.mp3?rlkey=qohyk7hwpk6d0zh6ey7e9q38g&st=wl1et7m4&raw=1";
const WRONG_SOUND = "https://dl.dropboxusercontent.com/scl/fi/3cmgahn2ygs58mupom13d/.mp3?rlkey=7clum2go6bdywpw4x0ngfamkf&st=882asnjk&raw=1";

const clickAudio = new Audio(CLICK_SOUND);
clickAudio.load();

const correctAudio = new Audio(CORRECT_SOUND);
correctAudio.load();

const wrongAudio = new Audio(WRONG_SOUND);
wrongAudio.load();

function SpinningWheel({ onFinish, teamNames, triggerAudio }: { onFinish: (winner: Player) => void, teamNames: { X: string, O: string }, triggerAudio: (url: string) => void }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Player | null>(null);

  const spin = () => {
    if (spinning) return;
    triggerAudio(CLICK_SOUND);
    setSpinning(true);
    const extraDegrees = Math.floor(Math.random() * 360) + 1800; // 5 full spins + random
    const totalRotation = rotation + extraDegrees;
    setRotation(totalRotation);
    
    setTimeout(() => {
      setSpinning(true); // Keep it "spinning" state for visuals during slowdown
      const finalDegree = totalRotation % 360;
      
      // Calculate which segment is at the top (pointer is at 0 degrees)
      // If wheel rotates R degrees clockwise, the pointer is at (360 - R) relative to wheel's start
      const relativeDegree = (360 - finalDegree) % 360;
      
      let winner: Player;
      // Segments based on clip-paths:
      // X (Top): 315 to 45 degrees
      // O (Right): 45 to 135 degrees
      // X (Bottom): 135 to 225 degrees
      // O (Left): 225 to 315 degrees
      if (
        (relativeDegree >= 0 && relativeDegree <= 45) || 
        (relativeDegree > 315 && relativeDegree <= 360) ||
        (relativeDegree > 135 && relativeDegree <= 225)
      ) {
        winner = 'X';
      } else {
        winner = 'O';
      }
      
      setResult(winner);
      setSpinning(false);
      setTimeout(() => onFinish(winner), 2000);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#fce4ec]">
      <div className="relative flex flex-col items-center bg-[#f8bbd0] p-6 md:p-10 rounded-[30px] border-[12px] border-[#a5d6a7] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <h2 className="text-[#880e4f] text-2xl md:text-3xl font-black mb-6 md:mb-8 italic drop-shadow-sm text-center">قرعة تحديد البداية</h2>
        
        <div className="relative w-48 h-48 md:w-[320px] md:h-[320px]">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 w-8 h-12 bg-white rounded-b-full shadow-lg flex items-center justify-center border-2 border-[#a5d6a7]">
            <div className="w-1.5 h-6 bg-red-500 rounded-full" />
          </div>
          
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: [0.15, 0, 0.15, 1] }}
            className="w-full h-full rounded-full border-4 md:border-8 border-white shadow-xl relative overflow-hidden"
          >
            {/* Team X - Blue/Green */}
            <div className="absolute inset-0 bg-[#4db6ac]" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }} />
            <div className="absolute inset-0 bg-[#4db6ac]" style={{ clipPath: 'polygon(50% 50%, 0 100%, 100% 100%)' }} />
            
            {/* Team O - Pink */}
            <div className="absolute inset-0 bg-[#f48fb1]" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }} />
            <div className="absolute inset-0 bg-[#f48fb1]" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 100%)' }} />

            {/* Labels in wheel */}
            <div className="absolute top-[22%] left-1/2 -translate-x-1/2 text-white font-bold text-sm md:text-lg rotate-0 drop-shadow-md whitespace-nowrap">{teamNames.X}</div>
            <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 text-white font-bold text-sm md:text-lg rotate-180 drop-shadow-md whitespace-nowrap">{teamNames.X}</div>
            <div className="absolute top-1/2 right-[22%] translate-y-[-50%] text-white font-bold text-sm md:text-lg rotate-90 drop-shadow-md whitespace-nowrap">{teamNames.O}</div>
            <div className="absolute top-1/2 left-[22%] translate-y-[-50%] text-white font-bold text-sm md:text-lg -rotate-90 drop-shadow-md whitespace-nowrap">{teamNames.O}</div>
            
            {/* Center point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-10 md:h-10 bg-white rounded-full shadow-inner z-20" />
          </motion.div>
        </div>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={spin}
          disabled={spinning || result !== null}
          className={cn(
            "mt-8 md:mt-12 text-white px-10 py-3 rounded-full text-xl md:text-2xl font-black shadow-xl transition-all border-4 border-white disabled:opacity-70",
            result ? (result === 'X' ? 'bg-[#4db6ac]' : 'bg-[#f48fb1]') : 'bg-gradient-to-r from-[#4db6ac] to-[#f48fb1]'
          )}
        >
          {spinning ? 'جاري الدوران...' : result ? `البداية مع: ${teamNames[result]}` : 'لف العجلة'}
        </motion.button>
      </div>
    </div>
  );
}

const BACKGROUNDS = {
  WIDE: {
    start: "https://www.dropbox.com/scl/fi/g5i22vcxp6ymsykhzw4ff/Photo-11-04-2026-7-54-55-AM.jpg?rlkey=sg4bsp8r42kj58qmdbsbzkxfn&st=803zg5qm&raw=1",
    intro: "https://www.dropbox.com/scl/fi/7uciimcp5ppj3d3hqni95/Photo-12-04-2026-11-25-57-PM.jpg?rlkey=bw14grx4tpxq8xegf1rpjnyso&st=fqe89yho&raw=1",
    game: "https://www.dropbox.com/scl/fi/vzl9tjyod1xe2ycx50xb8/Photo-12-04-2026-1-28-54-PM.jpg?rlkey=eup7txw2qg9omzsminzgbvhsv&st=2k8t0k7z&raw=1",
    stage2: "https://www.dropbox.com/scl/fi/0wbcurmx8uw6fb9gml86n/Photo-13-04-2026-5-17-42-AM.jpg?rlkey=8wgtbf2cx8w2ecu31ayr49amr&st=qaqparq7&raw=1",
    stage2Intro: "https://www.dropbox.com/scl/fi/s4e53lifdlnhlr68k6ty4/Photo-27-04-2026-12-58-25-PM-1.png?rlkey=zhaq46c87n286sarb5txrdbq7&st=lh9swevu&raw=1",
    stage3: "https://www.dropbox.com/scl/fi/p1zouzii3g8mklhkppoia/Photo-14-04-2026-4-08-42-AM.jpg?rlkey=d8zlfpcfh30oz5goojejt1owj&st=90tgsqog&raw=1",
    stage3Intro: "https://dl.dropboxusercontent.com/scl/fi/9yz53ntrv0962iziw997b/Photo-01-05-2026-3-39-05-PM.jpg?rlkey=jdidm11tj8wqvwcxgdsyka83o&st=m923uc09&raw=1",
    victory: "https://www.dropbox.com/scl/fi/qhvunsimuuxgods1nivlj/Photo-27-04-2026-12-58-25-PM-2.png?rlkey=rar0qkko9gexkk8x6g0u86mtw&st=h65qog0o&raw=1"
  },
  MOBILE: {
    start: "https://www.dropbox.com/scl/fi/mvp9rwsqoopwoh1k4xk02/Photo-27-04-2026-5-58-14-PM.jpg?rlkey=d6emzuspr0knpyxkkt0oe6xxu&st=olvq6hpk&raw=1",
    intro: "https://www.dropbox.com/scl/fi/1oldkjyo3oryttyj33z8c/Photo-30-04-2026-12-38-56-PM-1.jpg?rlkey=lps6swf1fzg0kcfrnofk1cofu&st=qqj18oco&raw=1",
    game: "https://www.dropbox.com/scl/fi/vzl9tjyod1xe2ycx50xb8/Photo-12-04-2026-1-28-54-PM.jpg?rlkey=eup7txw2qg9omzsminzgbvhsv&st=2k8t0k7z&raw=1",
    stage2: "https://www.dropbox.com/scl/fi/0wbcurmx8uw6fb9gml86n/Photo-13-04-2026-5-17-42-AM.jpg?rlkey=8wgtbf2cx8w2ecu31ayr49amr&st=qaqparq7&raw=1",
    stage2Intro: "https://www.dropbox.com/scl/fi/0by5vbcgwvmszrgg10dkq/Photo-30-04-2026-12-38-56-PM-2.jpg?rlkey=ttna45yylkib07w4t83izem2k&st=4narndax&raw=1",
    stage3: "https://www.dropbox.com/scl/fi/p1zouzii3g8mklhkppoia/Photo-14-04-2026-4-08-42-AM.jpg?rlkey=d8zlfpcfh30oz5goojejt1owj&st=90tgsqog&raw=1",
    stage3Intro: "https://dl.dropboxusercontent.com/scl/fi/0oozhroofg13owhlrap1a/.jpeg?rlkey=kqf66d1pk8l4lfjp8fwibmd0h&st=2cz5sbyc&raw=1",
    victory: "https://www.dropbox.com/scl/fi/px0qv8sbj4fs105bhrkxb/Photo-30-04-2026-12-38-56-PM-3.jpg?rlkey=w1udmsd56khgpt1hrix1g0u5b&st=w76t6lq6&raw=1"
  }
};

export default function App() {
  const [gameStarted, setGameStarted] = useState(() => {
    const saved = localStorage.getItem('gameStarted');
    return saved ? JSON.parse(saved) : false;
  });
  const [setupComplete, setSetupComplete] = useState(() => {
    const saved = localStorage.getItem('setupComplete');
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
  const [correctFeedback, setCorrectFeedback] = useState(false);
  const [wrongFeedback, setWrongFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [showStage3Answer, setShowStage3Answer] = useState(false);
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
  const [stage2QuestionOrder, setStage2QuestionOrder] = useState<number[]>(() => {
    const saved = localStorage.getItem('stage2QuestionOrder');
    return saved ? JSON.parse(saved) : Array.from({ length: stage2Questions.length }, (_, i) => i);
  });
  const [stage2ShowOptions, setStage2ShowOptions] = useState(false);
  const [stage2Score, setStage2Score] = useState<{ X: number; O: number }>(() => {
    const saved = localStorage.getItem('stage2Score');
    return saved ? JSON.parse(saved) : { X: 0, O: 0 };
  });
  const [stage2Feedback, setStage2Feedback] = useState<{ index: number; isCorrect: boolean } | null>(null);
  const [stage2IntroActive, setStage2IntroActive] = useState(() => {
    const saved = localStorage.getItem('stage2IntroActive');
    return saved ? JSON.parse(saved) : false;
  });
  const [stage3IntroActive, setStage3IntroActive] = useState(() => {
    const saved = localStorage.getItem('stage3IntroActive');
    return saved ? JSON.parse(saved) : false;
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
  const [stageWinners, setStageWinners] = useState<{ 1: Player | null; 2: Player | null; 3: Player | null }>(() => {
    const saved = localStorage.getItem('stageWinners');
    return saved ? JSON.parse(saved) : { 1: null, 2: null, 3: null };
  });
  const [showStageVictory, setShowStageVictory] = useState<{ phase: number; winner: Player | 'Draw' } | null>(null);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [starterDetermined, setStarterDetermined] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [introComplete, setIntroComplete] = useState<boolean>(() => {
    const saved = localStorage.getItem('introComplete');
    return saved ? JSON.parse(saved) : false;
  });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stage3Timer, setStage3Timer] = useState(40);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isZoomTransitionPaused, setIsZoomTransitionPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const syncChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    syncChannelRef.current = new BroadcastChannel('game_sync');
    return () => {
      syncChannelRef.current?.close();
    };
  }, []);

  const getBg = useCallback((key: keyof typeof BACKGROUNDS.WIDE) => {
    return isMobile ? BACKGROUNDS.MOBILE[key] : BACKGROUNDS.WIDE[key];
  }, [isMobile]);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Non-blocking preloading
  useEffect(() => {
    const stage3Urls = stage3Questions.map(q => q.imageUrl).filter((url): url is string => !!url);
    const backgroundUrls = [
      ...Object.values(BACKGROUNDS.WIDE),
      ...Object.values(BACKGROUNDS.MOBILE)
    ];
    const imageUrls = [...backgroundUrls, ...stage3Urls];

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

  // Debounced state saving to improve performance
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('gameStarted', JSON.stringify(gameStarted));
      localStorage.setItem('setupComplete', JSON.stringify(setupComplete));
      localStorage.setItem('teamNames', JSON.stringify(teamNames));
      localStorage.setItem('board', JSON.stringify(board));
      localStorage.setItem('currentPlayer', currentPlayer);
      localStorage.setItem('winner', JSON.stringify(winner));
      localStorage.setItem('usedQuestions', JSON.stringify(usedQuestions));
      localStorage.setItem('phase', JSON.stringify(phase));
      localStorage.setItem('round', JSON.stringify(round));
      localStorage.setItem('roundWins', JSON.stringify(roundWins));
      localStorage.setItem('stage2Score', JSON.stringify(stage2Score));
      localStorage.setItem('stage2QuestionOrder', JSON.stringify(stage2QuestionOrder));
      localStorage.setItem('stage3Positions', JSON.stringify(stage3Positions));
      localStorage.setItem('introComplete', JSON.stringify(introComplete));
      localStorage.setItem('stage2IntroActive', JSON.stringify(stage2IntroActive));
      localStorage.setItem('stage3IntroActive', JSON.stringify(stage3IntroActive));
      localStorage.setItem('stageWinners', JSON.stringify(stageWinners));
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [gameStarted, setupComplete, introComplete, teamNames, board, currentPlayer, winner, usedQuestions, phase, round, roundWins, stage2Score, stage2QuestionOrder, stage3Positions, stage2IntroActive, stage3IntroActive, stageWinners]);

  // Shuffle stage 2 questions when entering phase 2
  useEffect(() => {
    if (phase === 2) {
      setStage2QuestionOrder(prev => {
        const shuffled = [...prev].sort(() => Math.random() - 0.5);
        return shuffled;
      });
      // Initial sound for stage 2
      triggerAudio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
    }
  }, [phase]);


  const audioRef = useRef<HTMLVideoElement | null>(null);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && stage3Timer > 0 && !isZoomTransitionPaused && !correctFeedback && !wrongFeedback) {
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
    } else if (stage3Timer <= 0 && isTimerActive) {
      // Just stop timer, don't close modal or auto-fail immediately
      setIsTimerActive(false);
      triggerAudio(WRONG_SOUND);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, stage3Timer, currentPlayer, isZoomTransitionPaused, correctFeedback, wrongFeedback]);

    // Reset timer when question opens/closes
    useEffect(() => {
      if (showStage3Question) {
        setStage3Timer(40);
        setShowStage3Answer(false);
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
    if (!url) return;

    // Always stop text-based question audio when playing a feedback or UI sound
    if (audioRef.current && (url === CLICK_SOUND || url === CORRECT_SOUND || url === WRONG_SOUND)) {
      audioRef.current.pause();
    }

    if (url === CLICK_SOUND) {
      clickAudio.currentTime = 0;
      clickAudio.play().catch(() => {});
      return;
    }

    if (url === CORRECT_SOUND) {
      correctAudio.currentTime = 0;
      correctAudio.play().catch(() => {});
      return;
    }

    if (url === WRONG_SOUND) {
      wrongAudio.currentTime = 0;
      wrongAudio.play().catch(() => {});
      return;
    }

    if (!audioRef.current) return;
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
  const triggerAudio = useCallback((url: string) => {
    // 1. Play locally
    handlePlayAudio(url);
    
    // 2. Broadcast to other tabs
    if (syncChannelRef.current) {
      syncChannelRef.current.postMessage({ type: 'PLAY_AUDIO', url });
    }
  }, [handlePlayAudio]);

  // Sync state between tabs
  useEffect(() => {
    const channel = new BroadcastChannel('game_sync');
    
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
          wrongFeedback,
          teamNames,
          gameStarted,
          setupComplete,
          introComplete,
          usedQuestions,
          phase,
          round,
          roundWins,
          stage2Score,
          stage2Index,
          stage2QuestionOrder,
          stage2ShowOptions,
          stage2Feedback,
          stage3Positions,
          stage2IntroActive,
          stage3IntroActive
        }
      });
    };

    broadcastState();

    channel.onmessage = (event) => {
      if (event.data.type === 'REQUEST_STATE') {
        broadcastState();
      }
      if (event.data.type === 'STATE_UPDATE') {
        const state = event.data.payload;
        setBoard(state.board);
        setCurrentPlayer(state.currentPlayer);
        setWinner(state.winner);
        setSelectedCell(state.selectedCell);
        setCurrentQuestion(state.currentQuestion);
        setShowQuestion(state.showQuestion);
        setWrongFeedback(state.wrongFeedback);
        setTeamNames(state.teamNames);
        setGameStarted(state.gameStarted);
        setSetupComplete(state.setupComplete);
        setIntroComplete(state.introComplete);
        setUsedQuestions(state.usedQuestions);
        setPhase(state.phase);
        setRound(state.round);
        setRoundWins(state.roundWins);
        setStage2Score(state.stage2Score);
        setStage2Index(state.stage2Index);
        setStage2QuestionOrder(state.stage2QuestionOrder);
        setStage2ShowOptions(state.stage2ShowOptions);
        setStage2Feedback(state.stage2Feedback);
        setStage3Positions(state.stage3Positions);
        setStage2IntroActive(state.stage2IntroActive);
        setStage3IntroActive(state.stage3IntroActive);
      }
      if (event.data.type === 'PLAY_AUDIO') {
        handlePlayAudio(event.data.url);
      }
    };

    return () => {
      channel.close();
    };
  }, [
    board, currentPlayer, winner, selectedCell, 
    currentQuestion, showQuestion, wrongFeedback, teamNames, 
    gameStarted, setupComplete, introComplete, usedQuestions, phase, round, roundWins,
    stage2Score, stage2Index, stage2QuestionOrder, stage2ShowOptions, stage2Feedback, stage3Positions,
    stage2IntroActive, stage3IntroActive, handlePlayAudio
  ]);

  // Handle Confetti on Winner
  useEffect(() => {
    if (winner && winner !== 'Draw' && (phase === 3 || (phase === 2 && stage2Index >= stage2Questions.length - 1))) {
      const colors = ['#f48fb1', '#4db6ac', '#81c784', '#ce93d8', '#ffcc80'];
      const end = Date.now() + 3 * 1000;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [winner, phase, stage2Index]);

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

    triggerAudio(CLICK_SOUND);
    setSelectedCell(index);
    
    // Pick a random question that hasn't been used
    const availableQuestions = questions.filter(q => !usedQuestions.includes(q.id));
    const randomQuestion = availableQuestions.length > 0 
      ? availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
      : null;

    if (!randomQuestion) {
      alert("تم استهلاك جميع الأسئلة المتاحة في هذه المرحلة!");
      return;
    }

    setCurrentQuestion(randomQuestion);
    setUsedQuestions(prev => [...prev, randomQuestion.id]);
    setShowQuestion(true);
  };

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion || selectedCell === null) return;

    if (answerIndex === currentQuestion.correctIndex) {
      // Correct answer
      setCorrectAnswerIndex(answerIndex);
      setSelectedOption(answerIndex);
      triggerAudio(CORRECT_SOUND);
      setCorrectFeedback(true);

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f48fb1', '#4db6ac', '#ffffff']
      });

      const newBoard = [...board];
      newBoard[selectedCell] = currentPlayer;
      setBoard(newBoard);
      
      const gameWinner = checkWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        if (gameWinner !== 'Draw') {
          setRoundWins(prev => ({
            ...prev,
            [gameWinner as Player]: prev[gameWinner as Player] + 1
          }));
        }
      }
    } else {
      // Incorrect answer
      setSelectedOption(answerIndex);
      setCorrectAnswerIndex(currentQuestion.correctIndex);
      triggerAudio(WRONG_SOUND);
      setWrongFeedback(true);
    }
  };

  const closeQuestionModal = () => {
    const isCorrect = correctFeedback;
    setShowQuestion(false);
    setCorrectFeedback(false);
    setWrongFeedback(false);
    setCorrectAnswerIndex(null);
    setSelectedOption(null);
    
    if (isCorrect) {
      // Logic after user closes the "Correct" modal
      const gameWinner = checkWinner(board);
      if (!gameWinner) {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    } else {
      // Logic after user closes the "Wrong" modal
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    if (winner) {
      if (round >= 3 && roundWins.X !== roundWins.O) {
        const finalWinner = roundWins.X > roundWins.O ? 'X' : 'O';
        setStageWinners(prev => ({ ...prev, 1: finalWinner }));
        setPhase(2);
        setStage2IntroActive(true);
        setRound(1);
        setRoundWins({ X: 0, O: 0 });
        setUsedQuestions([]);
        setBoard(Array(9).fill(null));
        setWinner(null);
        setSelectedCell(null);
      } else {
        // Continuous rounds until tie is broken
        setRound(prev => prev + 1);
        setBoard(Array(9).fill(null));
        setWinner(null);
        setSelectedCell(null);
        if (phase === 1) setShowSpinWheel(true);
      }
    }
  };

  const handleStage2Answer = (answerIndex: number) => {
    if (stage2Feedback) return;

    const actualQuestionIndex = stage2QuestionOrder[stage2Index];
    const isCorrect = answerIndex === stage2Questions[actualQuestionIndex].correctIndex;
    setStage2Feedback({ index: answerIndex, isCorrect });

    // Play feedback sound
    if (isCorrect) {
      triggerAudio(CORRECT_SOUND);
    } else {
      triggerAudio(WRONG_SOUND);
    }
  };

  const handleNextStage2Question = () => {
    setStage2Feedback(null);
    setStage2ShowOptions(false);
    
    // Specifically stop audio when moving to the next question
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (stage2Index < stage2Questions.length - 1) {
      setStage2Index(prev => prev + 1);
      // Play a transition sound
      triggerAudio(CLICK_SOUND);
    } else {
      // End of stage 2 - Determine winner
      const s2Winner = stage2Score.X > stage2Score.O ? 'X' : stage2Score.O > stage2Score.X ? 'O' : 'Draw';
      if (s2Winner !== 'Draw') {
        setStageWinners(prev => ({ ...prev, 2: s2Winner }));
      }
      setShowStageVictory({ phase: 2, winner: s2Winner });
      triggerAudio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
    }
  };

  const handleBack = () => {
    triggerAudio(CLICK_SOUND);
    
    if (showSpinWheel) {
      setShowSpinWheel(false);
      return;
    }
    
    if (showFinalResults) {
      setShowFinalResults(false);
      return;
    }
    
    if (showStageVictory) {
      setShowStageVictory(null);
      return;
    }

    if (phase === 3) {
      if (stage3IntroActive) {
        setPhase(2);
        setStage2IntroActive(false);
        setStage3IntroActive(false);
      } else {
        setStage3IntroActive(true);
      }
    } else if (phase === 2) {
      if (stage2IntroActive) {
        setPhase(1);
        setStage2IntroActive(false);
      } else {
        setStage2IntroActive(true);
      }
    } else if (phase === 1) {
      if (introComplete) {
        setIntroComplete(false);
      } else if (setupComplete) {
        setSetupComplete(false);
      } else {
        setGameStarted(false);
      }
    }
  };

  const updateStage2Score = (team: Player, delta: number) => {
    setStage2Score(prev => ({
      ...prev,
      [team]: Math.max(0, prev[team] + delta)
    }));
    triggerAudio("https://www.soundjay.com/buttons/sounds/button-20.mp3");
  };

  if (!imagesLoaded) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#f48fb1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden" dir="rtl">
      {/* Back Button */}
      {(gameStarted || setupComplete) && !showFinalResults && !showImageZoom && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="fixed top-4 right-4 z-[1100] bg-white/30 hover:bg-[#f48fb1] p-2 md:p-3 rounded-full border-4 border-white text-white backdrop-blur-sm transition-all shadow-2xl flex items-center justify-center group cursor-pointer w-10 h-10 md:w-16 md:h-16"
        >
          <ChevronRight className="w-6 h-6 md:w-10 md:h-10 group-hover:translate-x-1" />
        </motion.button>
      )}

      {/* Spinning Wheel */}
      <AnimatePresence>
        {showSpinWheel && (
          <SpinningWheel 
            teamNames={teamNames}
            triggerAudio={triggerAudio}
            onFinish={(starter) => {
              setCurrentPlayer(starter);
              setShowSpinWheel(false);
              setIntroComplete(true);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Persistent Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Start & Setup Background */}
        <motion.img 
          src={getBg('start')}
          alt="Background Start"
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: !gameStarted || !setupComplete ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          referrerPolicy="no-referrer"
        />
        {/* Intro Background */}
        <motion.img 
          src={getBg('intro')}
          alt="Background Intro"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: gameStarted && setupComplete && !introComplete ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          referrerPolicy="no-referrer"
        />
        {/* Game Background */}
        <motion.img 
          src={getBg('game')}
          alt="Background Game"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: gameStarted && setupComplete && introComplete && phase === 1 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          referrerPolicy="no-referrer"
        />
        {/* Stage 2 Background - Pastel Stage */}
        <motion.img
          src={getBg('stage2')}
          alt="Background Stage 2"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: gameStarted && setupComplete && introComplete && phase === 2 && !stage2IntroActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          referrerPolicy="no-referrer"
        />
        {/* Stage 3 Background - Map/Path */}
        <motion.img
          src={getBg('stage3')}
          alt="Background Stage 3"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: gameStarted && setupComplete && introComplete && phase === 3 && !stage3IntroActive && !showFinalResults ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          referrerPolicy="no-referrer"
        />
        {/* Stage 2 Intro Background */}
        <motion.img
          src={getBg('stage2Intro')}
          alt="Background Stage 2 Intro"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 2 && stage2IntroActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          referrerPolicy="no-referrer"
        />
        {/* Stage 3 Intro Background */}
        <motion.img
          src={getBg('stage3Intro')}
          alt="Background Stage 3 Intro"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 3 && stage3IntroActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          referrerPolicy="no-referrer"
        />
        {/* Victory Background */}
        <motion.img 
          src={getBg('victory')}
          alt="Final Background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: showFinalResults ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          referrerPolicy="no-referrer"
        />
        <motion.img
          src={getBg('victory')}
          alt="Background Victory"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: (!!winner && (phase === 3 || (phase === 2 && winner !== 'Draw' && stage2Index >= stage2Questions.length - 1))) && !showFinalResults ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Stage Victory Overlay */}
      <AnimatePresence>
        {showStageVictory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white/95 p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-8 border-[#f48fb1] flex flex-col items-center gap-6 max-w-xl w-full text-center"
            >
              <div className="w-24 h-24 bg-[#fce4ec] rounded-full flex items-center justify-center mb-2 shadow-inner">
                <Trophy className="w-12 h-12 text-[#f48fb1]" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-[#9575cd]">
                {showStageVictory.winner === 'Draw' 
                  ? "تعادل في هذه المرحلة!" 
                  : `فوز ${showStageVictory.winner === 'X' ? teamNames.X : teamNames.O}!`}
              </h2>
              
              <p className="text-xl font-bold text-[#f06292]">
                {showStageVictory.phase === 2 ? "بطل المرحلة الثانية (السمعية)" : "بطل المرحلة الثالثة (السباق)"}
              </p>

              <div className="flex flex-col gap-4 w-full mt-4">
                {showStageVictory.phase === 2 ? (
                  <button
                    onClick={() => {
                      triggerAudio(CLICK_SOUND);
                      setShowStageVictory(null);
                      setWinner(null);
                      setPhase(3);
                      setStage3IntroActive(true);
                    }}
                    className="bg-[#9575cd] text-white py-4 rounded-2xl text-2xl font-black shadow-lg hover:bg-[#7e57c2] transition-all"
                  >
                    انتقل للمرحلة الثالثة
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      triggerAudio(CLICK_SOUND);
                      setShowStageVictory(null);
                      setShowFinalResults(true);
                      triggerAudio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
                    }}
                    className="bg-[#f06292] text-white py-4 rounded-2xl text-2xl font-black shadow-lg hover:bg-[#e91e63] transition-all flex items-center justify-center gap-3"
                  >
                    <Trophy className="w-6 h-6" />
                    النتيجة النهائية
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Game Results Overlay */}
      <AnimatePresence>
        {showFinalResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/10 px-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: -20 }}
              animate={{ scale: 1, y: -80 }}
              className="bg-gradient-to-br from-[#fce4ec] to-[#e0f2f1] p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(77,182,172,0.3)] border-8 border-white flex flex-col items-center gap-6 max-w-3xl w-full text-center relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f48fb1]/30 rounded-full blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#4db6ac]/30 rounded-full blur-xl" />
              
              <div className="flex items-center gap-6 relative z-10 w-full justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#4db6ac]"
                >
                  <Trophy className="w-10 h-10 text-[#4db6ac]" />
                </motion.div>

                <div className="space-y-1 text-right">
                  <h1 className="text-3xl md:text-5xl font-black text-[#4db6ac] drop-shadow-sm">
                    بطل اللعبة النهائي
                  </h1>
                  <div className="py-3 px-8 bg-white rounded-2xl shadow-inner border-2 border-[#f48fb1]/20 inline-block">
                    <span className="text-2xl md:text-4xl font-black text-[#f48fb1]">
                      {(() => {
                        const counts = { X: 0, O: 0 };
                        if (stageWinners[1]) counts[stageWinners[1]]++;
                        if (stageWinners[2]) counts[stageWinners[2]]++;
                        if (stageWinners[3]) counts[stageWinners[3]]++;
                        return counts.X >= 2 ? teamNames.X : teamNames.O;
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 w-full justify-center mt-2">
                <p className="text-lg font-bold text-[#4db6ac] bg-white/70 px-6 py-2 rounded-full border-2 border-white/50 shadow-sm">
                  لقد فاز فريقكم بمرحلتين من أصل ثلاث مراحل 🎉
                </p>

                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="bg-[#4db6ac] text-white px-8 py-3 rounded-full text-xl font-black shadow-lg hover:bg-[#00897b] transition-all border-4 border-white flex items-center gap-2 whitespace-nowrap"
                >
                  <RotateCcw className="w-6 h-6" />
                  لعبة جديدة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className={cn(
                "relative z-10 flex flex-col items-center h-full",
                isMobile ? "justify-center" : "justify-end pb-[15%]"
              )}>
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      triggerAudio(CLICK_SOUND);
                      // Reset game state for a fresh start
                      setWinner(null);
                      setRoundWins({ X: 0, O: 0 });
                      setRound(1);
                      setBoard(Array(9).fill(null));
                      setUsedQuestions([]);
                      setStage2Score({ X: 0, O: 0 });
                      setStage3Positions({ X: 0, O: 0 });
                      setPhase(1);
                      
                      // Unlock audio context for Safari by playing a silent sound
                      const silent = audioRef.current;
                      if (silent) {
                        silent.volume = 0;
                        silent.play().catch(() => {});
                      }
                      setGameStarted(true);
                    }}
                    className={cn(
                      "bg-[#f48fb1] text-white px-5 py-2 rounded-full text-base font-black shadow-[0_4px_0_rgb(194,24,91)] transition-all flex items-center justify-center min-w-[140px]",
                      isMobile && "translate-y-[28mm]"
                    )}
                  >
                    <Play className="w-3.5 h-3.5 ml-2" />
                    ابدأ اللعب
                  </motion.button>
              </div>

              <button
                onClick={() => {
                  triggerAudio(CLICK_SOUND);
                  toggleFullscreen();
                }}
                className="absolute bottom-4 left-4 md:bottom-12 md:left-12 z-20 bg-white/80 p-2.5 md:p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#2e7d32]"
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
                  className="bg-[#c8e6c9]/95 p-8 rounded-[3rem] shadow-2xl w-full space-y-6 border-2 border-white/50"
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
                      onClick={() => { 
                        triggerAudio(CLICK_SOUND);
                        setSetupComplete(true); 
                      }}
                      className="bg-[#f48fb1] text-white py-4 rounded-2xl text-2xl font-bold shadow-lg hover:bg-[#f06292] transition-all"
                    >
                      دخول اللعبة
                    </button>
                  </div>
                </motion.div>
              </div>

              <button
                onClick={() => setGameStarted(false)}
                className="hidden"
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
                  onClick={() => {
                    triggerAudio(CLICK_SOUND);
                    setShowSpinWheel(true);
                  }}
                  className={cn(
                    "absolute left-[50%] translate-x-[-50%] bg-[#f48fb1] text-white px-8 py-3 rounded-full text-xl font-black shadow-[0_4px_0_rgb(194,24,91)] transition-all flex items-center justify-center min-w-[200px]",
                    isMobile ? "bottom-[11.5%]" : "bottom-[22%]"
                  )}
                >
                  <Play className="w-6 h-6 ml-2" />
                  ابدأ
                </motion.button>
              </div>

              <button
                onClick={() => { setSetupComplete(false); setIntroComplete(false); }}
                className="hidden"
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
          <button
            onClick={() => {
              setIntroComplete(false);
            }}
            className="hidden"
          >
            <ArrowRight className="w-8 h-8" />
          </button>
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
            className="grid grid-cols-3 gap-3 bg-white/30 p-3 rounded-[2rem] shadow-2xl border border-white/50"
          >
            {board.map((cell, i) => (
              <motion.button
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + (i * 0.05), type: "spring" }}
                whileHover={{ scale: cell ? 1 : 1.05 }}
                whileTap={{ scale: cell ? 1 : 0.95 }}
                onClick={() => handleCellClick(i)}
                disabled={!!cell || !!winner || wrongFeedback}
                className={cn(
                  "w-20 h-20 md:w-28 md:h-28 rounded-[1.2rem] flex items-center justify-center text-3xl md:text-5xl transition-colors duration-300",
                  cell ? "bg-white shadow-inner" : "bg-white/80 hover:bg-white shadow-lg",
                  !cell && !winner && "hover:shadow-2xl cursor-pointer"
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            triggerAudio(CLICK_SOUND);
            resetGame();
          }}
          className={cn(
            "mt-4 flex items-center gap-2 bg-[#4db6ac] text-white px-6 py-2 rounded-full font-bold shadow-xl transition-colors text-base hover:bg-[#00897b] cursor-pointer"
          )}
        >
          <RotateCcw className="w-5 h-5" />
          إعادة اللعب
        </motion.button>

        {/* Question Dialog */}
        <Dialog open={showQuestion} onOpenChange={(open) => {
          if (!open) {
            setShowQuestion(false);
            setSelectedOption(null);
            setCorrectAnswerIndex(null);
            setCorrectFeedback(false);
            setWrongFeedback(false);
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
          } else {
            setShowQuestion(true);
          }
        }}>
          <DialogContent className={cn(
            "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] border-none rounded-[2rem] p-8 max-w-[90vw] md:max-w-md shadow-2xl z-[150] outline-none",
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
                  <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/10 border border-white/20">
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
                        disabled={selectedOption !== null}
                        whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                        whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(idx)}
                        className={cn(
                          "w-full py-4 px-6 rounded-2xl border-2 text-right text-lg font-bold transition-all duration-300",
                          selectedOption === null
                            ? (currentPlayer === 'X' ? "bg-white/10 border-white/20" : "bg-black/5 border-[#4db6ac]/20")
                            : idx === currentQuestion.correctIndex
                              ? "bg-[#a5d6a7] text-white border-green-200 shadow-[0_0_15px_rgba(165,214,167,0.5)] scale-105 z-10"
                              : idx === selectedOption
                                ? "bg-[#ef9a9a] text-white border-red-200"
                                : "opacity-30 grayscale-[50%] scale-95"
                        )}
                      >
                        {option}
                      </motion.button>
                    ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Feedback Overlay for Correct/Wrong - MANUAL CLOSE ONLY */}
        <AnimatePresence>
          {(correctFeedback || wrongFeedback) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className={cn(
                  "bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border-8 flex flex-col items-center gap-6 max-w-sm w-full text-center relative",
                  correctFeedback ? "border-green-500" : "border-red-500"
                )}
              >
                <button 
                  onClick={() => {
                    if (phase === 1) {
                      closeQuestionModal();
                    } else if (phase === 3) {
                      const isCorrect = correctFeedback;
                      setCorrectFeedback(false);
                      setWrongFeedback(false);
                      setShowStage3Question(false);
                      
                      if (isCorrect) {
                        const newStreak = streaks[currentPlayer];
                        if (newStreak === 3) {
                          setShowStreakBonus(true);
                        } else {
                          setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
                        }
                      } else {
                        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
                      }
                    }
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md"
                >
                  <X className="w-8 h-8 text-gray-800" />
                </button>

                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center text-white text-5xl shadow-inner",
                  correctFeedback ? "bg-green-500" : "bg-red-500"
                )}>
                  {correctFeedback ? <Check className="w-14 h-14" /> : <X className="w-14 h-14" />}
                </div>

                <h3 className={cn(
                  "text-4xl font-black",
                  correctFeedback ? "text-green-600" : "text-red-600"
                )}>
                  {correctFeedback ? "إجابة صحيحة!" : "للأسف، إجابة خاطئة"}
                </h3>
                
                <p className="text-gray-500 font-bold">
                  اضغط على زر (X) للإغلاق والمتابعة
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: -50 }}
                className={cn(
                  "p-8 rounded-[2rem] text-center shadow-2xl max-w-sm w-full border-4 border-white",
                  winner === 'X' ? "bg-[#f48fb1]/90 text-white" : 
                  winner === 'O' ? "bg-[#c8e6c9]/90 text-[#2e7d32]" : 
                  "bg-white/90 text-gray-800"
                )}
              >
                <h2 className="text-3xl font-black mb-8">
                  {phase === 3 ? (
                    `الفريق الفائز: ${winner === 'X' ? teamNames.X : teamNames.O}`
                  ) : (
                    winner === 'Draw' ? 'تعادل!' : `فاز ${winner === 'X' ? teamNames.X : teamNames.O}!`
                  )}
                </h2>
                <Button 
                  onClick={() => {
                    if (phase === 1) {
                      if (winner !== 'Draw' && roundWins[winner as Player] >= 2) {
                        setPhase(2);
                        setStage2IntroActive(true);
                      }
                      resetGame();
                    } else if (phase === 2) {
                      setPhase(3);
                      setStage3IntroActive(true);
                      setWinner(null);
                    } else {
                      // Final win, reset
                      setWinner(null);
                      setPhase(1);
                      setGameStarted(false);
                      setSetupComplete(false);
                      setIntroComplete(false);
                    }
                  }}
                  className={cn(
                    "w-full py-4 text-lg rounded-xl transition-all font-black shadow-lg",
                    winner === 'X' ? "bg-white text-[#f48fb1] hover:bg-white/90" : 
                    winner === 'O' ? "bg-[#4db6ac] text-white hover:bg-[#00897b]" : 
                    "bg-[#4db6ac] text-white"
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



        {/* Next Stage Button */}
        <button
          onClick={() => {
            triggerAudio(CLICK_SOUND);
            setPhase(2);
            setStage2IntroActive(true);
          }}
          className="absolute bottom-4 right-4 md:bottom-4 md:right-12 z-20 bg-[#4db6ac] text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-lg md:text-xl font-black shadow-lg hover:bg-[#00897b] transition-all border-4 border-white"
        >
          المرحلة الثانية
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={() => {
            triggerAudio(CLICK_SOUND);
            toggleFullscreen();
          }}
          className="absolute bottom-4 left-4 md:bottom-12 md:left-12 z-20 bg-white/80 p-2.5 md:p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#4db6ac]"
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
        {stage2IntroActive ? (
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                triggerAudio(CLICK_SOUND);
                setStage2IntroActive(false);
              }}
              className={cn(
                "bg-[#f48fb1] text-white px-8 py-3 rounded-full text-xl font-black shadow-[0_4px_0_rgb(194,24,91)] transition-all flex items-center justify-center min-w-[200px] absolute left-1/2 -translate-x-1/2",
                isMobile ? "bottom-[11.5%]" : "bottom-[18%]"
              )}
            >
              <Play className="w-6 h-6 ml-2" />
              ابدأ
            </motion.button>


          </div>
        ) : (
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4">
          {/* Back Button - Top Left */}
          <button
            onClick={() => setStage2IntroActive(true)}
            className="hidden"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>

          {/* Next Stage Button - Top Right */}
          <button
            onClick={() => {
              triggerAudio(CLICK_SOUND);
              setPhase(3);
              setStage3IntroActive(true);
            }}
            className="absolute top-4 right-4 md:top-12 md:right-12 z-50 bg-[#9575cd]/80 text-white px-5 py-2 md:px-8 md:py-3 rounded-full text-base md:text-xl font-black shadow-lg hover:bg-[#9575cd] transition-all border-2 border-white"
          >
            المرحلة الثالثة
          </button>
          
          {/* Stage Area - Centered */}
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl relative">
            {/* Microphone / Audio Trigger - Animated position */}
            <motion.div 
              animate={{ 
                y: stage2ShowOptions ? (window.innerWidth < 768 ? -130 : -80) : 0 
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative z-50 flex flex-col items-center"
            >
              {/* Score Counters - Left and Right */}
              <div className="absolute top-1/2 -translate-y-1/2 w-[300px] sm:w-[calc(100%+160px)] md:w-[calc(100%+240px)] flex justify-between pointer-events-none">
                {/* Team X Score */}
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="pointer-events-auto flex flex-col items-center gap-1 md:gap-2"
                >
                  <div className="bg-white/95 p-1.5 md:p-4 rounded-xl md:rounded-3xl border-2 md:border-4 border-[#9575cd]/30 shadow-xl min-w-[65px] md:min-w-[100px] text-center">
                    <div className="text-[#9575cd] text-[10px] md:text-sm font-black mb-0.5 md:mb-1">{teamNames.X}</div>
                    <div className="text-xl md:text-4xl font-black text-[#f48fb1]">{stage2Score.X}</div>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <button 
                      onClick={() => updateStage2Score('X', -1)}
                      className="bg-white/80 w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[#9575cd] text-[10px] md:text-base font-bold shadow-md border-2 border-white hover:bg-white"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => updateStage2Score('X', 1)}
                      className="bg-[#f48fb1] w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-[10px] md:text-base font-bold shadow-md border-2 border-white hover:scale-110 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </motion.div>

                {/* Team O Score */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="pointer-events-auto flex flex-col items-center gap-1 md:gap-2"
                >
                  <div className="bg-white/95 p-1.5 md:p-4 rounded-xl md:rounded-3xl border-2 md:border-4 border-[#9575cd]/30 shadow-xl min-w-[65px] md:min-w-[100px] text-center">
                    <div className="text-[#9575cd] text-[10px] md:text-sm font-black mb-0.5 md:mb-1">{teamNames.O}</div>
                    <div className="text-xl md:text-4xl font-black text-[#f48fb1]">{stage2Score.O}</div>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <button 
                      onClick={() => updateStage2Score('O', -1)}
                      className="bg-white/80 w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[#9575cd] text-[10px] md:text-base font-bold shadow-md border-2 border-white hover:bg-white"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => updateStage2Score('O', 1)}
                      className="bg-[#f48fb1] w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-[10px] md:text-base font-bold shadow-md border-2 border-white hover:scale-110 transition-transform"
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
                  triggerAudio(stage2Questions[stage2QuestionOrder[stage2Index]].audioUrl);
                  setStage2ShowOptions(true);
                }}
                className="w-24 h-24 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-[#f48fb1] rounded-full flex items-center justify-center cursor-pointer border-8 border-[#9575cd] relative transition-all"
              >
                <Mic className={cn("w-10 h-10 sm:w-20 sm:h-20 md:w-28 md:h-28 text-[#9575cd]", isPlaying && "animate-pulse")} />
                
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

                {/* Centered Next Arrow directly over microphone */}
                <AnimatePresence>
                  {stage2Feedback && (
                    <motion.button 
                      key="next-arrow-centered"
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents re-triggering microphone audio
                        handleNextStage2Question();
                      }}
                      className="absolute inset-0 m-auto bg-[#9575cd] text-white p-4 rounded-full shadow-[0_0_50px_rgba(149,117,205,1)] hover:scale-110 active:scale-90 transition-all border-8 border-white flex items-center justify-center z-[99999] cursor-pointer"
                      title="السؤال التالي"
                    >
                      <ArrowRight className="w-12 h-12 sm:w-24 sm:h-24 md:w-32 md:h-32" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Instruction Label - Keep only the instructions here */}
              <div className="h-32 flex flex-col items-center justify-center -mt-8 md:-mt-12 relative z-[9999]">
                <AnimatePresence>
                  {!stage2ShowOptions && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="whitespace-nowrap bg-white/90 px-8 py-3 rounded-full text-[#9575cd] font-black shadow-lg border-2 border-[#9575cd]/20"
                    >
                      اضغط على الميكروفون للإستماع
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            
            {/* Options Area - Positioned properly */}
            <div className="absolute bottom-[12%] left-0 right-0 h-[45%] flex items-center justify-center z-50 pointer-events-none">
              <AnimatePresence mode="wait">
                {stage2ShowOptions ? (
                  <motion.div 
                    key="options"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full px-6 max-w-4xl pointer-events-auto"
                  >
                    {stage2Questions[stage2QuestionOrder[stage2Index]].options.map((opt, i) => (
                      <motion.button
                        key={i}
                        disabled={stage2Feedback !== null}
                        whileHover={!stage2Feedback ? { scale: 1.02 } : {}}
                        whileTap={!stage2Feedback ? { scale: 0.98 } : {}}
                        onClick={() => handleStage2Answer(i)}
                        className={cn(
                          "py-3 px-4 text-lg md:text-xl font-black rounded-[1.2rem] shadow-lg border-4 transition-all relative overflow-hidden text-white",
                          !stage2Feedback 
                            ? "bg-[#f48fb1] border-white hover:bg-[#f06292]"
                            : i === stage2Questions[stage2QuestionOrder[stage2Index]].correctIndex
                              ? "bg-[#a5d6a7] border-green-200 shadow-[0_0_15px_rgba(165,214,167,0.5)] scale-105 z-10"
                              : stage2Feedback.index === i
                                ? "bg-[#ef9a9a] border-red-200 shadow-[0_0_15px_rgba(239,154,154,0.5)]"
                                : "bg-[#f48fb1]/20 border-white/10 text-white/30"
                        )}
                      >
                        <div className="flex flex-col items-center">
                          {opt}
                          {stage2Feedback?.index === i && (
                            <motion.span 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs mt-1 font-bold flex flex-col items-center"
                            >
                              <span>{stage2Feedback.isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}</span>
                              {stage2Feedback.isCorrect && (
                                <span className="text-[10px] opacity-80 mt-0.5">
                                  ( أضف نقطه للفريق الذي أجاب أولاً )
                                </span>
                              )}
                            </motion.span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Next Stage Button */}
            {/* Moved to top right */}



            {/* Fullscreen Button */}
            <button
              onClick={() => {
                triggerAudio(CLICK_SOUND);
                toggleFullscreen();
              }}
              className="absolute bottom-4 left-4 md:bottom-12 md:left-12 z-20 bg-white/80 p-2.5 md:p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#9575cd]"
              title="ملء الشاشة"
            >
              {isFullscreen ? <Minimize className="w-8 h-8" /> : <Maximize className="w-8 h-8" />}
            </button>
          </div>
        </div>
      )}
    </div>
  </motion.div>
) : phase === 3 ? (
  <motion.div 
    key="stage3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    className="relative z-10 h-full w-full flex flex-col items-center justify-center shadow-xl" 
  >
    <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] mx-auto overflow-hidden">
        {stage3IntroActive ? (
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                triggerAudio(CLICK_SOUND);
                setStage3IntroActive(false);
              }}
              className={cn(
                "bg-[#f48fb1] text-white px-8 py-3 rounded-full text-xl font-black shadow-[0_4px_0_rgb(194,24,91)] transition-all flex items-center justify-center min-w-[200px] absolute left-1/2 -translate-x-1/2",
                isMobile ? "bottom-[11.5%]" : "bottom-[18%]"
              )}
            >
              <Play className="w-6 h-6 ml-2" />
              ابدأ
            </motion.button>
          </div>
        ) : !showFinalResults ? (
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4 overflow-hidden">

      {/* Header */}
      <div className="mt-2 md:mt-8 flex justify-center shrink-0">
        <div className="bg-[#f48fb1] px-6 py-2 md:px-8 md:py-3 rounded-full border-2 md:border-4 border-[#4db6ac] shadow-xl md:shadow-2xl">
          <h2 className="text-lg md:text-2xl font-black text-white italic drop-shadow-md">سباق التخرج</h2>
        </div>
      </div>

      {/* Map Area */}
      <div className="w-full flex flex-col gap-4 md:gap-12 mt-4 md:mt-20">
        {/* Team X Path */}
        <div className="relative">
          <div className="flex items-center gap-3 md:gap-4 mb-1 md:mb-2">
            <div className="bg-[#f48fb1] p-1.5 md:p-2 rounded-lg text-white text-xs md:text-base font-black truncate max-w-[80px] md:max-w-none">{teamNames.X}</div>
            <div className="h-1.5 md:h-2 flex-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#f48fb1]"
                initial={{ width: 0 }}
                animate={{ width: `${(stage3Positions.X / 20) * 100}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-10 gap-1 md:gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-6 md:h-10 rounded-lg md:rounded-xl border md:border-2 flex items-center justify-center transition-all",
                  i === 19 ? "bg-[#fff59d] border-[#fbc02d] shadow-md" : 
                  (stage3Positions.X > i ? "bg-[#f48fb1] border-white shadow-sm" : "bg-white/20 border-white/40")
                )}
              >
                {stage3Positions.X === i && (
                  <motion.div layoutId="cap-x">
                    <GraduationCap className="w-3 h-3 md:w-5 md:h-5 text-white drop-shadow-md" />
                  </motion.div>
                )}
                {i === 19 && <Trophy className={cn("w-3 h-3 md:w-5 md:h-5", stage3Positions.X === 19 ? "text-[#fbc02d]" : "text-yellow-600")} />}
              </div>
            ))}
          </div>
        </div>

        {/* Team O Path */}
        <div className="relative">
          <div className="flex items-center gap-3 md:gap-4 mb-1 md:mb-2">
            <div className="bg-[#4db6ac] p-1.5 md:p-2 rounded-lg text-white text-xs md:text-base font-black truncate max-w-[80px] md:max-w-none">{teamNames.O}</div>
            <div className="h-1.5 md:h-2 flex-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#4db6ac]"
                initial={{ width: 0 }}
                animate={{ width: `${(stage3Positions.O / 20) * 100}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-10 gap-1 md:gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-6 md:h-10 rounded-lg md:rounded-xl border md:border-2 flex items-center justify-center transition-all",
                  i === 19 ? "bg-[#fff59d] border-[#fbc02d] shadow-md" : 
                  (stage3Positions.O > i ? "bg-[#4db6ac] border-white shadow-sm" : "bg-white/20 border-white/40")
                )}
              >
                {stage3Positions.O === i && (
                  <motion.div layoutId="cap-o">
                    <GraduationCap className="w-3 h-3 md:w-5 md:h-5 text-white drop-shadow-md" />
                  </motion.div>
                )}
                {i === 19 && <Trophy className={cn("w-3 h-3 md:w-5 md:h-5", stage3Positions.O === 19 ? "text-[#fbc02d]" : "text-yellow-600")} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 md:mt-12 shrink-0">
        <Button 
          onClick={() => {
            triggerAudio(CLICK_SOUND);
            // Strictly exclude any previously used question ID in Stage 3
            const available = stage3Questions.filter(q => !usedQuestions.includes(q.id));
            const teamQuestions = available.filter(q => q.team === currentPlayer);
            const q = teamQuestions.length > 0 
              ? teamQuestions[Math.floor(Math.random() * teamQuestions.length)]
              : (available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null);
            
            if (q) {
              setStage3CurrentQuestion(q);
              // Mark as used IMMEDIATELY - it will NEVER repeat for anyone
              setUsedQuestions(prev => [...prev, q.id]);
              setShowStage3Question(true);
            } else {
              alert("تم استهلاك جميع الأسئلة المتاحة!");
            }
          }}
          className={cn(
            "text-white text-lg md:text-2xl font-black px-8 py-3 md:px-12 md:py-8 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border-4 border-white transition-all duration-300",
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
        onClick={() => {
          setPhase(2);
          setStage2IntroActive(true);
        }}
        className="hidden"
      >
        <ArrowRight className="w-8 h-8" />
      </button>

      {/* Fullscreen Button */}
      <button
        onClick={() => {
          triggerAudio(CLICK_SOUND);
          toggleFullscreen();
        }}
        className="absolute bottom-4 left-4 md:bottom-12 md:left-12 z-20 bg-white/80 p-2.5 md:p-4 rounded-full shadow-lg hover:bg-white transition-all text-[#4db6ac]"
        title="ملء الشاشة"
      >
        {isFullscreen ? <Minimize className="w-8 h-8" /> : <Maximize className="w-8 h-8" />}
      </button>
    </div>
  ) : null}

    {/* Stage 3 Question Modal */}
    <Dialog open={showStage3Question} onOpenChange={(open) => {
      if (!open) {
        // If closing manually
        setShowStage3Question(false);
        setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      } else {
        setShowStage3Question(true);
      }
    }}>
      <DialogContent className={cn(
        "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md h-auto max-h-[90vh] border-8 rounded-[3rem] p-4 sm:p-5 transition-colors duration-500 flex flex-col z-[150] outline-none",
        currentPlayer === 'X' 
          ? "bg-[#fce4ec]/95 border-[#4db6ac]" 
          : "bg-[#e0f2f1]/95 border-[#f48fb1]"
      )}>
        <DialogHeader className="shrink-0">
          <DialogTitle className={cn(
            "text-lg font-black text-center mb-0.5",
            currentPlayer === 'X' ? "text-[#f48fb1]" : "text-[#4db6ac]"
          )}>
            سؤال لـ {currentPlayer === 'X' ? teamNames.X : teamNames.O}
          </DialogTitle>
          
          {/* Elegant Timer Design */}
          <div className="flex justify-center mb-1">
            <div className={cn(
              "relative h-12 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300",
              stage3Timer <= 0 ? "bg-transparent border-none w-auto" : 
              stage3Timer <= 3 ? "border-4 shadow-inner border-red-500 bg-red-50 animate-pulse w-12" : 
              currentPlayer === 'X' ? "border-4 shadow-inner border-[#f48fb1] bg-white w-12" : "border-4 shadow-inner border-[#4db6ac] bg-white w-12"
            )}>
              {stage3Timer > 0 && (
                <motion.div 
                  className={cn(
                    "absolute inset-0 opacity-10",
                    stage3Timer <= 3 ? "bg-red-500" : 
                    currentPlayer === 'X' ? "bg-[#f48fb1]" : "bg-[#4db6ac]"
                  )}
                  initial={{ height: "100%" }}
                  animate={{ height: `${(stage3Timer / 40) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              )}
              <span className={cn(
                "font-black z-10 whitespace-nowrap",
                stage3Timer <= 0 ? (currentPlayer === 'X' ? "text-[#f48fb1] text-lg" : "text-[#4db6ac] text-lg") :
                stage3Timer <= 3 ? "text-red-600 text-xl" : 
                currentPlayer === 'X' ? "text-[#f48fb1] text-xl" : "text-[#4db6ac] text-xl"
              )}>
                {stage3Timer <= 0 ? "انتهى الوقت!" : stage3Timer}
              </span>
            </div>
          </div>

        </DialogHeader>
        <div className="flex-1 flex flex-col min-h-0 space-y-2 overflow-visible">
          {stage3CurrentQuestion?.imageUrl && (
            <div className="flex-1 flex flex-col justify-center items-center min-h-0 overflow-visible pb-1">
              <img 
                src={stage3CurrentQuestion.imageUrl} 
                alt="Question" 
                onClick={() => setShowImageZoom(true)}
                className="max-w-full max-h-[35vh] object-contain rounded-2xl shadow-lg border-4 border-white cursor-zoom-in hover:scale-[1.02] transition-transform"
                referrerPolicy="no-referrer"
              />
              <p className="text-[10px] md:text-xs font-black text-white bg-[#f48fb1]/80 px-3 py-1 rounded-full mt-2 shadow-lg border border-white/50 backdrop-blur-sm animate-pulse z-10">
                ( اضغط على الصورة لتكبيرها )
              </p>
            </div>
          )}
          {!stage3CurrentQuestion?.imageUrl && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 w-full">
              {stage3CurrentQuestion?.text.includes('اكمل المثل') && (
                <motion.div 
                  animate={{ x: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className={cn(
                  "px-8 py-2 rounded-full text-lg font-black shadow-lg border-4 border-white mb-4",
                  currentPlayer === 'X' ? "bg-[#f48fb1] text-white" : "bg-[#4db6ac] text-white"
                )}>
                  ✨ أكمل المثل ✨
                </motion.div>
              )}
              <p 
                dir="rtl"
                className={cn(
                "text-xl md:text-2xl font-black text-right leading-relaxed px-6 transition-colors break-words w-full",
                currentPlayer === 'X' ? "text-[#f48fb1]" : "text-[#4db6ac]"
              )}>
                {stage3CurrentQuestion?.text.replace('اكمل المثل: ', '').replace('أكمل المثل: ', '')}
              </p>
            </div>
          )}
          
          <div className="shrink-0 pt-2 flex flex-col items-center gap-2">
            {stage3CurrentQuestion?.isPresenterOnly ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  disabled={stage3Timer <= 0}
                  onClick={() => {
                    triggerAudio(CLICK_SOUND);
                    triggerAudio(CORRECT_SOUND);
                    const newPos = Math.min(19, stage3Positions[currentPlayer] + 1);
                    setStage3Positions(prev => ({
                      ...prev,
                      [currentPlayer]: newPos
                    }));
                    
                    const newStreak = streaks[currentPlayer] + 1;
                    setStreaks(prev => ({ ...prev, [currentPlayer]: newStreak }));

                    if (newPos === 19) {
                      setWinner(currentPlayer);
                      setStageWinners(prev => ({ ...prev, 3: currentPlayer }));
                      setShowStageVictory({ phase: 3, winner: currentPlayer });
                    }
                    
                    setCorrectFeedback(true);
                  }}
                  className={cn(
                    "py-2 px-2 text-sm font-black rounded-2xl text-white border-2 border-white shadow-lg transition-all",
                    stage3Timer <= 0 ? "bg-gray-400 opacity-50 cursor-not-allowed" : "bg-[#4db6ac] hover:bg-[#00897b]"
                  )}
                >
                  إجابة صحيحة
                </button>
                <button
                  disabled={stage3Timer <= 0}
                  onClick={() => {
                    triggerAudio(CLICK_SOUND);
                    triggerAudio("https://www.soundjay.com/buttons/sounds/button-10.mp3");
                    setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
                    setWrongFeedback(true);
                  }}
                  className={cn(
                    "py-2 px-2 text-sm font-black rounded-2xl text-white border-2 border-white shadow-lg transition-all",
                    stage3Timer <= 0 ? "bg-gray-400 opacity-50 cursor-not-allowed" : "bg-[#f48fb1] hover:bg-[#f06292]"
                  )}
                >
                  إجابة خاطئة
                </button>


              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 w-full">
                {stage3CurrentQuestion?.options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={stage3Timer <= 0}
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
                          setStageWinners(prev => ({ ...prev, 3: currentPlayer }));
                          setShowStageVictory({ phase: 3, winner: currentPlayer });
                        }
                        
                        setCorrectFeedback(true);
                      } else {
                        setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
                        setWrongFeedback(true);
                      }
                    }}
                    className={cn(
                      "py-2 px-4 text-base font-black rounded-xl border-2 border-white shadow-md transition-all",
                      stage3Timer <= 0 && "opacity-50 cursor-not-allowed",
                      currentPlayer === 'X' 
                        ? (showStage3Answer && i === stage3CurrentQuestion.correctIndex ? "bg-[#4db6ac] text-white" : "bg-white text-[#f48fb1] hover:bg-[#f48fb1] hover:text-white") 
                        : (showStage3Answer && i === stage3CurrentQuestion.correctIndex ? "bg-[#f48fb1] text-white" : "bg-white text-[#4db6ac] hover:bg-[#4db6ac] hover:text-white")
                    )}
                  >
                    {opt}
                  </button>
                ))}


              </div>
            )}

            {stage3CurrentQuestion && (
                <button
                  onClick={() => {
                    triggerAudio(CLICK_SOUND);
                    setShowStage3Answer(!showStage3Answer);
                  }}
                  className="mt-4 py-3 px-8 text-sm font-black rounded-xl bg-gradient-to-r from-[#f48fb1] via-[#4db6ac] to-[#f48fb1] bg-[length:200%_auto] animate-gradient-x border-2 border-white text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 drop-shadow-sm" />
                  {showStage3Answer ? "إخفاء الإجابة" : "عرض الإجابة"}
                </button>
            )}

            <AnimatePresence>
              {showStage3Answer && stage3CurrentQuestion?.answerText && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mt-2 p-2 bg-white rounded-xl border border-white/30 text-center"
                >
                  <p className="text-sm font-bold text-gray-700">الإجابة: {stage3CurrentQuestion.answerText}</p>
                </motion.div>
              )}
            </AnimatePresence>
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
                    animate={{ height: `${(stage3Timer / 40) * 100}%` }}
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
                    animate={{ width: `${(stage3Timer / 40) * 100}%` }}
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
              className="absolute top-4 right-4 md:top-12 md:right-12 bg-white/40 hover:bg-white/60 p-2.5 md:p-4 rounded-full backdrop-blur-xl transition-all shadow-2xl border-2 border-white/50 group"
              onClick={() => setShowImageZoom(false)}
            >
              <X className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Streak Bonus Modal */}
    <Dialog open={showStreakBonus} onOpenChange={setShowStreakBonus}>
      <DialogContent className="max-w-4xl backdrop-blur-xl border-8 border-[#4db6ac] rounded-[3rem] p-8 bg-[#fce4ec]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-center mb-2 text-[#f48fb1] animate-pulse">
            مكافأة !
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-center" dir="rtl">
          <p className="text-lg font-black text-[#f48fb1] leading-relaxed">
            بما أن الفريق {currentPlayer === 'X' ? teamNames.X : teamNames.O} أجاب عن ٣ أسئلة متتالية بدون خطأ، يحق له اختيار إحدى المكافآت التالية:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => {
                const otherPlayer = currentPlayer === 'X' ? 'O' : 'X';
                const newPos = Math.max(0, stage3Positions[otherPlayer] - 1);
                setStage3Positions(prev => ({ ...prev, [otherPlayer]: newPos }));
                setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
                setShowStreakBonus(false);
                setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
              }}
              className="py-3 px-4 text-base font-black rounded-2xl bg-[#4db6ac] text-white border-2 border-white shadow-xl hover:scale-105 transition-transform flex flex-col items-center justify-center gap-1"
            >
              <span className="leading-tight text-sm">إجبار الفريق {currentPlayer === 'X' ? teamNames.O : teamNames.X} على التراجع خطوة</span>
              <span className="text-lg">🔙</span>
            </button>
            <button
              onClick={() => {
                const newPos = Math.min(19, stage3Positions[currentPlayer] + 1);
                setStage3Positions(prev => ({ ...prev, [currentPlayer]: newPos }));
                setStreaks(prev => ({ ...prev, [currentPlayer]: 0 }));
                if (newPos === 19) {
                  setWinner(currentPlayer);
                  setStageWinners(prev => ({ ...prev, 3: currentPlayer }));
                  setShowStageVictory({ phase: 3, winner: currentPlayer });
                }
                setShowStreakBonus(false);
                setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
              }}
              className="py-3 px-4 text-base font-black rounded-2xl bg-[#4db6ac] text-white border-2 border-white shadow-xl hover:scale-105 transition-transform flex flex-col items-center justify-center gap-1"
            >
              <span className="leading-tight text-sm">التقدم خطوة للأمام بدون الحاجة للإجابة عن سؤال</span>
              <span className="text-lg">🚀</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</motion.div>
) : null}
</AnimatePresence>
</div>
);
}
