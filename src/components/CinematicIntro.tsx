import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface CinematicIntroProps {
  onSkip: () => void;
}

export function CinematicIntro({ onSkip }: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const text1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.4], [0, -100]);

  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.3, 0.7], [100, -100]);

  const text3Opacity = useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 1]);
  const text3Y = useTransform(scrollYProgress, [0.6, 1], [100, 0]);

  const overlayOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-black text-white w-full overflow-hidden">
      {/* Fixed UI Layer */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none flex flex-col justify-between p-8 z-50">
        <div className="flex justify-between w-full items-start pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-sm tracking-widest uppercase opacity-50 font-mono"
          >
            FAST-NUCES
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            onClick={onSkip}
            className="text-sm tracking-widest uppercase hover:text-primary transition-colors duration-300 font-mono"
          >
            Skip Intro
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="self-center mb-8 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-mono">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Narrative Layers */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        {/* Text 1 */}
        <motion.div
          style={{ opacity: text1Opacity, y: text1Y }}
          className="absolute z-10 text-center max-w-4xl px-6"
        >
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            EXCELLENCE<br/>IS A PURSUIT.
          </h1>
        </motion.div>

        {/* Text 2 */}
        <motion.div
          style={{ opacity: text2Opacity, y: text2Y }}
          className="absolute z-10 text-center max-w-5xl px-6"
        >
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">
            Every great mind is shaped by those who <span className="text-primary italic font-serif">guide</span> them.
          </h2>
        </motion.div>

        {/* Text 3 */}
        <motion.div
          style={{ opacity: text3Opacity, y: text3Y }}
          className="absolute z-10 text-center max-w-4xl px-6"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            Empowering students with a <br/>
            <span className="gradient-heading">transparent voice.</span>
          </h2>
          <motion.button
            onClick={onSkip}
            className="px-8 py-4 rounded-full bg-white text-black font-semibold tracking-wide hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enter the Directory
          </motion.button>
        </motion.div>

        {/* Transition Overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-background z-40 pointer-events-none"
        />
      </div>
    </div>
  );
}
