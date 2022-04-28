import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";
// import Map from "../components/Map/Map";


const Map = dynamic(() => import("../components/Map/Map"), {
  ssr: false,
});

export default function Home() {

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>


    </div>
  );
}
