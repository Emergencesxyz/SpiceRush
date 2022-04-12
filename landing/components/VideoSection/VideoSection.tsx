import { useEffect, useState, FunctionComponent, ReactNode } from "react";
import { Col, Row, Button } from "react-bootstrap";
import styles from "./VideoSection.module.scss";
import ReactPlayer from "react-player";
import VideoMobile from "../VideoMobile/VideoMobile";
import textSection from "../../components/textSection";
interface Props {
  isMobile: boolean;
}

const VideoSection: FunctionComponent<Props> = (props): JSX.Element => {
  const {isMobile} = props;

  return (
    <div className={styles.container}>
      <div className={styles.video}>
        {!isMobile ? (
          <ReactPlayer
            playing
            muted
            playsInline
            loop
            url={[{ src: "/videos/rainVideo.mp4", type: "video/mp4" }]}
            height="100%"
            width="100%"
          />
        ) : (
          <VideoMobile mainVideo="/videos/mobile_video.mp4" />
        )}
      </div>
      <Row className={styles.contentContainer}>
            <div
            className={styles.image}
            >
              <img src="../pictures/lands.gif" />
            </div>
            <div
              className={styles.text}
            >
              <h1>{textSection.section3.title}</h1>
              <br></br>
              <p>{textSection.section3.part1}</p>
              <br></br>
              <p>{textSection.section3.part2}</p>
              <br></br>
              <p>{textSection.section3.part3}</p>
              <br></br>
              <a
                href="https://golemdao.gitbook.io/spicerush/gameplay/spice"
                target="_blank"
              >
                <Button className={styles.button}>more</Button>
              </a>
            </div>
      </Row>
      <Row className={styles.sectionFooter}>
        <div className={styles.rectangle1}></div>
        <img src="./pictures/HexagonLogo.svg" alt="testLogo" />
        <div className={styles.rectangle2}></div>
      </Row>
    </div>
  );
};

export default VideoSection;
