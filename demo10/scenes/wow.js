class Demo10WowScene extends Scene {
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

    start(){
        this.frames = [];

        this.framesCount = 400;
        this.fastClamps = [25, 300];

        this.pCenter = this.sceneCenter.clone();
        this.linesCount = 150;

        this.lines = [];

        this.initialEllipsisPoints = [];
        createCanvas(this.viewport, (ctx, size, hlp) => {
            hlp.strokeEllipsis(0, 360, 0.1, new V2(size.x/2, size.y/2), size.x/2, size.y/2, this.initialEllipsisPoints);
        })

        for(let i = 0; i < this.linesCount; i++){
            let initialPoint = this.initialEllipsisPoints[getRandomInt(0, this.initialEllipsisPoints.length-1)];
            let linePoints = [];

            initialPoint = new V2()
            if(getRandomBool()){ //h/v
                initialPoint.x = getRandomInt(0, this.viewport.x);
                if(getRandomBool()){ // up / down
                    initialPoint.y = 0;
                }
                else {
                    initialPoint.y = this.viewport.y
                }
            }
            else {
                initialPoint.y = getRandomInt(0, this.viewport.y);
                if(getRandomBool()){ // left / right
                    initialPoint.x = 0;
                }
                else {
                    initialPoint.x = this.viewport.x
                }
            }
            
            createCanvas(this.viewport, (ctx, size, hlp) => {
                let pp = new PerfectPixel({ctx})
                linePoints = pp.lineV2(this.pCenter, initialPoint);
            })


            let lpIndexChange = easing.createProps(this.framesCount-1, linePoints.length-1, 0, 'cubic', 'out');
            let lpIndices = [];
            
            let lineLength = [];
            let initialLength = 30;
            let lengthChange = easing.createProps(this.framesCount-1, initialLength, 0, 'cubic', 'out');

            for(let f = 0; f < this.framesCount; f++){
                lpIndexChange.time = f;
                lengthChange.time = f;

                lpIndices[f] = fast.r(easing.process(lpIndexChange))
                lineLength[f] = fast.r(easing.process(lengthChange))
            }

            this.lines[i] = {
                lpIndices,
                linePoints,
                lineLength,
                linePointsInitialIndex: getRandomInt(0, lpIndices.length-1)
            }
        }

        for(let f = 0; f < this.framesCount; f++){
            this.frames[f] = createCanvas(this.viewport, (ctx, size, hlp) => {
                for(let l = 0; l < this.lines.length; l++){
                    let line = this.lines[l];
                    let currentIndex = line.linePointsInitialIndex + f;
                    if(currentIndex > (line.lpIndices.length-1)){
                        currentIndex-=line.lpIndices.length
                    }

                    // let lpIndex = line.lpIndices[currentIndex];
                    // let p = line.linePoints[lpIndex];

                    // if(p == undefined)
                    //     debugger;

                    //hlp.setFillColor('white').dot(p.x, p.y);

                    let currentLength = line.lineLength[currentIndex];
                    for(let l = 0; l < currentLength+1; l++){
                        let lpIndex = line.lpIndices[currentIndex] + l;
                        if(lpIndex > (line.linePoints.length-1))
                            continue;

                        let p = line.linePoints[lpIndex];

                        hlp.setFillColor('white').dot(p.x, p.y);
                    }
                }

            })
        }

        this.lines = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.frames,
            init() {

                let scene = this.parentScene;
                let tragetFramesCount = 50;
                let framesIndexChange = easing.createProps(tragetFramesCount, scene.fastClamps[0],scene.fastClamps[1], 'sin', 'inOut');
                let framesIndices = [];
                for(let f = 0; f < tragetFramesCount; f++){
                    framesIndexChange.time = f;
                    framesIndices[f] = fast.r(easing.process(framesIndexChange));
                }

                this.fast = false;
                this.currentFrame = 0;
                this.currentFrameIndex = 0;
                // this.currentFrame = framesIndices[this.currentFrameIndex];

                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(15, () => {
                    if(this.fast){
                        this.currentFrame = framesIndices[this.currentFrameIndex];
                    }
                    

                    this.img = this.frames[this.currentFrame];

                    if(this.fast){
                        this.currentFrameIndex++;

                        if(this.currentFrameIndex == framesIndices.length){
                            this.currentFrameIndex = 0;
                            this.fast = false;
                            this.currentFrame = scene.fastClamps[1]+1
                        }
                    }
                    else {
                        this.currentFrame++;

                        
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;
                        }
                        else if(this.currentFrame == scene.fastClamps[0]){
                            this.currentFrameIndex = 0;
                            this.fast = true;
                        }
                    }
                })
            }
        }), 1)
    }
}