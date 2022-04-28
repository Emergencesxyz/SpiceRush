import { useRef, useEffect, useState } from 'react';
import { testTiles } from "../../borrar";
import Phaser from "phaser";

const width = 40;
const height = 38;
const tileWidth = 32;
const tileHeight = 32;
let apePositionX = tileWidth*20-tileWidth/2;
let apePositionY = tileHeight*25-tileHeight/2;

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
let clickOut = true;

function preload() {
    this.load.image('tiles', 'assets/tiles.png');
    this.load.image('0', 'assets/0.png');
    this.load.image('1', 'assets/1.png');
    this.load.image('2', 'assets/2.png');
    this.load.image('3', 'assets/3.png');
    this.load.image('4', 'assets/4.png');
}

function create() {
    _this = this
    // Build a random level as a 2D array
    let level = [];
    for (var y = 0; y < height; y++) {
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
        const test = map.getTileAt(1, 1);
        console.log('test', test)

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


export default function Map({ playerDirection }) {
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