/* eslint-disable @next/next/no-img-element */
import { useState, FunctionComponent } from "react";
import styles from "./Presentation.module.scss";
import ReactPlayer from "react-player";
import VideoMobile from "../VideoMobile/VideoMobile";
import MusicPlayer from "../MusicPlayer/MusicPlayer";

interface Props {
  isMobile: boolean;
}

const Presentation: FunctionComponent<Props> = (props): JSX.Element => {
  const { isMobile } = props;
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  return (
    <section id="topSection" className={styles.presentationSection}>
      {!isVideoLoaded && (
        <div
          style={{ display: "flex" }}
          className={isVideoLoaded ? styles.videoLoaded : styles.videoLoading}
        >
          <div className={styles.loaderWrapper}>
            <img src="/pictures/mobile-loader.gif" alt="loader" height="80%" />
          </div>
        </div>
      )}
      <div className={styles.playerWrapper}>
        {!isMobile ? (
          <ReactPlayer
            playing
            muted
            playsInline
            className={styles.reactPlayer}
            loop
            url={[{ src: "/videos/rainVideo.mp4", type: "video/mp4" }]}
            height="100%"
            width="100%"
            onReady={() => setIsVideoLoaded(true)}
          />
        ) : (
          <>
            <ReactPlayer
              playing
              muted
              playsInline
              className={styles.reactPlayer}
              loop
              url={[{ src: "/videos/mobile_video.mp4", type: "video/mp4" }]}
              height={0}
              width={0}
              onReady={() => setIsVideoLoaded(true)}
            />

            {<VideoMobile mainVideo="/videos/mobile_video.mp4" />}
          </>
        )}
      </div>
      <div className={styles.groupButtons}>
        <a
          className={styles.button1}
          href="https://t.me/apinator2042"
          target="_blank"
        >
          <img
            style={{
              filter: "invert(0%)",
            }}
            src="pictures/telegram.svg"
            alt="telegram"
          />
        </a>

        <a
          className={styles.button1}
          href="https://twitter.com/Apinator_2042"
          target="_blank"
        >
          <img src="pictures/twitter.svg" alt="twitter" />
        </a>
        <MusicPlayer />
      </div>
      {!isMobile ? (
        <div className={styles.countdownContainer}>
          <div className={styles.content}>
            <div className={styles.logo}>
              <img
                src="../pictures/Logo_Apinator_2042_blanc.png"
                alt="logo-apinator"
              />
            </div>
            <div className={styles.description}>
              <p>Earn SPICE or die trying</p>
            </div>
          </div>
          <img src="/pictures/supreme1.png" alt="imageLP" />
        </div>
      ) : (
        <div className={styles.countdownContainer}>
          <div className={styles.content}>
            <img src="/pictures/mobile-ape_sweat_gradient.png" alt="imageLP" />
            <div>
              <div className={styles.logo}>
                <img
                  src="../pictures/mobile-Logo_Apinator_2042_blanc.png"
                  alt="logo-apinator"
                  style={{ width: "100%" }}
                />
              </div>
              <div className={styles.description}>
                <p>
                  Earn SPICE <br></br> or die trying
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Presentation;
