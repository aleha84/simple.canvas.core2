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
        this.backgroundRenderDefault('cornflowerblue');
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
        this.origin =new V2(this.width, this.height);
        this.size = new V2(this.width*2, this.height*2);
        this.img = this.createImage();
        this.needRecalcRenderProperties = true;
    }

    drawEllips({hlp, color= 'white',from = 0, to = 360, step = 0.1, width, height}){
        hlp.setFillColor(color);
        for(let angle = from; angle < to; angle+=step){
            let r = degreeToRadians(angle);
            let x = fast.r(this.origin.x + width * Math.cos(r));
            let y = fast.r(this.origin.y + height * Math.sin(r));

            hlp.dot(x,y);
        }
    }

    createImage(){
        return createCanvas(this.size.add(new V2(1,1)), (ctx,size, hlp) => {
            hlp.setFillColor('red').strokeRect(0,0,size.x, size.y, 1);
            let hsv = [0,0,0];
            for(let i = 10; i < this.width;i++){
                this.drawEllips({hlp, color: hsvToHex({hsv}),from: 0, to: 360, step: 0.1, width: i, height: i/2}); 
                hsv[2]+=2;
            }

            // this.drawEllips({hlp, color: '#999999',from: 25, to: 100, step: 0.1, width: this.width-2, height: this.height-2});
            // this.drawEllips({hlp, color: '#7F7F7F',from: 0, to: 125, step: 0.1, width: this.width-1.5, height: this.height-1.5});
            // this.drawEllips({hlp, color: '#666666',from: -25, to: 150, step: 0.1, width: this.width-1, height: this.height-1});
            // this.drawEllips({hlp, color: '#4C4C4C',from: -45, to: 180, step: 0.1, width: this.width-0.5, height: this.height-0.5});
            // this.drawEllips({hlp, color: '#333333',from: 0, to: 360, step: 0.1, width: this.width, height: this.height});
            
           
        })
    }
}