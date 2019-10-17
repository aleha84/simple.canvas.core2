class Demo9CorridorScene extends Scene {
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

    start(){
        this.city = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(100,200),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#181D23').rect(0,0,size.x, size.y)
                })
            }
        }), 1)

        this.corridor = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let holeSize = new V2(70,130);
                    let hole_tl = new V2(65,75);
                    let hole_tr = hole_tl.add(new V2(holeSize.x, 0))
                    let center = this.position.clone();

                    hlp.setFillColor('#4A647D').rect(0,0,size.x, size.y)
                    hlp.clear(hole_tl.x,hole_tl.y, holeSize.x, holeSize.y)

                    hlp.setFillColor('rgba(0,0,0,0.5)')
                    let pp = new PerfectPixel({ctx});

                    let upperBorderLine = {begin: new V2(0, 0), end: new V2(this.size.x, 0)}
                    let hole_tl_directionToCenter = hole_tl.direction(center);
                    let hole_tl_directionToCenterInverted = hole_tl_directionToCenter.mul(-1);
                    let hole_tlToUpperBorder = raySegmentIntersectionVector2(hole_tl, hole_tl_directionToCenterInverted, upperBorderLine)
                    pp.lineV2(hole_tl, hole_tlToUpperBorder)

                    let hole_tr_directionToCenter = hole_tr.direction(center);
                    let hole_tr_directionToCenterInverted = hole_tr_directionToCenter.mul(-1);
                    let hole_trToUpperBorder = raySegmentIntersectionVector2(hole_tr, hole_tr_directionToCenterInverted, upperBorderLine)
                    pp.lineV2(hole_tr, hole_trToUpperBorder)

                    let bottomBorderLine = {begin: new V2(0, this.size.y), end: new V2(this.size.x, this.size.y)}
                    let hole_bl = hole_tl.add(new V2(0, holeSize.y));
                    let hole_bl_directionToCenter = hole_bl.direction(center);
                    let hole_bl_directionToCenterInverted = hole_bl_directionToCenter.mul(-1);
                    let hole_blToBottomBorder = raySegmentIntersectionVector2(hole_bl, hole_bl_directionToCenterInverted, bottomBorderLine)
                    
                    pp.lineV2(hole_bl, hole_blToBottomBorder)

                    let hole_br = hole_tr.add(new V2(0, holeSize.y));
                    let hole_br_directionToCenter = hole_br.direction(center);
                    let hole_br_directionToCenterInverted = hole_br_directionToCenter.mul(-1);
                    let hole_brToBottomBorder = raySegmentIntersectionVector2(hole_br, hole_br_directionToCenterInverted, bottomBorderLine)
                    
                    pp.lineV2(hole_br, hole_brToBottomBorder)

                })            
            }
        }), 10)
    }
}