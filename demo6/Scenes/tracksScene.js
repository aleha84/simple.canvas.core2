class TracksScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                level: 2
            }
        }, options);

        super(options);

        this.testGroundSize = new V2(this.viewport.x/3, this.viewport.y/10);
        let tgs = this.testGroundSize;

        this.grnd = new GO({
            position: new V2(this.viewport.x*4/6, this.viewport.y*2/3),
            size: tgs,
            collisionDetection: {
                enabled: true,
                render: true,
                circuit: [new V2(-tgs.x/2, tgs.y/2), new V2(0, -tgs.y/2), new V2(tgs.x/2, tgs.y/2)]
            }
        });

        this.addGo(this.grnd);
        window.grnd = this.grnd;

        this.track = new Track({
            position: new V2(this.viewport.x/2, this.viewport.y/2),
            size: new V2(this.viewport.x/4, this.viewport.y/8),
            destination: new V2(this.viewport.x/2, this.viewport.y),
            speed: 1
        })

        this.addGo(this.track);
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

class Track extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            setDestinationOnInit: true,
            collisionDetection: {
                enabled: true,
                render: true,
            }
        }, options);

        super(options);

        this.collisionDetection.onCollision = this.onCollisionInternal;
    }

    onCollisionInternal(collidedWithGo, collisionPoints) {
        //this.position.add(this.direction.mul(-this.speed), true);
        let thisHighestY = this.collisionDetection.box.bottomLeft.y;

        let cpY = collisionPoints.map(p => p.y);
        let cpX = collisionPoints.map(p => p.x);
        let cpMinX = Math.min.apply(null, cpX); // минимальный х среди точек коллизий
        let cpMaxX = Math.max.apply(null, cpX); // максимальный х среди точек коллизий

        let collisionPointsLowestY = Math.min.apply(null, collisionPoints.map(p => p.y));

        if(cpX.length > 1 && collidedWithGo.collisionDetection.circuit){
            let circuitPointsBetweenCpX = collidedWithGo.collisionDetection.circuit.filter(p => p.x >= cpMinX && p.x <= cpMaxX);
            if(circuitPointsBetweenCpX.length){
                let lowest = Math.min.apply(null, circuitPointsBetweenCpX.map(p => p.y));
                if(lowest < collisionPointsLowestY)
                    collisionPointsLowestY = lowest;
            }
        }


        let delta = Math.abs(thisHighestY - collisionPointsLowestY);


        this.position.y-=(delta<this.speed ? this.speed : delta) ;//-=this.speed;
        this.setDestination(new V2(this.position.x, this.parentScene.viewport.y));
    }

    positionChangeProcesser() {
        if(this.position.y >= this.parentScene.viewport.y)
            return;

        this.position.y+=this.speed;
    }
}