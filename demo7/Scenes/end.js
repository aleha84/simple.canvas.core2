class EndScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            debug: {
                enabled: true
            }
        }, options)

        super(options);

        this.frameSize = new V2(36,36);
        this.framesCount = 10;
        this.textureCacheName = 'sphereEnd';
    }

    start() {

        this.textureSize = new V2(800, 400);
        this.sphereSize = new V2(100,100);
        sphereHelper.clearCache();
        this.lowerTexture = textureGenerator.textureGenerator({
            size: this.textureSize,
            backgroundColor: '#4F301C',
            surfaces: [
                textureGenerator.getSurfaceProperties({ colors: ['#0A0100', '#0A0000', '#070000', '#110000','#0E0000'],  opacity: [0.05, 0.1], fillSize: new V2(10,10),type:'rect', density: 0.2, indents: {h: new V2(-10,-10)} }),                  
                textureGenerator.getSurfaceProperties({ colors: ['#7C5039', '#55321E', '#A87456', '#331A0B','#784F36'],  opacity: [0.05, 0.1], fillSize: new V2(5,5),type:'rect', density: 0.005, indents: {h: new V2(-10,-10)} }),                  
                textureGenerator.getSurfaceProperties({ colors: ['#FF291D', '#8A0502', '#F5120A', '#FF2B11','#FB1C0E'],  opacity: [0.5, 1], fillSize: new V2(1,1),type:'rect', density: 0.01, indents: {h: new V2(-1,-1)} }),                  
                // textureGenerator.getSurfaceProperties({ 
                //     colors: ['#FFF977', '#FFE46D','#FFF37A', '#FFE567', '#FFF381'], fillSize: new V2(5,5), opacity: [0.5], 
                //     type:'blot', blot: { ttl: 40, density: 0, decreaseSize: true }, density: 0.001  }),   
            ]
        });
        this.baseTexture = textureGenerator.textureGenerator({
            size: this.textureSize,
            backgroundColor: '#1C2C3B',
            surfaces: [
                textureGenerator.getSurfaceProperties({ colors: ['#83A696'],  opacity: [0.025, 0.05], fillSize: new V2(10,10),type:'rect', density: 0.1, indents: {h: new V2(-10,-10)} }),
                //textureGenerator.getSurfaceProperties({ colors: ['#FFE194'],  opacity: [0.05, 0.1], fillSize: new V2(2,2),type:'rect', density: 0.1 }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFE194', '#EDB269','#FCDD8D', '#172738', ], line: {directionAngle:90, angleSpread: 45, length: [10,40], path: {segments: [2,4]} }, opacity: [0.01, 5], type:'path', density: 0.001 }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFE194', '#EDB269','#FCDD8D', '#172738', ], line: {directionAngle:0, angleSpread: 45, length: [10,20], path: {segments: [1,3]} }, opacity: [0.01, 5], type:'path', density: 0.0005 }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFE194', '#EDB269','#FCDD8D', '#172738', ], fillSize: new V2(2,2), opacity: [0.25, 5], type:'rect', density: 0.001 }),
                textureGenerator.getSurfaceProperties({ 
                    colors: ['#FFE194', '#EDB269','#FCDD8D', '#172738'], fillSize: new V2(3,3), opacity: [0.5], 
                    type:'blot', blot: { ttl: 12, density: 0.75, decreaseSize: true }, density: 0.0001  }),                                       
            ]
        });

        this.diskSize = 200;
        this.time = 0;
        this.speed =0.5;

        this.layeredStars = []

        this.itemsCountPerLayer = 1;
        for(let layer = 0; layer < 5; layer++){
            this.layeredStars[layer] = [];
            for(let i = 0;i<this.itemsCountPerLayer;i++){
                this.layeredStars[layer][i] = [
                    this.addGo(new GO({
                        size: this.viewport,
                        position: this.sceneCenter.add(new V2(this.viewport.x*i,0)),
                        img: this.starsLayerGeneratr(this.viewport, 0.0075*(Math.pow(0.1,(layer))), 0.05 + (0.05*layer)),
                    }), layer),
                    
                ]
            }
        }

        

        this.rotationTimer = createTimer(35, () => {
            this.sphereImg = sphereHelper.createPlanetTexure(this.processedTexture, this.textureCacheName,this.textureSize, this.diskSize, this.speed, this.time, true, false);
            this.planet.sphere.img = this.sphereImg;

            this.time++;
        }, this, false);

        this.groundExplosions = []


        this.processedTexture = this.textureProcesser();

        this.sphereImg = sphereHelper.createPlanetTexure(this.processedTexture, this.textureCacheName, this.textureSize, this.diskSize, this.speed, 0, true, false);

        this.planet = this.addGo(new GO({
            size: this.sphereSize,
            position: this.sceneCenter
        }), 10);

        this.planet.sphere = this.planet.addChild(new GO({
            size: this.sphereSize,
            position: new V2(),
            img: this.sphereImg
        }));

        // this.tr = this.addGo(new GO({
        //     position: this.sceneCenter, 
        //     size: this.textureSize.mul(0.5),
        //     img: this.processedTexture
        // }));


        this.ssImg = createCanvas(new V2(1,1), (ctx, size) => {
            ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0,0,size.x, size.y);
        })

         this.ss = []
        // for(let i =0;i <30; i++){
        //     this.ss.push(this.addGo(new MovingGO({
        //         img: this.ssImg,
        //         position: this.getRandomPosition(),
        //         size: new V2(1,1).mul(getRandom(0.5,1)),
        //         speed:10,
        //         init() {
        //             this.flyTimer = createTimer(getRandomInt(1000, 10000), () => {
        //                 this.setDestination(new V2((getRandomBool() ? -10: this.parentScene.viewport.x + 10),getRandomInt(50, this.parentScene.viewport.y-50)));
        //                 this.flyTimer = undefined;
        //             }, this, false);
        //         },
        //         internalUpdate(now){
        //             if(this.flyTimer)
        //                 doWorkByTimer(this.flyTimer, now);
        //         }
        //     }), 15));
        // }


        this.textureModificationTimer = createTimer(50, () => {
            for(let exp of this.groundExplosions){
                if(exp.easeOutSpeed.time <= exp.easeOutSpeed.duration){
                    exp.speed = this.easeOut(exp.easeOutSpeed.time++, exp.originSpeed, exp.easeOutSpeed.change, exp.easeOutSpeed.duration);
                }

                if(exp.easeOutSkirt.time <= exp.easeOutSkirt.duration){
                    exp.skirt = this.easeOut(exp.easeOutSkirt.time++, exp.originSkirt, exp.easeOutSkirt.change, exp.easeOutSkirt.duration);
                }

                if(exp.speed > 0.01){
                    if(exp.currentRadius < exp.maxRadius)
                        exp.currentRadius+=exp.speed;

                    if(exp.currentRadius > exp.maxRadius)
                        exp.currentRadius = exp.maxRadius;
                }

                
            }

            this.processedTexture = this.textureProcesser();
            //this.tr.img = this.processedTexture;
        }, this, true);

        this.explosionMaxRadius = 50;
        this.bombardment = {
            current: this.textureSize.x/4,
            start: this.explosionMaxRadius,
            max: this.textureSize.x - this.explosionMaxRadius,
            lastTime: 0
            // speed: 0.1,
            // time: 0
        }
        
        this.bombardmentTimer = createTimer(750, () => {
            let b= this.bombardment;
            b.current+= this.speed*(this.time-b.lastTime);
            b.lastTime = this.time;
            if(b.current > b.max){
                b.current = b.start;
            }

            let duration = getRandomInt(150,300);
            let speed = getRandom(0.25,0.6);
            let p = new V2(b.current, getRandom(this.explosionMaxRadius/2, this.textureSize.y-this.explosionMaxRadius/2));
            // let px = this.sceneCenter.x;
            // let py = this.sceneCenter.y - this.sphereSize.y/2 + this.sphereSize.y*(p.y/this.textureSize.y);

            // let ss = this.ss[getRandomInt(0, this.ss.length-1)].position;
            // let isPHigher = py  > ss.y;
            // let shotSize = new V2(Math.abs(px - ss.x), Math.abs(py - ss.y));
            // let distance = ss.distance(new V2(px, py));
            // if(shotSize.x > 1 && shotSize.y > 1){
            //     this.addGo(new GO({
            //         position: !isPHigher? new V2(px - shotSize.x/2, py + shotSize.y/2) : new V2(px - shotSize.x/2, py - shotSize.y/2),
            //         size: shotSize,
            //         img: createCanvas(shotSize, (ctx, size) => {
            //             ctx.lineWidth = 0.25;ctx.strokeStyle = '#00FF00';
            //             if(!isPHigher){
            //                 ctx.moveTo(0, size.y);ctx.lineTo(size.x, 0);
            //             }
            //             else{
            //                 ctx.moveTo(0, 0);ctx.lineTo(size.x, size.y);
            //             }
    
            //             ctx.stroke();
            //             // ctx.fillStyle = 'green';
            //             // ctx.fillRect(0,0, size.x, size.y);
            //         }),
            //         init(){
            //             this.setDeadTimer = createTimer(500, () => this.setDead(), this, false);
            //         },
            //         internalUpdate(now) {
            //             doWorkByTimer(this.setDeadTimer, now);
            //         }
            //     }), 20)
            // }
            

            this.groundExplosions.push({
                position: new V2(b.current, getRandom(this.explosionMaxRadius/2, this.textureSize.y-this.explosionMaxRadius/2)),//this.textureSize.mul(0.5),
                currentRadius: 0,
                maxRadius: 50,
                originSpeed: speed,
                speed: speed, 
                easeOutSpeed: {
                    duration: duration,
                    change: -speed,
                    time: 0
                },
                originSkirt: 3,
                skirt: 3,
                easeOutSkirt: {
                    duration: duration,
                    change: -2,
                    time: 0
                }
            })

            b.time++;
        }, this, true);
    }

    getRandomPosition() {
        return new V2(this.sceneCenter.x - this.sphereSize.x + getRandom(-20, 20), this.sceneCenter.y + getRandom(-20, 20))
    }

    easeOut(time, startValue, change, duration) {
        time /= duration;
        return -change * time*(time-2) + startValue;
    }

    textureProcesser() {
        return createCanvas(this.textureSize, (ctx, size) => {
            ctx.drawImage(this.lowerTexture,0,0,size.x, size.y);

            let middleImg = createCanvas(this.textureSize, (ctx, size) => {
                ctx.drawImage(this.baseTexture,0,0,size.x, size.y);
                for(let exp of this.groundExplosions){
                    let r = exp.currentRadius/exp.skirt;
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(exp.position.x, exp.position.y, r, 0, Math.PI*2, false);
                    ctx.clip();
                    ctx.clearRect(exp.position.x-r, exp.position.y-r, r*2, r*2);
                    ctx.restore();
                }
            });
            
            ctx.drawImage(middleImg,0,0,size.x, size.y);

            for(let exp of this.groundExplosions){
                if(exp.currentRadius == 0)
                    continue;
                
                    let grd = ctx.createRadialGradient(exp.position.x, exp.position.y, exp.currentRadius/exp.skirt, exp.position.x, exp.position.y, exp.currentRadius);
                    grd.addColorStop(0, 'rgba(225,63,38,0)');grd.addColorStop(0.8, 'rgba(255,197,79, 1)');grd.addColorStop(1, 'rgba(255,255,128,1)');grd.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.fillStyle = grd;
                    ctx.fillRect(exp.position.x - exp.currentRadius, exp.position.y - exp.currentRadius, exp.currentRadius*2, exp.currentRadius*2);

                    grd = ctx.createRadialGradient(exp.position.x, exp.position.y, 0, exp.position.x, exp.position.y, exp.maxRadius/15);
                    grd.addColorStop(0.5, 'rgba(255,255,128,1)');grd.addColorStop(1, 'rgba(225,63,38,1)');grd.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.fillStyle = grd;
                    ctx.fillRect(exp.position.x - exp.maxRadius/10, exp.position.y - exp.maxRadius/10, exp.maxRadius/5, exp.maxRadius/5);
            }
            
        })
    }

    starsLayerGeneratr(size, density, opacity) {
        return textureGenerator.textureGenerator({
            size: size,
            backgroundColor: 'rgba(255,255,255,0)', 
            surfaces: [
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF'], fillSize: new V2(1,1), opacity: [opacity],  type:'rect', density: density }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF'], fillSize: new V2(1,1), opacity: [opacity],  type:'rect', density: density*0.9, indents: { v: new V2(size.y/5, size.y/5) } }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF'], fillSize: new V2(1,1), opacity: [opacity],  type:'rect', density: density*0.8, indents: { v: new V2(size.y/3, size.y/3) } }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF'], fillSize: new V2(1,1), opacity: [opacity],  type:'rect', density: density*0.7, indents: { v: new V2(size.y*4/10, size.y*4/10) } }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF'], fillSize: new V2(1,1), opacity: [opacity],  type:'rect', density: density*0.5, indents: { v: new V2(size.y*9/20, size.y*9/20) } }),
        ]})
    }

    afterMainWork(now)
    {
        if(this.rotationTimer)
            doWorkByTimer(this.rotationTimer, now);

        if(this.explosionsTimer){
            doWorkByTimer(this.explosionsTimer, now);
        }

        if(this.textureModificationTimer){
            doWorkByTimer(this.textureModificationTimer, now);
        }

        if(this.bombardmentTimer)
            doWorkByTimer(this.bombardmentTimer, now);
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);

        let grd = SCG.contexts.background.createLinearGradient(SCG.viewport.real.width/2, 0, SCG.viewport.real.width/2, SCG.viewport.real.height);
        grd.addColorStop(0, 'rgba(255,255,255,0)');grd.addColorStop(0.1, 'rgba(255,255,255,0)');grd.addColorStop(0.5, 'rgba(255,255,255,0.04)');
        grd.addColorStop(0.9, 'rgba(255,255,255,0)');grd.addColorStop(1, 'rgba(255,255,255,0)');

        SCG.contexts.background.fillStyle = grd;
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}
