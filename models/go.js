class GO {
    constructor(options = {}){
        
        if(!options.position || !(options.position instanceof V2)){
            //console.trace();
            throw `No position defined for graphical object`;
        }
            
        if(!options.size || !(options.size instanceof V2)){
            throw 'No size defined for grapthical object';
        }
            

        var objectContext = this;

        assignDeep(this, {
            debug: false,
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
            animation: { // todo test needed
                totalFrameCount: 0,
                framesInRow: 0,
                framesRowsCount: 0,
                frameChangeDelay: 0,
                destinationFrameSize: new V2,
                sourceFrameSize: new V2,
                currentDestination : new V2,
                currentFrame: 0,
                startFrame: undefined,
                endFrame: undefined,
                reverse: false,
                paused: false,
                loop : false,
                animationTimer : undefined,
                animationEndCallback: function(){},
                animationRestartCallback: function(){},
                setFrameChangeDelay(value) {
                    this.animationTimer.currentDelay = value;
                    this.animationTimer.originDelay = value;
                },
                frameChange : function(){
                    if(this.paused){
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

    console(message) {
        if(this.debug)
            console.log(this.id + ' ' + message);
    }

    beforeDead(){}

    setDead() {
        this.childProcesser((child) => child.setDead());

		this.beforeDead();
		
        this.unRegEvents();

		//send to ai msg
        if(this.sendEventsToAI && SCG.AI && SCG.AI.worker)
            SCG.AI.sendEvent({ type: 'removed', message: {goType: this.type, id: this.id }});	

        this.alive = false;

        this.console('setDead completed.');
    }

    addChild(childGo, regEvents = false) {
        if(!(childGo instanceof GO)){
            console.warn('Can\' add to children object isn\'t inherited from GO');
            return;
        }
    
        this.childrenGO.push(childGo);
        childGo.parent = this;

        if(regEvents)
            childGo.regEvents(this.layerIndex);
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
    
    customRender(){ }
        
    internalPreRender(){}
        
    internalRender(){}

    render(){ 
        if(!this.alive || !this.renderPosition || !this.isVisible)
            return;

		this.internalPreRender();

		if(this.isCustomRender)
		{
			this.customRender();
		}
		else{
            let ctx = this.context;
            let rp = this.renderPosition;

			if(this.img != undefined)
			{
				
                let rsx = this.renderSize.x;
                let rsy = this.renderSize.y;

                if(this.customScale.x !== 1)
                    rsx *= this.customScale.x;

                if(this.customScale.x !== 1)
                    rsy *= this.customScale.y;
                
				let dsp = this.destSourcePosition;
				let s = this.size;

				if(this.isAnimated)
				{
					let ani = this.animation;
					ctx.drawImage(this.img,  
						ani.currentDestination.x * ani.sourceFrameSize.x,
						ani.currentDestination.y * ani.sourceFrameSize.y,
						ani.sourceFrameSize.x,
						ani.sourceFrameSize.y,
						rp.x - rsx/2,
						rp.y - rsy/2,
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
							(rp.x - rsx/2), 
							(rp.y - rsy/2), 
							rsx, 
							rsy);		
					}
					else { // draw simple img without any modifications
						ctx.drawImage(this.img, 
							(rp.x - rsx/2), 
							(rp.y - rsy/2), 
							rsx, 
							rsy);			
					}
					
				}
            }	
            
            if(this.text){
                this.renderText();
            }
		}
        
        this.childProcesser((child) => child.render());

        this.internalRender();

        this.console('render completed.');
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

    update(now){
        if(!this.initialized){
            this.initialized = true;
            this.init(now);
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

        this.internalPreUpdate(now);

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
            if(SCG.viewport.logical.isIntersectsWithBox(this.box) || this.isStatic)
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
        }

		if(this.isAnimated)
            doWorkByTimer(this.animation.animationTimer, now);
        
		this.internalUpdate(now);

		if(!this.alive){
            this.console('update completed. this.alive = false');
            return false;
        }

        this.childProcesser((child) => child.update(now));
            
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
}

GO.counter = {};
GO.ids = [];