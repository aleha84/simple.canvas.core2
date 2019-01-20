class ExplosionsScene extends Scene {
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
        this.animations = [
            this.prepareAnimation3(),
            this.prepareAnimation('tr'),
            this.prepareAnimation('tl'),
            this.prepareAnimation('bl'),
            this.prepareAnimation('br')
        ];

        // this.addGo(new GO({
        //     position: this.sceneCenter, 
        //     size: new V2(this.frameSize.x*this.framesCount, this.frameSize.y),
        //     img: this.prepareAnimation('br')
        // }));

        this.explosionsTimer = createTimer(75, () => this.crateExplosion(), this, true);

        this.textureSize = new V2(800, 400);
        this.sphereSize = new V2(100,100);
        this.texture = textureGenerator.textureGenerator({
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
                textureGenerator.getSurfaceProperties({ 
                        colors: ['#0B1A2B'], fillSize: new V2(7,7), opacity: [1], 
                        type:'blot', blot: { ttl: 10, density: 1, decreaseSize: true }, density: 0.00025  }),                    
            ]
        });
    
        this.diskSize = 200;
        this.time = 0;
        this.speed =0.05;
        this.sphereImg = sphereHelper.createPlanetTexure(this.texture, 'sphere', this.textureSize, this.diskSize, this.speed, 0, true);

        this.planet = this.addGo(new GO({
            size: this.sphereSize,
            position: this.sceneCenter
        }), 10);

        this.planet.sphere = this.planet.addChild(new GO({
            size: this.sphereSize,
            position: new V2(),
            img: this.sphereImg
        }));

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

        this.ssImg = createCanvas(new V2(1,1), (ctx, size) => {
            ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0,0,size.x, size.y);
        })

        this.ss = []
        for(let i =0;i <100; i++){
            this.ss.push(this.addGo(new MovingGO({
                img: this.ssImg,
                position: this.getRandomPosition(),
                size: new V2(1,1).mul(getRandom(0.5,1)),
                speed:getRandom(0.01,0.025),
                setDestinationOnInit: true,
                destination: this.getRandomPosition(),
                destinationCompleteCallBack() {
                    this.setDestination(this.parentScene.getRandomPosition())
                }
            }),getRandomBool() ? 9: 15));
        }

        this.rotationTimer = createTimer(35, () => {
            this.sphereImg = sphereHelper.createPlanetTexure(this.texture, 'sphere',this.textureSize, this.diskSize, this.speed, this.time, true);
            this.planet.sphere.img = this.sphereImg;

            this.time++;
        }, this, false);

        this.ssTimer = createTimer(250, () => {
            switch(getRandomInt(0,2)){
                case 0:
                    let p = this.ss[getRandomInt(0, this.ss.length)];
                    if(p == undefined)
                        break;
                    p = p.position;
                    let d = this.ss.filter(s => p.distance(s.position) > 50);
                    if(d.length == 0)
                        break;

                    d = d[0].position;
                    let direction = p.direction(d);
                    let img = createCanvas(new V2(10,10), (ctx, size) => {
                        ctx.strokeStyle = getRandomBool() ? 'red': 'green';
                        let start = new V2(size.x/2, size.y/2).add(direction.mul(-size.x/2));
                        ctx.beginPath();
                        ctx.moveTo(start.x, start.y);
                        let dest = start.add(direction.mul(size.x));
                        ctx.lineTo(dest.x, dest.y);
                        ctx.stroke();
                    })
                    this.addGo(new MovingGO({
                        position: p.clone(),
                        size: new V2(5, 5),
                        img: img,
                        setDestinationOnInit: true,
                        destination: d,
                        setDeadOnDestinationComplete: true, 
                        speed:3
                    }), 20)
                    break;
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;
            }
        }, this, true)

        // this.addGo(new GO({
        //     position: this.sceneCenter, 
        //     size: this.textureSize.mul(0.5),
        //     img: this.texture
        // }));
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

    crateExplosion() {

        this.addGo(new GO({
            position: this.getRandomPosition(), 
            size: this.frameSize,
            isAnimated: true,
            animation: {
                totalFrameCount: this.framesCount,
                framesInRow: this.framesCount,
                framesRowsCount: 1,
                frameChangeDelay: getRandomInt(25,50),
                destinationFrameSize:this.frameSize.mul(getRandom(0.05,0.2)),
                sourceFrameSize: this.frameSize,
                loop: false,
                animationEndCallback() {
                    this.setDead();
                    
                }
            },
            img: this.animations[getRandomInt(0, this.animations.length-1)]
        }), 20);
    }    

    prepareAnimation3(){
        return createCanvas(new V2(this.frameSize.x*this.framesCount, this.frameSize.y), (ctx, size) => {
            let items = [
                { p: new V2(this.frameSize.x/2, this.frameSize.y/2), size: this.frameSize.x/10, maxSize: this.frameSize.x/2 },
                // { p: new V2(this.frameSize.x*9/20, this.frameSize.y*9/20), size: this.frameSize.x/20, maxSize: this.frameSize.x/3 },
                // { p: new V2(this.frameSize.x*11/20, this.frameSize.y*11/20), size: this.frameSize.x/20, maxSize: this.frameSize.x/3 }
            ]
            for(let i = 0; i < this.framesCount; i++){
                for(let item of items){
                    let size = item.size + i*(item.maxSize - item.size)/this.framesCount
                    ctx.arc(item.p.x + this.frameSize.x*i, item.p.y, size, 0, Math.PI*2, false);
                    let grd;
                    if(i < this.framesCount/2){
                        grd = ctx.createRadialGradient(item.p.x + this.frameSize.x*i, item.p.y, 0,item.p.x + this.frameSize.x*i,item.p.y,size);
                        grd.addColorStop(0, '#FFFFFF'); grd.addColorStop(0.5, '#FFF200'); grd.addColorStop(1, '#FF7E28');grd.addColorStop(1, 'rgba(0,0,0,0');
                    }
                    else {
                        grd = ctx.createRadialGradient(item.p.x + this.frameSize.x*i, item.p.y, (i - this.framesCount/2)*item.maxSize/(this.framesCount/2)  ,item.p.x + this.frameSize.x*i,item.p.y,size);
                        grd.addColorStop(0, 'rgba(0,0,0,0)');grd.addColorStop(0, '#FFFFFF'); grd.addColorStop(0.5, '#FFF200'); grd.addColorStop(1, '#FF7E28');grd.addColorStop(1, 'rgba(0,0,0,0');
                    }
                    ctx.fillStyle = grd;
                    ctx.fillRect(this.frameSize.x*i, 0, this.frameSize.x, this.frameSize.y);
                }
            }
        })
    }

    prepareAnimationG(){
        return createCanvas(new V2(this.frameSize.x*this.framesCount, this.frameSize.y), (ctx, size) => {
            for(let i = 0; i < this.framesCount; i++){
                ctx.drawImage(
                textureGenerator.textureGenerator({
                    size: this.frameSize,
                    backgroundColor: colors.rgba.transparentWhite,
                    surfaces: [
                        textureGenerator.getSurfaceProperties({
                            type: 'blot',
                            indents: {
                                h: new V2(this.frameSize.x/2-1, this.frameSize.x/2-1),
                                v: new V2(this.frameSize.y/2-1, this.frameSize.y/2-1)
                            },
                            fillSize: new V2(3,3),
                            colors: ['#FFC90E'],
                            opacity: [0.1, 0.5],
                            preciseCount: 1+ i,
                            blot: { ttl:3+(parseInt(3*i/this.framesCount)),decreaseSize: true, density:0.25 + (0.75*i/this.framesCount) }
                        })
                    ]
                }), this.frameSize.x*i, 0, this.frameSize.x, this.frameSize.y);

                ctx.strokeStyle = 'red'; ctx.strokeRect(this.frameSize.x*i, 0, this.frameSize.x, this.frameSize.y);
            }
        })
    }

    prepareAnimation(type){
        return createCanvas(new V2(this.frameSize.x*this.framesCount, this.frameSize.y), (ctx, size) => {
            let yP = new V2(11,8);
            let wP = new V2(12,7);
            let bP = new V2(13,6);
            let bpD = new V2(-2,3);
            switch(type){
                case 'tl':
                    yP = new V2(9,8);
                    wP = new V2(8,7)
                    bP = new V2(8,6);
                    bpD = new V2(2,3)
                    break
                case 'bl': 
                    yP = new V2(9,11);
                    wP = new V2(8,12)
                    bP = new V2(7.5,13);
                    bpD = new V2(2,-3)
                case 'br':
                    yP = new V2(11,11);  
                    wP = new V2(12,12)
                    bP = new V2(13,13);
                    bpD = new V2(-2,-3)
                case 'tr':
                default:
                    break;
            }
            for(let i = 0; i < this.framesCount; i++){
                ctx.beginPath();
                ctx.fillStyle = '#FFC90E';
                ctx.strokeStyle = '#FF7E28';
                ctx.arc(this.frameSize.x*i + this.frameSize.x/2, this.frameSize.y/2, 0.95*this.frameSize.x/2, 0, Math.PI*2, false);
                ctx.fill();ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = '#FFF200';
                ctx.arc(this.frameSize.x*i + this.frameSize.x*yP.x/20, this.frameSize.y*yP.y/20, this.frameSize.x*7/20, 0, Math.PI*2, false);
                ctx.fill();

                ctx.beginPath();
                ctx.fillStyle = '#FFFFFF';
                ctx.arc(this.frameSize.x*i + this.frameSize.x*wP.x/20, this.frameSize.y*wP.y/20, this.frameSize.x*5/20, 0, Math.PI*2, false);
                ctx.fill();

                ctx.save();

                ctx.beginPath();
                ctx.arc(this.frameSize.x*i + this.frameSize.x*(bP.x + (bpD.x*(i/this.framesCount)) )/20, this.frameSize.y*(bP.y+(bpD.y*(i/this.framesCount)))/20, this.frameSize.x*(11*(i/this.framesCount))/20, 0, Math.PI*2, false);
                ctx.clip();
                ctx.clearRect(0,0, size.x, size.y);
                ctx.restore();
            }
        })
    }

    afterMainWork(now)
    {
        if(this.rotationTimer)
            doWorkByTimer(this.rotationTimer, now);

        if(this.explosionsTimer){
            doWorkByTimer(this.explosionsTimer, now);
        }

        // if(this.ssTimer)
        //     doWorkByTimer(this.ssTimer, now);
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

// class RoundExplosion extends GO {
//     constructor(options = {}){
//         options = assignDeep({}, {
//             isCustomRender: true,
//             startColor: '#FFFFFF',
//             color: ''
//         }, options)

//         super(options);

//         this.img = createCanvas(new V2(20, 20), (ctx, size) => {
//             ctx.fillStyle = this.startColor;
//             ctx.arc(size.x/2, size.y/2, size.x/2, 0, Math.PI*2, false);
//             ctx.fill();
//         })

//         //this.addEffect(new SizeOutEffect({dimension: 'both', effectTime: 250, updateDelay: 50, min: 0.01}))
//     }
// }