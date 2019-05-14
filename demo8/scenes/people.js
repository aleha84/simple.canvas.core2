class PeopleScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true, 
            }
        }, options)

        super(options);
    }

    start() {
        this.yClamps = [-20, 20];

        this.roadSize = new V2(this.viewport.x, this.viewport.y);
        //

        this.sideWalkSize = new V2(this.viewport.x, this.yClamps[1] - this.yClamps[0] + 10);
        this.sideWalk = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.sideWalkSize,
            img: createCanvas(this.sideWalkSize, (ctx, size) => {
                ctx.fillStyle = '#BEBEBC';
                ctx.fillRect(0,0, size.x, size.y);

                let alternateColors = [
                ];

                for(let i = -10; i < 5; i++){
                    if(i == 0)
                        continue;

                    alternateColors[alternateColors.length] = colors.changeHSV({initialValue: ctx.fillStyle, parameter: 'v', amount: i, isRgb: false});
                }

                for(let i = 0; i < 500; i++){
                    ctx.fillStyle = alternateColors[getRandomInt(0, alternateColors.length-1)];
                    ctx.fillRect(getRandomInt(0, size.x), getRandomInt(0, size.y), getRandomInt(1,3), 1);
                }

                let pp = new PerfectPixel({ context: ctx });
                ctx.fillStyle = '#5B5C5E';
                for(let i = 0; i < 80; i++){
                    pp.lineV2(new V2(170+ i, 0), new V2(140 + i, size.y))
                }

                ctx.fillStyle = '#EFEFEF';

                let counterMax = 4;
                let counter = counterMax;
                let drawZebra = true;
                for(let i = 0; i < 60; i++){
                    if(drawZebra)
                        pp.lineV2(new V2(175+ i, 10), new V2(156 + i, size.y-10));

                    counter--;
                    if(counter == 0){
                        counter = counterMax;
                        drawZebra = !drawZebra;
                    }
                }
            })
        }), 1)

        this.registerTimer(createTimer(250, () => {
            this.peopleGenerator();
        }, this, true))
    }

    peopleGenerator() {
        
        let yShift = getRandomInt(this.yClamps[0], this.yClamps[1]);
        let isLeft = getRandomBool();
        this.addGo(new PixelMan({
            position: new V2(isLeft ? -10 : this.viewport.x + 10, yShift + this.sceneCenter.y),
            xDestination:  isLeft ? this.viewport.x + 10 : -10,
            moveMaxMultiplier: getRandom(1,5),
            bounceMaxDivider: getRandom(4,10),
            moveDirection: isLeft ? 1: -1,
        }), yShift - this.yClamps[0] + 10);
    }

    backgroundRender() {
        this.backgroundRenderDefault('#5B5C5E');
    }
}

class PixelMan extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(2,6),
            renderValuesRound: true,
            xDestination: 300,
            bounceMaxDivider: 4,
            moveMaxMultiplier: 1,
            value: 1,
            moveDirection: 1,
        }, options)

        super(options);
    }

    // destinationCompleteCheck(){
    //     return Math.abs(this.position.x-this.originX) > 50
    // }

    // destinationCompleteCallBack() {
    //     this.originX = this.position.x;
    //     this.mDirection*=-1;
    //     this.setDestination(new V2((this.mDirection > 0 ? 1:-1)*50 ,0), true);
    // }

    init() {
        this.bounceStepDuration = 10;
        this.bounceMax = this.size.y/this.bounceMaxDivider;
        this.moveMax = this.size.x*this.moveMaxMultiplier;

        this.bounce = { 
            time: 0, duration: this.bounceStepDuration,startValue: this.position.y, change: -this.bounceMax, max: this.bounceMax, direction: -1, 
            type: 'sin', method: 'out', 
        };

        this.move = {
            time: 0, duration: this.bounceStepDuration*2,startValue: this.position.x, change: this.moveMax*this.moveDirection, max: this.moveMax, direction: this.moveDirection, 
            type: 'linear', method: 'base', 
        }

        this.originX = this.position.x;

        this.topColor = hsvToHex({hsv:[getRandomInt(0,360), 77,77]})//'#C6752F';
        this.skinColor = '#ED9B79';
        this.lowerColor = hsvToHex({hsv:[getRandomInt(0,360), 56,56]})//'#7E9641';

        this.imgLeft = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = this.topColor;
            ctx.fillRect(0,0, size.x, 1);
            ctx.fillRect(size.x-1,1, 1, 1);
            ctx.fillStyle = this.skinColor;
            ctx.fillRect(0,1, 1, 1);
            ctx.fillStyle = this.lowerColor;
            ctx.fillRect(0,2, size.x, size.y);
        });

        this.imgRight = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = this.topColor;
            ctx.fillRect(0,0, size.x, 1);
            ctx.fillRect(0,1, 1, 1);
            ctx.fillStyle = this.skinColor;
            ctx.fillRect(size.x-1,1, 1, 1);
            ctx.fillStyle = this.lowerColor;
            ctx.fillRect(0,2, size.x, size.y);
        });

        
        this.choseImg();
        //this.setDestination(new V2(50, 0), true);

        this.startBounce();
    }

    choseImg() {
        this.img = this.move.direction > 0 ? this.imgRight : this.imgLeft;
    }

    startBounce() {
        this.bounceTimer = this.registerTimer(createTimer(20, () => {
            let b = this.bounce;
            let m = this.move;
            let y = easing.process(b);
            
            this.position.y = y;
            this.position.x = easing.process(m);

            this.needRecalcRenderProperties = true;

            b.time++;
            m.time++;
            if(b.time > b.duration){
                b.direction*=-1;

                b.time = 0;
                b.startValue = this.position.y;
                b.change = (b.direction > 0 ? 1 : -1) * b.max;
                b.method =this.direction > 0 ? 'in' : 'out'

                if(b.direction < 0){
                    m.time = 0;
                    m.startValue = this.position.x;

                    // if(Math.abs(this.position.x-this.originX) > 50){
                    //     this.originX = this.position.x;
                    //     //this.mDirection*=-1;
                    //     m.direction*=-1;
                    //     m.change = m.direction*m.max;
                    //     this.choseImg();
                    // }

                    if((m.direction > 0 && this.position.x > this.xDestination) || (m.direction < 0 && this.position.x < this.xDestination)){
                        this.setDead();
                    }
                }
            }
            // else {
            //     this.position.x += this.speed*this.mDirection;
            // }

        }, this, true));
    }

    stopBounce() {
        this.unregTimer(this.bounceTimer);
    }
}