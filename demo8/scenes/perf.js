class PerfScene extends Scene {
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
        this.backgroundRenderDefault('#7F7F7F');
    }

    getImage(width, angle, fillColor = '#ffffff',strokeColor = '#7F7F7F'){
        let key = width*1000 + angle;
        if(!this.imgCache[key]){
            let model  = this.getDefaultModel();
            let originalCenter = new V2(model.general.size.x/2, model.general.size.y/2);
            model.general.originalSize.x = width;
            model.general.originalSize.y = width;
            model.general.size.x = width;
            model.general.size.y = width;
            model.main.layers[0].strokeColor = strokeColor;
            model.main.layers[0].fillColor = fillColor;
            let newCenter = new V2(model.general.size.x/2, model.general.size.y/2);

            model.main.layers[0].points.forEach(p => {
                let point = p.point;
                if(point.x < originalCenter.x){
                    point.x = fastRoundWithPrecision(model.general.size.x/4);
                }
                else {
                    point.x = fastRoundWithPrecision(model.general.size.x*3/4);
                }

                if(point.y < originalCenter.y){
                    point.y = fastRoundWithPrecision(model.general.size.y/4);
                }
                else {
                    point.y = fastRoundWithPrecision(model.general.size.y*3/4);
                }

                if(angle != 0){
                    let v2 = new V2(point);
                    v2.add(newCenter.mul(-1), true).rotate(angle, false, true).add(newCenter, true);
    
                    point.x = fastRoundWithPrecision(v2.x);
                    point.y = fastRoundWithPrecision(v2.y);
                }
            });

            this.imgCache[key] = PP.createImage(model);
        }

        return this.imgCache[key];
    }

    getDefaultModel() {
        return {"general":{"originalSize":{"x":40,"y":40},"size":{"x":40,"y":40},"zoom":5,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#7F7F7F","fillColor":"#ffffff","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":10}},{"point":{"x":30,"y":10}},{"point":{"x":30,"y":30}},{"point":{"x":10,"y":30}}]}]}};
    }

    circle(radius, width, step = 1, shift, fillColor, strokeColor, layer = 0, levitationAmount = 1) {
        let angle = (layer % 2 == 0 ? 0: 7.5);
        let brp = new RenderProperties();
        let size = new V2(width, width);
        this.circles[layer] = [];
        while(angle < 360){
            let position = new V2(radius, 0).rotate(angle, false).add(shift)
            position.x = fastRoundWithPrecision(position.x);
            position.y = fastRoundWithPrecision(position.y);
            let box = new Box(position.add(size.mul(-0.5)), size, brp);
            if(SCG.viewport.logical.isIntersectsWithBox(box)){
                this.circles[layer].push(this.addGo(new GO({
                    renderValuesRound: true,
                    position,
                    size: size,
                    img: this.getImage(width, angle, fillColor, strokeColor),
                    angle,
                    layer,
                    levitationAmount,
                    direction: position.direction(this.sceneCenter),
                    startMove() {
                        this.moveChange = easing.createProps(20, 0, this.levitationAmount, 'quad', 'inOut');
                        this.origignChange = this.moveChange.change;
                        this.count = 3;
                        this.originalPosition = this.position.clone();
                        this.initialPosition = this.position.clone();

                        this.timer = this.registerTimer(createTimer(30, () => {
                            let l = easing.process(this.moveChange);

                            this.position = this.originalPosition.add(this.direction.mul(l));
                            this.needRecalcRenderProperties = true;
                            this.moveChange.time++;

                            if(this.moveChange.time > this.moveChange.duration){
                                this.count--;
                                if(this.count == 0){
                                    this.unregTimer(this.timer);
                                    this.timer = undefined;
                                    this.position = this.initialPosition.clone();
                                    this.needRecalcRenderProperties = true;
                                    return;
                                }

                                this.moveChange.time = 0;
                                
                                if(this.count  == 2)
                                    this.moveChange.change = -this.origignChange*2;
                                
                                if(this.count  == 1)
                                    this.moveChange.change =this.origignChange;

                                // if(this.count  == 1)
                                //     this.moveChange.change *=-1;

                                this.originalPosition = this.position.clone();
                            }

                        }, this, true));
                    }
                }), layer+10));
            }
            
            angle+=step;
        }
    }

    start(){
        this.addGo(new GO({
            position: this.sceneCenter, 
            size: new V2(20,20),
            img: createCanvas(new V2(1,1), (_, __, hlp) => { hlp.setFillColor('black').dot(0,0) })
        }))

        this.circles = [];
        this.step = 15;
        this.layersCount = 30;
        let colorVChange = easing.createProps(this.layersCount, 65, 100, 'quad', 'in');
        let widthChange = easing.createProps(this.layersCount, 5, 120, 'quad', 'in');
        let rMultiplierChange = easing.createProps(this.layersCount, 0.025, 0.9, 'quad', 'in');
        let lChange = easing.createProps(this.layersCount,1, 7, 'quad', 'in');
        //let stepChange = easing.createProps(this.layersCount, 15, 15, 'quad', 'in');

        this.totalCount = 0;

        for(let i = 0; i <= this.layersCount; i++){
            colorVChange.time = i;
            widthChange.time = i;
            rMultiplierChange.time = i;
            lChange.time = i;
            //stepChange.time = i;

            let colorV = Math.floor(easing.process(colorVChange)/5)*5;
            let width = easing.process(widthChange);
            let rMul = easing.process(rMultiplierChange);
            let l = easing.process(lChange);
            //let step = easing.process(stepChange);

            this.circle(this.viewport.x*rMul, width, this.step, this.sceneCenter, hsvToHex({hsv:[0,0,colorV]}), hsvToHex({hsv:[0,0,colorV-30]}), i, l);
        }

        


        this.currentLevitatingLayerIndex = 0
        this.triggersCount = 10;
        this.timer = this.registerTimer(createTimer(75, () => {
            this.circles[this.currentLevitatingLayerIndex++].forEach(x => x.startMove());
            if(this.currentLevitatingLayerIndex == this.circles.length){
                this.currentLevitatingLayerIndex = 0;
                this.triggersCount--;
                if(this.triggersCount == 0){
                    this.unregTimer(this.timer);
                }
            }
                 

            

            
        }, this, false));
        
    }
}