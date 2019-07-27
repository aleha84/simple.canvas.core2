class BookScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault('#8BD7EA');
    }

    start(){
        this.demo = this.addGo(new BookGO({
        	position: this.sceneCenter.clone(),
        	size: new V2(150,100)
        }))
    }
}

class BookGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
        }, options)

        super(options);
    }

    init() {
        this.cover = this.addChild(new GO({
    		size: this.size, 
    		position: new V2(0,0),
    		img: createCanvas(new V2(this.size), (ctx, size, hlp) => {

                let radius = 14;
                let height = size.y-radius;
                this.roundedRectangleFoo({hlp, rectSize: new V2(size.x, height), imgSize: size, radius, color: '#589BAC'});

                hlp.setFillColor('#589BAC').circle(new V2(size.x/2, height), radius);

    		})
        }));

        this.pages = this.addChild(new GO({
            size: this.size, 
            position: new V2(0,-5),
            img: createCanvas(new V2(this.size), (ctx, size, hlp) => {

                let radius = 12;
                let pagesDarkShift = new V2(undefined, 0)
                pagesDarkShift.x = undefined;
                this.roundedRectangleFoo({hlp, rectSize: new V2(fast.r(size.x*0.9), fast.r(size.y*0.9)), shift: pagesDarkShift, imgSize: size, radius, color: '#C9C9C9'})
                let pagesLightShift = new V2(undefined, 0);
                pagesLightShift.x = undefined;
                this.roundedRectangleFoo({hlp, rectSize: new V2(fast.r(size.x*0.9), fast.r(size.y*0.81)), shift: pagesLightShift, imgSize: size, radius, color: '#FAFAFA'})

                //let lineRadius = 4;
                
                hlp.setFillColor('#F5F5F5').rect(fast.r(size.x/2), 0, fast.r(0.35*(size.x/2)), fast.r(size.y*0.81))
                hlp.setFillColor('#EFEFEF').rect(fast.r(size.x/2), 0, 2, fast.r(size.y*0.81))

                hlp.setFillColor('#E0E0E0');
                for(let j = 0; j < 2;j++) {
                    let startX = 25;
                    let topY = 11;
                    let yGap = 11;
                    let lineWidth = 40;
                    let dLines = 5;

                    for(let i = 0; i < 6; i++){
                        for(let y = 0; y < dLines; y++){
                            let w = lineWidth;
                            let sx = fast.r(startX+j*(size.x/2 - startX/2));
                            if(y == 0 || y == dLines-1){
                                sx+=1;
                                w-=2;
                            }
                            hlp.rect(sx,topY + i*yGap + y, w, 1);    
                        }
                        
                    }    
                }
                
                
                //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
            })
        }));

        this.upperPage = this.addChild(new GO({
            size: new V2(fast.r(this.size.x*0.9) + 1, fast.r(this.size.y*0.95)), 
            position: new V2(0,-15),
            duration: 5,
            init() {
                this.midX = fast.r(this.size.x/2)
                this.maxWidth = fast.r(this.size.x/2);
                this.currentWidth = this.maxWidth;
                this.maxRadius = 12;
                this.currentRadius = this.maxRadius;
                this.maxYShift = 2;
                this.currentYShift = 0;
                this.direction = 1;
                this.vClamps = [87, 96]
                this.currentV = this.vClamps[1];
                this.darkOpacityClamps = [0, 0.2];
                this.currentDarkOpacity = 0;

                this.widthChange = easing.createProps(this.duration, this.maxWidth, 1, 'linear', 'base');
                //this.widthChange.onComplete = () => { this.widthChange.time = 0 }
                this.radiusChange = easing.createProps(this.duration, this.maxRadius, 1, 'linear', 'base');
                //this.radiusChange.onComplete = () => { this.radiusChange.time = 0 }
                this.yShiftChange = easing.createProps(this.duration, 0, this.maxYShift, 'linear', 'base');
                this.vChange = easing.createProps(this.duration-1, this.vClamps[1], this.vClamps[0], 'linear', 'base');
               // this.yShiftChange.onComplete = () => { this.yShiftChange.time = 0 }

                let debugTimer = 2;
                this.direction = 1;
                // this.widthChange = easing.createProps(this.duration, 1, this.maxWidth, 'linear', 'base');
                // this.radiusChange = easing.createProps(this.duration,  1, this.maxRadius,'linear', 'base');
                // this.yShiftChange = easing.createProps(this.duration, this.maxYShift, 0,  'linear', 'base');
                // this.darkOpacityChange = easing.createProps(this.duration, this.darkOpacityClamps[0], this.darkOpacityClamps[1],  'linear', 'base');
               
                this.widthChange.time = debugTimer;
                this.radiusChange.time = debugTimer;
                this.yShiftChange.time = debugTimer;
                if(this.vChange)
                    this.vChange.time = debugTimer;

                if(this.darkOpacityChange) 
                    this.darkOpacityChange.time = debugTimer;
                this.process();

                this.createImage();
                // this.turnPart1();
                // this.timer = this.regTimerDefault(30, () => {
                //     this.process();
                // })
                
            },
            turnPart1(){
                this.widthChange = undefined;
                this.radiusChange = undefined;                
                this.yShiftChange = undefined;
                this.vChange = undefined;
                this.darkOpacityChange = undefined;

                this.widthChange = easing.createProps(this.duration, this.maxWidth, 1, 'quad', 'in');
                this.widthChange.onComplete = () => { this.turnPart2() }
                this.radiusChange = easing.createProps(this.duration, this.maxRadius, 1, 'quad', 'in');                
                this.yShiftChange = easing.createProps(this.duration, 0, this.maxYShift, 'quad', 'in');
                this.vChange = easing.createProps(this.duration, this.vClamps[1], this.vClamps[0], 'quad', 'in');
            },
            turnPart2(){
                this.widthChange = undefined;
                this.radiusChange = undefined;                
                this.yShiftChange = undefined;
                this.vChange = undefined;

                this.direction = -1;
                this.currentV = 98;
                this.widthChange = easing.createProps(this.duration, 1, this.maxWidth, 'quad', 'out');
                this.widthChange.onComplete = () => { this.reset() }
                this.radiusChange = easing.createProps(this.duration,  1, this.maxRadius,'quad', 'out');
                this.yShiftChange = easing.createProps(this.duration, this.maxYShift, 0,  'quad', 'out');
                this.darkOpacityChange = easing.createProps(this.duration, this.darkOpacityClamps[0], this.darkOpacityClamps[1],  'quad', 'out');
            },
            reset(){
                this.delayTimer = this.regTimer(createTimer(250, () => {
                    this.unregTimer(this.delayTimer);
                    this.delayTimer = undefined;

                    this.currentWidth = this.maxWidth;
                    this.currentRadius = this.maxRadius;
                    this.currentYShift = 0;
                    this.currentDarkOpacity = 0;
                    this.direction = 1;
                    this.turnPart1();
                }, this, false));
                
            },
            process() {
                easing.commonProcess({context: this, targetpropertyName: 'currentWidth', propsName: 'widthChange', round: true});
                easing.commonProcess({context: this, targetpropertyName: 'currentRadius', propsName: 'radiusChange', round: true});
                easing.commonProcess({context: this, targetpropertyName: 'currentYShift', propsName: 'yShiftChange', round: true});
                easing.commonProcess({context: this, targetpropertyName: 'currentV', propsName: 'vChange', round: true});
                easing.commonProcess({context: this, targetpropertyName: 'currentDarkOpacity', propsName: 'darkOpacityChange', round: false});
                this.createImage();
            },
            createImage() {
                
                // if(!this.darkImage) {
                //     this.darkImage = createCanvas(new V2(this.size), (ctx, size, hlp) => {
                        
                //     });
                // }

                this.img = createCanvas(new V2(this.size), (ctx, size, hlp) => {
                    let circle = function(center, radius, from, to) {
                        let up = V2.up;
                        for(let y = center.y-radius-1;y < center.y+radius+1;y++){
                            for(let x = center.x-radius-1;x < center.x+radius+1;x++){
                  
                                let _p = new V2(x,y);
                                let distance = center.distance(_p);

                                let angle = center.direction(_p).angleTo(up);

                                if(distance < radius && angle>from && angle < to){
                                    ctx.fillRect(x,y,1,1);
                                }
                            }
                        }
                    }

                    let drawLeftShadow = function() {
                        let fromX = this.midX - this.maxWidth + this.maxRadius;
                        let toX = this.midX;
                        let fromY = fast.r(this.size.y*0.05) + 2;
                        let toY = size.y - fast.r(this.size.y*0.05) - 2;
                        hlp.setFillColor(`rgba(0,0,0,${this.currentDarkOpacity})`);
                        let pp = new PerfectPixel({context: ctx});
    
                        let upperDots = pp.line(fromX, fromY, toX, fromY );
                        let lowerDots = pp.line(fromX, toY, toX, toY );
    
                        for(let i = 0; i<upperDots.length; i++){
                            hlp.rect(upperDots[i].x, upperDots[i].y, 1, lowerDots[i].y - upperDots[i].y);
                        }
    
                        let y1 = fromY + this.maxRadius - 1;
                        let y2 = toY - this.maxRadius + 1;
    
                        circle(new V2(fromX, y1), this.maxRadius, 0, 90)
                        circle(new V2(fromX, y2), this.maxRadius, 89, 180)
                        //hlp
                            //.circle(new V2(fromX, y1), this.maxRadius)  
                            //.circle(new V2(fromX, y2), this.maxRadius)
    
                        hlp.rect(fromX - this.maxRadius + 1, y1, this.maxRadius-1, y2 - y1)
                    }.bind(this);

                    let fromX = this.midX;
                    let toX = fromX + this.currentWidth - this.currentRadius;
                    if(this.direction < 0) {
                        fromX = this.midX - this.currentWidth + this.currentRadius;
                        toX = this.midX;

                        if(fromX > toX){
                            fromX = toX-1;
                            this.currentRadius = 1;
                        }
                    }
                    
                    let fromY = fast.r(this.size.y*0.05) + 2;
                    let toY = size.y - fast.r(this.size.y*0.05) - 2;

                    hlp.setFillColor(colors.hsvToHex([0,0,this.currentV]));
                    let pp = new PerfectPixel({context: ctx});
                    
                    if(this.direction > 0) {
                        let upperDots = pp.line(fromX, fromY, toX, fromY - this.currentYShift);
                        let lowerDots = pp.line(fromX, toY, toX, toY + this.currentYShift);

                        for(let i = 0; i<upperDots.length; i++){
                            hlp.rect(upperDots[i].x, upperDots[i].y, 1, lowerDots[i].y - upperDots[i].y);
                        }

                        let y1 = fromY - this.currentYShift + this.currentRadius - 1;
                        let y2 = toY + this.currentYShift - this.currentRadius + 1;

                        hlp
                            .circle(new V2(toX, y1), this.currentRadius)  
                            .circle(new V2(toX, y2), this.currentRadius)
                        
                        hlp.rect(toX, y1, this.currentRadius, y2 - y1)
                    }
                    else {
                        drawLeftShadow();
                        hlp.setFillColor(colors.hsvToHex([0,0,this.currentV]));
                        let upperDots = pp.line(fromX, fromY- this.currentYShift, toX, fromY );
                        let lowerDots = pp.line(fromX, toY + this.currentYShift, toX, toY );

                        for(let i = 0; i<upperDots.length; i++){
                            hlp.rect(upperDots[i].x, upperDots[i].y, 1, lowerDots[i].y - upperDots[i].y);
                        }

                        let y1 = fromY - this.currentYShift + this.currentRadius - 1;
                        let y2 = toY + this.currentYShift - this.currentRadius + 1;

                        hlp
                            .circle(new V2(fromX, y1), this.currentRadius)  
                            .circle(new V2(fromX, y2), this.currentRadius)

                        hlp.rect(fromX - this.currentRadius + 1, y1, this.currentRadius, y2 - y1)
                    }

                    //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
                    hlp.setFillColor('blue').rect(this.midX, 0, 1, size.y)
                })
            }
        }));
    }

    roundedRectangleFoo({hlp, rectSize, imgSize, shift, radius, color}) {
        if(!shift){
            shift = new V2(fast.r((imgSize.x - rectSize.x)/2), fast.r((imgSize.y - rectSize.y)/2));    
        }
        else {
            if(shift.x == undefined) {
                shift.x = fast.r((imgSize.x - rectSize.x)/2);
            }

            if(shift.y == undefined) {
                shift.y = fast.r((imgSize.y - rectSize.y)/2);
            }
        }

        hlp.setFillColor(color)
            .circle(new V2(radius-1 + shift.x,radius-1 + shift.y), radius)
            .circle(new V2(rectSize.x - radius + shift.x,radius-1+ shift.y), radius)
            .circle(new V2(rectSize.x - radius + shift.x,rectSize.y - radius + shift.y), radius)
            .circle(new V2(radius-1 + shift.x,rectSize.y-radius + shift.y), radius)
        .rect(shift.x,radius+shift.y,rectSize.x, rectSize.y-radius*2)
        .rect(radius+shift.x,0 + shift.y,rectSize.x-radius*2, rectSize.y)
    }

}