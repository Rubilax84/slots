class FieldLine extends PIXI.Container {
    private _lineID: number = -1;
    private _itemsList: LineElement[] = new Array(6);
    private _tween: any;

    constructor(lineID: number) {
        super();
        this._lineID = lineID;

        this.initItems();
    }

    private initItems(): void {
        _.fill(this._itemsList, 0);
        this._itemsList.forEach((element, index) => {
            const item: LineElement = new LineElement();
            this._itemsList[index] = item;
            this.addChild(item);
        });

        this.resetItemsPositions();
        this.y = 0;
    }

    private resetItemsPositions(): void {
        this._itemsList.forEach((element, index) => {
            element.y = (element.height + 22.5) * index;
        });
    }

    private resetLineElements(list: LineElement[], value: string[] = null): void {
        list.forEach((element: LineElement, index: number) => {
            element.reset(value ? parseInt(value[index]) : 0);
        });
    }

    public animate(): void {
        this._tween = TweenMax.to(this, 0.4, {
            y: 0, ease: Power0.easeNone,
            onRepeat: () => {
                this.rebuildLine();
            },
            onComplete: () => {
                this.rebuildLine();
                this.stop();
            },
            repeat: 4
        });
    }

    public stop(): void {
        TweenMax.to(this, 0.5, {
            y: 0, ease: Power0.easeNone,
            onComplete: () => {
                console.log(this.y);
                this.rebuildLine();
            }
        });
    }

    public rebuildLine(value: string[] = null): void {
        let tmp: any = _.chunk(this._itemsList, 3).reverse();
        this.resetLineElements(tmp[0], value);
        this._itemsList = _.flatten(tmp);
        this.resetItemsPositions();

        this.y = -590;
    }

    public getLinesOnField(): LineElement[] {
        return _.chunk(this._itemsList, 3)[0];
    }

    get lineID(): number {
        return this._lineID;
    }

    set lineID(value: number) {
        this._lineID = value;
    }
}