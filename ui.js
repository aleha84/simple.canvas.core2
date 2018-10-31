SCG.UI = {
    invalidate() {
        if(!SCG.contexts.ui)
            return;

        SCG.contexts.ui.clearRect(0, 0, SCG.viewport.real.width, SCG.viewport.real.height);

		var as = SCG.scenes.activeScene;
		var i = as.ui.length;
		while (i--) {
            as.ui[i].needRecalcRenderProperties = true;
			as.ui[i].update();
			as.ui[i].render();
		}
    },
    createCanvas(size, contextProcesser) {
        if(!size)
            throw 'SCG.UI.createCanvas -> No size provided ';

        let canvas = document.createElement('canvas');
        canvas.width = size.x;
        canvas.height = size.y;

        let ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        if(contextProcesser && isFunction(contextProcesser))
            contextProcesser(ctx, size);

        return canvas;
    }
}

class UIControl extends GO {
    constructor(options = {}){
        if(options.click && isFunction(options.click)){
            if(!options.handlers)
                options.handlers = {}

            options.handlers.click = options.click;
            delete options.click;
        }

        options = assignDeep({}, {
            handlers: {
                click: () => { console.log('Control empty click handler'); },
                down: () => { /* do nothing */ },
                up: () => { /* do nothing */ }
            }
        }, options);

        Object.keys(options.handlers).forEach(key => {
            if(options.handlers[key] && isFunction(options.handlers[key])){
                let originalHandler = options.handlers[key];
                options.handlers[key] = () => {
                    originalHandler();

                    return {
                        preventDiving: true
                    };
                }
            }
        });

        options.contextName = 'ui';
        options.isStatic = true; 
        super(options);
    }

    invalidate() {
        let rp = this.renderPosition;
        let rs = this.renderSize;
        SCG.contexts.ui.clearRect(rp.x - rs.x/2, rp.y - rs.y/2, rs.x, rs.y);
        this.needRecalcRenderProperties = true;
        this.update();
        this.render();
    }
}

class UILabel extends UIControl {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(50,10),
            debug: false,
            text: GO.getTextPropertyDefaults('sample'),
            format: undefined
        }, options);

        super(options);
    }

    internalPreUpdate(now){
        if(this.format){
            var args = this.format.argsRetriever ? this.format.argsRetriever() : this.format.arguments;
            this.text.value = String.format(this.format.format, args);
        }
    }
}

class UIProgressBar extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            text: GO.getTextPropertyDefaults('progress'),
            img: undefined,
            current: 0,
            max: 100,
            fillColor: 'rgb(180,255,50)'
        }, options)

        options.isStatic = true;
        options.contextName = 'ui'

        super(options);
    }
}

class UICheckbox extends UIControl {
    constructor(options = {}) {
        options = assignDeep({}, {
            checked: true,
            label: undefined,
            borderImg: undefined,
            checkImg: undefined,
            handlers: {
                up: () => {
                    this.checkedGo.isVisible = !this.checkedGo.isVisible;
                    this.invalidate();
                }
            }
        }, options);
        
        if(!options.borderImg){
            options.borderImg = SCG.UI.createCanvas(new V2(50,50), function(ctx, size){
                ctx.strokeStyle ="#CCCCCC";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.rect(0,0,size.x, size.y);
                ctx.stroke();
            });
        }

        if(!options.checkImg){
            options.checkImg = SCG.UI.createCanvas(new V2(50,50), function(ctx, size){
                ctx.strokeStyle ="#AAAAAA";
                ctx.lineCap = 'round';
                ctx.lineWidth = 5;
                drawByPoints(ctx, new V2(10,10), [new V2(size.x/2-5, size.y-20), new V2(size.x/2-12, -size.y/2+10)]);
                ctx.stroke();
            });
        }
        
        options.img = options.borderImg;

        super(options);

        this.checkedGo = new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.checkImg,
            contextName: 'ui',
            isStatic: true,
            isVisible: this.checked
        });

        this.addChild(this.checkedGo);

        if(this.label){
            this.addChild(new UILabel(this.label))
        }
    }
}

class UIButton extends UIControl {
    constructor(options = {}){
        options = assignDeep({}, {
            handlers: {
                down: () => {
                    if(!this.clickedImg)
                        return;

                    this.img = this.clickedImg; 
                    this.invalidate()},
                up: () => {
                    if(!this.defaultImg)
                        return;

                    this.img = this.defaultImg; 
                    this.invalidate()}
            },
            text: GO.getTextPropertyDefaults('btn'),
        }, options);

        if(!options.imgPropertyName && !options.img){
            options.defaultImg = SCG.UI.createCanvas(options.size, function(innerCtx, size){
                innerCtx.fillStyle="#CCCCCC";
                innerCtx.fillRect(0,0,size.x,size.y);
                innerCtx.lineWidth = size.x*0.05;
                innerCtx.strokeStyle = '#DEDEDE';
                innerCtx.beginPath();
                innerCtx.moveTo(0, size.y);
                innerCtx.lineTo(0, 0);
                innerCtx.lineTo(size.x, 0);
                innerCtx.stroke();

                innerCtx.strokeStyle = '#AAAAAA';
                innerCtx.beginPath();
                innerCtx.moveTo(0, size.y);
                innerCtx.lineTo(size.x, size.y);
                innerCtx.lineTo(size.x, 0);
                innerCtx.stroke();
            })

            options.clickedImg = SCG.UI.createCanvas(options.size, function(innerCtx, size){
                innerCtx.fillStyle="#CCCCCC";
                innerCtx.fillRect(0,0,size.x,size.y);
                innerCtx.lineWidth = size.x*0.05;
                innerCtx.strokeStyle = '#AAAAAA';
                innerCtx.beginPath();
                innerCtx.moveTo(0, size.y);
                innerCtx.lineTo(0, 0);
                innerCtx.lineTo(size.x, 0);
                innerCtx.stroke();
    
                innerCtx.strokeStyle = '#DEDEDE';
                innerCtx.beginPath();
                innerCtx.moveTo(0, size.y);
                innerCtx.lineTo(size.x, size.y);
                innerCtx.lineTo(size.x, 0);
                innerCtx.stroke();
            });

            options.img = options.defaultImg;
        }

        super(options);
    }
}