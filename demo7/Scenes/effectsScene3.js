class EffectsScene3 extends Scene {
    constructor(options) {
        options = assignDeep({}, {
            debug: {
                enabled: true
            }
        }, options)

        super(options);

        this.imgCache = {};
    }

    start() {
        this.itemSize = new V2(20,20);
        this.hCount = parseInt(this.viewport.x/this.itemSize.x);
        this.vCount = parseInt(this.viewport.y/this.itemSize.y);
        for(let r = 0;r <=this.vCount;r++){
            for(let c = 0; c <= this.hCount;c++){
                let item = this.addGo(new GO({
                    position: new V2(this.itemSize.x*c, this.itemSize.y*r),
                    size: this.itemSize.mul(0.9),
                    img: this.getImg()
                }));

                item.addEffect(new FadeInOutEffect({
                    effectTime: getRandomInt(5,10)*100, 
                    updateDelay:50, 
                    loop: true,
                    max: 0.1, 
                    startDelay: getRandomInt(0, 1000),
                    oddLoopCallback: function(){
                        this.parent.img = this.parent.parentScene.getImg()
                    }
                }))
            }
        }

        this.effectsTimer = createTimer(250, () => {
            this.debug.additional[0] =  this.goLayers.map(l => l == undefined ? 0 : l.length).reduce((a, b) => a+b, 0);
            this.generator()}, this, true);
        this.linesTimer = createTimer(500, () => this.lineGenerator(), this, true);
        
    }

    getColor() {
        let colors = [getRandomInt(0,255),getRandomInt(0,255),getRandomInt(0,255)];
        let rgb = [0, 1, 2];
        let fullIndex = getRandomInt(0, rgb.length -1);
        fullIndex = rgb.splice(fullIndex, 1)[0];
        colors[fullIndex] = 255;

        let emptyIndex = getRandomInt(0, rgb.length -1);
        emptyIndex = rgb.splice(emptyIndex, 1)[0];
        colors[emptyIndex] = 0;

        colors[rgb[0]] = getRandomInt(0,255);

        return colors;
    }

    getImg(){
        let color = this.getColor();
        let key = rgbToHex(color[0], color[1], color[2]);
        let cacheItem = this.imgCache[key];
        if(cacheItem == undefined)    
        {
            cacheItem = createCanvas(new V2(1,1), (ctx, size) => {
                ctx.fillStyle = '#'+rgbToHex(color[0], color[1], color[2]); ctx.fillRect(0,0,size.x, size.y);
            });

            this.imgCache[key] = cacheItem;
        }

        return cacheItem;
    }

    lineGenerator() {
        let isV = getRandomBool();
        let max = isV ? this.vCount : this.hCount;
        let staticP = getRandomInt(0, isV ? this.hCount : this.vCount);
        let img = this.getImg();
        let speed = getRandomInt(50,150);
        let effetTime = getRandomInt(3,7);
        for(let i = 0; i <= max; i++){
            let item = this.addGo(new GO({
                position: isV ? new V2(this.itemSize.x*staticP, i*this.itemSize.y) : new V2(i*this.itemSize.x,staticP*this.itemSize.y),
                size: this.itemSize.mul(0.9),
                img: img,
                isVisible: false,
            }));

            item.addEffect(new FadeOutEffect({
                beforeStartCallback: function() { this.parent.isVisible = true; },
                effectTime: effetTime*100, 
                updateDelay:50, 
                max: 1, 
                startDelay: i*speed,
                setParentDeadOnComplete: true
            }))
        }
    }

    generator() {
        let color = this.getColor();
        let img = createCanvas(new V2(1,1), (ctx, size) => {
            ctx.fillStyle = '#'+rgbToHex(color[0], color[1], color[2]); ctx.fillRect(0,0,size.x, size.y);
        });

        
        let item = this.addGo(new GO({
            position: new V2(getRandomInt(0, this.hCount)*this.itemSize.x, getRandomInt(0, this.vCount)*this.itemSize.y),
            size: this.itemSize,
            img: img,
            init() {
                this.originPosition = this.position.clone();
                this.glitchTimer = createTimer(100, () => {
                    this.position = this.originPosition.add(new V2(getRandom(-1,1), getRandom(-1,1)));
                    this.needRecalcRenderProperties = true;
                }, this. true)
            },
            internalUpdate(now){
                // if(this.glitchTimer)
                //     doWorkByTimer(this.glitchTimer, now);
            }
        }));

        item.addEffect(new FadeInOutEffect({
            effectTime: getRandomInt(5,10)*100, 
            updateDelay:50, 
            loop: false, 
            //min: 0.5, 
            direction: 1,
            current: 0,
            setParentDeadOnComplete: true,
            completeCallback: function() {
                let l = getRandomInt(2,4);
                let from = new V2(-l,-l);
                let to = new V2(l,l);
                let size = this.parent.size.mul(0.9);
                
                let maxOpacity = 1;
                let decreaseOpacity = getRandomBool();
                let waveEffectTime = 200//getRandomInt(2,5)*100
                for(let r = from.y;r <=to.y;r++){
                    for(let c = from.x; c <= to.x;c++){
                        if(r == 0 && c == 0)
                            continue;

                        let innerGo = this.parent.parentScene.addGo(new GO({
                            position: new V2(this.parent.position.x + c*this.parent.size.x, this.parent.position.y + r*this.parent.size.y),
                            size: size,
                            img: this.parent.img,
                            isVisible: false,
                        }));
        
                        let far= Math.max(Math.abs(r),Math.abs(c));
                        // if(decreaseOpacity){
                        //     maxOpacity = 1-(0.8*far/l);
                        // }
                        innerGo.addEffect(new FadeInOutEffect({startDelay: (far-1)*100, 
                            beforeStartCallback: function() { this.parent.isVisible = true; },
                            effectTime: waveEffectTime, updateDelay: 25, loop: false,direction:1,current: 0, max: maxOpacity, setParentDeadOnComplete: true}))
                    }
                }
        }}));
    }

    afterMainWork(now){
        if(this.effectsTimer)
            doWorkByTimer(this.effectsTimer, now);

        if(this.linesTimer)
            doWorkByTimer(this.linesTimer, now);
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}