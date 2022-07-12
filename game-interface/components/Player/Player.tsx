import { ReactNode, useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/GameContext";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";
import styles from "./Player.module.scss";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useRanger } from "react-ranger";

const Player = (): JSX.Element => {
  const { account, library } = useWeb3React();
  const gameContext = useContext(GameContext);
  const {
    setPlayerDirection,
    characterInfo,
    setCharacterInfo,
    sendLog,
    setTiles,
    tiles,
  } = gameContext;
  const blockchainService = new BlockchainService(account);
  const [controlsImg, setControlsImg] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fightAgain, setFightAgain] = useState<any>({});
  const [canLvlUp, setCanLvlUp] = useState<boolean>(false);
  const [modalImg, setModalImg] = useState<string>("");
  const [modalAction, setMdalAction] = useState<string>("");
  const [levelUpId, setLevelUpId] = useState<number>(null);
  const [values, setValues] = useState([1]);
  const [rangerMax, setRangerMax] = useState<number>(10);
  const [rangerMin, setRangerMin] = useState<number>(0);
  const [restPrice, setRestPrice] = useState<number>(null);
  const [levelUpPrice, setLevelUpPrice] = useState<number>(null);

  const { getTrackProps, segments, handles } = useRanger({
    min: rangerMin,
    max: rangerMax,
    stepSize: 1,
    values,
    onChange: setValues,
  });

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    (async () => {
      setCanLvlUp(await blockchainService.canLevelUp(characterInfo.id));
      setRestPrice(await blockchainService.getRestPrice());
      setLevelUpPrice(await blockchainService.getLevelUpPrice());
    })();
  }, [characterInfo]);

  const moveCharacter = async (e: any) => {
    if (characterInfo.stats.energy == 0) {
      alert("You do not have more energy, take a rest");
      return sendLog("You do not have more energy, take a rest");
    }

    sendLog(
      "waitting for transanction <img src='/assets/loader.gif' alt='loader'/>"
    );
    let x, y: number;
    // const audioScifi = new Audio("./sounds/button_scifi.mp3");
    // audioScifi.play();

    if (e === "right") {
      x = characterInfo.x + 1;
      y = characterInfo.y;
    } else if (e === "left") {
      x = characterInfo.x - 1;
      y = characterInfo.y;
    } else if (e === "up") {
      x = characterInfo.x;
      y = characterInfo.y + 1;
    } else if (e === "down") {
      x = characterInfo.x;
      y = characterInfo.y - 1;
    } else return;

    try {
      let res = await blockchainService.moveCharacter(
        +characterInfo.id as number,
        x,
        y,
        library
      );

      if (res) {
        sendLog(`player moved to ${x},${y}`);
        setCharacterInfo(
          await blockchainService.getCharacterInfo(characterInfo.id)
        );
        // Updateting Map
        setTiles(
          await blockchainService.getMapPlayer(
            characterInfo.x,
            characterInfo.y,
            10
          )
        );
      }
    } catch (e) {
      sendLog("transaction canceled");
    }
  };

  const setDirectionAndImg = (position: number) => {
    setPlayerDirection(position);
    setControlsImg(position);
  };

  const handleActions = async (action: string, lvlUpId?: number) => {
    sendLog(
      "waitting for transanction <img src='/assets/loader.gif' alt='loader'/>"
    );
    // Check approved sapice
    if (!(await blockchainService.approvedSpice(library))) {
      alert("Aprove Spice transfer is required for play");
      return sendLog("Aprove Spice transfer is required for play");
    }

    try {
      if (action == "mine") {
        const apeTile = tiles.find(
          ({ x, y }) => x == characterInfo.x && y == characterInfo.y
        );
        if (apeTile?.spiceAmount == 0) {
          alert("nothing to mine here");
          return sendLog("nothing to mine here");
        }
        await blockchainService.mine(
          characterInfo.id as number,
          values[0],
          library
        );
      } else if (action == "rest") {
        await blockchainService.rest(
          characterInfo.id as number,
          values[0],
          library
        );
      } else if (action == "spawn") {
        await blockchainService.spawn(characterInfo.id as number, library);
      } else if (action == "lvlUp") {
        if (
          levelUpPrice * (characterInfo.lvl + 1) >
          characterInfo.spiceAmount
        ) {
          alert("you do not have enough Spice");
          return sendLog("you do not have enough Spice");
        }
        await blockchainService.levelUp(characterInfo.id, lvlUpId, library);
      }
    } catch (e) {
      return sendLog(`${action} canceled`);
    }

    setCharacterInfo(
      await blockchainService.getCharacterInfo(characterInfo.id)
    );
    return sendLog(`${action} success`);
  };

  const RangerBar = (title: ReactNode) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {title}
        <br />
        <br />
        <div
          {...getTrackProps({
            style: {
              display: "inline-block",
              height: "40px",
              width: "90%",
              margin: "0 15%",
              backgroundColor: "#1B2346",
            },
          })}
        >
          {segments.map(({ getSegmentProps }, i) => (
            <div
              key={i}
              {...getSegmentProps({
                style: {
                  height: "100%",
                  background:
                    i === 0
                      ? "linear-gradient(270deg, #EA00D9 0%, rgba(234, 0, 217, 0.2) 100%)"
                      : "#1B2346",
                },
              })}
            ></div>
          ))}
          {handles.map(({ value, getHandleProps }, i) => (
            <button
              key={i}
              {...getHandleProps({
                style: {
                  appearance: "none",
                  border: "none",
                  background: "transparent",
                  outline: "none",
                },
              })}
            >
              <div
                style={{
                  background: "#1B1A4E",
                  border: "3px solid #2AB6BE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "1.6rem",
                  height: "50px",
                  fontSize: "0.7rem",
                  whiteSpace: "nowrap",
                  color: "white",
                  fontWeight: "normal",
                }}
              >
                {value}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSlideBar = () => {
    switch (modalAction) {
      case "rest": {
        return rangerMax != 0 ? (
          RangerBar(
            <>
              <h4>
                Take a rest to recover
                <br />
                You can recover HP paying <br />
                with Spice
              </h4>
              <h4>Spice to pay: {(values[0] * restPrice).toFixed(2)}</h4>
            </>
          )
        ) : (
          <h4>Take a rest to recover</h4>
        );
      }
      case "mine": {
        return RangerBar(
          <h4>
            You can boost your mining <br />
            paying with your Energy
          </h4>
        );
      }
      case "lvlUp": {
        return (
          <h1 style={{ textAlign: "center" }}>
            Level up
            {levelUpId == 1 && " HP"}
            {levelUpId == 2 && " Energy"}
            {levelUpId == 3 && " Mine"}
            <br />
            that will cost you{" "}
            {(levelUpPrice * (characterInfo.lvl + 1)).toFixed(2)} Spice
          </h1>
        );
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.firstWrapper}>
        {/* Player Information */}
        <div className={styles.playerInfo}>
          <img src="/assets/nft_player.png" alt="nft image" />
          <div className={styles.playerStats}>
            <div className={styles.leftWrapper}>
              <div className={styles.left}>
                <img src="/assets/name_logo.png" alt="name logo" />
                <div className={styles.name}>
                  <p>#NO NAME</p>
                </div>
                <div
                  className={styles.lock}
                  onClick={() => console.log("lock click")}
                >
                  <img src="/assets/lock.png" alt="lock logo" />
                </div>
              </div>
            </div>

            <div className={styles.right}>
              <p className={styles.title}>Lvl</p>
              <p className={styles.level}>{characterInfo.lvl}</p>
              <div className={styles.xp}>
                <img src="/assets/xp.png" alt="xp icon" />
                <p>{characterInfo.xp} / 3000</p>
              </div>
              <div className={styles.xp}>
                <img src="/assets/pos.png" alt="xp icon" />
                <p>
                  [{characterInfo.x}, {characterInfo.y} ]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Stats  */}
      <div className={styles.statsContainer}>
        {!characterInfo?.stats?.hp ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>Spawn to start playing</h3>
            <div
              className={styles.button}
              onClick={() => handleActions("spawn")}
            >
              <img src="/assets/button_on.png" alt="change character" />
              <p>Spawn</p>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.statsSection}>
              <img src="/assets/pic.png" alt="pic logo" />
              {canLvlUp && (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Level up your Mine</Tooltip>}
                >
                  <div
                    onClick={() => {
                      setModalImg("/assets/btn_mine.png");
                      setMdalAction("lvlUp");
                      setLevelUpId(3);
                      toggleModal();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img src="/assets/arrow_up.gif" alt="level up icon" />
                  </div>
                </OverlayTrigger>
              )}
              <p>{characterInfo.oreBalance}</p>
            </div>
            <div className={styles.statsSection}>
              <img src="/assets/hearth.png" alt="hearth logo" />
              {canLvlUp && (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Level up your HP</Tooltip>}
                >
                  <div
                    onClick={() => {
                      setModalImg("/assets/btn_mine.png");
                      setMdalAction("lvlUp");
                      setLevelUpId(1);
                      toggleModal();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img src="/assets/arrow_up.gif" alt="level up icon" />
                  </div>
                </OverlayTrigger>
              )}
              <div className={styles.barWrapper}>
                <p>
                  {characterInfo.stats?.hp} / {characterInfo.stats?.hpMax}
                </p>
                <div className={styles.hpBar}>
                  <div
                    className={styles.hp}
                    style={{
                      width:
                        (characterInfo.stats?.hp / characterInfo.stats?.hpMax) *
                          100 +
                        "%",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className={styles.statsSection}>
              <img src="/assets/energy.png" alt="energy logo" />
              {canLvlUp && (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Level up your Energy</Tooltip>}
                >
                  <div
                    onClick={() => {
                      setModalImg("/assets/btn_mine.png");
                      setMdalAction("lvlUp");
                      setLevelUpId(2);
                      toggleModal();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img src="/assets/arrow_up.gif" alt="level up icon" />
                  </div>
                </OverlayTrigger>
              )}
              <div className={styles.barWrapper}>
                <p>
                  {characterInfo.stats?.energy} /{" "}
                  {characterInfo.stats?.energyMax}
                </p>
                <div className={styles.energyBar}>
                  <div
                    className={styles.energy}
                    style={{
                      width:
                        (characterInfo.stats?.energy /
                          characterInfo.stats?.energyMax) *
                          100 +
                        "%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Player controls */}
      {characterInfo?.stats?.hp !== 0 && (
        <div className={styles.controls}>
          <img
            className={styles.bg}
            src="/assets/control_bg.png"
            alt="controls background"
          />
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Mine the Spice Ore</Tooltip>}
          >
            <div
              className={styles.btnMine}
              onClick={() => {
                setRangerMin(1);
                setValues([1]);
                setRangerMax(characterInfo.stats.energy);
                setModalImg("/assets/btn_mine.png");
                setMdalAction("mine");
                setLevelUpId(null);
                toggleModal();
              }}
            ></div>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={<Tooltip>SOON</Tooltip>}>
            <div className={styles.btnFight}></div>
          </OverlayTrigger>

          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Take a rest</Tooltip>}
          >
            <div
              className={styles.btnSit}
              onClick={() => {
                setRangerMin(0);
                setRangerMax(
                  characterInfo.stats.hpMax - characterInfo.stats.hp
                );
                setValues([0]);
                setModalImg("/assets/btn_sit.png");
                setMdalAction("rest");
                setLevelUpId(null);
                toggleModal();
              }}
            ></div>
          </OverlayTrigger>

          <div className={styles.actions}>
            <img src={`/assets/actions_${controlsImg}.png`} alt="actions 0" />
            <div className={styles.vertical}>
              <div
                onMouseEnter={() => setDirectionAndImg(4)}
                onMouseLeave={() => setDirectionAndImg(0)}
                onClick={() => moveCharacter("up")}
                className={styles.button}
              ></div>
            </div>

            <div className={styles.center}>
              <div
                onMouseEnter={() => setDirectionAndImg(3)}
                onMouseLeave={() => setDirectionAndImg(0)}
                onClick={() => moveCharacter("left")}
                className={styles.button}
              ></div>
              <div
                onMouseEnter={() => setDirectionAndImg(1)}
                onMouseLeave={() => setDirectionAndImg(0)}
                onClick={() => moveCharacter("right")}
                className={styles.button}
              ></div>
            </div>

            <div className={styles.vertical}>
              <div
                onMouseEnter={() => setDirectionAndImg(2)}
                onMouseLeave={() => setDirectionAndImg(0)}
                onClick={() => moveCharacter("down")}
                className={styles.button}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={toggleModal}
        centered
        aria-labelledby="modal"
        animation={false}
      >
        <div className={styles.modalContainer}>
          <img className={styles.imgHeader} src={modalImg} alt="header icon" />

          <div className={styles.contentWrapper}>
            <img
              className={styles.imgContainer}
              src="/assets/modal_container.png"
              alt="modal container"
            />

            <div className={styles.optionsWrapper}>{renderSlideBar()}</div>
          </div>

          <div className={styles.sitContainer}>
            <img
              className={styles.bg}
              src="/assets/btn_actions.png"
              alt="claim button"
            />
            <div
              className={styles.text}
              onClick={() => {
                handleActions(modalAction, levelUpId);
                toggleModal();
              }}
            >
              <h1>
                {modalAction == "lvlUp" && "Level Up"}
                {modalAction == "mine" && "Mine Spice Ore"}
                {modalAction == "rest" && "Take a rest"}
              </h1>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Player;
