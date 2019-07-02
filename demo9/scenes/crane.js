class CraneScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: [],
            
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault('#9DD0FF');
    }

    start() {
        this.crane = this.addGo(new Crane({
            position: this.sceneCenter.clone(),
        }))
    }
}

class Crane extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(1,1),
            componentSizes: {
                vSegmentSize: new V2(10,20),
                hSegmentSize: new V2(20, 8),
                hSegmentEnd: new V2(8,8),
                baseSize: new V2(30, 15),
                cabinSize: new V2(10,12),
                weightSize: new V2(20,10),
                caretSize: new V2(10,5),
                hookSize: new V2(10,10)
            },
            images: Object.keys(craneModels).reduce((r,c) => { r[c] = PP.createImage(craneModels[c]); return r }, {}),
            segmentsCount: {
                h: 4,
                v: 3
            }
        }, options)

        super(options);
    }

    init() {
        this.base = this.addChild(new Go({
            renderValuesRound: true,
            size: this.componentSizes.baseSize,
            position: new V2(),
            img: this.images.base
        }));

        this.vStart = new V2().add(new V2(0, -this.componentSizes.baseSize.y/2 - this.componentSizes.vSegmentSize.y/2));
        this.vSegments = [];
        for(let i = 0; i < this.segmentsCount.v; i++){
            if(i > 0)
                this.vStart = this.vStart.add(new V2(0, -this.componentSizes.vSegmentSize.y));

            this.vSegments[i] = this.addChild(new GO({
                renderValuesRound: true,
                position: this.vStart.clone(),
                size: this.componentSizes.vSegmentSize,
                img: this.images.vSegment,
            })) 
        }

        this.ropesSize = new V2(this.componentSizes.hSegmentEnd.x + this.componentSizes.hSegmentSize.x*this.segmentsCount.h, this.componentSizes.vSegmentSize.y - this.componentSizes.hSegmentSize.y);
        this.ropes = this.addChild(new GO({
            renderValuesRound: true,
            position: this.vStart.add(new V2(
                this.componentSizes.vSegmentSize.x/2 - this.ropesSize.x/2, 
                -this.componentSizes.vSegmentSize.y/2 - this.componentSizes.hSegmentEnd.y - this.ropesSize.y/2)),
            size: this.ropesSize,
            img: createCanvas(this.ropesSize, (ctx, size, hlp) => {
                hlp.setFillColor('#030303');
                let pp = new PerfectPixel({context: ctx});
                pp.line(3,size.y-2,size.x-1, 0);
                pp.line(fast.r(size.x*2/3),size.y-2,size.x-1, 0);

                hlp.setFillColor('#E1A32A').rect(0,size.y-1, 3, 1).rect(fast.r(size.x*2/3)-1, size.y-1,3,1);
            }),
        }))

        this.vTopEnd = this.addChild(new GO({
            renderValuesRound: true,
            position: this.vStart.add(new V2(0, -this.componentSizes.vSegmentSize.y)),
            size: this.componentSizes.vSegmentSize,
            img: this.images.vTopEnd,
        }))

        
        this.weight = this.addChild(new GO({
            renderValuesRound: true,
            position: this.vStart.add(new V2(this.componentSizes.vSegmentSize.x/2 + this.componentSizes.weightSize.x/2, -this.componentSizes.vSegmentSize.y/2 - this.componentSizes.hSegmentSize.y/2 + this.componentSizes.weightSize.y/2)),
            size: this.componentSizes.weightSize,
            img: this.images.weight,
        }))

        this.cabinPosition = this.vStart.add(new V2(-this.componentSizes.vSegmentSize.x/3, -this.componentSizes.vSegmentSize.y/3));

        this.hSegments = [];
        this.hStart = this.vStart.add(new V2(-this.componentSizes.hSegmentEnd.y/2, -this.componentSizes.vSegmentSize.y/2 - this.componentSizes.hSegmentEnd.y/2))
        this.hSegments[0] = this.addChild(new GO({
            renderValuesRound: true,
                position: this.hStart.clone(),
                size: this.componentSizes.hSegmentEnd,
                img: this.images.hRightEnd,
        }))

        this.hStart = this.hStart.add(new V2(-this.componentSizes.hSegmentEnd.x/2 - this.componentSizes.hSegmentSize.x/2, 0));
        for(let i = 0; i < this.segmentsCount.h; i++){
            if(i > 0)
                this.hStart = this.hStart.add(new V2(-this.componentSizes.hSegmentSize.x, 0));

            this.hSegments[i+1] = this.addChild(new GO({
                renderValuesRound: true,
                    position: this.hStart.clone(),
                    size: this.componentSizes.hSegmentSize,
                    img: this.images.hSegment,
            }))
        }

        this.hSegments[this.hSegments.length] = this.addChild(new GO({
            renderValuesRound: true,
            position: this.hStart.add(new V2(-this.componentSizes.hSegmentSize.x/2 - this.componentSizes.hSegmentEnd.x/2)),
            size: this.componentSizes.hSegmentEnd,
            img: this.images.hLeftEnd,
        }))

        this.cabin = this.addChild(new GO({
            position: this.cabinPosition,
            size: this.componentSizes.cabinSize,
            renderValuesRound: true,
            img: this.images.cabin,
        }))

        

        this.caret = this.addChild(new GO({
            position: this.vStart.add(new V2(-this.componentSizes.vSegmentSize.x/2 - this.componentSizes.caretSize.x/2 - 5, -this.componentSizes.vSegmentSize.y/2+1)),
            size: this.componentSizes.caretSize,
            renderValuesRound: true,
            img: this.images.caret,
        }));

        this.hook = this.addChild(new GO({
            position: this.caret.position.add(new V2(0, 20)),
            size: this.componentSizes.hookSize,
            renderValuesRound: true,
            img: this.images.hook,
        })); 

        this.hookRopes = this.addChild(new GO({
            position: new V2(),
            size: new V2(1,1),
            renderValuesRound: true,
            init() {
                this.getImage();
            },
            getImage() {

                let left = this.parent.hook.position.x >= this.parent.caret.position.x ? this.parent.caret : this.parent.hook;
                let right = this.parent.hook.position.x >= this.parent.caret.position.x ? this.parent.hook : this.parent.caret;

                this.size = new V2(
                    (right.position.x + right.size.x/2) - (left.position.x - left.size.x/2),
                    (this.parent.hook.position.y - this.parent.hook.size.y/2) - (this.parent.caret.position.y + this.parent.caret.size.y/2)
                );

                this.position = //this.parent.caret.position.add(this.parent.caret.position.direction(this.parent.hook.position).mul(this.parent.caret.position.distance(this.parent.hook.position)/2));
                    new V2(
                        (left.position.x - left.size.x/2) + this.size.x/2,
                        (this.parent.caret.position.y + this.parent.caret.size.y/2) + this.size.y/2
                        )

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor('#030303');
                    if(this.parent.hook.position.x >= this.parent.caret.position.x){
                        pp.line(1, 0, size.x - this.parent.hook.size.x + 1, size.y-1);
                        pp.line(this.parent.caret.size.x - 2, 0, size.x - 2, size.y-1)
                    }
                    else {
                        pp.line(size.x - this.parent.caret.size.x + 1, 0, 1, size.y-1);
                        pp.line(size.x - 1, 0, this.parent.hook.size.x-1, size.y-1)
                    }
                })
            }
        }))
    }

    addVSegment() {
        this.vSegments[this.vSegments.length] = this.addChild(new GO({
            renderValuesRound: true,
            position: this.vSegments[this.vSegments.length-1].position.clone(),
            size: this.componentSizes.vSegmentSize,
            img: this.images.vSegment
        }), false, true);

        let shiftedItems = [
            ...this.hSegments, this.cabin, this.weight, this.vTopEnd, this.vSegments[this.vSegments.length-1], this.ropes,
            this.hook, this.caret,
        ]

        shiftedItems.forEach(x => x.originPosition = x.position.clone());

        this.yChange = easing.createProps(25, 0, -this.componentSizes.vSegmentSize.y, 'quad', 'inOut');
        this.riseTimer = this.regTimerDefault(30, () => {
            let yShift = fast.r(easing.process(this.yChange));

            shiftedItems.forEach(x => {
                x.position.y = x.originPosition.y+yShift;
                x.needRecalcRenderProperties = true;
            });
            this.yChange.time++

            if(this.yChange.time > this.yChange.duration){
                this.yChange = undefined;
                this.unregTimer(this.riseTimer);
                this.riseTimer = undefined;
            }
        })
    }
}