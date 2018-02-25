class MainPage {
    private stage: PIXI.Container;
    private background: Background;
    private gameField: GameField;
    private playButton: Button;
    private counter: Counter;

    constructor(stage: PIXI.Container) {
        this.stage = stage;
    }

    public create(): void {
        // init background
        this.background = new Background(this.stage);
        this.stage.addChild(this.background);
        //init game field
        this.gameField = new GameField();
        this.gameField.x = 190;
        this.gameField.y = 55;
        this.stage.addChild(this.gameField);
        //init play button
        this.playButton = new Button(SharedConfig.textureByName(Textures.BUTTON_START_TEXTURE_NAME));
        this.playButton.x = 1020;
        this.playButton.y = 677;
        this.stage.addChild(this.playButton);
        //init counter
        this.counter = new Counter();
        this.counter.x = 220;
        this.counter.y = 680;
        this.stage.addChild(this.counter);

        SharedConfig.gameController.init(this.gameField, this.counter, this.playButton);
    }
}