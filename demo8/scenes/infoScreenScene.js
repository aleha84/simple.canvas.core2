class InfoScreenScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            
        }, options)

        // if(!options.item)
        //     throw 'No item provided for info scene!'

        super(options);

        this.mainScreen = this.addGo(new Screen({
            size: new V2(this.viewport.x/3, this.viewport.y*0.7),
            position: new V2(this.viewport.x/2, this.viewport.y/2),
            gridOptions: {
                enabled: false,
                linesCount: {
                    v: 10,
                    h: 3
                }
            }
        }));

        this.textRows = [];
        this.textRows.push(this.mainScreen.addChild(new AppearingText({
            repeat: false,
            position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 20) ,
            size: new V2(50, 15),
            textValue: ['Low quality text'],
            cursorOptions: {
                size: new V2(5,10),
                startDelay: 1500
            },
            letter: {
                spacing: 0.5,
                quality: 'low'
            }
        })));

        this.textRows.push(this.mainScreen.addChild(new AppearingText({
            repeat: false,
            position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 40) ,
            size: new V2(50, 15),
            textValue: ['Medium quality text'],
            cursorOptions: {
                size: new V2(5,10),
                startDelay: 1500,
                spacing: 4
            },
            letter: {
                spacing: 0.5,
                quality: 'medium'
            }
        })));

        this.textRows.push(this.mainScreen.addChild(new AppearingText({
            repeat: false,
            position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 60) ,
            size: new V2(50, 15),
            textValue: ['High quality text'],
            cursorOptions: {
                size: new V2(5,10),
                startDelay: 1500,
                spacing: 3
            },
            letter: {
                spacing: 0.5, quality: 'high'
            }
        })));

        this.textRows.push(this.mainScreen.addChild(new AppearingText({
            repeat: true,
            position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 80) ,
            size: new V2(50, 15),
            textValue: ['First part of text', 'Second part of text', 'Third part of text.', 'Repeat...'],
            cursorOptions: {
                size: new V2(5,10),
                startDelay: 1500,
                spacing: 3,
                backSpeed: 5
            },
            letter: {
                spacing: 0.5,
                quality: 'medium'
            }
        })));

        this.textRows.push(this.mainScreen.addChild(new AppearingText({
            repeat: true,
            position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 100) ,
            size: new V2(50, 15),
            textValue: ['Fade-in effect on letters'],
            cursorOptions: {
                size: new V2(5,10),
                startDelay: 1500,
                spacing: 3,
                backSpeed: 5
            },
            letter: {
                spacing: 0.5,
                quality: 'medium',
                effects: ['fadein']
            }
        })));

        this.textRows.push(this.mainScreen.addChild(new AppearingText({
            repeat: true,
            position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 120) ,
            size: new V2(50, 15),
            textValue: ['Thin and often blinking cursor'],
            cursorOptions: {
                size: new V2(1,10),
                startDelay: 1500,
                spacing: 3,
                backSpeed: 5,
                blink: {
                    interval: 100
                }
            },
            letter: {
                spacing: 0.1,
                quality: 'medium'
            }
        })));

        this.textRows.push(this.mainScreen.addChild(new AppearingText({
            repeat: true,
            position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 140) ,
            size: new V2(50, 15),
            textValue: ['Hurry!', 'Faster!', 'We are late! '],
            textChangeDelay: 500,
            cursorOptions: {
                size: new V2(1,10),
                startDelay: 500,
                spacing: 3,
                speed: 5,
                backSpeed: 7,
                blink: {
                    interval: 100
                }
            },
            letter: {
                spacing: 0.1,
                quality: 'medium'
            }
        })));

        this.textRows.push(this.mainScreen.addChild(new AppearingText({
            repeat: true,
            position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 170) ,
            size: new V2(50, 15),
            textValue: ['I am big', 'Slow', 'And lazy'],
            textChangeDelay: 5000,
            cursorOptions: {
                startDelay: 1500,
                size: new V2(3,18),
                spacing: 3,
                speed: 0.5,
                backSpeed: 2,
                blink: {
                    interval: 500
                }
            },
            letter: {
                spacing: 0.3,
                quality: 'medium',
                fontSize: 20,
                height: 25,
                effects: ['fadein']
            }
        })));

        this.addClearText = createTimer(20000, () => {
            this.addClearText = undefined;

            this.textRows.push(this.mainScreen.addChild(new AppearingText({
                repeat: false,
                position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 200) ,
                size: new V2(50, 15),
                textValue: ['Clear all in', '3', '2', '1', '...'],
                textChangeDelay: 500,
                cursorOptions: {
                    size: new V2(1,10),
                    startDelay: 500,
                    spacing: 3,
                    backSpeed: 5,
                    blink: {
                        colors: ['#FF0000']
                    }
                },
                letter: {
                    spacing: 0.5,
                    quality: 'high',
                    colors: ['#FF0000']
                }
            })));
        }, this, false)


        this.clearTextTimer = createTimer(27500, () => {
            this.clearTextTimer = undefined;
            for(let i = 0;i < this.textRows.length;i++){
                this.textRows[i].clear();
                this.textRows[i].cursor.addEffect(new SizeInEffect({updateDelay: 40, effectTime: 1000, startDelay: 2000, dimension: 'y', initOnAdd: true}))
            }
        }, this, false)
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    afterMainWork(now){
        if(this.clearTextTimer)
            doWorkByTimer(this.clearTextTimer, now);
        
        if(this.addClearText)
            doWorkByTimer(this.addClearText, now);
    }

}

class AppearingText extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            repeat: false,
            debug: false,
            textValue: 'Debug',
            textChangeDelay: 2000,
            letter: {
                spacing: 1,
                imgSizeMultiplier: 1.5,
                fontSize: 10,
                height: 15,
                colors: ['#839009', '#557557'],
                font: 'Arial',
                effects: []
            },
            cursorOptions: {
                startDelay: 0,
                size: new V2(1,10),
                originImgSize: new V2(1,10),
                speed: 2,
                backSpeed: 2,
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
        options.cursorOptions.forwardSpeed = options.cursorOptions.speed;

        super(options);

        if(this.letter.quality){
            switch(this.letter.quality){
                case 'high':
                    this.letter.imgSizeMultiplier = 2.5;
                    this.cursorOptions.originImgSize = new V2(1, 10);
                    break;
                case 'low':
                    this.letter.imgSizeMultiplier = 1;
                    this.cursorOptions.originImgSize = new V2(1, 4); 
                    break;
                case 'medium':
                default:
                    this.letter.imgSizeMultiplier = 1.5;
                    this.cursorOptions.originImgSize = new V2(1, 6); 
                    break;
            }
        }

        if(this.repeat){
            this.originTextValues = [...this.textValue];
        }

        let that = this;
        this.cursor = this.addChild(new MovingGO({
            state: 'showing',
            position: new V2(),//tl.clone(),
            isVisible: false,
            size: this.cursorOptions.size.clone(),
            img: createCanvas(this.cursorOptions.originImgSize, function(ctx, size){
                that.setContextFillStyle(ctx, size, that.cursorOptions.blink.colors);
                ctx.fillRect(0,0, size.x, size.y);
            }),
            speed: this.cursorOptions.speed,
            destinationCompleteCallBack() {
                if(this.state == 'showing'){
                    if(this.mustReturn){
                        this.mustReturn = false;
                        this.state = 'hiding';
                        this.start(new V2());
                        return;
                    }
                    else {
                        this.state = 'idle';
                        this.parent.returnCursor();
                    }  
                }
                else if(this.state =='hiding'){
                    this.state = 'idle';
                    this.parent.showText();
                    this.position = new V2();
                    //this.positionChangedCallback();
                    this.needRecalcRenderProperties = true;
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
                        if(this.parent.letter.effects.length){
                            for(let i = 0; i < this.parent.letter.effects.length; i++){
                                if(this.parent.letter.effects[i] == 'fadein'){
                                    letter.addEffect(new FadeInEffect({ updateDelay: 50, initOnAdd: true, effectTime: 500 }))
                                }
                            }
                        }
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
                if(this.mustReturn)
                    return;

                //new V2(this.parent.size.x/2, 0).add(new V2( (that.cursorOptions.size.x/2) + this.parent.cursorOptions.spacing ,0))
                if(this.state == 'showing'){
                    this.speed = this.parent.cursorOptions.forwardSpeed;
                }
                else if(this.state == 'hiding') {
                    this.speed = this.parent.cursorOptions.backSpeed;
                }

                this.setDestination(destination);
                this.parent.stopCursorBlinking();
            },
            return(){
                if(this.state == 'idle'){
                    this.state ='hiding';
                    this.start(new V2())
                }

                this.mustReturn = true;
            }
        }));

        this.showText();
    }

    clear(){
        this.textValue = [];
        this.originTextValues = [];
        this.cursorStartDelayTimer = undefined;
        this.returnCursorTimer = undefined;
            
        this.cursor.return();
    }

    showText(){
        if(!this.textValue.length)
            return;

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
        
        let cursorDestination = new V2(size.x, 0).add(new V2( (this.cursorOptions.size.x/2) + this.cursorOptions.spacing ,0));

        if(this.cursorOptions.startDelay > 0){
            this.cursorStartDelayTimer = createTimer(this.cursorOptions.startDelay, () => {
                this.cursorStartDelayTimer = undefined;
                this.cursor.state = 'showing';
                this.cursor.start(cursorDestination);
            }, this, false)
        }
        else {
            this.cursor.state = 'showing';
            this.cursor.start(cursorDestination);
        }

        this.startCursorBlinking();
    }

    returnCursor(){
        this.returnCursorTimer = createTimer(this.textChangeDelay, () => {
            if(this.textValue.length == 0 && this.repeat){
                this.textValue = [...this.originTextValues];
            }

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
            ctx.fillStyle = colors[0];
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

class Screen extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            backgroundColors: ['rgba(13,45,0,0.3)', 'rgba(13,45,0,0.2)'],
            backgroundColorsDirection: V2.right,
            gridOptions: {
                enabled: true,
                linesColor: 'rgba(38,127,0,0.5)',
                linesWidth: 0.5,
                linesCount: {
                    h: 2, v: 2
                }
            },
            backlightOptions: {
                enabled: true,
                color: 'FFFFFF',
                size: new V2(0.1, 0.1)
            }
        }, options);

        super(options);

        let that = this;

        this.background = this.addChild(new GO({
            position: new V2(),
            size: this.size.clone(),
            img: createCanvas(this.size, function(ctx, size){
                if(that.backgroundColors.length > 1){
                    let grd = undefined;
                    switch(that.backgroundColorsDirection){
                        case V2.left:
                            grd = ctx.createLinearGradient(size.x, size.y/2, 0, size.y/2);
                            break;
                        case V2.up: 
                            grd = ctx.createLinearGradient(size.x/2, size.y, size.x/2, 0);
                            break;
                        case V2.down: 
                            grd = ctx.createLinearGradient(size.x/2, 0, size.x/2, size.y);
                            break;
                        case V2.right:
                        default:
                            grd = ctx.createLinearGradient(0, size.y/2, size.x, size.y/2);
                            break;
                    }
                    
                    for(let i = 0; i < that.backgroundColors.length; i++){
                        grd.addColorStop(i/(that.backgroundColors.length-1), that.backgroundColors[i]);
                    }

                    ctx.fillStyle = grd;
                }
                else 
                    ctx.fillStyle = that.backgroundColors[0];

                ctx.fillRect(0,0, size.x, size.y);
            })
        }))

        if(this.gridOptions.enabled){
            this.grid = {
                v: [],
                h: []
            };
            let img = createCanvas(new V2(1,1), (ctx, size) => {ctx.fillStyle = this.gridOptions.linesColor; ctx.fillRect(0,0, size.x, size.y);})
            let hStep = this.size.x/(this.gridOptions.linesCount.h+1);
            let vStep = this.size.y/(this.gridOptions.linesCount.v+1);
            for(let i = 0; i < this.gridOptions.linesCount.h; i++){
                this.grid.h.push(this.addChild(new GO({
                    position: new V2(-this.size.x/2 + (hStep + hStep*i), 0),
                    size: new V2(this.gridOptions.linesWidth, this.size.y),
                    img: img
                })));
            }

            for(let i = 0; i < this.gridOptions.linesCount.v; i++){
                this.grid.v.push(this.addChild(new GO({
                    position: new V2(0, -this.size.y/2 + (vStep + vStep*i)),
                    size: new V2(this.size.x, this.gridOptions.linesWidth),
                    img: img
                })));
            }
        }

        if(this.backlightOptions.enabled){
            this.backlights = {
                top: undefined,
                bottom: undefined,
                left: undefined,
                right: undefined
            };


        }
    }
}