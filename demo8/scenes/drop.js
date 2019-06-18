class DropScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault('gray');
    }

    start() {
        this.addGo(new DropCircle({
            position: this.sceneCenter,
            width: 50,
        }))
    }
}

class DropCircle extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: false,
            size: new V2(1,1),
            width: 50,
        }, options)

        super(options);
    }

    init() {
        this.updateProperties();
    }

    updateProperties(){
        this.height = this.width/2;
        this.size = new V2(this.width*2, this.height*2);
        this.img = this.createImage();
        this.needRecalcRenderProperties = true;
    }

    createImage(){
        return createCanvas(this.size.add(new V2(1,1)), (ctx,size, hlp) => {
            hlp.setFillColor('red').strokeRect(0,0,size.x, size.y, 1);
            ctx.fillStyle = 'white';
            let wSq = this.width*this.width//(this.width - 1)*(this.width - 1);
            let hSq = this.height*this.height//(this.height - 1)*(this.height - 1);

            let yArr = new Array(size.y).fill();

            for(let x = -this.width; x <this.width;x++){
                let y =  fast.r(Math.sqrt((1 - (x*x/wSq))*hSq)) ;
                hlp.dot(x + this.width ,-y + this.height).dot(x + this.width,y+this.height);

                yArr[-y + this.height] = x;
                yArr[y + this.height] = x;
            }

            console.log(yArr);
        })
    }
}