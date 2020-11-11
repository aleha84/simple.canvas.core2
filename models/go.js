class GO {
    constructor(options = {}){
        
        if(!options.position || !(options.position instanceof V2)){
            console.trace();
            throw `No position defined for graphical object`;
        }
            
        if(!options.size || !(options.size instanceof V2)){
            console.trace()
            throw 'No size defined for grapthical object';
        }
            

        var objectContext = this;

        this.renderValuesRound = false;
        this.needRecalcRenderProperties = true;

        assignDeep(this, {
            debug: false,
            logInDebug: false,
            alive: true,
            id: undefined,
            img: undefined,
            imgPropertyName: undefined,
            context: undefined,
            contextName: 'main',
            selected: false,
            handlers: {},
            isAnimated: false,
            isCustomRender: false,
            needRecalcRenderProperties: true,
            customScale: new V2(1,1),
            isStatic: false, // not affected by camera position shift - only for UI elements
            sendEventsToAI: true,
            parentScene: undefined,
            isVisible: true,
            childrenGO: [],
            tileOptimization: false,
            initialized: false,
            disabled: false,
            effects: [],
            timers: [],
            renderValuesRound: false,
            script: {
                currentStep: undefined,
                options: {
                    timerDelay: 50,
                },
                items: [],
                callbacks: {
                    completed: function() {}
                }
            },
            collisionDetection: {
                enabled: false,
                render: false,
                needRecalcBox: false,
                exclude: [],
                cells: [],
                circuit: [], // контурные точки для более точного детектирования, точки относительно position (0,0) в центре.
                preCheck: function(go){ return true; }, // some light checking before collision should be checked, if false returned then no cd check will be performed
                onCollision: function(collidedWithGo, collisionPoints, details){}
            },
            animation: { // todo test needed
                totalFrameCount: 0,
                framesInRow: 0,
                framesRowsCount: 0,
                frameChangeDelay: 0,
                destinationFrameSize: new V2, // original image frame size
                sourceFrameSize: new V2, // logical size
                currentDestination : new V2,
                currentFrame: 0,
                startFrame: undefined,
                endFrame: undefined,
                reverse: false,
                paused: false,
                loop : false,
                completed: false,
                animationTimer : undefined,
                animationEndCallback: function(){},
                animationRestartCallback: function(){},
                setFrameChangeDelay(value) {
                    this.animationTimer.currentDelay = value;
                    this.animationTimer.originDelay = value;
                },
                frameChange : function(){
                    if(this.paused || this.completed){
                        return;
                    }
        
                    if(this.reverse){
                        this.currentFrame--;	
                    }
                    else
                    {
                        this.currentFrame++;
                    }
        
                    let startFrame = this.startFrame !== undefined ? this.startFrame : 1;
                    let endFrame = this.endFrame !== undefined ? this.endFrame : this.totalFrameCount;

                    if((!this.reverse && this.currentFrame > endFrame)
                        || (this.reverse && this.currentFrame < startFrame)
                        ){
                        if(this.loop){
                            this.currentFrame = this.reverse? endFrame :  startFrame;
                            this.animationRestartCallback.call(objectContext);
                        }
                        else{
                            this.completed = true;
                            this.animationEndCallback.call(objectContext);
                            return;
                        }
                    }
                    var crow = Math.ceil(this.currentFrame/this.framesInRow);
                    var ccol = this.framesInRow - ((crow*this.framesInRow) - this.currentFrame);
                    this.currentDestination = new V2(ccol - 1, crow - 1);
                }
            }
        }, options);

        if(this.isStatic) // if static then it is UI canvas
            this.contextName = "ui";

        if(!this.destSourceSize)
            this.destSourceSize = this.size;

        if(this.isAnimated){
            this.size = this.animation.destinationFrameSize.clone();
            this.animation.currentFrame = 0;
            this.animation.animationTimer = {
                lastTimeWork: new Date,
                delta : 0,
                currentDelay: this.animation.frameChangeDelay,
                originDelay: this.animation.frameChangeDelay,
                doWorkInternal : this.animation.frameChange,
                context: this.animation
            };
        }

        if(!this.boxRenderProperties)
            this.boxRenderProperties = new RenderProperties();

        if(this.parent){
            this.getAbsolutePosition();
        }

        this.type = this.constructor.name;

        if(GO.counter[this.type] == undefined)
            GO.counter[this.type] = 0;

        GO.counter[this.type]++;

        if(this.id == undefined)
            this.id = this.type + '_' + GO.counter[this.type];	

        this.creationTime = new Date;

        //this.regClick();

        if(this.img == undefined && this.imgPropertyName != undefined)
            this.img = SCG.images[this.imgPropertyName];

        if(typeof this.img === 'string'){
            if(SCG.images[this.img] == undefined){
                console.trace();
                throw `SCG.images has no ${this.img} propery`;
            }

            this.img = SCG.images[this.img];
        }

        if(this.sendEventsToAI && SCG.AI && SCG.AI.worker)
            SCG.AI.sendEvent({ type: 'created', message: {goType: this.type, id: this.id, position: this.position.clone() }});

        let ctx = SCG.contexts[this.contextName];
        
        if(ctx)
            this.context = ctx;

        this.console('ctor completed.')

    }

    static createInstanceByName(name, options){
        let _class = eval(name);

        if(!isClass(_class))
            return undefined;

        return new _class(options);
    }

    static getTextPropertyDefaults(value){
        if(!value)
            value = 'value';

        return {
            value: value,
            size: 20,
            color: 'black',
            border: false,
            align: 'center',
            font: 'Arial',
            autoCenter: false,
            textBaseline: 'middle'
        };
    }

    init() {

    }

    initCompleted() {
        
    }

    console(message) {
        if(this.debug){
            if(this.logInDebug){
                console.log(this.id + ' ' + message);
            }
        }
            
    }

    beforeDead(){}

    afterDead() {}

    setDead() {
        if(!this.alive) // can setDead only once
            return;

        this.childProcesser((child) => child.setDead());

		this.beforeDead();
        
        if(this.collisionDetection.enabled) {
            this.parentScene.collisionDetection.remove(this);
        }
        
        this.unRegEvents();

		//send to ai msg
        if(this.sendEventsToAI && SCG.AI && SCG.AI.worker)
            SCG.AI.sendEvent({ type: 'removed', message: {goType: this.type, id: this.id }});	

        this.alive = false;

        if(this.parent){
            this.parent.removeChild(this);
        }

        this.console('setDead completed.');
    }

    getAllChildren() {
        let root = this;
        let result = [];
        let getChildren = function(go){
            if(go.childrenGO.length){
                result = [...result, ...go.childrenGO];
                go.childrenGO.map(function(item) {
                    getChildren(item);
                });
            }
        }

        if(this.parent){
            let parent = this.parent;
            while(parent.parent != undefined){
                parent = parent.parent;
            }

            root = parent;
        }

        result.push(root);
        getChildren(root);

        return result;
    }

    removeEffect(effect){
        if(effect === undefined)
            return;

        let index = this.effects.indexOf(effect);
        if(index !== -1){
            this.effects.splice(index,1);
            effect.parent = undefined;
        }
    }

    addEffect(effect){
        if(!(effect instanceof EffectBase))
            throw 'Effect must be derived from EffectBase class';

        this.effects.push(effect);

        if(effect.initOnAdd){
            effect.__init(this);
        }

        return effect;
    }

    addChild(childGo, regEvents = false, asFirst = false) {
        if(childGo == undefined || !(childGo instanceof GO)){
            console.warn('Can\'t add to children object isn\'t inherited from GO');
            return;
        }
    
        if(asFirst){
            this.childrenGO.unshift(childGo);
        }
        else {
            this.childrenGO.push(childGo);
        }
        
        childGo.parent = this;

        if(regEvents)
            childGo.regEvents(this.layerIndex);

        if(childGo.collisionDetection.enabled){
            let all = this.getAllChildren().filter(function(go){ return go.collisionDetection.enabled });
            all.map((go) => go.collisionDetection.exclude = all);
        }

        return childGo;
    }

    removeChild(childGo) {
        if(childGo === undefined)
            return;

        let index = this.childrenGO.indexOf(childGo);
        if(index !== -1){
            this.childrenGO.splice(index,1);
            childGo.parent = undefined;
            childGo.unRegEvents();
        }

        if(childGo.collisionDetection.enabled){
            let all = getAllChildren().filter(function(go){ return go.collisionDetection.enabled });
            all.map((go) => go.collisionDetection.exclude = all);
        }
    }

    effectsProcesser(action){
        if(!action)
            return;

        if(!this.effects.length)
            return;

        let toRemove = [];
        for(let i = 0; i < this.effects.length; i++){
            let effect = this.effects[i];
            action(effect);

            if(effect.mustRemove){
                toRemove.push(effect);
            }
        }

        if(toRemove.length){
            for(let r = 0; r < toRemove.length; r++){
                this.effects = this.effects.splice(this.effects.indexOf(toRemove[r], 1));
            }
        }

        toRemove = undefined;
    }

    childProcesser(action){
        if(!action)
            return;

        if(!this.childrenGO.length)
            return;

        for(let i = 0; i < this.childrenGO.length; i++){
            action(this.childrenGO[i]);
        }
    }

    getAbsolutePosition(){
        let parent = this.parent;
        let aPosition = this.position.clone();
        while(parent !== undefined){
            aPosition.add(parent.position, true);
            parent = parent.parent;
        }

        this.absolutePosition = aPosition;
        return aPosition;
    }

    calculateCollisionBox(){
        if(!this.collisionDetection.enabled)
            return; 

        let most = {
            left: this.box.topLeft.x,
            top: this.box.topLeft.y,
            right: this.box.bottomRight.x,
            bottom: this.box.bottomRight.y
        }

        let getMosts = function(item){
            if(item.box.topLeft.x < most.left) most.left = item.box.topLeft.x;
            if(item.box.topLeft.y < most.top) most.top = item.box.topLeft.y;
            if(item.box.bottomRight.x > most.right) most.right = item.box.bottomRight.x;
            if(item.box.bottomRight.y > most.bottom) most.bottom = item.box.bottomRight.y;

            if(item.collisionDetection.circuit){
                let position = item.position;
                if(item.parent){
                    position = item.absolutePosition;
                }

                for(let i = 0; i < item.collisionDetection.circuit.length;i++){
                    let cp = item.collisionDetection.circuit[i].add(position);
                    if(cp.x < most.left) most.left = cp.x;
                    else if(cp.x > most.right) most.right = cp.x;
                    if(cp.y < most.top) most.top = cp.y;
                    else if(cp.y > most.bottom) most.bottom = cp.y;
                }
            }

            if(item.childrenGO.length){
                for(let ci = 0; ci < item.childrenGO.length; ci++){
                    getMosts(item.childrenGO[ci]);
                }
            }
        }

        getMosts(this);
        let tl = new V2(most.left, most.top);
        let size = new V2(most.right-most.left, most.bottom-most.top);
        if(!this.collisionDetection.box)
            this.collisionDetection.box = new Box(tl, size)
        else 
            this.collisionDetection.box.update(tl, size)
    }
    
    customRender(){ }
        
    internalPreRender(){}
        
    internalRender(){}

    render(){ 
        if(this.disabled || !this.alive || !this.renderPosition || !this.isVisible)
            return;

		this.internalPreRender();

        this.effectsProcesser((effect) => effect.beforeRender());

        let rsx,rsy, rtlX, rtlY;

		if(this.isCustomRender)
		{
			this.customRender();
		}
		else{
            let ctx = this.context;
            let rp = this.renderPosition;

			if(this.img != undefined)
			{
				
                rsx = this.renderSize.x;
                rsy = this.renderSize.y;

                if(this.customScale.x !== 1)
                    rsx *= this.customScale.x;

                if(this.customScale.x !== 1)
                    rsy *= this.customScale.y;
                
				let dsp = this.destSourcePosition;
				let s = this.size;

                rtlX = rp.x - rsx/2;
                rtlY = rp.y - rsy/2;

                if(this.renderValuesRound){
                    rtlX = fastRoundWithPrecision(rtlX, 0);
                    rtlY = fastRoundWithPrecision(rtlY, 0);
                    rsx = fastRoundWithPrecision(rsx, 0);
                    rsy = fastRoundWithPrecision(rsy, 0);
                }
                
				if(this.isAnimated)
				{
					let ani = this.animation;
					ctx.drawImage(this.img,  
						ani.currentDestination.x * ani.sourceFrameSize.x,
						ani.currentDestination.y * ani.sourceFrameSize.y,
						ani.sourceFrameSize.x,
						ani.sourceFrameSize.y,
						rtlX,
						rtlY,
						rsx,
						rsy
					);
				}
				else{
					if(dsp != undefined){ //draw part of image (sprite sheet)
						ctx.drawImage(this.img, 
							dsp.x,
							dsp.y,
							this.destSourceSize.x,
							this.destSourceSize.y,
							rtlX, 
							rtlY, 
							rsx, 
							rsy);		
					}
					else { // draw simple img without any modifications
						ctx.drawImage(this.img, 
							rtlX, 
							rtlY, 
							rsx, 
							rsy);			
					}
					
				}
            }	
            
            if(this.text){
                this.renderText();
            }

            if(this.collisionDetection && this.collisionDetection.enabled && this.collisionDetection.render){
                this.renderCollisionDetection()
            }
		}
        
        this.childProcesser((child) => child.render());

        this.effectsProcesser((effect) => effect.afterRender());

        this.internalRender(rsx,rsy, rtlX, rtlY);

        this.console('render completed.');
    }

    renderCollisionDetection() {
        let scale = SCG.viewport.scale;
        let cdBoxTLRender = this.collisionDetection.box.topLeft.mul(scale);
        this.context.strokeStyle = '#00BFFF';
        this.context.strokeRect(cdBoxTLRender.x, cdBoxTLRender.y, this.collisionDetection.box.width*scale, this.collisionDetection.box.height*scale);

        if(this.collisionDetection.circuit.length){
            let position = this.position;
            if(this.parent){
                position = this.absolutePosition;
            }

            draw(
                this.context, 
                {
                    lineWidth: 2,
                    strokeStyle: 'red',
                    closePath: true,
                    points: this.collisionDetection.circuit.map((item) => item.add(position).mul(scale))
                }
            )
        }
    }
    
    renderText(){
        let ctx = this.context;

        ctx.save();

        let text = this.text;
        ctx.font = text.renderFont;
        ctx.fillStyle = text.color;
        ctx.textAlign = text.align;
        ctx.textBaseline = text.textBaseline;

        let textValue = text.value;
        if(text.preparer && isFunction(text.preparer)){
            textValue = text.preparer(this, textValue)
        }

        ctx.fillText(textValue, text.renderPosition.x, text.renderPosition.y);

        ctx.restore();
    }
    
    internalPreUpdate(now){}
        
    internalUpdate(now){}

    beforeUpdateStarted() {}

    afterUpdateCompleted() {}

    update(now){
        this.beforeUpdateStarted();

        if(this.disabled){
            return;
        }

        if(this.img == undefined && this.imgPropertyName != undefined){ //first run workaround
			this.img = SCG.images[this.imgPropertyName];
			if(this.img == undefined){
				throw `Cant achieve image named: ${this.imgPropertyName}`;
			}
		}

		if(this.context == undefined && this.contextName != undefined){
			this.context = SCG.contexts[this.contextName];
			if(this.context == undefined){
				throw `Cant achieve context named: ${this.contextName} `;
			}
        }
        
        if(!this.initialized){
            this.initialized = true;
            this.init(now);

            let that = this;
            this.effectsProcesser((effect) => effect.__init(that));

            this.initCompleted();
        }

        this.internalPreUpdate(now);

        this.effectsProcesser((effect) => effect.beforeUpdate(now));

        if(!this.isStatic && (!this.alive || SCG.logics.isPaused || SCG.logics.gameOver || SCG.logics.wrongDeviceOrientation)){
            this.console('update not completed.');
			return false;
		}

        let scale = SCG.viewport.scale;
        if(this.needRecalcRenderProperties){
            this.childProcesser((child) => child.needRecalcRenderProperties = true);

            this.renderSize = this.size.mul(scale);
            let position = this.position;

            if(this.parent) // if child element
            {
                position = this.getAbsolutePosition();
            }

            let tl = new V2(position.x - this.size.x/2,position.y - this.size.y/2);
            if(!this.box)
                this.box = new Box(tl, this.size, this.boxRenderProperties); //logical positioning box
            else
                this.box.update(tl, this.size);

            this.renderPosition = undefined;
            if(SCG.viewport.logical.isIntersectsWithBox(this.collisionDetection.box ||  this.box) || this.isStatic)
            {
                this.renderPosition = position.add(this.isStatic ? new V2 : SCG.viewport.shift.mul(-1)).mul(scale);

                if(this.tileOptimization){
                    this.renderSize.x +=0.5;
                    this.renderSize.y +=0.5;
                }

                let rtl = new V2(this.renderPosition.x - this.renderSize.x/2, this.renderPosition.y - this.renderSize.y/2);

                if(!this.renderBox)
                    this.renderBox = new Box(rtl, this.renderSize, this.boxRenderProperties);
                else 
                    this.renderBox.update(rtl, this.renderSize);

                if(this.text){
                    let text = this.text;
                    text.renderSize = text.size*scale;
                    text.renderFont = `${text.renderSize}px ${text.font}`;
                    if(text.autoCenter){
                        text.align = 'left';
                        this.context.save();

                        this.context.font = text.renderFont;
                        this.context.textAlign = text.align;
                        text.renderPosition = 
                            this.renderBox.topLeft.add(
                                new V2(
                                    (this.renderSize.x/2) - (this.context.measureText(text.value).width/2), 
                                    (this.renderSize.y/2)
                                )
                            );

                            this.context.restore();
                    }
                    else 
                        text.renderPosition = text.position ? this.renderBox.topLeft.add(text.position.mul(scale)) : this.renderPosition;
                }
            }

            this.needRecalcRenderProperties = false;
            
            if(this.collisionDetection.enabled) {
                this.collisionDetection.needRecalcBox = true;
            }
        }

		if(this.isAnimated)
            doWorkByTimer(this.animation.animationTimer, now);
        
        this.internalUpdate(now);
        
        this.processTimers(now);

        if(this.scriptTimer) 
            doWorkByTimer(this.scriptTimer, now);

		if(!this.alive){
            this.console('update completed. this.alive = false');
            return false;
        }

        this.effectsProcesser((effect) => effect.afterUpdate(now));

        this.childProcesser((child) => child.update(now));

        if(this.collisionDetection.enabled && this.collisionDetection.needRecalcBox){
            this.collisionDetection.needRecalcBox = false;
            this.calculateCollisionBox();
            let parentScene = undefined;
            if(this.parent != undefined){
                let parent = this.parent;
                while(parent.parent != undefined){
                    parent = parent.parent;
                }

                parentScene = parent.parentScene;
            }
            else {
                parentScene = this.parentScene;
            }

            parentScene.collisionDetection.update(this);
        }
            
        this.afterUpdateCompleted();
        this.console('update completed.');
    }

    regEvents(layerIndex = 0){
        if(!SCG.controls.initialized)
            SCG.controls.initialize();

        this.layerIndex = layerIndex;

        //register click for new objects
        let that = this;
        Object.keys(this.handlers).forEach(function(key) {
            if(that.handlers[key] && isFunction(that.handlers[key])){
                let ehLayer = undefined;
    
                if(that.isStatic)
                    ehLayer = SCG.controls.mouse.state.UIEventsHandlers[key];
                else {
                    let eh = SCG.controls.mouse.state.eventHandlers;
                    if(eh[key] === undefined)
                        return;

                    if(eh[key][layerIndex] === undefined)
                        eh[key][layerIndex] = [];
    
                    ehLayer = eh[key][layerIndex];
                }
                
                if(ehLayer === undefined)
                    return;

                if(ehLayer.indexOf(that) === -1){
                    ehLayer.push(that);
                }
            }
        })
    }
    
    unRegEvents() {
        let that = this;
        //remove from event handlers
        Object.keys(this.handlers).forEach(function(key) {
            if(that.handlers[key] && isFunction(that.handlers[key])){
                let eh = SCG.controls.mouse.state.eventHandlers;
                if(eh[key] === undefined)
                    return;

                let index = eh[key][that.layerIndex].indexOf(that);
                if(index > -1)
                    eh[key][that.layerIndex].splice(index, 1);	
            }
        });
    }

    processTimers(now) {
        for(let timer of this.timers) {
            doWorkByTimer(timer, now);
        }
    }

    registerTimer(timer) {
        if(this.timers.indexOf(timer) == -1)
            this.timers.push(timer);

        return timer;
    }

    regTimer(timer) {
        return this.registerTimer(timer);
    }

    regTimerDefault(delay, callback) {
        return this.registerTimer(createTimer(delay, callback, this, true));
    }

    regDefaultTimer(delay, callback) {
        return this.regTimerDefault(delay, callback);
    }

    registerFramesDefaultTimer({ startFrameIndex = 0, originFrameChangeDelay = 0, initialAnimationDelay = 0, animationRepeatDelayOrigin = 0, 
        timerDelay = 10, debug = false, framesEndCallback = () => {}, framesChangeCallback = () => {} 
   
    }) {
        this.currentFrame = startFrameIndex;
        this.img = this.frames[this.currentFrame];
        
        let frameChangeDelay = originFrameChangeDelay;
        let animationRepeatDelay = initialAnimationDelay;
        let fCounter = 0;
        this.timer = this.regTimerDefault(timerDelay, () => {
            fCounter++;
            animationRepeatDelay--;
            if(animationRepeatDelay > 0)
                return;
        
            frameChangeDelay--;
            if(frameChangeDelay > 0)
                return;
        
            frameChangeDelay = originFrameChangeDelay;
        
            this.img = this.frames[this.currentFrame];
            this.currentFrame++;
            framesChangeCallback();
            if(this.currentFrame == this.frames.length){
                if(debug){
                    console.log(fCounter)
                }
                fCounter = 0;
                this.currentFrame = 0;
                animationRepeatDelay = animationRepeatDelayOrigin;

                framesEndCallback();
            }
        })
    }

    unregTimer(timer) {
        let p = this.timers.indexOf(timer);
        if(p != -1)
            this.timers.splice(p, 1);
    }

    addProcessScriptDelay(time, timerName = 'delayTimer') {
        return function(){
            this[timerName] = this.registerTimer(createTimer(time, () => {
                this.unregTimer(this[timerName]);
                this[timerName] = undefined;
                this.processScript();
            }, this, false));
        }
    }

    processScript() {
        if(this.script.items.length == 0){
            this.script.callbacks.completed.call(this);
            return;
        }
            

        this.script.currentStep = this.script.items.shift();
        this.script.currentStep.call(this);
    }

    createScriptTimer(script, stopPredicate, startNow = true, customDelay = undefined){
        return createTimer(customDelay || this.script.options.timerDelay, () => {
            script.call(this);
            if(stopPredicate.call(this)){
                this.scriptTimer = undefined;
                this.processScript();
                return;
            }
            
            this.needRecalcRenderProperties = true;
        }, this, startNow);
    }
}

GO.counter = {};
GO.ids = [];

var go = GO;
var Go = GO;
var gO = GO;