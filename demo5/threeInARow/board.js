class Board extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            rows: 8,
            columns: 8,
            borderWidth: 2,
        }, options);

        if(options.rows % 2 !== 0 || options.columns % 2 !== 0)
            throw 'Rows or Columns must be even'

        super(options);

        this.transition = false;
        this.colors = [
            'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'gray' 
        ]

        let innerWidth = this.size.x - this.borderWidth*2;
        let innerHeight = this.size.y - this.borderWidth*2

        this.cellSize = new V2(innerWidth/this.columns, innerHeight/this.rows);
        this.cells = [];
        let startPosition = new V2((-innerWidth/2) + this.cellSize.x/2, (-innerHeight/2) + this.cellSize.y/2);

        for(let ri = 0; ri<this.rows; ri++){
            this.cells[ri] = [];
            for(let ci = 0;ci < this.columns;ci++){
                let cell = new Cell({
                    size: this.cellSize,
                    position: startPosition.add(new V2(this.cellSize.x*ci, this.cellSize.y*ri)),
                    index: new V2(ci, ri),
                    board: this
                });

                cell.addChild(new CellContent({
                    size: this.cellSize,
                    color: this.colors[getRandomInt(0,this.colors.length-1)],
                    position: new V2()
                }))

                this.addChild(cell);
                this.cells[ri][ci] = cell;
            }
        }
    }

    downHandler(){
        console.log('downHandler');
    }

    upHandler(){
        console.log('upHandler');
    }

    moveHandler(){
        for(let ri = 0; ri<this.rows; ri++){
            for(let ci = 0;ci < this.columns;ci++){
                let cell = this.cells[ri][ci];
                if(cell.box.isPointInside(SCG.controls.mouse.state.logicalPosition)){
                    
                }
            }
        }
    }

    internalPreRender(){
        let ctx = this.context;
        let hbw = this.borderWidth*SCG.viewport.scale /2;
        let prevLineWidth = ctx.lineWidth;
        let prevStrokeStyle = ctx.strokeStyle;
        ctx.lineWidth = this.borderWidth*SCG.viewport.scale;
        ctx.strokeStyle = 'gold';
        
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