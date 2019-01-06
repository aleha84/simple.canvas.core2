class InfoScreenScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            
        }, options)

        // if(!options.item)
        //     throw 'No item provided for info scene!'

        super(options);

        this.demoText = this.addGo(new AppearingText({
            position: new V2(this.viewport.x/2, this.viewport.y/2),
            size: new V2(50, 15),
            textValue: 'Demo text'
        }))
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

class AppearingText extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            textValue: 'Debug',
            cursorOptions: {
                size: new V2(1,10),
                blink: {
                    currentCount: -1,
                    interval: 250,
                    colors: ['#839009', '#557557']
                }
            }       
        }, options)

        if(!options.textValue) {
            console.trace();
            throw 'No text provided for AppearingText!'
        }

        super(options);

        let that = this;
        this.cursor = this.addChild(new GO({
            position: new V2(),
            size: this.cursorOptions.size.clone(),
            img: createCanvas(new V2(1,10), function(ctx, size){
                if(that.cursorOptions.blink.colors.length == 1){
                    ctx.fillStyle = that.cursorOptions.blink.colors[0];
                }
                else {
                    let grd = ctx.createLinearGradient(0,0,0,9);
                    for(let i = 0;i<that.cursorOptions.blink.colors.length;i++){
                        grd.addColorStop(i/(that.cursorOptions.blink.colors.length-1), that.cursorOptions.blink.colors[i]);
                    }

                    ctx.fillStyle = grd;
                }
                
                ctx.fillRect(0,0, size.x, size.y);
            }),
        }))

        this.cursorBlinkTimer = createTimer(this.cursorOptions.blink.interval, () => {
            this.cursor.isVisible = !this.cursor.isVisible;
            if(this.cursorOptions.blink.currentCount != -1){
                this.cursorOptions.blink.currentCount--;
                if(this.cursorOptions.blink.currentCount <= 0){
                    this.cursorBlinkTimer = undefined;
                    this.cursor.isVisible = true;
                }
            }
        })
    }

    internalUpdate(now){
        if(this.cursorBlinkTimer)
            doWorkByTimer(this.cursorBlinkTimer, now);
    }

    internalRender(){
        let oldStrokeStyle = this.context.strokeStyle;
        this.context.strokeStyle = 'red';
        this.context.strokeRect(this.renderBox.topLeft.x, this.renderBox.topLeft.y, this.renderBox.width, this.renderBox.height);
        this.context.strokeStyle = oldStrokeStyle;
    }
}