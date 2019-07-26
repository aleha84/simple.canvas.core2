class BookScene extends Scene {
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
        this.backgroundRenderDefault('#8BD7EA');
    }

    start(){
        this.demo = this.addGo(new BookGO({
        	position: this.sceneCenter.clone(),
        	size: new V2(150,100)
        }))
    }
}

class BookGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
        }, options)

        super(options);
    }

    init() {
        this.cover = this.addChild(new GO({
    		size: this.size, 
    		position: new V2(0,0),
    		img: createCanvas(new V2(this.size), (ctx, size, hlp) => {

                let radius = 14;
                let height = size.y-radius;
                this.roundedRectangleFoo({hlp, rectSize: new V2(size.x, height), imgSize: size, radius, color: '#589BAC'});

                hlp.setFillColor('#589BAC').circle(new V2(size.x/2, height), radius);

    		})
        }));

        this.pages = this.addChild(new GO({
            size: this.size, 
            position: new V2(0,-5),
            img: createCanvas(new V2(this.size), (ctx, size, hlp) => {

                let radius = 12;
                let pagesDarkShift = new V2(undefined, 0)
                pagesDarkShift.x = undefined;
                this.roundedRectangleFoo({hlp, rectSize: new V2(fast.r(size.x*0.9), fast.r(size.y*0.9)), shift: pagesDarkShift, imgSize: size, radius, color: '#C9C9C9'})
                let pagesLightShift = new V2(undefined, 0);
                pagesLightShift.x = undefined;
                this.roundedRectangleFoo({hlp, rectSize: new V2(fast.r(size.x*0.9), fast.r(size.y*0.81)), shift: pagesLightShift, imgSize: size, radius, color: '#FAFAFA'})

                //let lineRadius = 4;
                
                hlp.setFillColor('#F5F5F5').rect(fast.r(size.x/2), 0, fast.r(0.35*(size.x/2)), fast.r(size.y*0.81))
                hlp.setFillColor('#EFEFEF').rect(fast.r(size.x/2), 0, 2, fast.r(size.y*0.81))

                hlp.setFillColor('#E0E0E0');
                for(let j = 0; j < 2;j++) {
                    let startX = 25;
                    let topY = 11;
                    let yGap = 11;
                    let lineWidth = 40;
                    let dLines = 5;

                    for(let i = 0; i < 6; i++){
                        for(let y = 0; y < dLines; y++){
                            let w = lineWidth;
                            let sx = fast.r(startX+j*(size.x/2 - startX/2));
                            if(y == 0 || y == dLines-1){
                                sx+=1;
                                w-=2;
                            }
                            hlp.rect(sx,topY + i*yGap + y, w, 1);    
                        }
                        
                    }    
                }
                
                
                //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
            })
        }));
    }

    roundedRectangleFoo({hlp, rectSize, imgSize, shift, radius, color}) {
        if(!shift){
            shift = new V2(fast.r((imgSize.x - rectSize.x)/2), fast.r((imgSize.y - rectSize.y)/2));    
        }
        else {
            if(shift.x == undefined) {
                shift.x = fast.r((imgSize.x - rectSize.x)/2);
            }

            if(shift.y == undefined) {
                shift.y = fast.r((imgSize.y - rectSize.y)/2);
            }
        }

        hlp.setFillColor(color)
            .circle(new V2(radius-1 + shift.x,radius-1 + shift.y), radius)
            .circle(new V2(rectSize.x - radius + shift.x,radius-1+ shift.y), radius)
            .circle(new V2(rectSize.x - radius + shift.x,rectSize.y - radius + shift.y), radius)
            .circle(new V2(radius-1 + shift.x,rectSize.y-radius + shift.y), radius)
        .rect(shift.x,radius+shift.y,rectSize.x, rectSize.y-radius*2)
        .rect(radius+shift.x,0 + shift.y,rectSize.x-radius*2, rectSize.y)
    }

}