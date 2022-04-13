import React from "react";
import {
  useEffect,
  useState,
  FunctionComponent,
  ReactNode,
  useRef,
} from "react";
import styles from "../MusicPlayer/MusicPlayer.module.scss";

interface Props {
  isMobile: boolean;
}

const Player: FunctionComponent<Props> = (props): JSX.Element => {
  const { isMobile } = props;
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
      <div
        className={!isMobile ? styles.button1 : styles.buttonMobile}
        onClick={() => toggleAudio()}
      >
        {isPlaying ? (
          <img
            src={isMobile ? "pictures/soundOn.png" : "pictures/sound.png"}
            alt="toggle on"
          />
        ) : (
          <img
            src={isMobile ? "pictures/soundOff.png" : "pictures/no-sound.png"}
            alt="toggle off"
          />
        )}
      </div>
    </>
  );
};

export default Player;
