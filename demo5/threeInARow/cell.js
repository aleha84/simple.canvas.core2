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

    checkIndexInBoard(){
        return  this.index.x >= 0 && this.index.x < this.board.columns
            && this.index.y >= 0 && this.index.y < this.board.rows;
    }

    downHandler(){
        if(!this.checkIndexInBoard())
            return;

         this.board.selectedCell = this;
    }

    upHandler() {
        if(!this.checkIndexInBoard()){
            this.board.selectedCell = undefined;
            return;
        }

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

    removeContent(go, setDead = false) {
        this.content = undefined;
        this.removeChild(go);
        if(setDead){
            go.setDead();
        }
    }

    internalRender(){
        if(!this.highlight)
            return;

        let ctx = this.context;
        let hbw = SCG.viewport.scale /2;
        let prevLineWidth = ctx.lineWidth;
        let prevStrokeStyle = ctx.strokeStyle;
        ctx.lineWidth = 2*SCG.viewport.scale;
        if(this.fallSide === 'top')
            ctx.strokeStyle = 'blue';
        else if(this.fallSide === 'bottom')
            ctx.strokeStyle = 'red';
        else if(this.fallSide === 'left')
            ctx.strokeStyle = 'green';
        else if(this.fallSide === 'right')
            ctx.strokeStyle = 'yellow';

        ctx.beginPath();
        ctx.moveTo(this.renderBox.topLeft.x + hbw, this.renderBox.topLeft.y + hbw);
        ctx.lineTo(this.renderBox.topRight.x - hbw, this.renderBox.topRight.y + hbw);
        ctx.lineTo(this.renderBox.bottomRight.x - hbw, this.renderBox.bottomRight.y - hbw);
        ctx.lineTo(this.renderBox.bottomLeft.x + hbw, this.renderBox.bottomLeft.y - hbw);
        ctx.closePath();
        ctx.stroke();

        ctx.lineWidth = prevLineWidth;
        ctx.strokeStyle = prevStrokeStyle;
    }
}

let typeTodspMap = {
    type01: new V2(0,0),type02: new V2(275,0),type03: new V2(550,0),type04: new V2(825,0),type05: new V2(1100,0),type06: new V2(1375,0),
    type07: new V2(0,275),type08: new V2(275,275),type09: new V2(550,275),type10: new V2(825,275),type11: new V2(1100,275),type12: new V2(1375,275)
}

class CellContent extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            tileOptimization: true,
            speed: 2,
            imgPropertyName: 'crystals',
            destSourceSize: new V2(275,275)
        }, options);

        if(!options.cellType)
            throw 'Cell type is undefined';

        super(options);
        this.destSourcePosition = typeTodspMap[this.cellType];
        //this.type = options.color;
    }

    destinationCompleteCallBack(){
        this.parent.removeChild(this);
        this.newParent.addContent(this);
        this.newParent = undefined;

        this.position = new V2();
        this.needRecalcRenderProperties = true;
        
        this.parent.board.transitionCompleted(this);
    }

    // internalPreRender(){
    //     let ctx = this.context;
    //     let prevFillStyle = ctx.fillStyle;
    //     ctx.fillStyle = this.color;

    //     ctx.beginPath();
    //     ctx.moveTo(this.renderBox.topLeft.x,this.renderBox.topLeft.y);
    //     ctx.lineTo(this.renderBox.topRight.x,this.renderBox.topRight.y);
    //     ctx.lineTo(this.renderBox.bottomRight.x,this.renderBox.bottomRight.y);
    //     ctx.lineTo(this.renderBox.bottomLeft.x,this.renderBox.bottomLeft.y);
    //     ctx.closePath();
    //     ctx.fill();

    //     ctx.fillStyle = prevFillStyle;
    // }
}