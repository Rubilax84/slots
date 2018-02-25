class Button extends PIXI.Sprite {

    private _onClick: Function;
    set onClick(value: Function) {
        this._onClick = value;
    }

    constructor(texture: PIXI.Texture) {
        super();

        this.texture = texture;

        this.buttonMode = true;
        this.anchor.set(0.5);
        this.x = 0;
        this.y = 0;
        this.interactive = true;

        this.on('pointerdown', (event: any) => this.pointerEvent(event))
            .on('pointerup', (event: any) => this.pointerEvent(event))
            .on('pointerupoutside', (event: any) => this.pointerEvent(event))
            .on('pointerover', (event: any) => this.pointerEvent(event))
            .on('pointerout', (event: any) => this.pointerEvent(event));
    }

    private pointerEvent(event: ButtonEvent): void {
        switch (event.type) {
            case 'pointerover': {
                this.onOver(event);
                break;
            }
            case 'pointerout': {
                this.onOut(event);
                break;
            }
            case 'pointerdown': {
                this.onDown(event);
                break;
            }
            case 'pointerup': {
                this.onUp(event);
                this._onClick && this._onClick.apply(this, [event]);
                break;
            }
        }
    }

    protected onOver(event: ButtonEvent): void {
        this.scale.x = 1.05;
        this.scale.y = 1.05;
    }

    protected onOut(event: ButtonEvent): void {
        this.scale.x = 1.0;
        this.scale.y = 1.0;
    }

    protected onDown(event: ButtonEvent): void {
        this.scale.x = 0.95;
        this.scale.y = 0.95;
    }

    protected onUp(event: ButtonEvent): void {
        this.scale.x = 1.05;
        this.scale.y = 1.05;
    }
}