class Cell extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {        
        }, options);

        super(options);
    }
}

class CellContent extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            
        }, options);

        if(!options.color)
            throw 'Cell color is undefined';

        super(options);
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