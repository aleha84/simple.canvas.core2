class ZombieDefender extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options);

        this.addChild(new Zombie({
            position: new V2()
        }));
    }
}

class Zombie extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            imgPropertyName: 'zombies',
            destSourceSize: new V2(32,32),
            size: new V2(16,16),
            frames: [new V2(0,0), new V2(64,0)],
            currentFrame: 0,
            // isAnimated: true,
            // animation: {
            //     totalFrameCount: 3,
            //     framesInRow: 12,
            //     framesRowsCount: 1,
            //     frameChangeDelay: 300,
            //     destinationFrameSize: new V2(32,32),
            //     sourceFrameSize: new V2(32,32),
            //     loop: true,
            //     startFrame: 1,
            //     endFrame: 3
            // }
        }, options);

        super(options);
        this.frameSwitch();
        this.frameSwitchTimer = createTimer(300, this.frameSwitch, this, true);
    }

    frameSwitch(){
        if(this.currentFrame+1 >= this.frames.length) {
            this.currentFrame = 0;
        }
        else {
            this.currentFrame++;
        }

        this.destSourcePosition = this.frames[this.currentFrame];
    }

    beforePositionChange(now){
        doWorkByTimer(this.frameSwitchTimer, now);
    }
}