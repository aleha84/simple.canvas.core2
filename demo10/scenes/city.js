class Demo10CityScene extends Scene {
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
        this.backgroundRenderDefault();
    }

    flowGenerator({framesCount, itemsCount, from, to, path, upperY, fromShift= 0, lengthFrom = 0}) {
        let items = []
        for(let i = 0; i < itemsCount; i++){
            items[i] = {
                initialIndex: getRandomInt(0, framesCount-1),
                color: colors.getMidColor({color1: this.flowColors[getRandomInt(0, this.flowColors.length-1)], color2: '#A58F7C'}),
                linePoints: [],
                lineIndices: [],
                p: [],
                lengths: []
            };

            let startP = from;
            if(fromShift > 0){
                startP = from.add(new V2(getRandomInt(-fromShift, fromShift), getRandomInt(-fromShift, fromShift)));
            }

            let lChange = undefined;
            if(lengthFrom > 0){
                lChange = easing.createProps(framesCount-1, lengthFrom, 0, 'quad', 'out');
            }

            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                let pp = new PerfectPixel({ctx});
                items[i].linePoints = pp.lineV2(startP, to);
            })

            let indexChange = easing.createProps(framesCount-1, 0, items[i].linePoints.length-1, 'quad', 'out');

            for(let f = 0; f < framesCount; f++){
                indexChange.time = f;
                if(lChange){
                    lChange.time = f;
                    items[i].lengths[f] = fast.r(easing.process(lChange));
                }
                    

                let lineIndex = fast.r(easing.process(indexChange));
                items[i].lineIndices[f] = lineIndex;

            }
        }

        let result = [];

        for(let f = 0; f < framesCount; f++){
            result[f] = createCanvas(this.viewport, (ctx, size, hlp) => {
                for(let i = 0; i < itemsCount; i++){
                    let item = items[i];
                    let currentPIndex = item.initialIndex + f;
                    if(currentPIndex > (item.lineIndices.length - 1)){
                        currentPIndex -= item.lineIndices.length;
                    }

                    let lineIndex = item.lineIndices[currentPIndex];
                    let p = item.linePoints[lineIndex];
                    

                    if(p.y > upperY){


                        // let x = fast.c(p.x/2)*2;
                        // let y = fast.c(p.y/2)*2;
                        let x = fast.r(p.x)
                        let y = fast.r(p.y)

                        hlp.setFillColor(item.color).dot(x, y);

                        if(lengthFrom && item.lengths[currentPIndex] > 0) {
                            for(let l = 0; l < item.lengths[currentPIndex]; l++){
                                let p = item.linePoints[lineIndex-(l+1)];
                                if(p != undefined)
                                    hlp.setFillColor(item.color).dot(p.x, p.y)
                            }
                        }
                    }
                }
                
            })
        }

        return result;
    }

    start(){
        this.layers = {
            overMainRoadBuilding: 21,
            mainRoad: 20,
            mainRightBuilding: 19
        }

        this.flowColors = [];
        for(let i = 0; i < 10; i++){
            this.flowColors[i] = hsvToHex({hsv: {h: getRandomInt(0, 359), s: getRandomInt(20, 70), v: getRandomInt(50, 90)}, hsvAsObject: true})
        }

        this.mainRoad = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10CityScene.models.mainRoad)
                }));

                this.flow1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.parentScene.flowGenerator({framesCount: 800, itemsCount: 250, from: new V2(64,207), to: new V2(200,54), upperY: 66, fromShift: 4,
                    lengthFrom: 2}),
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
                }))

                this.flow2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.parentScene.flowGenerator({framesCount: 800, itemsCount: 250, from: new V2(48,207), to: new V2(199,49), upperY: 66, fromShift: 4,
                        lengthFrom: 2}),
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
        
                        this.timer = this.regTimerDefault(15, () => {
            
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame--;
                            if(this.currentFrame < 0){
                                this.currentFrame = this.frames.length-1;
                            }
                        })
                    }
                }))
            }
        }), this.layers.mainRoad)

        this.mainRightBuilding = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10CityScene.models.mainRightBuilding)
                }))
            }
        }), this.layers.mainRightBuilding)

        this.mainRightBuilding = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10CityScene.models.overMainRoadBuilding)
                }))
            }
        }), this.layers.overMainRoadBuilding)
    }
}