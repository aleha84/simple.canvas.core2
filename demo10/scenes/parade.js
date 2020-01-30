class Demo10ParadeScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault('#445461');
    }

    start(){
        this.bg = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y),
            size: this.viewport.clone(),
            init() {
                
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let drawWindow = ({p, s, cOuter, cInner, cUpperShadow}) => {
                        hlp.setFillColor(cOuter).rect(p.x,p.y,s.x,s.y)
                        .setFillColor(cInner).rect(p.x+1,p.y+1,s.x-2,s.y-2)
                        .setFillColor(cUpperShadow).rect(p.x+1,p.y+1,s.x-2,1)
                    }


                    hlp.setFillColor('#435561').rect(0,0,size.x, size.y); //общий фон
                    hlp.setFillColor('#3E4E59').rect(37,0, 125, 120); // средняя глубина
                    hlp.setFillColor('#37454F').rect(61, 0, 77, 120) // центральная секция
                    hlp.setFillColor('#2A3843').rect(37, 0, 1, 120).rect(61, 0, 1, 120).rect(138, 0, 1, 120).rect(162, 0, 1, 120) // темные вертикали
                    hlp.setFillColor('#34434e').rect(38, 0, 1, 120).rect(161, 0, 1, 120).rect(38,119,23,1).rect(139, 119, 22, 1) // полутона в средней части
                    hlp.setFillColor('#313f49').rect(62, 0, 1, 120).rect(137, 0, 1, 120) // полутона в центральной части
                    //
                    hlp.setFillColor('#4C606D').rect(61,98, 78, 77).setFillColor('#42535e').rect(61,97,78,1)

                    for(let i = 0; i < 10000; i++){
                        let c = getRandomBool() ? 0 : 255
                        hlp.setFillColor(`rgba(${c}, ${c}, ${c}, ${0.025})`).rect(getRandomInt(0, size.x), getRandomInt(0, size.y), getRandomInt(1,2), getRandomInt(1,2))
                    }

                    //дополнительные линии
                    for(let i = 0; i < 2; i++){
                        let x = i == 0 ? 0 : 173

                        hlp.setFillColor('#394A54').rect(x-4,0,1, 120).rect(x+2,0,1, 120).rect(x+10,0,1, 120).rect(x+16,0,1, 120).rect(x+24,0,1, 120).rect(x+30,0,1, 120)
                    .rect(x-3,10, 6, 1).rect(x+11,10, 6, 1).rect(x+24,10, 7, 1)
                    .rect(x+3,20, 8, 1).rect(x+17,20, 8, 1).rect(x+31,20, 6, 1)
                    .rect(x-3,10+37, 6, 1).rect(x+11,10+37, 6, 1).rect(x+24,10+37, 7, 1)
                    .rect(x+3,20+37, 8, 1).rect(x+17,20+37, 8, 1).rect(x+31,20+37, 6, 1)
                    .rect(x-3,10+74, 6, 1).rect(x+11,10+74, 6, 1).rect(x+24,10+74, 7, 1)
                    .rect(x+3,20+74, 8, 1).rect(x+17,20+74, 8, 1).rect(x+31,20+74, 6, 1)
                    }

                    //дополнительные линии в средней глубине
                    for(let i = 0; i < 2; i++){
                        let x = i == 0 ? 0 : 100
                        hlp.setFillColor('#35434C')
                        .rect(x+39,10,22,1).rect(x+39,21,22,1).rect(x+39,47,22,1).rect(x+39,58,22,1).rect(x+39,84,22,1).rect(x+39,94,22,1)
                        .rect(x+47,10, 1,11).rect(x+47,47, 1,11).rect(x+47,84, 1,11)
                    }

                    //дополнительные линии в центральной секции
                    hlp.setFillColor('#303C44').rect(63,12,74, 1).rect(63,48,74, 1).rect(63,84,74, 1)
                    .rect(70,0, 1, 97).rect(128,0, 1, 97)
                    for(let i = 0; i < 4; i++){
                        hlp.rect(12*i + 78,0, 1, 97).rect(12*i + 84, 0, 1, 97)
                    }

                    hlp.setFillColor('#394A54')
                    .rect(0,119, 37, 1).rect(163,119, 37, 1).rect(0,127, 61, 1).rect(139,127, 61, 1)

                    let outerWindowsP = [
                        new V2(10,-10), new V2(24,-10),new V2(-4,-10), new V2(169,-10), new V2(183,-10), new V2(197,-10),
                        new V2(10,26), new V2(24,26),new V2(-4,26), new V2(169,26), new V2(183,26), new V2(197,26),
                        new V2(10,62), new V2(24,62),new V2(-4,62), new V2(169,62), new V2(183,62), new V2(197,62),
                    ];
                    outerWindowsP.forEach(
                         (p) => drawWindow({p, s: new V2(7, 15), cOuter: '#2E4453', cInner: '#1F3A4D', cUpperShadow: '#1D313E'}))
                    
                    let midWindowsP = [
                        new V2(40,-8), new V2(49,-8), new V2(145,-8), new V2(154,-8),
                        new V2(40,28), new V2(49,28), new V2(145,28), new V2(154,28),
                        new V2(40,64), new V2(49,64), new V2(145,64), new V2(154,64)
                    ]

                    midWindowsP.forEach(
                        (p) => drawWindow({p, s: new V2(6, 13), cOuter: '#2E4453', cInner: '#1F3A4D', cUpperShadow: '#1D313E'}))

                    let innerWindowsP = [
                        new V2(64,-9), new V2(78,-9), new V2(90,-9), new V2(90+12,-9), new V2(90+24,-9), new V2(128,-9),
                        new V2(64,27), new V2(78,27), new V2(90,27), new V2(90+12,27), new V2(90+24,27), new V2(128,27),
                        new V2(64,63), new V2(78,63), new V2(90,63), new V2(90+12,63), new V2(90+24,63), new V2(128,63)
                    ]

                    innerWindowsP.forEach(
                        (p) => drawWindow({p, s: new V2(7, 17), cOuter: '#2A4050', cInner: '#1F3A4D', cUpperShadow: '#1D313E'}))

                    innerWindowsP.forEach(
                        (p) => drawWindow({p, s: new V2(7, 17), cOuter: '#2A4050', cInner: '#1F3A4D', cUpperShadow: '#1D313E'}))

                    let lowerWindowsP = [
                        new V2(10,98), new V2(24,98),new V2(-4,98), new V2(169,98), new V2(183,98), new V2(197,98),
                    ]

                    lowerWindowsP.forEach(
                        (p) => drawWindow({p, s: new V2(7, 17), cOuter: '#233846', cInner: '#1C343E', cUpperShadow: '#1D313E'}))

                    let lowerMidWindowsP = [   
                        new V2(40,100), new V2(49,100), new V2(145,100), new V2(154,100)
                    ]

                    lowerMidWindowsP.forEach(
                        (p) => drawWindow({p, s: new V2(6, 13), cOuter: '#233846', cInner: '#1C343E', cUpperShadow: '#1D313E'}))


                    let blackWindowsP = [
                        new V2(13,133), new V2(39,133), new V2(144,133), new V2(170,133)
                    ]

                    
                    //детали на выступе
                    hlp.setFillColor('#455863').rect(61,119, 78, 1).rect(61,127, 78, 1).rect(61,127, 78, 1).rect(128,128,1,50).rect(71,128,1,50)
                    hlp.setFillColor('#2c3f4f').rect(81,128,37,63).setFillColor('#12263A')
                    
                    hlp.setFillColor('#394c59').rect(82,136,35,1).rect(82,145,35,1).rect(82,154,35,1).rect(82,163,35,1).rect(82,172,35,1)
                    .rect(91,129,1,61).rect(107,129,1,61)

                    hlp.setFillColor('#313E47').rect(59,120, 2, 100).rect(139,120, 2, 100)
                    hlp.setFillColor('#3a4a54').rect(56,120, 3, 100).rect(141,120, 3, 100)

                    blackWindowsP.forEach(
                        (p) => drawWindow({p, s: new V2(15, 28), cOuter: '#12263A', cInner: '#010510', cUpperShadow: '#010510'}))

                    hlp.setFillColor('#142435').rect(40,141,13,1).rect(46,134,1,7).rect(14,141,13,1).rect(20,134,1,7)
                    .rect(145,141,13,1).rect(151,134,1,7).rect(177,134,1,7)


                    hlp.setFillColor('#132E48').rect(0,175,size.x, 75)
                })
            }
        }), 1)

        this.mid = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10ParadeScene.models.mid)
                }))
                this.r = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('rgba(0,0,0,0.05)')
                        for(let i = 0; i < 1000; i++){
                            hlp.rect(getRandomInt(0, size.x), getRandomInt(176, size.y), getRandomInt(1,5), 1)
                        }
                    })
                }))
            }
        }), 2)

        this.man = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10ParadeScene.models.man)
                }))
            }
        }), 5)

        this.rainFramesGenerator = ({framesCount, xClamps, color1, color2, dropsCount, lCamps, targetParams,targetParams2,
             eType = 'linear', eMethod = 'base', startY, lenIncrease = false, splashFramesCount = 10, invertedGaus = false, sideSplash = false}) => {
            let size = xClamps[1] - xClamps[0];
            let direction = V2.down;
            let count = dropsCount;
            let positions = [];
            let result = [];

            let lengths = [];
            let lChange = undefined;
            if(lenIncrease){
                lChange = easing.createProps(framesCount-1, 1, lCamps[1], eType, eMethod);
                for(let frameIndex = 0; frameIndex < framesCount; frameIndex++){
                    lChange.time = frameIndex;
                    lengths[frameIndex] = fast.r(easing.process(lChange));
                }
            }

            for(let i = 0; i < count; i++){
                let x= getRandomInt(xClamps[0], xClamps[1]);
                if(invertedGaus) {
                    x = getRandomGaussian(xClamps[0], xClamps[1]);
                    x -= xClamps[0];
                    if(x < size/2){
                        x = fast.r(-1*(x-(size/2)))
                    }
                    else {
                        x = fast.r(-1*(x-size)+ size/2)
                    }

                    x+=xClamps[0];
                }
                let start = new V2(x, startY);
                let target = new V2(x, this.viewport.y/2);

                if(targetParams){
                    let lowerY = targetParams.lowerY;
                    let upperY = undefined;
                    let line = {begin:start , end: new V2(x, lowerY)};
                    for(let pi = 0; pi < targetParams.upperPoints.length-2; pi++){
                        let l2 = {begin:targetParams.upperPoints[pi] , end: targetParams.upperPoints[pi+1]};
                        let intersection = segmentsIntersectionVector2_1_noV2(line, l2);
                        if(intersection){
                            upperY = fast.r(intersection.y);
                            break;
                        }
                    }

                    target.y = getRandomInt(upperY, lowerY);
                }

                if(targetParams2) {
                    target.y = targetParams2.points.filter(p => p.x == x)[0].y;
                }

                let distance = start.distance(target);

                let dChange = easing.createProps(framesCount-1, 0, distance, eType, eMethod);
                positions[i] = {
                    points: [],
                    startIndex: getRandomInt(0, (framesCount+splashFramesCount)-1),
                    length: getRandomInt(lCamps[0], lCamps[1])
                }

                let points = positions[i].points;
                
                for(let frameIndex = 0; frameIndex < framesCount; frameIndex++){
                    dChange.time = frameIndex;
                    let d = easing.process(dChange);
                    points[frameIndex] = start.add(direction.mul(d)).toInt();
                }

                
                let pastP = points[framesCount-1];
                let dir1 = V2.up.rotate(getRandomInt(-30,30));
                let dir2 = V2.up.rotate(getRandomInt(-30,30));
                let aChange = easing.createProps(splashFramesCount, 1, 0.5, 'quad', 'out');

                let dirs = []
                if(sideSplash ){
                    if(x <= xClamps[0] + size*0.2)
                        dirs[dirs.length] = V2.left.rotate(getRandomInt(-45,-15)).mul(getRandom(1,2));       
                    else if (x >= xClamps[1] - size*0.2)
                        dirs[dirs.length] = V2.right.rotate(getRandomInt(45,15)).mul(getRandom(1,2));       
                }

                for(let frameIndex = framesCount; frameIndex < framesCount+splashFramesCount; frameIndex++){
                    aChange.time = frameIndex-framesCount;
                    dir1.y+=0.05;
                    dir2.y+=0.05;
                    dirs.forEach(d => d.y+=0.05)

                    points[frameIndex] = {
                        p1: pastP.add(dir1.mul(frameIndex-framesCount)).toInt(),
                        p2: pastP.add(dir2.mul(frameIndex-framesCount)).toInt(),
                        pn: dirs.map(d => pastP.add(d.mul(frameIndex-framesCount)).toInt()),
                        a: fast.r(easing.process(aChange),2)
                    }
                }
            }

            for(let f = 0; f < framesCount+splashFramesCount; f++){
                result[f] = createCanvas(this.viewport, (ctx, size, hlp) => {
                    
                    //hlp.setFillColor('red').strokeEllipsis(0, 180, 1, new V2(98,230), 25, 7)

                    for(let dropIndex = 0; dropIndex < positions.length; dropIndex++){
                        let drop = positions[dropIndex];
                        let currentPIndex = drop.startIndex + f;
                        if(currentPIndex > (drop.points.length - 1)){
                            currentPIndex -= drop.points.length;
                        }

                        let p = drop.points[currentPIndex];

                        if(!(p instanceof V2)){
                            ctx.globalAlpha = p.a;
                            hlp.setFillColor(color1).dot(p.p1.x, p.p1.y).dot(p.p2.x, p.p2.y);

                            p.pn.forEach(p => hlp.dot(p.x, p.y));

                            ctx.globalAlpha = 1;
                        }
                        else {
                            let l = drop.length;
                            if(lenIncrease){
                                l = lengths[currentPIndex];
                            }
    
                            hlp.setFillColor(color1).rect(p.x, p.y-l, 1, l);
                            hlp.setFillColor(color2).rect(p.x, p.y-(l/2), 1, (l/2));   
                        }
                    }
                })
            }

            return result;
        }

        let that = this;

        this.rainUpper = this.addGo(new GO({
            position: new V2(this.sceneCenter.x+2, this.sceneCenter.y),
            size:  this.viewport.clone(),
            init() {
                let targetParams = { lowerY: 121, upperPoints: [
                    new V2(76,121),new V2(84,115),new V2(92,109),new V2(100,108),new V2(107,109),new V2(114,111),new V2(119,116),new V2(124,120)
                ] }

                let targetParams2 = {
                    points:  []
                };

                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.setFillColor('red').strokeEllipsis(0, 180, 1, new V2(98,230), 25, 7, targetParams2.points)
                })

                targetParams2.points = distinct(targetParams2.points, (p) => p.x+'_'+p.y)

                let colors = [
                    {c1:'#647277',  c2:'#6D7B7F', count: 25, invertedGaus: true},
                    {c1:'#768281',  c2:'#7F8C8B', count: 25, invertedGaus: true},
                    {c1: '#566264', c2: '#637072', count: 5, invertedGaus: false},
                    {c1: '#B8B8B0', c2: '#C4C4BC', count: 5, invertedGaus: false},
                    {c1: '#979d99', c2: '#A3A8A4', count: 5, invertedGaus: false},
                    {c1: '#878d8a', c2: '#929995', count: 10, invertedGaus: true, upperUseIG: true},
                    
                ]

                this.drops = colors.map((params) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: that.rainFramesGenerator({ framesCount: 40, xClamps: [76,122], color1: params.c1, 
                    color2: params.c2, dropsCount: 40, lCamps: [3,5], targetParams, startY: -20, sideSplash: true, invertedGaus: params.upperUseIG }),
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
        
                        this.counter = 10;
                        this.timer = this.regTimerDefault(15, () => {
            
                            
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                                this.counter--;
                                if(this.counter == 0){
                                    this.counter = 10;
                                    // if(!this.redFrame){
                                    //     this.redFrame = this.addChild(new GO({
                                    //         position: new V2(),
                                    //         size: this.size, 
                                    //         img: createCanvas(this.size, (ctx, size, hlp) => {
                                    //             hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
                                    //         })
                                    //     }))
                                    // }
                                    // else {
                                    //     this.redFrame.setDead();
                                    //     this.redFrame = undefined;
                                    // }
                                }
                                
                            }
                        })
                    }
                })))

                this.dropsLower = colors.filter( c => !c.upperUseIG).map((params) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: that.rainFramesGenerator({ framesCount: 40, xClamps: [74,123], color1: params.c1, 
                    color2: params.c2, dropsCount: params.count, lCamps: [3,4], targetParams2, eType: 'quad', eMethod: 'in', startY: 122, 
                        lenIncrease: true,invertedGaus: params.invertedGaus }),
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
        
                        this.timer = this.regTimerDefault(15, () => {
            
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })))
            }
        }), 8)

        this.beforeMan = this.addGo(new GO({
            position: new V2(this.sceneCenter.x+2, this.sceneCenter.y),
            size:  this.viewport.clone(),
            init() {
                let targetParams = { lowerY: 121, upperPoints: [
                    new V2(76,121),new V2(84,115),new V2(92,109),new V2(100,108),new V2(107,109),new V2(114,111),new V2(119,116),new V2(124,120)
                ] }

                let targetParams2 = {
                    points:  []
                };

                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.setFillColor('red').strokeEllipsis(180, 360, 1, new V2(98,230), 25, 7, targetParams2.points)
                })

                targetParams2.points = distinct(targetParams2.points, (p) => p.x+'_'+p.y)

                let colors = [
                    {c1:'#647277',  c2:'#6D7B7F', count: 25, invertedGaus: true},
                    {c1:'#768281',  c2:'#7F8C8B', count: 25, invertedGaus: true},
                    {c1: '#566264', c2: '#637072', count: 10, invertedGaus: false},
                    {c1: '#B8B8B0', c2: '#C4C4BC', count: 10, invertedGaus: false},
                    {c1: '#979d99', c2: '#A3A8A4', count: 15, invertedGaus: false}
                    
                ]

                this.dropsLower = colors.map((params) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: that.rainFramesGenerator({ framesCount: 40, xClamps: [76,121], color1: params.c1, 
                    color2: params.c2, dropsCount: params.count, lCamps: [3,4], targetParams2, eType: 'quad', eMethod: 'in', startY: 122, 
                    lenIncrease: true,invertedGaus: params.invertedGaus }),
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
        
                        this.timer = this.regTimerDefault(15, () => {
            
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })))
            }
        }), 4)
    }
}