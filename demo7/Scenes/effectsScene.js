class EffectsScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            hCount: 10,
            vCount: 5
        }, options)

        super(options);

        this.itemImg = createCanvas(new V2(10, 10), function(ctx, size){
            ctx.fillStyle = 'red';
            ctx.fillRect(0,0,size.x, size.y);
        })
        this.itemSize = new V2(this.viewport.x/this.hCount, this.viewport.y/this.vCount);
        this.layers = [
            {
                speed: 0.25,
                size: new V2(25,25),
                bodySize: new V2(5, 5),
                layer: 2,
                count: 6, 
                blackness: 0.5,
                fadeInOut: {min: 0.3, max: 0.4}
            },
            {
                speed: 0.5,
                size: new V2(50,50),
                bodySize: new V2(10, 10),
                layer: 4,
                count: 4, 
                blackness: 0.25,
                fadeInOut: {min: 0.4, max: 0.6}
            },
            {
                speed: 1,
                size: new V2(100,100),
                bodySize: new V2(20, 20),
                layer: 6,
                count: 2, 
                blackness: 0,
                fadeInOut: {min: 0.5, max: 0.75},
                bright: true
            }

        ]

        /*for(let r = 0; r < this.vCount; r++){
            for(let c = 0; c < this.hCount; c++){
                let go = new DemoObject({
                    size: this.itemSize,
                    position: new V2(this.itemSize.x*c + this.itemSize.x/2, this.itemSize.y*r + this.itemSize.y/2),
                    img: this.itemImg,
                    //addDelay: c%2 == 0
                });

                // if(c%2==0){
                //     go.addEffect(new FadeOutEffect({updateDelay: 50, effectTime: 5000, completeCallback: () => console.log('fadeout completed')}))
                // }
                // else {
                //     go.addEffect(new FadeInEffect({updateDelay: 50, effectTime: 5000, completeCallback: () => console.log('fadein completed')}))
                // }

                go.addEffect(new FadeInOutEffect({updateDelay: 50, effectTime: 1000, loop: true, startDelay: c*100}))

                this.addGo(go)
            }
        }*/

        this.fallingTimer = createTimer(2000, this.fallingTimerMethod, this, true);
        

        //falling.addEffect(new FadeInOutEffect({updateDelay: 50, effectTime: 1000, loop: true, min: 0.8}))
    }

    fallingTimerMethod(){
        for(let li = 0; li < this.layers.length; li++){
            let layer = this.layers[li];
            for(let c = 0; c < layer.count; c++){
                this.fallingGenerator(layer);
            }
        }
    }

    fallingGenerator(layer) {
        let position = new V2(getRandom(0, this.viewport.x), - getRandom(60, 120));
        let colors = [getRandomInt(0,255),getRandomInt(0,255),getRandomInt(0,255)];
        if(layer.bright){
            let rgb = [0, 1, 2];
            let fullIndex = getRandomInt(0, rgb.length -1);
            fullIndex = rgb.splice(fullIndex, 1)[0];
            colors[fullIndex] = 255;

            let emptyIndex = getRandomInt(0, rgb.length -1);
            emptyIndex = rgb.splice(emptyIndex, 1)[0];
            colors[emptyIndex] = 0;

            colors[rgb[0]] = getRandomInt(0,255);
        }
        this.addGo(new MovingGO({
            color: colors,//[getRandomInt(0,255),getRandomInt(0,255),getRandomInt(0,255)],
            size: layer.size,
            bodySize: layer.bodySize,
            position: position,
            destination: new V2(position.x, this.viewport.y+layer.size.y/2),
            setDeadOnDestinationComplete: true,
            setDestinationOnInit: true,
            speed: layer.speed,
            blackness: layer.blackness,
            init(){
                let that =this;
                this.body = this.addChild(new GO({
                    img: createCanvas(new V2(1,1), function(ctx, size) {
                        ctx.fillStyle = `rgb(${that.color[0]},${that.color[1]},${that.color[2]})`; ctx.fillRect(0,0,size.x, size.y);
                        if(that.blackness > 0){
                            ctx.fillStyle = `rgba(0,0,0, ${that.blackness})`;
                            ctx.fillRect(0,0,size.x, size.y);
                        }
                    }),
                    size: this.bodySize,
                    position: new V2()
                }))

                this.reInitFadeouts();

                let shine = this.addChild(new GO({
                    size: this.size.clone(),
                    position: new V2(),
                    img: createCanvas(new V2(10,10), function(ctx, size){
                        let grd = ctx.createRadialGradient(size.x/2, size.x/2, 0, size.x/2, size.y/2, size.x/2);
                        grd.addColorStop(0, `rgba(${that.color[0]},${that.color[1]},${that.color[2]}, 1)`)
                        grd.addColorStop(1, `rgba(${that.color[0]},${that.color[1]},${that.color[2]}, 0)`)
                        ctx.fillStyle = grd;
                        ctx.fillRect(0,0, size.x, size.y);
                        grd = ctx.createRadialGradient(size.x/2, size.x/2, 0, size.x/2, size.y/2, size.x/2);
                        grd.addColorStop(0, `rgba(0,0,0, ${that.blackness})`)
                        grd.addColorStop(1, `rgba(0,0,0, 0)`)
                        ctx.fillStyle = grd;
                        //ctx.fillStyle = `rgba(0,0,0, ${that.blackness})`;
                        ctx.fillRect(0,0,size.x, size.y);
                    })
                }))

                shine.addEffect(new FadeInOutEffect({updateDelay: 50, effectTime: 500, loop: true, min: layer.fadeInOut.min, max: layer.fadeInOut.max}))
            },
            reInitFadeouts() {
                this.createdFadeOuts = {};
                for(let i = -80; i < this.destination.y+this.bodySize.y; i+=this.bodySize.y){
                    this.createdFadeOuts[i] = false;
                }
            },
            positionChangedCallback: function(){
                let key = parseInt(this.position.y);
                if(key%this.bodySize.y == 0 && this.createdFadeOuts[key] != undefined && !this.createdFadeOuts[key]){
                    this.createdFadeOuts[key] = true;
                    let fadeout = new GO({
                        size: this.bodySize.clone(),
                        position: this.position.clone(),
                        img: this.body.img
                    });
                    fadeout.addEffect(new FadeOutEffect({updateDelay: 50, effectTime: 3000, max: 0.6, setParentDeadOnComplete: true}));
                    this.parentScene.addGo(fadeout);
                }
            }
            // destinationCompleteCallBack: function(){
            //     this.position = new V2(this.parentScene.viewport.x/2, -100);
            //     this.setDestination(new V2(this.position.x, this.parentScene.viewport.y+100));
            //     this.reInitFadeouts();
            // }
        }),layer.layer);
    }

    afterMainWork(now){
        if(this.fallingTimer)
            doWorkByTimer(this.fallingTimer, now);
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

class DemoObject extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            
        }, options)

        super(options);

        // this.addEffect(new FadeOutEffect({
        //     startDelay: this.addDelay ? 2000 : 0,
        //     updateDelay: 50,
        //     effectTime: 5000
        // }));
    }
}

