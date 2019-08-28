class NightRainScene extends Scene {
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
        this.backgroundRenderDefault(colors.rgba.black);
    }

    start(){
        this.maxLightDistance = 100;
        this.lightCenter = new V2(280, 92);
        this.defaultDirection = new V2(-0.25,1);
        this.defaultSpeedKoef = 6;
        this.defaultSize = new V2(2,4);
        this.defaultSpeed = this.defaultDirection.mul(this.defaultSpeedKoef);
        this.defaultSpeed2 = this.defaultDirection.mul(this.defaultSpeedKoef-1.5);
        
        this.ellipsis = {
            size: new V2(70, 200),
        }

        this.ellipsis.rxSq = this.ellipsis.size.x*this.ellipsis.size.x;
        this.ellipsis.rySq = this.ellipsis.size.y*this.ellipsis.size.y;

        this.items = [];
        this.raindropImages = new Array(9).fill().map((_, i) => createCanvas(new V2(2,4), (ctx, size, hlp) => {
            hlp.setFillColor(colors.hsvToHex([300, 0, 90-i*10])).rect(1,0,1,2).rect(0,2,1,2);
        }));

        this.raindropImages2 = new Array(9).fill().map((_, i) => createCanvas(new V2(1,1), (ctx, size, hlp) => {
            hlp.setFillColor(colors.hsvToHex([300, 0, 90-i*10])).dot(0,0);
        }));

        //this.imgColorChange = easing.createProps(this.maxLightDistance, 0, this.raindropImages.length, 'quad', 'in');
        this.imgColorChangeEl = easing.createProps(100, 0, this.raindropImages.length, 'quad', 'out');

        this.addGo(new GO({
            position: new V2(300, 200),
            size: new V2(8, 200),
            img: createCanvas(new V2(8, 200), (ctx, size, hlp) => {
                //hlp.setFillColor('red').rect(0,0,size.x, size.y);
                hlp.setFillColor(colors.palettes.fleja.colors[1]).rect(0, 0, 8, size.y)
                hlp.setFillColor(colors.palettes.fleja.colors[2]).rect(0, 0, 6, size.y/2)
                hlp.setFillColor(colors.palettes.fleja.colors[3]).rect(0, 0, 4, size.y/4)
                hlp.setFillColor(colors.palettes.fleja.colors[4]).rect(0, 0, 2, size.y/8)

                hlp.setFillColor(colors.palettes.fleja.colors[0])
                .rect(4, 0, 2, size.y).rect(2, size.y/2 + 40, 2, size.y/2).rect(4, size.y/2 + 80, 2, size.y/2).rect(0, fast.r(size.y*2/3) , 2, size.y/2)
                .rect(0, fast.r(size.y*3.85/6) , 2, 3)
                
                hlp.setFillColor(colors.palettes.fleja.colors[1]).rect(4, size.y*3/10, 2, 40).rect(2, size.y*4/10, 2, 20)

                hlp.setFillColor(colors.palettes.fleja.colors[2]).rect(2, size.y*1.5/10, 2, 20).rect(0, size.y*5.25/10, 2, 5).rect(0, size.y*5.75/10, 2, 3)
                hlp.setFillColor(colors.palettes.fleja.colors[3]).rect(0, size.y*2.65/10, 2, 3).rect(0, size.y*1/10, 2, 3);

                hlp.clear(size.x-6, 0,6,2).clear(size.x-2, 0, 2,size.y*10/10)
            })
        }),10)

        this.addGo(new GO({
            position: new V2(285, 95),
            size: new V2(30, 15),
            img: PP.createImage({"general":{"originalSize":{"x":30,"y":15},"size":{"x":30,"y":15},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#1f1833","fillColor":"#1f1833","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":29,"y":10}},{"point":{"x":28,"y":6}},{"point":{"x":26,"y":5}},{"point":{"x":24,"y":5}},{"point":{"x":22,"y":5}},{"point":{"x":21,"y":3}},{"point":{"x":17,"y":2}},{"point":{"x":14,"y":2}},{"point":{"x":10,"y":2}},{"point":{"x":8,"y":2}},{"point":{"x":5,"y":3}},{"point":{"x":4,"y":3}},{"point":{"x":3,"y":4}},{"point":{"x":2,"y":5}},{"point":{"x":2,"y":6}},{"point":{"x":1,"y":7}},{"point":{"x":1,"y":10}},{"point":{"x":22,"y":10}},{"point":{"x":24,"y":11}},{"point":{"x":29,"y":11}}]},{"order":1,"type":"lines","strokeColor":"#ffffff","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":3,"y":11}},{"point":{"x":19,"y":11}}]},{"order":2,"type":"lines","strokeColor":"#90a1a8","fillColor":"#90a1a8","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":24,"y":11}},{"point":{"x":27,"y":11}},{"point":{"x":27,"y":13}},{"point":{"x":25,"y":12}}]},{"order":3,"type":"lines","strokeColor":"#2b2e42","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":10}},{"point":{"x":22,"y":10}}]},{"order":4,"type":"lines","strokeColor":"#414859","fillColor":"#414859","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":28,"y":11}},{"point":{"x":28,"y":14}},{"point":{"x":29,"y":14}},{"point":{"x":29,"y":11}},{"point":{"x":29,"y":10}},{"point":{"x":24,"y":10}}]},{"order":5,"type":"lines","strokeColor":"#90a1a8","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":23,"y":10}},{"point":{"x":17,"y":10}}]},{"order":6,"type":"lines","strokeColor":"#1f1833","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":28,"y":10}},{"point":{"x":29,"y":11}},{"point":{"x":29,"y":10}}]}]}})
        }), 10)


        //  this.addGo(new GO({
        //         position: this.lightCenter.clone(),
        //         size: new V2(300, 300),
        //         img: createCanvas(new V2(300,300), (ctx, size, hlp) => {
        //             hlp.setFillColor('rgba(255,0,0,0.2)').elipsis(new V2(size.x/2, size.y/2), this.ellipsis.size)
        //         })
        //     }), 1)


        this.generatorTimer = this.regTimerDefault(50, () => {
            for(let i = 0; i < 30; i++){
                let layer = 20;
                let position = this.lightCenter.add(new V2(getRandomBool() ? -1 : 1, 0.35).mul(getRandom(0,200)));
                let speed = this.defaultSpeed;

                if(i < 15){
                    layer = 1;
                    speed = this.defaultSpeed2;
                }

                position.y += getRandom(-5,5);

                this.items.push(this.addGo(new GO({
                    position, 
                    size: this.defaultSize.clone(),
                    //img: this.raindropImages[2],
                    speed,
                    renderValuesRound: true
                }), layer))
            }
            
            if(getRandomInt(0, 2) == 0){
                this.items.push(this.addGo(new GO({
                    position: this.lightCenter.add(new V2(getRandomInt(-10,10), 5)), 
                    size: new V2(1,1),
                    //img: this.raindropImages[2],
                    speed: new V2(0, 1),
                    speedYDelta: 0.1,
                    renderValuesRound: true,
                    falling: true,
                }), 20))
            }
        })

        // let position = this.lightCenter.add(new V2(-1, 0.25).mul(100));

        //     this.items.push(this.addGo(new GO({
        //         position, 
        //         size: this.defaultSize.clone(),
        //         img: this.raindropImages[2],
        //         speed: this.defaultSpeed,
        //         renderValuesRound: true
        //     }), 20))

        this.timer = this.regTimerDefault(15, () => {
            for(let i = 0; i < this.items.length;i++){
                this.itemProcesser(this.items[i]);
            }

            let alive = this.items.filter((item) => item.alive);
            this.items = alive;
        })
    }

    itemProcesser(item) {
        if(item.position.y >= this.viewport.y){
            item.setDead();
            
            return;
        }

        item.position.add(item.speed, true);

        

        let x = item.position.x;
        let y = item.position.y;
        let dx = fast.r((((x-this.lightCenter.x)*(x-this.lightCenter.x)/this.ellipsis.rxSq) + ((y-this.lightCenter.y)*(y-this.lightCenter.y)/this.ellipsis.rySq))*100);

        
        if(dx > 100){
            dx = 100;
        }

        this.imgColorChangeEl.time = dx;
        item.img = this.raindropImages[fast.r(easing.process(this.imgColorChangeEl))];

        if(item.falling){
            item.speed.y+=item.speedYDelta;
            item.img = this.raindropImages2[fast.r(easing.process(this.imgColorChangeEl))];
            item.size.y = fast.r(item.speed.y/2);
            if(item.size.y < 1) item.size.y = 1;
        }

        item.needRecalcRenderProperties = true;
    }
}