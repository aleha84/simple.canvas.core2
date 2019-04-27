class CityScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
            },
            layersCount: 6, 
            baseColor: {
                h: 210,
                sClamp: [10, 25],
                vClamp: [95,55],
            },
            secondaryColor: {
                h: 200,
                sClamp: [1, 15],
                vClamp: [98, 78]
            },
            //baseColorHSV: [210, 25, 55],
            layers: [],
            sizeClampsRatio: [0.1, 0.4],
            targetClampsRation: [0.4, 0.8],
            heightRation: 0.75,
            targetClamps: [],
            sizeClamps:[],
            
            appearClamps: [15, 25],
            fallClamps: [7, 12],
            buildingsCountClamp: [48, 6],
            evenMaxHeightRatioClamp: [2.5, 1.5],
            oddMaxHeightRatioClamp: [2.0, 1.2],
            windowsHeightRatioClamp: [20,10],
            windowsGapHeightRatioClamp: [40,20],
        }, options)

        super(options);

        this.sizeClamps = this.sizeClampsRatio.map(s => s*this.viewport.y);
        this.targetClamps = this.targetClampsRation.map(s => s*this.viewport.y);
        this.heightValue = this.heightRation*this.viewport.y;
    }

    backgroundRender() {
        this.backgroundRenderDefault('#F4F5F6');
    }

    initEasingPropsByClamps(clamp,type, method) {
        return { time: 0, duration: this.layersCount-1, change: clamp[1] - clamp[0], type: type, method: method, startValue: clamp[0] };
    }

    processColors(clamp,type, method) {

    }

    start() {
        this.baseColor.sChange = this.initEasingPropsByClamps(this.baseColor.sClamp, 'linear', 'base');
        this.baseColor.vChange = this.initEasingPropsByClamps(this.baseColor.vClamp, 'linear', 'base');
        this.secondaryColor.sChange = this.initEasingPropsByClamps(this.secondaryColor.sClamp, 'linear', 'base');
        this.secondaryColor.vChange = this.initEasingPropsByClamps(this.secondaryColor.vClamp, 'linear', 'base');

        let buildingsCountChange = this.initEasingPropsByClamps(this.buildingsCountClamp, 'linear', 'base');
        let evenHeightChange = this.initEasingPropsByClamps(this.evenMaxHeightRatioClamp, 'linear', 'base');
        let oddHeightChange = this.initEasingPropsByClamps(this.oddMaxHeightRatioClamp, 'linear', 'base');

        let windowsHeightChange = this.initEasingPropsByClamps(this.windowsHeightRatioClamp, 'linear', 'base');
        let windowsGapHeightChange = this.initEasingPropsByClamps(this.windowsGapHeightRatioClamp, 'linear', 'base');

        let sizeChange = { time: 0, duration: this.layersCount-1, change: this.sizeClamps[1] - this.sizeClamps[0], type: 'cubic', method: 'in', startValue: this.sizeClamps[0] };
        let targetChange = { time: 0, duration: this.layersCount-1, change: this.targetClamps[1] - this.targetClamps[0], type: 'cubic', method: 'in', startValue: this.targetClamps[0] };
        let heightChange = { time: 0, duration: this.layersCount, change: this.heightValue, type: 'quad', method: 'in', startValue: 0 };

        let appearChange = { time: 0, duration: this.layersCount-1, change: this.appearClamps[1] - this.appearClamps[0], type: 'cubic', method: 'in', startValue: this.appearClamps[0] };
        let fallChange = { time: 0, duration: this.layersCount-1, change: this.fallClamps[1] - this.fallClamps[0], type: 'cubic', method: 'in', startValue: this.fallClamps[0] };

        let heights = [];
        let height = 0;
        let prevHeightStep = undefined;
        for(let i = 0; i < this.layersCount; i++){

            this.baseColor.sChange.time = i;
            this.baseColor.vChange.time = i;
            this.secondaryColor.sChange.time = i;
            this.secondaryColor.vChange.time = i;
            buildingsCountChange.time = i;
            sizeChange.time = i;
            targetChange.time = i;
            appearChange.time = i;
            fallChange.time = i;
            evenHeightChange.time = i;
            oddHeightChange.time = i;
            heightChange.time = i+1;

            let hEasingValue = easing.process(heightChange);
            
            if(prevHeightStep == undefined) {
                height = hEasingValue;
            }
            else {
                height = hEasingValue - prevHeightStep;
            }

            prevHeightStep = hEasingValue;

            let size = new V2(this.viewport.x, height);
            this.layers[i] = this.addGo(new BuildingsLayer({
                size: size,
                //size: new V2(this.viewport.x, this.viewport.y/2),
                position: new V2(this.viewport.x/2, this.viewport.y + size.y/2),
                target: new V2(this.viewport.x/2, 0),//easing.process(targetChange)),
                baseColorHSV: [this.baseColor.h, fastRoundWithPrecision(easing.process(this.baseColor.sChange)), fastRoundWithPrecision(easing.process(this.baseColor.vChange))],
                secondaryColorHSV: [this.secondaryColor.h, fastRoundWithPrecision(easing.process(this.secondaryColor.sChange)), fastRoundWithPrecision(easing.process(this.secondaryColor.vChange))],
                appearDuration: 20,//fastRoundWithPrecision(easing.process(appearChange)),
                fallDuration: 10,//fastRoundWithPrecision(easing.process(fallChange)),
                buildingsCount: fastRoundWithPrecision(easing.process(buildingsCountChange)),
                evenMaxHeight: easing.process(evenHeightChange),
                oddMaxHeight: easing.process(oddHeightChange),
                windowsHeightRatio: easing.process(windowsHeightChange),
                windowsGapHeightRatio: easing.process(windowsGapHeightChange),
                layerIndex: i
            }), i)
        }
        
        for(let i = this.layers.length-1;i >= 0;i--){
            let l = this.layers[i];
            if(i == this.layers.length-1) {
                l.target.y = this.viewport.y - l.size.y/2;
                //l.setPosition(new V2(l.position.x, l.target.y));
                continue;
            }

            let l1 =this.layers[i+1]; 
            
            l.target.y = l1.target.y - (l1.size.y/2) + l1.size.y*0.1 - l.size.y/2;
        }

        this.appearLayerIndex = this.layers.length - 1;

        this.sunSize = new V2(25, 25);
        this.sun = this.addGo(new GO({
            renderValuesRound: true,
            position: new V2(50, -30),
            targetY: 75,
            size: this.sunSize,
            img: createCanvas(this.sunSize, (ctx, size) => {
                ctx.fillStyle = '#EAB4AF';
                let radius = fastRoundWithPrecision(size.x*0.9/2);
                let center = new V2(fastRoundWithPrecision(size.x/2), fastRoundWithPrecision(size.y/2));
                for(let r = 0; r < size.y; r++){
                    for(let c = 0; c < size.x; c++){
                        if(fastRoundWithPrecision(new V2(c, r).distance(center)) < radius){
                            ctx.fillRect(c,r,1,1);
                        }
                    }
                }
            }),
            appear() {
                let appear = { time: 0, duration: 30, change: this.targetY - this.position.y, type: 'cubic', method: 'out', startValue: this.position.y };
                this.appearTimer = this.registerTimer(createTimer(10, () => {
                    if(appear.time > appear.duration){
                        this.unregTimer(this.appearTimer);
                        this.parentScene.clouds.forEach(x => x.appear());
                        return;
                    }

                    this.position.y = easing.process(appear);
                    this.needRecalcRenderProperties = true;

                    appear.time++;

                }, this, true));
            }
        }), 10);

        this.cloudsSize = new V2(60, 8);
        this.clouds = [new V2(35, 80), new V2(80, 60), new V2(240, 75), new V2(170, 30), new V2(260, 110), new V2(20, 10), new V2(40, 120)].map((el, i) => (this.addGo(new GO({
            position: new V2(el.x < this.viewport.x/2 ? -50 : this.viewport.x + 50, el.y),
            targetX: el.x,
            renderValuesRound: true,
            size: this.cloudsSize,
            img: createCanvas(this.cloudsSize, (ctx, size) => {
                ctx.fillStyle = i < 3 ? '#CBD3E1' : '#ECECF1';

                let sizeChange = { time: 0, duration: size.y/2, change: size.x*3/4 - size.x/3, type: 'linear', method: 'base', startValue: size.x/3 };
                for(let j = 0; j < size.y/2; j++){
                    sizeChange.time = j;
                    let width = easing.process(sizeChange);
                    ctx.fillRect(getRandomInt(0, size.x/2), j*2, width, 2);
                }
            }), 
            appear() {
                let appear = { time: 0, duration: 30, change: this.targetX - this.position.x, type: 'cubic', method: 'out', startValue: this.position.x };

                this.appearTimer = this.registerTimer(createTimer(10, () => {
                    if(appear.time > appear.duration){
                        this.unregTimer(this.appearTimer);
                        this.parentScene.layers[this.parentScene.layers.length - 1].railway.appear();
                        return;
                    }

                    this.position.x = easing.process(appear);
                    this.needRecalcRenderProperties = true;

                    appear.time++;

                }, this, true));
            }
        }),11)));

        this.triggerLayerAppear();

    }

    triggerLayerAppear() {
        if(this.appearLayerIndex < 0){
            this.sun.appear();
            return;
        }
            

        let l = this.layers[this.appearLayerIndex];
        if(this.appearLayerIndex < this.layers.length - 1){
            let l1 = this.layers[this.appearLayerIndex+1];
            let y = l1.position.y - (l1.size.y/2) + l.size.y/2;
            l.setPosition(new V2(l.position.x, y));
        }

        this.appearLayerIndex--;

        l.appear(this.triggerLayerAppear.bind(this));
    }
} 

class BuildingsLayer extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            baseColorHSV: [50, 100, 100],
            secondaryColorHSV: [200, 15, 78],
            renderValuesRound: true,
            appearDuration:  20,
            fallDuration: 10,
            buildingsCountChange: 4,
            buildings: [],
            layerIndex: 0,
            evenMaxHeight: 1.3,
            oddMaxHeight: 1.1,
            windowsHeightRatio: 10,
            windowsGapHeightRatio: 20,
        }, options)

        super(options);
    }

    setPosition(position) {
        this.position = position.clone();
        this.needRecalcRenderProperties = true;

        if(this.layerIndex == 0) {
            this.position.y += this.size.y*10;
        }
    }

    init() {
        let that = this;
        this.baseColorHex = hsvToHex({ hsv: this.baseColorHSV });
        this.seconadyColorHex = hsvToHex({ hsv: this.secondaryColorHSV });
        this.darkerSecondaryColors = [this.seconadyColorHex, ...new Array(3).fill().map((el, i) => (hsvToHex({ hsv: [this.secondaryColorHSV[0], this.secondaryColorHSV[1], this.secondaryColorHSV[2]-(i+1)*4] })))];
        this.darkerBaseColor = hsvToHex({ hsv: [this.baseColorHSV[0], this.baseColorHSV[1], this.baseColorHSV[2]-7] });
        let lv = this.baseColorHSV[2]+5;
        if(lv > 100)
            lv = 100;
        this.lighterBaseColor = hsvToHex({ hsv: [this.baseColorHSV[0], this.baseColorHSV[1], lv] });
        this.img = createCanvas(new V2(1,1), (ctx) => {
            ctx.fillStyle = this.baseColorHex;
            console.log(this.baseColorHSV,ctx.fillStyle);
            ctx.fillRect(0,0,1,1);
        })

        //this.position.y = this.target.y;
        let buidingWidth = this.size.x / this.buildingsCount;
        let startX = -this.size.x/2;

        if(this.layerIndex == 0){
            this.evenMaxHeight = 8;
            this.oddMaxHeight = 7;
            this.appearDuration = 30;
            this.fallDuration = 10;
        }

        let evenHeightChange = { time: 0, duration: fastRoundWithPrecision(this.buildingsCount-1)/2, change: this.evenMaxHeight - 1.3, type: 'quad', method: 'in', startValue: 1.3 };
        let evenHeightChange2 = { time: 0, duration: fastRoundWithPrecision(this.buildingsCount-1)/2, change: 1.3 - this.evenMaxHeight , type: 'quad', method: 'out', startValue: this.evenMaxHeight };
        let oddHeightChange = { time: 0, duration: fastRoundWithPrecision(this.buildingsCount-1)/2, change: this.oddMaxHeight - 1.1, type: 'quad', method: 'in', startValue: 1.1 };
        let oddHeightChange2 = { time: 0, duration: fastRoundWithPrecision(this.buildingsCount-1)/2, change:  1.1 - this.oddMaxHeight, type: 'quad', method: 'out', startValue: this.oddMaxHeight };

        let last = this.layerIndex == this.parentScene.layers.length-1;
        let first = this.layerIndex == 0;
        for(let i = this.buildingsCount-1; i>=0; i--){
            if(i%2 != 0) 
                continue;

            evenHeightChange.time = i;
            let hModifier = 1.3;
            if(i < this.buildingsCount/2) {
                hModifier = easing.process(evenHeightChange);
            }
            else {
                evenHeightChange2.time = (i - this.buildingsCount/2);
                hModifier = easing.process(evenHeightChange2);
            }
            hModifier+=getRandom(0, 0.3)
            let size = new V2(buidingWidth*(1.2+getRandom(0,0.5)), this.size.y*hModifier);
            this.buildings[i] = this.addChild(new GO({
                renderValuesRound: true,
                size: size,
                position: new V2(startX + buidingWidth/2 + buidingWidth*i, this.size.y/2 - size.y/2),
                img: createCanvas(size, (ctx, size) => {
                    ctx.fillStyle = that.baseColorHex;
                    ctx.fillRect(0,0, size.x, size.y)

                    ctx.fillStyle = that.darkerBaseColor;
                    let leftShadowWidth = fastRoundWithPrecision(size.x*0.1);
                    ctx.fillRect(0,0, leftShadowWidth, size.y)
                    
                    ctx.fillStyle = that.lighterBaseColor;

                    let lWidth = last ? 2 : 1;

                    ctx.fillRect(size.x - lWidth, 0, lWidth, size.y);
                    ctx.fillRect(leftShadowWidth, 0, size.x - leftShadowWidth, 1 );

                    that.drawWindows(ctx, size, leftShadowWidth);
                })
            }))
        }

        for(let i = this.buildingsCount-1; i>=0; i--){
            if(i%2 == 0)
                continue;

            oddHeightChange.time = i;
            let hModifier = 1.1;
            if(i < this.buildingsCount/2) {
                hModifier = easing.process(oddHeightChange);
            }
            else {
                oddHeightChange2.time = (i - this.buildingsCount/2);
                hModifier = easing.process(oddHeightChange2);
            }
            hModifier+=getRandom(0, 0.2)
            let size = new V2(buidingWidth*(1.2+getRandom(0,0.5)), this.size.y*hModifier);
            this.buildings[i] = this.addChild(new GO({
                renderValuesRound: true,
                size: size,
                position: new V2(startX + buidingWidth/2 + buidingWidth*i, this.size.y/2 - size.y/2),
                img: createCanvas(size, (ctx, size) => {
                    ctx.fillStyle = that.baseColorHex;
                    ctx.fillRect(0,0, size.x, size.y)

                    ctx.fillStyle = that.darkerBaseColor;
                    let leftShadowWidth = fastRoundWithPrecision(size.x*0.2);
                    ctx.fillRect(0,0, leftShadowWidth, size.y)
                    ctx.fillStyle = that.lighterBaseColor;
                    let lWidth = last ? 2 : 1;

                    ctx.fillRect(size.x - lWidth, 0, lWidth, size.y);
                    ctx.fillRect(leftShadowWidth, 0, size.x - leftShadowWidth, 1 );

                    that.drawWindows(ctx, size, leftShadowWidth);
                    
                })
            }))
        }

        if(last){
            let railwayHeight = this.size.y/2;
            this.railway = this.addChild(new GO({
                renderValuesRound: true,
                position: new V2(0,this.size.y),
                targetY: this.size.y/2 - railwayHeight/2,
                size: new V2(this.size.x, railwayHeight),
                img: createCanvas(new V2(this.size.x,railwayHeight), (ctx, size) => {
                    ctx.fillStyle = '#40495B';
                    let colWidth = fastRoundWithPrecision(size.x/20);
                    let colCount = 5;
                    let gapWidth = fastRoundWithPrecision((size.x)/(colCount+1));
                    ctx.fillRect(-fastRoundWithPrecision(colWidth/2) ,0,colWidth,size.y);    
                    for(let i = 0; i < colCount; i++){
                        ctx.fillRect(gapWidth + gapWidth*i - fastRoundWithPrecision(colWidth/2) ,0,colWidth,size.y);    
                    }
                    ctx.fillRect(size.x-fastRoundWithPrecision(colWidth/2) ,0,colWidth,size.y);    
                    ctx.fillStyle = '#6A7789'; 
                    ctx.fillRect(0,0,size.x,fastRoundWithPrecision(size.y/4));
                    ctx.fillStyle = '#A9BBC6';
                    ctx.fillRect(0,0,size.x,fastRoundWithPrecision(size.y/12));

                    ctx.fillStyle = '#40495B';
                    ctx.fillRect(0,1,size.x,2);

                }),
                init() {
                    this.trainSize = new V2(150, 10);
                    let that = this;
                    this.train = this.addChild(new GO({
                        renderValuesRound: true,
                        position: new V2(this.size.x/2 + this.trainSize.x/2 + 30, -34),
                        size: this.trainSize.mul(1.5),
                        img: createCanvas(this.trainSize, (ctx, size) => {
                            let vagonWidth = 50;
                            let vagonImg = PP.createImage(cityImages.vagon);
                            for(let i = 0; i < 3; i++){
                                ctx.drawImage(vagonImg, size.x - vagonWidth*(i+1) + i*8,0,vagonWidth, that.trainSize.y)
                            }   
                        }),
                        appear() {
                            let appear = { time: 0, duration: 500, change: - this.parent.size.x/2 - this.size.x/2 - this.position.x - 40, type: 'linear', method: 'base', startValue: this.position.x + 30 };
            
                            this.appearTimer = this.registerTimer(createTimer(10, () => {
                                if(appear.time > appear.duration){
                                    this.unregTimer(this.appearTimer);
                                    return;
                                }
            
                                this.position.x = easing.process(appear);
                                this.needRecalcRenderProperties = true;
            
                                appear.time++;
            
                            }, this, true));
                        }
                    }))
                },
                appear() {                   
                    if(this.appearCalled) {
                        return;
                    }

                    this.appearCalled = true;

                    let appear = { time: 0, duration: 30, change: this.targetY - this.position.y, type: 'cubic', method: 'out', startValue: this.position.y };
    
                    this.appearTimer = this.registerTimer(createTimer(10, () => {
                        if(appear.time > appear.duration){
                            this.unregTimer(this.appearTimer);
                            this.train.appear();
                            return;
                        }
    
                        this.position.y = easing.process(appear);
                        this.needRecalcRenderProperties = true;
    
                        appear.time++;
    
                    }, this, true));
                }
            }));

            
        }
    }

    drawWindows(ctx, size, leftShadowWidth) {
        let first = this.layerIndex == 0;
        let windowsGroupsCount = 2;
        let windowsCountPerGroup = 2;
        
        let witdhForWindows = fastRoundWithPrecision((size.x - leftShadowWidth)/windowsGroupsCount);
        let gapWidth = fastRoundWithPrecision(witdhForWindows/6);
        //let gapHeight = fastRoundWithPrecision(size.y/this.windowsGapHeightRatio);//fastRoundWithPrecision(size.y/20);
        let windowWidth = fastRoundWithPrecision( (witdhForWindows - gapWidth*(windowsCountPerGroup+1))/windowsCountPerGroup);
        //let windowHeight = fastRoundWithPrecision(size.y/this.windowsHeightRatio);//fastRoundWithPrecision(size.y/10);
        let windowHeight = first ? 1 : windowWidth;
        let gapHeight = first ? 2 : windowHeight;

        let currentHeight = gapHeight;
        if(first){
            ctx.fillStyle  = '#ECECEF';
        }
        while(currentHeight < size.y){
            if(first){
                ctx.fillRect(leftShadowWidth+1, currentHeight, size.x - leftShadowWidth - 2, windowHeight);
            }
            else {
                for(let k = 0; k < windowsGroupsCount; k++){
                    for(let j = 0; j < windowsCountPerGroup; j++){
    
                        ctx.fillStyle = this.darkerSecondaryColors[getRandomInt(0, this.darkerSecondaryColors.length-1)]
                        ctx.fillRect(leftShadowWidth + witdhForWindows*k + gapWidth + (windowWidth+gapWidth)*j, currentHeight, windowWidth,windowHeight)
                    }
                }
            }
            

            currentHeight += (gapHeight + windowHeight);
        }
    }

    appear(completeCallback) {
        this.script.callbacks.completed = completeCallback;

        let shift = this.target.y - this.position.y;

        this.script.items = [
            function(){
                
                let appear = { time: 0, duration: this.appearDuration, change: shift, type: 'cubic', method: 'out', startValue: this.position.y };
                let callBackTrigger = appear.duration*2/3;
                let callBackTriggered = false;
                this.scriptTimer = this.createScriptTimer(
                    function() { 
                        this.position.y =  easing.process(appear)
                        appear.time++;

                        // if(!callBackTriggered && appear.time > callBackTrigger){
                        //     callBackTriggered = true;
                        //     completeCallback();
                        // }
                            
                    },
                    function() { return appear.time > appear.duration; },
                    true,
                    10
                );
            },
            function(){
                
                let fall = { time: 0, duration: this.fallDuration, change: this.size.y*0.1, type: 'cubic', method: 'in', startValue: this.position.y };
                this.scriptTimer = this.createScriptTimer(
                    function() { 
                        this.position.y =  easing.process(fall)
                        fall.time++;

                        // if(!callBackTriggered && appear.time > callBackTrigger){
                        //     callBackTriggered = true;
                        //     completeCallback();
                        // }
                            
                    },
                    function() { return fall.time > fall.duration; },
                    true,
                    10
                );
            }
        ]

        this.processScript();
    }
}