//% color=#cfab0c icon="\uf278"
//% groups='["Images"]'
namespace minimap {
    //% block
    function minimap() {
        let tilemap = game.currentScene().tileMap;
        return tilemap.getTileImage(0)
    }
} 