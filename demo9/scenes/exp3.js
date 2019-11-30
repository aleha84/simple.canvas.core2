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

    start(){
        this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
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
            }
        }), 1)

        this.nebullaFramesSet = [];
        
        // for(let i = 0; i < 5; i++){
        //     let nSize = new V2(getRandomInt(this.viewport.x/5, this.viewport.x*3/5), getRandomInt(this.viewport.y/5, this.viewport.y*3/5)).toInt();

        //     this.nebullaFramesSet [i] = {
        //         size: nSize,
        //         frames:this.nebullaImagesGenerator(nSize),
        //     }
        // }

        // let nSize = new V2(200, this.viewport.y*1.5);
        // let nebula = this.nebullaImagesGenerator({size: nSize, maskCirclesCount:20, paramsDivider:15});
        // this.addGo(new Demo9Exp3Scene.NebullaGO({
        //     position: new V2(0, this.sceneCenter.y),
        //     size: nSize, //new V2(100,200),
        //     frames: nebula,
        //     static: true
        // }), 1)

        // this.addGo(new Demo9Exp3Scene.NebullaGO({
        //     position: new V2(this.viewport.x, this.sceneCenter.y),
        //     size: nSize, //new V2(100,200),
        //     frames: nebula,
        //     static: true
        // }), 1)

        this.playerGo = this.addGo(new Demo9Exp3Scene.PlayerGO({
            position: this.sceneCenter.clone(),
        }), 20);


        // this.timer = this.regTimerDefault(100, () => {
        //     if(this.upperNebula.position.y > this.viewport.y/3){
        //         this.createNebula();
        //     }
        // })

        // this.createNebula();
        
        

        this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.bgParticles = [{ color: '#3B4047', speed: new V2(0, 1), points: [] }, { color: '#67707C', speed: new V2(0, 2), points: [] }, { color: '#929FB0', speed: new V2(0, 6), points: [] }];
                
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
        this.img = this.staticImg;
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
        

        this.timer = this.regTimerDefault(200, () => {
            this.img = this.frames[this.currentFrame];

            this.currentFrame+=this.frameChangeDirection;
            if((this.frameChangeDirection > 0 && this.currentFrame >= (this.frames.length-1)) || (this.frameChangeDirection < 0 && this.currentFrame == 0)){
                this.frameChangeDirection*=-1;
            }
        } )

        
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