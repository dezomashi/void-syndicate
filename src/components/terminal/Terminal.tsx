import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Terminal({ onFinished }: { onFinished: (logs: any[]) => void }) {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>(['[ONLINE] VOID_BREACH_PROTOCOL v.1.0.4', 'Establishing secure tunnel...', 'Target: VOID_SYNDICATE_MAIN_FRAME', '---']);
  const [history, setHistory] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = input.trim().toUpperCase();
    if (!val) return;

    const newAction = { timestamp: Date.now(), cmd: val };
    const newHistory = [...history, newAction];
    
    setHistory(newHistory);
    setLogs(prev => [...prev, `> ${val}`, `Executing: ${val}...`, 'ACCESS_GRANTED_LAYER_DELTA', '---']);
    setInput('');

    if (newHistory.length >= 4) {
      setLogs(prev => [...prev, 'CRITICAL_ERROR: UPLINK_COMPROMISED', 'TRACING_ROUTE...']);
      setTimeout(() => onFinished(newHistory), 1000);
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="w-full max-w-4xl aspect-video bg-black/90 border-2 border-void-cyan shadow-[0_0_40px_rgba(0,240,255,0.2)] relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      <div className="flex justify-between items-center px-4 py-2 border-b border-void-cyan/30 bg-void-cyan/10">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-void-cyan animate-pulse" />
          <span className="text-[10px] text-void-cyan font-bold tracking-[0.2em]">REMOTE_SESSION_ACTIVE</span>
        </div>
        <span className="text-[10px] text-void-cyan/50 uppercase">Port: 8080 // Encryption: AES-256</span>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto font-mono text-sm md:text-base text-void-cyan/80 scrollbar-hide">
        {logs.map((log, i) => (
          <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="mb-1 leading-relaxed">
            <span className="text-void-cyan/30 mr-3 inline-block w-8">{i}</span>
            {log}
          </motion.p>
        ))}
        <form onSubmit={handleSubmit} className="flex mt-4 items-center">
          <span className="text-void-cyan mr-3 font-bold">{'>'}</span>
          <input 
            autoFocus 
            className="bg-transparent outline-none flex-1 text-void-cyan caret-void-cyan uppercase placeholder:text-void-cyan/20"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="AWAITING_INPUT..."
            spellCheck={false}
          />
        </form>
      </div>
      
      <div className="p-2 bg-void-cyan/5 border-t border-void-cyan/20 flex justify-between text-[9px] text-void-cyan/40 px-4">
        <span>MEM_ALLOC: 44.2%</span>
        <span>NODE_ID: {Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
      </div>
    </div>
  );
}
