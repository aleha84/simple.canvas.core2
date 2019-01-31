class BottlesScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {}, options);

        super(options);

        this.bgImg = textureGenerator.textureGenerator({
            size: this.viewport,
            backgroundColor: '#BACEE9',
            surfaces: [
                textureGenerator.getSurfaceProperties({
                    colors: ['#034B7B', '#E9F4FA'], opacity: [0.75],  type: 'line', line: { length: [2,8], directionAngle: 90, angleSpread: 0 }, density: 0.0005
                }),
            ]
        })
    }

    backgroundRender(){
        SCG.contexts.background.drawImage(this.bgImg, 0,0, SCG.viewport.real.width,SCG.viewport.real.height);
        //this.backgroundRenderDefault();
    }

    start() {
        this.bottleOriginalSize = new V2(10, 28);
        this.bottleImg = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = '#1E5F4C';
            ctx.fillRect(3,3,4,25);
            ctx.fillRect(2,10,6,18);
            ctx.fillRect(1,11,8,17);
            ctx.fillRect(0,13,10,14);
            ctx.fillStyle = '#1C5948';
            ctx.fillRect(2,2,6,1);
        });

        this.backImgRight = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = '#114A48';
            ctx.fillRect(3,3,4,1); ctx.fillRect(3,3,1,9);ctx.fillRect(2,11,2,1);ctx.fillRect(2,11,1,2);ctx.fillRect(1,13,2,1);ctx.fillRect(1,13,1,14);ctx.fillRect(1,26,8,1);ctx.fillRect(8,19,1,8);
        });

        this.backImgCenter = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = '#114A48';
            ctx.fillRect(3,3,4,1); ctx.fillRect(1,19,1,14);ctx.fillRect(1,26,8,1);ctx.fillRect(8,19,1,8);
        });

        this.backImgLeft = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = '#114A48';
            ctx.fillRect(3,3,4,1); ctx.fillRect(6,3,1,9);ctx.fillRect(6,11,2,1);ctx.fillRect(7,11,1,2);ctx.fillRect(7,13,2,1);ctx.fillRect(8,13,1,14);ctx.fillRect(1,26,8,1);ctx.fillRect(1,19,1,8);
        });

        this.reflectionImgRight = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = 'rgba(95,146,91,0.5)';
            ctx.fillRect(6,2,1,1);ctx.fillRect(6,5,1,5);ctx.fillRect(6,11,1,1);
            ctx.fillStyle = 'rgba(108,177,103,0.5)';ctx.fillRect(7,12,1,14);
        });

        this.reflectionImgCenter = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = 'rgba(95,146,91,0.5)';
            ctx.fillRect(5,2,1,1);ctx.fillRect(5,5,1,5);ctx.fillRect(5,11,1,1);
            ctx.fillStyle = 'rgba(108,177,103,0.5)';ctx.fillRect(5,12,1,14);
        });

        this.reflectionImgLeft = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = 'rgba(95,146,91,0.5)';
            ctx.fillRect(4,2,1,1);ctx.fillRect(4,5,1,5);ctx.fillRect(4,11,1,1);
            ctx.fillStyle = 'rgba(108,177,103,0.5)';ctx.fillRect(3,12,1,14);
        });

        this.roundItemFramesCount = 24;
        this.roundItemSize =new V2(20, 20).mul(2); 
        this.roundItemImg = createCanvas(new V2(this.roundItemSize.x*this.roundItemFramesCount, this.roundItemSize.y), (ctx, size) => {
            let angleStep = 360 / this.roundItemFramesCount;
            let point = new V2(0, 0 - this.roundItemSize.y*3/10);
            let initAngles = [0, 90, 180, 270];
            for(let i = 0; i < this.roundItemFramesCount; i++){
                let centerX = this.roundItemSize.x*i + this.roundItemSize.x/2;
                ctx.fillStyle = '#014D87';ctx.strokeStyle = '#001132';
                ctx.beginPath();ctx.arc(centerX, size.y/2, this.roundItemSize.x/2.1 , 0, Math.PI*2, false);
                ctx.fill();ctx.lineWidth = 2; ctx.stroke();
                ctx.fillStyle = '#001132';
                ctx.beginPath();ctx.arc(centerX, size.y/2, this.roundItemSize.x/5, 0, Math.PI*2, false);
                ctx.fill();
                ctx.strokeStyle = '#B8CDEC';
                ctx.beginPath();ctx.arc(centerX, size.y/2, size.y/3, degreeToRadians(i*angleStep),  degreeToRadians(i*angleStep+angleStep));ctx.stroke();
                ctx.beginPath();ctx.arc(centerX, size.y/2, size.y/3, degreeToRadians(i*angleStep + 180),  degreeToRadians(i*angleStep+angleStep + 180));ctx.stroke();
            }
        })

        for(let i = 0; i < this.viewport.x/this.bottleOriginalSize.x; i++){
            this.createBottle(this.bottleOriginalSize.x*1.1*i);
        }
        
        let that = this;
        var points = [];
        for(let i = 0; i < 6; i++){
         points.push(new V2(this.viewport.x*i/5, this.viewport.y/2));
        }

        points.forEach(p => 
            {
                this.addGo(new GO({
                    position: p,
                    size: new V2(20, 20),
                    img: this.roundItemImg,
                    isAnimated: true,
                    animation: {
                        totalFrameCount: this.roundItemFramesCount,
                        framesInRow: this.roundItemFramesCount,
                        framesRowsCount: 1,
                        frameChangeDelay: 100,
                        destinationFrameSize:new V2(20, 20),
                        sourceFrameSize: this.roundItemSize,
                        loop: true
                    }
                }),0);

                let lineSize = new V2(this.viewport.x/5, 5);
                this.addGo(new GO({
                    size: lineSize,
                    position: p.add(new V2(0, -that.roundItemSize.y/5)),
                    img: createCanvas(lineSize, (ctx, size) => {
                        ctx.fillStyle = '#4085C8'; ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = '#4B9DEA'; ctx.fillRect(0,0, size.x, 1);
                        ctx.fillStyle = '#356FA5';
                        ctx.fillRect(0,0,1, size.y);

                        ctx.fillStyle = '#001845';
                        ctx.fillRect(size.x/2, size.y/2, 1,1);
                        ctx.fillStyle = '#9FBFE6';
                        ctx.fillRect(size.x/2 - 1, size.y/2, 1,1);
                    })
                }),1)
            });

        this.distanceBetweenLamps = this.viewport.x/3;
        this.lampsPosX = [0, this.viewport.x/3, this.viewport.x*2/3, this.viewport.x];

        this.bottlesGeneratorTimer = createTimer(725, ()=> {
            this.createBottle(-this.bottleOriginalSize.x/0.95, this.viewport.y/2-this.bottleOriginalSize.y*6/7)
        }, this, true);
    }

    createBottle(posX) {
        let posY = this.viewport.y/2-this.bottleOriginalSize.y*6/7;
        this.addGo(new Bottle({
            position: new V2(posX, posY),
            size: this.bottleOriginalSize,//.mul(5),
            bottleImg: this.bottleImg,
            reflectionImages: {
                left: this.reflectionImgLeft,
                center: this.reflectionImgCenter,
                right: this.reflectionImgRight
            },
            backImages: { 
                left: this.backImgLeft,
                center: this.backImgCenter,
                right: this.backImgRight
            },
            setDestinationOnInit: true,
            destination: new V2(this.viewport.x+ 100,posY)
        }));
    }

    afterMainWork(now){
        if(this.bottlesGeneratorTimer){
            doWorkByTimer(this.bottlesGeneratorTimer, now);
        }
    }
}

class Bottle extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            speed: 0.25,
        }, options);

        super(options);

        this.body = this.addChild(new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.bottleImg,
            renderValuesRound: true
        }));

        this.back = this.addChild(new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.backImages.right,
            renderValuesRound: true
        }));

        this.reflection = this.addChild(new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.reflectionImages.right,
            renderValuesRound: true
        }));

        this.originY = this.position.y;

        this.shakingTimer = createTimer(50, () => {
            if(getRandomBool()){
                this.position.y = this.originY + 0.5;
            }
            else {
                this.position.y = this.originY;
            }

            this.needRecalcRenderProperties = true;
        }, this, true)
    }

    destinationCompleteCheck() {
        if(this.position.x - this.size.x/2 > this.parentScene.viewport.x){
            this.setDead();
        }

        // let distanceToLamps = this.parentScene.lampsPosX.map(x => x - this.position.x);
        // if(distanceToLamps.filter(x => Math.abs(x) <= this.size.x*2).length > 0){
        //     this.back.img = this.backImages.center;
        //     this.reflection.img = this.reflectionImages.center;
        // }
        // else {
        //     let maxNegative = Math.max.apply(null, distanceToLamps.filter(x => x < 0));
        //     let minPositive = Math.min.apply(null, distanceToLamps.filter(x => x > 0));
            
        //     if(Math.abs(maxNegative) < minPositive){
        //         this.back.img = this.backImages.left;
        //         this.reflection.img = this.reflectionImages.left;
                
        //     }
        //     else {
        //         this.back.img = this.backImages.right;
        //         this.reflection.img = this.reflectionImages.right;
        //     }
            
        // }
        
    }

    internalUpdate(now){
        if(this.shakingTimer)
            doWorkByTimer(this.shakingTimer, now);
    }
}
