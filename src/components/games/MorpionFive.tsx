import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Users,
  Bot,
  MessageSquare,
  Send,
  Coins,
  ShieldAlert,
  ArrowLeft,
  Volume2,
  Sparkles,
  Zap,
} from 'lucide-react';

const BOARD_SIZE = 12; // 12x12 grid for great mobile and desktop play

type Cell = 'X' | 'O' | null;

interface ChatMsg {
  id: string;
  sender: string;
  text: string;
  isMe: boolean;
  time: string;
}

export const MorpionFive: React.FC = () => {
  const { user, updateUser, addTransaction, addNotification, setActiveGame, showToast, language } = useApp();

  // Game configuration
  const [betAmount, setBetAmount] = useState<number>(100);
  const [isFreeMode, setIsFreeMode] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<'multiplayer' | 'bot' | 'local'>('multiplayer');
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Opponent details
  const [opponentName, setOpponentName] = useState<string>('Jean-Baptiste (Pòtoprens)');
  const [opponentAvatar, setOpponentAvatar] = useState<string>('🇭🇹');

  // Board state
  const [board, setBoard] = useState<Cell[][]>(() =>
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [turn, setTurn] = useState<'X' | 'O'>('X'); // X is Player 1 (User), O is Opponent
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);

  // In-game live chat
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      id: 'c-1',
      sender: 'Sistèm',
      text: 'Byenvini nan Morpion 5 Pyon! Premye jwè ki alinye 5 pyon ranpòte miz la.',
      isMe: false,
      time: '12:00',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quick Haitian banter buttons
  const quickEmotes = [
    'Bèl kou sa!',
    'W ap pèdi jodi a!',
    'M pa pè w non!',
    'Sak pase!',
    'Tèt chaje!',
    'Piti piti zwazo fè nich li!',
  ];

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Check 5 in a row algorithm
  const checkWin = (grid: Cell[][], row: number, col: number, player: 'X' | 'O') => {
    const directions = [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
      [1, 1],  // Diagonal \
      [1, -1], // Diagonal /
    ];

    for (const [dr, dc] of directions) {
      let count = 1;
      const matched: [number, number][] = [[row, col]];

      // Positive direction
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && grid[r][c] === player) {
        count++;
        matched.push([r, c]);
        r += dr;
        c += dc;
      }

      // Negative direction
      r = row - dr;
      c = col - dc;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && grid[r][c] === player) {
        count++;
        matched.push([r, c]);
        r -= dr;
        c -= dc;
      }

      // Exactly or at least 5 consecutive pieces
      if (count >= 5) {
        return matched;
      }
    }
    return null;
  };

  // Start new match
  const startMatch = () => {
    if (!isFreeMode && user.balanceHTG < betAmount) {
      showToast('Balans ou pa ase pou miz sa a. Fè yon depo rapid!', 'error');
      return;
    }

    if (!isFreeMode) {
      updateUser({ balanceHTG: user.balanceHTG - betAmount });
      addTransaction({
        type: 'bet_placed',
        amountHTG: betAmount,
        referenceNumber: 'BET-MORPION-' + Math.floor(1000 + Math.random() * 9000),
        status: 'completed',
        description: `Miz ${betAmount} HTG sou Morpion 5 Pyon`,
      });
    }

    // Pick realistic Haitian online opponent
    const opponents = [
      { name: 'Woody Joseph (Okap)', avatar: '🔥' },
      { name: 'Fabiola Chery (Jakmèl)', avatar: '👑' },
      { name: 'Mackenson (Pétion-Ville)', avatar: '⚡' },
      { name: 'Roseline (Delmas)', avatar: '🌸' },
      { name: 'Daphné (Kafou)', avatar: '🇭🇹' },
    ];
    const picked = opponents[Math.floor(Math.random() * opponents.length)];
    setOpponentName(picked.name);
    setOpponentAvatar(picked.avatar);

    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setTurn('X');
    setWinner(null);
    setWinningCells([]);
    setGameStarted(true);

    setChatMessages([
      {
        id: 'c-' + Date.now(),
        sender: picked.name,
        text: 'Sak pase bro! Ann wè si w ka mete 5 pyon sou mwen!',
        isMe: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    showToast(`Match lanse kont ${picked.name}!`, 'info');
  };

  // Make a move
  const handleCellClick = (r: number, c: number) => {
    if (!gameStarted || board[r][c] !== null || winner !== null) return;
    if (gameMode === 'multiplayer' && turn !== 'X') return;

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = turn;
    setBoard(newBoard);

    // Check win
    const winningStreak = checkWin(newBoard, r, c, turn);
    if (winningStreak) {
      setWinner(turn);
      setWinningCells(winningStreak);
      handleGameOver(turn);
      return;
    }

    // Check draw
    const isFull = newBoard.every(row => row.every(cell => cell !== null));
    if (isFull) {
      setWinner('draw');
      showToast('Match la fini noul!', 'info');
      return;
    }

    // Switch turn
    const nextTurn = turn === 'X' ? 'O' : 'X';
    setTurn(nextTurn);

    // If multiplayer or bot, trigger opponent reply move
    if ((gameMode === 'multiplayer' || gameMode === 'bot') && nextTurn === 'O') {
      setTimeout(() => {
        handleOpponentMove(newBoard);
      }, 700 + Math.random() * 600);
    }
  };

  // Smart opponent response move
  const handleOpponentMove = (currentBoard: Cell[][]) => {
    if (winner !== null) return;

    // 1. Try to find winning move for O (4 in a row to make 5)
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (currentBoard[r][c] === null) {
          currentBoard[r][c] = 'O';
          if (checkWin(currentBoard, r, c, 'O')) {
            executeMove(currentBoard, r, c, 'O');
            return;
          }
          currentBoard[r][c] = null;
        }
      }
    }

    // 2. Block X if X is about to get 5 in a row
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (currentBoard[r][c] === null) {
          currentBoard[r][c] = 'X';
          if (checkWin(currentBoard, r, c, 'X')) {
            currentBoard[r][c] = 'O';
            executeMove(currentBoard, r, c, 'O');
            return;
          }
          currentBoard[r][c] = null;
        }
      }
    }

    // 3. Play near existing pieces
    const candidateMoves: [number, number][] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (currentBoard[r][c] === null) {
          // Check if adjacent cell has a piece
          let hasNeighbor = false;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && currentBoard[nr][nc] !== null) {
                hasNeighbor = true;
                break;
              }
            }
            if (hasNeighbor) break;
          }
          if (hasNeighbor) {
            candidateMoves.push([r, c]);
          }
        }
      }
    }

    let move: [number, number];
    if (candidateMoves.length > 0) {
      move = candidateMoves[Math.floor(Math.random() * candidateMoves.length)];
    } else {
      move = [Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2)];
    }

    currentBoard[move[0]][move[1]] = 'O';
    executeMove(currentBoard, move[0], move[1], 'O');
  };

  const executeMove = (updatedBoard: Cell[][], r: number, c: number, player: 'O') => {
    setBoard(updatedBoard.map(row => [...row]));

    const winStreak = checkWin(updatedBoard, r, c, player);
    if (winStreak) {
      setWinner(player);
      setWinningCells(winStreak);
      handleGameOver(player);
      return;
    }

    setTurn('X');
  };

  // Game over & payouts
  const handleGameOver = (winPlayer: 'X' | 'O') => {
    if (winPlayer === 'X') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      if (!isFreeMode) {
        const prizeHTG = Math.floor(betAmount * 1.95); // 1.95x return
        updateUser({
          balanceHTG: user.balanceHTG + prizeHTG,
          points: user.points + 50,
        });

        addTransaction({
          type: 'bet_won',
          amountHTG: prizeHTG,
          referenceNumber: 'WIN-MORPION-' + Math.floor(1000 + Math.random() * 9000),
          status: 'completed',
          description: `Viktwa Morpion 5 Pyon (+${prizeHTG} HTG)`,
        });

        addNotification(
          'Viktwa Sou Morpion 5 Pyon! 🎉',
          `Ou alinye 5 pyon epi ou ranpòte ${prizeHTG.toLocaleString()} HTG sou kont ou!`,
          'game'
        );

        showToast(`FELISITASYON! Ou ranpòte ${prizeHTG.toLocaleString()} HTG! 🎉`, 'success');
      } else {
        updateUser({ points: user.points + 25 });
        showToast('Bravo! Ou alinye 5 pyon epi ou genyen 25 Pwen Lakay!', 'success');
      }
    } else {
      showToast(`${opponentName} alinye 5 pyon! Ou ka pran revanch ou kounye a.`, 'info');
    }
  };

  // Chat message sending
  const handleSendChat = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const newMsg: ChatMsg = {
      id: 'c-' + Date.now(),
      sender: user.name,
      text,
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputMsg('');

    // Opponent occasional comeback
    setTimeout(() => {
      const comebacks = [
        'Kou sa bèl, men atansyon mwen la!',
        'W ap kouri dèyè 5 pyon an twòp!',
        'Haha, gade pyon pa m yo!',
        'Ann gade kiyès ki mèt jwèt la!',
        'Respekte jwè Okap la tande!',
      ];
      setChatMessages(prev => [
        ...prev,
        {
          id: 'c-' + Date.now(),
          sender: opponentName,
          text: comebacks[Math.floor(Math.random() * comebacks.length)],
          isMe: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Top back button & mode indicator */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveGame(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retounen nan tout jwèt yo</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Règ ofisyèl:</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black">
            Alinye 5 Pyon Pou Genyen
          </span>
        </div>
      </div>

      {/* Main Game Interface Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Game Board + Controls */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col items-center">
          {/* Match Status Bar */}
          <div className="w-full flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800 mb-4">
            {/* Player 1 (User) */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border-2 ${
                  turn === 'X' && !winner
                    ? 'border-blue-500 bg-blue-950 text-blue-400 ring-2 ring-blue-500/50 animate-pulse'
                    : 'border-slate-700 bg-slate-800 text-slate-300'
                }`}
              >
                X
              </div>
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1">
                  <span>{user.name} (Ou)</span>
                  {turn === 'X' && !winner && <span className="text-[10px] text-amber-400">● Kou pa w</span>}
                </div>
                <div className="text-[10px] text-blue-400 font-semibold">Pyon Ble</div>
              </div>
            </div>

            {/* Bet info */}
            <div className="text-center px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {isFreeMode ? 'Mòd Gratis' : 'Miz nan Match la'}
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-400">
                {isFreeMode ? '0 HTG' : `${betAmount} HTG`}
              </span>
            </div>

            {/* Player 2 (Opponent) */}
            <div className="flex items-center gap-2.5 text-right">
              <div>
                <div className="font-bold text-xs text-white flex items-center justify-end gap-1">
                  {turn === 'O' && !winner && <span className="text-[10px] text-red-400">● Kou pa l</span>}
                  <span>{opponentName}</span>
                </div>
                <div className="text-[10px] text-red-400 font-semibold">Pyon Wouj</div>
              </div>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border-2 ${
                  turn === 'O' && !winner
                    ? 'border-red-500 bg-red-950 text-red-400 ring-2 ring-red-500/50 animate-pulse'
                    : 'border-slate-700 bg-slate-800 text-slate-300'
                }`}
              >
                O
              </div>
            </div>
          </div>

          {/* Winner announcement overlay banner */}
          {winner && (
            <div
              className={`w-full p-4 mb-4 rounded-2xl text-center border font-black text-sm sm:text-base flex items-center justify-center gap-2 ${
                winner === 'X'
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/60'
                  : winner === 'O'
                  ? 'bg-red-950/70 border-red-500 text-red-300'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span>
                {winner === 'X'
                  ? 'OU GENYEN! Ou alinye 5 pyon!'
                  : winner === 'O'
                  ? `${opponentName} alinye 5 pyon!`
                  : 'Match Noul!'}
              </span>
            </div>
          )}

          {/* The 12x12 Grid Board */}
          <div className="relative overflow-auto max-w-full p-2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-slate-700/80 shadow-inner">
            <div
              className="grid gap-1 select-none"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
                width: 'min(90vw, 520px)',
                height: 'min(90vw, 520px)',
              }}
            >
              {board.map((row, r) =>
                row.map((cell, c) => {
                  const isWinningCell = winningCells.some(([wr, wc]) => wr === r && wc === c);

                  return (
                    <button
                      key={`${r}-${c}`}
                      disabled={!gameStarted || cell !== null || winner !== null}
                      onClick={() => handleCellClick(r, c)}
                      className={`relative flex items-center justify-center rounded-md font-black text-sm sm:text-base transition-all cursor-pointer ${
                        isWinningCell
                          ? 'bg-amber-400 text-slate-950 scale-105 shadow-lg shadow-amber-400/50 z-10 animate-bounce'
                          : cell === 'X'
                          ? 'bg-blue-600/90 text-white shadow-inner'
                          : cell === 'O'
                          ? 'bg-red-600/90 text-white shadow-inner'
                          : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-transparent'
                      }`}
                    >
                      {cell === 'X' ? (
                        <span className="font-extrabold text-blue-200">X</span>
                      ) : cell === 'O' ? (
                        <span className="font-extrabold text-red-200">O</span>
                      ) : (
                        <span className="opacity-0">.</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Bet Setting & Match Launch Bar */}
          <div className="w-full mt-4 pt-4 border-t border-slate-800 space-y-3">
            {!gameStarted || winner !== null ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">Mòd Jwèt:</span>
                    <button
                      type="button"
                      onClick={() => setIsFreeMode(false)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        !isFreeMode
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Miz an Goud (HTG)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFreeMode(true)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isFreeMode
                          ? 'bg-sky-500 text-slate-950 shadow'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Jwe Gratis
                    </button>
                  </div>

                  {!isFreeMode && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[5, 10, 25, 50, 100, 250, 500, 1000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setBetAmount(amt)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                            betAmount === amt
                              ? 'bg-amber-500 text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {amt} HTG
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={startMatch}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-950/40 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {winner !== null
                      ? 'Rejwe Yon Lòt Match'
                      : isFreeMode
                      ? 'Kòmanse Jwe Gratis'
                      : `Lanse Match la (${betAmount} HTG)`}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Match an kou... Alinye 5 pyon pou genyen!</span>
                <button
                  onClick={startMatch}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rekòmanse</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: In-game Live Chat & Opponent Room */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-2xl flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-sm text-white">Tchat Match la (An Dirèk)</h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                2 jwè
              </span>
            </div>

            {/* Quick Emote Reactions */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {quickEmotes.map((emote, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(emote)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/80 transition cursor-pointer whitespace-nowrap"
                >
                  {emote}
                </button>
              ))}
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs mb-3">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-xl max-w-[88%] ${
                  msg.isMe
                    ? 'ml-auto bg-amber-500 text-slate-950 font-medium rounded-tr-xs'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75 mb-0.5">
                  <span className="font-bold">{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat input */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              placeholder="Ekri opozan an..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400"
            />
            <button
              onClick={() => handleSendChat()}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
