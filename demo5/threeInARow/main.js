class ThreeInARowScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options);

        this.events = { 
            up: this.upHandler.bind(this),
            down: this.downHandler.bind(this),
            move: this.moveHandler.bind(this)
        }

        this.board = new Board({
            size: new V2(300,300),
            position: new V2(this.space.x/2, this.space.y/2)
        })

        this.addGo(this.board);
    }

    downHandler(){
        if(this.board.box.isPointInside(SCG.controls.mouse.state.logicalPosition)){
            this.board.downHandler();
        }
    }

    upHandler(){
        if(this.board.box.isPointInside(SCG.controls.mouse.state.logicalPosition)){
            this.board.upHandler();
        }
    }

    moveHandler(){
        if(this.board.box.isPointInside(SCG.controls.mouse.state.logicalPosition)){
            this.board.moveHandler();
        }
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}