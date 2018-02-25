interface ButtonEvent {
    stopped: boolean;
    target: any;
    currentTarget: any;
    data: {
        global: {
            x: number,
            y: number
        };
        identifier: string;
        originalEvent: PointerEvent
    };
    type: string;
}