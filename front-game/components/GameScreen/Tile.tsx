import styles from "./Tile.module.scss";
import styles2 from "./Gamescreen.module.scss";
import { useState, FunctionComponent, useEffect } from "react";
import IconGame from "./IconGame";
import { Toast } from "react-bootstrap";

interface Props {
  level: number;
  currentPosition: boolean;
  spiceAmount: number | null;
  foesAmount: number | null;
  isExplored: boolean;
  x: number;
  y: number;
  countCharacters: number;
  characters: Array<any>;
}

const Tile: FunctionComponent<Props> = ({
  level,
  currentPosition,
  spiceAmount,
  foesAmount,
  isExplored,
  x,
  y,
  countCharacters,
  characters,
}): JSX.Element => {
  const color = Math.floor(((level ? level ** 1.7 : 0) * 255) / 100);
  const [toastMessage, setToastMessage] = useState<any>({ title: "", msg: "" });

  useEffect(() => {
    (async () => {})();
  }, [toastMessage]);

  let characterDesc = countCharacters
    ? countCharacters + " character(s) here."
    : "";
  return (
    <>
      <Toast
        show={toastMessage.msg && toastMessage.msg.length > 0}
        className={styles2.toast}
        onClose={() => setToastMessage({ title: "", msg: "" })}
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">{toastMessage.title}</strong>
          <small> </small>
        </Toast.Header>
        <Toast.Body>{toastMessage.msg}</Toast.Body>
      </Toast>

      <div
        className={styles.tile}
        title={`(${x},${y})`}
        style={{
          backgroundColor: "rgb(" + color + ",10,100)",
          filter: isExplored ? "brightness(100%)" : "brightness(50%)",
          border: currentPosition ? "cyan 2px dashed" : undefined,
        }}
        onClick={() =>
          setToastMessage({ title: `Tile(${x};${y})`, msg: characterDesc })
        }
      >
        {isExplored && (
          <div>
            <IconGame name="gem" size="15px" />
            {spiceAmount}
          </div>
        )}

        {isExplored && (
          <div>
            <IconGame name="skull" size="15px" />
            {foesAmount}
          </div>
        )}
        {isExplored && countCharacters && (
          <div>
            <IconGame name="hood" size="15px" />
            {countCharacters}
          </div>
        )}
        {!isExplored && (
          <span>
            ?<br />‎
          </span>
        )}
      </div>
    </>
  );
};

export default Tile;
