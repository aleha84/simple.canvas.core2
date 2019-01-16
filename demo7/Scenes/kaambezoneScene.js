class KaambezoneScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debugging: {
                enabled: true,
                font: (25*SCG.viewport.scale) + 'px Arial',
                textAlign: 'left',
                fillStyle: 'red',
                position: new V2(20*SCG.viewport.scale, 20*SCG.viewport.scale),
                
                createdSf: 0
            }
        }, options)

        super(options);

        this.snowflakes = [];
        this.snowFlakesColors = //[ 'EBE2E3', 'D6D1CE', 'C2C0C1', 'C8D9E9', 'B5C7DF', '96AFD8'];
        //['BCB7B7', '8E8C8A', '898889', '97A4AF', '8E9BAD', '7B8FAF'];
        ['2F8DB3', '5BA5C2', '8DC6D9', 'E5F4F9', 'FFFFFF']
        this.snowFlakesLayers = [
            {
                layer: 10,
                count: 1,
                countWind: 3,
                countMax: 10,
                size: new V2(2,2),
                speedKoef: 1,
                img:() => this.snowflakeImgGenerator(1)
            },
            {
                layer: 8,
                count: 2,
                countWind: 6,
                countMax: 12,
                size: new V2(1.5,1.5),
                speedKoef: 0.75,
                img:() => this.snowflakeImgGenerator(0.75)
            },
            {
                layer: 7,
                count: 3,
                countWind: 9,
                countMax: 18,
                size: new V2(1,1),
                speedKoef: 0.5,
                img:() => this.snowflakeImgGenerator(0.5)
            }
        ]
        this.snowflakesCache = [];
        this.snowflakeSize = new V2(2,2);
        
        this.windDirectionAngle = {
            current: 0,
            max: 0,
            min: -45,
            step: 0.5,
            direction: -1
        }

        this.snowFlakesSpeed = {
            current: 0.25,
            step: 0.25,
            min: 0.25,
            max: 5,
            direction: 1
        }

        this.windStarted = false;
        this.windMax = false;
        this.windPower = {
            current: 0,
            step: 0.1,
            min: 0,
            max: 3,
            direction: 1
        }

        this.timings = {
            startWind: 1000,
            sadFace: 5000,
            sadFaceHooded: 3000,
            faceHooded: 6000,
            glasses: 3000
        }        

        this.windDirection = new V2(0,1).rotate(0);

        this.person = this.addGo(new Person({
            position: new V2(this.viewport.x/2, this.viewport.y*3/5)
        }), 9)

        this.addGo(new GO({
            position: new V2(this.viewport.x*15/16, this.viewport.y/2),
            size: new V2(this.viewport.x*1/8, this.viewport.y),
            //img: createCanvas(new V2(1,1), function(ctx, size) {  ctx.fillStyle = 'red', ctx.fillRect(0,0, size.x, size.y) }),
            handlers: {
                click: () => {
                    this.startWindTimer = createTimer(this.timings.startWind, () => {
                        this.startWindTimer = undefined;
                        this.windIncreaseTimer = createTimer(100, this.windIncreaseTimerMethod, this, false);
                        this.windStarted = true;
                        this.snowflakeGenerationTimer.originDelay = 50;
                        this.person.initEffects();
                    }, this, true);
                }
            }
        }))

        this.snowflakeGenerationTimer = createTimer(150, this.snowflakeGenerationTimerMethod, this, true);
        //this.snowflakesSpeedIncreaseTimer = createTimer(1000, this.snowflakesSpeedIncreaseTimerMethod, this, false);
        
        
    }

    windIncreaseTimerMethod(){
        for(let i =0;i < this.snowflakes.length;i++){
            this.snowflakes[i].windPower = this.windPower.current;
        }

        let wv = this.windPower;

        wv.current += wv.direction*wv.step;
        if(wv.current < wv.min){
            wv.current = wv.min;
            wv.direction = 1;
        }

        if(wv.current > wv.max){
            //this.windIncreaseTimer = undefined;
             wv.current = wv.max;
            // wv.direction = -1;
        }
    }

    snowflakesSpeedIncreaseTimerMethod(){
        let wd = this.windDirectionAngle;
        let ss = this.snowFlakesSpeed;

        let currentWindDirection = new V2(0,1).rotate(wd.current);

        for(let i =0;i < this.snowflakes.length;i++){
            let sf = this.snowflakes[i];
            sf.destination = sf.initialPosition.add(currentWindDirection.mul(this.viewport.y*2))
        }
        
        wd.current += wd.direction*wd.step;
        if(wd.current < wd.min){
            wd.current = wd.min;
            wd.direction = 1;
        }

        if(wd.current > wd.max){
            wd.current = wd.max;
            wd.direction = -1;
        }

        ss.current+=ss.direction*ss.step;
        if(ss.current < ss.min){
            ss.current = ss.min;
            ss.direction = 1;
        }

        if(ss.current > ss.max){
            ss.current = ss.max;
            ss.direction = -1;
        }
    }

    snowflakeGenerationTimerMethod(){
        for(let i = 0; i < this.snowFlakesLayers.length; i++){
            let layerInfo = this.snowFlakesLayers[i];
            let count = !this.windStarted ? layerInfo.count : layerInfo.countWind;
            if(this.windMax){
                count = layerInfo.countMax;
            }
            
            for(let j = 0; j < count; j++){
                let position;

                if(!this.windStarted) // no wind
                {
                    position = new V2(getRandom(-this.viewport.x*0.2, this.viewport.x*0.9),getRandom(-this.viewport.y*0.3, this.viewport.y*0));
                }
                else {
                    position = new V2(getRandom(-this.viewport.x*0.2, -1), getRandom(-this.viewport.y*0.2, this.viewport.y*0.95))
                }

                if(this.snowflakesCache[layerInfo.layer] == undefined){
                    this.snowflakesCache[layerInfo.layer] = [];
                }

                if(this.snowflakesCache[layerInfo.layer].length){
                    let sf = this.snowflakesCache[layerInfo.layer].pop();
                    sf.position = position;
                    sf.disabled = false;

                    
                }
                else {
                    // let isUp =  getRandomInt(0,3) == 3;
        
                    // if(!isUp){
                    //     if(getRandomInt(0,3) == 3){
                    //         position = new V2(getRandom(-this.viewport.x, -1), getRandom(this.viewport.y*0.7, this.viewport.y*0.95))
                    //     }
                    //     else {
                    //         position = new V2(getRandom(-this.viewport.x, -1), getRandom(-this.viewport.y*0.9, this.viewport.y*0.7))
                    //     }
                        
                    // }
                    // else 
                    //     position = new V2(getRandom(0, this.viewport.x*0.9),-1);
        
                    this.snowflakes.push(
                        this.addGo(new Snowflake({
                            layer: layerInfo.layer,
                            img: layerInfo.img(),//this.snowflakeImgGenerator(1),
                            position: position,
                            destination: position.add(this.windDirection.mul(this.viewport.y*2)), //new V2(this.viewport.x, this.viewport.y),
                            size: layerInfo.size,//this.snowflakeSize.clone(),
                            speed: 0.25,
                            speedKoef: layerInfo.speedKoef,
                            koefficients: {
                                k1: getRandom(0.9, 1.1),
                                k2: getRandom(0.9, 1.1),
                                sin: getRandomBool()
                            }
                    }), layerInfo.layer));

                    this.debugging.createdSf++;
                }
            }
        }

        
    }

    snowflakeImgGenerator(opacity) {
        let color = hexToRgb(this.snowFlakesColors[getRandomInt(0, this.snowFlakesColors.length-1)]);
        return createCanvas(new V2(20, 20), function(innerCtx, size){
            innerCtx.fillStyle=`rgba(${color},${opacity})`;
            drawFigures(innerCtx, [[new V2(0,5), new V2(5,0), new V2(15,0), new V2(20,5), new V2(20,15), new V2(15,20), new V2(5,20), new V2(0,15), new V2(0,5)]])
            innerCtx.fill();
        });
    }

    preMainWork(now){
        if(this.snowflakeGenerationTimer)
            doWorkByTimer(this.snowflakeGenerationTimer, now);

        if(this.windIncreaseTimer)
            doWorkByTimer(this.windIncreaseTimer, now);

        if(this.startWindTimer){
            doWorkByTimer(this.startWindTimer, now);
        }
    }

    backgroundRender(){
        // SCG.contexts.background.fillStyle = 'black';
        // SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
        SCG.contexts.background.drawImage(SCG.images.back, 0,0,SCG.viewport.real.width,SCG.viewport.real.height)
    }

    afterMainWork(now){
        if(this.debugging.enabled){

            let ctx = SCG.contexts.main;

            ctx.font = this.debugging.font;
            ctx.textAlign = this.debugging.textAlign;
            ctx.fillStyle = this.debugging.fillStyle;
            
            ctx.fillText(SCG.main.performance.fps, this.debugging.position.x, this.debugging.position.y);

            ctx.fillText('Created sf: ' + this.debugging.createdSf, this.debugging.position.x, this.debugging.position.y+50);
            
        }
        
    }
}

class Person extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            //imgPropertyName: 'personHeadless',
            size: new V2(140, 500).divide(2)
        }, options)

        super(options);

        this.hood = this.addChild(new GO({
            size: new V2(92, 88).divide(1.75),
            position: new V2(this.size.x*5/20, -this.size.y*14/40),
            //position: new V2(100, 100),
            imgPropertyName: 'hood'
        }))

        this.head = this.addChild(new GO({
            size: new V2(92, 88).divide(1.75),
            position: new V2(-this.size.x*0/20, -this.size.y*16.5/40),
            imgPropertyName: 'head'
        }));

        this.headSad = this.addChild(new GO({
            size: new V2(92, 88).divide(1.75),
            position: new V2(-this.size.x*0/20, -this.size.y*16.5/40),
            imgPropertyName: 'headSad',
            isVisible: false
        }));

        this.headSadHooded = this.addChild(new GO({
            size: new V2(92, 88).divide(1.75),
            position: new V2(-this.size.x*0/20, -this.size.y*16.5/40),
            imgPropertyName: 'headSadHooded',
            isVisible: false
        }));

        this.headHooded = this.addChild(new GO({
            size: new V2(92, 88).divide(1.75),
            position: new V2(-this.size.x*0/20, -this.size.y*16.5/40),
            imgPropertyName: 'headHooded',
            isVisible: false
        }));

        this.headHoodedGlasses = this.addChild(new GO({
            size: new V2(92, 88).divide(1.75),
            position: new V2(-this.size.x*0/20, -this.size.y*16.5/40),
            imgPropertyName: 'headHoodedGlasses',
            isVisible: false
        }));

        this.body = this.addChild(new GO({
            size: this.size.clone(),
            imgPropertyName: 'personHeadless',
            position: new V2()
        }))
    }

    initEffects() {
        let ps = this.parentScene;

        // this.makeSadFaceTimer = createTimer(ps.timings.sadFace, () => {
        //     this.head.addEffect(new FadeOutEffect({
        //         updateDelay: 50, effectTime: 500, initOnAdd: true,
        //         completeCallback: () => {
        //             this.head.isVisible = false;

        //             this.makeSadFaceHoodedTimer = createTimer(ps.timings.sadFaceHooded, () => {
        //                 this.hood.addEffect(new FadeOutEffect({updateDelay: 50, effectTime: 500, initOnAdd: true, disableEffectOnComplete: true, completeCallback: () => {
        //                     this.hood.disabled = true;
        //                 }}));
        //                 this.headSad.addEffect(new FadeOutEffect({updateDelay: 50, effectTime: 500, initOnAdd: true, disableEffectOnComplete: true, 
        //                     completeCallback: () => {
        //                         this.headSad.disabled = true;

        //                         this.makeHeadHoodedTimer = createTimer(ps.timings.faceHooded, () => {
        //                             this.makeHeadHoodedTimer = undefined;
        //                             this.headSadHooded.addEffect(new FadeOutEffect({updateDelay: 50, effectTime: 500, initOnAdd: true, disableEffectOnComplete: true,
        //                                 completeCallback: () => {
        //                                     this.headSadHooded.disabled = true;

        //                                     this.glassesTimer = createTimer(ps.timings.glasses, () => {
        //                                         this.glassesTimer = undefined;

        //                                         this.headHooded.addEffect(new FadeOutEffect({updateDelay: 50, effectTime: 500, initOnAdd: true, disableEffectOnComplete: true,
        //                                             completeCallback: () => {
        //                                                 this.headHooded.disabled = true;
        //                                             }}));
        //                                         this.headHoodedGlasses.addEffect(new FadeInEffect({updateDelay: 50, effectTime: 500, initOnAdd: true, disableEffectOnComplete: true}));
        //                                         this.headHoodedGlasses.isVisible = true;
        //                                     }, this, false);
        //                                 }}));
                                    
        //                             this.headHooded.addEffect(new FadeInEffect({updateDelay: 50, effectTime: 500, initOnAdd: true, disableEffectOnComplete: true}));
        //                             this.headHooded.isVisible = true;
        //                         }, this, false);
        //                     }}));
                        
        //                 this.headSadHooded.addEffect(new FadeInEffect({updateDelay: 50, effectTime: 500, initOnAdd: true, disableEffectOnComplete: true}));
        //                 this.headSadHooded.isVisible = true;

        //                 this.makeSadFaceHoodedTimer = undefined;
        //             }, this, false)
        //         }
        //     }));
        //     this.headSad.addEffect(new FadeInEffect({updateDelay: 50, effectTime: 500, initOnAdd: true, disableEffectOnComplete: true}));
        //     this.headSad.isVisible = true;

        //     this.makeSadFaceTimer = undefined;
        // }, this, false);

        this.makeHeadHoodedTimer = createTimer(ps.timings.faceHooded, () => {
            this.hood.addEffect(new FadeOutEffect({updateDelay: 50, effectTime: 500, initOnAdd: true, disableEffectOnComplete: true, completeCallback: () => {
                this.hood.disabled = true;
            }}));
            this.head.addEffect(new FadeOutEffect({
                updateDelay: 50, effectTime: 500, initOnAdd: true,
                completeCallback: () => {
                    this.head.isVisible = false;
                    this.head.disabled = true;

                    ps.windMax = true;
                    ps.windPower.max = 5;
                    this.glassesTimer = createTimer(ps.timings.glasses, () => {
                        this.glassesTimer = undefined;

                        this.headHooded.addEffect(new FadeOutEffect({updateDelay: 50, effectTime: 750, initOnAdd: true, disableEffectOnComplete: true,
                            completeCallback: () => {
                                this.headHooded.disabled = true;
                            }}));
                        this.headHoodedGlasses.addEffect(new FadeInEffect({updateDelay: 50, effectTime: 250, initOnAdd: true, disableEffectOnComplete: true}));
                        this.headHoodedGlasses.isVisible = true;
                    }, this, false);
                }
            }));
            this.headHooded.addEffect(new FadeInEffect({updateDelay: 50, effectTime: 500, initOnAdd: true, disableEffectOnComplete: true}));
            this.headHooded.isVisible = true;

            this.makeHeadHoodedTimer = undefined;
        }, this, false);
    }

    internalUpdate(now){
        if(this.makeSadFaceTimer){
            doWorkByTimer(this.makeSadFaceTimer, now);
        }

        if(this.makeSadFaceHoodedTimer){
            doWorkByTimer(this.makeSadFaceHoodedTimer, now);
        }

        if(this.makeHeadHoodedTimer){
            doWorkByTimer(this.makeHeadHoodedTimer, now);
        }

        if(this.glassesTimer){
            doWorkByTimer(this.glassesTimer, now);
        }
    }
}

class Snowflake extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            speed: 1,
            positionChangeProcesser: function() { return this.positionChangeProcesserInternal() },
            koefficients: {
                k1: 1,
                k2: 1
            },
            windPower: 0,
            layer: 0,
        }, options)

        super(options);

        this.initialPosition = this.position.clone();
        this.initialDestination = this.destination.clone();
    }

    init(){
        this.setDirectionVector();
    }

    positionChangeProcesserInternal(){
        this.position.add(this.speedV2.mul(this.speedKoef), true);
        this.position.x += (((this.koefficients.sin ? Math.sin : Math.cos).call(null, this.position.y/(20*this.koefficients.k1)) *0.5*this.koefficients.k2) + this.windPower)*this.speedKoef;
    }

    destinationCompleteCheck(){
        return this.position.x > this.parentScene.viewport.x || this.position.y > this.parentScene.viewport.y;
        // if(completed){
        //     console.log('sf dest completed')
        // }

        //return completed;
    }

    setDirectionVector(){
        this.setDestination(this.destination);
        this.speedV2 = this.direction.mul(this.speed);
    }

    destinationCompleteCallBack(){
        this.position = this.initialPosition.clone();
        this.destination = this.initialDestination.clone();
        
        this.setDirectionVector();

        this.disabled = true;

        this.parentScene.snowflakesCache[this.layer].push(this);
    }

    internalRender(){
        // SCG.contexts.background.fillStyle = 'blue';
        // SCG.contexts.background.fillRect(this.renderPosition.x - this.renderSize.x/2, this.renderPosition.y - this.renderSize.y/2, this.renderSize.x, this.renderSize.y);

        // SCG.contexts.background.fillStyle = 'black';
    }
}