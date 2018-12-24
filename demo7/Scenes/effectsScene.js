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

        for(let r = 0; r < this.vCount; r++){
            for(let c = 0; c < this.hCount; c++){
                let go = new DemoObject({
                    size: this.itemSize,
                    position: new V2(this.itemSize.x*c + this.itemSize.x/2, this.itemSize.y*r + this.itemSize.y/2),
                    img: this.itemImg,
                    //addDelay: c%2 == 0
                });

                if(c%2==0){
                    go.addEffect(new FadeOutEffect({updateDelay: 50, effectTime: 5000, completeCallback: () => console.log('fadeout completed')}))
                }
                else {
                    go.addEffect(new FadeInEffect({updateDelay: 50, effectTime: 5000, completeCallback: () => console.log('fadein completed')}))
                }

                this.addGo(go)
            }
        }
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

