class DropScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)

        super(options);

    }

    backgroundRender() {
        //this.backgroundRenderDefault('#0DBCF8');
        SCG.contexts.background.drawImage(this.bgImage, 0,0, SCG.viewport.real.width, SCG.viewport.real.height);
    }

    startCircles() {
        let count = 1;
        let targetWidth = 250;
        this.circlesTimer = this.registerTimer(createTimer(300, () => {
            this.addGo(new DropCircle({
                position: this.sceneCenter,
                width: 20,
                imgCache: this.imgCache,
                targetWidth
            }));
            count--;
            targetWidth-=25;
            if(count == 0){
                this.unregTimer(this.circlesTimer);
            }
        }, this, true));
    }

    start() {
        this.bgImage = createCanvas(new V2(100,50), (ctx,size) => {
            let hsv = [180,84,87];
            let hChange = easing.createProps(120, 185, 196, 'linear', 'base')
            let sChange = easing.createProps(120, 90, 92, 'linear', 'base');

            let pp = new PerfectPixel({context: ctx});
            for(let x = 0; x < size.x+20; x++){
                hChange.time = x;
                sChange.time = x;
                let h = easing.process(hChange);
                //h = fast.r(fast.f(h/1.5)*1.5);
                ctx.fillStyle = hsvToHex({
                    hsv: [h, easing.process(sChange), hsv[2]]
                })
                pp.lineV2(new V2(x, 0), new V2(x- 20, size.y));
            }

        });
        this.dropModel = {"general":{"originalSize":{"x":15,"y":20},"size":{"x":15,"y":20},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#37E0EB","fillColor":"#37E0EB","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":14}},{"point":{"x":4,"y":17}},{"point":{"x":7,"y":18}},{"point":{"x":10,"y":17}},{"point":{"x":12,"y":14}},{"point":{"x":12,"y":10}},{"point":{"x":9,"y":5}},{"point":{"x":7,"y":1}},{"point":{"x":5,"y":5}},{"point":{"x":2,"y":10}}]},{"order":1,"type":"lines","strokeColor":"#0F96D0","fillColor":"#0F96D0","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":9,"y":4}},{"point":{"x":11,"y":9}},{"point":{"x":12,"y":10}},{"point":{"x":12,"y":14}},{"point":{"x":11,"y":15}},{"point":{"x":10,"y":17}},{"point":{"x":9,"y":17}},{"point":{"x":8,"y":18}},{"point":{"x":6,"y":18}},{"point":{"x":5,"y":17}},{"point":{"x":8,"y":15}},{"point":{"x":11,"y":12}},{"point":{"x":11,"y":10}}]},{"order":2,"type":"lines","strokeColor":"#0C6C96","fillColor":"#0C6C96","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":12,"y":13}},{"point":{"x":12,"y":14}},{"point":{"x":11,"y":15}},{"point":{"x":11,"y":16}},{"point":{"x":10,"y":17}},{"point":{"x":8,"y":18}},{"point":{"x":7,"y":18}}]},{"order":3,"type":"lines","strokeColor":"#9BF6FA","fillColor":"#9BF6FA","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":5,"y":5}},{"point":{"x":4,"y":6}},{"point":{"x":3,"y":8}},{"point":{"x":2,"y":10}},{"point":{"x":2,"y":13}},{"point":{"x":5,"y":14}},{"point":{"x":6,"y":10}},{"point":{"x":3,"y":9}}]},{"order":4,"type":"lines","strokeColor":"#BCF9FC","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":4,"y":14}},{"point":{"x":3,"y":13}},{"point":{"x":3,"y":10}}]}]}};
        this.gCounter = 20;

        this.timer = this.registerTimer(createTimer(1000, () => {
            this.gCounter--;
            this.addGo(new GO({
                position: new V2(this.sceneCenter.x, -100),
                size: new V2(15,20).mul(0.5).toInt(),
                img: PP.createImage(this.dropModel),
                opacity: 0.5,
                internalPreRender() {
                    this.originalGlobalAlpha = this.context.globalAlpha;
                    this.context.globalAlpha = this.opacity;
                },
            
                internalRender() {
                    this.context.globalAlpha = this.originalGlobalAlpha;
                },
                init() {
                    this.yChange = easing.createProps(15, this.position.y, this.parentScene.sceneCenter.y, 'quad', 'in');

                    this.timer = this.registerTimer(createTimer(30, () => {
                        this.position.y = easing.process(this.yChange);
                        this.yChange.time++;
                        this.needRecalcRenderProperties = true;

                        // if(this.yChange.time == 14){
                        //     this.parentScene.startCircles();
                        // }
                        if(this.yChange.time > this.yChange.duration){
                            this.unregTimer(this.timer);
                            this.setDead();
                            this.parentScene.startCircles();
                        }
                    }, this, true));
                }
            }));
        
            if(this.gCounter == 0){
                this.unregTimer(this.timer);
            }
        //     let count = 3;
        //     let targetWidth = 250;
        //     this.innerTimer = this.registerTimer(createTimer(300, () => {
        //         this.addGo(new DropCircle({
        //             position: this.sceneCenter,
        //             width: 20,
        //             imgCache: this.imgCache,
        //             targetWidth
        //         }));
        //         count--;
        //         targetWidth-=25;
        //         if(count == 0){
        //             this.unregTimer(this.innerTimer);
        //         }
        //     }, this, true));
            
         }, this, true));

    }
}

class DropCircle extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: false,
            size: new V2(1,1),
            width: 50,
            baseColorHSV: [195,94, 100],
            opacity: 1,
            duration: 100,
            imgCache: [],
            targetWidth: 250,
        }, options)

        super(options);
    }

    init() {
        this.updateProperties();

        this.wChange = easing.createProps(this.duration, this.width, this.targetWidth, 'quad', 'out');
        this.oChange = easing.createProps(this.duration, 1, 0, 'quad', 'out');

        this.timer = this.registerTimer(createTimer(30,  () => {
            this.width = fast.r(easing.process(this.wChange));
            this.opacity = easing.process(this.oChange);

            this.wChange.time++;
            this.oChange.time++;

            this.updateProperties();

            if(this.wChange.time > this.wChange.duration){
                this.unregTimer(this.timer);
                this.setDead()
            }
        }, this, true))
    }

    internalPreRender() {
        this.originalGlobalAlpha = this.context.globalAlpha;
        this.context.globalAlpha = this.opacity;
    }

    internalRender() {
        this.context.globalAlpha = this.originalGlobalAlpha;
    }

    updateProperties(){
        this.height = this.width/2;
        this.origin =new V2(this.width, this.height);
        this.size = new V2(this.width*2, this.height*2);
        this.img = this.createImage();
        this.needRecalcRenderProperties = true;
    }

    drawEllips({hlp, color= 'white',from = 0, to = 360, step = 0.1, width, height}){
        if(height == undefined)
            height = width/2;

        hlp.setFillColor(color);
        for(let angle = from; angle < to; angle+=step){
            let r = degreeToRadians(angle);
            let x = fast.r(this.origin.x + width * Math.cos(r));
            let y = fast.r(this.origin.y + height * Math.sin(r));

            hlp.dot(x,y);
        }
    }

    createImage(){
        if(!this.imgCache[this.width]){
            this.imgCache[this.width] = createCanvas(this.size.add(new V2(1,1)), (ctx,size, hlp) => {
                let dPartLength = 10;
                let type = 'linear';
                let method = 'base'
                let startChange = easing.createProps(dPartLength, 0, 60, type, method);
                let endChange = easing.createProps(dPartLength, 180, 90, type, method);
                let vChange = easing.createProps(dPartLength, 25, 50, type, method);

                for(let i = 0; i <=dPartLength; i++){
                    this.drawEllips({hlp, color: 
                        hsvToHex({hsv: [this.baseColorHSV[0], this.baseColorHSV[1], easing.process(vChange)]}),
                        from: easing.process(startChange),
                        to: easing.process(endChange), step: 0.1, width: this.width - 10 - i});
                    vChange.time++;
                    startChange.time++;
                    endChange.time++;
                }

                let rightLightLength = 5;
                startChange = easing.createProps(rightLightLength, -30, -55, type, method);
                endChange = easing.createProps(rightLightLength, 0, 25, type, method);
                let sChange = easing.createProps(rightLightLength, 76, 94, type, method);
                for(let i = 0; i <=rightLightLength; i++){
                    this.drawEllips({hlp, color: 
                        hsvToHex({hsv: [this.baseColorHSV[0], easing.process(sChange),this.baseColorHSV[2] ]}),
                        from: easing.process(startChange),
                        to: easing.process(endChange), step: 0.1, width: this.width - 20 - i});
                    sChange.time++;
                    startChange.time++;
                    endChange.time++;
                }

                let leftLightLength = 5;
                startChange = easing.createProps(leftLightLength, 130, 90, type, method);
                endChange = easing.createProps(leftLightLength, 270, 140, type, method);
                sChange = easing.createProps(leftLightLength, 76, 94, type, method);
                for(let i = 0; i <=leftLightLength; i++){
                    this.drawEllips({hlp, color: 
                        hsvToHex({hsv: [this.baseColorHSV[0], easing.process(sChange),this.baseColorHSV[2] ]}),
                        from: easing.process(startChange),
                        to: easing.process(endChange), step: 0.1, width: this.width - 15 - i});
                    sChange.time++;
                    startChange.time++;
                    endChange.time++;
                }
            
                let right2LightLength = 5;
                startChange = easing.createProps(right2LightLength, -5, -30, type, method);
                endChange = easing.createProps(right2LightLength, 15, 40, type, method);
                sChange = easing.createProps(right2LightLength, 94, 76,type, method);
                for(let i = 0; i <=right2LightLength; i++){
                    this.drawEllips({hlp, color: 
                        hsvToHex({hsv: [this.baseColorHSV[0], easing.process(sChange),this.baseColorHSV[2] ]}),
                        from: easing.process(startChange),
                        to: easing.process(endChange), step: 0.1, width: this.width -2 - i});
                    sChange.time++;
                    startChange.time++;
                    endChange.time++;
                }
            })
        }

        return this.imgCache[this.width];
    }
}