class DollarScene extends Scene {
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
        this.backgroundRenderDefault('#808080');
    }

    start(){
        this.dollar = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.imgSize = new V2(64,130);

                this.colors = {
                    bgLight: '#6CBA30',
                    bgDark: '#5A9527',
                    outLineLight: '#00736C',
                    outLineDark: '#006B65',
                    cornerLight: '#045E5F',
                    cornerDark: '#005E5E'
                }
                this.createImage();
            },
            createImage() {
                return createCanvas(this.imgSize, (ctx, size, hlp) => {
                    
                })
            }
        }))
    }
}