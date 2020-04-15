enum MinimapScale {
    Original,
    Half,
    Quarter,
    Eighth,
    Sixteenth
}
//% color=#cfab0c icon="\uf278"
//% groups='["Images"]'
namespace minimap {

    export interface MinimapImage extends Image {
        minimapScale: MinimapScale;
    }

    //% block="minimap || %scale scale"
    //% scale.defl=MinimapScale.Half
    export function minimap(scale: MinimapScale = MinimapScale.Half) {
        let tilemap = game.currentScene().tileMap;

        // let scale = 2

        const numRows = tilemap.areaHeight() >> tilemap.scale
        const numCols = tilemap.areaWidth() >> tilemap.scale
        const tileWidth = 1 << tilemap.scale

        let minimap: MinimapImage = image.create(
            numCols * tileWidth >> scale, 
            numRows * tileWidth >> scale) as MinimapImage;

        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                let idx = tilemap.getTileIndex(c, r)
                let tile = tilemap.getTileImage(idx)
                let nx = c * tileWidth >> scale
                let ny = r * tileWidth >> scale
                for (let i = 0; i < tile.width; i += 1 << scale) {
                    for (let j = 0; j < tile.height; j += 1 << scale) {
                        if (tile.getPixel(i, j) != 0) {
                            minimap.setPixel(nx + (i >> scale), ny + (j >> scale), tile.getPixel(i, j))
                        }
                    }
                }
            }
        }

        minimap.minimapScale = scale;
        
        return minimap
    }
} 