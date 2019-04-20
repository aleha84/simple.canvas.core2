class EffectBase {
    constructor(options = {}){
        assignDeep(this, {
            enabled: true,
            startDelay: 0,
            completed: false,
            removeEffectOnComplete: false,
            setParentDeadOnComplete: false,
            disableEffectOnComplete: false,
            removeVisibilityOnComplete: false,
            startImmediately: true,
            mustRemove: false,
            initOnAdd: false,
            workTimer: undefined,
            delayTimer: undefined
        }, options)

        if(this.startDelay > 0){
            this.enabled = false;
            this.delayTimer = createTimer(this.startDelay, 
                () => { this.delayTimer = undefined; this.enabled = true; this.beforeStartCallback(); }, 
                this, false);
        }

        this.__completeCallback = () => { 
            this.completed = true;

            if(this.setParentDeadOnComplete){
                this.parent.setDead();
            }

            if(this.removeEffectOnComplete){ 
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

        this.__init = (parent) => {
            this.parent = parent;
            this.context = this.parent.context;

            if(this.startDelay == 0){
                this.beforeStartCallback();
            }

            this.init();
        }
    }

    init(){
       
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

    beforeStartCallback() {}
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
            min: 0,
            delayOnLoop: undefined
        }, options)

        super(options);

        if(this.effectTime) {
            this.step = (this.max - this.min)/ (this.effectTime/this.updateDelay);
        }

        this.worksCount = this.loop ? -1 : (this.worksCount || 2);

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
                else  {
                    this.loopCallback();
                    if(this.delayOnLoop) {
                        this.enabled = false;
                        this.delayTimer = createTimer(this.delayOnLoop, 
                            () => { this.delayTimer = undefined; this.enabled = true; }, 
                            this, false);
                    }
                }
            }

            if(this.current <= this.min){
                this.current = this.min;
                this.direction = 1;

                if(this.worksCount != -1)
                    this.worksCount--;
                else 
                    this.oddLoopCallback();
            }

        }, this, this.startImmediately);
    }

    loopCallback() {}
    oddLoopCallback() {}

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

        if(options.dimension == 'both' && !options.loop && options.direction == -1){
            options.removeVisibilityOnComplete = true;
            options.min = 0.01;
        }

        if(options.direction == 1){
            options.current = options.min;
        }
        else if(options.direction == -1){
            options.current = options.max;
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

class SizeInOutEffect extends SizeEffect {
    constructor(options = {}){
        options = assignDeep({}, {
            direction: -1,
            loop: true
        }, options)

        super(options);
    }
}