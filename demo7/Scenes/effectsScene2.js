class EffectsScene2 extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            hCount: 160,
            vCount: 80,
            realPixels: {
                hContains: 10,
                vContains: 10,
                // hCount: 16,
                // vCount: 8
            }
        }, options)

        super(options);

        this.itemImg = createCanvas(new V2(1, 1), function(ctx, size){
            ctx.fillStyle = 'red';
            ctx.fillRect(0,0,size.x, size.y);
        })

        this.itemGreenImg = createCanvas(new V2(1, 1), function(ctx, size){
            ctx.fillStyle = 'darkgreen';
            ctx.fillRect(0,0,size.x, size.y);
        })
        this.itemSize = new V2(this.viewport.x/this.hCount, this.viewport.y/this.vCount);
        this.gradientVerticalSize = 80;
        // this.go = this.addGo(new GO({
        //     position: new V2(this.viewport.x/2, this.viewport.y/2),
        //     size: new V2(20,20),
        //     img: createCanvas(new V2(1,1), function(ctx, size){
        //         ctx.fillStyle = 'red';
        //         ctx.fillRect(0,0, size.x, size.y);
        //     })
        // }));

        // this.go.addEffect(new SizeInEffect({effectTime: 1000, updateDelay: 50, removeVisibilityOnComplete: true, removeEffectOnComplete: true}))

        // for(let r = 0; r < this.vCount; r++){
        //     for(let c = 0; c < this.hCount; c++){
        //         let go = new DemoObject({
        //             size: this.itemSize.clone(),
        //             position: new V2(this.itemSize.x*c + this.itemSize.x/2, this.itemSize.y*r + this.itemSize.y/2),
        //             img: this.itemImg,
        //         });

        //         //go.addEffect(new SizeInEffect({updateDelay: 50, effectTime: 1000, loop: false, startDelay: r*1000 + c*100, dimension: 'y', initOnAdd: false}))
        //         go.addEffect(new SizeInEffect({updateDelay: 40, effectTime: 1000, loop: false, startDelay: (r+1)*getRandomInt(250, 500), dimension: 'y', initOnAdd: false}))

        //         this.addGo(go, 10)

        //         let go1 = this.addGo(new DemoObject({
        //             size: this.itemSize.clone(),
        //             position: new V2(this.itemSize.x*c + this.itemSize.x/2, this.itemSize.y*r + this.itemSize.y/2),
        //             img: this.itemGreenImg,
        //         }), 9);

        //         go1.addEffect(new SizeInEffect({updateDelay: 40, effectTime: 1000, loop: false, startDelay: (r+1)*getRandomInt(250, 500)+5000, dimension: 'y', initOnAdd: false}))
        //     }
        // }

        this.generator();
    }

    createRealPixel(r,c, size, img){
        return new DemoObject({
            size: size.clone(),
            position: new V2(size.x*c + size.x/2, size.y*r + size.y/2),
            img: img 
        })
    }

    createPixel(r, c, color){
        return new DemoObject({
            size: this.itemSize.clone(),
            position: new V2(this.itemSize.x*c + this.itemSize.x/2, this.itemSize.y*r + this.itemSize.y/2),
            img: createCanvas(new V2(1,1), function(ctx, size){
                let colors = []
                if(!isArray(color)){
                    colors[0] = color;
                }
                else {
                    colors = color;
                }
                for(let c of colors){
                    ctx.fillStyle = c; ctx.fillRect(0,0, size.x, size.y);
                }
                
            }),
        })
    }

    generator(){
        //sky part
        let skyFrom = 0; 
        let skyTo = parseInt(this.vCount*1/3);
        let groundFrom = skyTo;
        let groundTo = this.vCount;


        let upperLayerDelay = 10000;
        let lowerLayerDelay = 10000;
        let addEffects = false;
        
        let daySkyColors = []// ['#75D5E3', '#8AE5FF', '#ACF5FB', '#C3FBF9', '#CDF9FF'];
        let dayFieldColors = []
        let darkSkyColors = [];
        let darkFieldColors = []
        createCanvas(new V2(4,this.gradientVerticalSize), function(ctx, size){
            let grd = ctx.createLinearGradient(0,0, 0, size.y-1);
            grd.addColorStop(0, '#75D5E3'); grd.addColorStop(1, '#CDF9FF');
            ctx.fillStyle = grd; ctx.fillRect(0,0, size.x/4, size.y);
            
            grd = ctx.createLinearGradient(size.x/4,0, size.x/4, size.y-1);
            grd.addColorStop(0, '#EFF583'); grd.addColorStop(1, '#235420');
            ctx.fillStyle = grd; ctx.fillRect(size.x/4,0, size.x/4, size.y);

            grd = ctx.createLinearGradient(size.x*2/4,0, size.x*2/4, size.y-1);
            grd.addColorStop(0, '#010026'); grd.addColorStop(1, '#070056');
            ctx.fillStyle = grd; ctx.fillRect(size.x*2/4,0, size.x/4, size.y);

            grd = ctx.createLinearGradient(size.x*3/4,0, size.x*3/4, size.y-1);
            grd.addColorStop(0, '#0E210C'); grd.addColorStop(1, '#040A03');
            ctx.fillStyle = grd; ctx.fillRect(size.x*3/4,0, size.x/4, size.y);

            for(let r = 0; r < size.y;r++){
                let p = ctx.getImageData(0, r, 1, 1).data; 
                daySkyColors[r] = [p[0], p[1], p[2]];

                p = ctx.getImageData(size.x/4, r, 1, 1).data; 
                dayFieldColors[r] = [p[0], p[1], p[2]]

                p = ctx.getImageData(size.x*2/4, r, 1, 1).data; 
                darkSkyColors[r] = [p[0], p[1], p[2]]

                p = ctx.getImageData(size.x*3/4, r, 1, 1).data; 
                darkFieldColors[r] = [p[0], p[1], p[2]]
            }

            
        });

        let sunPosition = new V2(this.itemSize.x*parseInt(this.hCount*2/3) + this.itemSize.x/2, this.itemSize.y*parseInt((skyTo-skyFrom)/2) + this.itemSize.y/2);
        let sunSize = 14;
        let sunShineSize0 = 20;
        let sunShineSize1 = 30;
        let sunShineSize2 = 45;

        let clouds = [{
            position: new V2(this.itemSize.x*parseInt(this.hCount*1/7) + this.itemSize.x/2, this.itemSize.y*parseInt((skyTo-skyFrom)*9/12) + this.itemSize.y/2),
            size: new V2(140, 2.5),
            opacity: 0.5,
        },
        {
            position: new V2(this.itemSize.x*parseInt(this.hCount*1/4) + this.itemSize.x/2, this.itemSize.y*parseInt((skyTo-skyFrom)*4/5) + this.itemSize.y/2),
            size: new V2(100, 2.5),
            opacity: 0.4,
        }, {
            position: new V2(this.itemSize.x*parseInt(this.hCount*4/12) + this.itemSize.x/2, this.itemSize.y*parseInt((skyTo-skyFrom)*7/8) + this.itemSize.y/2),
            size: new V2(70, 3),
            opacity: 0.3,
        },
        {
            position: new V2(this.itemSize.x*parseInt(this.hCount*1/12) + this.itemSize.x/2, this.itemSize.y*parseInt((skyTo-skyFrom)*7/8) + this.itemSize.y/2),
            size: new V2(10, 3),
            opacity: 0.3,
        },
        {
            position: new V2(this.itemSize.x*parseInt(this.hCount*5/12) + this.itemSize.x/2, this.itemSize.y*parseInt((skyTo-skyFrom)*9/10) + this.itemSize.y/2),
            size: new V2(50, 3),
            opacity: 0.25
        }]

        let cloudColors = ['CDD8EB', 'DDE0F2', 'D6D9F0', 'E6EDF2', 'CADAE1'];

        let randomizeColor = function(value, shift){
            value += getRandomInt(-shift, shift);
            if(value < 0)
                value = 0;
            
            if(value > 255)
                value = 255;

            return value;
        }

        let pixels = [];
        for(let r = 0; r < this.vCount; r++){
            pixels[r] = [];
            for(let c = 0; c < this.hCount; c++){
                let isSky = r >= skyFrom && r <= skyTo;
                let currentPixelPosition = new V2(this.itemSize.x*c + this.itemSize.x/2, this.itemSize.y*r + this.itemSize.y/2);                
                

                let upperColor = undefined;
                let lowerColor = undefined;
                let additionalUpperColor = undefined;
                let additionalLowerColor = undefined;
                if(isSky){
                    upperColor = daySkyColors[parseInt(r*(daySkyColors.length-1)/(skyTo-skyFrom))]//'#CDF9FF';
                    upperColor = '#' + rgbToHex(upperColor[0], upperColor[1], upperColor[2]);

                    lowerColor = darkSkyColors[parseInt(r*(darkSkyColors.length-1)/(skyTo-skyFrom))]
                    lowerColor = '#' + rgbToHex(lowerColor[0], lowerColor[1], lowerColor[2]);

                    if(getRandomInt(0,7) == 7){
                        additionalLowerColor = `skyrgba(217,247,249, ${1 - (r*1/skyTo)})`;
                    }
                }
                else {
                    let upperColorRGB = dayFieldColors[parseInt((r - (skyTo + 1))*(dayFieldColors.length-1)/(groundTo-groundFrom-1))]//'#235420'
                    let groundColorChangeChance = (r-(skyTo+1))*1/(groundTo-groundFrom-1);
                    let changeG = getRandom(0,1) < groundColorChangeChance;
                    upperColor = '#' + rgbToHex(upperColorRGB[0],changeG ? randomizeColor(upperColorRGB[1], 15) : upperColorRGB[1], upperColorRGB[2])
                    if(changeG)
                        additionalUpperColor = '#'+rgbToHex(upperColorRGB[0], upperColorRGB[1], upperColorRGB[2])

                    changeG = getRandom(0,1) < groundColorChangeChance; 
                    let lowerColorRGB = darkFieldColors[parseInt((r - (skyTo + 1))*(darkFieldColors.length-1)/(groundTo-groundFrom-1))]
                    lowerColor = '#' + rgbToHex(lowerColorRGB[0],changeG ? randomizeColor(lowerColorRGB[1], 5) : lowerColorRGB[1], lowerColorRGB[2])
                    if(changeG)
                        additionalLowerColor = 'rgba(76,255,0,1)'; //'#'+rgbToHex(lowerColorRGB[0], lowerColorRGB[1], lowerColorRGB[2])
                }

                //sun - moon
                if(isSky){
                    let d = sunPosition.distance(currentPixelPosition);
                    if(d <= sunSize){
                        let b = parseInt((200/sunSize)*d);
                        if(b > 255) b = 255;
                        let sc = [255,242, b]

                        upperColor = '#'+ rgbToHex(sc[0], sc[1], sc[2])//'#FFF200';
                        lowerColor = 'white';
                        let moonColors = ['#685A4F', '#4B3C35', '#A89688', '#8F7D6F', '#5E5F64', '#DFDCD5', '#81807E']
                        if(getRandomInt(0,1) == 1){
                            let c = hexToRgb(moonColors[getRandomInt(0, moonColors.length-1)], true);
                            
                            lowerColor = [lowerColor, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.5 - d*0.5/sunSize})`]
                        }
                    }
                    else if(d <= sunShineSize0){
                        upperColor = [upperColor, 'rgba(255,255,255,0.35)']
                        lowerColor = [lowerColor, 'rgba(255,255,255,0.1)']
                    }
                    else if(d <= sunShineSize1){
                        upperColor = [upperColor, 'rgba(255,255,255,0.25)']
                        lowerColor = [lowerColor, 'rgba(255,255,255,0.05)']
                    }
                    else if(d <= sunShineSize2){
                        upperColor = [upperColor, 'rgba(255,255,255,0.15)']
                        lowerColor = [lowerColor, 'rgba(255,255,255,0.025)']
                    }

                    for(let cloud of clouds){
                        if(Math.abs(currentPixelPosition.x - cloud.position.x) <= cloud.size.x && Math.abs(currentPixelPosition.y - cloud.position.y) <= cloud.size.y){
                            let color = [255,255,255];
                            // if(getRandomInt(0,5) == 5){
                            //     color = hexToRgb(cloudColors[getRandomInt(0, cloudColors.length-1)], true);
                            // }
                            upperColor = [upperColor, `rgba(${color[0]},${color[1]},${color[2]},${cloud.opacity})`];
                        }
                    }
                    
                }

                pixels[r][c] = { upperColor, lowerColor, additionalUpperColor, additionalLowerColor };
            }
        }

        if(this.hCount%this.realPixels.hContains != 0 || this.vCount%this.realPixels.vContains != 0){
            throw 'cant create real pixels from count and contains';
        }
        let realHCount = this.hCount/this.realPixels.hContains;
        let realVCount = this.vCount/this.realPixels.vContains;

        let realPixelCanvasSize = new V2(this.itemSize.x*this.realPixels.hContains, this.itemSize.y*this.realPixels.vContains);
        let that = this;
        let createImg = function(r, c, colorType, additionals) {
            return createCanvas(new V2(that.realPixels.hContains, that.realPixels.vContains), function(ctx, size){
                for(let _r = 0; _r < that.realPixels.vContains; _r++){
                    for(let _c = 0; _c < that.realPixels.hContains; _c++){
                        let pixelColorsData = pixels[r*that.realPixels.vContains+_r][c*that.realPixels.hContains+_c];
                        
                        if(colorType == 'upperColor' && pixelColorsData.additionalUpperColor){
                            additionals.push({c: _c, r: _r, color: pixelColorsData.additionalUpperColor});
                        }

                        if(colorType == 'lowerColor' && pixelColorsData.additionalLowerColor){
                            additionals.push({c: _c, r: _r, color: pixelColorsData.additionalLowerColor});
                        }

                        let colors = []
                        if(!isArray(pixelColorsData[colorType])){
                            colors[0] = pixelColorsData[colorType];
                        }
                        else {
                            colors = pixelColorsData[colorType];
                        }

                        for(let c of colors){
                            ctx.fillStyle = c;
                            ctx.fillRect(_c, _r, 1, 1);
                        }
                        
                    }
                }
            })
        }

        //debugger;
        for(let r = 0; r < realVCount; r++){
            for(let c = 0; c < realHCount; c++){
                let additionals = [];
                let img = createImg(r, c,'upperColor', additionals)
                let goUpper = this.createRealPixel(r,c, realPixelCanvasSize, img);
                if(additionals.length){
                    let tl = new V2(-goUpper.size.x/2, -goUpper.size.y/2);
                    for(let additional of additionals){
                        if(getRandomInt(0, 4) == 4){
                            let ch = goUpper.addChild(new GO({
                                position: tl.add(new V2(additional.c*this.itemSize.x, additional.r*this.itemSize.y)).add(this.itemSize.divide(2)),//new V2(),
                                size: this.itemSize.clone(),
                                img: createCanvas(new V2(1,1), function(ctx, size){
                                    ctx.fillStyle = additional.color;
                                    ctx.fillRect(0,0, size.x, size.y);
                                })
                            }))

                            ch.toggleTimer = createTimer(getRandomInt(500, 2500), function(){ this.isVisible = !this.isVisible; }, ch, true);
                            ch.internalUpdate = function(now){
                                if(this.toggleTimer)
                                    doWorkByTimer(this.toggleTimer, now);
                            }
                        }
                            
                    }
                    
                }
                let startDelay = upperLayerDelay + (c+1)*200 + getRandomInt(100, 500)//(r+1)*500 + getRandomInt(250, 500);

                goUpper.addEffect(new SizeInEffect({updateDelay: 40, effectTime: 1000, loop: false, startDelay: startDelay, dimension: 'both', initOnAdd: false}));
                goUpper.addEffect(new FadeOutEffect({updateDelay: 50, effectTime: 750, startDelay: startDelay, beforeStartCallback: function(){
                    this.parent.childProcesser((child) => {child.isVisible = false; child.toggleTimer = undefined; })
                } }));
                this.addGo(goUpper, 10);

                additionals = [];
                let goLower = this.createRealPixel(r,c, realPixelCanvasSize, createImg(r, c,'lowerColor', additionals));
                if(additionals.length){ 
                    let tl = new V2(-goLower.size.x/2, -goLower.size.y/2);
                    for(let additional of additionals){
                        let isSky = additional.color.indexOf('sky') != -1;
                        if(isSky){
                            additional.color = additional.color.replace('sky', '');
                        }

                        if(getRandomInt(0, 20) == 20){
                            let ch = goLower.addChild(new GO({
                                position: tl.add(new V2(additional.c*this.itemSize.x, additional.r*this.itemSize.y)).add(this.itemSize.divide(2)),//new V2(),
                                size: this.itemSize.clone(),
                                img: createCanvas(new V2(1,1), function(ctx, size){
                                    ctx.fillStyle = additional.color;
                                    ctx.fillRect(0,0, size.x, size.y);
                                })
                            }))

                            let max = r* 1/realVCount;
                            let min = getRandom(0, max/2);
                            if(isSky){
                                max = 1;
                                min = 0.5;
                            }
                            ch.addEffect(new FadeInOutEffect({updateDelay: 50, effectTime:isSky ? getRandomInt(2000, 5000) : getRandomInt(500,2000), loop: true, max: max, min: min}))
                        }
                            
                    }
                }
                this.addGo(goLower, 9);
            }
        }
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}



class SizeEffect extends EffectBase {
    constructor(options = {}){
        options = assignDeep({}, {
            effectTime: undefined,
            step: 0.05,
            current: 1,
            min: 0,
            max: 1,
            direction: -1,
            dimension: 'x',
            updateDelay: 100,
            loop: false
        }, options)

        if(options.dimension != 'x' && options.dimension != 'y' && options.dimension != 'both'){
            throw `Wrong dimension '${options.dimension}' specified for SizeEffect`;
        }

        if(options.dimension == 'both'){
            options.removeVisibilityOnComplete = true;
            options.min = 0.01;
        }

        super(options);

        if(this.effectTime) {
            this.step = (this.max - this.min)/ (this.effectTime/this.updateDelay);
        }

        this.workTimer = createTimer(this.updateDelay, () => {
            if(this.completed)
                return;

            this.current+=this.direction*this.step;

            if(this.current >= this.max){
                this.current = this.max;

                if(this.loop){
                    this.direction = -1;
                }
                else {
                    this.__completeCallback();
                }
            }

            if(this.current <= this.min){
                this.current = this.min;
                
                if(this.loop){
                    this.direction = 1;
                }
                else {
                    this.__completeCallback();
                }
            }
        }, this, this.startImmediately);

        this.internalWorkMethod = () => {
            if(this.dimension == 'both'){
                this.parent.size = this.parent.effectOriginSize.mul(this.current);
            }
            else 
                this.parent.size[this.dimension] = this.parent.effectOriginSize[this.dimension]*this.current;

            this.parent.needRecalcRenderProperties = true;
        }
    }

    init() {
        this.parent.effectOriginSize = this.parent.size.clone();

        this.internalWorkMethod();
    }

    beforeUpdate(now){
        if(!this.enabled)
            return;

        this.internalWorkMethod();
    }
}

class SizeInEffect extends SizeEffect {
    constructor(options = {}){
        options = assignDeep({}, {
            direction: -1
        }, options)

        super(options);
    }
}

class SizeOutEffect extends SizeEffect {
    constructor(options = {}){
        options = assignDeep({}, {
            direction: 1,
            current: 0
        }, options)

        super(options);
    }
}