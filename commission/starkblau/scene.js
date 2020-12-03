class StarkblauScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 20,
                fileNamePrefix: 'city'
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

        this.totalFrames = 600;
        
        let initialDelay = 50;

        let delay = 10;
        //600

        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            //isVisible: false,
            init() {

                //colors.color
                let sValues = easing.fast({from: 0, to: 50, steps: this.size.y, method: 'base', type: 'linear'}).map(v => fast.r(v/2)*2);
                let vValues = easing.fast({from: 0, to: 85, steps: this.size.y, method: 'base', type: 'linear'}).map(v => fast.r(v/2)*2);


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


                let yValues = easing.fast({from: -fast.r(this.size.y/2), to: 30, steps: this.parentScene.totalFrames, method: 'base', type: 'linear'}).map(v => fast.r(v));;
                let oValues = easing.fast({from: 1, to: 0.3, steps: this.parentScene.totalFrames, method: 'base', type: 'linear'}).map(v => fast.r(v,2));
                this.currentFrame = 0;

                this.frames = [];
                    
                for(let f = 0; f < this.parentScene.totalFrames;f++){
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('black').rect(0,0,size.x, size.y);
                        //ctx.drawImage(this.main, 0, yValues[f])
                        ctx.globalAlpha = oValues[f];
                        ctx.drawImage(this.main, 0, 0)
                    })
                }

                
                this.img = this.frames[this.currentFrame];
                let iDelay = initialDelay;
                this.timer = this.regTimerDefault(delay, () => {
                
                    iDelay--;

                    if(iDelay > 0)
                        return;

                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.unregTimer(this.timer);
                    }
                })
            }
        }), 0)

        this.draktimeLayers = [
            { name: 'darktime', visibleFrom: 0}, 
            { name: 'darktime_2', visibleFrom: 0},
            { name: 'darktime_6', visibleFrom: 0},
            { name: 'darktime_3', visibleFrom: 0, useCreateVisibility: true, iDelay: 0},
            { name: 'darktime_4', visibleFrom: 0, useCreateVisibility: true, iDelay: 50},
            { name: 'darktime_5', visibleFrom: 0, useCreateVisibility: true, iDelay: 100}
        ]

        this.city = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            isVisible: true,
            img: PP.createImage(StarkblauScene.models.main, { exclude: this.draktimeLayers.map(l => l.name)}),
            init() {
            }
        }), 5)

        let opacityValues = easing.fast({from: 0, to: 1, steps: this.totalFrames, method: 'base', type: 'linear'}).map(v => fast.r(v,2));

if(true){


        this.darktime = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createVisibilityFrames({framesCount, dots, size}) {
                let frames = [];
                
                let itemsData = dots.map((dot, i) => {
                    let visibleFrom = getRandomInt(0, framesCount-1);
                    //let totalFrames = itemFrameslength;

                
                    return {
                        dot,
                        visibleFrom
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(f >= itemData.visibleFrom ){
                                hlp.setFillColor(itemData.dot.color).dot(itemData.dot.x, itemData.dot.y);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {

                let dt = this.parentScene.draktimeLayers;

                this.layers = this.parentScene.draktimeLayers.map(layer => {
                    let layerObject = StarkblauScene.models.main.main.layers.find(l => l.name == layer.name)
                    layerObject.visible = true;//.forEach(l => l.visible = true);
                    
    
                    //this.img = this.main;
                    
    
                    let frames = [];
                    
    
                    if(layer.useCreateVisibility){
                        let dots = [];
                        layerObject.groups.forEach(g => {
                            let color = `rgba(${hexToRgb(g.strokeColor)},${g.strokeColorOpacity})`;
                            g.points.forEach(p => {
                                dots.push({
                                    color,
                                    x: p.point.x, 
                                    y: p.point.y
                                });
                            })
                        })

                        let visibilityFrames = this.createVisibilityFrames({framesCount: this.parentScene.totalFrames, dots, size: this.size});

                        for(let f = 0; f < this.parentScene.totalFrames;f++){
                            frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = opacityValues[f];
                                ctx.drawImage(visibilityFrames[f], 0, 0); //, size.x+1, size.y
                            })
                        }
                    }
                    else {
                        let main = PP.createImage(StarkblauScene.models.main, { renderOnly:[layer.name]});
                        for(let f = 0; f < this.parentScene.totalFrames;f++){
                            frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = opacityValues[f];
                                ctx.drawImage(main, 0, 0); //, size.x+1, size.y
                            })
                        }
                    }

                    return this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames,
                        visibleFrom: layer.visibleFrom,
                        iDelay: layer.iDelay,
                        init() {
                            // this.img = main;
                            this.currentFrame = 0;
                            this.img = this.frames[this.currentFrame];
                            this.isVisible = this.visibleFrom >= this.currentFrame;
            
                            if(this.iDelay == undefined)
                                this.iDelay = 0

                            let iDelay = initialDelay + this.iDelay;                            

                            this.timer = this.regTimerDefault(delay, () => {

                                iDelay--;
                                if(iDelay > 0)
                                    return;

                                this.isVisible = this.currentFrame >= this.visibleFrom;
                                this.img = this.frames[this.currentFrame];
                                this.currentFrame++;
                                if(this.currentFrame == this.frames.length){
                                    this.unregTimer(this.timer);
                                }
                            })
                        }
                    }))
    
                    
                })

                
            }
        }), 10)
    }

        this.anim = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: PP.createImage(StarkblauScene.models.animFrames),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let frameSwitchCounter = 4;

                this.timer = this.regTimerDefault(delay, () => {
                    frameSwitchCounter--;

                    if(frameSwitchCounter > 0)
                        return;

                    frameSwitchCounter = 4;

                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 11)

        this.traffic = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createTrafficFrames({framesCount, itemsCount, yClamps, xClamps, xSpeed, size, opacity = 0.15}) {
                let frames = [];
                
                let xLength = xClamps[1] - xClamps[0];
                if(framesCount*xSpeed < xLength)
                    throw 'Wrong parameters for createTrafficFrames';

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let y = getRandomInt(yClamps[0], yClamps[1]);
                    let direction = getRandomBool();
                    let startX = direction ? xClamps[0] : xClamps[1];
                    let xShift = xSpeed*(direction ? 1 : -1);
                    let currentX = startX;
                    let frames = [];
                    for(let f = 0; f < framesCount; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        let add = false;
                        if(direction){
                            if(currentX <= xClamps[1])
                                add = true;
                            else 
                                break;
                        }
                        else {
                            if(currentX >= xClamps[0])
                                add = true;
                            else 
                                break;
                        }
                        
                        if(add){
                            frames[frameIndex] = {
                                x: currentX
                            };
                        }

                        currentX+=xShift;
                    }
                
                    return {
                        y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(200,169,123,${opacity})`).dot(fast.r(itemData.frames[f].x), itemData.y);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let framesCount = 200;
                let trafficMask = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 1;
                    hlp.setFillColor('#D30B30').rect(0,0,size.x, size.y);
                })

                let xSpeed = 0.2
                let trafficFrames = [
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [70,71], xClamps: [15,39], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [70,71], xClamps: [0,4], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [70,71], xClamps: [51,70], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [70,71], xClamps: [80,99], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [87,88], xClamps: [0,25], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [87,88], xClamps: [72,80], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [47,47], xClamps: [47,57], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [47,47], xClamps: [61,70], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [58,59], xClamps: [12,23], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [58,59], xClamps: [53,55], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [47,47], xClamps: [29,35], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 50, yClamps: [48,48], xClamps: [0,4], xSpeed, size: this.size}),
                    this.createTrafficFrames({framesCount: framesCount, itemsCount: 30, yClamps: [38,38], xClamps: [56,60], xSpeed: 0.15, size: this.size})
                ]

                let repeatCounter = this.parentScene.totalFrames/framesCount;
                trafficFrames = trafficFrames.map(frames => {
                    let resultFrames = [];
                    for(let r = 0; r < repeatCounter; r++){
                        for(let f =0; f < framesCount;f++){
                            resultFrames.push(createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(frames[f], 0, 0);
                                ctx.globalCompositeOperation = "source-atop";
                                ctx.globalAlpha = opacityValues[f + framesCount*r]
                                ctx.drawImage(trafficMask, 0,0);
                            }))
                        }
                    }

                    let redFrames = [];
                    for(let f =0; f < framesCount;f++){
                        redFrames.push(createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(frames[f], 0, 0);
                            ctx.globalCompositeOperation = "source-atop";
                            ctx.drawImage(trafficMask, 0,0);
                        }))
                    }

                    let from = frames.length-initialDelay;
                    return {original: frames.filter((el,i) => i >= from) , resultFrames,redFrames};
                })

                this.traffic = trafficFrames.map(frames => 
                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames,
                        init() {
                            this.currentFrame = 0;
                            this.img = this.frames.resultFrames[this.currentFrame];
                            
                            let useRed = false;
                            let useMid = false;
                            let useOriginal = true;


                            this.timer = this.regTimerDefault(delay, () => {
                                let frames;
                                if(useRed) {
                                    frames = this.frames.redFrames;
                                }
                                if(useMid)
                                    frames =this.frames.resultFrames;
                                if(useOriginal)
                                    frames = this.frames.original;
                                
                                this.img = frames[this.currentFrame];
                                this.currentFrame++;
                                //console.log(this.currentFrame)
                                if(this.currentFrame == frames.length){
                                    this.currentFrame = 0;

                                    if(useRed){
                                        this.parent.parentScene.capturing.stop = true;
                                    }

                                    if(useMid){
                                        useMid = false;
                                        useRed = true;
                                    }

                                    if(useOriginal){
                                        useOriginal = false;
                                        useMid = true;
                                    }

                                    

                                    // if(!useRed)
                                    //     useRed  =true;
                                    //this.unregTimer(this.timer);
                                }
                            })
                        }
                    })))
            }
        }), 15)


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