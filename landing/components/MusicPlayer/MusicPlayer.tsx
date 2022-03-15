import React from "react";
import { useState, useRef } from "react";
import styles from "../MusicPlayer/MusicPlayer.module.scss";

const Player = () => {
  const refAudio = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const toggleAudio = () => {
    if (refAudio !== null) {
      if (refAudio.current.paused) {
        refAudio.current.play();
        setIsPlaying(true);
      } else {
        refAudio.current.pause();
        setIsPlaying(false);
      }
    }
  };
  return (
    <>
      <div>
        <audio
          ref={refAudio}
          playsInline
          preload="metadata"
          src="../audio/apinato.mp3"
        ></audio>
      </div>
      <div className={styles.button1} onClick={() => toggleAudio()}>
        {isPlaying ? (
          <img src="pictures/sound.png" alt="toggle on" />
        ) : (
          <img src="pictures/no-sound.png" alt="toggle off" />
        )}
      </div>
    </>
  );
};

export default Player;
