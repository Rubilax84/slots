class GameController {
    private gameField: GameField;
    private counter: Counter;
    private spinButton: Button;

    private dataUrl: string = "http://shit.url.ph/gs/";
    private fieldData: FieldData;

    constructor() {
    }

    public init(field: GameField, counter: Counter, spinButton: Button): void {
        this.gameField = field;
        this.counter = counter;

        this.spinButton = spinButton;
        this.spinButton.onClick = (event: ButtonEvent) => this.startGame(event);
    }

    public startGame(event: ButtonEvent): void {
        if (!(this.gameField.state == GameFieldState.GAME_PENDING)) return;

        this.gameField.startGame();
        this.getFieldData(this.counter.value);
    }

    private getFieldData(bet: number): void {
        const requestURL: string = "https://cors-anywhere.herokuapp.com/" + this.dataUrl + `?action=bet&bet=${bet}`;
        const requestInit: any = {
            method: 'get',
            headers: {'Access-Control-Allow-Origin': '*'}
        };

        fetch(requestURL, requestInit
        ).then(response => {
            return response.json();
        }).then(responseData => {
            console.log(JSON.stringify(responseData));
            this.onFieldDate(responseData);
        }).catch(error => {
            const testData: any = {
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

    private onFieldDate(data: any): void {
        this.fieldData = data;
        this.fieldData.board = _.chunk(String(this.fieldData.board).split(','), 3);

        this.gameField.initCompleteAnimationState(this.fieldData);
    }
}