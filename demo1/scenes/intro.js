class IntroScene extends Scene {
    constructor(options = {}) {

        options = assignDeep({}, {
            titleAdded: false,
            addTitleDelay: 1000
        }, options);

        super(options);

        this.addUIGo(new UILabel(
            { 
                position: new V2(this.viewport.x - 40,this.viewport.y - 15), 
                debug: false,
                text: {
                    size: 10,
                    value: 'Version: ' + SCG.globals.version
                }
            }));

        let btnsGap = this.viewport.x*0.05;
        let btnWidth = (this.viewport.x - btnsGap*4)/3;
        let btnHeight = this.viewport.y - btnsGap*2;

        let difficultyButtonClicked = function(level){
            let viewportSize = new V2(160,100);
            if(level == 'medium')
                viewportSize = new V2(240,150);
            else if(level == 'hard')
                viewportSize = new V2(320,200);

            SCG.scenes.selectScene(new GameScene( 
                { 
                    viewport: viewportSize,
                    name: 'gameScene'
                }), {level: level});
        }

        this.selectDifficultyButtons = {
            "easy": new UIButton({
                position: new V2(btnsGap+btnWidth/2, btnsGap+btnHeight/2),
                size: new V2(btnWidth,btnHeight),
                isVisible: false,
                click: function() { 
                    difficultyButtonClicked('easy');
                },
                text: {
                    size: 10,
                    value: 'Easy',
                    autoCenter: true
                }
            }),
            "medium": new UIButton({
                position: new V2(btnsGap*2+btnWidth*1.5, btnsGap+btnHeight/2),
                size: new V2(btnWidth,btnHeight),
                isVisible: false,
                click: function() { 
                    difficultyButtonClicked('medium'); 
                },
                text: {
                    size: 10,
                    value: 'Medium',
                    autoCenter: true
                }
            }),
            "hard": new UIButton({
                position: new V2(btnsGap*3+btnWidth*2.5, btnsGap+btnHeight/2),
                size: new V2(btnWidth,btnHeight),
                isVisible: false,
                click: function() { 
                    difficultyButtonClicked('hard'); 
                 },
                text: {
                    size: 10,
                    value: 'Hard',
                    autoCenter: true
                }
            })
        };

        this.addUIGo(this.selectDifficultyButtons.easy);
        this.addUIGo(this.selectDifficultyButtons.medium);
        this.addUIGo(this.selectDifficultyButtons.hard);

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
                
                this.shieldTitle = new Shield({ 
                    position: new V2(this.viewport.x/2,this.viewport.y/2),
                    size: this.viewport.clone()
                 });

                this.addGo(this.shieldTitle);

                 this.startGameButton = new FadeInOutButton(
                    {
                       position: new V2(this.viewport.x/2,(this.viewport.y/2)+10),
                       size: new V2(70,60),
                       handlers: {
                           click() {
                               this.setDead();
                               this.parentScene.shieldTitle.dissapearing = true;
                              // alert('Button clicked:' + this.id);
                           }
                       }
                    }
                );

                this.addGo(this.startGameButton, 1, true);
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
            dissapearanceTime: 300,
            alphaChangeTimeout: 50,
            sizeChangeDelta: 1,
            dissapearing: false,
            appearing: true,
            sendEventsToAI: false,
        }, options);

        super(options);
        this.imgPropertyName = 'splash_screen_title';
        this.appearanceAlphaChangeValue = 1/(this.appearanceTime/this.alphaChangeTimeout);
        this.disappearanceAlphaChangeValue = 1/(this.dissapearanceTime/this.alphaChangeTimeout);

        this.fadeInTimer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: this.alphaChangeTimeout,
            originDelay: this.alphaChangeTimeout,
            content: this,
            doWorkInternal:() => {
                this.alpha += this.appearanceAlphaChangeValue;
                if(this.alpha > 1){
                    this.alpha = 1;
                    this.appearing = false;
                }   
            }
        }

        this.dissapearTimer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: this.alphaChangeTimeout,
            originDelay: this.alphaChangeTimeout,
            content: this,
            doWorkInternal:() => {
                this.alpha -= this.disappearanceAlphaChangeValue;
                this.size.mul(0.975, true);
                this.needRecalcRenderProperties = true;

                if(this.alpha <= 0){
                    this.alpha
                    this.setDead();

                    this.parentScene.selectDifficultyButtons.easy.isVisible = true;
                    this.parentScene.selectDifficultyButtons.medium.isVisible = true;
                    this.parentScene.selectDifficultyButtons.hard.isVisible = true;
                    SCG.UI.invalidate();
                    //alert('Выбор уровня сложности')

                }
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
        if(this.appearing)
            doWorkByTimer(this.fadeInTimer, now);

        if(this.dissapearing)
            doWorkByTimer(this.dissapearTimer, now);
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