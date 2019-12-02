class Demo9Exp3Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            showLoadingOverlay: true,
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    nebullaImagesGeneratorFun({size, framesCount = 20, maskCirclesCount = 20, paramsDivider = 10}) {
        var pn = new Perlin('random seed ' + getRandom(0,1000));

        let time = 0;
        let timeDirection = 1;

        let mask = createCanvas(size, (ctx, size, hlp) => {
            let sizeClamps = [size.x/10,size.x/4];
            for(let i =0; i < maskCirclesCount; i++){
                let lightEllipsis = {
                    position: new V2(getRandomInt(sizeClamps[1], size.x-sizeClamps[1]), getRandomInt(sizeClamps[1], size.y-sizeClamps[1])),
                    size: new V2(getRandomInt(sizeClamps[0], sizeClamps[1]), getRandomInt(sizeClamps[0], sizeClamps[1]))
                }
    
                lightEllipsis.rxSq = lightEllipsis.size.x*lightEllipsis.size.x;
                lightEllipsis.rySq = lightEllipsis.size.y*lightEllipsis.size.y;
                let pp = new PerfectPixel({ctx});
                let aChange = easing.createProps(100, 0.15, 0, 'cubic', 'out');
                pp.fillStyleProvider = (x,y) => {

                    let dx = fast.r(
                        (((x-lightEllipsis.position.x)*(x-lightEllipsis.position.x)/lightEllipsis.rxSq) 
                        + ((y-lightEllipsis.position.y)*(y-lightEllipsis.position.y)/lightEllipsis.rySq))*100);

                    if(dx > 100){
                        dx = 100;
                    }

                    aChange.time = dx;

                    return `rgba(255,255,255,${fast.r(easing.process(aChange),2)})`;
                }
                pp.fillByCornerPoints([new V2(0,0), new V2(size.x, 0), new V2(size.x, size.y), new V2(0, size.y)]);
            }
        })

        return new Array(framesCount).fill().map((el, i) => {
            return function () {
                let matrix = [];
            
                let noiseImg = createCanvas(size, (ctx, size, hlp) => {
                    
                    for(let y = 0; y < size.y; y++){
                        matrix[y] = [];
                        for(let x = 0; x < size.x; x++){
                            matrix[y][x] = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                            let value = matrix[y][x]*100;
                            value = fast.r(value/5)*5;
                            hlp.setFillColor(colors.hsvToHex([215,25,value])).dot(x,y)
                        }
                    }
                    time+=timeDirection;

                    if((timeDirection > 0 && time > framesCount/2) || (timeDirection < 0 && time < -framesCount/2))
                        timeDirection*=-1;
                })

                return createCanvas(size, (ctx, size, hlp) => {
                    ctx.drawImage(mask, 0,0);

                    ctx.globalCompositeOperation = 'source-in';

                    ctx.drawImage(noiseImg, 0,0);
                })
            }
        })
    }

    nebullaImagesGenerator({size, framesCount = 20, maskCirclesCount = 20, paramsDivider = 10}) {
        var pn = new Perlin('random seed ' + getRandom(0,1000));

        let time = 0;
        let timeDirection = 1;

        let mask = createCanvas(size, (ctx, size, hlp) => {
            let sizeClamps = [size.x/10,size.x/4];
            for(let i =0; i < maskCirclesCount; i++){
                let lightEllipsis = {
                    position: new V2(getRandomInt(sizeClamps[1], size.x-sizeClamps[1]), getRandomInt(sizeClamps[1], size.y-sizeClamps[1])),
                    size: new V2(getRandomInt(sizeClamps[0], sizeClamps[1]), getRandomInt(sizeClamps[0], sizeClamps[1]))
                }
    
                lightEllipsis.rxSq = lightEllipsis.size.x*lightEllipsis.size.x;
                lightEllipsis.rySq = lightEllipsis.size.y*lightEllipsis.size.y;
                let pp = new PerfectPixel({ctx});
                let aChange = easing.createProps(100, 0.15, 0, 'quad', 'out');
                pp.fillStyleProvider = (x,y) => {

                    let dx = fast.r(
                        (((x-lightEllipsis.position.x)*(x-lightEllipsis.position.x)/lightEllipsis.rxSq) 
                        + ((y-lightEllipsis.position.y)*(y-lightEllipsis.position.y)/lightEllipsis.rySq))*100);

                    if(dx > 100){
                        dx = 100;
                    }

                    aChange.time = dx;

                    return `rgba(255,255,255,${fast.r(easing.process(aChange),2)})`;
                }
                pp.fillByCornerPoints([new V2(0,0), new V2(size.x, 0), new V2(size.x, size.y), new V2(0, size.y)]);
            }
        })

        let frames = [];

        for(let i = 0; i < framesCount; i++){

            let matrix = [];
            
            let noiseImg = createCanvas(size, (ctx, size, hlp) => {
                
                for(let y = 0; y < size.y; y++){
                    matrix[y] = [];
                    for(let x = 0; x < size.x; x++){
                        matrix[y][x] = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                        let value = matrix[y][x]*100;
                        value = fast.r(value/5)*5;
                        hlp.setFillColor(colors.hsvToHex([215,25,value])).dot(x,y)
                    }
                }
                time+=timeDirection;

                if((timeDirection > 0 && time > framesCount/2) || (timeDirection < 0 && time < -framesCount/2))
                    timeDirection*=-1;
            })

            frames[frames.length] = createCanvas(size, (ctx, size, hlp) => {
                ctx.drawImage(mask, 0,0);

                ctx.globalCompositeOperation = 'source-in';

                ctx.drawImage(noiseImg, 0,0);
            })

            // this.loadingOverlay.step();
        };

        return frames;
    }

    createNebula() {
        let nSet = this.nebullaFramesSet[getRandomInt(0, this.nebullaFramesSet.length-1)];
        this.upperNebula = this.addGo(new Demo9Exp3Scene.NebullaGO({
            position: new V2(getRandomInt(this.viewport.x/5, this.viewport.x*4/5), -nSet.size.y/2).toInt(), //new V2(100,50),
            size: nSet.size, //new V2(100,200),
            frames: nSet.frames
        }), 1)
    }

    createBgFrames({framesCount = 10, maxOpacity = 0.25, yShift = 5,pointsDistributionPosition, pointsDistributionSize, imgSize, pointsPerGroup = 100, pointColor = {r:255, g:255, b:255}  }) {
        let bgImageFrames = [];
        //let framesCount = 10;
        let yDeltaChange = easing.createProps(framesCount-1, 0, yShift, 'quad', 'inOut');
        let aChangeUp = easing.createProps((framesCount/2) - 1, 0, maxOpacity, 'quad', 'inOut');
        let aChangeDown = easing.createProps((framesCount/2) - 1, maxOpacity, 0, 'quad', 'inOut');
        let yDeltas = new Array(framesCount).fill().map((p, i) => {
            yDeltaChange.time = i;
            return fast.r(easing.process(yDeltaChange));
        })

        let aValues = new Array(framesCount).fill().map((p,i) => {
            let time = i;
            let aChange = aChangeUp;
            if(time > 4){
                time-=5;
                aChange = aChangeDown;
            }

            aChange.time = time;
            return fast.r(easing.process(aChange), 2);
        })

        let moveFromEndToBegin = function(initialArr, index) {
            var firstPart = initialArr.slice(0, index);
            var lastPart = initialArr.slice(index, initialArr.length);
            return [...lastPart, ...firstPart];
        }

        let groupPointsPositions = new Array(framesCount).fill().map((p, i) => {
            let initialPositions = new Array(pointsPerGroup).fill().map(p => {
                return new V2(
                    fast.r(getRandomGaussian(pointsDistributionPosition.x, pointsDistributionPosition.x + pointsDistributionSize.x)), 
                    getRandomInt(pointsDistributionPosition.y, pointsDistributionPosition.y + pointsDistributionSize.y));
            });

            let groupPerFrame = [];
            for(let j = 0; j < framesCount; j++){
                let yDeltaV2 = new V2(0, yDeltas[j]);
                let color = `rgba(${pointColor.r},${pointColor.g},${pointColor.b}, ${aValues[j]})`;
                groupPerFrame[j] = initialPositions.map( p => ({
                    p: p.add(yDeltaV2),
                    color
                }));
            }

            groupPerFrame = moveFromEndToBegin(groupPerFrame, i);

            return groupPerFrame;
        });

        for(let i = 0; i < framesCount; i++){
            bgImageFrames.push(createCanvas(imgSize, (ctx, size, hlp) => {
                groupPointsPositions.forEach(group => {
                    let frame = group[i];
                    frame.forEach(point => {
                        hlp.setFillColor(point.color).dot(point.p.x, point.p.y);
                    })
                })
            }));
        }

        return bgImageFrames;
    }

    start(){
        this.loadingManager = this.addGo(new GO({
            position: new V2(0,0),
            size: new V2(1,1),
            init() {
                let scene = this.parentScene;
                this.bgNebullaFrames = [];
                let nSize = new V2(200, scene.viewport.y*1.5);

                this.script.items = [
                    function() {
                        this.bgImg = createCanvas(scene.viewport, (ctx, size, hlp) => {
                            hlp.setFillColor('rgba(255,255,255, 0.05)');
                            // for(let i = 0;i < 5000; i++){
                            //     hlp.dot(fast.r(getRandomGaussian(-size.x, 2*size.x)), getRandomInt(0, size.y))
                            // }
        
                            for(let i = 0;i < 5000; i++){
                                hlp.dot(fast.r(getRandomGaussian(0, size.x)), getRandomInt(0, size.y))
                            }
        
                            hlp.setFillColor('rgba(255,255,255, 0.05)');
                            for(let i = 0;i < 5000; i++){
                                hlp.dot(fast.r(getRandomGaussian(size.x/3, size.x*2/3)), getRandomInt(0, size.y))
                            }
                        })

                        scene.loadingOverlay.step();
                        this.processScript()
                    },
                    this.addProcessScriptDelay(200),
                    function() {
                        
                        this.bgImageFrames = scene.createBgFrames({
                            color: { r: 59,g: 64,b:71 },
                            imgSize: scene.viewport, 
                            yShift: 8, 
                            pointsPerGroup: 25,
                            framesCount: 20,
                            pointsDistributionSize: scene.viewport, 
                            pointsDistributionPosition: new V2()});

                        scene.loadingOverlay.step();
                        this.processScript()
                    },
                    function() {
                        
                        this.bgImageFrames2 = scene.createBgFrames({ 
                            color: { r: 59,g: 64,b:71 },
                            imgSize:scene.viewport, 
                            framesCount: 20,
                            pointsDistributionSize: new V2(scene.viewport.x/3, scene.viewport.y), 
                            pointsDistributionPosition: new V2(scene.viewport.x/3, 0),
                            maxOpacity: 0.55, pointsPerGroup: 10, yShift: 3 });

                        scene.loadingOverlay.step();
                        this.processScript()
                    },
                     this.addProcessScriptDelay(200),
                    // ...(scene.nebullaImagesGeneratorFun({size: nSize, maskCirclesCount:10, framesCount:1, paramsDivider:15}).map(f => {
                    //     return [function() {
                    //         this.bgNebullaFrames[this.bgNebullaFrames.length] = f();
                    //         scene.loadingOverlay.step();
                    //         this.processScript()
                    //     }, this.addProcessScriptDelay(200)]
                    // }).flat()),
                    function() {
                        let that = this;
                        scene.addGo(new GO({
                            position: scene.sceneCenter,
                            size: scene.viewport,
                            init() {
                                //this.img = that.bgImg;
                                this.bgImg = that.bgImg;

                                this.sparks = [
                                    this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size,
                                    init() {
                                        this.frames = that.bgImageFrames2;
                                        this.currentFrame = 0;
                                        this.img = this.frames[this.currentFrame];
         
                                    }
                                })), 
                                this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size,
                                    init() {
                                        this.frames = that.bgImageFrames;
                                        this.currentFrame = 0;
                                        this.img = this.frames[this.currentFrame];
            
                                    }
                                }))];

                                this.currentY = 0;
                                this.currentYSpeed = 0.1;
                                this.timer = this.regTimerDefault(30, () => {
                                    for(let i = 0; i < this.sparks.length; i++){
                                        let sparksItem = this.sparks[i];

                                        sparksItem.img = sparksItem.frames[sparksItem.currentFrame];
                                        sparksItem.currentFrame++;
                                        if(sparksItem.currentFrame == sparksItem.frames.length){
                                            sparksItem.currentFrame = 0;
                                        }
                                    }
                                    


                                    this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                        let y = fast.r(this.currentY);
                                        ctx.drawImage(this.bgImg, 0, y);
                                        ctx.drawImage(this.bgImg, 0,fast.r(y-size.y));
                                    })
                                
                                    this.currentY =this.currentY+this.currentYSpeed;
                                    if(this.currentY >= this.size.y){
                                        this.currentY = 0;
                                    }
                                })
                            }
                        }), 1)

                        // scene.addGo(new Demo9Exp3Scene.NebullaGO({
                        //     position: new V2(0, scene.sceneCenter.y),
                        //     size: nSize, //new V2(100,200),
                        //     frames: that.bgNebullaFrames,
                        //     static: true,
                        //     animated:false
                        // }), 1)
                
                        // scene.addGo(new Demo9Exp3Scene.NebullaGO({
                        //     position: new V2(scene.viewport.x, scene.sceneCenter.y),
                        //     size: nSize, //new V2(100,200),
                        //     frames: that.bgNebullaFrames,
                        //     static: true,
                        //     animated:false
                        // }), 1)

                        scene.addGo(new GO({
                            position: scene.sceneCenter,
                            size: scene.viewport,
                            init() {
                                this.bgParticles = [{ color: '#515860', speed: new V2(0, 1), points: [] }, { color: '#67707C', speed: new V2(0, 2), points: [] }, { color: '#929FB0', speed: new V2(0, 6), points: [] }];
                                
                                this.points = [];
                                this.pgCount = 1;
                
                                this.timer = this.regTimerDefault(30, () => {
                                    //this.points.push(...this.pointGenerator());
                                    this.pointGenerator(this.bgParticles);
                                    this.updatePoints();
                                })
                            },
                            pointGenerator(particles) {
                                let currentPartciles = particles[getRandomInt(0, particles.length-1)];
                                currentPartciles.points.push({
                                    alive: true,
                                    currentX: fast.r( getRandomGaussian(-this.size.x/2, 1.5*this.size.x)),
                                    currentY: 0,
                                })
                
                            },
                            updatePoints() {
                
                                for(let j = 0; j < this.bgParticles.length; j++){
                                    let particles = this.bgParticles[j];
                                    for(let i = 0; i < particles.points.length; i++){
                                        let point = particles.points[i];
                    
                                        point.currentY= fast.r(point.currentY+particles.speed.y);
                
                                        if(point.currentY > this.size.y)
                                            point.alive = false;
                
                                    }
                                }
                                
                
                                //this.points = this.points.filter(p => p.alive);
                                this.bgParticles.forEach(particles => {
                                    particles.points = particles.points.filter(p => p.alive);
                                })
                
                                this.createImage();
                            },
                            createImage() {
                                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                
                                    for(let j = 0; j < this.bgParticles.length; j++){
                                        let particles = this.bgParticles[j];
                                        hlp.setFillColor(particles.color)
                                        for(let i = 0; i < particles.points.length; i++){
                                            let point = particles.points[i];
                                            hlp.rect(point.currentX, point.currentY, 1, fast.c(particles.speed.y/2));
                                        }
                                    }
                                })
                            }
                        }), 1)

                        scene.playerGo = scene.addGo(new Demo9Exp3Scene.PlayerGO({
                            position: scene.sceneCenter.clone(),
                        }), 20);

                        scene.loadingOverlay.remove();
                    } 
                ]

                scene.loadingOverlay.setParams({total:this.script.items.length/2 })

                this.processScript();
            }
        }), 1)

        return;
        
    }

}

Demo9Exp3Scene.PlayerGO = class extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(20,30)
        }, options)

        super(options);
    }

    init() {
        this.staticImg = PP.createImage(Demo9Exp3Scene.models.mainCraft)
        let thrusterImageSize = new V2(5,20);
        this.thrusterFlameImg = PP.createImage(Demo9Exp3Scene.models.thrusterFlame)
        this.thrusterFlameFrames = PP.createImage(Demo9Exp3Scene.models.thrusterFlameFrames)
        this.thrusterFlameImgFlip = createCanvas(thrusterImageSize, (ctx, size, hlp) => {
            ctx.translate(size.x, 0);
            ctx.scale(-1,1);
            ctx.drawImage(this.thrusterFlameImg, 0,0);
        })

        this.thrusterFlameFramesFlip = this.thrusterFlameFrames.map((frame) => (
            createCanvas(thrusterImageSize, (ctx, size, hlp) => {
                ctx.translate(size.x, 0);
                ctx.scale(-1,1);
                ctx.drawImage(frame, 0,0);
            })
        ))

        this.img = this.staticImg;

        let that = this;
        this.thrusterFlames = [
            this.addChild(new GO({
                position: new V2(-2,23),
                size: new V2(5,20),
                init() {
                    this.currentFrame = 0;
                    this.frames = that.thrusterFlameFrames;
                    this.img = that.thrusterFlameImg;
                }
            })),
            this.addChild(new GO({
                position: new V2(2,23),
                size: new V2(5,20),
                init() {
                    this.currentFrame = 0;
                    this.frames = that.thrusterFlameFramesFlip;
                    this.img = that.thrusterFlameImgFlip;
                }
            }))
        ];

        this.timer = this.regTimerDefault(100, () => {
            for(let i = 0; i < this.thrusterFlames.length; i++){
                let flameItem = this.thrusterFlames[i];

                flameItem.img = flameItem.frames[flameItem.currentFrame];
                flameItem.currentFrame++;
                if(flameItem.currentFrame == flameItem.frames.length){
                    flameItem.currentFrame = 0;
                }
            }
        });
    }
}

Demo9Exp3Scene.NebullaGO = class extends GO{
    constructor(options = {}) {
        options = assignDeep({}, {
            // position: new V2(100,50),
            // size: new V2(100,200),
            frames: [],
            calmDown: 5,
            renderValuesRound: true,
            static: false,
            animated: true
        }, options)

        super(options);
    }
    
    init() {
        this.currentFrame = 0;
        this.frameChangeDirection = 1;
        if(!this.static){
            this.moveTimer = this.regTimerDefault(30, () => {
                this.position.y+=0.25;
    
                if(this.position.y > (this.parentScene.viewport.y + this.size.y/2)){
                    this.setDead();
                }
    
                this.needRecalcRenderProperties  = true;
    
            });
        }
        
        if(this.animated){
            this.timer = this.regTimerDefault(30, () => {
                this.img = this.frames[this.currentFrame];
    
                this.currentFrame+=this.frameChangeDirection;
                if((this.frameChangeDirection > 0 && this.currentFrame >= (this.frames.length-1)) || (this.frameChangeDirection < 0 && this.currentFrame == 0)){
                    this.frameChangeDirection*=-1;
                }
            } )
        }
        else {
            this.img = this.frames[0];
        }

        
    }
}



// This is fugly as hell. I simply cut, pasted, and wrapped it with 
// a simple interface. Sorry! -wwwtyro
// https://github.com/wwwtyro/perlin.js

function Perlin(seed) {
    
    // Alea random number generator.
    //----------------------------------------------------------------------------//
    
        // From http://baagoe.com/en/RandomMusings/javascript/
        function Alea() {
          return (function(args) {
            // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
            var s0 = 0;
            var s1 = 0;
            var s2 = 0;
            var c = 1;
    
            if (args.length == 0) {
              args = [+new Date];
            }
            var mash = Mash();
            s0 = mash(' ');
            s1 = mash(' ');
            s2 = mash(' ');
    
            for (var i = 0; i < args.length; i++) {
              s0 -= mash(args[i]);
              if (s0 < 0) {
                s0 += 1;
              }
              s1 -= mash(args[i]);
              if (s1 < 0) {
                s1 += 1;
              }
              s2 -= mash(args[i]);
              if (s2 < 0) {
                s2 += 1;
              }
            }
            mash = null;
    
            var random = function() {
              var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
              s0 = s1;
              s1 = s2;
              return s2 = t - (c = t | 0);
            };
            random.uint32 = function() {
              return random() * 0x100000000; // 2^32
            };
            random.fract53 = function() {
              return random() + 
                (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
            };
            random.version = 'Alea 0.9';
            random.args = args;
            return random;
    
          } (Array.prototype.slice.call(arguments)));
        };
    
        // From http://baagoe.com/en/RandomMusings/javascript/
        // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
        function Mash() {
          var n = 0xefc8249d;
    
          var mash = function(data) {
            data = data.toString();
            for (var i = 0; i < data.length; i++) {
              n += data.charCodeAt(i);
              var h = 0.02519603282416938 * n;
              n = h >>> 0;
              h -= n;
              h *= n;
              n = h >>> 0;
              h -= n;
              n += h * 0x100000000; // 2^32
            }
            return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
          };
    
          mash.version = 'Mash 0.9';
          return mash;
        }
    
    // Classic Perlin noise, 3D version 
    //----------------------------------------------------------------------------//
    
        var ClassicalNoise = function(r) { // Classic Perlin noise in 3D, for comparison 
            if (r == undefined) r = Math;
          this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0], 
                                         [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1], 
                                         [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]; 
          this.p = [];
          for (var i=0; i<256; i++) {
              this.p[i] = Math.floor(r.random()*256);
          }
          // To remove the need for index wrapping, double the permutation table length 
          this.perm = []; 
          for(var i=0; i<512; i++) {
                this.perm[i]=this.p[i & 255];
          }
        };
    
        ClassicalNoise.prototype.dot = function(g, x, y, z) { 
            return g[0]*x + g[1]*y + g[2]*z; 
        };
    
        ClassicalNoise.prototype.mix = function(a, b, t) { 
            return (1.0-t)*a + t*b; 
        };
    
        ClassicalNoise.prototype.fade = function(t) { 
            return t*t*t*(t*(t*6.0-15.0)+10.0); 
        };
    
        ClassicalNoise.prototype.noise = function(x, y, z) { 
          // Find unit grid cell containing point 
          var X = Math.floor(x); 
          var Y = Math.floor(y); 
          var Z = Math.floor(z); 
          
          // Get relative xyz coordinates of point within that cell 
          x = x - X; 
          y = y - Y; 
          z = z - Z; 
          
          // Wrap the integer cells at 255 (smaller integer period can be introduced here) 
          X = X & 255; 
          Y = Y & 255; 
          Z = Z & 255;
          
          // Calculate a set of eight hashed gradient indices 
          var gi000 = this.perm[X+this.perm[Y+this.perm[Z]]] % 12; 
          var gi001 = this.perm[X+this.perm[Y+this.perm[Z+1]]] % 12; 
          var gi010 = this.perm[X+this.perm[Y+1+this.perm[Z]]] % 12; 
          var gi011 = this.perm[X+this.perm[Y+1+this.perm[Z+1]]] % 12; 
          var gi100 = this.perm[X+1+this.perm[Y+this.perm[Z]]] % 12; 
          var gi101 = this.perm[X+1+this.perm[Y+this.perm[Z+1]]] % 12; 
          var gi110 = this.perm[X+1+this.perm[Y+1+this.perm[Z]]] % 12; 
          var gi111 = this.perm[X+1+this.perm[Y+1+this.perm[Z+1]]] % 12; 
          
          // The gradients of each corner are now: 
          // g000 = grad3[gi000]; 
          // g001 = grad3[gi001]; 
          // g010 = grad3[gi010]; 
          // g011 = grad3[gi011]; 
          // g100 = grad3[gi100]; 
          // g101 = grad3[gi101]; 
          // g110 = grad3[gi110]; 
          // g111 = grad3[gi111]; 
          // Calculate noise contributions from each of the eight corners 
          var n000= this.dot(this.grad3[gi000], x, y, z); 
          var n100= this.dot(this.grad3[gi100], x-1, y, z); 
          var n010= this.dot(this.grad3[gi010], x, y-1, z); 
          var n110= this.dot(this.grad3[gi110], x-1, y-1, z); 
          var n001= this.dot(this.grad3[gi001], x, y, z-1); 
          var n101= this.dot(this.grad3[gi101], x-1, y, z-1); 
          var n011= this.dot(this.grad3[gi011], x, y-1, z-1); 
          var n111= this.dot(this.grad3[gi111], x-1, y-1, z-1); 
          // Compute the fade curve value for each of x, y, z 
          var u = this.fade(x); 
          var v = this.fade(y); 
          var w = this.fade(z); 
           // Interpolate along x the contributions from each of the corners 
          var nx00 = this.mix(n000, n100, u); 
          var nx01 = this.mix(n001, n101, u); 
          var nx10 = this.mix(n010, n110, u); 
          var nx11 = this.mix(n011, n111, u); 
          // Interpolate the four results along y 
          var nxy0 = this.mix(nx00, nx10, v); 
          var nxy1 = this.mix(nx01, nx11, v); 
          // Interpolate the two last results along z 
          var nxyz = this.mix(nxy0, nxy1, w); 
    
          return nxyz; 
        };
    
    
    //----------------------------------------------------------------------------//
    
    
        var rand = {};
        rand.random = new Alea(seed);
        var noise = new ClassicalNoise(rand);
        
        this.noise = function (x, y, z) {
            return 0.5 * noise.noise(x, y, z) + 0.5;
        }
        
    }