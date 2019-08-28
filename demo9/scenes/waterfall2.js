class Waterfall3Scene extends Scene {
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
        this.backgroundRenderDefault();
    }

    start(){

        this.redImg =  createCanvas(new V2(1,1), (ctx, size, hlp) => {
            hlp.setFillColor('#FF0000').dot(0,0);
        })

        this.yChangeMax = 0.1;
        this.shiftLength = 300;
        this.vChange = easing.createProps(this.shiftLength, 100, 0, 'quad', 'in'),

        this.sChange1 = easing.createProps(this.viewport.y/2, 75, 0, 'quad', 'out');
        this.sChange2 = easing.createProps(this.viewport.y/2, 0, 75, 'quad', 'out');
        this.images = [];

        for(let i = 0; i < this.viewport.y; i++){
            let change = this.sChange1
            let h = 200;
            change.time = i;
            if(i > this.viewport.y/2){
                change = this.sChange2;
                h = 20;
                change.time = i-this.viewport.y/2;
            }

            this.images[i] = [];
            for(let j = 0; j < this.shiftLength/10; j++){
                this.vChange.time = j*10;
                this.images[i][j] = createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.setFillColor(colors.hsvToHex([h, easing.process(change), fast.r(easing.process(this.vChange))])).dot(0,0);
                })
            }
        }

        this.items = [];
        this.falls = [{x: 380, height: 60}, {x: 430, height: 30}, {x: 500, height: 100}]                                                                                                

        this.direction = new V2(-1, -0.1);
        
        this.sizeChange = easing.createProps(this.shiftLength, 2, 1, 'quad', 'in');
        this.mfKoefChange = easing.createProps(this.shiftLength, 1.1, 0.8, 'quad', 'in');

        this.generatorTimer = this.regTimerDefault(50, () => {
            for(let i = 0; i < 5; i++){
                let distance = fast.r(getRandomGaussian(0,this.shiftLength));
                let shift = this.direction.mul(distance);
                this.vChange.time = distance;
                this.sizeChange.time = distance;
                this.mfKoefChange.time = distance;

                let ignoreFall = false;
                let s = easing.process(this.sizeChange);
                let position = new V2(this.viewport.x+220, fast.r(this.viewport.y/5)).add(shift);
                let yChange = easing.createProps(20, 0, -1, 'quad', 'inOut');
                let mfKoef = easing.process(this.mfKoefChange)
                let layer = distance+10;
                yChange.direction = -1;

                if(i == 3){
                    ignoreFall = true;
                    distance = 0;
                    position.y+=190;
                    mfKoef = 1.1;
                    layer = 1000;
                }
                else if(i == 4){
                    ignoreFall = true;
                    distance = this.shiftLength-100;
                    position.y+=155;
                    mfKoef = 0.9;
                    layer = 1;
                }

                this.items.push(this.addGo(new Waterfall3Item({
                    position,
                    shift,
                    size: new V2(s,s),
                    mfKoef,
                    img: this.images[fast.r(position.y)][fast.f(distance/10)],
                    yChange,
                    distance,
                    ignoreFall
                }), layer))
            }
            
        })

        // let distance = fast.r(getRandomGaussian(0,this.shiftLength));
        //         let shift = this.direction.mul(distance);
        //         this.vChange.time = distance;
        //         this.sizeChange.time = distance;
        //         this.mfKoefChange.time = distance;

        //         let s = easing.process(this.sizeChange);
        //         let position = new V2(this.viewport.x+200, fast.r(this.viewport.y/5)).add(shift);
        //         let yChange = easing.createProps(20, 0, -this.yChangeMax, 'quad', 'inOut');
        //         yChange.direction = -1;

        //         this.items.push(this.addGo(new Waterfall3Item({
        //             position,
        //             shift,
        //             size: new V2(s,s),
        //             mfKoef: easing.process(this.mfKoefChange),
        //             img: this.images[fast.r(position.y)][fast.f(distance/10)],
        //             yChange,
        //             distance
        //         }), distance))

        this.timer = this.regTimerDefault(15, () => {
            for(let i = 0; i < this.items.length;i++){
                this.itemProcesser(this.items[i]);
            }

            let alive = this.items.filter((item) => item.alive);
            this.items = alive;

            //this.debug.additional[2] = 'items.length: ' + this.items.length;
        })
        
    }

    /**
     * @param {Waterfall3Item} item 
     */
    itemProcesser(item){
        if(item.position.x < 10 || item.position.y >= this.viewport.y){
            item.setDead();
            
            return;
        }
          
        if(!item.ignoreFall){
            for(let i = 0; i < this.falls.length;i++){
                let fall = this.falls[i];
                if(item.position.x < (fall.x+item.shift.x) && item.triggeredFalls.indexOf(fall.x) == -1){
                    item.triggerFall(fall);
                    break;
                }
            }
        }

        if(item.falling){
            item.speed.y+=item.currentSpeedYDelta;

            if(item.position.y >= (item.fallStop)){
                item.stopFall();
            }
        }

        if(item.ascenting){
            item.speed.y-=(item.currentSpeedYDelta*1.5);

            if(item.position.y <= (item.ascentStop)){
                item.stopAscent();
            }
        }

        item.position.add(item.speed, true);

        if(!item.falling && !item.ascenting){
            item.position.y+=easing.process(item.yChange);
            item.yChange.time++;
            if(item.yChange.time > item.yChange.duration){
                let direction = -item.yChange.direction;
                item.yChange = easing.createProps(20, 0, direction*this.yChangeMax, 'quad', 'inOut');
                item.yChange.direction = direction;
            }
        }
        
        let imagesByHeight = this.images[fast.r(item.position.y)];
        if(imagesByHeight){
            item.img = imagesByHeight[fast.f(item.distance/10)];
        }
        
        // if(item.ignoreFall){
        //     item.img= this.redImg;
        // }

        item.needRecalcRenderProperties = true;
    }
}

class Waterfall3Item extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            mainFlow: new V2(-1, 0.1),
            mfKoef: 1,
            shift: new V2(),
            color: '#FFFFFF',
            colorHSV: [0,0,100],
            v: 100,
            size: new V2(2,2),
            renderValuesRound: true,
            triggeredFalls: [],
            speedYDelta: 0.05,
            ignoreFall: false,
        }, options)

        super(options);
    }

    init() {
        this.speed = this.mainFlow.mul(this.mfKoef);
        this.currentSpeedYDelta = this.speedYDelta;

    }

    triggerFall(fall){
        this.fall = fall;
        this.triggeredFalls.push(fall.x);

        this.falling = true;
        this.ascenting = false;
        this.fallStop = this.position.y + fall.height;

        //console.log('fall triggered: ' + fall.x);
    }

    ascent() {
        this.ascentStop = this.position.y - fast.r(this.fall.height/20);
        this.ascenting = true;
    }

    stopAscent(){
        this.ascenting = false;
        this.speed = this.mainFlow.mul(this.mfKoef);
    }

    stopFall(){
        this.falling = false;
        this.speed = this.mainFlow.mul(this.mfKoef);
        this.ascent();
    }
}