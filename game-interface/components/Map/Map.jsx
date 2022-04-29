import { useRef, useEffect, useContext } from 'react';
import { GameContext } from "../../context/GameContext";
import Phaser from "phaser";

const width = 20;
const height = 20;
const tileWidth = 32;
const tileHeight = 32;
let apePositionX;
let apePositionY;

let map;
let controls;
let marker;
let currentX = 0;
let currentY = 0;
let currentZoom = 2;
let camera;
let image;
let _this;
let clickOut = true;
let mapTiles;

export default function Map() {
    const gameContext = useContext(GameContext);
    const { playerDirection, characterInfo, tiles, setSelectedTile } = gameContext;
    const parentRef = useRef(null);


    mapTiles = tiles;
    // Character position, 10 for chunkn size
    apePositionX = Math.abs(tiles[0].x - characterInfo.x) * tileWidth + tileWidth/2;
    apePositionY = Math.abs(tiles[0].y - characterInfo.y) * tileHeight + tileHeight/2;

    function preload() {
        this.load.image('tiles', 'assets/tiles.png');
        this.load.image('0', 'assets/0.png');
        this.load.image('1', 'assets/1.png');
        this.load.image('2', 'assets/2.png');
        this.load.image('3', 'assets/3.png');
        this.load.image('4', 'assets/4.png');
    }

    function create() {
        _this = this;
        // Build a random level as a 2D array
        let level = [];
        let row = [];

        for (let i = 0; i <= mapTiles.length; i++) {
            // const toPush = !mapTiles[i].isExplored ? -1 : mapTiles[i].level;
            if(row.length < 20) {
                row.push(mapTiles[i].level);
            } else {
                level.push(row);
                if(i !== mapTiles.length) {
                    row = [];
                    row.push(mapTiles[i].level);
                }
            }
        }

        // create THE map
        map = this.make.tilemap({ data: level, tileWidth, tileHeight });
        // adding value to tiles
        map.forEachTile((tile, index)=>{
            tile.properties = mapTiles[index]
        })

        const tileset = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tileset, 0, 0);
        layer.putTileAt(5, 1, 1);

        // adding cursor pointer in map
        marker = this.add.graphics();
        marker.lineStyle(3, 0xffffff, 1);
        marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

        // Setting camera
        camera = this.cameras.main
        camera.setBounds(0, 0, layer.width, layer.height);

        // Ape position
        image = this.add.image(apePositionX, apePositionY, '0');
        image.setDisplaySize(96,96);

        // Keyboard listener
        const cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: camera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        };
        controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

        // center camera
        camera.setZoom(currentZoom);
        // TODO: fix this shit
        currentX = apePositionX - layer.width/2 - 64;
        currentY = apePositionY - layer.height/2 + 32;
        console.log('camera', currentX, currentY, 'ape', apePositionX, apePositionY)
        camera.setScroll(currentX, currentY);

    }

    function update(time, delta) {
        controls.update(delta);

        // Prevent interactions with outside canvas click
        if(clickOut) return;

        const worldPoint = this.input.activePointer.positionToCamera(camera);

        // Rounds down to nearest tile
        const pointerTileX = map.worldToTileX(worldPoint.x);
        const pointerTileY = map.worldToTileY(worldPoint.y);

        // Snap to tile coordinates, but in world space
        marker.x = map.tileToWorldX(pointerTileX);
        marker.y = map.tileToWorldY(pointerTileY);

        if (this.input.manager.activePointer.isDown) {
            const tile = map.getTileAt(pointerTileX, pointerTileY);

            if (tile) {
                setSelectedTile(tile.properties);
            }
        }
    }

    function updateApeImage (position) {
        image.destroy();
        image = null;
        image = _this.add.image(apePositionX, apePositionY, ''+position);
    }

    function refreshMap () {
        map.forEachTile((tile)=>{
            tile.index = Phaser.Math.RND.integerInRange(30, 50);
        })
    }

    function mapControls (action) {
        switch (action) {
            case "up": {
                    const newY = currentY > tileHeight ? currentY + tileHeight : currentY
                    camera.setScroll(currentX,newY)
                    currentY = newY
                }
                break;
            case "rigth": {
                    const newX = currentX < 0 ? 0 + tileWidth : currentX + tileWidth
                    camera.setScroll(newX,currentY)
                    currentX = newX;
                }
                break;
            case "left": {
                    const newX = currentX < 0 ? 0 - tileWidth : currentX - tileWidth
                    camera.setScroll(newX,currentY)
                    currentX = newX;
                }
                break;
            case "down": {
                    const newY = currentY > tileHeight ? currentY - tileHeight : currentY
                    camera.setScroll(currentX,newY)
                    currentY = newY;
                }
                break;
            case "zoomIn":
                camera.setZoom(currentZoom + 0.1)
                currentZoom += 0.1
                break;
            case "zoomOut":
                camera.setZoom(currentZoom - 0.1)
                currentZoom -= 0.1
                break;
            default:
                console.log(`No control sor ${action}.`);
        }
    }

    useEffect(() => {
        const game = new Phaser.Game({
            parent: parentRef.current,
            // width: tileWidth * width,
            // height: tileHeight * height,
            width: 800,
            height: 600,
            resolution: 1,
            pixelArt: true,
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        });

    // Refreshing map every 10 secs
    // const interval = setInterval(() => {
    //     refreshMap();
    //     propertiesText.setText('Values: ')
    // }, 10000);

    return () => {
        game.destroy();
        // clearInterval(interval);
    }
  }, []);

  // Handling Ape direction
  useEffect(() => {
    if(!image) return;
    updateApeImage(playerDirection)
  }, [playerDirection]);

  return (
      <>
        <div>
            Map controls
            <button onClick={() => mapControls('down')}>down</button>
            <button onClick={() => mapControls('up')}>up</button>
            <button onClick={() => mapControls('left')}>left</button>
            <button onClick={() => mapControls('rigth')}>rigth</button>
            <button onClick={() => mapControls('zoomIn')}>zoomIn</button>
            <button onClick={() => mapControls('zoomOut')}>zoomOut</button>
        </div>
        <div
            onMouseLeave={() => clickOut = true}
            onMouseEnter={() => clickOut = false}
            ref={parentRef}
        ></div>
      </>

  );
}