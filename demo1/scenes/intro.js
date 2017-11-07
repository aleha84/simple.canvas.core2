class IntroScene extends Scene {
    constructor(options = {}) {

        options = assignDeep({}, {
            titleAdded: false,
            addTitleDelay: 1000
        }, options);

        super(options);

        this.addUIGo(new UILabel(
            { 
                size: new V2(200,40),
                position: new V2(50,20), 
                debug: false,
                text: {
                    size: 40,
                    color: 'gold',
                    border: true,
                    value: 'Money'
                }
            }));
        if(SCG.UI)
            SCG.UI.invalidate();

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

                 this.addGo(new FadeInOutButton(
                     {
                        position: new V2(this.viewport.x/2,(this.viewport.y/2)+10),
                        size: new V2(70,60),
                        handlers: {
                            click: () => {
                                alert('Button clicked:' + this.id);
                            }
                        }
                     }
                 ), 1, true);
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

class FadeInOutButton extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            alpha: 0.25,
            alphaClamps: [0.25,1],
            appearanceTime: 500,
            alphaChangeTimeout: 50,
            alphaChangeSign: 1,
        }, options);

        super(options);
        this.imgPropertyName = 'splash_screen_start_button';
        this.alphaChangeValue = 1/(this.appearanceTime/this.alphaChangeTimeout);

        this.fadeInTimer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: this.alphaChangeTimeout,
            originDelay: this.alphaChangeTimeout,
            content: this,
            doWorkInternal:() => {
                this.alpha += this.alphaChangeSign*this.alphaChangeValue;

                if(checkClamps(this.alphaClamps, this.alpha) == -1)
                    this.alphaChangeSign*=-1;
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
        doWorkByTimer(this.fadeInTimer, now);
    }
}