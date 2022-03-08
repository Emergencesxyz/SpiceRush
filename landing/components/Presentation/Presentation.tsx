/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, FunctionComponent } from "react";
import { Col, Button } from "react-bootstrap";
import styles from "./Presentation.module.scss";
import ReactPlayer from "react-player";
import VideoMobile from "../VideoMobile/VideoMobile";

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
      </div>
      {!isMobile ? (
        <div className={styles.countdownContainer}>
          <div className={styles.content}>
            <div className={styles.description}>
              <p>
                Explore a new WORLD. <br />
                Earn TOKENS.
              </p>
            </div>
            <div className={styles.logo}>
              {/*  <h1
                className={[styles.hero, styles.glitch, styles.layers].join(
                  " "
                )}
                data-text="APINATOR 2042"
              >
                <span>
                  APINATOR <span style={{ color: "#fc0362" }}>2042</span>
                </span>
              </h1> */}
              <img
                src="../pictures/Logo_Apinator_2042.png"
                alt="logo-apinator"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <img src="/pictures/supreme1.png" alt="imageLP" />
        </div>
      ) : (
        <>
          <div className={styles.countdownContainer}>
            <div className={styles.content}>
              <img
                src="/pictures/mobile-ape_sweat_gradient.png"
                alt="imageLP"
              />
              <div>
                <div className={styles.logo}>
                  {/*   <h1
                    className={[styles.hero, styles.glitch, styles.layers].join(
                      " "
                    )}
                    data-text="APINATOR 2042"
                  >
                    <div>
                      APINATOR <span style={{ color: "#fc0362" }}>2042</span>
                    </div>
                  </h1> */}
                  <img
                    src="../pictures/Logo_Apinator_2042.png"
                    alt="logo-apinator"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className={styles.description}>
                  <p>
                    Explore a new WORLD. <br />
                    Earn TOKENS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Presentation;
