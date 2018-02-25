class DisplayObject {
    private _view: PIXI.Sprite = new PIXI.Sprite();
    protected stage: PIXI.Container;

    constructor(stage: PIXI.Container) {
        this.stage = stage;
    }

    get view(): PIXI.Sprite {
        return this._view;
    }

}