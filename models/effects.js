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
            initOnAdd: false,
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

            if(this.removeVisibilityOnComplete){
                this.parent.isVisible = false;
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

class FadeInOutEffect extends EffectBase {
    constructor(options = {}){
        options = assignDeep({}, {
            effectTime: undefined,
            step: 0.05,
            current: 1,
            updateDelay: 100,
            originalGlobalAlpha: undefined,
            loop: false,
            direction: -1,
            max: 1,
            min: 0
        }, options)

        super(options);

        if(this.effectTime) {
            this.step = (this.max - this.min)/ (this.effectTime/this.updateDelay);
        }

        this.worksCount = this.loop ? -1 : 2;

        this.workTimer = createTimer(this.updateDelay, () => {
            if(this.completed)
                return;

            if(this.worksCount == 0){
                this.__completeCallback();
                return;
            }

            this.current+=this.direction*this.step;

            if(this.current >= this.max){
                this.current = this.max;
                this.direction = -1;

                if(this.worksCount != -1)
                    this.worksCount--;
            }

            if(this.current <= this.min){
                this.current = this.min;
                this.direction = 1;

                if(this.worksCount != -1)
                    this.worksCount--;
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
            originalGlobalAlpha: undefined,
            max: 1
        }, options)

        super(options);

        this.current = this.max;

        if(this.effectTime) {
            this.step = this.max/ (this.effectTime/this.updateDelay);
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