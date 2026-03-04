import { useState, useEffect, useCallback, useRef } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import Terminal from '@/components/terminal/Terminal';
import Dossier from '@/components/dossier/Dossier';

const CONTRACT_ADDRESS = '0x3d3fE113F3Ed24C6172482894579BbFb6d870EA9';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [nodeId, setNodeId] = useState('');
  const [stage, setStage] = useState<'start' | 'hacking' | 'intercepted' | 'dossier' | 'web3' | 'finish'>('start');
  const [dossier, setDossier] = useState<any>(null);
  const lastPlayedRef = useRef<string | null>(null);
  
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash,
    query: {
      enabled: !!hash,
      staleTime: 0
    }
  });

  const isAlert = ['intercepted', 'dossier', 'web3', 'finish'].includes(stage);

  const playSfx = useCallback((file: string, vol = 0.25) => {
    const audio = new Audio(`/sfx/${file}`);
    audio.volume = vol;
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    setMounted(true);
    setNodeId(Math.random().toString(16).slice(2, 6).toUpperCase());
  }, []);

  useEffect(() => {
    if (isSuccess && stage !== 'finish') {
      setStage('finish');
      playSfx('success.mp3', 0.3);
    }
  }, [isSuccess, stage, playSfx]);

  if (!mounted) return null;

  const handleStart = () => {
    playSfx('click.wav', 0.3);
    setStage('hacking');
  };

  const handleHackingFinished = async (logs: any[]) => {
    if (stage === 'intercepted' || lastPlayedRef.current === 'alarm') return;
    setStage('intercepted');
    lastPlayedRef.current = 'alarm';
    playSfx('alarm.wav', 0.15);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      });
      const data = await response.json();
      setTimeout(() => {
        setDossier(data);
        setStage('dossier');
        playSfx('scan.mp3', 0.2);
        lastPlayedRef.current = null; 
      }, 6500); 
    } catch (error) { 
      lastPlayedRef.current = null;
      setStage('start'); 
    }
  };

  const handleMint = async (userDecision: string) => {
    if (!isConnected || !dossier) {
      setStage('web3');
      return;
    }
    playSfx('click.wav', 0.2);
    try {
      const am: any = { stay: 'CORPORATE', rebel: 'ANTI-SYSTEM', escape: 'NEUTRAL' };
      const finalAlignment = am[userDecision] || dossier.moral_alignment;

      const params = new URLSearchParams({
        aggression: String(dossier.aggression_index || dossier.aggression || 0),
        loyalty: String(dossier.loyalty_probability || dossier.loyalty || 0),
        risk: String(dossier.risk_tolerance || dossier.risk || 0),
        anomaly: String(dossier.anomaly_score || dossier.anomaly || 0),
        alignment: finalAlignment,
        summary: dossier.summary || ""
      });

      const res = await fetch(`/api/metadata?${params.toString()}`);
      const metaData = await res.json();
      const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metaData)).toString('base64')}`;
      
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: parseAbi(['function mintIdentity(address to, string memory uri) public']),
        functionName: 'mintIdentity',
        args: [address as `0x${string}`, tokenURI],
      });
    } catch (e) { 
      console.error(e); 
    }
  };

  return (
    <main className={`relative min-h-screen w-full flex flex-col p-4 md:p-8 overflow-hidden select-none crt-overlay transition-all duration-1000 ${
      isAlert ? 'bg-[#030303] text-void-red font-corporate' : 'bg-[#0a0a0b] text-void-cyan font-hacker'
    }`}>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isAlert ? 'opacity-40 red-alert-bg' : 'opacity-10 bg-grid'}`} />
      <div className="scanline pointer-events-none" />

      <div className={`flex justify-between items-start border-b-4 pb-6 z-50 relative ${isAlert ? 'border-void-red shadow-[0_0_40px_rgba(255,0,0,0.2)]' : 'border-void-cyan/30'}`}>
        <div className="flex flex-col gap-2 font-black uppercase tracking-widest">
          <p className={`px-4 py-1 ${isAlert ? 'bg-void-red text-black animate-pulse' : 'bg-void-cyan text-black'}`}>
            {isAlert ? 'SYSTEM_OVERRIDE' : 'ACTIVE_BREACH'}
          </p>
          <div className="opacity-40 text-[9px]">NODE_0x{nodeId} // {isConnected ? 'LINK_SECURED' : 'ANON_SUBJECT'}</div>
        </div>
        <div className="text-right">
           <ConnectButton.Custom>
             {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted: rainMounted }) => {
               const ready = rainMounted;
               const connected = ready && account && chain;
               return (
                 <div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
                   {(() => {
                     if (!connected) {
                       return (
                         <button onClick={openConnectModal} className={`px-8 py-2 border-2 font-black hover:bg-white hover:text-black transition-all ${isAlert ? 'border-void-red text-void-red' : 'border-void-cyan text-void-cyan'}`}>
                           AUTH_CONNECT
                         </button>
                       );
                     }
                     return (
                       <button onClick={openAccountModal} className={`px-8 py-2 border-2 font-black hover:bg-white hover:text-black transition-all ${isAlert ? 'border-void-red text-void-red' : 'border-void-cyan text-void-cyan'}`}>
                         {account.displayName.toUpperCase()}
                       </button>
                     );
                   })()}
                 </div>
               );
             }}
           </ConnectButton.Custom>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-20">
        {stage === 'start' && (
          <div className="text-center animate-in fade-in duration-1000">
            <h1 className="text-[14vw] font-black tracking-tighter uppercase leading-none text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.1)]">
              VOID<span className="text-void-cyan italic">_SYN</span>
            </h1>
            <button 
              onClick={handleStart}
              className="mt-12 bg-white text-black px-24 py-10 text-4xl font-black uppercase hover:bg-void-cyan transition-all shadow-[15px_15px_0_#050505] italic"
            >
              INITIALIZE_BREACH
            </button>
          </div>
        )}

        {stage === 'hacking' && <div className="z-10 w-full flex justify-center p-4 animate-in fade-in duration-500"><Terminal onFinished={handleHackingFinished} /></div>}

        {stage === 'intercepted' && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-corporate overflow-hidden vignette">
             <div className="relative z-10 text-center animate-traced-sss scale-110 md:scale-100">
                <h2 className="text-void-red text-[18vw] font-black tracking-tighter uppercase leading-none italic drop-shadow-[0_0_100px_#ff0000]">TRACED</h2>
                <div className="max-w-xl mx-auto mt-12 space-y-8 px-6">
                  <div className="h-8 w-full bg-void-red/10 border-4 border-void-red/40 p-1">
                    <div className="h-full bg-void-red animate-crunch shadow-[0_0_40px_#ff0000]" />
                  </div>
                  <p className="text-void-red text-2xl font-black tracking-[1em] animate-pulse uppercase italic">Targeting_Subject</p>
                </div>
             </div>
          </div>
        )}

        {stage === 'dossier' && dossier && <Dossier data={dossier} onMint={(choice: string) => handleMint(choice)} />}

        {stage === 'web3' && (
          <div className="z-10 text-center animate-in zoom-in duration-500 font-black">
            <div className="border-[15px] border-void-red p-12 md:p-20 bg-black shadow-[0_0_200px_rgba(255,0,0,0.4)]">
              <h2 className="text-5xl md:text-7xl uppercase text-white mb-16 tracking-tighter italic leading-none">CONFIRM_ID</h2>
              <div className="flex justify-center mb-16 scale-125 md:scale-150">
                <ConnectButton />
              </div>
              <button onClick={() => { playSfx('click.wav', 0.2); setStage('dossier'); }} className="text-void-red border-b-2 border-void-red pb-1 uppercase text-lg mt-8">Return to Dossier</button>
            </div>
          </div>
        )}

        {(isConfirming || stage === 'finish') && (
          <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center text-black font-black p-10 animate-in fade-in duration-1000">
             <h2 className="text-[15vw] uppercase italic tracking-tighter leading-none animate-pulse">
                {stage === 'finish' ? 'SECURED' : 'UPLOADING'}
             </h2>
             {stage === 'finish' && (
               <button 
                onClick={() => window.location.reload()} 
                className="mt-20 border-[10px] border-black px-24 py-10 text-5xl hover:bg-black hover:text-white transition-all uppercase italic"
               >
                 CLOSE_SESSION
               </button>
             )}
          </div>
        )}
      </div>
    </main>
  );
}
