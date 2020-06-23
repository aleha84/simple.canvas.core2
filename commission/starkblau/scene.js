class StarkblauScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'vortex'
            },
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){

        this.totalFrames = 100;
        //1800

        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            //isVisible: false,
            init() {

                //colors.color
                let sValues = easing.fast({from: 0, to: 50, steps: this.size.y, method: 'base', type: 'linear'}).map(v => fast.r(v));
                let vValues = easing.fast({from: 0, to: 85, steps: this.size.y, method: 'base', type: 'linear'}).map(v => fast.r(v));



                this.main = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < size.y; y++){
                        hlp.setFillColor(colors.hsvToHex([30, sValues[y], vValues[y]])).rect(0,y,size.x,1);
                    }


                    //hlp.setFillColor('#9F8467').rect(0,0,size.x, size.y)
                    /*hlp.setFillColor('black').rect(0,0,size.x, size.y);

                    for(let i = 0; i < 500; i++){
                        hlp.setFillColor(`rgba(255,255,255,0.05)`).dot(getRandomInt(0,size.x), getRandomInt(0,size.y))
                    }*/
                })

                this.frames = [];
                let yValues = easing.fast({from: -fast.r(this.size.y/2), to: 0, steps: this.parentScene.totalFrames, method: 'base', type: 'linear'}).map(v => fast.r(v));;
                for(let f = 0; f < this.parentScene.totalFrames;f++){
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.main, 0, yValues[f])
                    })
                }

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.unregTimer(this.timer);
                    }
                })
            }
        }), 0)

        this.city = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            isVisible: true,
            img: PP.createImage(StarkblauScene.models.main, { exclude: ['darktime']}),
            init() {
            }
        }), 5)

        this.darktime = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                StarkblauScene.models.main.main.layers.find(l => l.name == 'darktime').visible = true;
                this.main = PP.createImage(StarkblauScene.models.main, { renderOnly: ['darktime']});

                //this.img = this.main;

                this.frames = [];
                let opacityValues = easing.fast({from: 0, to: 1, steps: this.parentScene.totalFrames, method: 'base', type: 'linear'}).map(v => fast.r(v,2));

                for(let f = 0; f < this.parentScene.totalFrames;f++){
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = opacityValues[f];
                        ctx.drawImage(this.main, 0, 0); //, size.x+1, size.y
                    })
                }

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.unregTimer(this.timer);
                    }
                })
            }
        }), 10)


/*
        this.vortex = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createVortexFrames({framesCount, itemsCount, size}) {
                let frames = [];
                let startFall = 0;
                let origin = new V2(size.x/2, size.y/2 - 20).toInt();
                let rClamp = [5,40];
                let yShiftsValue = easing.fast({from: 0, to: 70, steps: framesCount-startFall, type: 'expo', method: 'in'}).map(v => fast.r(v))
                let opacityChange = easing.fast({from: 1, to: 0, steps: framesCount, type: 'quad', method: 'in'}).map(v => fast.r(v,2));
                //let radiusChange = easing.fast({from: rClamp[1], to: rClamp[0], steps: framesCount, type: 'quad', method: 'in'}).map(v => fast.r(v));
                let angleChange = easing.fast({from: 0, to: 720, steps: framesCount, type: 'quad', method: 'in'}).map(v => fast.r(v));

                let startOpacityLength = fast.r(framesCount/5);
                let startOpacityValues = easing.fast({from: 0, to: 1, steps: startOpacityLength, type: 'quad', method: 'out'}).map(v => fast.r(v,2));

                let trailLength = 6;

                let ellipsesData = [];
                for(let r = rClamp[0]; r <= rClamp[1]; r++){
                    let step = 1;
                    let width = r;
                    let height = fast.r(r/2);
                    let angleToDots = [];
                    for(let angle = 0; angle < 360; angle+=step){
                        let r = degreeToRadians(angle);
                        let x = fast.r(origin.x + width * Math.cos(r));
                        let y = fast.r(origin.y + height * Math.sin(r));
              
                        angleToDots[angle] = {x,y};
                        //this.dot(x,y);
                        
                        // if(dots)
                        //   dots.push({x,y})
                    }

                    ellipsesData[width] = angleToDots;
                }


                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = framesCount;

                    let initAngle = getRandomInt(0,359);
                    let initRadius = getRandomInt(rClamp[0],rClamp[1]);
                    let yShiftStartFrame = undefined;
                    //let initRadius = 
                    let radiusChange = easing.fast({from: getRandomInt(40,60), to: 2, steps: framesCount, type: 'quad', method: 'in'}).map(v => fast.r(v));
                    let frames = [];
                    let dotsChange = [];

                    let _yShift = 0;

                    let getDot = (f) => {
                        let angle = initAngle + angleChange[f];
                        if(angle >= 360)
                            angle-=360;
                        let r = radiusChange[f];
                        let width = r;
                        let height = fast.r(r/2.5);   
                        // let ed = ellipsesData[r];
                        // let dot = ed[angle];
                        let rad = degreeToRadians(angle);
                        let x = fast.r(origin.x + width * Math.cos(rad));
                        let y = fast.r(origin.y + height * Math.sin(rad));

                        let opacityModifier = 1;
                        if(y < origin.y){
                            let delta =  origin.y - y;
                            opacityModifier =1 - (0.75 * delta/height);
                        }

                        if(f > startFall){
                            let yShift = yShiftsValue[f-startFall];
                            y+=yShift; 
                        }

                        //y= fast.r(y+_yShift);

                        // if(r < 30){
                        //     // if(_yShift == 0){
                        //     //     _yShift = 0.01;
                        //     // }
                        //     // else {
                        //     //     _yShift*=1.005;
                        //     // }
                        //     if(yShiftStartFrame===undefined)
                        //         yShiftStartFrame = f;

                        //     let yShift = yShiftsValue[f-yShiftStartFrame];
                        //     if(yShift>0)
                        //     y+=yShift; 
                            
                        // }
                        

                        let opacity = 1;
                        if(f < startOpacityLength){
                            opacity = startOpacityValues[f]
                        }
                        else {
                            opacity = opacityChange[f]
                        }

                        opacity*=opacityModifier;

                        return {x,y, opacity};
                    }

                    for(let f = 0; f < totalFrames; f++){
                        
                        let dot = getDot(f);
                        let prevDots = [];
                        if(f >trailLength)
                        for(let i = 1; i < trailLength+1; i++){
                            prevDots[i-1] = getDot(f-i);
                        }
                             
                        dotsChange.push(
                            {
                                dot,
                                prevDots
                            }
                        );

                        //frames[]

                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = {
                            dot,
                            prevDots
                        }
                
                        // let r = initRadius - radiusChange[frameIndex];
                        // if(r < rClamp[0])
                        //     r+= (rClamp[1]-rClamp[0])

                        // let angle = initAngle + angleChange[frameIndex];
                        // if(angle >= 360)
                        //     angle-=360;

                        // let ed = ellipsesData[r];
                        // let dot = ed[angle];

                        // frames[frameIndex] = {
                        //     dot
                        // };
                    }
                
                    return {
                        r: getRandomInt(200,255),
                        b: getRandomInt(200,255),
                        opacity: 1,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(${itemData.r},255,${itemData.b}, ${itemData.frames[f].dot.opacity})`).dot(itemData.frames[f].dot.x, itemData.frames[f].dot.y)
                                if(itemData.frames[f].prevDots.length){
                                    let tOpacity =  itemData.frames[f].dot.opacity*0.5;
                                    let oValues = easing.fast({from: tOpacity, to: 0, steps: trailLength, type: 'linear', method: 'base'})
                                    for(let i = 0; i < trailLength; i++){
                                        tOpacity /= 2;
                                        hlp.setFillColor(`rgba(${itemData.r},255,${itemData.b}, ${oValues[i]})`).dot(itemData.frames[f].prevDots[i].x, itemData.frames[f].prevDots[i].y)
                                    }
                                    
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createVortexFrames({framesCount: 500, itemsCount: 150, size: this.size});

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        this.parentScene.capturing.stop = true;
                    }
                })
            }
        }), 1)
        */
    }
    
}