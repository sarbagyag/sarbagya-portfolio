import React from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

const FloatingNotes: React.FC = () => {
  const notes = [
    { x: "10%", y: "20%", delay: 0, duration: 8 },
    { x: "85%", y: "15%", delay: 2, duration: 10 },
    { x: "15%", y: "70%", delay: 4, duration: 9 },
    { x: "90%", y: "75%", delay: 1, duration: 11 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {notes.map((note, index) => (
        <motion.div
          key={index}
          className="absolute text-primary-200/20"
          style={{ left: note.x, top: note.y }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: note.duration,
            delay: note.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Music size={24} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingNotes;
