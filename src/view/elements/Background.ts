class Background extends PIXI.Sprite {
    constructor(stage: PIXI.Container) {
        super();

        this.texture = SharedConfig.textureByName(Textures.BACKGROUND_TEXTURE_NAME);
        this.anchor.set(0.0, 0.0);
        this.x = 0;
        this.y = 0;
    }
}