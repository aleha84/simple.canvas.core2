class PerfectPixel {
    constructor(options = {}){
        assignDeep(this, {}, options)

        if(this.context === undefined){
            console.trace();
            throw 'PerfectPixel -> context is not defined';
        }

        this.ctx = this.context;
    }
    setPixel(x, y){
        this.ctx.fillRect(x,y, 1,1);
    }

    lineV2(p1, p2){
        if(!p1 || !(p1 instanceof Vector2)){
			console.trace();
            throw 'PerfectPixel.lineV2 -> p1 must be V2 instance';
        }
        
        if(!p2 || !(p2 instanceof Vector2)){
			console.trace();
            throw 'PerfectPixel.lineV2 -> p2 must be V2 instance';
        }
        
        this.line(p1.x, p1.y, p2.x, p2.y);
    }

    line(x0, y0, x1, y1){
        x0 = fastRoundWithPrecision(x0, 0);
        y0 = fastRoundWithPrecision(y0, 0);
        x1 = fastRoundWithPrecision(x1, 0);
        y1 = fastRoundWithPrecision(y1, 0);
        var dx = Math.abs(x1-x0);
        var dy = Math.abs(y1-y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx-dy;
     
        while(true){
          this.setPixel(x0,y0);  // Do what you need to for this
     
          if ((x0==x1) && (y0==y1)) break;
          var e2 = 2*err;
          if (e2 >-dy){ err -= dy; x0  += sx; }
          if (e2 < dx){ err += dx; y0  += sy; }
        }
     }

}

var PP = PerfectPixel;