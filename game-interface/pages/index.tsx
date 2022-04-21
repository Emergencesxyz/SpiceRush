import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";
// import Map from "../components/Map/Map";


const Map = dynamic(() => import("../components/Map/Map"), {
  ssr: false,
});

export default function Home() {
  const [apeDirection, setApeDirection] = useState(0);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div onClick={(e) => e.stopPropagation()}>
        User Panel controls
        <button
          onMouseEnter={() => setApeDirection(1)}
          onMouseLeave={() => setApeDirection(0)}
        >
          rigth
        </button>
        <button
          onMouseEnter={() => setApeDirection(2)}
          onMouseLeave={() => setApeDirection(0)}
        >
          down
        </button>
        <button
          onMouseEnter={() => setApeDirection(3)}
          onMouseLeave={() => setApeDirection(0)}
        >
          left
        </button>
        <button
          onMouseEnter={() => setApeDirection(4)}
          onMouseLeave={() => setApeDirection(0)}
        >
          up
        </button>
      </div>

      <div style={{ border: "1px solid red", width: "800px", height: "600px" }}>
        <Map apeDirection={apeDirection} />
      </div>
    </div>
  );
}
