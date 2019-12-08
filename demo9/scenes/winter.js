class Demo9WinterScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        // l. hsv: 187,22,56; rgb: 113,141,145
        
        //lm.                 rgb: 96, 123, 129 
        //mid.                rgb: 80, 105, 114 //hex. 576C70
        //dm.                 rgb: 64, 87, 99
        
        // d. hsv: 203,2,32;  rgb:  48, 70, 84

//#2
        // l. rgb. 98,123,127
        // lm.rgb. 85,109,116//hex. 556D74
        // m. rgb. 73,96,105 //hex. 496069
        // ld.rgb. 60,83,94
        // d. rgb. 48,70,84
        


//#3 светлый rgb 58,86,98

// средный   rgb 53,78,91

//   тёмный  rgb 48,70,84   

        this.backgroundRenderDefault('#091929');
    }

    createBgFrames({
        framesCount = 10, 
        maxOpacity = 0.25, 
        //yShift = 5,
        pointsDistributionPosition, 
        pointsDistributionSize, 
        imgSize, 
        pointsPerGroup = 100, 
        target,
        pChangeType = 'linear',
        pChangeMethod = 'base',
        aChangeType = 'quad',
        aChangeMethotUp = 'inOut',
        aChangeMethotDown = 'inOut',
        targetAngleRandClamps = [-15,15],
        pointColor = {r:255, g:255, b:255}  
    }) {

        if(targetAngleRandClamps == undefined)
            targetAngleRandClamps = [0,0];

        let bgImageFrames = [];
        
        //let pathPoints = [];
        let allPathPoints = [];
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            let from = new V2();
            let dist = from.distance(target);
            let originDireciton = from.direction(target);
            let pp  = new PerfectPixel({ctx});
            for(let angle = targetAngleRandClamps[0]; angle <= targetAngleRandClamps[1]; angle++){
                let rotatedTarget = originDireciton.rotate(angle).mul(dist);

                allPathPoints[allPathPoints.length] = pp.lineV2(from, rotatedTarget);
            }

            
            //pathPoints = pp.lineV2(new V2(), target);
        })

        let distance = new V2(target);

        //let positionChangePathIndex = easing.createProps(framesCount-1, 0, pathPoints.length-1, 'linear', 'base');
        let allPositionChangePathIndex = allPathPoints.map(pathPoints => (easing.createProps(framesCount-1, 0, pathPoints.length-1, pChangeType, pChangeMethod)));

        // let xDeltaChange = easing.createProps(framesCount-1, 0, distance.x, pChangeType, pChangeMethod);
        // let yDeltaChange = easing.createProps(framesCount-1, 0, distance.y, pChangeType, pChangeMethod);
        let aChangeUp = easing.createProps((framesCount/2) - 1, 0, maxOpacity, aChangeType, aChangeMethotUp);
        let aChangeDown = easing.createProps((framesCount/2) - 1, maxOpacity, 0, aChangeType, aChangeMethotDown);
        // let yDeltas = new Array(framesCount).fill().map((p, i) => {
        //     yDeltaChange.time = i;
        //     return fast.r(easing.process(yDeltaChange),2);
        // })

        // let xDeltas = new Array(framesCount).fill().map((p, i) => {
        //     xDeltaChange.time = i;
        //     return fast.r(easing.process(xDeltaChange),2);
        // })

        // let positionChangesIndexes = new Array(framesCount).fill().map((p, i) => {
        //     positionChangePathIndex.time = i;
        //     return fast.r(easing.process(positionChangePathIndex));
        // })

        let allPositionChangesIndexes = allPathPoints.map((el, j) => (
            new Array(framesCount).fill().map((p, i) => {
                allPositionChangePathIndex[j].time = i;
                return fast.r(easing.process(allPositionChangePathIndex[j]));
            })
        ));
        

        let aValues = new Array(framesCount).fill().map((p,i) => {
            let time = i;
            let aChange = aChangeUp;
            if(time > (framesCount/2)-1){
                time-=framesCount/2;
                aChange = aChangeDown;
            }

            aChange.time = time;
            return fast.r(easing.process(aChange), 3);
        })

        let moveFromEndToBegin = function(initialArr, index) {
            var firstPart = initialArr.slice(0, index);
            var lastPart = initialArr.slice(index, initialArr.length);
            return [...lastPart, ...firstPart];
        }

        let groupPointsPositions = new Array(framesCount).fill().map((p, i) => {
            let initialPositions = new Array(pointsPerGroup).fill().map(p => {
                return new V2(
                    fast.r(getRandomInt(pointsDistributionPosition.x, pointsDistributionPosition.x + pointsDistributionSize.x)), 
                    getRandomInt(pointsDistributionPosition.y, pointsDistributionPosition.y + pointsDistributionSize.y));
            });

            let initialPositionsAndPathPointIndex = initialPositions.map(ip => ({
                position: ip,
                pathPointIndex: getRandomInt(0,allPathPoints.length-1)
            }))

            let groupPerFrame = [];
            for(let j = 0; j < framesCount; j++){
                //let deltaV2 = new V2(xDeltas[j], yDeltas[j]);
                let color = `rgba(${pointColor.r},${pointColor.g},${pointColor.b}, ${aValues[j]})`;
                // groupPerFrame[j] = initialPositions.map( p => ({
                //     p: p.add(pathPoints[positionChangesIndexes[j]]),//p.add(deltaV2).toInt(),
                //     color
                // }));

                groupPerFrame[j] = initialPositionsAndPathPointIndex.map( p => ({
                    p: p.position.add(allPathPoints[p.pathPointIndex][allPositionChangesIndexes[p.pathPointIndex][j]]),
                    //p.position.add(allPathPoints[p.pathPointIndex][allPositionChangesIndexes[j]]),//p.add(deltaV2).toInt(),
                    color,
                }));
            }

            groupPerFrame = moveFromEndToBegin(groupPerFrame, i);

            return groupPerFrame;
        });

        for(let i = 0; i < framesCount; i++){
            bgImageFrames.push(createCanvas(imgSize, (ctx, size, hlp) => {
                //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
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

        this.road = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.img = PP.createImage(Demo9WinterScene.models.main)
            }
        }), 1)


        this.fg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.snowLayers = [
                //     this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let scene = this.parent.parentScene;
                //         this.frames = scene.createBgFrames({
                //             color: { r: 188,g: 204,b:206 },
                //             imgSize: scene.viewport, 
                //             pointsPerGroup: 10,
                //             framesCount: 20,
                //             pointsDistributionSize: scene.viewport.add(new V2(10,-10)), 
                //             pointsDistributionPosition: new V2(0,-10),
                //             target: new V2(-38,38),
                //             pChangeType: 'linear',
                //             pChangeMethod: 'base',
                //             aChangeType: 'quad',
                //             aChangeMethotUp: 'inOut',
                //             aChangeMethotDown: 'inOut',
                //         });
        
                //         this.currentFrame = 0;
                //         this.img = this.frames[this.currentFrame];
                //     }
                // })),
                // this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let scene = this.parent.parentScene;
                //         this.frames = scene.createBgFrames({
                //             color: { r: 188,g: 204,b:206 },
                //             imgSize: scene.viewport, 
                //             pointsPerGroup: 10,
                //             framesCount: 20,
                //             pointsDistributionSize: scene.viewport.add(new V2(10,-10)), 
                //             pointsDistributionPosition: new V2(-10,-10),
                //             target: new V2(38,38),
                //             pChangeType: 'linear',
                //             pChangeMethod: 'base',
                //             aChangeType: 'quad',
                //             aChangeMethotUp: 'inOut',
                //             aChangeMethotDown: 'inOut',
                //         });
        
                //         this.currentFrame = 0;
                //         this.img = this.frames[this.currentFrame];
                //     }
                // }))
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let scene = this.parent.parentScene;
                        this.frames = scene.createBgFrames({
                            color: { r: 188,g: 204,b:206 },
                            imgSize: scene.viewport, 
                            pointsPerGroup: 50,
                            framesCount: 20,
                            pointsDistributionSize: scene.viewport.add(new V2(10,-10)), 
                            pointsDistributionPosition: new V2(-10,-10),
                            target: new V2(0,38),
                            pChangeType: 'linear',
                            pChangeMethod: 'base',
                            aChangeType: 'quad',
                            aChangeMethotUp: 'inOut',
                            aChangeMethotDown: 'inOut',
                            targetAngleRandClamps: [-45,45]
                        });
        
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                    }
                }))
            ]


                this.timer = this.regTimerDefault(30, () => {
                    for(let i = 0; i < this.snowLayers.length; i++){
                        let snowLayer = this.snowLayers[i];

                        snowLayer.img = snowLayer.frames[snowLayer.currentFrame];
                        snowLayer.currentFrame++;
                        if(snowLayer.currentFrame == snowLayer.frames.length){
                            snowLayer.currentFrame = 0;
                        }
                    }


                    // this.img = this.frames[this.currentFrame];
                    // this.currentFrame++;
                    // if(this.currentFrame == this.frames.length){
                    //     this.currentFrame = 0;
                    // }
                })
            }
        }), 10)



        this.addGo(new Demo9WinterScene.SnowFlow({
            position: new V2(138, 90),
            size: new  V2(70,100),
            lightCenter: new V2(35,15),
            lightSize: new V2(35,50),
            roofTop: new V2(),
            debugFrames: false,
            speedClamps: [1.25,1.5],
            itemPerTick: 10,
        }), 5)

        this.addGo(new Demo9WinterScene.SnowFlow({
            position: new V2(149, 107),
            size: new  V2(70,100),
            lightCenter: new V2(35,15),
            lightSize: new V2(35,50),
            roofTop: new V2(),
            debugFrames: false,
            speedClamps: [1,1],//[1.5,1.75]
            itemPerTick: 11,
        }), 4)

        this.addGo(new Demo9WinterScene.SnowFlow({
            position: new V2(259, 103),
            size: new  V2(70,100),
            lightCenter: new V2(35,15),
            lightSize: new V2(35,50),
            roofTop: new V2(),
            debugFrames: false,
            speedClamps: [1,1],//[1.5,1.75]
            itemPerTick: 11,
        }), 4)

        this.addGo(new Demo9WinterScene.SnowFlow({
            position: new V2(69, 112),
            size: new  V2(70,100),
            lightCenter: new V2(35,8),
            lightSize: new V2(30,40),
            roofTop: new V2(),
            debugFrames: false,
            speedClamps: [1,1],//[1.5,1.75]
            itemPerTick: 10,
            alphaStart: 0.9,
            roofPoints: {
                left: new V2(0, 30),
                right: new V2(70,30)
            },
            // debugFrames: true,
            // debugMask: true,
        }), 4)

        this.addGo(new Demo9WinterScene.SnowFlow({
            position: new V2(184, 92),
            size: new  V2(70,60),
            lightCenter: new V2(35,7),
            lightSize: new V2(20,30),
            roofPoints: {
                left: new V2(0, 30),
                right: new V2(70,30)
            },
            debugFrames: false,
            debugMask: false,
            speedClamps: [0.55,0.75],//[1.5,1.75]
            itemPerTick: 15,
            alphaStart: 0.8,
        }), 3)

        this.addGo(new Demo9WinterScene.SnowFlow({
            position: new V2(121, 97),
            size: new  V2(70,60),
            lightCenter: new V2(35,7),
            lightSize: new V2(20,30),
            roofPoints: {
                left: new V2(0, 30),
                right: new V2(70,30)
            },
            debugFrames: false,
            debugMask: false,
            speedClamps: [0.55,0.75],//[1.5,1.75]
            itemPerTick: 15,
            alphaStart: 0.75,
        }), 3)
    }
}

Demo9WinterScene.SnowFlow = class extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            debugFrames: false,
            debugMask: false,
            speedClamps:  [2,2.5],
            itemPerTick: 20,
            alphaStart: 1,
            roofPoints: {
                left: undefined,
                center: undefined,
                right: undefined
            }
        }, options)

        super(options);

        this.ellipsis = {
            size: this.lightSize,
            position: this.lightCenter
        }

        if(this.roofPoints.left == undefined)
            this.roofPoints.left = new V2(0,20)

        if(this.roofPoints.center == undefined)
            this.roofPoints.center = new V2(this.ellipsis.position.x, 0)

        if(this.roofPoints.right == undefined)
            this.roofPoints.right = new V2(this.size.x,20)

        this.ellipsis.rxSq = this.ellipsis.size.x*this.ellipsis.size.x;
        this.ellipsis.rySq = this.ellipsis.size.y*this.ellipsis.size.y;

        this.mask = createCanvas(this.size, (ctx, size, hlp) => {
            let aChange = easing.createProps(100, this.alphaStart, 0, 'expo', 'out')

            let pp = new PerfectPixel({ctx});
            pp.setFillStyle('rgba(0,255,0,0)');
            let roofPoints = [...pp.lineV2(this.roofPoints.left, this.roofPoints.center), ...pp.lineV2(this.roofPoints.center,this.roofPoints.right)];
            roofPoints = distinct(roofPoints, (p) => p.x+'_'+p.y);

            for(let y = 0; y < size.y; y++){
                for(let x = 0; x < size.x; x++){
                    let dx = fast.r((((x-this.ellipsis.position.x)*(x-this.ellipsis.position.x)/this.ellipsis.rxSq) + ((y-this.ellipsis.position.y)*(y-this.ellipsis.position.y)/this.ellipsis.rySq))*100);
                    if(dx > 100)
                        continue;

                    let roofByX = roofPoints.filter(p => p.x == x);
                    if(roofByX.length > 0 && y < roofByX[0].y){
                        continue;
                    }

                    aChange.time = dx;
                    hlp.setFillColor(`rgba(255,255,255, ${fast.r(easing.process(aChange), 2)})`)
                    hlp.dot(x,y);
                }
            }
        })
    }

    init() {
        //this.pointsBg = [];
        //this.points = [[],[],[]];
        //this.pointsFg = [];

        this.points = [];

        this.timer = this.regTimerDefault(30, () => {

            for(let i = 0; i < this.itemPerTick; i++)
                this.points.push(this.pointGeneratorRandom());


            // for(let i = 0; i < 5; i++)
            //     this.points[0].push(this.pointGeneratorDirected({direction: 1}));

            // for(let i = 0; i < 5; i++)
            //     this.points[1].push(this.pointGeneratorRandom());

            // for(let i = 0; i < 5; i++)
            //     this.points[2].push(this.pointGeneratorDirected({direction: -1}));

                // for(let j = 0; j < this.points.length;j++){
                //     for(let i = 0; i < this.points[j].length;i++){
                //         this.pointProcesser(this.points[j][i]);
                //     }
                // }

                for(let i = 0; i < this.points.length;i++){
                    this.pointProcesser(this.points[i]);
                }

            this.points = this.points.filter((point) => point.alive);

            this.createImage();
        })
    }

    pointGeneratorDirected({direction = 1}) {

        return {
            position: new V2(direction > 0 ? getRandomInt(-this.size.x, this.size.x) : getRandomInt(0, this.size.x*2), -1),
            speed:  V2.right.rotate((direction > 0 ? 65 : 115) + getRandomInt(-20,20)).mul(direction ? getRandom(1.5,1.75) : getRandom(2.75,3)),
            alive: true,
        }
    }

    pointGeneratorRandom() {
        return {
            position: new V2(getRandomInt(-this.size.x, this.size.x*2), -1),
            speed:  V2.right.rotate(getRandomInt(45,135)).mul(getRandom(this.speedClamps[0],this.speedClamps[1])),
            alive: true,
        }
    }

    pointProcesser(point) {
        point.position.add(point.speed, true);

        point.alive = point.position.y < this.size.y;
    }

    createImage() {

        let snowImg = createCanvas(this.size, (ctx, size, hlp) => {
            hlp.setFillColor('#BCCCCE');
            for(let i = 0; i < this.points.length; i++){
                let pointX = fast.r(this.points[i].position.x)
                let pointY = fast.r(this.points[i].position.y)

                hlp.dot(pointX, pointY);
            }
        })

        this.img = createCanvas(this.size, (ctx, size, hlp) => {
            ctx.drawImage(this.mask, 0,0);
            if(!this.debugMask){
                ctx.globalCompositeOperation = 'source-in';
                ctx.drawImage(snowImg, 0,0);
            }
            
            

            if(this.debugFrames){
                ctx.globalCompositeOperation = 'source-over';
                hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
            }
            
        })
    }
}