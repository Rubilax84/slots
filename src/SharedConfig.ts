///<reference path="controller/GameController.ts"/>
enum Textures {
    BACKGROUND_TEXTURE_NAME = "./assets/background.png",
    BUTTON_PLUS_TEXTURE_NAME = "./assets/btn_plus.png",
    BUTTON_MINUS_TEXTURE_NAME = "./assets/btn_minus.png",
    BUTTON_START_TEXTURE_NAME = "./assets/btn_start.png"
}

interface FieldData {
    bet: number,
    win: number,
    board: any,
    winlines: string[]
}

class SharedConfig {
    public static gameController: GameController = new GameController();

    public static TEXTURES_ASSETS_LIST: string[] = [
        "./assets/1.png",
        "./assets/2.png",
        "./assets/3.png",
        "./assets/4.png",
        "./assets/5.png",
        "./assets/6.png",
        "./assets/7.png",
        "./assets/8.png",
        "./assets/9.png",
        "./assets/10.png",
        "./assets/background.png",
        "./assets/btn_minus.png",
        "./assets/btn_start.png",
        "./assets/btn_plus.png"
    ];

    public static reelStopSound: Function = () => {
        return new Audio('./assets/reelstop.mp3');
    };

    public static bellSound: Function = () => {
        return new Audio('./assets/bell.mp3');
    };

    public static textureByName(textureName: string): PIXI.Texture {
        return PIXI.loader.resources[textureName].texture;
    }

    public static itemTextureByID(id: number): PIXI.Texture {
        return PIXI.loader.resources['./assets/' + id + '.png'].texture;
    }

    public static GAME_LINES_COUNT: number = 5;
}