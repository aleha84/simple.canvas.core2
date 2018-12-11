class TracksScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                level: 2
            }
        }, options);

        super(options);

        this.testGroundSize = new V2(this.viewport.x, this.viewport.y/10);
        let tgs = this.testGroundSize;

        this.grnd = new GO({
            position: new V2(this.viewport.x/2, this.viewport.y*2/3),
            size: tgs,
            collisionDetection: {
                enabled: true,
                render: true,
                circuit: [new V2(-tgs.x/2, tgs.y/2),  new V2(0, tgs.y/2), new V2(tgs.x/6, -tgs.y/2), new V2(tgs.x*2/6, tgs.y/2), new V2(tgs.x, (tgs.y/2)+10)]
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
                rotation: {
                    current: 0,
                    step: 1
                }
            }
        }, options);

        super(options);

        this.collisionDetection.initialCircuit = [new V2(-this.size.x/2, this.size.y/2), new V2(this.size.x/2, this.size.y/2), new V2(0, -this.size.y/2)];
        this.collisionDetection.circuit = this.collisionDetection.initialCircuit.map(p => p.clone());
        this.collisionDetection.left = this.collisionDetection.circuit[0];
        this.collisionDetection.right = this.collisionDetection.circuit[1];
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
        let position = this.parent ? this.absolutePosition : this.position;
        if(collisionPoints.every(p => p.distance(this.collisionDetection.left.add(position)) > 2)) {
            
            let that = this;
            //this.collisionDetection.circuit = 
            this.collisionDetection.circuit.map(p => {
                //return p.substract(position, true).rotate(-1* that.collisionDetection.rotation.step, false, true).add(position, true);
                p.rotate(-1* that.collisionDetection.rotation.step, false, true);
            })

            let p = [this.box.topLeft, this.box.topRight, this.box.bottomLeft, this.box.bottomRight];
            p = p.map(p => {
                return p.substract(position).rotate(-1* that.collisionDetection.rotation.step).add(position);
            });
            let allX = p.map(p => p.x);
            let allY = p.map(p => p.y);
            let minX = Math.min.apply(null, allX);
            let minY = Math.min.apply(null, allY);
            let maxX = Math.max.apply(null, allX);
            let maxY = Math.max.apply(null, allY);
            let tl = new V2(minX, minY);
            //this.box.update(new V2(minX, minY), new V2(maxX - minX, maxY - minY));
            this.size = new V2(maxX - minX, maxY - minY);
        }
        else {
            this.position.y-=(delta<this.speed ? this.speed : delta) ;//-=this.speed;
        }
        
        this.setDestination(new V2(this.position.x, this.parentScene.viewport.y));
    }

    positionChangeProcesser() {
        if(this.position.y >= this.parentScene.viewport.y)
            return;

        this.position.y+=this.speed;
    }
}