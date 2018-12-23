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
                this.addGo(new DemoObject({
                    size: this.itemSize,
                    position: new V2(this.itemSize.x*c + this.itemSize.x/2, this.itemSize.y*r + this.itemSize.y/2),
                    img: this.itemImg,
                    addDelay: c%2 == 0
                }))
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

        this.addEffect(new FadeOutEffect({
            startDelay: this.addDelay ? 2000 : 0,
            updateDelay: 50,
            effectTime: 5000
        }));
    }
}

class EffectBase {
    constructor(options = {}){
        assignDeep(this, {
            enabled: true,
            startDelay: 0,
            completed: false,
            removeEffectOnComplete: false,
            setParentDeadOnComplete: false,
            disableEffectOnComplete: false,
            startImmediately: true,
            mustRemove: false,
            workTimer: undefined,
            delayTimer: undefined
        }, options)

        if(this.startDelay > 0){
            this.enabled = false;
            this.delayTimer = createTimer(this.startDelay, 
                () => { this.delayTimer = undefined; this.enabled = true; }, 
                this, false);
        }

        this.__completeCallback = () => { 
            this.completed = true;

            if(this.setParentDeadOnComplete){
                this.parent.setDead();
            }

            if(this.removeEffectOnComplete){ //TODO: test
                this.mustRemove = true;
                this.enabled = false;
            }

            if(this.disableEffectOnComplete){
                this.enabled = false;
            }

            this.completeCallback();
        }
    }

    init(parent){
        this.parent = parent;
        this.context = this.parent.context;
    }

    beforeRender(){}
        
    afterRender(){}

    beforeUpdate(){}
        
    afterUpdate(now){
        if(this.delayTimer){
            doWorkByTimer(this.delayTimer, now);
        }

        if(!this.enabled)
            return;

        if(this.workTimer){
            doWorkByTimer(this.workTimer, now);
        }
    }

    completeCallback() {

    }
}

class FadeInEffect extends EffectBase {
    constructor(options = {}){
        options = assignDeep({}, {
            effectTime: undefined,
            step: 0.05,
            current: 0,
            updateDelay: 100,
            originalGlobalAlpha: undefined
        }, options)

        super(options);

        if(this.effectTime) {
            this.step = 1/ (this.effectTime/this.updateDelay);
        }

        this.workTimer = createTimer(this.updateDelay, () => {
            if(this.completed)
                return;

            this.current+=this.step;

            if(this.current >= 1){
                this.current = 1;

                this.__completeCallback();
            }
        }, this, this.startImmediately);
    }

    beforeRender() {
        if(!this.enabled)
            return;

        this.originalGlobalAlpha = this.context.globalAlpha;
        this.context.globalAlpha = this.current;
    }

    afterRender(){
        if(!this.enabled)
            return;

        this.context.globalAlpha = this.originalGlobalAlpha;
    }
}

class FadeOutEffect extends EffectBase {
    constructor(options = {}){
        options = assignDeep({}, {
            effectTime: undefined,
            step: 0.05,
            current: 1,
            updateDelay: 100,
            originalGlobalAlpha: undefined
        }, options)

        super(options);

        if(this.effectTime) {
            this.step = 1/ (this.effectTime/this.updateDelay);
        }

        this.workTimer = createTimer(this.updateDelay, () => {
            if(this.completed)
                return;

            this.current-=this.step;

            if(this.current <= 0){
                this.current = 0;

                this.__completeCallback();
            }
        }, this, this.startImmediately);
    }

    beforeRender() {
        if(!this.enabled)
            return;

        this.originalGlobalAlpha = this.context.globalAlpha;
        this.context.globalAlpha = this.current;
    }

    afterRender(){
        if(!this.enabled)
            return;

        this.context.globalAlpha = this.originalGlobalAlpha;
    }
}