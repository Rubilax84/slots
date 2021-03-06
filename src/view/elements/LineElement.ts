class LineElement extends PIXI.Sprite {
    constructor() {
        super();
        this.width = 175;
        this.height = 175;

        this.reset();
    }

    public reset(itemID: number = 0): void {
        this.texture = SharedConfig.itemTextureByID(itemID != 0 ? itemID : Math.ceil(Math.random() * 10));
    }
}