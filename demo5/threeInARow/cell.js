class Cell extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {  
            handlers: {
                // move: () => this.moveHandler()
                down: () => this.downHandler(),
                up: () => this.upHandler()
            }      
        }, options);

        super(options);
    }

    downHandler(){
         this.board.selectedCell = this;
    }

    upHandler() {
        if(this.board.selectedCell == this){
            this.board.selectedCell = undefined;
            return;
        }
        
        console.log(`from ${this.board.selectedCell.index} to ${this.index}`);
        //this.board.selectedCell.content.setDestination(new V2(this.size.x,0));
        this.board.swap(this.board.selectedCell, this);
        this.board.selectedCell = undefined;
    }

    addContent(go){
        this.content = go;
        this.addChild(go);
    }

    removeContent(go) {
        this.content = undefined;
        this.removeChild(go);
    }
}

class CellContent extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            tileOptimization: true,
            speed: 1
        }, options);

        if(!options.color)
            throw 'Cell color is undefined';

        super(options);
    }

    destinationCompleteCallBack(){
        this.parent.removeChild(this);
        this.newParent.addContent(this);
        this.newParent = undefined;

        this.position = new V2();
        this.needRecalcRenderProperties = true;
        
        this.parent.board.transitionCompleted(this);
    }

    internalPreRender(){
        let ctx = this.context;
        let prevFillStyle = ctx.fillStyle;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(this.renderBox.topLeft.x,this.renderBox.topLeft.y);
        ctx.lineTo(this.renderBox.topRight.x,this.renderBox.topRight.y);
        ctx.lineTo(this.renderBox.bottomRight.x,this.renderBox.bottomRight.y);
        ctx.lineTo(this.renderBox.bottomLeft.x,this.renderBox.bottomLeft.y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = prevFillStyle;
    }
}