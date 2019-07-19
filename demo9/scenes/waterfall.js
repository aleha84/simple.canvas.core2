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
        this.addGo(new Waterfall2ItemGO({
            position: this.sceneCenter,
            size: new V2(200, 100)
        }))
    }
}

class Waterfall2ItemGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            xScale: 1,
        }, options)

        super(options);
    }

    init() {

        this.imgSize = new V2(this.size.x, this.size.y);
        // this.originalShift =new Array(this.imgSize.x + 10).fill().map(() => getRandom(5, 13)) 
        // this.currentShift = [...this.originalShift];

        //this.change = this.currentShift.map(s => easing.createProps(getRandomInt(10,20), s, s+getRandom(-2,2), 'quad', 'inOut'));

        this.originalShift = [];
        this.itemsWidths = [];
        let currentX = 0;
        let isUp = true;
        while (currentX < this.imgSize.x) {
            let radius = getRandomInt(5, 10);
            currentX = fast.r(currentX + radius)
            let y = isUp ? getRandomInt(25, 35) : getRandomInt(40, 50);
            let p = new V2(currentX, y);
            this.itemsWidths.push({
                radius,
                originPosition: p,
                position: p.clone(),
                isUp,
                change: easing.createProps(getRandomInt(5, 10), p.y, p.y + getRandomInt(-5, 5), 'sin', 'inOut')
            });

            currentX = fast.r(currentX + radius);
            isUp = !isUp;
        }

        this.createImage();

        this.timer = this.regTimerDefault(30, () => {
            this.itemsWidths.forEach((item) => {
                item.position.y = fast.r(easing.process(item.change));
                item.change.time++;

                if (item.change.time > item.change.duration) {
                    item.change = easing.createProps(getRandomInt(5, 10), item.position.y, item.originPosition.y + getRandomInt(-5, 5), 'sin', 'inOut');
                }
            })

            this.createImage();
        })
    }

    createImage() {

        if (!this.bg) {
            this.bg = createCanvas(this.imgSize, (ctx, size, hlp) => {

                hlp.setFillColor('#79CBB2')
                    .circle(new V2(15, 15), 15)
                    .rect(15, 1, size.x, size.y)
                    .rect(1, 15, size.x, size.y);
            });
        }

        this.img = createCanvas(this.imgSize, (ctx, size, hlp) => {
            ctx.drawImage(this.bg, 0, 0);
            ctx.globalCompositeOperation = 'source-atop';

            for (let i = 0; i < this.itemsWidths.length; i++) {
                let item = this.itemsWidths[i];

                hlp.setFillColor('#CBE3D7')
                    .rect(item.position.x - item.radius, item.position.y, item.radius * 2 + 1, size.y)
                    .setFillColor(item.isUp ? '#CBE3D7' : '#79CBB2')
                    .circle(item.position, item.radius)
            }




        })
    }
}