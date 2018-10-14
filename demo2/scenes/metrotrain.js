class MetroTrainScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            vagons: [],
            vagonsMaxCount: 10
        }, options);

        super(options);
        let colors = [0,0,255];
        let colorsChangeDelta = 10;
        let currentSize = this.space.clone();
        for(let i = this.vagonsMaxCount; i >= 0; i--){
            let vagon = new MetroVagon({
                img: this.createVagonCanvas([...colors]),
                position: new V2(this.space.x/2, this.space.y/2),
                size: currentSize.clone()
            });
            this.vagons[i] = vagon;
            this.addGo(vagon, i, false);
            colors[0]+=colorsChangeDelta;
            colors[1]+=colorsChangeDelta;
            colors[2]-=colorsChangeDelta;
            currentSize.mul(0.9, true);
        }

    }

    createVagonCanvas(colors = [0,0,255]) {
        let width = this.space.x;
        let height = this.space.y;
        let vagonCanvas =  document.createElement('canvas');
        vagonCanvas.width = width;
        vagonCanvas.height = height;
        let vagonContext = vagonCanvas.getContext('2d');
        vagonContext.fillStyle = `rgb(${colors.join(',')})`;
        vagonContext.fillRect(0,0,width, height);

        let clearWidth = width/2;
        let clearHeight = height/2;
    
        vagonContext.clearRect(width/2-clearWidth/2, height/2-clearHeight/2, clearWidth, clearHeight);

        return vagonCanvas;
    }
}

class MetroVagon extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
        }, options);

        super(options);
    }
}