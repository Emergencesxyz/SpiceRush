import { useRef, useEffect, useState } from 'react';
import Phaser from "phaser";

const width = 40;
const height = 38;
const tileWidth = 32;
const tileHeight = 32;
const apePositionX = tileWidth*20-tileWidth/2;
const apePositionY = tileHeight*25-tileHeight/2;
let map;
let controls;
let marker;
let propertiesText;
let currentX = 0;
let currentY = 0;
let currentZoom = 1;
let camera;
let image;
let _this;
let clickOut;

function preload() {
    this.load.image('tiles', 'gameAssets/tiles.png');
    this.load.image('0', 'gameAssets/0.png');
    this.load.image('1', 'gameAssets/1.png');
    this.load.image('2', 'gameAssets/2.png');
    this.load.image('3', 'gameAssets/3.png');
    this.load.image('4', 'gameAssets/4.png');
}

function create() {
    _this = this
    // Build a random level as a 2D array
    let level = [];
    for (var y = 0; y < height; y++)
    {
        var row = [];
        for (var x = 0; x < width; x++)
        {
            var tileIndex = Phaser.Math.RND.integerInRange(30, 50);
            row.push(tileIndex);
        }
        level.push(row);
    }

    // create THE map
    map = this.make.tilemap({ data: level, tileWidth, tileHeight });
    // adding value to tiles
    map.forEachTile((tile)=>{
        tile.properties = {value: Math.random()}
    })
    const tileset = map.addTilesetImage('tiles');
    const layer = map.createLayer(0, tileset, 0, 0);

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

    // Center camera in ape position (width/2, height/2)
    currentX = apePositionX - 400;
    currentY = apePositionY - 300
    camera.setScroll(currentX, currentY)

    propertiesText = this.add.text(16, 540, 'Values: ', {
        fontSize: '18px',
        fill: '#ffffff',
        padding: { x: 10, y: 5 },
        backgroundColor: '#000000',
    });
    propertiesText.setScrollFactor(0);
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

    if (this.input.manager.activePointer.isDown)
    {
        const tile = map.getTileAt(pointerTileX, pointerTileY);

        if (tile)
        {
            propertiesText.setText('Values: ' + tile.properties.value);
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
    if(action == "up") {
        const newY = currentY > 32 ? currentY + 32 : currentY
        camera.setScroll(currentX,newY)
        currentY = newY;
    } else if (action == "rigth") {
        const newX = currentX < 0 ? 0 + 32 : currentX + 32
        camera.setScroll(newX,currentY)
        currentX = newX;
    } else if (action == "left") {
        const newX = currentX < 0 ? 0 - 32 : currentX - 32
        camera.setScroll(newX,currentY)
        currentX = newX;
    } else if (action == "down") {
        const newY = currentY > 32 ? currentY - 32 : currentY
        camera.setScroll(currentX,newY)
        currentY = newY;
    } else if (action == "zoomIn") {
        camera.setZoom(currentZoom + 0.1)
        currentZoom += 0.1
    } else if (action == "zoomOut") {
        camera.setZoom(currentZoom - 0.1)
        currentZoom -= 0.1
    }
}


export default function Map({ playerDirection }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const parentRef = useRef(null);

    useEffect(() => {
        const game = new Phaser.Game({
            parent: parentRef.current,
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
    const interval = setInterval(() => {
        refreshMap();
        propertiesText.setText('Values: ')
    }, 10000);

    setIsLoaded(true)
    return () => {
        game.destroy();
        clearInterval(interval);
    }
  }, []);

  // remove first useless canvas, TODO: find a real solution
  useEffect(() => {
    isLoaded && parentRef.current.removeChild(parentRef.current.children[0])
  }, [isLoaded]);

  // Handling ape direction
  useEffect(() => {
    if(!image) return;
    updateApeImage(playerDirection)
  }, [playerDirection]);

  return (
      <>
        <div>
            Map controls
            <button onClick={() => mapControls('up')}>down</button>
            <button onClick={() => mapControls('down')}>up</button>
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