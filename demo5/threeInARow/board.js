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

        this.transitions = [];
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

                let content = new CellContent({
                    size: this.cellSize,
                    color: this.colors[getRandomInt(0,this.colors.length-1)],
                    position: new V2()
                });

                cell.addContent(content);
                // cell.content = content;
                // cell.addChild(content)

                this.addChild(cell, true);
                this.cells[ri][ci] = cell;
            }
        }
    }

    swap(fromCell, toCell){
        if(this.transitions.length)
            return;

        let destinationCell = undefined;
        let fromContentDestination = undefined;
        let toContentDestination = undefined;
        if(fromCell.index.x < toCell.index.x){
            // go right
            destinationCell = this.cells[fromCell.index.y][fromCell.index.x+1];
            fromContentDestination = new V2(this.cellSize.x, 0);
            toContentDestination = new V2(-this.cellSize.x, 0)
        }
        else if(fromCell.index.x > toCell.index.x){
            // go left
            destinationCell = this.cells[fromCell.index.y][fromCell.index.x-1];
            fromContentDestination = new V2(-this.cellSize.x, 0);
            toContentDestination = new V2(this.cellSize.x, 0)
        }
        else if (fromCell.index.y < toCell.index.y){   
            //go bottom
            destinationCell = this.cells[fromCell.index.y+1][fromCell.index.x];
            fromContentDestination = new V2(0, this.cellSize.y);
            toContentDestination = new V2(0, -this.cellSize.y)
        }
        else if (fromCell.index.y > toCell.index.y){
            //go up
            destinationCell = this.cells[fromCell.index.y-1][fromCell.index.x];
            fromContentDestination = new V2(0, -this.cellSize.y);
            toContentDestination = new V2(0, this.cellSize.y)
        }

        fromCell.content.newParent = destinationCell;
        fromCell.content.setDestination(fromContentDestination);
        this.transitions.push(fromCell.content);
        destinationCell.content.newParent = fromCell;
        destinationCell.content.setDestination(toContentDestination);
        this.transitions.push(destinationCell.content);
    }

    transitionCompleted(content) {
        let index  = this.transitions.indexOf(content);
        if(index > -1)
            this.transitions.splice(index, 1);

        if(this.transitions.length){
            return;
        }

        // todo here: check for lines
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