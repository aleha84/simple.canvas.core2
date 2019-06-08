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

    start() {
        this.spiderBodySize = new V2(30,10);
        this.spiderLegSize = new V2(8, 15);
        this.spiderHeadSize = new V2(10,10);

        this.spiderBodyImg =  PP.createImage({"general":{"originalSize":{"x":30,"y":10},"size":{"x":30,"y":10},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#626260","fillColor":"#626260","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":22,"y":9}},{"point":{"x":3,"y":9}},{"point":{"x":0,"y":7}},{"point":{"x":0,"y":4}},{"point":{"x":1,"y":2}},{"point":{"x":27,"y":0}},{"point":{"x":29,"y":2}},{"point":{"x":29,"y":6}}]},{"order":1,"type":"lines","strokeColor":"#75746F","fillColor":"#75746F","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":29,"y":2}},{"point":{"x":29,"y":6}},{"point":{"x":25,"y":8}},{"point":{"x":25,"y":4}}]},{"order":2,"type":"lines","strokeColor":"#b7b7b5","fillColor":"#b7b7b5","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":26,"y":0}},{"point":{"x":22,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":1,"y":1}},{"point":{"x":14,"y":1}},{"point":{"x":24,"y":1}}]},{"order":3,"type":"lines","strokeColor":"#F2F2F2","fillColor":"#F2F2F2","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":27,"y":0}},{"point":{"x":29,"y":1}},{"point":{"x":25,"y":4}},{"point":{"x":24,"y":2}}]}]}})
        // createCanvas(this.spiderBodySize, (ctx, size, hlp) =>{
        //     hlp.setFillColor('white').rect(0,0, size.x, size.y);
        // })

        this.spiderFrontalLegImg = PP.createImage({"general":{"originalSize":{"x":8,"y":15},"size":{"x":8,"y":15},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#4B4C50","fillColor":"#4B4C50","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":1,"y":9}},{"point":{"x":1,"y":13}},{"point":{"x":0,"y":14}},{"point":{"x":6,"y":14}},{"point":{"x":5,"y":13}},{"point":{"x":5,"y":9}}]},{"order":1,"type":"lines","strokeColor":"#83827D","fillColor":"#83827D","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":5,"y":9}},{"point":{"x":5,"y":13}},{"point":{"x":6,"y":14}}]},{"order":2,"type":"lines","strokeColor":"#4D4E50","fillColor":"#4D4E50","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":2,"y":8}},{"point":{"x":2,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":6,"y":9}},{"point":{"x":5,"y":8}}]},{"order":3,"type":"lines","strokeColor":"#92938E","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":6,"y":0}},{"point":{"x":6,"y":10}}]},{"order":4,"type":"lines","strokeColor":"#404142","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":2,"y":8}},{"point":{"x":5,"y":8}}]}]}})
        // createCanvas(this.spiderLegSize, (ctx, size, hlp) =>{
        //     hlp.setFillColor('#D3D3D3').rect(0,0, size.x, size.y);
        // })

        this.spiderBackLegImg = PP.createImage({"general":{"originalSize":{"x":8,"y":15},"size":{"x":8,"y":15},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#4B4C50","fillColor":"#4B4C50","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":2,"y":9}},{"point":{"x":2,"y":13}},{"point":{"x":1,"y":14}},{"point":{"x":7,"y":14}},{"point":{"x":6,"y":13}},{"point":{"x":6,"y":9}}]},{"order":1,"type":"lines","strokeColor":"#83827D","fillColor":"#83827D","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":6,"y":9}},{"point":{"x":6,"y":13}},{"point":{"x":7,"y":14}}]},{"order":2,"type":"lines","strokeColor":"#4D4E50","fillColor":"#4D4E50","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":1,"y":10}},{"point":{"x":1,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":5,"y":10}},{"point":{"x":4,"y":10}}]},{"order":3,"type":"lines","strokeColor":"#92938E","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":5,"y":0}},{"point":{"x":5,"y":10}}]},{"order":4,"type":"lines","strokeColor":"#404142","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":2,"y":11}},{"point":{"x":5,"y":11}}]}]}})
        // createCanvas(this.spiderLegSize, (ctx, size, hlp) =>{
        //     hlp.setFillColor('#A5A5A5').rect(0,0, size.x, size.y);
        // })

        this.spiderHeadImg = createCanvas(this.spiderLegSize, (ctx, size, hlp) =>{
            hlp.setFillColor('#CE8888').rect(0,0, size.x, size.y);
        })

        this.spider = this.addGo(new SimpleSpider({
            position: this.sceneCenter.clone(),
            bodyImg: this.spiderBodyImg,
            frontalLegImg: this.spiderFrontalLegImg,
            backLegImg: this.spiderBackLegImg,
            headImg: this.spiderHeadImg,
            bodySize: this.spiderBodySize,
            legSize: this.spiderLegSize,
            headSize: this.spiderHeadSize
        }))
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
                    position: new V2(0,-5),
                    img: this.parent.headImg,
                    size: this.parent.headSize,
                    renderValuesRound: true
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