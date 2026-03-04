import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dossier({ data, onMint }: any) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [choice, setChoice] = useState<'stay' | 'rebel' | 'escape' | null>(null);

  const stats = [
    { label: 'AGGRESSION', value: data.aggression_index || 0 },
    { label: 'LOYALTY', value: data.loyalty_probability || 0 },
    { label: 'RISK_LVL', value: data.risk_tolerance || 0 },
    { label: 'ANOMALY', value: data.anomaly_score || 0 },
  ];

  const handleFinalAction = (type: 'stay' | 'rebel' | 'escape') => {
    setChoice(type);
    setIsPreparing(true);
    setTimeout(() => {
      onMint(type);
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-50 w-full max-w-5xl bg-[#050505] border-2 border-void-red/40 shadow-[0_0_80px_rgba(255,0,0,0.2)] font-corporate flex flex-col max-h-[92vh] overflow-y-auto lg:overflow-visible"
    >
      <div className="absolute inset-0 w-full h-[1px] bg-void-red/20 animate-[scanline_6s_linear_infinite] pointer-events-none z-10" />

      <div className="p-4 md:p-8 relative flex-1">
        <div className="flex justify-between items-start border-b border-void-red/20 pb-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="w-1 h-10 bg-void-red shadow-[0_0_15px_#ff0000]" />
            <div>
              <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                NEURAL <span className="text-void-red italic">DOSSIER</span>
              </h2>
              <div className="flex gap-3 mt-1 text-[8px] font-bold text-white/30 tracking-[0.3em] uppercase">
                <span>STATUS: {data.moral_alignment}</span>
                <span>//</span>
                <span>NODE: {Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block border-l border-void-red/20 pl-4 text-right">
             <div className="text-xl font-black text-white leading-none">IDENTIFIED</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={stat.label} className="bg-white/[0.02] p-3 border border-white/5">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[8px] font-bold text-white/40 tracking-widest">{stat.label}</span>
                    <span className="text-sm md:text-lg font-black text-void-red">{stat.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-black relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                      className="h-full bg-void-red shadow-[0_0:10px_#ff0000]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="relative border-l-4 border-void-red p-4 bg-void-red/[0.02]">
               <p className="text-lg md:text-2xl font-bold leading-tight text-white/90 italic tracking-tight uppercase">
                "{data.summary}"
               </p>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-full aspect-[2/1] lg:aspect-square bg-black border border-void-red/20 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {!isPreparing ? (
                  <motion.div 
                    key="pending"
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="border-2 border-void-red px-4 py-1 rotate-[-12deg] shadow-[0_0_30px_rgba(255,0,0,0.2)] bg-black"
                  >
                    <span className="text-void-red font-black text-xl md:text-2xl uppercase">DECISION_REQUIRED</span>
                  </motion.div>
                ) : (
                  <motion.div key="writing" className="w-full p-4 space-y-2">
                    <div className="flex justify-between text-[8px] font-black text-void-red animate-pulse">
                      <span>BIO_ENCRYPTION_ACTIVE</span>
                      <span>HASH...</span>
                    </div>
                    <div className="h-1 w-full bg-void-red/10 overflow-hidden">
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }} 
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                        className="h-full bg-void-red w-1/2 shadow-[0_0_15px_#ff0000]" 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-4 md:p-8 border-t border-white/10 mt-auto">
        {!isPreparing ? (
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <button 
              onClick={() => handleFinalAction('stay')}
              className="py-3 md:py-6 bg-white text-black font-black uppercase italic text-xs md:text-base border-2 border-white hover:bg-transparent hover:text-white transition-all group relative"
            >
              <span className="relative z-10">Stay Asset</span>
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => handleFinalAction('rebel')}
              className="py-3 md:py-6 bg-void-red text-black font-black uppercase italic text-xs md:text-base border-2 border-void-red hover:bg-black hover:text-void-red transition-all shadow-[0_0_30px_rgba(255,0,0,0.2)]"
            >
              Resist
            </button>
            <button 
              onClick={() => handleFinalAction('escape')}
              className="py-3 md:py-6 bg-transparent text-white font-black uppercase italic text-xs md:text-base border-2 border-white/20 hover:border-white hover:bg-white hover:text-black transition-all"
            >
              Escape
            </button>
          </div>
        ) : (
          <div className="py-4 md:py-6 text-center border-2 border-void-red/50 text-void-red text-xl md:text-2xl font-black uppercase italic animate-pulse">
            WRITING_TO_BLOCKCHAIN...
          </div>
        )}
        <div className="mt-4 flex items-center justify-between text-[7px] font-black text-white/20 uppercase tracking-[0.4em]">
          <span>SYNDICATE_BLOCKCHAIN_NODE_V4</span>
          <div className="flex gap-1">
            {Array(8).fill(0).map((_, i) => <div key={i} className="w-1 h-1 bg-void-red/20" />)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
