class MetroTrainScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            vagons: [],
            vagonsMaxCount: 5
        }, options);

        super(options);
        // let colors = [0,0,255];
        let darkerBy = 5;
        let currentSize = new V2(this.space.y, this.space.y);
        for(let i = this.vagonsMaxCount; i >= 0; i--){
            let vagon = new MetroVagon({
                img: this.createVagonCanvas(darkerBy),
                position: new V2(this.space.x/2, this.space.y/2),
                size: currentSize.clone()
            });
            this.vagons[i] = vagon;
            this.addGo(vagon, i, false);
            // colors[0]+=colorsChangeDelta;
            // colors[1]+=colorsChangeDelta;
            // colors[2]-=colorsChangeDelta;
            darkerBy+=10;
            currentSize.mul(0.5, true);
        }

    }

    createVagonCanvas(makeDarkerBy = 5) {
        let width = this.space.y;
        let height = this.space.y;
        let center = new V2(width/2, height/2);
        let vagonCanvas =  document.createElement('canvas');
        vagonCanvas.width = width;
        vagonCanvas.height = height;
        let ctx = vagonCanvas.getContext('2d');
        // vagonContext.fillStyle = `rgb(${colors.join(',')})`;
        // vagonContext.fillRect(0,0,width, height);

        // vagonContext.clearRect(width/2-clearWidth/2, height/2-clearHeight/2, clearWidth, clearHeight);
        ctx.fillStyle = `rgb(${0+makeDarkerBy},${255-makeDarkerBy},${0+makeDarkerBy})`;
        ctx.beginPath();
        ctx.moveTo(0,0);ctx.lineTo(width,0);ctx.lineTo(center.x,center.y);ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0,height);ctx.lineTo(width,height);ctx.lineTo(center.x,center.y);ctx.fill();
        ctx.fillStyle = `rgb(${255-makeDarkerBy},${0+makeDarkerBy},${0+makeDarkerBy})`;
        ctx.beginPath();
        ctx.moveTo(0,0);ctx.lineTo(0,height);ctx.lineTo(center.x,center.y);ctx.fill();
        ctx.beginPath();
        ctx.moveTo(width,0);ctx.lineTo(width,height);ctx.lineTo(center.x,center.y);ctx.fill();

        let clearWidth = width/2;
        let clearHeight = height/2;
        ctx.fillStyle = `rgb(${0+makeDarkerBy},${0+makeDarkerBy},${255-makeDarkerBy})`;
        ctx.fillRect(width/2-clearWidth/2, height/2-clearHeight/2, clearWidth, clearHeight);

        let holeSize = new V2(clearWidth/2, clearHeight);
        //ctx.clearRect(width/2-holeSize.x/2, height/2-holeSize.y/2, holeSize.x, holeSize.y);
        ctx.fillStyle = `rgba(0,0,0,0)`;
        ctx.moveTo(width/2,height/2+clearHeight/2);ctx.lineTo(width/2-clearHeight/4,height/2+clearHeight/2);
        
        this.moveByPoints(ctx, new V2(width/2,height/2+clearHeight/2), 
        [new V2(-clearWidth/4, 0), new V2(0,-clearWidth/4), new V2(-clearWidth/8, 0), new V2(0, (-clearHeight/2)-clearHeight/8), 
            new V2(clearWidth*3/4, 0), new V2(0, (clearHeight/2)+clearHeight/8), new V2(-clearWidth/8, 0), new V2(0, clearHeight/4)], 
        'rgba(0,0,0,0)');
        ctx.clearRect(0, 0, width, height);

        return vagonCanvas;
    }

    moveByPoints(ctx, startFrom, deltaPoints, fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(startFrom.x, startFrom.y);
        let current = startFrom.clone();
        for(let i =0;i<deltaPoints.length;i++){
            current.add(deltaPoints[i], true);
            ctx.lineTo(current.x, current.y);
        }
        //ctx.fill();
        ctx.closePath();
        //ctx.stroke();
        ctx.clip();
    }
}

class MetroVagon extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
        }, options);

        super(options);
    }
}