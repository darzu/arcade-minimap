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
    // TODO: cannot extend native interfaces (https://github.com/microsoft/pxt/issues/6859),
    //      would prefer to extend Image
    export interface Minimap {
        image: Image;
        scale: MinimapScale;
    }

    function renderScaledImage(source: Image, destination: Image, x: number, y: number, scale: MinimapScale) {
        const tile = source
        for (let i = 0; i < source.width; i += 1 << scale) {
            for (let j = 0; j < source.height; j += 1 << scale) {
                if (source.getPixel(i, j) != 0) {
                    destination.setPixel(x + (i >> scale), y + (j >> scale), source.getPixel(i, j))
                }
            }
        }
    }

    //% block="minimap || %scale scale"
    //% blockId="create_minimap"
    //% scale.defl=MinimapScale.Half
    export function minimap(scale: MinimapScale = MinimapScale.Half): Minimap {
        const tilemap = game.currentScene().tileMap;

        const numRows = tilemap.areaHeight() >> tilemap.scale
        const numCols = tilemap.areaWidth() >> tilemap.scale
        const tileWidth = 1 << tilemap.scale

        const minimap: Image = image.create(
            numCols * tileWidth >> scale, 
            numRows * tileWidth >> scale)

        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                const idx = tilemap.getTileIndex(c, r)
                const tile = tilemap.getTileImage(idx)
                const nx = c * tileWidth >> scale
                const ny = r * tileWidth >> scale
                renderScaledImage(tile, minimap, nx, ny, scale);
            }
        }

        // TODO: https://github.com/microsoft/pxt/issues/6859
        // minimap.minimapScale = scale;
        
        return {
            image: minimap,
            scale: scale
        }
    }

    //% block="$minimap image"
    //% minimap.shadow=create_minimap
    export function getImage(minimap: Minimap): Image {
        return minimap.image
    }

    //% block="draw $sprite on $minimap"
    //% minimap.shadow=variables_get
    //% minimap.defl=minimap
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    export function includeSprite(minimap: Minimap, sprite: Sprite) {
        const scale = minimap.scale
        renderScaledImage(sprite.image, minimap.image, sprite.left >> scale, sprite.top >> scale, scale);
    }
} 