import React from "react";
import { motion } from "framer-motion";

const MusicWaves: React.FC = () => {
  // Create 5 bars for the music wave effect
  const bars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1 opacity-20">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-gradient-to-t from-primary-600 to-accent-500 rounded-full"
          animate={{
            height: ["12px", "24px", "12px", "18px", "12px"],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: bar * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default MusicWaves;
