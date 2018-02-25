class Counter extends PIXI.Container {

    private plusButton: Button;
    private minusButton: Button;
    private counterTextField: PIXI.Text;
    private _value: number = 1;

    constructor() {
        super();

        this.plusButton = new Button(SharedConfig.textureByName(Textures.BUTTON_PLUS_TEXTURE_NAME));
        this.plusButton.onClick = () => this.incCounter();

        this.minusButton = new Button(SharedConfig.textureByName(Textures.BUTTON_MINUS_TEXTURE_NAME));
        this.minusButton.onClick = () => this.decCounter();

        this.counterTextField = new PIXI.Text(this._value.toString(), {
            fill: 0xffffff,
            fontSize: 40,
            fontFamily: "Arial",
            align: "left"
        });

        this.addChild(this.plusButton);
        this.addChild(this.minusButton);
        this.addChild(this.counterTextField);

        this.align();
    }

    private align(): void {
        this.minusButton.x = 0;

        this.plusButton.x = this.minusButton.width + 50;

        this.counterTextField.anchor.set(0.5);
        this.counterTextField.x = 60;
    }

    private update(): void {
        this.counterTextField.text = this._value.toString();
    }

    private incCounter(event: ButtonEvent = null): void {
        this._value++;
        this.update();
    }

    private decCounter(event: ButtonEvent = null): void {
        this._value = Math.max(1, --this._value);
        this.update();
    }

    public get value(): number {
        return this._value;
    }

}