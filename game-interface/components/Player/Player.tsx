import { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { useWeb3React } from "@web3-react/core";
import BlockchainService from "../../services/BlockchainService";

const Player = (): JSX.Element => {
    const { account, library } = useWeb3React();
    const gameContext = useContext(GameContext);
    const { setPlayerDirection, characterInfo, setCharacterInfo } = gameContext;
    const blockchainService = new BlockchainService(account);

    const moveCharacter = async (e: any) => {
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

        let res = await blockchainService.moveCharacter(
            +characterInfo.id as number,
            x,
            y,
            library
        );

        if (res) {
            // TODO: update character in game context
            setCharacterInfo({ ...characterInfo, x, y })
        }
    };

    return (
        <div>
            <div>
                <p>id: {characterInfo.id}</p>
                <p>lvl: {characterInfo.lvl}</p>
                <p>xp: {characterInfo.xp}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                    User Panel controls
                    <button
                        onMouseEnter={() => setPlayerDirection(1)}
                        onMouseLeave={() => setPlayerDirection(0)}
                        onClick={() => moveCharacter("right")}
                    >
                        rigth
                    </button>
                    <button
                        onMouseEnter={() => setPlayerDirection(2)}
                        onMouseLeave={() => setPlayerDirection(0)}
                        onClick={() => moveCharacter("down")}
                    >
                        down
                    </button>
                    <button
                        onMouseEnter={() => setPlayerDirection(3)}
                        onMouseLeave={() => setPlayerDirection(0)}
                        onClick={() => moveCharacter("left")}
                    >
                        left
                    </button>
                    <button
                        onMouseEnter={() => setPlayerDirection(4)}
                        onMouseLeave={() => setPlayerDirection(0)}
                        onClick={() => moveCharacter("up")}
                    >
                        up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Player;
