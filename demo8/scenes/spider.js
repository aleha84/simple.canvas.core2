class SpiderScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                additional: [],
            },

        }, options)

        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    createTopImage(hsv) {
        return createCanvas(this.sSize, (ctx, size) => {

            ctx.fillStyle = hsvToHex({hsv});
            let pp = new PerfectPixel({context: ctx});
            for(let i = this.shift; i < size.x;i++){
                pp.lineV2(new V2(i, 0), new V2(i - this.shift, size.y-1));
            }
        });
    }

    start() {
        this.rows = 8;
        this.columns = 15;
        this.angle = 40;
        this.sHeight = 8;
        this.rHeight = 30;
        this.baseColorHSV = [202,14,76];

        this.sWidth = this.sHeight;
        this.shift = fastRoundWithPrecision(this.sHeight*Math.tan(degreeToRadians(this.angle)));
        this.sSize = new V2(this.sWidth+ 2*this.shift, this.sHeight);
        this.rSize = new V2(this.shift, this.rHeight)
        this.topImg = this.createTopImage(this.baseColorHSV);
        let hsvGrayLighter = [...this.baseColorHSV];
        hsvGrayLighter[2]+=4;
        this.topImgElevated = this.createTopImage(hsvGrayLighter);

        this.rightImg = createCanvas(this.rSize, (ctx, size) => {
            ctx.fillStyle = '#CDDBF6'; 
            let pp = new PerfectPixel({context: ctx});
            for(let i = this.sSize.y; i < size.y; i++){
                pp.lineV2(new V2(0, i), new V2(size.x+1, i - this.sSize.y));
            }
        });

        this.rustTopImg = this.createTopImage([15,97,49]);
        this.rustTopLighterImg = this.createTopImage([15,97,55]);

        this.rustTop2Img = this.createTopImage([15,63,77]);
        this.rustTop2LighterImg = this.createTopImage([15,63,82]);
        this.frontImg = createCanvas(new V2(1,1), ctx => {
            ctx.fillStyle = '#8A98A0'; ctx.fillRect(0,0,1,1);
        })

        this.globalYShift = 10;
        this.globalXShift = 30;

        this.segments = [];
        this.blocksSpeed = -0.2

        for(let r = 0; r < this.rows; r++){ //
            this.segments[r] = [];
            for(let c = this.columns-1; c >=0 ; c--){ //
                this.segments[r][c] = this.addGo(new ProjectedCube({
                    position: this.sceneCenter.add(
                        new V2(
                            -0.0*r -this.sSize.x *this.columns/2 + (this.sSize.x - this.shift)*c +  (this.rows - r - 1)*this.sHeight*Math.tan(degreeToRadians(this.angle)) + this.globalXShift, 
                            -this.rows*this.sHeight/2 + this.sHeight*r + this.globalYShift)),
                    size: this.sSize,
                    topImg: this.topImg, 
                    rightImg: this.rightImg,
                    frontImg: this.frontImg,
                    topImgElevated: this.topImgElevated,
                    sWidth: this.sWidth,
                    rSize: new V2(this.shift, this.rHeight),
                    index: new V2(c,r),
                  }), 0 + r)
            }
        }


        this.spiderBodySize = new V2(30,10);
        this.spiderLegSize = new V2(8, 15);
        this.spiderHeadSize = new V2(22,8);

        this.spiderBodyImg =  PP.createImage(spiderSceneImages.spiderBodyImg)

        this.spiderFrontalLegImg = PP.createImage(spiderSceneImages.spiderFrontalLegImg)

        this.spiderBackLegImg = PP.createImage(spiderSceneImages.spiderBackLegImg)

        this.spiderHeadImg = PP.createImage(spiderSceneImages.spiderHeadImg)

        this.spider = this.addGo(new SimpleSpider({
            position: this.sceneCenter.clone(),
            bodyImg: this.spiderBodyImg,
            frontalLegImg: this.spiderFrontalLegImg,
            backLegImg: this.spiderBackLegImg,
            headImg: this.spiderHeadImg,
            bodySize: this.spiderBodySize,
            legSize: this.spiderLegSize,
            headSize: this.spiderHeadSize
        }), 100);

        this.blockTimer = this.registerTimer(createTimer(30, () => {
            for(let r = 0; r < this.segments.length; r++){ //
                for(let c = this.segments[r].length-1; c >=0 ; c--){
                    let block = this.segments[r][c];
                    block.position.x+=this.blocksSpeed;
                    block.needRecalcRenderProperties = true;

                    if((this.sceneCenter.x -  block.position.x) > 100){
                        block.setDead();
                        this.segments[r].splice(c,1);
                    }
                }

                if(this.segments[r].length < this.columns){
                    let last = this.segments[r][this.segments[r].length-1];
                    let preLast = this.segments[r][this.segments[r].length-2];
    
                    let xDelta = last.position.x - preLast.position.x;
    
                    this.segments[r][this.segments[r].length] = new ProjectedCube({
                        position: new V2(last.position.x + xDelta, last.position.y),
                        size: this.sSize,
                        topImg: this.topImg, 
                        rightImg: this.rightImg,
                        frontImg: this.frontImg,
                        topImgElevated: this.topImgElevated,
                        sWidth: this.sWidth,
                        rSize: new V2(this.shift, this.rHeight),
                        index: new V2(this.segments[r].length,r),
                      });

                      this.clearGo(r);

                      for(let c = this.segments[r].length-1; c >=0 ; c--){
                          this.addGo(this.segments[r][c], r);
                      }
                }
            }
        }, this, true));
    }
}

class SimpleSpider extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(100,100)
        }, options)

        super(options);
    }

    init() {
        

        this.legs = {};
        this.legs.ul = this.addChild(new GO({
            position: new V2(-5,1),
            img: this.backLegImg,
            size: this.legSize,
            renderValuesRound: true
        }));
        this.legs.ur = this.addChild(new GO({
            position: new V2(11,1),
            img: this.backLegImg,
            size: this.legSize,
            renderValuesRound: true
        }))

        this.body = this.addChild(new GO({
            position: new V2(0,0),
            img: this.bodyImg,
            size: this.bodySize,
            renderValuesRound: true,
            init() {

                this.head = this.addChild(new GO({
                    position: new V2(0,-8.5),
                    img: this.parent.headImg,
                    size: this.parent.headSize,
                    renderValuesRound: true
                }))

                this.sp1 = this.addChild(new GO({
                    renderValuesRound: true,
                    position: new V2(0,-9),
                    size: new V2(10,12),
                    img: PP.createImage(spiderSceneImages.sp1Img)
                }))

                this.yChange = easing.createProps(20, this.position.y, this.position.y+1, 'quad', 'inOut');
                this.timer1 = this.registerTimer(createTimer(30, () => {
                    this.position.y = (easing.process(this.yChange));
                    this.yChange.time++;

                    if(this.yChange.time > this.yChange.duration){
                        this.yChange.startValue = this.position.y;
                        this.yChange.time = 0;
                        this.yChange.change*=-1;
                    }
                }));
            }
        }))

        this.legs.bl = this.addChild(new GO({
            position: new V2(-15,7),
            img: this.frontalLegImg,
            size: this.legSize,
            renderValuesRound: true
        }));
        this.legs.br = this.addChild(new GO({
            position: new V2(5,7),
            img: this.frontalLegImg,
            size: this.legSize,
            renderValuesRound: true
        }))

        this.startSequence();
    }

    startSequence() {
        this.script.items = [
            function(){
                let yChangeUR = easing.createProps(20, this.legs.ur.position.y, this.legs.ur.position.y-3, 'quad', 'out');
                let yChangeBL = easing.createProps(20, this.legs.bl.position.y, this.legs.bl.position.y-5, 'quad', 'out');

                let xChangeUR = easing.createProps(40, this.legs.ur.position.x, this.legs.ur.position.x+2, 'linear', 'base');
                let xChangeBL = easing.createProps(40, this.legs.bl.position.x, this.legs.bl.position.x+3, 'linear', 'base');

                let xChangeUL = easing.createProps(40, this.legs.ul.position.x, this.legs.ul.position.x-2, 'linear', 'base');
                let xChangeBR = easing.createProps(40, this.legs.br.position.x, this.legs.br.position.x-3, 'linear', 'base');

                this.timer1 = this.registerTimer(createTimer(30, () => {
                    this.legs.ur.position.y = (easing.process(yChangeUR));
                    this.legs.bl.position.y = (easing.process(yChangeBL));

                    this.legs.ur.position.x = (easing.process(xChangeUR));
                    this.legs.bl.position.x = (easing.process(xChangeBL));

                    this.legs.ul.position.x = (easing.process(xChangeUL));
                    this.legs.br.position.x = (easing.process(xChangeBR));

                    this.needRecalcRenderProperties = true;

                    yChangeUR.time++;
                    yChangeBL.time++;
                    xChangeUR.time++;
                    xChangeBL.time++;
                    xChangeUL.time++;
                    xChangeBR.time++;
                    if(yChangeUR.time > yChangeUR.duration){
                        if(yChangeUR.change < 0){
                            yChangeUR.startValue = this.legs.ur.position.y;
                            yChangeUR.time = 0;
                            yChangeUR.method = 'in';
                            yChangeUR.change*=-1;

                            yChangeBL.startValue = this.legs.bl.position.y;
                            yChangeBL.time = 0;
                            yChangeBL.method = 'in';
                            yChangeBL.change*=-1;
                        }
                        else {
                            this.unregTimer(this.timer1);
                            this.processScript();
                        }
                    }

                }, this, true));
            },
            function(){
                let yChangeUL = easing.createProps(20, this.legs.ul.position.y, this.legs.ul.position.y-3, 'quad', 'out');
                let yChangeBR = easing.createProps(20, this.legs.br.position.y, this.legs.br.position.y-5, 'quad', 'out');

                let xChangeUR = easing.createProps(40, this.legs.ur.position.x, this.legs.ur.position.x-2, 'linear', 'base');
                let xChangeBL = easing.createProps(40, this.legs.bl.position.x, this.legs.bl.position.x-3, 'linear', 'base');

                let xChangeUL = easing.createProps(40, this.legs.ul.position.x, this.legs.ul.position.x+2, 'linear', 'base');
                let xChangeBR = easing.createProps(40, this.legs.br.position.x, this.legs.br.position.x+3, 'linear', 'base');

                this.timer1 = this.registerTimer(createTimer(30, () => {
                    this.legs.ul.position.y = (easing.process(yChangeUL));
                    this.legs.br.position.y = (easing.process(yChangeBR));

                    this.legs.ur.position.x = (easing.process(xChangeUR));
                    this.legs.bl.position.x = (easing.process(xChangeBL));

                    this.legs.ul.position.x = (easing.process(xChangeUL));
                    this.legs.br.position.x = (easing.process(xChangeBR));

                    this.needRecalcRenderProperties = true;

                    yChangeUL.time++;
                    yChangeBR.time++;

                    xChangeUR.time++;
                    xChangeBL.time++;

                    xChangeUL.time++;
                    xChangeBR.time++;
                    if(yChangeUL.time > yChangeUL.duration){
                        if(yChangeUL.change < 0){
                            yChangeUL.startValue = this.legs.ul.position.y;
                            yChangeUL.time = 0;
                            yChangeUL.method = 'in';
                            yChangeUL.change*=-1;

                            yChangeBR.startValue = this.legs.br.position.y;
                            yChangeBR.time = 0;
                            yChangeBR.method = 'in';
                            yChangeBR.change*=-1;
                        }
                        else {
                            this.unregTimer(this.timer1);
                            this.processScript();
                        }
                    }
                }, this, true));
            },
            function() {
                this.startSequence();
            }
        ];

        this.processScript();
    }
}