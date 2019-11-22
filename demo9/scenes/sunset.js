class Demo9SunsetScene extends Scene {
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
        this.backgroundRenderDefault('#FFE69B');
        //this.backgroundRenderImage(this.bgImage)
    }

    start(){
        

        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport.clone(),
            init() {
                this.bgImage = createCanvas(this.size, (ctx, size, hlp) => {
                    let lightEllipsis = {
                        position: new V2(120,-20),
                        size: new V2(200, 200),
                    }
        
                    lightEllipsis.rxSq = lightEllipsis.size.x*lightEllipsis.size.x;
                    lightEllipsis.rySq = lightEllipsis.size.y*lightEllipsis.size.y;
        
                    let type = 'sin';
                    let method = 'in';
                    let time = 100;
                    let cChange = colors.createEasingChange({rgb: { from: {r:253,g:253,b:253}, to: {r:255,g:216,b:113} }, type, method, time});
                    for(let y = 0; y < this.size.y;y++){
                        for(let x = 0; x < this.size.x;x++){
                            let dx = fast.r(
                                (((x-lightEllipsis.position.x)*(x-lightEllipsis.position.x)/lightEllipsis.rxSq) 
                                + ((y-lightEllipsis.position.y)*(y-lightEllipsis.position.y)/lightEllipsis.rySq))*100);
        
                            if(dx > 100){
                                dx = 100;
                            }
                            cChange.processer(dx);
                            let rgb = cChange.getCurrent('rgb', true);
        
                            let d = 2;
                            if(dx < 50)
                                d = 5;
                            else if(dx < 75)
                                d = 3
        
                            rgb.r = fast.r(rgb.r/d)*d;if(rgb.r > 255) rgb.r = 255
                            rgb.g = fast.r(rgb.g/d)*d;if(rgb.g > 255) rgb.g = 255
                            rgb.b = fast.r(rgb.b/d)*d;if(rgb.b > 255) rgb.b = 255
        
                            hlp.setFillColor('#' + rgbToHex(rgb.r, rgb.g, rgb.b));
        
                            hlp.dot(x,y);
                        }
                    }
        
                    hlp.setFillColor('rgba(255,216,113, 0.15)');
                    //hlp.setFillColor('red');
                    [{y: 98, w: 5},{y: 99, w: 14},{y: 100, w: 18},{y: 114, w: 20}, {y: 117, w: 27},{y: 118, w: 29},{y: 126, w: 30}, {y: 127, w: 40},{y: 128, w: 45}, {y: 129, w: 40},
                        {y: 98, x: 195, w: 10},{y: 99, x: 190, w: 10},
                        {y: 115, x: 185, w: 15},{y: 116, x: 190, w: 15},
                        {y: 130, x: 170, w: 30}, {y: 131, x: 160, w: 25}, {y: 132, x: 155, w: 15}
        
                    ].forEach(p => {
                        hlp.rect(p.x || 0,p.y, p.w, 1)
                    })
        
                    hlp.setFillColor('rgba(255,255,255, 0.1)');
                    [
                        {y: 97, w: 5}, {y: 98, x: 5,  w: 10},  {y: 99, x: 15,  w: 4}, {y: 100, x: 19,  w: 6},
                        {y: 113, w: 21},
                        {y: 116, w: 28}, {y: 117, x: 29, w: 4},
                        {y: 125, w: 31},{y: 126, x: 32, w: 10}, {y: 127, x: 42, w: 5},
        
                        {y: 97, x: 195, w: 10},{y: 98, x: 189, w: 5},
                        {y: 114, x: 180, w: 20},
        
                        {y: 129, x: 168, w: 40}, {y: 130, x: 158, w: 10}, {y: 131, x: 145, w: 15}
                    ].forEach(p => {
                        hlp.rect(p.x || 0,p.y, p.w, 1)
                    })
                    
                    hlp.setFillColor('rgba(242,203,96, 0.15)');
                    [
                        {y: 148, x: 20, w:10},{y: 149, x: 25, w:10},
                        {y: 156, w: 40}, {y: 157, w: 100},{y: 158, w: 90},{y: 163, x: 60, w: 50},
        
                        {y: 160, x: 150, w: 50}, {y: 161, x: 170, w: 50},
                        {y: 150, x: 175, w:25}
                    ].forEach(p => {
                        hlp.rect(p.x || 0,p.y, p.w, 1)
                    })
        
        
        
                    hlp.setFillColor('rgba(255,255,255, 0.1)');
                    [
                        {y: 147, x: 18, w:10}, {y: 148, x: 30, w:5}, {y: 155, w: 35}, {y: 156, x: 45, w: 35},  {y: 162, x: 60, w: 55},
                        {y: 159, x: 145, w: 55},
                        {y: 149, x: 170, w:30}
                    ].forEach(p => {
                        hlp.rect(p.x || 0,p.y, p.w, 1)
                    })
                })
                this.img = this.bgImage;
            }
        }), 1)

        this.cityView = this.addGo(new GO({
            position: new V2(100,200),
            size: new V2(this.viewport.x,120),
            init() {
                this.img = PP.createImage(Demo9SunsetScene.sunsetModels.cityView)
            }
        }), 2)

        this.ground = this.addGo(new GO({
            position: new V2(0,0),
            size: new V2(this.viewport.x,60),
            init() {
                this.position = new V2(this.parentScene.sceneCenter.x, this.parentScene.viewport.y - this.size.y/2).toInt().add(new V2(0,2));
                this.img = PP.createImage(Demo9SunsetScene.sunsetModels.groundModel)
            }
        }), 4)

        this.man = this.addGo(new GO({
            position: new V2(113,226),
            size: new V2(27,60),
            init() {
                this.img = PP.createImage(Demo9SunsetScene.sunsetModels.manModel)
            }
        }), 6)

        this.bench = this.addGo(new GO({
            position: new V2(85,235),
            size: new V2(110,40),
            init() {
                this.img = PP.createImage(Demo9SunsetScene.sunsetModels.benchModel)
            }
        }), 8)
    }
}