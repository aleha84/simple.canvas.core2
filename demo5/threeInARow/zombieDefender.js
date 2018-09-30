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
            size: new V2(32,32),
            isAnimated: true,
            animation: {
                totalFrameCount: 3,
                framesInRow: 12,
                framesRowsCount: 1,
                frameChangeDelay: 300,
                destinationFrameSize: new V2(32,32),
                sourceFrameSize: new V2(32,32),
                loop: true,
                startFrame: 1,
                endFrame: 3
            }
        }, options);

        super(options);
    }
}