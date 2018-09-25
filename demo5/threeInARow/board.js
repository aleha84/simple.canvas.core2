class Board extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            rows: 10,
            columns: 10,
            borderWidth: 2,
            useCustomFalling: false
        }, options);

        if(options.rows % 2 !== 0 || options.columns % 2 !== 0)
            throw 'Rows or Columns must be even'

        super(options);

        this.transitions = [];
        this.colors = [
            'type01', 'type02','type03','type04','type05','type06','type07','type09','type10','type11','type12'
        ]

        let innerWidth = this.size.x - this.borderWidth*2;
        let innerHeight = this.size.y - this.borderWidth*2

        this.cellSize = new V2(innerWidth/this.columns, innerHeight/this.rows);
        this.cells = [];
        let startPosition = new V2((-innerWidth/2) + this.cellSize.x/2, (-innerHeight/2) + this.cellSize.y/2);

        let delta = -1;

        for(let ri = -1; ri<this.rows+1; ri++){
            this.cells[ri] = [];
            for(let ci = -1;ci < this.columns+1;ci++){
                let fallSide = 'top';
                if(ci < delta) {
                    fallSide = 'left';
                }
                else if(ci >= this.columns-delta ){
                    fallSide = 'right';
                }
                else if(ri < this.rows/2){
                    fallSide = 'top'
                }
                else {
                    fallSide = 'bottom'
                }


                let cell = new Cell({
                    //highlight: true,
                    size: this.cellSize,
                    position: startPosition.add(new V2(this.cellSize.x*ci, this.cellSize.y*ri)),
                    index: new V2(ci, ri),
                    board: this,
                    fallSide: fallSide
                });

                if(ci >= 0 && ri >= 0 && ci < this.columns && ri < this.rows){
                    let type = this.colors[getRandomInt(0,this.colors.length-1)];
                    let content = new CellContent({
                        size: this.cellSize,
                        cellType: type,
                        //destSourcePosition: this.typeTodspMap[type],
                        position: new V2()
                    });

                    
    
                    cell.addContent(content);
                }

                this.addChild(cell, true);
                this.cells[ri][ci] = cell;
            }

            if(ri < (this.rows/2)-1 ){
                delta++;
            }
            else if(ri >= this.rows/2){
                delta--;
            }
        }

        let lines = this.getLines();
        for(let li = 0; li < lines.length; li++){
            let line = lines[li];
            let length = line.to[line.type] - line.from[line.type];
            for(let i = 0; i <= length; i++){
                let d = new V2();
                d[line.type] = i;
                let c = line.from.add(d);
                // this.cells[c.y][c.x].highlight = true;
                let affectedCell = this.cells[c.y][c.x];
                let neighborsTypes = [affectedCell.content.cellType];
                if(affectedCell.index.y > 0 && neighborsTypes.indexOf(this.cells[affectedCell.index.y-1][affectedCell.index.x].content.cellType) === -1){
                    neighborsTypes.push(this.cells[affectedCell.index.y-1][affectedCell.index.x].content.cellType)
                }

                if(affectedCell.index.y < this.rows-1 && neighborsTypes.indexOf(this.cells[affectedCell.index.y+1][affectedCell.index.x].content.cellType) === -1){
                    neighborsTypes.push(this.cells[affectedCell.index.y+1][affectedCell.index.x].content.cellType)
                }

                if(affectedCell.index.x > 0 && neighborsTypes.indexOf(this.cells[affectedCell.index.y][affectedCell.index.x-1].content.cellType) === -1){
                    neighborsTypes.push(this.cells[affectedCell.index.y][affectedCell.index.x-1].content.cellType)
                }

                if(affectedCell.index.x < this.columns-1 && neighborsTypes.indexOf(this.cells[affectedCell.index.y][affectedCell.index.x+1].content.cellType) === -1){
                    neighborsTypes.push(this.cells[affectedCell.index.y][affectedCell.index.x+1].content.cellType)
                }

                let filtered = this.colors.filter(function (item){ return neighborsTypes.indexOf(item) === -1 });
                //affectedCell.content.type = filtered[getRandomInt(0, filtered.length-1)];
                affectedCell.removeContent(affectedCell.content, true);
                affectedCell.addContent(new CellContent({
                    size: this.cellSize,
                    cellType: filtered[getRandomInt(0, filtered.length-1)],
                    position: new V2()
                }));
            }
        }

        if(this.getLines().length){
            console.log('Lines still exists');
        }
    }

    removeRow(rowNum) { 
        for(let ci = -1;ci < this.columns+1;ci++){
            this.cells[rowNum][ci].removeContent(this.cells[rowNum][ci].content);
        }

        this.cellsFalling();        
    }

    removeColumn(columnNum) { 
        for(let ri = -1;ri < this.columns+1;ri++){
            this.cells[ri][columnNum].removeContent(this.cells[ri][columnNum].content);
        }

        this.cellsFalling();        
    }

    swap(fromCell, toCell, fromOnly = false, ignoreTransition = false){
        if(fromOnly && fromCell.content === undefined){
            if(fromCell.children.length) {
                fromCell.content = fromCell.children[0];
            }
            else {
                return;
            }
        }
        
        if(ignoreTransition){
            // do nothing
        }
        else {
            if(this.transitions.length)
                return;
        }
        

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

        try{
            fromCell.content.newParent = destinationCell;
        }catch{
            console.log(fromCell, toCell);
            throw 'fromCell.content.newParent FAILED';
        }
        
        fromCell.content.setDestination(fromContentDestination);
        this.transitions.push(fromCell.content);
        if(!fromOnly) {
            destinationCell.content.newParent = fromCell;
            destinationCell.content.setDestination(toContentDestination);
            this.transitions.push(destinationCell.content);
        }
        // else {
        //     fromCell.content = undefined;
        // }
        
    }

    getLines(){
        let lines = [];
        let that = this;
        let innerCheck = function(ri, ci, checkField) {
            let cell = that.cells[ri][ci];
            if(!currentType) {
                currentType = cell.content.cellType;
                from = cell.index;
                to = cell.index;
            }
            else {
                if(currentType === cell.content.cellType){
                    to = cell.index;
                }
                else {
                    if(to[checkField] - from[checkField] >= 2){
                        lines.push({from: from, to: to, type: checkField});
                    }

                    currentType = cell.content.cellType;
                    from = cell.index;
                    to = cell.index;
                }
            }
        }

        let currentType = undefined;
        let from = undefined;
        let to = undefined;

        for(let ri = 0; ri< this.rows;ri++){
            for(let ci = 0; ci< this.columns;ci++){
                innerCheck(ri, ci, 'x');
            }

            if(to.x - from.x >= 2){
                lines.push({from: from, to: to, type: 'x'});
            }

            currentType = undefined;
            from = undefined;
            to = undefined;
        }

        for(let ci = 0; ci< this.columns;ci++){
            for(let ri = 0; ri< this.rows;ri++){
                innerCheck(ri, ci, 'y');
            }

            if(to.y - from.y >= 2){
                lines.push({from: from, to: to, type: 'y'});
            }

            currentType = undefined;
            from = undefined;
            to = undefined;
        }

        return lines;
    }

    checkLines(){      
        let lines = this.getLines();
        // for(let ri = 0; ri< this.rows;ri++){
        //     for(let ci = 0; ci< this.columns;ci++){
        //         this.cells[ri][ci].highlight = false;
        //     }
        // }

        for(let li = 0; li < lines.length; li++){
            let line = lines[li];
            let length = line.to[line.type] - line.from[line.type];

            for(let i = 0; i <= length; i++){
                let d = new V2();
                d[line.type] = i;
                let c = line.from.add(d);
                // this.cells[c.y][c.x].highlight = true;
                let affectedCell = this.cells[c.y][c.x];
                affectedCell.removeContent(affectedCell.content);
            }
        }

        if(lines.length){
            this.cellsFalling();
        }
    }

    cellsFalling() {
        //find holes 
        let holes = [];
        for(let ri = 0; ri< this.rows;ri++){
            for(let ci = 0; ci< this.columns;ci++){
                if(!this.cells[ri][ci].content)
                    holes.push(this.cells[ri][ci]);
            }
        }

        if(!holes.length)
            return;

        for(let hi = 0; hi < holes.length;hi++){
            let hole = holes[hi];
            
            if(!this.useCustomFalling){
                if(hole.index.y > 0 && !this.cells[hole.index.y-1][hole.index.x].content)
                    continue;
                
                for(let y = -1;y<=hole.index.y-1;y++){
                    if(y === -1){
                        this.cells[y][hole.index.x].addContent(new CellContent({
                            size: this.cellSize,
                            cellType: this.colors[getRandomInt(0,this.colors.length-1)],
                            position: new V2()
                        }));
                    }
                    this.swap(this.cells[y][hole.index.x],this.cells[y+1][hole.index.x],true, true);
                }
            }
            else {
                if(hole.fallSide === 'top'){
                    if(hole.index.y > 0 && !this.cells[hole.index.y-1][hole.index.x].content)
                        continue;
                    
                    for(let y = -1;y<=hole.index.y-1;y++){
                        if(y === -1){
                            this.cells[y][hole.index.x].addContent(new CellContent({
                                size: this.cellSize,
                                cellType: this.colors[getRandomInt(0,this.colors.length-1)],
                                position: new V2()
                            }));
                        }
                        this.swap(this.cells[y][hole.index.x],this.cells[y+1][hole.index.x],true, true);
                    }
                }
                else if(hole.fallSide === 'bottom'){
                    if(hole.index.y < this.rows-1 && !this.cells[hole.index.y+1][hole.index.x].content)
                        continue;
                    
                    for(let y = this.rows;y>=hole.index.y+1;y--){
                        if(y === this.rows){
                            this.cells[y][hole.index.x].addContent(new CellContent({
                                size: this.cellSize,
                                cellType: this.colors[getRandomInt(0,this.colors.length-1)],
                                position: new V2()
                            }));
                        }
                        this.swap(this.cells[y][hole.index.x],this.cells[y-1][hole.index.x],true, true);
                    }
                }
                else if(hole.fallSide === 'left'){
                    if(hole.index.x > 0 && !this.cells[hole.index.y][hole.index.x-1].content)
                        continue;
                    
                    for(let x = -1;x<=hole.index.x-1;x++){
                        if(x === -1){
                            this.cells[hole.index.y][x].addContent(new CellContent({
                                size: this.cellSize,
                                cellType: this.colors[getRandomInt(0,this.colors.length-1)],
                                position: new V2()
                            }));
                        }
                        this.swap(this.cells[hole.index.y][x],this.cells[hole.index.y][x+1],true, true);
                    }
                }
                else if(hole.fallSide === 'right'){
                    if(hole.index.x < this.columns-1 && !this.cells[hole.index.y][hole.index.x+1].content)
                        continue;
                    
                    for(let x = this.columns;x>=hole.index.x+1;x--){
                        if(x === this.columns){
                            this.cells[hole.index.y][x].addContent(new CellContent({
                                size: this.cellSize,
                                cellType: this.colors[getRandomInt(0,this.colors.length-1)],
                                position: new V2()
                            }));
                        }
                        this.swap(this.cells[hole.index.y][x],this.cells[hole.index.y][x-1],true, true);
                    }
                }
            }
            
            
        }
    }
    
    transitionCompleted(content) {
        let index  = this.transitions.indexOf(content);
        if(index > -1)
            this.transitions.splice(index, 1);

        if(this.transitions.length){
            return;
        }

        this.cellsFalling();
        
        if(this.transitions.length){
            return;
        }

        this.checkLines()
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