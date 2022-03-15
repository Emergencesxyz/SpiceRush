import React, { useEffect, useRef, useState } from "react";
import TimelineObserver from "react-timeline-animation";
import styles from "../Roadmap/Roadmap.module.scss";

const Timeline = ({ setObserver, callback }) => {
  const [message1, setMessage1] = useState(<div className={styles.text}>
    <h2>1. Golem DAO</h2>
    <p> Golem Token IEO</p>
    <p> Golem Token listing </p>
  </div>);
  const [message2, setMessage2] = useState(<div className={styles.text}>
    <h2>2. Megalopolis Conquest</h2>
    <p> Lands auctions</p>
    <p> NFT Character drop</p>
  </div>);
  const [message3, setMessage3] = useState(<div className={styles.text}>
    <h2>3. Rise of the Apinator </h2>
    <p>Alpha release: mining economy and on-chain procedural map</p>
    <p>Big game contest </p>
  </div>);
  const [message4, setMessage4] = useState(<div className={styles.text}>
    <h2>4. Expansion </h2>
    <p>
      Beta release: Powerup items collection. <br /> PVP system.
    </p>
  </div>);

  const timeline1 = useRef(null);
  const timeline2 = useRef(null);
  const timeline3 = useRef(null);
  const timeline4 = useRef(null);
  const circle1 = useRef(null);
  const circle2 = useRef(null);
  const circle3 = useRef(null);
  const circle4 = useRef(null);

  const circle = {
    width: "45px",
    height: "45px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#e5e5e5",
  };

  const circleWrapper = {
    position: "relative",
  };
  const wrapper = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "30%",
  };
  const timeline = {
    height: "250px",
    width: "8px",
    backgroundColor: "#e5e5e5",
  };
  const message = {
    position: "absolute",
    top: "20%",
    left: "50%",
    minWidth: "150px",
    width: "75vw",
    fontWeight: "bold",
    paddingLeft: "50px",
  };
  const stub2 = {
    height: "1000px",
  };

 /*  const someCallback = () => {
    setMessage1(
      
    );
    callback();
  };

  const someCallback2 = () => {
    setMessage2(
      
    );
  };

  const someCallback3 = () => {
    setMessage3(
      
    );
  };

  const someCallback4 = () => {
    setMessage4(
      <div className={styles.text}>
        <h2>4. Expansion </h2>
        <p>
          Beta release: Powerup items collection. <br /> PVP system.
        </p>
      </div>
    );
  }; */

  useEffect(() => {
    setObserver(timeline1.current);
    setObserver(timeline2.current);
    setObserver(timeline3.current);
    setObserver(timeline4.current);
    setObserver(circle1.current );
    setObserver(circle2.current );
    setObserver(circle3.current );
    setObserver(circle4.current);
  }, []);

  return (
    <div style={wrapper}>
      <div id="timeline1" ref={timeline1} style={timeline} />
      <div style={circleWrapper}>
        <div id="circle1" ref={circle1} style={circle}>
          1
        </div>
        <div style={message}>{message1}</div>
      </div>
      <div id="timeline2" ref={timeline2} style={timeline} />
      <div style={circleWrapper}>
        <div id="circle2" ref={circle2} style={circle}>
          2
        </div>
        <div style={message}>{message2}</div>
      </div>
      <div id="timeline3" ref={timeline3} style={timeline} />
      <div style={circleWrapper}>
        <div id="circle3" ref={circle3} style={circle}>
          3
        </div>
        <div style={message}>{message3}</div>
      </div>
      <div id="timeline4" ref={timeline4} style={timeline} />
      <div style={circleWrapper}>
        <div id="circle4" ref={circle4} style={circle}>
          4
        </div>
        <div style={message}>{message4}</div>
      </div>
    </div>
  );
};

export default function Roadmap() {
  const [message, setMessage] = useState("");

  const onCallback = () => {
    console.log("awesome");
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.stub1}>⬇️ scroll to start ⬇️</div> */}
      <h1 style={{ textAlign: "center" , marginBottom: "50px"}}>Roadmap</h1>
      <TimelineObserver
        initialColor="#e5e5e5"
        fillColor="purple"
        handleObserve={(setObserver) => (
          <Timeline
            /* callback={onCallback} */
            className={styles.timeline}
            setObserver={setObserver}
          />
        )}
      />
      {/*  <div style={stub2}>{message}</div> */}
    </div>
  );
}
