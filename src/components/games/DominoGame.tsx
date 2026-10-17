import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Zap, AlertCircle, Sparkles } from 'lucide-react';

type DominoTile = [number, number];

// Full Double-Six Domino Set (28 tiles)
const ALL_DOMINO_TILES: DominoTile[] = [
  [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
  [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
  [3, 3], [3, 4], [3, 5], [3, 6],
  [4, 4], [4, 5], [4, 6],
  [5, 5], [5, 6],
  [6, 6],
];

export const DominoGame: React.FC = () => {
  const { user, updateUser, addTransaction, addNotification, setActiveGame, showToast, language } = useApp();

  const [betAmount, setBetAmount] = useState<number>(100);
  const [isFreeMode, setIsFreeMode] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Player and opponent hands
  const [playerHand, setPlayerHand] = useState<DominoTile[]>([]);
  const [opponentHand, setOpponentHand] = useState<DominoTile[]>([]);
  const [boneyard, setBoneyard] = useState<DominoTile[]>([]);

  // Domino Board (chain of placed dominoes)
  const [boardChain, setBoardChain] = useState<{ tile: DominoTile; leftVal: number; rightVal: number }[]>([]);
  const [turn, setTurn] = useState<'player' | 'opponent'>('player');
  const [winner, setWinner] = useState<'player' | 'opponent' | 'blocked' | null>(null);

  const opponentName = 'Mackenson (Pétion-Ville)';

  // Shuffle & Deal 7 tiles each
  const dealGame = () => {
    if (!isFreeMode && user.balanceHTG < betAmount) {
      showToast('Balans ou pa ase pou miz sa a. Fè yon depo rapid!', 'error');
      return;
    }

    if (!isFreeMode) {
      updateUser({ balanceHTG: user.balanceHTG - betAmount });
      addTransaction({
        type: 'bet_placed',
        amountHTG: betAmount,
        referenceNumber: 'BET-DOMINO-' + Math.floor(1000 + Math.random() * 9000),
        status: 'completed',
        description: `Miz ${betAmount} HTG sou Domino Double-Sis`,
      });
    }

    const shuffled = [...ALL_DOMINO_TILES].sort(() => Math.random() - 0.5);
    const pHand = shuffled.slice(0, 7);
    const oHand = shuffled.slice(7, 14);
    const yard = shuffled.slice(14);

    // Starting tile: Double-6 or highest double
    let firstTile: DominoTile = [6, 6];
    let startHand = 'player';

    if (pHand.some(([a, b]) => a === 6 && b === 6)) {
      startHand = 'player';
      firstTile = [6, 6];
      // remove from hand
      const idx = pHand.findIndex(([a, b]) => a === 6 && b === 6);
      pHand.splice(idx, 1);
    } else if (oHand.some(([a, b]) => a === 6 && b === 6)) {
      startHand = 'opponent';
      firstTile = [6, 6];
      const idx = oHand.findIndex(([a, b]) => a === 6 && b === 6);
      oHand.splice(idx, 1);
    } else {
      // Pick first from boneyard
      firstTile = yard.pop() || [5, 5];
    }

    setPlayerHand(pHand);
    setOpponentHand(oHand);
    setBoneyard(yard);
    setBoardChain([{ tile: firstTile, leftVal: firstTile[0], rightVal: firstTile[1] }]);
    setTurn(startHand === 'player' ? 'opponent' : 'player');
    setWinner(null);
    setGameStarted(true);

    showToast(
      `Jwèt la kòmanse ak ${firstTile[0]}-${firstTile[1]} sou tab la!`,
      'info'
    );
  };

  // Get current left and right ends of the board
  const getBoardEnds = (): [number, number] => {
    if (boardChain.length === 0) return [0, 0];
    const left = boardChain[0].leftVal;
    const right = boardChain[boardChain.length - 1].rightVal;
    return [left, right];
  };

  // Check if tile can be played
  const canPlayTile = (tile: DominoTile): { canPlay: boolean; side: 'left' | 'right' | 'both' } => {
    if (boardChain.length === 0) return { canPlay: true, side: 'both' };
    const [leftEnd, rightEnd] = getBoardEnds();
    const [t1, t2] = tile;

    const matchesLeft = t1 === leftEnd || t2 === leftEnd;
    const matchesRight = t1 === rightEnd || t2 === rightEnd;

    if (matchesLeft && matchesRight) return { canPlay: true, side: 'both' };
    if (matchesLeft) return { canPlay: true, side: 'left' };
    if (matchesRight) return { canPlay: true, side: 'right' };
    return { canPlay: false, side: 'left' };
  };

  // Player plays a tile
  const handlePlayTile = (tile: DominoTile, preferredSide: 'left' | 'right' = 'right') => {
    if (!gameStarted || turn !== 'player' || winner !== null) return;

    const check = canPlayTile(tile);
    if (!check.canPlay) {
      showToast('Pyès sa a pa ka antre nan okenn bout tab la!', 'error');
      return;
    }

    const sideToPlay = check.side === 'both' ? preferredSide : check.side;
    const [leftEnd, rightEnd] = getBoardEnds();
    const [t1, t2] = tile;

    let newChain = [...boardChain];

    if (sideToPlay === 'left') {
      const matchVal = leftEnd;
      const otherVal = t1 === matchVal ? t2 : t1;
      newChain.unshift({ tile, leftVal: otherVal, rightVal: matchVal });
    } else {
      const matchVal = rightEnd;
      const otherVal = t1 === matchVal ? t2 : t1;
      newChain.push({ tile, leftVal: matchVal, rightVal: otherVal });
    }

    const newHand = playerHand.filter(t => !(t[0] === tile[0] && t[1] === tile[1]));
    setPlayerHand(newHand);
    setBoardChain(newChain);

    // Check if player won
    if (newHand.length === 0) {
      setWinner('player');
      handleWinPayout();
      return;
    }

    setTurn('opponent');
  };

  // Opponent AI turn
  useEffect(() => {
    if (gameStarted && turn === 'opponent' && winner === null) {
      const timer = setTimeout(() => {
        handleOpponentTurn();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [turn, gameStarted, winner]);

  const handleOpponentTurn = () => {
    const [leftEnd, rightEnd] = getBoardEnds();

    // Look for playable tile
    const playable = opponentHand.find(tile => {
      const c = canPlayTile(tile);
      return c.canPlay;
    });

    if (playable) {
      const check = canPlayTile(playable);
      const sideToPlay = check.side === 'both' ? 'right' : check.side;
      const [t1, t2] = playable;

      let newChain = [...boardChain];
      if (sideToPlay === 'left') {
        const matchVal = leftEnd;
        const otherVal = t1 === matchVal ? t2 : t1;
        newChain.unshift({ tile: playable, leftVal: otherVal, rightVal: matchVal });
      } else {
        const matchVal = rightEnd;
        const otherVal = t1 === matchVal ? t2 : t1;
        newChain.push({ tile: playable, leftVal: matchVal, rightVal: otherVal });
      }

      const newOHand = opponentHand.filter(t => !(t[0] === playable[0] && t[1] === playable[1]));
      setOpponentHand(newOHand);
      setBoardChain(newChain);

      if (newOHand.length === 0) {
        setWinner('opponent');
        showToast(`${opponentName} poze tout pyès li yo epi li genyen!`, 'info');
        return;
      }

      setTurn('player');
    } else {
      // Opponent passes / draws
      if (boneyard.length > 0) {
        const draw = boneyard[0];
        setBoneyard(boneyard.slice(1));
        setOpponentHand([...opponentHand, draw]);
        showToast(`${opponentName} pioch yon pyès!`, 'info');
        setTurn('player');
      } else {
        showToast(`${opponentName} di "M PASE"! Se kou pa w.`, 'info');
        setTurn('player');
      }
    }
  };

  // Player draw from boneyard
  const handlePlayerDraw = () => {
    if (boneyard.length === 0) {
      // Check if board blocked (Fèmen)
      showToast('Pa gen pyès ankò nan pioch la! Ou pase tou.', 'info');
      setTurn('opponent');
      return;
    }

    const drawn = boneyard[0];
    setBoneyard(boneyard.slice(1));
    setPlayerHand([...playerHand, drawn]);
    showToast(`Ou rale yon pyès [${drawn[0]}|${drawn[1]}]!`, 'info');
  };

  const handleWinPayout = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    if (!isFreeMode) {
      const prizeHTG = Math.floor(betAmount * 1.95);
      updateUser({
        balanceHTG: user.balanceHTG + prizeHTG,
        points: user.points + 50,
      });

      addTransaction({
        type: 'bet_won',
        amountHTG: prizeHTG,
        referenceNumber: 'WIN-DOMINO-' + Math.floor(1000 + Math.random() * 9000),
        status: 'completed',
        description: `Viktwa Domino Ayisyen (+${prizeHTG} HTG)`,
      });

      addNotification(
        'Viktwa Sou Domino Lakay! 🎉',
        `Ou bwòch opozan an epi ou touche ${prizeHTG.toLocaleString()} HTG sou kont ou!`,
        'game'
      );

      showToast(`BWÒCH! Ou ranpòte ${prizeHTG.toLocaleString()} HTG sou tab la! 🎉`, 'success');
    } else {
      updateUser({ points: user.points + 30 });
      showToast('Bravo! Ou ranpòte jwèt domino a gratis (+30 Pwen)!', 'success');
    }
  };

  // Render a domino tile visual
  const renderTile = (tile: DominoTile, isVertical = true) => {
    const [t1, t2] = tile;
    return (
      <div
        className={`bg-amber-50 text-slate-950 font-black rounded-lg border-2 border-slate-900 shadow-md flex ${
          isVertical ? 'flex-col w-9 h-16' : 'flex-row w-16 h-9'
        } items-center justify-between p-1 select-none`}
      >
        <span className="text-xs leading-none font-mono">{t1}</span>
        <div className={`${isVertical ? 'w-full h-0.5' : 'h-full w-0.5'} bg-slate-900/60`} />
        <span className="text-xs leading-none font-mono">{t2}</span>
      </div>
    );
  };

  const [leftEnd, rightEnd] = getBoardEnds();

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveGame(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retounen nan tout jwèt yo</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
            Domino Ayisyen (Double-Sis)
          </span>
        </div>
      </div>

      {/* Main Domino Board */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
        {/* Opponent Hand Display */}
        <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center">
              🇭🇹
            </div>
            <div>
              <div className="font-bold text-xs text-white">{opponentName}</div>
              <div className="text-[10px] text-slate-400">
                {gameStarted ? `${opponentHand.length} pyès nan men l` : 'Opozan prè'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {opponentHand.map((_, i) => (
              <div key={i} className="w-4 h-7 rounded bg-slate-800 border border-slate-700" />
            ))}
          </div>
        </div>

        {/* The Green Felt Domino Table */}
        <div className="min-h-[220px] bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl border-4 border-amber-900/50 p-4 shadow-inner flex flex-col justify-between overflow-x-auto relative">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-2">
            <span>Bout Gòch: [{leftEnd}]</span>
            <span className="text-[11px] uppercase tracking-wider text-amber-300">
              {turn === 'player' ? '● Kou pa w pou w jwe!' : '● Mackenson ap reflechi...'}
            </span>
            <span>Bout Dwat: [{rightEnd}]</span>
          </div>

          {/* Placed dominoes chain */}
          <div className="flex items-center gap-2 overflow-x-auto py-4 px-2 no-scrollbar justify-start sm:justify-center">
            {boardChain.length === 0 ? (
              <div className="text-center text-emerald-200/60 text-xs py-8 w-full">
                Peze &quot;Lanse Jwèt la&quot; pou kòmanse tab Domino Lakay la!
              </div>
            ) : (
              boardChain.map((item, idx) => (
                <div key={idx} className="shrink-0 transition-all hover:scale-105">
                  {renderTile([item.leftVal, item.rightVal], false)}
                </div>
              ))
            )}
          </div>

          {/* Board status / winner */}
          {winner && (
            <div className="bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-amber-400 text-center text-amber-300 font-black text-sm">
              {winner === 'player' ? '🏆 OU GENYEN! Felisitasyon!' : `${opponentName} genyen match la!`}
            </div>
          )}
        </div>

        {/* Player Controls & Domino Hand */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Pyès nan Men w:</span>
              <span className="text-xs text-amber-400 font-black">({playerHand.length} pyès)</span>
            </div>

            {gameStarted && turn === 'player' && !winner && (
              <button
                onClick={handlePlayerDraw}
                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                Pioch / Pase ({boneyard.length} rete)
              </button>
            )}
          </div>

          {/* Dominoes in player hand */}
          <div className="flex flex-wrap gap-2.5 items-center justify-center min-h-[70px] p-2 bg-slate-900 rounded-xl border border-slate-800">
            {playerHand.length === 0 && gameStarted ? (
              <div className="text-xs text-emerald-400 font-bold">Ou pa gen pyès ankò! Ou ranpòte tab la!</div>
            ) : (
              playerHand.map((tile, idx) => {
                const check = canPlayTile(tile);

                return (
                  <div key={idx} className="relative group">
                    <button
                      disabled={!check.canPlay || turn !== 'player' || winner !== null}
                      onClick={() => handlePlayTile(tile, 'right')}
                      className={`transition-transform cursor-pointer ${
                        check.canPlay && turn === 'player' && !winner
                          ? 'ring-2 ring-emerald-400 hover:scale-110 active:scale-95'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {renderTile(tile, true)}
                    </button>
                    {check.canPlay && check.side === 'both' && turn === 'player' && !winner && (
                      <div className="absolute -top-7 left-0 right-0 flex justify-between gap-1 opacity-0 group-hover:opacity-100 transition text-[9px] bg-slate-950 px-1 py-0.5 rounded border border-slate-700">
                        <button
                          type="button"
                          onClick={() => handlePlayTile(tile, 'left')}
                          className="text-sky-400 font-bold hover:underline"
                        >
                          Gòch
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePlayTile(tile, 'right')}
                          className="text-amber-400 font-bold hover:underline"
                        >
                          Dwat
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Launch & Bet setting */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFreeMode(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  !isFreeMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Miz an Goud
              </button>
              <button
                type="button"
                onClick={() => setIsFreeMode(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isFreeMode ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Jwe Gratis
              </button>

              {!isFreeMode && (
                <div className="flex flex-wrap items-center gap-1">
                  {[5, 10, 25, 50, 100, 250, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBetAmount(amt)}
                      className={`px-2 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                        betAmount === amt ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                  <span className="text-xs text-amber-400 font-bold ml-1">HTG</span>
                </div>
              )}
            </div>

            <button
              onClick={dealGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-950/40 flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>
                {gameStarted
                  ? 'Rekòmanse Yon Lòt Men'
                  : isFreeMode
                  ? 'Kòmanse Jwe Gratis'
                  : `Lanse Domino (${betAmount} HTG)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
