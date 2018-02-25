class Game {
    constructor() {
    }
    init() {
        this.initView();
        this.initAssets();
    }
    initView() {
        this.rendererOptions = {
            backgroundColor: 0x000000
        };
        this.renderer = PIXI.autoDetectRenderer(Game.GAME_WIDTH, Game.GAME_HEIGHT, this.rendererOptions);
        document.body.appendChild(this.renderer.view);
        this.stage = new PIXI.Container();
        this.mainUI = new MainPage(this.stage);
        this.ticker = PIXI.ticker.shared;
        this.ticker.autoStart = true;
        this.ticker.add(this.render, this);
        window.addEventListener("resize", () => this.resize());
        this.resize();
    }
    initAssets() {
        PIXI.loader.add(SharedConfig.TEXTURES_ASSETS_LIST).load((data) => this.onAssetsLoaded(data));
    }
    onAssetsLoaded(data) {
        this.mainUI.create();
    }
    render() {
        this.renderer.render(this.stage);
    }
    resize() {
        const ratio = Math.min(window.innerWidth / Game.GAME_WIDTH, window.innerHeight / Game.GAME_HEIGHT);
        this.stage.scale.x = this.stage.scale.y = ratio;
        this.renderer.resize(Math.ceil(Game.GAME_WIDTH * ratio), Math.ceil(Game.GAME_HEIGHT * ratio));
    }
}
Game.GAME_WIDTH = 1280;
Game.GAME_HEIGHT = 720;
class GameController {
    constructor() {
        this.dataUrl = "http://shit.url.ph/gs/";
    }
    init(field, counter, spinButton) {
        this.gameField = field;
        this.counter = counter;
        this.spinButton = spinButton;
        this.spinButton.onClick = (event) => this.startGame(event);
    }
    startGame(event) {
        if (!(this.gameField.state == GameFieldState.GAME_PENDING))
            return;
        this.gameField.startGame();
        this.getFieldData(this.counter.value);
    }
    getFieldData(bet) {
        const requestURL = this.dataUrl + `?action=bet&bet=${bet}`;
        const requestInit = {
            method: 'get',
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
        fetch(requestURL, requestInit).then(response => {
            return response.json();
        }).then(responseData => {
            this.onFieldDate(responseData);
        }).catch(error => {
            const testData = {
                "bet": 10,
                "win": 600,
                "board": "7,8,6,2,8,10,8,10,8,6,4,8,3,8,3",
                "winlines": [
                    "16~300~1,4,6",
                    "17~600~1,4,8,11,13"
                ]
            };
            this.onFieldDate(testData);
        });
    }
    onFieldDate(data) {
        this.fieldData = data;
        this.fieldData.board = _.chunk(String(this.fieldData.board).split(','), 3);
        this.gameField.initCompleteAnimationState(this.fieldData);
    }
}
var Textures;
(function (Textures) {
    Textures["BACKGROUND_TEXTURE_NAME"] = "./assets/background.png";
    Textures["BUTTON_PLUS_TEXTURE_NAME"] = "./assets/btn_plus.png";
    Textures["BUTTON_MINUS_TEXTURE_NAME"] = "./assets/btn_minus.png";
    Textures["BUTTON_START_TEXTURE_NAME"] = "./assets/btn_start.png";
})(Textures || (Textures = {}));
class SharedConfig {
    static textureByName(textureName) {
        return PIXI.loader.resources[textureName].texture;
    }
    static itemTextureByID(id) {
        return PIXI.loader.resources['./assets/' + id + '.png'].texture;
    }
}
SharedConfig.gameController = new GameController();
SharedConfig.TEXTURES_ASSETS_LIST = [
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
SharedConfig.reelStopSound = () => {
    return new Audio('./assets/reelstop.mp3');
};
SharedConfig.bellSound = () => {
    return new Audio('./assets/bell.mp3');
};
SharedConfig.GAME_LINES_COUNT = 5;
class MainPage {
    constructor(stage) {
        this.stage = stage;
    }
    create() {
        this.background = new Background(this.stage);
        this.stage.addChild(this.background);
        this.gameField = new GameField();
        this.gameField.x = 190;
        this.gameField.y = 55;
        this.stage.addChild(this.gameField);
        this.playButton = new Button(SharedConfig.textureByName(Textures.BUTTON_START_TEXTURE_NAME));
        this.playButton.x = 1020;
        this.playButton.y = 677;
        this.stage.addChild(this.playButton);
        this.counter = new Counter();
        this.counter.x = 220;
        this.counter.y = 680;
        this.stage.addChild(this.counter);
        SharedConfig.gameController.init(this.gameField, this.counter, this.playButton);
    }
}
class Button extends PIXI.Sprite {
    set onClick(value) {
        this._onClick = value;
    }
    constructor(texture) {
        super();
        this.texture = texture;
        this.buttonMode = true;
        this.anchor.set(0.5);
        this.x = 0;
        this.y = 0;
        this.interactive = true;
        this.on('pointerdown', (event) => this.pointerEvent(event))
            .on('pointerup', (event) => this.pointerEvent(event))
            .on('pointerupoutside', (event) => this.pointerEvent(event))
            .on('pointerover', (event) => this.pointerEvent(event))
            .on('pointerout', (event) => this.pointerEvent(event));
    }
    pointerEvent(event) {
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
    onOver(event) {
        this.scale.x = 1.05;
        this.scale.y = 1.05;
    }
    onOut(event) {
        this.scale.x = 1.0;
        this.scale.y = 1.0;
    }
    onDown(event) {
        this.scale.x = 0.95;
        this.scale.y = 0.95;
    }
    onUp(event) {
        this.scale.x = 1.05;
        this.scale.y = 1.05;
    }
}
class Background extends PIXI.Sprite {
    constructor(stage) {
        super();
        this.texture = SharedConfig.textureByName(Textures.BACKGROUND_TEXTURE_NAME);
        this.anchor.set(0.0, 0.0);
        this.x = 0;
        this.y = 0;
    }
}
class Counter extends PIXI.Container {
    constructor() {
        super();
        this._value = 1;
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
    align() {
        this.minusButton.x = 0;
        this.plusButton.x = this.minusButton.width + 50;
        this.counterTextField.anchor.set(0.5);
        this.counterTextField.x = 60;
    }
    update() {
        this.counterTextField.text = this._value.toString();
    }
    incCounter(event = null) {
        this._value++;
        this.update();
    }
    decCounter(event = null) {
        this._value = Math.max(1, --this._value);
        this.update();
    }
    get value() {
        return this._value;
    }
}
class FieldLine extends PIXI.Container {
    constructor(lineID) {
        super();
        this._lineID = -1;
        this._itemsList = new Array(6);
        this._lineID = lineID;
        this.initItems();
    }
    initItems() {
        _.fill(this._itemsList, 0);
        this._itemsList.forEach((element, index) => {
            const item = new LineElement();
            this._itemsList[index] = item;
            this.addChild(item);
        });
        this.resetItemsPositions();
        this.y = 0;
    }
    resetItemsPositions() {
        this._itemsList.forEach((element, index) => {
            element.y = (element.height + 22.5) * index;
        });
    }
    resetLineElements(list, value = null) {
        list.forEach((element, index) => {
            element.reset(value ? parseInt(value[index]) : 0);
        });
    }
    rebuildLine(value = null) {
        let tmp = _.chunk(this._itemsList, 3).reverse();
        this.resetLineElements(tmp[0], value);
        this._itemsList = _.flatten(tmp);
        this.resetItemsPositions();
        this.y = -590;
    }
    getLinesOnField() {
        return _.chunk(this._itemsList, 3)[0];
    }
}
var GameFieldState;
(function (GameFieldState) {
    GameFieldState[GameFieldState["SPIN_STARTED"] = 0] = "SPIN_STARTED";
    GameFieldState[GameFieldState["COMPLETING_SPIN"] = 1] = "COMPLETING_SPIN";
    GameFieldState[GameFieldState["SPIN_COMPLETED"] = 2] = "SPIN_COMPLETED";
    GameFieldState[GameFieldState["SHOW_REWARDS_STATE"] = 3] = "SHOW_REWARDS_STATE";
    GameFieldState[GameFieldState["GAME_PENDING"] = 4] = "GAME_PENDING";
})(GameFieldState || (GameFieldState = {}));
class GameField extends PIXI.Container {
    constructor() {
        super();
        this.state = GameFieldState.GAME_PENDING;
        this._lines = [];
        this.tweens = [];
        this.animationSpeed = 0.3;
        this._maskShape = new PIXI.Graphics();
        this._maskShape.beginFill(0x000000, 1);
        this._maskShape.drawRect(0, 0, 900, 570);
        this._maskShape.endFill();
        this.addChild(this._maskShape);
        this.mask = this._maskShape;
        this.reset();
    }
    reset() {
        let line;
        this._lines = [];
        for (let i = 0; i < SharedConfig.GAME_LINES_COUNT; i++) {
            line = new FieldLine(i);
            line.x = (line.width + 5) * i;
            this.addChild(line);
            this._lines.push(line);
        }
    }
    startGame() {
        this.state = GameFieldState.SPIN_STARTED;
        this.startFieldAnimation();
    }
    startFieldAnimation() {
        this.tweens = [];
        this._lines.forEach((element) => {
            element.rebuildLine();
            this.tween = TweenMax.to(element, this.animationSpeed, {
                y: 0, ease: Power0.easeNone,
                onRepeat: () => {
                    element.rebuildLine();
                },
                onComplete: () => {
                    this.startCompleteAnimation(element);
                },
                repeat: -1
            });
            this.tweens.push(this.tween);
        });
    }
    startCompleteAnimation(line) {
        const lineIndex = this._lines.indexOf(line);
        line.rebuildLine();
        TweenMax.to(line, this.animationSpeed, {
            y: 0, ease: Power0.easeNone,
            onRepeat: () => {
                line.rebuildLine(this.fieldData ? this.fieldData.board[lineIndex] : null);
            },
            onComplete: () => {
                SharedConfig.reelStopSound().play();
                if (TweenMax.getAllTweens().length == 0) {
                    this.initRewardState();
                }
            },
            repeat: 2
        });
    }
    initCompleteAnimationState(data) {
        this.fieldData = data;
        this.state = GameFieldState.COMPLETING_SPIN;
        this.tweens.forEach((tween, index) => {
            tween.repeat(index * 2);
        });
    }
    initRewardState() {
        this.state = GameFieldState.SHOW_REWARDS_STATE;
        if (this.fieldData.winlines.length) {
            const timeLine = new TimelineMax({ onComplete: () => this.setPendingSate() });
            this.fieldData.winlines.forEach((data) => {
                const winData = data.split('~')[2];
                const itemsOnFiled = this.getItemsList();
                let list = itemsOnFiled.filter((element, index) => {
                    if (winData.indexOf(index.toString()) == -1) {
                        return true;
                    }
                    return false;
                });
                timeLine.add(TweenMax.to(list, 0.6, {
                    alpha: 0.4, onComplete: () => {
                        SharedConfig.bellSound().play();
                    }
                }));
                timeLine.add(TweenMax.to(list, 0.2, { alpha: 1, delay: 1.5 }));
            });
        }
        else {
            this.setPendingSate();
        }
    }
    setPendingSate() {
        this.state = GameFieldState.GAME_PENDING;
    }
    getItemsList() {
        const list = [];
        this._lines.forEach((line) => {
            list.push(line.getLinesOnField());
        });
        return _.flatten(list);
    }
}
class LineElement extends PIXI.Sprite {
    constructor() {
        super();
        this.width = 175;
        this.height = 175;
        this.reset();
    }
    reset(itemID = 0) {
        this.texture = SharedConfig.itemTextureByID(itemID != 0 ? itemID : Math.ceil(Math.random() * 10));
    }
}
//# sourceMappingURL=game.js.map