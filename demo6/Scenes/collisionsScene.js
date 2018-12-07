class CollisionsScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                level: 8
            }
        }, options);

        super(options);

        let img = createCanvas(new V2(100,100), (ctx, size) => {
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            drawByPoints(ctx, new V2(0, size.y/2), [new V2(size.x/2, -size.y/2), new V2(size.x/2, size.y/2), new V2(-size.x/2, size.y/2), new V2(-size.x/2, -size.y/2)])
            ctx.fill();
        });

        let obj = new CollisionDemoObject({
            position: new V2(250,150),
            img: img,
            size: new V2(40, 40),
            setDestinationOnInit: true,
        });

        let chObj1 = new CollisionDemoObject({
            position: new V2(0,-30),
            img: img,
            size: new V2(20, 20),
        });

        let chObj1_1 = new CollisionDemoObject({
            position: new V2(0,-15),
            img: img,
            size: new V2(10, 10),
        });

        chObj1.addChild(chObj1_1);
        obj.addChild(chObj1);
        this.addGo(obj);

        let obj2 = new CollisionDemoObject({
            position: new V2(350,250),
            img: img,
            size: new V2(40, 40),
            setDestinationOnInit: true,
        });

        let chObj2_1 = new CollisionDemoObject({
            position: new V2(0,-30),
            img: img,
            size: new V2(20, 20),
        });

        let chObj2_1_1 = new CollisionDemoObject({
            position: new V2(0,-15),
            img: img,
            size: new V2(10, 10),
        });

        chObj2_1.addChild(chObj2_1_1);
        obj2.addChild(chObj2_1);
        this.addGo(obj2);

        let obj3 = new CollisionDemoObject({
            position: new V2(350,75),
            img: img,
            size: new V2(40, 40),
            setDestinationOnInit: true,
        });

        let chObj3_1 = new CollisionDemoObject({
            position: new V2(0,-30),
            img: img,
            size: new V2(20, 20),
        });

        let chObj3_1_1 = new CollisionDemoObject({
            position: new V2(0,-15),
            img: img,
            size: new V2(10, 10),
        });

        chObj3_1.addChild(chObj3_1_1);
        obj3.addChild(chObj3_1);
        this.addGo(obj3);

        this.shotTimer = createTimer(100, this.shotTimerInner, this, false);

        // this.addGo(new Shot({
        //     speed: 3,
        //     position: new V2(10, this.viewport.y/2),
        //     destination: new V2(this.viewport.x - 10, 90)
        // }));

    }

    shotTimerInner() {
        this.addGo(new Shot({
            speed: 3,
            position: new V2(10, this.viewport.y/2),
            destination: new V2(this.viewport.x - 10, getRandomInt(0, this.viewport.y))
        }));
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now){
        let cd = this.collisionDetection;
        let renderCellsize = cd.cellSize.mul(SCG.viewport.scale);
        let ctx = SCG.contexts.main;
        for(let ri = 0; ri < cd.cells.length; ri++){
            let row = cd.cells[ri];
            for(let ci = 0; ci < row.length; ci++){
                let cell = row[ci];

                ctx.strokeStyle = "green";
                ctx.strokeRect(ci*renderCellsize.x, ri*renderCellsize.y, renderCellsize.x, renderCellsize.y);
                if(cell.length){
                    ctx.fillStyle = 'rgba(0,255,0, 0.2)';
                    ctx.fillRect(ci*renderCellsize.x, ri*renderCellsize.y, renderCellsize.x, renderCellsize.y);

                    ctx.font = `${10*SCG.viewport.scale}px Arial`;
                    ctx.fillStyle = 'red';
                    ctx.textAlign = 'right';
                    ctx.fillText(cell.length, ci*renderCellsize.x+renderCellsize.x/7, ri*renderCellsize.y+renderCellsize.y/5);
                }
            }
        }

        if(this.shotTimer)
            doWorkByTimer(this.shotTimer, now);
    }
}

class CollisionDemoObject extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                onCollision: function(collidedWith, collisionPoints){
                    console.log(`${this.id} collided with ${collidedWith.id}`);
                    this.speed = 0;
                    collidedWith.speed = 0;
                }
            }
        }, options);

        super(options);

        this.collisionDetection.circuit = [new V2(-this.size.x/2, 0), new V2(0, -this.size.y/2), new V2(this.size.x/2, 0), new V2(0, this.size.y/2)]
    }

    internalRender(){
        let scale = SCG.viewport.scale;
        let cdBoxTLRender = this.collisionDetection.box.topLeft.mul(scale);
        this.context.strokeStyle = '#00BFFF';
        this.context.strokeRect(cdBoxTLRender.x, cdBoxTLRender.y, this.collisionDetection.box.width*scale, this.collisionDetection.box.height*scale);

        if(this.collisionDetection.circuit.length){
            let position = this.position;
            if(this.parent){
                position = this.absolutePosition;
            }

            draw(
                this.context, 
                {
                    lineWidth: 2,
                    strokeStyle: 'red',
                    closePath: true,
                    points: this.collisionDetection.circuit.map((item) => item.add(position).mul(scale))
                }
            )
        }
    }
}

class Shot extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(1,5),
            speed: 3,
            setDestinationOnInit: true,
            setDeadOnDestinationComplete: true,
            collisionDetection: {
                enabled: true,
                preCheck: function(go) {
                    return this.type !== go.type;
                },
                onCollision: function(collidedWith, intersection){
                    if(intersection && intersection.length){
                        this.explosionPoint = V2.average(intersection);
                    }
                    //console.log(`${this.id} collided with ${collidedWith.id}`);
                    this.setDead();
                }
            }
        }, options);

        super(options);

        this.size.y = this.speed*5;
        let originalVerticalSize = this.size.clone();

        this.angle = V2.up.angleTo(this.destination.substract(this.position));

        let boxUp = new Box(new V2(-this.size.x/2, -this.size.y/2), this.size)
        let rotatetCornerPoints = [
            boxUp.topLeft.rotate(this.angle),
            boxUp.bottomLeft.rotate(this.angle),
            boxUp.topRight.rotate(this.angle),
            boxUp.bottomRight.rotate(this.angle)
        ];
        let allX = rotatetCornerPoints.map((item) => item.x);
        let allY = rotatetCornerPoints.map((item) => item.y);

        this.size = new V2(Math.max.apply(null, allX) - Math.min.apply(null, allX), Math.max.apply(null, allY)-Math.min.apply(null, allY));

        let that = this;
        this.img = createCanvas(this.size.mul(10), function(ctx, size) {
            let scaleOriginalSize = originalVerticalSize.mul(10);

            let gradient = ctx.createLinearGradient(size.x/2,(-scaleOriginalSize.y/2)+size.y/2,size.x/2,(scaleOriginalSize.y/2)+size.y/2);
            gradient.addColorStop(0, 'yellow');
            gradient.addColorStop(0.3, 'red');
            gradient.addColorStop(1, 'rgba(100,0,0,0.1)');
            ctx.fillStyle = gradient;
            ctx.translate(size.x/2, size.y/2);
            ctx.rotate(degreeToRadians(that.angle));
            ctx.translate(-size.x/2, -size.y/2);
            ctx.fillRect(-5 + size.x/2, (-scaleOriginalSize.y/2)+size.y/2, scaleOriginalSize.x, scaleOriginalSize.y);
        });
    }

    internalRender(){
        let scale = SCG.viewport.scale;
        let cdBoxTLRender = this.collisionDetection.box.topLeft.mul(scale);
        this.context.strokeStyle = '#00BFFF';
        this.context.strokeRect(cdBoxTLRender.x, cdBoxTLRender.y, this.collisionDetection.box.width*scale, this.collisionDetection.box.height*scale);
    }

    internalPreRender() {
    }

    beforeDead(){
        this.parentScene.addGo(new Explosion({position: this.explosionPoint ? this.explosionPoint : this.position.add(this.direction.mul(this.speed))}), 3);
    }
}

class Explosion extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(10, 10),
            isAnimated: true,
            img: 'explosion1',
            animation: {
                totalFrameCount: 23,
                framesInRow: 5,
                framesRowsCount: 5,
                frameChangeDelay: 25,
                destinationFrameSize: new Vector2(10,10),
                sourceFrameSize: new Vector2(64,64),
                loop: false,
                animationEndCallback: function() { this.setDead(); }
            }
        }, options);

        super(options);
    }
}