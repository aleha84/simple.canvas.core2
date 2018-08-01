class StarsLayer {
    constructor(options = {}) {
        assignDeep(this, {
            starsConfigs: {
                count: 20,
                opacity: 0.5,
                speed: 0.1,
                direction: new V2(-1, 0),
            },
            level: 0,
            addShiningStars: false
        }, options);

        this.stars = [];

        for(let i = 0; i < this.starsConfigs.count; i++){

            let starProps = {
                position: new V2(getRandomInt(0, this.scene.viewport.x), getRandomInt(0, this.scene.viewport.y)),
                opacity: this.starsConfigs.opacity,
                speed: this.starsConfigs.speed,
                direction: this.starsConfigs.direction,
            };

            this.stars.push(this.scene.addGo(
                (this.addShiningStars && getRandomInt(0, 300) < 10)? new ShiningStar(starProps) : new Star(starProps)
                , this.level
            ));
        }

        // this.scene.addGo(
        //     new ShiningStar({
        //         position: new V2(getRandomInt(0, this.scene.viewport.x), getRandomInt(0, this.scene.viewport.y)),
        //         opacity: this.starsConfigs.opacity,
        //         speed: this.starsConfigs.speed,
        //         direction: this.starsConfigs.direction,
        //     })
        //     , this.level
        // )
    }
}


class Star extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            position: new V2(),
            opacity: 1,
            speed: 0,
            direction: new V2(),
            isCustomRender: true,
            size: new V2(1,1)
        }, options);

        super(options);
        
        this.fillStyle = 'rgba(255,255,255,'+this.opacity+')';

        this.setDestination(new V2(0, this.position.y));
    }

    customRender(){
        this.context.fillStyle = this.fillStyle;
        let rp = this.renderPosition;
        let rsx = this.renderSize.x;
        let rsy = this.renderSize.y;
        this.context.fillRect(rp.x - rsx/2, rp.y - rsy/2, rsx,rsy);
    }

    destinationCompleteCallBack() {
        this.position = new V2(SCG.scenes.activeScene.viewport.x+1, getRandomInt(0, SCG.scenes.activeScene.viewport.y));
        this.setDestination(new V2(0, this.position.y));
    }
}

class ShiningStar extends Star {
    constructor(options = {}){
        options = assignDeep({}, {
            shine: {
                duration: 400,
                opacityShift: 0.1,
                opacityShiftDirection: -1,
                start: false,
                processer: function(){
                    this.shine.start = !this.shine.start;
                    if(!this.shine.start)
                        this.opacity = this.shine.defaultOpacity;
                }
            }
        }, options);

        super(options);

        //this.shine.timer = createTimer(this.shine.duration, this.shine.processer, this, false);
        this.shine.defaultOpacity = this.opacity;
    }

    internalUpdate(now){
        if(!this.shine.start){
            this.shine.start = getRandomInt(0,1000) < 5;

            if(this.shine.start)
            {
                this.shine.timer = createTimer(this.shine.duration, this.shine.processer, this, false);
            }
        }
        else {
            doWorkByTimer(this.shine.timer, now);
            this.opacity += this.shine.opacityShift*this.shine.opacityShiftDirection;

            if(this.opacity < 0)
            {
                this.opacity = 0;
                this.shine.opacityShiftDirection = 1;
            }
            if(this.opacity > 1)
            {
                this.opacity = 1;
                this.shine.opacityShiftDirection = -1;
            }

            this.fillStyle = 'rgba(255,255,255,'+this.opacity+')';
        }
    }
}
