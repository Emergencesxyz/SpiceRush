import { useContext } from "react";
import { GameContext } from "../../context/GameContext";

const LandSection = (): JSX.Element => {
    const gameContext = useContext(GameContext);
    const { selectedTile } = gameContext;

    return (
        <div>
            {selectedTile && (
                <div>
                    <p>foesAmount: {selectedTile.foesAmount}</p>
                    <p>isExplored: {selectedTile.isExplored}</p>
                    <p>level: {selectedTile.level}</p>
                    <p>spiceAmount: {selectedTile.spiceAmount}</p>
                    <p>x: {selectedTile.x}</p>
                    <p>y: {selectedTile.y}</p>
                </div>
            )}
        </div>
    );
};

export default LandSection;
