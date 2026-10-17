import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { Trophy, ArrowLeft, CheckCircle2, XCircle, Sparkles, HelpCircle, RotateCcw, Timer } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const HAITIAN_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Nan ki dat Ayiti te pwoklame endepandans li nan vil Gonayiv?',
    options: ['1e Janvye 1804', '18 Novanm 1803', '7 Avril 1803', '14 Out 1791'],
    correctIndex: 0,
    explanation: 'Jean-Jacques Dessalines te pwoklame endepandans Ayiti premye Janvye 1804 nan vil Gonayiv.',
  },
  {
    question: 'Kiyès ki te bati Sitadèl Laferyè nan Nò peyi a?',
    options: ['Toussaint Louverture', 'Henri Christophe', 'Alexandre Pétion', 'Jean-Pierre Boyer'],
    correctIndex: 1,
    explanation: 'Wa Henri Christophe te bati Sitadèl Laferyè pou defann peyi a kont nenpòt envazyon.',
  },
  {
    question: 'Fini pwovèb kreyòl sa a: "Dèyè mòn gen..."?',
    options: ['Rivyè', 'Mòn', 'Pye bwa', 'Solèy'],
    correctIndex: 1,
    explanation: '"Dèyè mòn gen mòn" vle di toujou gen lòt defi oswa lòt reyalite ki kache.',
  },
  {
    question: 'Ki vil ann Ayiti ki pote tit "Vil Powèt yo"?',
    options: ['Jakmèl', 'Okap', 'Jeremi', 'Gonayiv'],
    correctIndex: 2,
    explanation: 'Vil Jeremi nan Grandans rele Vil Powèt yo akoz anpil gwo ekriven li bay peyi a.',
  },
  {
    question: 'Kiyès ki kreye rit mizikal "Konpa Dirèk" an Ayiti nan lane 1955?',
    options: ['Coupe Cloue', 'Nemours Jean-Baptiste', 'Webert Sicot', 'Ti Manno'],
    correctIndex: 1,
    explanation: 'Mèt Nemours Jean-Baptiste se papa fondatè rit Konpa Dirèk la nan lane 1955.',
  },
];

export const QuizHaiti: React.FC = () => {
  const { user, updateUser, addTransaction, addNotification, setActiveGame, showToast, language } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);

  const startQuiz = () => {
    if (!isFreeMode && user.balanceHTG < betAmount) {
      showToast('Balans ou pa ase pou miz sa a. Fè yon depo rapid!', 'error');
      return;
    }

    if (!isFreeMode) {
      updateUser({ balanceHTG: user.balanceHTG - betAmount });
      addTransaction({
        type: 'bet_placed',
        amountHTG: betAmount,
        referenceNumber: 'BET-QUIZ-' + Math.floor(1000 + Math.random() * 9000),
        status: 'completed',
        description: `Miz ${betAmount} HTG sou Quiz Kreyòl & Ayiti`,
      });
    }

    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setGameStarted(true);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === HAITIAN_QUESTIONS[currentIndex].correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < HAITIAN_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    const finalScore = score + (selectedOption === HAITIAN_QUESTIONS[currentIndex].correctIndex ? 1 : 0);

    if (finalScore >= 4) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (!isFreeMode) {
        const prizeHTG = Math.floor(betAmount * 2.2); // 2.2x return
        updateUser({
          balanceHTG: user.balanceHTG + prizeHTG,
          points: user.points + 60,
        });

        addTransaction({
          type: 'bet_won',
          amountHTG: prizeHTG,
          referenceNumber: 'WIN-QUIZ-' + Math.floor(1000 + Math.random() * 9000),
          status: 'completed',
          description: `Viktwa Quiz Ayiti (${finalScore}/5) +${prizeHTG} HTG`,
        });

        addNotification(
          'Viktwa Sou Quiz Kreyòl! 🎉',
          `Ou jwenn ${finalScore}/5 sou kilti ak istwa Ayiti epi ou touche ${prizeHTG.toLocaleString()} HTG!`,
          'game'
        );

        showToast(`Bravo! Ou ranpòte ${prizeHTG.toLocaleString()} HTG nan Quiz la!`, 'success');
      } else {
        updateUser({ points: user.points + 40 });
        showToast(`Felisitasyon! Ou genyen 40 Pwen Lakay!`, 'success');
      }
    } else {
      showToast(`Ou fè ${finalScore}/5. Ou ka reeseye ankò pou w pran prim lan!`, 'info');
    }
  };

  const currentQ = HAITIAN_QUESTIONS[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveGame(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retounen nan tout jwèt yo</span>
        </button>

        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black">
          Quiz Kilti &amp; Istwa 1804
        </span>
      </div>

      {!gameStarted || quizFinished ? (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {quizFinished
                ? score >= 4
                  ? '🏆 Viktwa Mèt Quiz!'
                  : 'Bon Eseye!'
                : 'Quiz Ayiti & Kilti Kreyòl'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
              {quizFinished
                ? `Ou jwenn yon nòt ${score} sou 5 sou kesyon istwa ak kilti Ayiti yo.`
                : 'Teste konesans ou sou istwa 1804, sit touristik, rit konpa ak pwovèb zansèt nou yo pou w ranpòte goud kach!'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsFreeMode(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                !isFreeMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Miz an Goud (HTG)
            </button>
            <button
              onClick={() => setIsFreeMode(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isFreeMode ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Jwe Gratis
            </button>
          </div>

          {!isFreeMode && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md mx-auto">
              {[5, 10, 25, 50, 100, 250, 500, 1000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                    betAmount === amt ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {amt} HTG
                </button>
              ))}
            </div>
          )}

          <button
            onClick={startQuiz}
            className="w-full max-w-sm mx-auto py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-950/40 transition cursor-pointer"
          >
            {quizFinished ? 'Rejwe Yon Lòt Seri' : isFreeMode ? 'Kòmanse Quiz Gratis' : `Lanse Quiz (${betAmount} HTG)`}
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Header indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kesyon {currentIndex + 1} sou {HAITIAN_QUESTIONS.length}</span>
            <span className="text-amber-400 font-bold">Pwen: {score}</span>
          </div>

          {/* Progress */}
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / HAITIAN_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question text */}
          <h3 className="text-lg sm:text-xl font-black text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = isAnswered && idx === currentQ.correctIndex;
              const isWrong = isAnswered && isSelected && idx !== currentQ.correctIndex;

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl text-left font-bold text-xs sm:text-sm border transition flex items-center justify-between cursor-pointer ${
                    isCorrect
                      ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                      : isWrong
                      ? 'bg-red-950/50 border-red-500 text-red-300'
                      : isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span>{option}</span>
                  {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isWrong && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-400 block mb-1">Eksplikasyon :</span>
              {currentQ.explanation}
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
            >
              {currentIndex < HAITIAN_QUESTIONS.length - 1 ? 'Kesyon Swivan' : 'Wè Rezilta yo'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
