class Game {
    private static GAME_WIDTH: number = 1280;
    private static GAME_HEIGHT: number = 720;

    private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private rendererOptions: PIXI.RendererOptions;
    private ticker: PIXI.ticker.Ticker;
    private stage: PIXI.Container;
    private mainUI: MainPage;

    constructor() {

    }

    public init(): void {
        this.initView();
        this.initAssets();
    }

    private initView(): void {
        this.rendererOptions = {
            backgroundColor: 0x000000
        }

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

    private initAssets(): void {
        PIXI.loader.add(SharedConfig.TEXTURES_ASSETS_LIST).load((data: any) => this.onAssetsLoaded(data));
    }

    private onAssetsLoaded(data: any): void {
        this.mainUI.init();
    }

    private render(): void {
        this.renderer.render(this.stage);
    }

    private resize(): void {
        const ratio = Math.min(window.innerWidth / Game.GAME_WIDTH, window.innerHeight / Game.GAME_HEIGHT);
        this.stage.scale.x = this.stage.scale.y = ratio;
        this.renderer.resize(Math.ceil(Game.GAME_WIDTH * ratio), Math.ceil(Game.GAME_HEIGHT * ratio));
    }
}