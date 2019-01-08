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
            textValue: ['Demo demo 123', 'hello world!'],
            debug: false,
            cursorOptions: {
                size: new V2(5,10),
                startDelay: 1500
            },
            letter: {
                spacing: 0.5
            }
        }))

        // this.demoText = this.addGo(new AppearingText({
        //     position: new V2(this.viewport.x/2, this.viewport.y/2 + 20),
        //     size: new V2(50, 15),
        //     textValue: 'Demo demo',
        //     debug: true,
        //     cursorOptions: {
        //         size: new V2(5,10)
        //     }
        // }))
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

class AppearingText extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            debug: false,
            textValue: 'Debug',
            textChangeDelay: 2000,
            letter: {
                spacing: 1,
                imgSizeMultiplier: 1.5,
                fontSize: 10,
                height: 15,
                colors: ['#839009', '#557557'],
                font: 'Arial'
            },
            cursorOptions: {
                startDelay: 0,
                size: new V2(1,10),
                speed: 2,
                spacing: 2,
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

        if(typeof(options.textValue) === 'string'){
            options.textValue = [options.textValue];
        }

        options.size = options.cursorOptions.size;

        super(options);

        let that = this;
        this.cursor = this.addChild(new MovingGO({
            state: 'showing',
            position: new V2(),//tl.clone(),
            isVisible: false,
            size: this.cursorOptions.size.clone(),
            img: createCanvas(new V2(1,10), function(ctx, size){
                that.setContextFillStyle(ctx, size, that.cursorOptions.blink.colors);
                ctx.fillRect(0,0, size.x, size.y);
            }),
            speed: this.cursorOptions.speed,
            destinationCompleteCallBack() {
                if(this.state == 'showing'){
                    this.parent.returnCursor();
                }
                else if(this.state =='hiding'){
                    this.parent.showText();
                }

                that.startCursorBlinking();
            },
            positionChangedCallback(){
                if(this.state == 'showing'){
                    for(let i = 0; i < that.letters.length;i++){
                        let letter = that.letters[i];
                        if(letter.isVisible)
                            continue;
                        
                        if(letter.position.x + letter.size.x/2 > this.position.x)
                            continue;
    
                        letter.isVisible = true;
                    }
                }
                else if(this.state == 'hiding'){
                    for(let i = 0; i < that.letters.length;i++){
                        let letter = that.letters[i];
                        if(!letter.isVisible)
                            continue;

                        if(letter.position.x + letter.size.x/2 > this.position.x){
                            letter.isVisible = false;
                        }
                    }
                }
            },
            start(destination) {
                //new V2(this.parent.size.x/2, 0).add(new V2( (that.cursorOptions.size.x/2) + this.parent.cursorOptions.spacing ,0))
                this.setDestination(destination);
                this.parent.stopCursorBlinking();
            }
        }));

        this.showText();
    }

    showText(){
        let textValue = this.textValue.shift();
        let that = this;
        if(this.letters && this.letters.length){
            for(let i = 0; i < this.letters.length;i++){
                this.removeChild(this.letters[i]);
            }
        }

        this.letters = [];

        let fontSizeCtx = createCanvas(new V2(1,1)).getContext('2d');
        fontSizeCtx.font = this.letter.fontSize + 'px ' + this.letter.font;
        fontSizeCtx.textAlign = 'center';
        fontSizeCtx.textBaseline = 'middle';
        let lettersWitdhs = []
        for(let i = 0; i < textValue.length;i++){
            lettersWitdhs[i] = fontSizeCtx.measureText(textValue[i]).width
        }

        let size = new V2(lettersWitdhs.reduce((x,y) => x+y, 0) + this.letter.spacing*(textValue.length-1), this.letter.height);
        let currentCharX = 0;//-this.size.x/2;

        let tl = new V2();//new V2(-this.size.x/2, 0);
        for(let i = 0; i < textValue.length;i++){
            let char = textValue.charAt(i);
            let letterWidth = lettersWitdhs[i];
            currentCharX+=letterWidth/2;
            let charSize = new V2(letterWidth, this.letter.height);
            this.letters.push(this.addChild(new GO({
                isVisible: false,
                size: charSize,
                position: new V2(currentCharX, 0),
                img: createCanvas(charSize.mul(this.letter.imgSizeMultiplier), function(ctx, size){
                    ctx.font = (that.letter.fontSize*that.letter.imgSizeMultiplier) + 'px ' + that.letter.font;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    that.setContextFillStyle(ctx, size, that.letter.colors);
                    ctx.fillText(char, size.x/2, size.y/2 + 2);
                }),
                internalRender(){
                    if(!that.debug)
                        return;

                    let oldStrokeStyle = this.context.strokeStyle;
                    this.context.strokeStyle = 'green';
                    this.context.strokeRect(this.renderBox.topLeft.x, this.renderBox.topLeft.y, this.renderBox.width, this.renderBox.height);
                    this.context.strokeStyle = oldStrokeStyle;
                }
            })));
            currentCharX+=(letterWidth/2 + this.letter.spacing);
        }

        this.cursor.isVisible = true;
        this.cursor.position = tl.clone();
        this.cursor.state = 'showing';
        let cursorDestination = new V2(size.x, 0).add(new V2( (this.cursorOptions.size.x/2) + this.cursorOptions.spacing ,0));

        if(this.cursorOptions.startDelay > 0){
            this.cursorStartDelayTimer = createTimer(this.cursorOptions.startDelay, () => {
                this.cursorStartDelayTimer = undefined;
                this.cursor.start(cursorDestination);
            }, this, false)
        }
        else {
            this.cursor.start(cursorDestination);
        }

        this.startCursorBlinking();
    }

    returnCursor(){
        this.returnCursorTimer = createTimer(this.textChangeDelay, () => {
            if(this.textValue.length){
                this.cursor.state = 'hiding';
                this.cursor.start(new V2());
            }

            this.returnCursorTimer = undefined;
            
        }, this, false);
    }

    startCursorBlinking() {
        this.cursorBlinkTimer = createTimer(this.cursorOptions.blink.interval, () => {
            this.cursor.isVisible = !this.cursor.isVisible;
            if(this.cursorOptions.blink.currentCount != -1){
                this.cursorOptions.blink.currentCount--;
                if(this.cursorOptions.blink.currentCount <= 0){
                    this.stopCursorBlinking();
                }
            }
        })
    }

    stopCursorBlinking(){
        this.cursorBlinkTimer = undefined;
        this.cursor.isVisible = true;
    }

    setContextFillStyle(ctx, size, colors) {
        if(colors.length == 1){
            ctx.fillStyle = that.cursorOptions.blink.colors[0];
        }
        else {
            let grd = ctx.createLinearGradient(size.x/2,0,size.x/2,size.y);
            for(let i = 0;i<colors.length;i++){
                grd.addColorStop(i/(colors.length-1), colors[i]);
            }

            ctx.fillStyle = grd;
        }
    }

    internalUpdate(now){
        if(this.cursorBlinkTimer)
            doWorkByTimer(this.cursorBlinkTimer, now);

        if(this.cursorStartDelayTimer)
            doWorkByTimer(this.cursorStartDelayTimer, now);

        if(this.returnCursorTimer)
            doWorkByTimer(this.returnCursorTimer, now);
    }

    internalRender(){
        if(!this.debug)
            return;
        let oldStrokeStyle = this.context.strokeStyle;
        this.context.strokeStyle = 'red';
        this.context.strokeRect(this.renderBox.topLeft.x, this.renderBox.topLeft.y, this.renderBox.width, this.renderBox.height);
        this.context.strokeStyle = oldStrokeStyle;
    }
}