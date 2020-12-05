class Demo10Loading4Scene extends Scene {
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

    createLightningFrames({framesCount, itemsCount, itemFrameslength, size}) {
        let frames = [];
        
        let xClamps = [50, 150];
        let targetY = 100;
        let innerDotsCount = 3;

        let sharedPP; 
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            sharedPP = new PP({ctx})
        })

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;

            let start = new V2(getRandomInt(xClamps[0], xClamps[1]), 0)
            let target = new V2(start.x + getRandomInt(-20, 20), targetY);

            let stDirection = start.direction(target);
            let stMid = start.add(stDirection.mul(start.distance(target)/2)).toInt();
            let mainMidPoint = stMid.add(stDirection.rotate(90*(getRandomBool() ? 1 : -1)).mul(getRandomInt(10,20))).toInt()
        
            //debugger;
            let mainPoints = distinct([
                ...sharedPP.lineV2(start, mainMidPoint),
                ...sharedPP.lineV2(mainMidPoint, target)
            ], (p) => p.x + '_' + p.y);

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    visible: true,
                };
            }
        
            return {
                start, 
                target, 
                mainMidPoint,
                mainPoints,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                hlp.setFillColor('rgba(255,255,255, 1)');
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        itemData.mainPoints.forEach(mp => hlp.dot(mp))
                    }
                    
                }
            });
        }
        
        return frames;
    }

    start(){
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.parentScene.createLightningFrames({ framesCount: 300, itemsCount: 5, itemFrameslength: 50, size: this.size });

                this.registerFramesDefaultTimer({});
            }
        }), 1)
    }
}