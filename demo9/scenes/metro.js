class Demo9Metro2Scene extends Scene {
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
        this.girl = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            isVisible: true,
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo9Metro2Scene.models.person)
                }));

                this.hairs = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Demo9Metro2Scene.models.hairsFrames),
                    init() {
                        this.currentFrame = 0;
                        this.timer = this.regTimerDefault(100, () => {
                            this.img = this.frames[this.currentFrame++];
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
                    },
                })); 
            }
        }), 5)

        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.colorsCache = {};
                this.hsvMap = [];
               this.framesCount = 40;
                this.frames = new Array(this.framesCount).fill().map((el, i) => this.createFrame(i))

                this.currentFrame = 0;
                this.timer = this.regTimerDefault(100, () => {
                    this.img = this.frames[this.currentFrame++];
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;

                        if(!this.frame){
                            this.frame = this.addChild(new GO({
                                position: new V2(),
                                size: this.size,
                                img: createCanvas(this.size, (ctx, size, hlp) => {
                                    hlp.setFillStyle('red').strokeRect(0,0,size.x, size.y);
                                })
                            }))
                        }
                    }
                })
            },
            createFrame(frameIndex) {

                let tl = new V2(0,0);
                let tr = new V2(this.size.x, 0);
                let bl = new V2(0, this.size.y)
                let br = new V2(this.size.x, this.size.y)
                let pCenter = new V2(78,102);
                let leftLine = {begin: new V2(0,0), end: bl};
                let rightLine = {begin: new V2(this.size.x,0), end: br};
                let topLine = {begin: new V2(0,0), end: new V2(this.size.x, 0)};
                let bottomLine = {begin: new V2(0,this.size.y), end: new V2(this.size.x, 0)};

                
                let maxDistance = fast.r(pCenter.distance(tr));
                let sChange = easing.createProps(maxDistance, 0, 1, 'quad', 'out');
                let vChange = easing.createProps(maxDistance, 0.75, 0, 'expo', 'out');
                
                let upperYShiftChange = easing.createProps(maxDistance, 0, 20, 'linear', 'base');
                let upperXShiftChange = easing.createProps(maxDistance, 0, -40, 'linear', 'base');
                for(let y = -20; y < this.size.y; y++){
                    if(this.hsvMap[y] == undefined)
                        this.hsvMap[y] = new Array(this.size.x).fill({ s: 1, v: 1, default: true, });

                    for(let x = 0; x < this.size.x+40; x++){
                        
                        let d = fast.r(pCenter.distance(new V2(x,y)));
                        if(d > maxDistance)
                            d = maxDistance;

                        sChange.time = d;
                        vChange.time = d;

                        upperYShiftChange.time = d;
                        upperXShiftChange.time = d;
                        let xShift = fast.r(easing.process(upperXShiftChange))
                        let yShift = fast.r(easing.process(upperYShiftChange))
                        if(this.hsvMap[y+yShift] == undefined){
                            this.hsvMap[y+yShift] = new Array(this.size.x).fill({ s: 1, v: 1, default: true, });
                        }

                        this.hsvMap[y+yShift][x+xShift] = {
                            s: fast.r(easing.process(sChange),2),
                            v: fast.r(easing.process(vChange),2)
                        }
                    }
                }

                for(let y = 0; y < this.size.y; y++){
                    for(let x = 0; x < this.size.x/2; x++){
                        if(this.hsvMap[y][x].default && !this.hsvMap[y][x+1].default){
                            this.hsvMap[y][x] = {
                                s: this.hsvMap[y][x+1].s, v: this.hsvMap[y][x+1].v
                            }
                        }

                    }
                }

                for(let x = 0; x < this.size.x; x++){
                    for(let y = 0; y < this.size.y; y++){
                        if(this.hsvMap[y][x].default && !this.hsvMap[y+1][x].default){
                            this.hsvMap[y][x] = {
                                s: this.hsvMap[y+1][x].s, v: this.hsvMap[y+1][x].v
                            }
                        }

                    }
                }

                return createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillStyle('#533B1B').rect(0,0,size.x, size.y);

                    let fillStyleProvider = (color, x,y, roundPrecision = 1) => {
                        if(!this.colorsCache[color]){
                            this.colorsCache[color] = colors.hexToHsv(color);
                        }

                        let hsv = this.colorsCache[color];
                        if(this.hsvMap[y] == undefined)
                            return color;
                            
                        let changeData = this.hsvMap[y][x];
                        if(changeData == undefined)
                            return color;//'rgba(255,0,0,1)';

                        let v = hsv.v + (1-hsv.v)*changeData.v;

                        return hsvToHex({ hsv: { h: hsv.h, s: fast.r(changeData.s*hsv.s,roundPrecision), v: v }, hsvAsObject: true, hsvAsInt: false });
                    }

                    let pp = new PerfectPixel({ctx});
                    //pp.setFillStyle('#533B1B');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#533B1B',x,y);
                    }
                    
                    pp.fillByCornerPoints([tl, tr, br, bl])
                    pp.fillStyleProvider = undefined;

                    

                    let refCircleCenter = new V2(31, 108);
                    
                    let steps = 5;
                    let totalSteps = this.framesCount*steps;


                    let circleRadiusChange = easing.createProps(totalSteps, 0, fast.r(size.divide(2).distance(new V2(size.x, 0))*1.1), 'quad', 'in');
                    let cOriginYShiftChange = easing.createProps(totalSteps, 0, 20, 'quad', 'in');
                    let cOriginXShiftChange = easing.createProps(totalSteps, 0, -40, 'quad', 'in');
                    let circlesAChange = easing.createProps(totalSteps, 0.1, 1, 'quad', 'in');

                    let detailLenChange = easing.createProps(totalSteps, 1, 20, 'quad', 'in');
                    let detailTarget = new V2(48, 0);
                    let detailDirection = pCenter.direction(detailTarget);
                    let detailDistance = pCenter.distance(detailTarget);
                    let detailDistanceChange = easing.createProps(totalSteps, 0, detailDistance, 'quad', 'in');

                    let detailLenChange1 = easing.createProps(totalSteps, 1, 20, 'quad', 'in');
                    let detailTarget1 = new V2(0, 80);
                    let detailDirection1 = pCenter.direction(detailTarget1);
                    let detailDistance1 = pCenter.distance(detailTarget1);
                    let detailDistanceChange1 = easing.createProps(totalSteps, 0, detailDistance1, 'quad', 'in');
                    
                    hlp.setFillStyle('#3A2916')
                    for(let i =0; i <= steps; i++){ 
                        let currentStep = i*this.framesCount+frameIndex;
                        circleRadiusChange.time = currentStep;
                        cOriginYShiftChange.time = currentStep;
                        cOriginXShiftChange.time = currentStep;
                        circlesAChange.time = currentStep;

                        let r = fast.r(easing.process(circleRadiusChange));
                        let yShift = fast.r(easing.process(cOriginYShiftChange));
                        let xShift = fast.r(easing.process(cOriginXShiftChange));
                        let cOrigin = new V2(pCenter.x + xShift, pCenter.y + yShift);
                        let a = fast.r(easing.process(circlesAChange),2);
                        let hex = fillStyleProvider('#443016', cOrigin.x + r, cOrigin.y );
                        let circlesColorRgb = hexToRgb(hex, false, true);

                        hlp.setFillStyle(colors.rgbToString({value: circlesColorRgb, isObject:true, opacity:1}));
                        hlp.strokeEllipsis(0,360, 0.1, cOrigin, r, r);

                        detailLenChange.time = currentStep;
                        detailDistanceChange.time = currentStep;
                        let len = fast.r(easing.process(detailLenChange));
                        let p = pCenter.add(detailDirection.mul(easing.process(detailDistanceChange))).toInt();
                        pp.lineV2(p, p.add(detailDirection.mul(len)).toInt());

                        // detailLenChange1.time = currentStep;
                        // detailDistanceChange1.time = currentStep;
                        // len = fast.r(easing.process(detailLenChange1));
                        // p = pCenter.add(detailDirection1.mul(easing.process(detailDistanceChange)*1.2)).toInt();
                        // pp.fillStyleProvider = (x,y) => {
                        //     return fillStyleProvider('#443016',x,y,2);
                        // }
                        // pp.lineV2(p, p.add(detailDirection1.mul(len)).toInt());
                        // pp.fillStyleProvider = undefined;
                    }

                    

                    
                    //pp.setFillStyle('#1E0E05');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#1E0E05',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(199,129), pCenter, new V2(199,146)])

                    //pp.setFillStyle('#1E0E05');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#1E0E05',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(0,109), pCenter, new V2(0,113)])

                    //pp.setFillStyle('#0A0703');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#0A0703',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(66,199), pCenter, new V2(165,199)])
                    pp.fillStyleProvider = undefined;
                    //лестница
                    let stairsTargetPoint = new V2(71,199);
                    let stairsTargetWidth = 82;
                    let stairsDistance = pCenter.distance(stairsTargetPoint);
                    let stairsDir = pCenter.direction(stairsTargetPoint);
                    let stairsCount = 25;
                    let stairsDistChange = easing.createProps(stairsCount, 0, stairsDistance, 'cubic', 'in');
                    let stairsWidthChange = easing.createProps(stairsCount, 0, stairsTargetWidth, 'quad', 'in');
                    for(let i = 0; i <= stairsCount; i++){
                        stairsDistChange.time = i;
                        stairsWidthChange.time = i;
                        let d = easing.process(stairsDistChange);
                        let w = fast.r(easing.process(stairsWidthChange));

                        let p = pCenter.add(stairsDir.mul(d)).toInt();
                        hlp.setFillStyle(fillStyleProvider('#49341F',p.x,p.y,2)).rect(p.x, p.y, w, 1)
                    }

                    let drawVLines = ({targetPoint, secondPoint, additionalLines, baseColor, dir2Multiplier}) => {
                        let vLinesCount1 = 5;
                        let totalLinesSteps = this.framesCount*vLinesCount1;
                        let dir1 = pCenter.direction(targetPoint);
                        let dir2 = pCenter.direction(secondPoint);
                        let distance1 = fast.r(pCenter.distance(targetPoint));
                        let distanceChange = easing.createProps(totalLinesSteps, 0,distance1, 'quad', 'in');
                        for(let i = 0; i <= vLinesCount1; i++){
                            for(let j = 0; j < additionalLines; j++){
                                let currentStep = fast.r((i*this.framesCount + this.framesCount*j/additionalLines)+frameIndex);
                                distanceChange.time = currentStep;
                                let d = fast.r(easing.process(distanceChange));
                                //let color = fillStyleProvider(baseColor,x,y,2)
                                //pp.setFillStyle(color)//pp.setFillStyle('#382814');
                                pp.fillStyleProvider = (x,y) => {
                                    return fillStyleProvider(baseColor,x,y,2);
                                }
                                pp.lineV2(pCenter.add(dir1.mul(d)).toInt(), pCenter.add(dir2.mul(d*dir2Multiplier)).toInt())
                            }
                            
                        }
                    }

                    let drawHLines = ({targetPoint, targetWidth, baseColor}) => {
                        let hLinesCount = 5;
                        let totalLinesSteps = this.framesCount*hLinesCount;
                        let dir1 = pCenter.direction(targetPoint);
                        let distance1 = fast.r(pCenter.distance(targetPoint));
                        let distanceChange = easing.createProps(totalLinesSteps, 0,distance1, 'quad', 'in');
                        let widthChange = easing.createProps(totalLinesSteps, 0,targetWidth, 'quad', 'in');
                        for(let i = 0; i <= hLinesCount; i++){
                            let currentStep = fast.r((i*this.framesCount)+frameIndex);
                            distanceChange.time = currentStep;
                            widthChange.time = currentStep;
                            let p = pCenter.add(dir1.mul( fast.r(easing.process(distanceChange)))).toInt();
                            hlp.setFillStyle(fillStyleProvider(baseColor,p.x,p.y,2)).rect(p.x,p.y, fast.r(easing.process(widthChange)), 1);
                        }
                    }

                    
                    //pp.setFillStyle('#592913');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#592913',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(0,112), pCenter, new V2(0,122)])

                    //drawHLines({ targetPoint: new V2(-50,119), targetWidth: 50, baseColor: '#492110' })

                    //pp.setFillStyle('#382416');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#382416',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(0,119), pCenter, new V2(0,147)])
                    pp.fillStyleProvider = undefined;
                    //вертиклаьные линии - слева
                    drawVLines({targetPoint:new V2(0,134), secondPoint: new V2(0,119), additionalLines: 2, baseColor: '#26180F', dir2Multiplier: 0.95});

                    //pp.setFillStyle('#592913');
                    pp.fillStyleProvider = (x,y) => {
                            return fillStyleProvider('#592913',x,y,2);
                        }
                    pp.fillByCornerPoints([new V2(0,141), pCenter, new V2(41,199), bl])
                    
                    drawHLines({ targetPoint: raySegmentIntersectionVector2(pCenter, pCenter.direction(new V2(0,141)),{begin: new V2(-size.x,this.size.y), end: new V2(0, this.size.y)}), targetWidth: 150, baseColor: '#492110' })


                    //pp.setFillStyle('#382416');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#382416',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(42,199), pCenter, new V2(70,199)])
                    pp.fillStyleProvider = undefined;
                    //вертиклаьные линии - цетр слева
                    drawVLines({targetPoint:new V2(43,199), secondPoint: new V2(70,199), additionalLines: 2, baseColor: '#26180F', dir2Multiplier: 2.2});

                    //pp.setFillStyle('#382416');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#382416',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(199,163), pCenter, new V2(154,199), br])
                    pp.fillStyleProvider = undefined;
                    //вертиклаьные линии - цетр справа
                    drawVLines({targetPoint:new V2(199,163), secondPoint: new V2(154,199), additionalLines: 2, baseColor: '#26180F', dir2Multiplier: 1.3})

                    //pp.setFillStyle('#592913');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#592913',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(199, 139), pCenter, new V2(199,162)])

                    drawHLines({ targetPoint: new V2(199,151), targetWidth: 50, baseColor: '#492110' })

                    //pp.setFillStyle('#382814');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#382814',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(28, 199), pCenter, new V2(42,199)])

                    //pp.setFillStyle('#1D1509');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#1D1509',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(8, 199), pCenter, new V2(33,199)])

                    //pp.setFillStyle('#090603');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#090603',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(28, 199), pCenter, new V2(33,199)])

                    //pp.setFillStyle('#1D1509');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#1D1509',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(0, 135), pCenter, new V2(0,144)])

                    //pp.setFillStyle('#090603');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#090603',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(0, 140), pCenter, new V2(0,144)])


                    //pp.setFillStyle('#1D1509');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#1D1509',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(199, 151), pCenter, new V2(199,157)])

                    //pp.setFillStyle('#090603');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#090603',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(199, 162), pCenter, new V2(199,158)])

                    //pp.setFillStyle('#090603');
                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#090603',x,y,2);
                    }
                    pp.fillByCornerPoints([new V2(0, 117), pCenter, new V2(0,118)])

                    pp.fillStyleProvider = (x,y) => {
                        return fillStyleProvider('#26180F',x,y,2);
                    }
                    pp.lineV2(new V2(42,199), pCenter)
                    pp.lineV2(new V2(70,199), pCenter)
                    pp.lineV2(new V2(199,163), pCenter)
                    pp.lineV2(new V2(153,199), pCenter)
                })
            }

        }))
    }
}