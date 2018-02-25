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
        fetch(this.dataUrl + '?action=bet&bet=' + bet,
            {
                method: 'get',
                headers: {'Access-Control-Allow-Origin': '*'}
            }).then(response => {
            return response.json();
        }).then(responseData => {
            this.fieldData = responseData;

            let tmp: any = String(this.fieldData.board).split(',');
            this.fieldData.board = _.chunk(tmp, 3);

            this.gameField.initCompleteAnimationState(this.fieldData);
        }).catch(error => {
            this.fieldData = {
                "bet": 10,
                "win": 600,
                "board": "7,8,6,2,8,10,8,10,8,6,4,8,3,8,3",
                "winlines": [
                    "16~300~1,4,6",
                    "17~600~1,4,8,11,13"
                ]
            };

            let tmp: any = String(this.fieldData.board).split(',');
            this.fieldData.board = _.chunk(tmp, 3);

            this.gameField.initCompleteAnimationState(this.fieldData);
        });
    }
}