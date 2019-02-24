class SpaceportScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            
        }, options)

        super(options);
    }

    start(){
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(50,50),
            img: PP.createImage(spacePortImages.demoModel),
            angle: 0,
            init(){
                this.rotationTimer = createTimer(50, () => {
                    this.angle+=1;
                }, this, true);
            },
            internalUpdate(now){
                if(this.rotationTimer)
                    doWorkByTimer(this.rotationTimer, now);
            },
            internalPreRender() {
                let ctx = this.context;
                
                ctx.translate(this.renderPosition.x, this.renderPosition.y);
                ctx.rotate(degreeToRadians(this.angle));
                ctx.translate(-this.renderPosition.x, -this.renderPosition.y);
            },
            internalRender() {
                let ctx = this.context;
                ctx.translate(this.renderPosition.x, this.renderPosition.y);
                ctx.rotate(degreeToRadians(-this.angle));
                ctx.translate(-this.renderPosition.x, -this.renderPosition.y);
                
            }
        }))
    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }
}
