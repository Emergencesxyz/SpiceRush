/* eslint-disable @next/next/no-img-element */
import { useState, FunctionComponent } from "react";
import styles from "./Scene.module.scss";
import ReactPlayer from "react-player";
import VideoMobile from "../VideoMobile/VideoMobile";

interface Props {
  isMobile: boolean;
}

const Scene: FunctionComponent<Props> = (props): JSX.Element => {
  const { isMobile } = props;

  return (
    <>
      <div className={styles.sceneSection}>
        <div className={styles.cowboyScene}>
          {!isMobile ? (
            <ReactPlayer
              playing
              muted
              playsInline
              className={styles.reactPlayer}
              loop
              url={[{ src: "/videos/sceneCowboy.mp4", type: "video/mp4" }]}
              height="100%"
              width="100%"
            />
          ) : (
            <VideoMobile mainVideo="/videos/sceneCowboyMobile.mp4" />
          )}
        </div>
        <div className={styles.shadow}></div>
      </div>
    </>
  );
};

export default Scene;