class EpskaVerse1Part3Scene extends Scene {
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
        this.backgroundRenderDefault('#112226');
    }

    start(){
        this.heroPositionTL = new V2(150,75)
        this.heroSize = new V2(115,90);
        this.heroPosition = this.heroPositionTL.add(this.heroSize.divide(2));

        this.background = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#373326').rect(52,0,17,size.y)
                    
                    let hChange = easing.createProps(17,34,12,'quad','out');
                    hlp.setFillColor('rgba(0,0,0,0.1)')
                    for(let i = 0; i < 17; i++){
                        hChange.time = i;
                        let h = fast.r(easing.process(hChange));
                        hlp.rect(52+i, 0, 1, h);
                        hlp.rect(52+i, 0, 1, h*2);
                        hlp.rect(52+i, 0, 1, h*3);
                    }
                    
                    hlp.setFillColor('rgba(0,0,0,0.2)').rect(52, 0, 2, size.y).rect(52, 0, 1, size.y)
                    .setFillColor('#343830').rect(65, 0, 4, size.y)
                    .setFillColor('#040605').rect(69,0,17,size.y)
                    .setFillColor('rgba(255,255,255,0.05)').rect(68,0,2,size.y).rect(85,0,1,size.y)
                    .setFillColor('#3C392D').rect(201,0,8,size.y)
                    
                    hlp.setFillColor('rgba(0,0,0,0.1)')
                    hChange = easing.createProps(8,17,10,'quad','out');
                    for(let i = 0; i < 8; i++){
                        hChange.time = i;
                        let h = fast.r(easing.process(hChange));
                        hlp.rect(201+i, 0, 1, h);
                        hlp.rect(201+i, 0, 1, h*2);
                        hlp.rect(201+i, 0, 1, h*3);
                    }
                    
                    hlp.setFillColor('rgba(0,0,0,0.2)').rect(201, 0, 1, size.y)
                    .setFillColor('#060909').rect(209,0,70,size.y)
                    .setFillColor('rgba(255,255,255,0.05)').rect(208,0,2,size.y)
                    .setFillColor('#141D24').rect(273,0,12,size.y)
                    .setFillColor('#010101').rect(285,0,15,size.y)
                    .setFillColor('rgba(1,65,95,0.15)').rect(0,0,278,size.y)
                    .setFillColor('#01415F').rect(278,0,1,size.y);

                    let pp = new PerfectPixel({ctx});
                    pp.setFillStyle('rgba(255,255,255,0.03)')
                    //let linesPoints = [new V2(0,0), new V2(277,3), new V2(0,2)]
                    let linesPoints = [new V2(0,0),new V2(0,2)]
                    let vLine = {begin: new V2(277,-100), end: new V2(277,size.y+100)}
                    let perspectiveCenter = new V2(1500, 80);

                    for(let i = -2; i < 20; i++){
                        let corners = linesPoints.map(p => p.add(new V2(0, i*10)));
                        corners[corners.length] = raySegmentIntersectionVector2(corners[1], corners[1].direction(perspectiveCenter), vLine);
                        corners[corners.length] = raySegmentIntersectionVector2(corners[0], corners[0].direction(perspectiveCenter), vLine);
                        pp.fillByCornerPoints(corners);
                    }
                    
                })
            }
        }), 1)

        this.hero = {
            body: this.addGo(new GO({
                position: this.heroPosition.clone(),
                size: this.heroSize,
                init() {
                    this.img = PP.createImage(SCG.epskaImageModels.verse1.heroPart3, {renderOnly: ['body']})
                }
            }), 4),
            leftHand: this.addGo(new GO({
                position: this.heroPosition.clone(),
                size: this.heroSize,
                init() {
                    this.img = PP.createImage(SCG.epskaImageModels.verse1.heroPart3, {renderOnly: ['left_hand']})
                }
            }), 6),
            head: this.addGo(new GO({
                position: this.heroPosition.clone(),
                size: this.heroSize,
                init() {
                    this.img = PP.createImage(SCG.epskaImageModels.verse1.heroPart3, {renderOnly: ['head']})
                }
            }), 7),
            rightHand: this.addGo(new GO({
                position: this.heroPosition.clone(),
                size: this.heroSize,
                init() {
                    this.img = PP.createImage(SCG.epskaImageModels.verse1.heroPart3, {renderOnly: ['right_hand']})
                }
            }), 8)
        }

        this.table = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    pp.setFillStyle('red');
                    let lightEllipsis = {
                        position: new V2(77,163),
                        size: new V2(130, 18).mul(4),
                    }

                    lightEllipsis.rxSq = lightEllipsis.size.x*lightEllipsis.size.x;
                    lightEllipsis.rySq = lightEllipsis.size.y*lightEllipsis.size.y;

                    let cornerPoints = [new V2(0, 153), new V2(111,146), new V2(299, 167), new  V2(299,173), new V2(185,185), new V2(0, 154)]
                    
                    pp.setFillStyle('#0C0402');
                    let tableHeight = 30;
                    for(let i = 0; i < tableHeight; i++){
                        pp.lineV2(cornerPoints[3].add(new V2(0,i)), cornerPoints[4].add(new V2(0,i)))
                    }

                    pp.setFillStyle('#03070A');
                    for(let i = 0; i < tableHeight; i++){
                        pp.lineV2(cornerPoints[5].add(new V2(0,i)), cornerPoints[4].add(new V2(0,i)))
                    }
                    

                    let type = 'expo';
                    let method = 'out';
                    let time = 100;
                    let cChange = colors.createEasingChange({hsv: { from: {h:25,s:34,v:83}, to: {h:30,s:35,v:45} }, type, method, time});
                    pp.fillStyleProvider = (x, y) => {
                        let dx = fast.r(
                            (((x-lightEllipsis.position.x)*(x-lightEllipsis.position.x)/lightEllipsis.rxSq) 
                            + ((y-lightEllipsis.position.y)*(y-lightEllipsis.position.y)/lightEllipsis.rySq))*100);

                        if(dx > 100){
                            dx = 100;
                        }

                        cChange.processer(dx);
                        return cChange.getCurrent('hsv');

                    }
                    let filledPoints = pp.fillByCornerPoints(cornerPoints);
                    
                    pp.fillStyleProvider = undefined;
                    pp.setFillStyle('#2E2316');
                    pp.lineV2(cornerPoints[3].add(new V2(0,1)), cornerPoints[4].add(new V2(0,1)))
                    
                    //far end       hsv: 30,35,45; rgb: 114,94,74
                    // frightEnd:   hsv: 23,18,80; rgb: 205,182,167

                    //hero shadows
                })
            }
        }), 5)

        this.lamp = this.addGo(new GO({
            position: new V2(0,15).add(new V2(50,160).divide(2)).toInt(),
            size: new V2(50,160),
            init() {
                this.img = PP.createImage(SCG.epskaImageModels.verse1.lamp)
            }
        }), 6)

        this.laptop = this.addGo(new GO({
            position: new V2(19,113).add(new V2(80,45).divide(2)),
            size: new V2(80,45),
            init() {
                this.img = PP.createImage(SCG.epskaImageModels.verse1.laptop)
            }
        }), 6)

        this.glasses = this.addGo(new GO({
            position: new V2(223,155).add(new V2(35,15).divide(2)),
            size: new V2(35,15),
            init() {
                this.img = PP.createImage(SCG.epskaImageModels.verse1.glasses)
            }
        }), 6)
    }
}