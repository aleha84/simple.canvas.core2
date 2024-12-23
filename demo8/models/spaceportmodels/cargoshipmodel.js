class CargoShip extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(100, 20),
            thrustersAngle: -20,
            levitation: {
                time: 0, 
                duration: 40, 
                startValue: 0, 
                change: 5, 
                min: 0,
                max: 5,
                direction: 1,
                type: 'quad',
                method: 'inOut',
            },
        }, options);

        super(options);

        this.script.items = [
            function(){
                this.setIgnition('big');
                this.processScript();
            },
            function(){
                this.scriptTimer = this.createScriptTimer(
                    function() { this.position.x+=-1; },
                    function() {return this.position.x <= 300})
            },
            function(){
                let brake = { time: 0, duration: 100, change: -50, type: 'quad', method: 'out', startValue: this.position.x };
                let tv = { time: 0, duration: 100, change: 20, type: 'quad', method: 'out', startValue: -20 }

                this.scriptTimer = this.createScriptTimer(
                    function() { 
                        this.position.x =  easing.process(brake)
                        this.thrustersAngle = easing.process(tv); 
                        brake.time++;
                        tv.time = brake.time;
                    },
                    function() { return brake.time > brake.duration; });
            },
            function(){
                this.levitationTimer = undefined;
                let fall = { time: 0, duration: 100, change: 50, type: 'quad', method: 'in', startValue: this.position.y };

                this.scriptTimer = this.createScriptTimer(
                    function(){ this.position.y = easing.process(fall); fall.time++; },
                    function() { return fall.time > fall.duration; });
                    
            },
            function(){
                this.scriptTimer = this.createScriptTimer(
                    function() {this.position.y+=1;},
                    function() { return this.position.y >= 210; });
            },
            function(){
                let fall = { time: 0, duration: 100, change: 50, type: 'quad', method: 'out', startValue: this.position.y };
                //let csShadowIncrease = { time: 0, duration: 100, change: 99, type: 'quad', method: 'out', startValue: 1 };

                var target = new V2(this.position.x, 265);
                let ignitionSmallSet = false;
                let ignitionNoneSet = false;

                //let cargoShipShadow = this.parentScene.ground.landingPad.cargoShipShadow;
                //cargoShipShadow.isVisible = true;
                this.parentScene.toggleDust(true, [target.add(this.frontalThruster.position),target.add(this.rearThruster.position)])
                this.scriptTimer = this.createScriptTimer(
                    function () {
                        this.position.y = easing.process(fall); 
                        // cargoShipShadow.size.x = easing.process(csShadowIncrease); 
                        // cargoShipShadow.needRecalcRenderProperties = true;
                        fall.time++;
                        //csShadowIncrease.time++;
                        if(fall.time > fall.duration/2 && !ignitionSmallSet){
                            ignitionSmallSet = true;
                            this.setIgnition('small');
                        }

                        if(fall.time > fall.duration*3/4 && !ignitionNoneSet){
                            ignitionNoneSet = true;
                            this.setIgnition('none');
                            this.parentScene.toggleDust(false);
                        }
                        },
                    function() { return fall.time > fall.duration; });
            }
        ]
    }

    init() {
        
        this.shadow = this.addChild(new GO({
            size: new V2(10, 2),
            position: new V2(50,this.parentScene.viewport.y - this.position.y-this.shadowTargetY),
            img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0,0,1,1) }),
        }))

        this.shadow.target = {
            sizeX: 100,
            positionY: 25,
            positionX: 7
        }

        this.igniteImg = createCanvas(new V2(spacePortImages.igniteImages.length*6, 15), (ctx, size) => {
            for(let i = 0; i < spacePortImages.igniteImages.length; i++){
                ctx.drawImage(PP.createImage(spacePortImages.igniteImages[i]), 6*i,0);
            }
        })
        this.igniteSmallImg = createCanvas(new V2(spacePortImages.igniteSmallImages.length*6, 6), (ctx, size) => {
            for(let i = 0; i < spacePortImages.igniteSmallImages.length; i++){
                ctx.drawImage(PP.createImage(spacePortImages.igniteSmallImages[i]), 6*i,0);
            }
        })
        this.body = this.addChild(new GO({
            renderValuesRound: true,
            size: this.size,
            position: new V2(),
            img: PP.createImage(spacePortImages.cargoSpaceShipBase)
        }));

        this.cargo = this.addChild(new GO({
            renderValuesRound: true,
            position: new V2(1,4),
            size: new V2(60,20),
            img: PP.createImage(spacePortImages.cargoContainer)
        }))

        let thrusterImage = PP.createImage(spacePortImages.thruster);
        this.frontalThruster = this.addChild(new GO({
            renderValuesRound: true,
            position: new V2(-38, 7),
            size: new V2(8,15),
            img: thrusterImage,
            internalPreRender() {
                if(this.parent.thrustersAngle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(this.parent.thrustersAngle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            },
            internalRender() {
                if(this.parent.thrustersAngle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(-this.parent.thrustersAngle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            }
        }));

        this.rearThruster = this.addChild(new GO({
            renderValuesRound: true,
            position: new V2(40, 7),
            size: new V2(8,15),
            img: thrusterImage,
            internalPreRender() {
                if(this.parent.thrustersAngle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(this.parent.thrustersAngle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            },
            internalRender() {
                if(this.parent.thrustersAngle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(-this.parent.thrustersAngle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            }
        }));

        this.indicators = [new V2(-35, -8), new V2(-15, -8), new V2(15, -8), new V2(35, -8)].map(p => this.addChild(new GO({
            position: p,
            size: this.size,
            init() {
                this.addChild(new GO({
                    position: new V2(),
                    size: new V2(1,1),
                    imgRed: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#F24121', ctx.fillRect(0,0, 1,1) }),
                    imgYellow: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#F2D94A', ctx.fillRect(0,0, 1,1) }),
                    init() {
                        this.img = this.imgRed;
                        this.isRed = true;
                        this.toggleTimer = createTimer(500, () => {
                            this.img = this.isRed? this.imgRed : this.imgYellow;
                            this.isRed = !this.isRed;
                        })
                    },
                    internalUpdate(now){
                        if(this.toggleTimer)
                            doWorkByTimer(this.toggleTimer, now);
                    }
                }))
            }
        })))

        this.originalY = this.position.y;
        this.levitationTimer = createTimer(50, () => {
            let l = this.levitation;

            if(l.time > l.duration){
                l.direction*=-1;
                l.time = 0;

                if(l.direction < 0){
                    l.startValue = l.max;
                    l.change = -l.max;
                }
                else if(l.direction > 0){
                    l.startValue = l.min;
                    l.change = l.max;
                }
                
            }

            let delta = easing.process(l);
            this.position.y = this.originalY + delta;

            this.needRecalcRenderProperties = true;
            l.time++;
        }, this, true);

        this.processScript();
    }
    setIgnition(type) {
        if(type == 'none'){
            if(this.frontalThruster.fire)
                this.frontalThruster.fire.setDead();
            if(this.rearThruster.fire)
                this.rearThruster.fire.setDead();
        }
        else if(type == 'big'){
            this.setIgnition('none')
            this.frontalThruster.fire = this.frontalThruster.addChild(new Ignition({  
                position: new V2(0,14.75),
                img: this.igniteImg,
                type: type
            }));

            this.rearThruster.fire = this.rearThruster.addChild(new Ignition({
                position: new V2(0,14.75),
                img: this.igniteImg,
                type: type
            }));
        }
        else if(type == 'small'){
            this.setIgnition('none')
            this.frontalThruster.fire = this.frontalThruster.addChild(new Ignition({  
                position: new V2(0,10.25),
                img: this.igniteSmallImg,
                type: type
            }));

            this.rearThruster.fire = this.rearThruster.addChild(new Ignition({
                position: new V2(0,10.25),
                img: this.igniteSmallImg,
                type: type
            }));
        }
    }

    internalUpdate(now) {
        if(this.levitationTimer)
            doWorkByTimer(this.levitationTimer, now);

        this.shadow.position.y = this.parentScene.viewport.y - this.position.y-this.shadow.target.positionY;
        let nSHadowSIzeX = fastRoundWithPrecision(100*this.position.y/265);
        if(this.shadow.size.x != nSHadowSIzeX) {
            this.shadow.size.x = nSHadowSIzeX;
            this.shadow.img = createCanvas(new V2(this.shadow.size), (ctx, size) => {
                ctx.fillStyle = 'rgba(0,0,0,0.2)'; 
                ctx.fillRect(1,0,size.x-1,1)
                ctx.fillRect(0,1,size.x-1,1)
            });
        }
        this.shadow.position.x = 100 + this.shadow.target.positionX - (100 * this.position.y/265);
        //this.shadow.needRecalcRenderProperties = true;
    }
}

class Ignition extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            renderValuesRound: true,
            isAnimated: true,
            type: 'big',
            animation: {
                framesRowsCount: 1,
                frameChangeDelay: 150,
                loop: true
            }
        }, options);

        switch(options.type){
            case 'big':
                options.size = new V2(6,15);
                options.animation.totalFrameCount = spacePortImages.igniteImages.length;
                options.animation.framesInRow = spacePortImages.igniteImages.length;
                options.animation.destinationFrameSize =new V2(6,15);
                options.animation.sourceFrameSize = new V2(6,15);
                break;
            case 'small':
                options.size = new V2(6,6);
                options.animation.totalFrameCount = spacePortImages.igniteSmallImages.length;
                options.animation.framesInRow = spacePortImages.igniteSmallImages.length;
                options.animation.destinationFrameSize =new V2(6,6);
                options.animation.sourceFrameSize = new V2(6,6);
                break;
        }

        super(options);
    }
}