class Waterfall2Scene extends Scene {
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

    start() {
        this.addGo(new Waterfall2Layer({
            position: this.sceneCenter,
            size: new V2(150, 80)
        }))

        // this.addGo(new WaterfallPikes({
        //     position: this.sceneCenter,
        //     size: new V2(200, 100)
        // }))
    }
}

class Waterfall2Layer extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
        }, options)

        super(options);
    }

    init() {
        let pikeHeight = this.pikeHeight || 30;
        this.pikes = this.addChild(new WaterfallPikes({
            size: new V2(this.size.x, pikeHeight),
            position: new V2(0, -this.size.y/2 + pikeHeight/2),
            tlCircleRadius: 12,
            pikeUpperY: [12,15],
            pikeLowerY: [18,22],
            pikeRandomHeight: 4,
            pikeRadius: [6,6],
        }));

        let fallHeight = this.size.y - pikeHeight;
        this.fall = this.addChild(new GO({
            size: new V2(this.size.x-1, fallHeight),
            position: new V2(0.5, this.pikes.position.y + pikeHeight/2 + fallHeight/2),
            img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                hlp.setFillColor('#CBE3D7').dot(0,0);
            })
        }))

        let shadowHeight = this.shadowHeight || 30;
        this.shadow = this.addChild(new GO({
            position: new V2(0, this.size.y/2 - shadowHeight/2),
            size: new V2(this.size.x, shadowHeight),
            img: createCanvas(new V2(1,shadowHeight), (ctx, size, hlp) => {
                let opacityChange = easing.createProps(size.y, 0, 0.2, 'quad', 'out');
                for(let y = 0; y < size.y; y++){
                    opacityChange.time = y;
                    let opacity = easing.process(opacityChange);
                    opacity = (fast.c((opacity*100)/3)*3)/100
                    hlp.setFillColor(`rgba(0,0,0,${opacity})`).dot(0, y);
                }
            })
        }));

        this.timer = this.regTimerDefault(100, () => {
            
        })
    }
}

class WaterfallPikes extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            xScale: 1,
            pikeRandomHeight: 7,
            pikeRadius: [5,10],
            pikeUpperY: [30, 40],
            pikeLowerY: [45,55],
            tlCircleRadius: 30
        }, options)

        super(options);
    }

    init() {

        this.imgSize = new V2(this.size.x, this.size.y);
       
        this.originalShift = [];
        this.itemsWidths = [];
        let currentX = 0;
        let isUp = true;
        while (currentX < this.imgSize.x) {
            let radius = getRandomInt(this.pikeRadius[0], this.pikeRadius[1]);
            currentX = fast.r(currentX + radius)
            let y = isUp ? getRandomInt(this.pikeUpperY[0], this.pikeUpperY[1]) : getRandomInt(this.pikeLowerY[0], this.pikeLowerY[1]);
            let p = new V2(currentX, y);
            this.itemsWidths.push({
                radius,
                originPosition: p,
                position: p.clone(),
                isUp,
                change: easing.createProps(getRandomInt(5, 10), p.y, p.y + getRandomInt(-this.pikeRandomHeight, this.pikeRandomHeight), 'sin', 'inOut')
            });

            currentX = fast.r(currentX + radius -1);
            isUp = !isUp;
        }

        this.createImage();

        this.timer = this.regTimerDefault(30, () => {
            this.itemsWidths.forEach((item) => {
                item.position.y = fast.r(easing.process(item.change));
                item.change.time++;

                if (item.change.time > item.change.duration) {
                    item.change = easing.createProps(getRandomInt(5, 10), item.position.y, item.originPosition.y + getRandomInt(-this.pikeRandomHeight, this.pikeRandomHeight), 'sin', 'inOut');
                }
            })

            this.createImage();
        })
    }

    createImage() {

        if (!this.bg) {
            this.bg = createCanvas(this.imgSize, (ctx, size, hlp) => {

                hlp.setFillColor('#79CBB2')
                    .circle(new V2(this.tlCircleRadius, this.tlCircleRadius), this.tlCircleRadius)
                    .rect(this.tlCircleRadius, 1, size.x, size.y)
                    .rect(1, this.tlCircleRadius, size.x, size.y);
            });
        }

        this.img = createCanvas(this.imgSize, (ctx, size, hlp) => {
            ctx.drawImage(this.bg, 0, 0);
            ctx.globalCompositeOperation = 'source-atop';

            for (let i = 0; i < this.itemsWidths.length; i++) {
                let item = this.itemsWidths[i];

                hlp.setFillColor('#CBE3D7')
                    .rect(item.position.x - item.radius+1, item.position.y, item.radius * 2 -1, size.y)
                    .setFillColor(item.isUp ? '#CBE3D7' : '#79CBB2')//
                    .circle(item.position, item.radius)
            }
        })
    }
}