class IntroScene extends Scene {
    constructor(options = {}) {

        options = assignDeep({}, {
            titleAdded: false,
            addTitleDelay: 1000
        }, options);

        super(options);

        this.addTitleTimer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: this.addTitleDelay,
            originDelay: this.addTitleDelay,
            content: this,
            doWorkInternal:() => {
                this.titleAdded = true;

                this.addGo(new Shield({ 
                    position: new V2(this.viewport.x/2,this.viewport.y/2),
                    size: this.viewport.clone()
                 }));
            }
        }
    }

    backgroundRender(){
        SCG.contexts.background.drawImage(SCG.images.splash_screen,0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now){
        if(this.titleAdded)
            return;

        doWorkByTimer(this.addTitleTimer, now);
    }
}

class Shield extends GO {
    constructor(options = {}) {

        options = assignDeep({}, {
            alpha: 0,
            appearanceTime: 1000,
            alphaChangeTimeout: 50,
        }, options);

        super(options);
        this.imgPropertyName = 'splash_screen_title';
        this.alphaChangeValue = 1/(this.appearanceTime/this.alphaChangeTimeout);

        this.fadeInTimer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: this.alphaChangeTimeout,
            originDelay: this.alphaChangeTimeout,
            content: this,
            doWorkInternal:() => {
                this.alpha += this.alphaChangeValue;
                if(this.alpha > 1)
                    this.alpha = 1;
            }
        }
    }

    internalPreRender() {
        this.context.save();
        this.context.globalAlpha = this.alpha;
    }

    internalRender() {
        this.context.restore();
    }

    internalPreUpdate(now){
        if(this.alpha >= 1)
            return;

        doWorkByTimer(this.fadeInTimer, now);
    }
}