declare const TweenMax: any;
declare const Power0: any;
declare const TimelineMax: any;

enum GameFieldState {
    SPIN_STARTED,
    COMPLETING_SPIN,
    SPIN_COMPLETED,
    SHOW_REWARDS_STATE,
    GAME_PENDING
}

class GameField extends PIXI.Container {

    public state: GameFieldState = GameFieldState.GAME_PENDING;

    private _maskShape: PIXI.Graphics;
    private _lines: FieldLine[] = [];
    private tween: any;
    private tweens: any[] = [];

    private fieldData: FieldData;
    private animationSpeed: number = 0.3;

    constructor() {
        super();

        this._maskShape = new PIXI.Graphics();
        this._maskShape.beginFill(0x000000, 1);
        this._maskShape.drawRect(0, 0, 900, 570);
        this._maskShape.endFill();
        this.addChild(this._maskShape);

        this.mask = this._maskShape;

        this.reset();
    }

    private reset(): void {
        let line: FieldLine;
        this._lines = [];

        for (let i = 0; i < SharedConfig.GAME_LINES_COUNT; i++) {
            line = new FieldLine(i);
            line.x = (line.width + 5) * i;
            this.addChild(line);
            this._lines.push(line);
        }
    }

    public startGame(): void {
        this.state = GameFieldState.SPIN_STARTED;
        this.startFieldAnimation();
    }

    private startFieldAnimation(): void {
        this.tweens = [];

        this._lines.forEach((element: FieldLine) => {
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

    private startCompleteAnimation(line: FieldLine): void {
        const lineIndex: number = this._lines.indexOf(line);
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
            repeat: 1
        });
    }

    public initCompleteAnimationState(data: FieldData): void {
        this.fieldData = data;
        this.state = GameFieldState.COMPLETING_SPIN;

        this.tweens.forEach((tween: any, index: number) => {
            tween.repeat(index * 2);
        });
    }

    private initRewardState(): void {
        this.state = GameFieldState.SHOW_REWARDS_STATE;
        if (this.fieldData.winlines.length) {

            const timeLine: any = new TimelineMax({onComplete: () => this.setPendingSate()});

            this.fieldData.winlines.forEach((data: any) => {
                const winData: any = data.split('~')[2].split(',');
                const itemsOnFiled: LineElement[] = this.getItemsList();

                let list: LineElement[] = itemsOnFiled.filter((element: LineElement, index: number): boolean => {
                    return (winData.indexOf(index.toString()) == -1);
                });

                timeLine.add(TweenMax.to(list, 0.8, {alpha: 0.3, onStart: () => SharedConfig.bellSound().play()}));
                timeLine.add(TweenMax.to(list, 0.2, {alpha: 1, delay: 1.0}));
            });
        } else {
            this.setPendingSate();
        }
    }

    private setPendingSate(): void {
        this.state = GameFieldState.GAME_PENDING;
    }

    private getItemsList(): LineElement[] {
        const list: any = [];

        this._lines.forEach((line: FieldLine) => {
            list.push(line.getLinesOnField());
        });

        return _.flatten(list);
    }
}


