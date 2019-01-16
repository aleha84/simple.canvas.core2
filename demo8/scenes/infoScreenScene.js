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
                linesCount: {
                    v: 0,
                    h: 3
                },
                linesColor: 'rgba(38,127,0,0.15)'
            }
        }));

        this.bgImage = textureGenerator.textureGenerator({
            size: this.viewport,
            backgroundColor: '#6A7334',
            surfaces: [
                textureGenerator.getSurfaceProperties({colors: ['#A8BBB9'], fillSize: new V2(100, 1), density: 0.0005, opacity: [0.05, 0.1], indents: { h: new V2(-100,-100) }}),
                textureGenerator.getSurfaceProperties({colors: ['#A8BBB9'], fillSize: new V2(1, 100), density: 0.0005, opacity: [0.05, 0.1], indents: { v: new V2(-100,-100) }}),
                //textureGenerator.getSurfaceProperties({colors: ['#000000'], fillSize: new V2(20, 20), density: 0.0005, opacity: [0.05, 0.1], indents: { v: new V2(-20,-20) }}),
                // textureGenerator.getSurfaceProperties({colors: ['#FFFFFF'], fillSize: new V2(2, 2), density: 0.005, opacity: [0.05, 0.1], indents: { v: new V2(-2,-2) }})
            ]
        })

        // text appearance demo
{
    let obj = new GO({
        size: new V2(20, 20),
        position: new V2(40,-40),
        img: createCanvas(new V2(1,1), (ctx, size) => {
            ctx.fillStyle = '#A8BBB9'; ctx.fillRect(0,0, size.x, size.y)
        })
    })
    obj.addEffect(new FadeInOutEffect({updateDelay: 50, effectTime: 500, loop: true, min: 0.05, max: 0.1}))
    this.mainScreen.addChild(obj);

    let obj1 = new GO({
        size: new V2(15, 15),
        position: new V2(40,-50),
        img: createCanvas(new V2(1,1), (ctx, size) => {
            ctx.fillStyle = '#A8BBB9'; ctx.fillRect(0,0, size.x, size.y)
        })
    })
    obj1.addEffect(new FadeInOutEffect({updateDelay: 50, effectTime: 250, loop: true, min: 0.1, max: 0.2}))
    this.mainScreen.addChild(obj1);

    let obj2 = new GO({
        size: new V2(10, 10),
        position: new V2(40,-60),
        img: createCanvas(new V2(1,1), (ctx, size) => {
            ctx.fillStyle = '#A8BBB9'; ctx.fillRect(0,0, size.x, size.y)
        })
    })
    obj2.addEffect(new FadeInOutEffect({updateDelay: 50, effectTime: 125, loop: true, min: 0.2, max: 0.3}))
    this.mainScreen.addChild(obj2);

    let obj3 = new GO({
        size: new V2(10, 10),
        position: new V2(-40,80),
        img: createCanvas(new V2(1,1), (ctx, size) => {
            let clr = hexToRgb('#839009', true);
            ctx.fillStyle =  `rgba(${clr[0]}, ${clr[1]},${clr[2]}, 0.3)`; ctx.fillRect(0,0, size.x, size.y)
        }),
        init() {
            this.originX = this.position.x;
            this.timer = 0;
        },
        internalUpdate(now){
            this.position.x = this.originX + Math.sin(this.timer)*8;
            this.timer+=0.1;
            this.needRecalcRenderProperties = true;
        }
    })
    this.mainScreen.addChild(obj3);

    let obj4 = new GO({
        size: new V2(15, 15),
        position: new V2(-40,70),
        img: createCanvas(new V2(1,1), (ctx, size) => {
            let clr = hexToRgb('#839009', true);
            ctx.fillStyle =  `rgba(${clr[0]}, ${clr[1]},${clr[2]}, 0.2)`; ctx.fillRect(0,0, size.x, size.y)
        }),
        init() {
            this.originX = this.position.x;
            this.timer = 1;
        },
        internalUpdate(now){
            this.position.x = this.originX + Math.sin(this.timer)*8;
            this.timer+=0.1;
            this.needRecalcRenderProperties = true;
        }
    })
    this.mainScreen.addChild(obj4);

    let obj5 = new GO({
        size: new V2(20, 20),
        position: new V2(-40,60),
        img: createCanvas(new V2(1,1), (ctx, size) => {
            let clr = hexToRgb('#839009', true);
            ctx.fillStyle =  `rgba(${clr[0]}, ${clr[1]},${clr[2]}, 0.1)`; ctx.fillRect(0,0, size.x, size.y)
        }),
        init() {
            this.originX = this.position.x;
            this.timer = 2;
        },
        internalUpdate(now){
            this.position.x = this.originX + Math.sin(this.timer)*8;
            this.timer+=0.1;
            this.needRecalcRenderProperties = true;
        }
    })
    this.mainScreen.addChild(obj5);

    this.mainScreen.addChild(new AppearingText({
            repeat: false,
            position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 20) ,
            size: new V2(50, 15),
            textValue: ['Lorem ipsum', 'dolor sit amet,', 'consectetur', 'adipiscing', 'elit, sed do', 'eiusmod tempor', 'incididunt ut', 'labore et dolore', 'magna aliqua.',
            'Ut enim', 'ad minim', 'veniam, quis'],
            textChangeDelay: 1000,
            multiline: {
                enabled: true, 
                lineHeight: 10,
                maxLinesVisible: -1,
                behavior: 'cursordown'
            },
            cursorOptions: {
                size: new V2(5,10),
                startDelay: 500,
                backSpeed: 3,
                removeOnComplete: true
            },
            letter: {
                spacing: 0.5, quality: 'high'
            }
        }))

        this.mainScreen.addChild(new AppearingText({
            repeat: false,
            position: new V2(this.mainScreen.size.x/2 - 50, -this.mainScreen.size.y/2 + 180) ,
            size: new V2(50, 15),
            textValue: ['Lorem ipsum', 'dolor sit amet,', 'consectetur', 'adipiscing', 'elit, sed do', 'eiusmod tempor', 'incididunt ut', 'labore et dolore', 'magna aliqua.',
            'Ut enim', 'ad minim', 'veniam, quis', 'nostrud', 'exercitation', 'ullamco laboris', 'nisi ut aliquip', 'ex ea commodo', 'consequat.'],
            textChangeDelay: 500,
            multiline: {
                enabled: true, 
                lineHeight: 5,
                maxLinesVisible: -1,
                behavior: 'linesup'
            },
            cursorOptions: {
                size: new V2(2,5),
                startDelay: 500,
                backSpeed: 3,
                removeOnComplete: true,
                colors: ['#A8BBB9', '#688080']
            },
            letter: {
                spacing: 0.25, quality: 'ultrahigh', fontSize: 4, colors: ['#A8BBB9', '#688080']
            }
        }))
        // this.textRows = [];
        // this.textRows.push(this.mainScreen.addChild(new AppearingText({
        //     repeat: false,
        //     position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 20) ,
        //     size: new V2(50, 15),
        //     textValue: ['Low quality text'],
        //     cursorOptions: {
        //         size: new V2(5,10),
        //         startDelay: 1500
        //     },
        //     letter: {
        //         spacing: 0.5,
        //         quality: 'low'
        //     }
        // })));

        // this.textRows.push(this.mainScreen.addChild(new AppearingText({
        //     repeat: false,
        //     position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 40) ,
        //     size: new V2(50, 15),
        //     textValue: ['Medium quality text'],
        //     cursorOptions: {
        //         size: new V2(5,10),
        //         startDelay: 1500,
        //         spacing: 4
        //     },
        //     letter: {
        //         spacing: 0.5,
        //         quality: 'medium'
        //     }
        // })));

        // this.textRows.push(this.mainScreen.addChild(new AppearingText({
        //     repeat: false,
        //     position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 60) ,
        //     size: new V2(50, 15),
        //     textValue: ['High quality text'],
        //     cursorOptions: {
        //         size: new V2(5,10),
        //         startDelay: 1500,
        //         spacing: 3
        //     },
        //     letter: {
        //         spacing: 0.5, quality: 'high'
        //     }
        // })));

        // this.textRows.push(this.mainScreen.addChild(new AppearingText({
        //     repeat: true,
        //     position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 80) ,
        //     size: new V2(50, 15),
        //     textValue: ['First part of text', 'Second part of text', 'Third part of text.', 'Repeat...'],
        //     cursorOptions: {
        //         size: new V2(5,10),
        //         startDelay: 1500,
        //         spacing: 3,
        //         backSpeed: 5
        //     },
        //     letter: {
        //         spacing: 0.5,
        //         quality: 'medium'
        //     }
        // })));

        // this.textRows.push(this.mainScreen.addChild(new AppearingText({
        //     repeat: true,
        //     position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 100) ,
        //     size: new V2(50, 15),
        //     textValue: ['Fade-in effect on letters'],
        //     cursorOptions: {
        //         size: new V2(5,10),
        //         startDelay: 1500,
        //         spacing: 3,
        //         backSpeed: 5
        //     },
        //     letter: {
        //         spacing: 0.5,
        //         quality: 'medium',
        //         effects: ['fadein']
        //     }
        // })));

        // this.textRows.push(this.mainScreen.addChild(new AppearingText({
        //     repeat: true,
        //     position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 120) ,
        //     size: new V2(50, 15),
        //     textValue: ['Thin and often blinking cursor'],
        //     cursorOptions: {
        //         size: new V2(1,10),
        //         startDelay: 1500,
        //         spacing: 3,
        //         backSpeed: 5,
        //         blink: {
        //             interval: 100
        //         }
        //     },
        //     letter: {
        //         spacing: 0.1,
        //         quality: 'medium'
        //     }
        // })));

        // this.textRows.push(this.mainScreen.addChild(new AppearingText({
        //     repeat: true,
        //     position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 140) ,
        //     size: new V2(50, 15),
        //     textValue: ['Hurry!', 'Faster!', 'We are late! '],
        //     textChangeDelay: 500,
        //     cursorOptions: {
        //         size: new V2(1,10),
        //         startDelay: 500,
        //         spacing: 3,
        //         speed: 5,
        //         backSpeed: 7,
        //         blink: {
        //             interval: 100
        //         }
        //     },
        //     letter: {
        //         spacing: 0.1,
        //         quality: 'medium'
        //     }
        // })));

        // this.textRows.push(this.mainScreen.addChild(new AppearingText({
        //     repeat: true,
        //     position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 170) ,
        //     size: new V2(50, 15),
        //     textValue: ['I am big', 'Slow', 'And lazy'],
        //     textChangeDelay: 5000,
        //     cursorOptions: {
        //         startDelay: 1500,
        //         size: new V2(3,18),
        //         spacing: 3,
        //         speed: 0.5,
        //         backSpeed: 2,
        //         blink: {
        //             interval: 500
        //         }
        //     },
        //     letter: {
        //         spacing: 0.3,
        //         quality: 'medium',
        //         fontSize: 20,
        //         height: 25,
        //         effects: ['fadein']
        //     }
        // })));

        // this.addClearText = createTimer(20000, () => {
        //     this.addClearText = undefined;

        //     this.textRows.push(this.mainScreen.addChild(new AppearingText({
        //         repeat: false,
        //         position: new V2(-this.mainScreen.size.x/2 + 20, -this.mainScreen.size.y/2 + 200) ,
        //         size: new V2(50, 15),
        //         textValue: ['Clear all in', '3', '2', '1', '...'],
        //         textChangeDelay: 500,
        //         cursorOptions: {
        //             size: new V2(1,10),
        //             startDelay: 500,
        //             spacing: 3,
        //             backSpeed: 5,
        //              colors: ['#FF0000']
        //         },
        //         letter: {
        //             spacing: 0.5,
        //             quality: 'high',
        //             colors: ['#FF0000']
        //         }
        //     })));
        // }, this, false)


        // this.clearTextTimer = createTimer(27500, () => {
        //     this.clearTextTimer = undefined;
        //     for(let i = 0;i < this.textRows.length;i++){
        //         this.textRows[i].clear();
        //         this.textRows[i].cursor.addEffect(new SizeInEffect({updateDelay: 40, effectTime: 1000, startDelay: 2000, dimension: 'y', initOnAdd: true}))
        //     }
        // }, this, false)
    }

    }
    backgroundRender(){
        // SCG.contexts.background.fillStyle = 'black';
        // SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
        SCG.contexts.background.drawImage(this.bgImage, 0,0, SCG.viewport.real.width,SCG.viewport.real.height)
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
            letters: [],
            multiline: {
                enabled: false, 
                maxLinesVisible: 3,
                current: 0,
                lineHeight: undefined,
                behavior: 'linesup'
            },
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
                removeOnComplete: false,
                colors: ['#839009', '#557557'],
                blink: {
                    currentCount: -1,
                    interval: 250,
                    
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

        if(options.multiline.enabled){
            if(options.multiline.lineHeight === undefined)
                options.multiline.lineHeight = options.letter.height;   

            if(['linesup', 'cursordown'].indexOf(options.multiline.behavior) === -1)
                throw 'Wrong AppearingText multiline behavior!'
        }

        

        super(options);

        if(this.letter.quality){
            switch(this.letter.quality){
                case 'ultrahigh': 
                    this.letter.imgSizeMultiplier = 5;
                    this.cursorOptions.originImgSize = new V2(1, 20);
                    break;
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
                that.setContextFillStyle(ctx, size, that.cursorOptions.colors);
                ctx.fillRect(0,0, size.x, size.y);
            }),
            speed: this.cursorOptions.speed,
            destinationCompleteCallBack() {
                if(this.state == 'showing'){
                    if(this.mustReturn){
                        this.mustReturn = false;
                        this.state = 'hiding';
                        this.start(new V2(0, this.position.y));
                        return;
                    }
                    else {
                        this.state = 'idle';
                        this.parent.returnCursor();
                    }  
                }
                else if(this.state =='hiding' || this.state =='nothing'){
                    this.state = 'idle';
                    this.parent.showText();
                    this.position = new V2(0, this.position.y);
                    //this.positionChangedCallback();
                    this.needRecalcRenderProperties = true;
                }

                that.startCursorBlinking();
            },
            positionChangedCallback(){
                if(this.state == 'showing'){
                    let letters = that.letters;
                    if(that.multiline.enabled){
                        letters = that.letters.filter(l => l.line == that.multiline.current)
                    }
                    for(let i = 0; i < letters.length;i++){
                        let letter = letters[i];
                        if(letter.isVisible)
                            continue;
                        
                        if(letter.position.x + letter.size.x/2 > this.position.x)
                            continue;
    
                        letter.position.y = this.position.y;
                        letter.needRecalcRenderProperties = true;
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
                    this.start(new V2(0, this.position.y))
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
        if(!this.textValue.length){
            return;
        }
            

        let textValue = this.textValue.shift();
        let that = this;
        if(!this.multiline.enabled &&  this.letters && this.letters.length){
            for(let i = 0; i < this.letters.length;i++){
                this.removeChild(this.letters[i]);
            }

            this.letters = [];
        }

        

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
            let _letter = this.addChild(new GO({
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
            }));

            if(this.multiline.enabled){
                _letter.line = this.multiline.current;
            }

            this.letters.push(_letter);
            currentCharX+=(letterWidth/2 + this.letter.spacing);
        }

        this.cursor.isVisible = true;
        this.cursor.position = new V2(tl.clone().x, this.cursor.position.y);
        
        let cursorDestination = new V2(size.x, 0).add(new V2( (this.cursorOptions.size.x/2) + this.cursorOptions.spacing ,this.cursor.position.y));

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
                this.cursor.start(new V2(0, this.cursor.position.y));
                if(this.multiline.enabled){
                    let m = this.multiline;
                    m.current++;
                    this.cursor.state = 'nothing';
                    if(m.behavior == 'linesup'){
                        this.letters.forEach((letter) => {
                            letter.position.y-=m.lineHeight;
                            letter.needRecalcRenderProperties = true;
    
                            if(m.maxLinesVisible != -1)
                                letter.isVisible = (letter.line > (m.current - m.maxLinesVisible));
                        })
                    }
                    else if(m.behavior == 'cursordown'){
                        this.cursor.position.y+=m.lineHeight;
                        this.cursor.needRecalcRenderProperties = true;
                        this.cursor.start(new V2(0, this.cursor.position.y));
                    }

                }
            }
            else{
                if(this.cursorOptions.removeOnComplete)
                {
                    this.stopCursorBlinking();
                    this.cursor.isVisible = false;
                }   
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
                size: new V2(0.125, 0.125)
            },
            bordersOptions: {
                width: 0.1,
                size: new V2(0.1, 0.1),
                widthSizeDimension: 'x',
                color: '#6A7334',
                additionalColor: '#512F24',
                junctionColor: '#6A7334'
            }
        }, options);

        super(options);

        let that = this;

        this.background = this.addChild(new GO({
            position: new V2(),
            size: this.size.clone(),
            img: createCanvas(this.size, function(ctx, size){
                ctx.fillStyle = 'black';
                ctx.fillRect(0,0, size.x, size.y);

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

            let color = hexToRgb(this.backlightOptions.color, true);
            let setCtx = function(ctx, grd, size){
                grd.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.25)`)
                grd.addColorStop(0.2, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.15)`)
                grd.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`)
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);
            }
            this.backlights.left = this.addChild(new GO({
                position: new V2(-this.size.x/2 + this.size.x*this.backlightOptions.size.x/2, 0),
                size: new V2(this.size.x*this.backlightOptions.size.x, this.size.y),
                img: createCanvas(new V2(20, 1), function(ctx, size){
                    let grd = ctx.createLinearGradient(0, 0, size.x, 0);
                    setCtx(ctx, grd, size);
                })
            }));

            this.backlights.right = this.addChild(new GO({
                position: new V2(this.size.x/2 - this.size.x*this.backlightOptions.size.x/2, 0),
                size: new V2(this.size.x*this.backlightOptions.size.x, this.size.y),
                img: createCanvas(new V2(20, 1), function(ctx, size){
                    let grd = ctx.createLinearGradient(size.x, 0, 0, 0);
                    setCtx(ctx, grd, size);
                })
            }));

            this.backlights.top = this.addChild(new GO({
                position: new V2(0, -this.size.y/2 + this.size.y*this.backlightOptions.size.y/2),
                size: new V2(this.size.x, this.size.y*this.backlightOptions.size.y),
                img: createCanvas(new V2(1, 20), function(ctx, size){
                    let grd = ctx.createLinearGradient(0, 0, 0, size.y);
                    setCtx(ctx, grd, size);
                })
            }))

            this.backlights.bottom = this.addChild(new GO({
                position: new V2(0, this.size.y/2 - this.size.y*this.backlightOptions.size.y/2),
                size: new V2(this.size.x, this.size.y*this.backlightOptions.size.y),
                img: createCanvas(new V2(1, 20), function(ctx, size){
                    let grd = ctx.createLinearGradient(0, size.y, 0, 0);
                    setCtx(ctx, grd, size);
                })
            }))
        }

        let sideSize = new V2(this.size[this.bordersOptions.widthSizeDimension]*this.bordersOptions.width, this.size.y - this.size[this.bordersOptions.widthSizeDimension]*this.bordersOptions.width);
        let topSideSize = new V2(this.size.x - this.size[this.bordersOptions.widthSizeDimension]*this.bordersOptions.width, this.size[this.bordersOptions.widthSizeDimension]*this.bordersOptions.width)
        let cornerSize = new V2(this.size[this.bordersOptions.widthSizeDimension]*this.bordersOptions.width, this.size[this.bordersOptions.widthSizeDimension]*this.bordersOptions.width);
        let fillWithDots = function(ctx, size) {
            for(let i = 0; i < size.x*size.y; i++){
                ctx.fillStyle = `rgba(0,0,255,${getRandom(0,0.05)})`;
                ctx.fillRect(getRandomInt(0,size.x-2), getRandomInt(0,size.y-2), 1, 1);
            }
        }
        this.borders = {
            left: this.addChild(new GO({
                position: new V2(-this.size.x/2, 0),
                size: sideSize,
                img: createCanvas(sideSize, function(ctx, size){
                    let img = createCanvas(new V2(20, 1), function(ctx, size){
                        ctx.fillStyle = that.bordersOptions.color; ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = 'rgba(255,255,255, 0.25)'; ctx.fillRect(0,0, size.x*0.25, size.y);
                        ctx.fillStyle = 'rgba(0,0,0, 0.25)'; ctx.fillRect(size.x*0.75,0, size.x*0.25, size.y);
                        ctx.fillStyle = that.bordersOptions.additionalColor; ctx.fillRect(size.x/2 - 1, 0, 2, 1);
                    });

                    ctx.drawImage(img, 0,0, size.x-1, size.y);

                    fillWithDots(ctx, size);
                })
            })),
            right: this.addChild(new GO({
                position: new V2(this.size.x/2, 0),
                size: sideSize,
                img: createCanvas(sideSize, function(ctx, size){
                    let img = createCanvas(new V2(20, 1), function(ctx, size){
                        ctx.fillStyle = that.bordersOptions.color; ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = 'rgba(255,255,255, 0.25)'; ctx.fillRect(0,0, size.x*0.25, size.y);
                        ctx.fillStyle = 'rgba(0,0,0, 0.25)'; ctx.fillRect(size.x*0.75,0, size.x*0.25, size.y);
                        ctx.fillStyle = that.bordersOptions.additionalColor; ctx.fillRect(size.x/2 - 1, 0, 2, 1);
                    });

                    ctx.drawImage(img, 0,0, size.x-1, size.y);
                    fillWithDots(ctx, size);
                })
            })),
            top: this.addChild(new GO({
                position: new V2(0, -this.size.y/2),
                size: topSideSize,//new V2(this.size.x*this.bordersOptions.size.x*9, this.size.y*this.bordersOptions.size.y),
                img: createCanvas(topSideSize, function(ctx, size){
                    let img = createCanvas(new V2(1, 20), function(ctx, size){
                        ctx.fillStyle = that.bordersOptions.color; ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = 'rgba(255,255,255, 0.25)'; ctx.fillRect(0,0,size.x,size.y*0.25);
                        ctx.fillStyle = 'rgba(0,0,0, 0.25)'; ctx.fillRect(0,size.y*0.75,size.x,size.y*0.25);
                        ctx.fillStyle = that.bordersOptions.additionalColor; ctx.fillRect(0, size.y/2 - 1, 1, 2);
                    });

                    ctx.drawImage(img, 0,0, size.x, size.y-1);
                    fillWithDots(ctx, size);
                })
            })),
            bottom: this.addChild(new GO({
                position: new V2(0, this.size.y/2),
                size: topSideSize,
                img: createCanvas(topSideSize, function(ctx, size){
                    let img = createCanvas(new V2(1, 20), function(ctx, size){
                        ctx.fillStyle = that.bordersOptions.color; ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = 'rgba(255,255,255, 0.25)'; ctx.fillRect(0,0,size.x,size.y*0.25);
                        ctx.fillStyle = 'rgba(0,0,0, 0.25)'; ctx.fillRect(0,size.y*0.75,size.x,size.y*0.25);
                        ctx.fillStyle = that.bordersOptions.additionalColor; ctx.fillRect(0, size.y/2 - 1, 1, 2);
                    })

                    ctx.drawImage(img, 0,0, size.x, size.y-1);
                    fillWithDots(ctx, size);
                })
            })),
            topLeft: this.addChild(new GO({
                position: new V2(-this.size.x/2, -this.size.y/2),
                size: cornerSize,
                img: createCanvas(cornerSize, function(ctx, size){
                    let img = createCanvas(new V2(20, 20), function(ctx, size){
                        ctx.fillStyle = that.bordersOptions.color; ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = 'rgba(255,255,255, 0.25)'; ctx.fillRect(0,0, size.x*0.25, size.y);ctx.fillRect(size.x*0.25,0, size.x*0.75, size.y*0.25);
                        ctx.fillStyle = 'rgba(0,0,0, 0.25)'; ctx.fillRect(size.x*0.75,size.y*0.75,size.x*0.25,size.y*0.25);
                        ctx.fillStyle = that.bordersOptions.additionalColor; ctx.fillRect(size.x/2-1, size.y/2 - 1, 2, size.y/2 + 1); ctx.fillRect(size.x/2 + 1, size.y/2 - 1, size.x/2, 2);
                    });

                    ctx.drawImage(img,0,0, size.x-1, size.y-1);
                    fillWithDots(ctx, size);
                })
            })),
            topRight: this.addChild(new GO({
                position: new V2(this.size.x/2, -this.size.y/2),
                size: cornerSize,
                img: createCanvas(cornerSize, function(ctx, size){
                    let img = createCanvas(new V2(20, 20), function(ctx, size){
                        ctx.fillStyle = that.bordersOptions.color; ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = 'rgba(0,0,0, 0.25)'; ctx.fillRect(size.x*0.75,size.y*0.25, size.x*0.25, size.y);
                        ctx.fillStyle = 'rgba(255,255,255, 0.25)'; ctx.fillRect(0,0,size.x*0.75,size.y*0.25);
                        draw(ctx,{fillStyle:'rgba(255,255,255, 0.25)', points: [new V2(size.x*0.75, size.y*0.25), new V2(size.x*0.75, 0), new V2(size.x, 0)]})
                        draw(ctx,{fillStyle:'rgba(0,0,0, 0.25)', points: [new V2(size.x*0.75, size.y*0.25), new V2(size.x, 0), new V2(size.x, size.y*0.25)]})
                        ctx.fillStyle = that.bordersOptions.additionalColor; ctx.fillRect(size.x/2-1, size.y/2 - 1, 2, size.y/2 + 1); ctx.fillRect(0, size.y/2 - 1, size.x/2-1, 2);
                        draw(ctx,{fillStyle:'rgba(255,255,255, 0.25)', points: [new V2(0, size.y), new V2(size.x*0.25, size.y*0.75), new V2(size.x*0.25, size.y)]})
                        draw(ctx,{fillStyle:'rgba(0,0,0, 0.25)', points: [new V2(0, size.y), new V2(0, size.y*0.75), new V2(size.x*0.25, size.y*0.75)]})
                    })

                    ctx.drawImage(img,0,0, size.x-1, size.y-1);
                    fillWithDots(ctx, size);
                })
            })),
            bottomLeft: this.addChild(new GO({
                position: new V2(-this.size.x/2, this.size.y/2),
                size: cornerSize,
                img: createCanvas(cornerSize, function(ctx, size){
                    let img = createCanvas(new V2(20, 20), function(ctx, size){
                        ctx.fillStyle = that.bordersOptions.color; ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = 'rgba(0,0,0, 0.25)'; ctx.fillRect(size.x*0.25,size.y*0.75, size.x*0.75, size.y*0.25);
                        ctx.fillStyle = 'rgba(255,255,255, 0.25)'; ctx.fillRect(0,0,size.x*0.25,size.y*0.75);
                        draw(ctx,{fillStyle:'rgba(0,0,0, 0.25)', points: [new V2(size.x*0.75, size.y*0.25), new V2(size.x*0.75, 0), new V2(size.x, 0)]})
                        draw(ctx,{fillStyle:'rgba(255,255,255, 0.25)', points: [new V2(size.x*0.75, size.y*0.25), new V2(size.x, 0), new V2(size.x, size.y*0.25)]})
                        ctx.fillStyle = that.bordersOptions.additionalColor; ctx.fillRect(size.x/2-1, 0, 2, size.y/2 + 1); ctx.fillRect(size.x/2+1, size.y/2 - 1, size.x/2-1, 2);
                        draw(ctx,{fillStyle:'rgba(0,0,0, 0.25)', points: [new V2(0, size.y), new V2(size.x*0.25, size.y*0.75), new V2(size.x*0.25, size.y)]})
                        draw(ctx,{fillStyle:'rgba(255,255,255, 0.25)', points: [new V2(0, size.y), new V2(0, size.y*0.75), new V2(size.x*0.25, size.y*0.75)]})
                    })

                    ctx.drawImage(img,0,0, size.x-1, size.y-1);
                    fillWithDots(ctx, size);
                })
            })),
            bottomRight: this.addChild(new GO({
                position: new V2(this.size.x/2, this.size.y/2),
                size:cornerSize,
                img: createCanvas(cornerSize, function(ctx, size){
                    let img = createCanvas(new V2(20, 20), function(ctx, size){
                        ctx.fillStyle = that.bordersOptions.color; ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = 'rgba(0,0,0, 0.25)'; ctx.fillRect(0,size.y*0.75, size.x, size.y*0.25);ctx.fillRect(size.x*0.75,0, size.x*0.25, size.y*0.75);
                        ctx.fillStyle = 'rgba(255,255,255, 0.25)'; ctx.fillRect(0,0,size.x*0.25,size.y*0.25);
                        ctx.fillStyle = that.bordersOptions.additionalColor; ctx.fillRect(size.x/2-1, 0, 2, size.y/2 + 1); ctx.fillRect(0, size.y/2 - 1, size.x/2-1, 2);
                    })

                    ctx.drawImage(img,0,0, size.x-1, size.y-1);
                    fillWithDots(ctx, size);
                })
            }))
        }
    }
}