/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Col, Button } from "react-bootstrap";
import styles from "./Presentation.module.scss";
import ReactPlayer from "react-player";
import VideoMobile from "../VideoMobile/VideoMobile";

const Presentation = (): JSX.Element => {
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsmobile(true);
    }
  }, []);

  return (
    <section id="topSection" className={styles.presentationSection}>
      <div className={styles.playerWrapper}>
        {!isMobile && (
          <div
            style={{ display: "flex" }}
            className={isVideoLoaded ? styles.videoLoaded : styles.videoLoading}
          >
            <img src="/pictures/loader.jpg" alt="loader" />
          </div>
        )}

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
          <VideoMobile mainVideo="/videos/mobile_video.mp4" />
        )}
      </div>
      <div className={styles.groupButtons}>
        {/*
        <div className={styles.button1}>
          <img src="pictures/discord.svg" alt="logoDiscord" />
        </div>
        */}
        <a
          className={styles.button1}
          href="https://twitter.com/Apinator_2042"
          target="_blank"
        >
          <img src="pictures/twitter.svg" alt="logoInsta" />
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                textAlign: "center",
              }}
            >
              <h1
                className={[styles.hero, styles.glitch, styles.layers].join(
                  " "
                )}
                data-text="APINATOR 2042"
              >
                <span>APINATOR 2042</span>
              </h1>
            </div>
          </div>

          <img src="/pictures/supreme1.png" alt="imageLP" />
        </div>
      ) : (
        <>
          <div className={styles.countdownContainer}>
            <div className={styles.content}>
              <img src="/pictures/ape_sweat_gradient.png" alt="imageLP" />
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    textAlign: "left",
                  }}
                >
                  <h1
                    className={[styles.hero, styles.glitch, styles.layers].join(
                      " "
                    )}
                    data-text="APINATOR 2042"
                  >
                    <div>APINATOR 2042</div>
                  </h1>
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
