class Demo9WindowScene extends Scene {
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
        this.backgroundRenderImage(this.bgImage);
        
    }

    start(){
        this.bgImage = createCanvas(this.viewport, (ctx, size, hlp) => {
            let currentY = 0;
            let currentX = 0;
            let lineHeight = 3;
            let lineWidth = 3;
            let darkPartHeight = lineHeight*5;
            let coloredPartHeight = lineHeight*5;
            let lineHStep = darkPartHeight*3;
            let colors = {
                line: '#B1ADAC',
                lineDarker: '#9E9B9A',
                colored: '#9D8E7B',
                coloredDarker: '#938574',
                dark: '#282A29'
            }

            while(currentY < size.y){
                let yStart = currentY;
                hlp.setFillColor(colors.coloredDarker).rect(0,currentY-1, size.x, 1);
                hlp.setFillColor(colors.line).rect(0,currentY, size.x, lineHeight);
                currentY+=lineHeight;
                hlp.setFillColor(colors.dark).rect(0,currentY, size.x, darkPartHeight);
                currentY+=darkPartHeight;
                hlp.setFillColor(colors.line).rect(0,currentY, size.x, lineHeight);
                currentY+=lineHeight;
                hlp.setFillColor(colors.colored).rect(0,currentY, size.x, coloredPartHeight);
                hlp.setFillColor(colors.coloredDarker).rect(0,currentY, size.x, 1);
                currentY+=coloredPartHeight;

                currentX = 0;
                while(currentX < size.x){
                    hlp.setFillColor(colors.line).rect(currentX,yStart-1, lineWidth, currentY - yStart);
                    hlp.setFillColor(colors.lineDarker).rect(currentX+lineWidth,yStart, 1, lineHeight);
                    hlp.setFillColor(colors.lineDarker).rect(currentX-1,yStart, 1, lineHeight);

                    hlp.setFillColor(colors.lineDarker).rect(currentX+lineWidth,yStart+lineHeight+darkPartHeight, 1, lineHeight);
                    hlp.setFillColor(colors.lineDarker).rect(currentX-1,yStart+lineHeight+darkPartHeight, 1, lineHeight);

                    hlp.setFillColor(colors.coloredDarker).rect(currentX+lineWidth,yStart+lineHeight*2+darkPartHeight, 1, coloredPartHeight);
                    hlp.setFillColor(colors.coloredDarker).rect(currentX-1,yStart+lineHeight*2+darkPartHeight, 1, coloredPartHeight);
                    currentX+=lineWidth;
                    currentX+=lineHStep;
                }
            }
        })

        // this.window = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: new V2(this.viewport.x - 50, this.viewport.y - 50),
        //     init() {
        //         this.createImage()
        //     },
        //     createImage() {

        //     }
        // }))
    }
}