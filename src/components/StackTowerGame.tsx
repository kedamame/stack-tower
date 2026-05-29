'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────
const BLOCK_H = 50;            // block height (px)
const INIT_W_RATIO = 0.62;     // initial block width as fraction of canvas width
const SPEED_START = 2.4;       // starting speed (px/frame)
const SPEED_STEP = 0.14;       // speed increase per block placed
const SPEED_CAP = 8.0;         // max speed
const PERFECT_PX = 5;          // ±px tolerance for PERFECT
const CAM_LERP = 0.09;         // camera easing factor
// Camera positions moving block at ~35% from top of screen
const CAM_TARGET_RATIO = 0.65; // targetCamY = blocks.length*BLOCK_H + BLOCK_H - H*ratio

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'idle' | 'playing' | 'gameover';

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type EIP6963Wallet = {
  info: { uuid: string; name: string; icon: string; rdns: string };
  provider: Eip1193Provider;
};

interface Block {
  x: number;
  w: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  life: number; // 0–50
}

interface GameState {
  phase: Phase;
  blocks: Block[];
  // moving block
  mx: number;
  mw: number;
  mdir: 1 | -1;
  speed: number;
  // camera
  camY: number;
  targetCamY: number;
  // effects
  perfectTimer: number;  // frames remaining to show PERFECT text
  particles: Particle[];
  // score
  score: number;
  // canvas dimensions
  W: number;
  H: number;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function StackTowerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  // All mutable game state in a single ref (never triggers re-renders by itself)
  const G = useRef<GameState>({
    phase: 'idle',
    blocks: [],
    mx: 0, mw: 0, mdir: 1, speed: SPEED_START,
    camY: 0, targetCamY: 0,
    perfectTimer: 0,
    particles: [],
    score: 0,
    W: 390, H: 780,
  });

  // Minimal React state – only for overlay rendering
  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [txState, setTxState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [detectedWallets, setDetectedWallets] = useState<EIP6963Wallet[]>([]);
  const [inFarcaster, setInFarcaster] = useState(false);
  const selectedProviderRef = useRef<Eip1193Provider | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const syncSize = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    G.current.W = el.clientWidth || 390;
    G.current.H = el.clientHeight || 780;
  }, []);

  // ── Start / Restart ───────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    syncSize();
    const g = G.current;
    const iw = Math.min(g.W * INIT_W_RATIO, 270);
    const ix = (g.W - iw) / 2;
    g.phase = 'playing';
    g.blocks = [{ x: ix, w: iw }];
    g.mx = ix;
    g.mw = iw;
    g.mdir = 1;
    g.speed = SPEED_START;
    g.camY = 0;
    g.targetCamY = 0;
    g.perfectTimer = 0;
    g.particles = [];
    g.score = 0;
    setPhase('playing');
    setScore(0);
    setTxState('idle');
    setTxHash(null);
  }, [syncSize]);

  // ── Tap to place ─────────────────────────────────────────────────────────
  const placeTap = useCallback(() => {
    const g = G.current;
    if (g.phase !== 'playing') return;

    const top = g.blocks[g.blocks.length - 1];
    const lo = Math.max(g.mx, top.x);
    const hi = Math.min(g.mx + g.mw, top.x + top.w);
    const overlap = hi - lo;

    if (overlap <= 0) {
      g.phase = 'gameover';
      setPhase('gameover');
      setScore(g.score);
      return;
    }

    // PERFECT check (center alignment)
    const mc = g.mx + g.mw / 2;
    const tc = top.x + top.w / 2;
    const isPerfect = Math.abs(mc - tc) <= PERFECT_PX;

    let nx: number, nw: number;
    if (isPerfect) {
      nx = top.x;
      nw = top.w;
      g.perfectTimer = 52;
    } else {
      // spawn a falling chunk for the cut-off piece
      const chunkX = g.mx < top.x ? g.mx : top.x + top.w;
      const chunkW = g.mx < top.x ? top.x - g.mx : g.mx + g.mw - (top.x + top.w);
      // Use the same Y formula as the moving block renderer
      const chunkScreenY = g.H - g.blocks.length * BLOCK_H - BLOCK_H + g.camY;
      g.particles.push({
        x: chunkX,
        y: chunkScreenY,
        vx: g.mx < top.x ? -2 : 2,
        vy: -1,
        w: chunkW,
        life: 50,
      });
      nx = lo;
      nw = overlap;
    }

    if (nw < 10) {
      g.phase = 'gameover';
      setPhase('gameover');
      setScore(g.score);
      return;
    }

    g.blocks.push({ x: nx, w: nw });
    g.score++;
    setScore(g.score);

    // Camera: keep moving block at ~35% from top
    g.targetCamY = Math.max(0, g.blocks.length * BLOCK_H + BLOCK_H - g.H * CAM_TARGET_RATIO);

    // Speed up
    g.speed = Math.min(SPEED_START + g.score * SPEED_STEP, SPEED_CAP);

    // Reset moving block to same width, centered
    g.mw = nw;
    g.mx = (g.W - nw) / 2;
    // keep current direction so it feels continuous
  }, []);

  // ── Pointer handler ───────────────────────────────────────────────────────
  const handlePointer = useCallback(() => {
    const g = G.current;
    if (g.phase === 'idle') {
      startGame();
    } else if (g.phase === 'playing') {
      placeTap();
    }
    // gameover: do nothing – restart only via "Play Again" button
    // to avoid accidental restart while reading the score
  }, [startGame, placeTap]);

  // ── Render loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loop = () => {
      const g = G.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { W, H } = g;

      // Sync canvas resolution
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }

      // ── Background ──────────────────────────────────────────────────────
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      if (g.phase === 'playing' || g.phase === 'gameover') {
        // Ease camera
        g.camY += (g.targetCamY - g.camY) * CAM_LERP;

        // ── Draw placed blocks ─────────────────────────────────────────────
        for (let i = 0; i < g.blocks.length; i++) {
          const b = g.blocks[i];
          // screenY = top-left y of the block on screen
          const sy = H - (i + 1) * BLOCK_H + g.camY;
          if (sy > H + BLOCK_H || sy + BLOCK_H < -BLOCK_H) continue;

          // Alternate between pure white and slightly dimmer white for depth
          const v = i % 2 === 0 ? 255 : 210;
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(b.x, sy, b.w, BLOCK_H - 3);
        }

        // ── Falling particle chunks ────────────────────────────────────────
        const alive: Particle[] = [];
        for (const p of g.particles) {
          if (p.life <= 0) continue;
          const alpha = (p.life / 50) * 0.85;
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fillRect(p.x, p.y, p.w, BLOCK_H - 3);
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.4; // gravity
          p.life--;
          if (p.life > 0) alive.push(p);
        }
        g.particles = alive;

        // ── Moving block ──────────────────────────────────────────────────
        if (g.phase === 'playing') {
          g.mx += g.speed * g.mdir;
          if (g.mx <= 0) { g.mx = 0; g.mdir = 1; }
          if (g.mx + g.mw >= W) { g.mx = W - g.mw; g.mdir = -1; }

          const msy = H - g.blocks.length * BLOCK_H - BLOCK_H + g.camY;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(g.mx, msy, g.mw, BLOCK_H - 3);
        }

        // ── PERFECT flash ─────────────────────────────────────────────────
        if (g.perfectTimer > 0) {
          const t = g.perfectTimer;
          const alpha = t > 40 ? 1 : t / 40;
          const scale = t > 45 ? 1 + (55 - t) * 0.02 : 1;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `900 ${Math.round(58 * scale)}px Inter,"Helvetica Neue",Arial,sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('PERFECT', W / 2, H * 0.42);
          ctx.restore();
          g.perfectTimer--;
        }

        // ── Watermark score (ghost) ────────────────────────────────────────
        if (g.phase === 'playing') {
          ctx.save();
          ctx.globalAlpha = 0.06;
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `900 ${Math.min(W * 0.38, 140)}px Inter,"Helvetica Neue",Arial,sans-serif`;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          ctx.fillText(String(g.score), W - 16, 20);
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Resize observer ───────────────────────────────────────────────────────
  useEffect(() => {
    syncSize();
    const ro = new ResizeObserver(() => syncSize());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [syncSize]);

  // ── EIP-6963 wallet scan (mount-time only – never on user click) ─────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const addWallet = (detail: EIP6963Wallet) => {
      if (!detail?.info?.uuid) return;
      setDetectedWallets(prev =>
        prev.some(w => w.info.uuid === detail.info.uuid) ? prev : [...prev, detail],
      );
    };

    const handler = (e: Event) => addWallet((e as CustomEvent).detail as EIP6963Wallet);
    window.addEventListener('eip6963:announceProvider', handler);

    // Also check legacy window.ethereum (e.g. Rabby in normal browser, not Farcaster iframe)
    const win = window as {
      ethereum?: Eip1193Provider & {
        isRabby?: boolean;
        isMetaMask?: boolean;
        isCoinbaseWallet?: boolean;
        isBraveWallet?: boolean;
      };
    };
    const legacyEth = win.ethereum;
    if (legacyEth) {
      const name = legacyEth.isRabby
        ? 'Rabby'
        : legacyEth.isCoinbaseWallet
        ? 'Coinbase Wallet'
        : legacyEth.isBraveWallet
        ? 'Brave Wallet'
        : legacyEth.isMetaMask
        ? 'MetaMask'
        : 'Injected Wallet';
      addWallet({
        info: { uuid: 'legacy-window-ethereum', name, icon: '', rdns: 'window.ethereum' },
        provider: legacyEth,
      });
    }

    return () => window.removeEventListener('eip6963:announceProvider', handler);
  }, []);

  // ── Detect Farcaster context ───────────────────────────────────────────────
  useEffect(() => {
    import('@farcaster/miniapp-sdk').then(({ sdk }) => {
      sdk.context.then(ctx => {
        if (ctx?.user?.fid) setInFarcaster(true);
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  // ── Connect wallet (shows selection modal only – no dispatch) ─────────────
  const handleConnectWallet = useCallback(() => {
    setShowWalletModal(true);
  }, []);

  // ── Connect with a specific provider ─────────────────────────────────────
  const connectWithProvider = useCallback(async (wallet: 'farcaster' | EIP6963Wallet) => {
    setShowWalletModal(false);
    setWalletConnecting(true);
    try {
      let provider: Eip1193Provider;
      if (wallet === 'farcaster') {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        const p = sdk.wallet.ethProvider;
        if (!p) throw new Error('no Farcaster provider');
        provider = p as Eip1193Provider;
      } else {
        provider = wallet.provider;
      }
      selectedProviderRef.current = provider;
      const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts[0]) setWalletAddress(accounts[0] as string);
    } catch (err) {
      console.error(err);
    } finally {
      setWalletConnecting(false);
    }
  }, []);

  // ── Record score on-chain ─────────────────────────────────────────────────
  const handleRecordScore = useCallback(async () => {
    if (txState !== 'idle' && txState !== 'error') return;
    setTxState('pending');
    try {
      const provider = selectedProviderRef.current;
      if (!provider) throw new Error('no wallet');

      // Switch to Base mainnet (chainId 8453 = 0x2105)
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }],
        });
      } catch { /* already on Base or wallet handles it */ }

      const { createWalletClient, custom } = await import('viem');
      const { base } = await import('viem/chains');
      const { DATA_SUFFIX } = await import('@/lib/attribution');
      const { CONTRACT_ADDRESS, LEADERBOARD_ABI } = await import('@/lib/contract');

      const walletClient = createWalletClient({
        chain: base,
        transport: custom(provider as Parameters<typeof custom>[0]),
        dataSuffix: DATA_SUFFIX,
      });

      const address = (walletAddress ?? (await walletClient.getAddresses())[0]) as `0x${string}`;
      const hash = await walletClient.writeContract({
        account: address,
        address: CONTRACT_ADDRESS,
        abi: LEADERBOARD_ABI,
        functionName: 'submitScore',
        args: [BigInt(G.current.score)],
      });

      setTxHash(hash);
      setTxState('success');
    } catch (err) {
      console.error(err);
      setTxState('error');
    }
  }, [txState, walletAddress]);

  // ── Share on Farcaster ────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const s = G.current.score;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
    const shareUrl = appUrl ? `${appUrl}/share?score=${s}` : '';
    try {
      const { sdk } = await import('@farcaster/miniapp-sdk');
      await sdk.actions.composeCast({
        text: `I stacked ${s} blocks in Stack Tower! Can you beat me?`,
        embeds: shareUrl ? [shareUrl] : [],
      });
    } catch {
      // not in Farcaster or user closed
    }
  }, []);

  // ─── Styles (inline, INNOCEAN-inspired: bold editorial B&W) ──────────────
  const font = `Inter,"Helvetica Neue",Arial,sans-serif`;
  const label: React.CSSProperties = {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.14em',
    fontFamily: font,
    textTransform: 'uppercase' as const,
    marginBottom: 16,
  };
  const pillBtn = (filled: boolean): React.CSSProperties => ({
    padding: '14px 36px',
    border: `1.5px solid ${filled ? '#fff' : 'rgba(255,255,255,0.45)'}`,
    borderRadius: 9999,
    background: filled ? '#fff' : 'transparent',
    color: filled ? '#000' : '#fff',
    fontSize: 15,
    fontWeight: 700,
    fontFamily: font,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    WebkitTapHighlightColor: 'transparent',
  });

  return (
    <div
      ref={wrapRef}
      style={{
        width: '100%',
        height: '100dvh',
        position: 'relative',
        background: '#000',
        overflow: 'hidden',
        touchAction: 'none',
      }}
      onPointerDown={handlePointer}
    >
      {/* Canvas – full size game rendering */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* ── IDLE overlay ─────────────────────────────────────────────────── */}
      {phase === 'idle' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 36px 64px',
          pointerEvents: 'none',
        }}>
          {/* Top label */}
          <div style={{ position: 'absolute', top: 28, left: 36 }}>
            <span style={label}>Mini Game</span>
          </div>

          {/* Hero title */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            marginBottom: 24,
          }}>
            <h1 style={{
              color: '#fff',
              fontSize: 'clamp(76px, 21vw, 120px)',
              fontWeight: 900,
              lineHeight: 0.88,
              fontFamily: font,
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              STACK<br />TOWER
            </h1>
          </div>

          {/* Subtitle */}
          <p style={{
            color: 'rgba(255,255,255,0.42)',
            fontSize: 15,
            fontFamily: font,
            lineHeight: 1.65,
            marginBottom: 40,
            maxWidth: 280,
          }}>
            Tap to drop each block.<br />
            Stack as high as you can.
          </p>

          {/* CTA button */}
          <div style={{ pointerEvents: 'all' }}>
            <button
              style={pillBtn(false)}
              onPointerDown={(e) => { e.stopPropagation(); startGame(); }}
            >
              Start Playing
            </button>
          </div>
        </div>
      )}

      {/* ── PLAYING overlay (score only) ──────────────────────────────────── */}
      {phase === 'playing' && (
        <div style={{
          position: 'absolute', top: 28, left: 36,
          pointerEvents: 'none',
        }}>
          <div style={label}>Score</div>
          <div style={{
            color: '#fff',
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1,
            fontFamily: font,
          }}>
            {score}
          </div>
        </div>
      )}

      {/* ── WALLET SELECTION MODAL ───────────────────────────────────────── */}
      {showWalletModal && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '0 28px 60px',
            zIndex: 20,
          }}
          onPointerDown={(e) => { e.stopPropagation(); setShowWalletModal(false); }}
        >
          <div
            style={{
              background: '#111',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              padding: '24px 20px',
              display: 'flex', flexDirection: 'column', gap: 0,
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div style={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              fontFamily: font, textTransform: 'uppercase' as const,
              marginBottom: 20,
            }}>
              Select Wallet
            </div>

            {/* Farcaster Wallet – only shown inside Warpcast */}
            {inFarcaster && <button
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'transparent',
                border: 'none',
                borderBottom: detectedWallets.length > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                padding: '14px 0',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left' as const,
                WebkitTapHighlightColor: 'transparent',
              }}
              onPointerDown={(e) => { e.stopPropagation(); connectWithProvider('farcaster'); }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#7c65c1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 1000 1000" fill="none">
                  <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z" fill="white"/>
                  <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" fill="white"/>
                  <path d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.444H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z" fill="white"/>
                </svg>
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: font }}>
                  Farcaster Wallet
                </div>
                <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, fontFamily: font, marginTop: 2 }}>
                  Built-in
                </div>
              </div>
            </button>}

            {/* EIP-6963 / window.ethereum detected wallets */}
            {detectedWallets.map((wallet, i) => (
              <button
                key={wallet.info.uuid}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: i < detectedWallets.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  padding: '14px 0',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left' as const,
                  WebkitTapHighlightColor: 'transparent',
                }}
                onPointerDown={(e) => { e.stopPropagation(); connectWithProvider(wallet); }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  overflow: 'hidden', flexShrink: 0,
                  background: '#222',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {wallet.info.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={wallet.info.icon} alt={wallet.info.name} width={40} height={40} style={{ display: 'block' }} />
                  ) : (
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{wallet.info.name[0]}</div>
                  )}
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: font }}>
                    {wallet.info.name}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, fontFamily: font, marginTop: 2 }}>
                    {wallet.info.rdns}
                  </div>
                </div>
              </button>
            ))}

            {/* No wallets found notice */}
            {!inFarcaster && detectedWallets.length === 0 && (
              <div style={{
                color: 'rgba(255,255,255,0.38)',
                fontSize: 13, fontFamily: font,
                padding: '14px 0',
                lineHeight: 1.6,
              }}>
                No wallets detected.{'\n'}Install Rabby or MetaMask extension and reload.
              </div>
            )}

            {/* Cancel */}
            <button
              style={{
                marginTop: 16,
                padding: '14px 0',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 9999,
                color: 'rgba(255,255,255,0.55)',
                fontSize: 14,
                fontFamily: font,
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
              onPointerDown={(e) => { e.stopPropagation(); setShowWalletModal(false); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── GAME OVER overlay ────────────────────────────────────────────── */}
      {phase === 'gameover' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 36px 64px',
          background: 'rgba(0,0,0,0.72)',
          pointerEvents: 'all',
        }}>
          <div style={{ position: 'absolute', top: 28, left: 36 }}>
            <span style={label}>Game Over</span>
          </div>

          {/* Disconnect wallet */}
          {walletAddress && (
            <div style={{ position: 'absolute', top: 24, right: 36, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, fontFamily: font, letterSpacing: '0.06em' }}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 9999,
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: 11,
                  fontFamily: font,
                  padding: '4px 10px',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setWalletAddress(null);
                  setTxState('idle');
                  setTxHash(null);
                  selectedProviderRef.current = null;
                }}
              >
                Disconnect
              </button>
            </div>
          )}

          {/* Big score */}
          <div style={{ marginBottom: 8 }}>
            <span style={label}>Final Score</span>
            <div style={{
              color: '#fff',
              fontSize: 'clamp(96px, 26vw, 160px)',
              fontWeight: 900,
              lineHeight: 0.85,
              fontFamily: font,
              letterSpacing: '-0.03em',
            }}>
              {score}
            </div>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.38)',
            fontSize: 16,
            fontFamily: font,
            marginBottom: 44,
          }}>
            blocks stacked
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              style={pillBtn(true)}
              onPointerDown={(e) => { e.stopPropagation(); startGame(); }}
            >
              Play Again
            </button>
            <button
              style={pillBtn(false)}
              onPointerDown={(e) => { e.stopPropagation(); handleShare(); }}
            >
              Share Score
            </button>
          </div>

          {/* On-chain record – only shown when contract is deployed */}
          {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && (
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Step 1: Connect wallet */}
              {!walletAddress && txState === 'idle' && (
                <button
                  style={{
                    ...pillBtn(false),
                    opacity: walletConnecting ? 0.55 : 1,
                    pointerEvents: walletConnecting ? 'none' : 'auto',
                  }}
                  onPointerDown={(e) => { e.stopPropagation(); handleConnectWallet(); }}
                >
                  {walletConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}

              {/* Step 2: Record score */}
              {walletAddress && txState !== 'success' && (
                <button
                  style={{
                    ...pillBtn(false),
                    opacity: txState === 'pending' ? 0.55 : 1,
                    pointerEvents: txState === 'pending' ? 'none' : 'auto',
                  }}
                  onPointerDown={(e) => { e.stopPropagation(); handleRecordScore(); }}
                >
                  {txState === 'idle' && 'Record On-Chain'}
                  {txState === 'pending' && 'Recording...'}
                  {txState === 'error' && 'Failed — Retry'}
                </button>
              )}

              {/* Success */}
              {txState === 'success' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: 13,
                    fontFamily: font,
                    letterSpacing: '0.08em',
                  }}>
                    Score recorded on Base
                  </span>
                  {txHash && (
                    <button
                      style={{ ...pillBtn(false), fontSize: 13 }}
                      onPointerDown={async (e) => {
                        e.stopPropagation();
                        try {
                          const { sdk } = await import('@farcaster/miniapp-sdk');
                          await sdk.actions.openUrl(`https://basescan.org/tx/${txHash}`);
                        } catch {}
                      }}
                    >
                      View on Basescan
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
