import React, { useState } from "react";
import { motion } from "framer-motion";

interface ASCIIArtProps {
  className?: string;
  clickable?: boolean;
}

const ASCIIArt: React.FC<ASCIIArtProps> = ({
  className = "",
  clickable = true,
}) => {
  const [currentArtIndex, setCurrentArtIndex] = useState(0);

  const asciiArts = [
    `     ___    ______  ____ ________  __ ___
    /   |  / __ / /  _/_  __/  / / /   |
   / /| | / / / /  / /  / / /  / / / /| |
  / ___ |/ /_/ _/ /   / / /  /_/ / / ___ |
 /_/  |_/_____/___/  /_/  \__, / /_/  |_|
                         /____/            `,
    `  █████╗ ██████╗ ██╗████████╗██╗   ██╗ █████╗
 ██╔══██╗██╔══██╗██║╚══██╔══╝╚██╗ ██╔╝██╔══██╗
 ███████║██║  ██║██║   ██║    ╚████╔╝ ███████║
 ██╔══██║██║  ██║██║   ██║     ╚██╔╝  ██╔══██║
 ██║  ██║██████╔╝██║   ██║      ██║   ██║  ██║
 ╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝`,
    `  ░█████╗░██████╗░██╗████████╗██╗░░░██╗░█████╗░
  ██╔══██╗██╔══██╗██║╚══██╔══╝╚██╗░██╔╝██╔══██╗
  ███████║██║░░██║██║░░░██║░░░░╚████╔╝░███████║
  ██╔══██║██║░░██║██║░░░██║░░░░░╚██╔╝░░██╔══██║
  ██║░░██║██████╔╝██║░░░██║░░░░░░██║░░░██║░░██║
  ╚═╝░░╚═╝╚═════╝░╚═╝░░░╚═╝░░░░░░╚═╝░░░╚═╝░░╚═╝`,
    `   ▄████████ ████████▄   ▄█      ███     ▄██   ▄   ▄████████
  ███    ███ ███   ▀███ ███  ▀█████████▄ ███   ██▄ ███    ███
  ███    ███ ███    ███ ███▌    ▀███▀▀██ ███▄▄▄███ ███    ███
  ███    ███ ███    ███ ███▌     ███   ▀ ▀▀▀▀▀▀███ ███    ███
▀███████████ ███    ███ ███▌     ███     ▄██   ███ ███    ███
  ███    ███ ███    ███ ███      ███     ███   ███ ███    ███
  ███    ███ ███   ▄███ ███      ███     ███   ███ ███    ███
  ███    █▀  ████████▀  █▀      ▄████▀    ▀█████▀  ████████▀  `,
    `    ___       ___ __
   /   |  ___/ (_) /_/__  ______ _
  / /| | / _  / / __/ / / / __ \`/
 / ___ |/ /_/ / / /_/ /_/ / /_/ /
/_/  |_|\__,_/_/\__/\__, /\__,_/
                  /____/         `,
    `    _____       .___.__  __
   /  _  \    __| _/|__|/  |_ ___.__._____
  /  /_\  \ / __  | |  |    /__| |  \__  \
 /    |    / /_/ | |  |   |  |   /   / __ \_
 \____|__  \____ | |__|___|  |___| (____  /
         \/     \/         \/           \/    `,
    `          @@@@@@@            @@@@@@@            @@@
          @@@@@@@@            @@@@@@@@            @@@              @@@
          @@!  @@@@@@@@@@@@@  @@@  !@@            @@@              @@@
          !@!  @!@@!!!!!!!!!  @!@  !!!            !@!              !@!
          @!@!@!@!!@@@@@@@@@  !@!  !!!            @!!              @!!
          !!!@!!!!!!!!!!!!!  !!!  !!!            !!!              !!!
          !!:  !!!@@@@@@@@@@  !!!  !!!            !!:              !!:  !!!!!!
          :!:  !:!!!!!!!!!!  !:!  !!!            :!:              :!: :!:!:!:
           :   ::  @@@@@@@@@   :   ::              :::  :::  :::    :   :::
               ::  !!!!!!!!!       :               ::: :::: ::::        : :                        `,
    `  ░▀█▀░█▀▄░▀█▀░▄▀█░█░█░█▀█
  ░░█░░█▀▄░░█░░█▀█░█▀█░█▀█
  ░░▀░░▀░▀░▀▀▀░▀░▀░▀░▀░▀░▀ `,
    `╔═╗╔╦╗╦╔╦╗╦ ╦╔═╗
╠═╣ ║║║ ║ ╚╦╝╠═╣
╩ ╩═╩╝╩ ╩  ╩ ╩ ╩`,
    `          ████████
        ██████████████
      ████████████████
        ██████████████
          ████████
            ████
             ██
             ░░
             ▒▒
             ▓▓
             ██`,
  ];

  const handleClick = () => {
    if (clickable) {
      setCurrentArtIndex((prev) => (prev + 1) % asciiArts.length);
    }
  };

  return (
    <motion.div
      className={`ascii-art font-mono text-primary text-center cursor-hover select-none ${className}`}
      onClick={handleClick}
      whileHover={
        clickable
          ? {
              scale: 1.05,
              color: "#ffffff",
              textShadow: "0 0 10px #00ff41",
            }
          : {}
      }
      whileTap={clickable ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        fontSize: "clamp(6px, 1.5vw, 12px)",
        lineHeight: 1,
        whiteSpace: "pre",
      }}
    >
      <motion.pre
        key={currentArtIndex}
        initial={{ opacity: 0, rotateX: 90 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.3 }}
        className="m-0"
      >
        {asciiArts[currentArtIndex]}
      </motion.pre>

      {clickable && (
        <motion.p
          className="text-xs text-text-secondary mt-4 opacity-0 hover:opacity-100 transition-opacity"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          Click to cycle through designs
        </motion.p>
      )}
    </motion.div>
  );
};

export default ASCIIArt;
