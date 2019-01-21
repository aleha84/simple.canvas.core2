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
    }

    start() {

        this.textureSize = new V2(800, 400);
        this.sphereSize = new V2(100,100);
        sphereHelper.clearCache();
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

        // this.diskSize = 200;
        // this.time = 0;
        // this.speed =0.05;
        //this.sphereImg = sphereHelper.createPlanetTexure(this.texture, 'sphere', this.textureSize, this.diskSize, this.speed, 0, true);

        // this.planet = this.addGo(new GO({
        //     size: this.sphereSize,
        //     position: this.sceneCenter
        // }), 10);

        // this.planet.sphere = this.planet.addChild(new GO({
        //     size: this.sphereSize,
        //     position: new V2(),
        //     img: this.sphereImg
        // }));

        // this.layeredStars = []

        // this.itemsCountPerLayer = 1;
        // for(let layer = 0; layer < 5; layer++){
        //     this.layeredStars[layer] = [];
        //     for(let i = 0;i<this.itemsCountPerLayer;i++){
        //         this.layeredStars[layer][i] = [
        //             this.addGo(new GO({
        //                 size: this.viewport,
        //                 position: this.sceneCenter.add(new V2(this.viewport.x*i,0)),
        //                 img: this.starsLayerGeneratr(this.viewport, 0.0075*(Math.pow(0.1,(layer))), 0.05 + (0.05*layer)),
        //             }), layer),
                    
        //         ]
        //     }
        // }

        

        // this.rotationTimer = createTimer(35, () => {
        //     this.sphereImg = sphereHelper.createPlanetTexure(this.texture, 'sphere',this.textureSize, this.diskSize, this.speed, this.time, true);
        //     this.planet.sphere.img = this.sphereImg;

        //     this.time++;
        // }, this, false);

        this.groundExplosions = [{
            position: this.textureSize.mul(0.5),
            currentRadius: 0,
            maxRadius: 50,
            originSpeed: 0.5,
            speed: 0.5, 
            easeOutSpeed: {
                duration: 200,
                change: -0.5,
                time: 0
            },
            originSkirt: 3,
            skirt: 3,
            easeOutSkirt: {
                duration: 200,
                change: -2,
                time: 0
            }
        }]

        this.processedTexture = this.textureProcesser();

        this.tr = this.addGo(new GO({
            position: this.sceneCenter, 
            size: this.textureSize.mul(0.5),
            img: this.processedTexture
        }));

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
            this.tr.img = this.processedTexture;
        }, this. true);
    }

    easeOut(time, startValue, change, duration) {
        time /= duration;
        return -change * time*(time-2) + startValue;
    }

    textureProcesser() {
        return createCanvas(this.textureSize, (ctx, size) => {
            ctx.drawImage(this.baseTexture,0,0,size.x, size.y);

            for(let exp of this.groundExplosions){
                if(exp.currentRadius == 0)
                    continue;
                
                    let grd = ctx.createRadialGradient(exp.position.x, exp.position.y, exp.currentRadius/exp.skirt, exp.position.x, exp.position.y, exp.currentRadius);
                    grd.addColorStop(0, 'rgba(255,255,255,0)');grd.addColorStop(1, 'rgba(255,255,255,1)');grd.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.fillStyle = grd;
                    ctx.fillRect(exp.position.x - exp.currentRadius, exp.position.y - exp.currentRadius, exp.currentRadius*2, exp.currentRadius*2);
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

    getRandomPosition() {
        if(getRandomInt(0,5) < 4){
            return this.sceneCenter.add(new V2(getRandom(-100, 100), getRandom(-10, 10)));
        }
        else{
            return this.sceneCenter.add(new V2(getRandom(-50, 50), getRandom(-30, 30)));
        }
        
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
