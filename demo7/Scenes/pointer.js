class PointerScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {

        }, options);

        super(options);

        this.pointerSize = new V2(20,30);
        this.folderImgSize = new V2(30, 25);
        this.folderSize = this.folderImgSize.mul(2);
        this.desctopItemSize = new V2(20,20)
        this.holePoint = this.folderSize.addScalar(20).add(new V2(this.folderImgSize.x*12, this.folderImgSize.y*4));
        this.holeRadius = 10;

        this.desctopItemImg = createCanvas(new V2(1,1), function(ctx, size){
            ctx.fillStyle = '#008080';
            ctx.fillRect(0,0,size.x, size.y);
            // ctx.strokeStyle = 'red';
            // ctx.strokeRect(0,0,size.x-1, size.y-1);
        })

        this.desctopItemImg2 = createCanvas(this.desctopItemSize, function(ctx, size){
            ctx.fillStyle = '#008080';
            ctx.fillRect(0,0,size.x, size.y);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(0.5,0.5,size.x-1, size.y-1);
        })

        this.exeImg = createCanvas(this.folderImgSize, function(ctx, size){
            ctx.fillStyle = 'black';
            ctx.fillRect(0,0, size.x, size.y);
            ctx.fillStyle = '#7F7F7F';
            ctx.fillRect(0,0, size.x-1, size.y-1);
            ctx.fillStyle = '#BFBFBF';
            ctx.fillRect(1,1, size.x-3, size.y-3);
            ctx.fillStyle = '#0000BF';
            ctx.fillRect(2,2, size.x-4, 4);
            ctx.fillStyle = '#7F7F7F';
            ctx.fillRect(2,7, size.x-5, 15);
            ctx.fillStyle = 'white';
            ctx.fillRect(3,8, size.x-6, 14);
            ctx.fillStyle = 'black';
            ctx.fillRect(size.x-5,3, 3, 3);
            ctx.fillStyle = '#BFBFBF';
            ctx.fillRect(size.x-5,3, 2, 2);
        });

        this.exeImgSelected = createCanvas(this.folderImgSize, function(ctx, size){
            ctx.fillStyle = 'black';
            ctx.fillRect(0,0, size.x, size.y);
            ctx.fillStyle = '#7F7F7F';
            ctx.fillRect(0,0, size.x-1, size.y-1);
            ctx.fillStyle = '#BFBFBF';
            ctx.fillRect(1,1, size.x-3, size.y-3);
            ctx.fillStyle = '#0000BF';
            ctx.fillRect(2,2, size.x-4, 4);
            ctx.fillStyle = '#7F7F7F';
            ctx.fillRect(2,7, size.x-5, 15);
            ctx.fillStyle = 'white';
            ctx.fillRect(3,8, size.x-6, 14);
            ctx.fillStyle = 'black';
            ctx.fillRect(size.x-5,3, 3, 3);
            ctx.fillStyle = '#BFBFBF';
            ctx.fillRect(size.x-5,3, 2, 2);

            let sc =  hexToRgb('000080', true);
            ctx.fillStyle = `rgba(${sc[0]},${sc[1]},${sc[2]}, 0.5)`
            ctx.fillRect(0,0, size.x, size.y);
        });

        //

        this.documentImg = createCanvas(this.folderImgSize, function(ctx, size){
            ctx.fillStyle = 'white';
            ctx.fillRect(6,1,18,23);
            // ctx.strokeStyle = '#0000FF';
            // ctx.strokeRect(5.5,0.5,20,24);
            ctx.fillStyle ='#7F787F';
            ctx.fillRect(5, 1, 1, 22); ctx.fillRect(6, 0, 17, 1);ctx.fillRect(6, 23, 1, 1)
            ctx.fillStyle = 'black';
            ctx.fillRect(7, 24, 16, 1);ctx.fillRect(23, 1, 1, 23);ctx.fillRect(24, 1, 1, 22)
            ctx.fillStyle = '#BFB8BF';
            ctx.fillRect(23, 1, 1, 22);ctx.fillRect(7, 23, 16, 1);

            ctx.fillStyle = '#00007F';
            for(let r = 4; r < 20; r++){
                if(r%2 != 0){
                    if(r < 10){
                        ctx.fillRect(14, r, 7, 1);
                    }
                    else 
                        ctx.fillRect(9, r, 12, 1);
                }
            }

            ctx.fillStyle = 'red';
            ctx.fillRect(9,5, 4,5);

        })
        this.folderImg = createCanvas(this.folderImgSize, function(ctx, size){
            let fillColor1 = '#FFFF00';
            let fillColor2 = '#C0C0C0';
            ctx.imageSmoothingEnabled= false
            ctx.fillStyle = fillColor1;
            ctx.fillRect(0,0, size.x-1, size.y - 1)
            ctx.fillStyle = fillColor2;
            for(let r = 0;r < size.y-1;r++){
                for(let c = 0 ; c < size.x-1; c++){
                    if(r%2 == 0 ? c%2==0 : c%2!= 0){
                        ctx.fillRect(c,r,1,1);
                    }
                }
            }

            ctx.fillStyle = '#808080';
            ctx.fillRect(0,size.y*1/5, size.x-3, 1);ctx.fillRect(0,0, 1, size.y-2);ctx.fillRect(0,size.y-3, size.x-3, 1);ctx.fillRect(0,0, size.x/2, 1);ctx.fillRect(size.x/2-1,0, 1, size.y*1/5);
            ctx.fillRect(2,0, 1, size.y*1/5)
            ctx.fillStyle = '#808000';
            ctx.fillRect(size.x-3,size.y*1/5+2, 1, size.y*4/5-4);
            ctx.fillStyle = '#000000';
            ctx.fillRect(size.x-2,size.y*1/5+2, 1, size.y*4/5-4);ctx.fillRect(1,size.y-2, size.x-3, 1);
            ctx.clearRect(0,size.y-2,1,1);ctx.clearRect(size.x-2,size.y-2,1,1);ctx.clearRect(size.x-3,size.y*1/5,2,2);ctx.clearRect(size.x/2,0,size.x/2,size.y*1/5);
            ctx.clearRect(0,0,2,size.y*1/5)
            ctx.fillRect(size.x-3,size.y*1/5+1, 1, 1);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(1,size.y*1/5+1, size.x-4, 1);ctx.fillRect(1,size.y*1/5+1, 1, size.y*4/5-4);ctx.fillRect(3,1, 1, size.y*1/5);ctx.fillRect(3,1, size.x/2-4, 1);
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(1,size.y*1/5, size.x/2-2, 1);ctx.fillRect(size.x/2-2,1, 1, size.y*1/5-1);
        })

        this.pointer = this.addGo(new Pointer({
            img: createCanvas(this.pointerSize, function(ctx, size){
                ctx.originImageSmoothingEnabled = false;
                draw(ctx, { fillStyle: 'white', lineWidth: 1, strokeStyle: 'black', 
                points: [new V2(1,1), new V2(size.x-1, size.y*3/5), new V2(size.x/2+size.x*0.75/10, size.y*6.5/10), 
                    new V2(size.x/2+size.x*2.5/10, size.y-size.y*1/10), new V2(size.x/2+size.x*0.5/10, size.y-1), new V2(size.x/2-size.x*1.25/10, size.y*7/10), new V2(1, size.y*4/5)] })
            }),
            size: this.pointerSize.clone(),
            position: new V2(this.viewport.x*1/5, this.viewport.y*4/5),
            setDestinationOnInit: true,
            scriptedMovement: [
                {position: new V2(220, 250), time: 2000}, {position: new V2(280, 180), time: 2000}, {position: new V2(180, 200), time: 2500}, 
                {position: new V2(80, 90), time: 1000}, {position: new V2(180, 85), time: 900}, {position: new V2(275, 95), time: 700},
                {position: new V2(400, 150), time: 500}, {position: new V2(350, 170), time: 500}, {position: new V2(410, 180), time: 500}, {position: new V2(270, 190), time: 400},
                {position: new V2(420, 210), time: 1000}, {position: new V2(440, 180), time: 800}, { position: new V2(445, 185), time: 500, click: true }, { position: new V2(445, 182), time: 250, click: true },
                { position: new V2(442, 184), time: 150, click: true }, { position: new V2(438, 179), time: 150, click: true }, { position: new V2(439, 183), time: 150, click: true }, { position: new V2(444, 181), time: 150, click: true }
                , { position: new V2(449, 183), time: 150, click: true }, { position: new V2(451, 186), time: 150, click: true }]
            //destination: new V2(180, 200),
            //speed: 1,
            //path: [new V2(60, 100)]
        }), 10);


        //this.pointer.moveTo(new V2(180, 200), 2000);

        this.folders = [this.addGo(new Selectable({
            img: this.folderImg,
            position: this.folderSize.addScalar(20),
            size: this.folderSize,
            title: 'Cats'
        }),6), this.addGo(new Selectable({
            img: this.folderImg,
            position: this.folderSize.addScalar(20).add(new V2(this.folderImgSize.x*3, 0)),
            size: this.folderSize,
            title: 'Fun'
        }),6), this.addGo(new Selectable({
            img: this.folderImg,
            position: this.folderSize.addScalar(20).add(new V2(this.folderImgSize.x*6, 0)),
            size: this.folderSize,
            title: 'Flowers'
        }),6),this.addGo(new Selectable({
            img: this.folderImg,
            position: this.folderSize.addScalar(20).add(new V2(0, this.folderImgSize.y*4)),
            size: this.folderSize,
            title: 'Cars'
        }),6),this.addGo(new Selectable({
            img: this.documentImg,
            position: this.folderSize.addScalar(20).add(new V2(this.folderImgSize.x*3, this.folderImgSize.y*4)),
            size: this.folderSize,
            title: 'Work.dok'
        }),6),this.addGo(new Selectable({
            img: this.documentImg,
            position: this.folderSize.addScalar(20).add(new V2(this.folderImgSize.x*6, this.folderImgSize.y*4)),
            size: this.folderSize,
            title: 'Bank.dok'
        }),6)]

        this.virus = this.addGo(new Selectable({
            img: this.exeImg,
            selectedImg: this.exeImgSelected,
            position: this.holePoint.clone(),
            size: this.folderSize,
            title: 'xxxHot.exe',
            virus: true
        }),6)

        this.folders.push(this.virus); 

        // this.pointerClickDemoTimer = createTimer(3000, () => {
        //     this.pointer.click();
        // }, this, true)

        // this.virusShakingTimer = createTimer(2500, () => {
        //     this.virus.startShaking();
        // }, this, false)

        //this.virusShakingTimer.currentDelay = 12000;

        this.desctopItems = [];
        for(let r = 0; r < this.viewport.y/this.desctopItemSize.y; r++){
            for(let c = 0; c < this.viewport.x/this.desctopItemSize.x; c++){
                let di = this.addGo(new DesctopItem({
                    img: this.desctopItemImg,
                    img2: this.desctopItemImg2,
                    size: this.desctopItemSize,
                    position: new V2(this.desctopItemSize.x*c+this.desctopItemSize.x/2, this.desctopItemSize.y*r+this.desctopItemSize.y/2)
                }),4)
                 this.desctopItems.push(di);
            }
        }

        this.addGo(new GO({
            position: new V2(this.viewport.x/2, this.viewport.y/2).add(new V2(0,20)),
            size: this.viewport.clone(),
            img:  createCanvas(this.viewport.clone(), function(ctx, size){
                let grd = ctx.createLinearGradient(size.x/2,0,size.x/2,size.y-1);
                //grd.addColorStop(0, 'rgba(255,0,0,0)')
                grd.addColorStop(0.2, 'rgba(255,0,0,0)')
                grd.addColorStop(0.45, 'rgba(255,0,0,0.5)')
                grd.addColorStop(0.475, 'rgba(255,0,0,0.75)')
                grd.addColorStop(0.5, 'rgba(255,255,0,1)')
                grd.addColorStop(0.525, 'rgba(255,0,0,0.75)')
                grd.addColorStop(0.55, 'rgba(255,0,0,0.5)')
                grd.addColorStop(0.8, 'rgba(255,0,0,0)')

                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);

                grd = ctx.createRadialGradient(size.x*4/5, size.y/2, 0, size.x*4/5, size.y/2, size.x/2);
                grd.addColorStop(0, 'rgba(0,0,0,0)');
                grd.addColorStop(1, 'rgba(0,0,0,1)');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);
            })
        }),2)

        this.BSOD = this.addGo(new GO({
            size: this.viewport.clone(),
            position: new V2(this.viewport.x/2, this.viewport.y/2),
            img: createCanvas(this.viewport.clone(), function(ctx, size){
                ctx.fillStyle = '#0B1AFB';
                ctx.fillRect(0,0, size.x, size.y);

                ctx.fillStyle = '#C5C3C4';
                ctx.fillRect(size.x/2 - 30, size.y*1/3 - 12, 60, 15)
                ctx.font = '14px Arial';
                ctx.fillStyle = '#0B1AFB';
                ctx.textAlign = 'center';
                ctx.fillText('Шindoмs', size.x/2, size.y*1/3);

                ctx.fillStyle = 'white';
                ctx.textAlign = 'left';
                ctx.font = '12px Arial';
                ctx.fillText('A fatal exception XXX has occured at 0783:1505 in AB:FF.', size.x*1/10, size.y*1/3 + 24);
                ctx.fillText('Your computer will be terminated.', size.x*1/10, size.y*1/3 + 42);
                ctx.fillText('* Do not panic.', size.x*1/10, size.y*1/3 + 60);
                ctx.fillText('* Stay calm. Hold on there.', size.x*1/10, size.y*1/3 + 80);
                ctx.fillText('You will (or already) lose all saved information in all applications. ', size.x*1/10, size.y*1/3 + 100);
                ctx.textAlign = 'center';
                ctx.fillText('Please do not press any key', size.x/2, size.y*1/3 + 130);
            }),
            isVisible: false
        }), 20);
    }

    startHole(){
        this.holeStarted = true;
        this.holeIncreaseTimer = createTimer(100, () => {
            this.holeRadius+=2.5;
            for(let i = 0; i < this.desctopItems.length; i++){
                let di = this.desctopItems[i];
                if(di.shaking.enabled)
                    continue;
                
                if(this.holePoint.distance(di.position) <= this.holeRadius){
                    di.startShaking();
                }

                if(!di.alterImgSetted && this.holePoint.distance(di.position) <= this.holeRadius+50  && getRandomInt(0,5) == 5){
                    di.img = di.img2;
                    di.alterImgSetted = true;
                }
            }

            for(let i = 0; i < this.folders.length;i++){
                let f = this.folders[i];
                if(f.shaking.enabled || f.falling)
                    continue;
                
                if(this.holePoint.distance(f.position) <= this.holeRadius){
                    f.startShaking();
                    f.shaking.currentCount = f.virus ? 20: 10;
                    //console.log('folder shaking started. Title: ' +f.title)
                }
            }

            if(this.holeRadius > 500)
                this.holeIncreaseTimer = undefined;

        }, this, true);

        this.holeIncreaseTimer.currentDelay = 3000;

        this.startPointerRunavayTimer = createTimer(3500, () => {
            this.virus.setSelected(false);
            this.startPointerRunavayTimer = undefined;
            this.pointer.moveTo(new V2(250, 150), 500);
            this.pointer.scriptedMovement = [
                {position: new V2(270, 180), time: 250}, {position: new V2(370, 120), time: 500}, {position: new V2(380, 150), time: 500}, {position: new V2(360, 170), time: 250}
                , {position: new V2(260, 50), time: 750}, {position: new V2(270, 70), time: 250}, {position: new V2(230, 90), time: 500}, {position: new V2(290, 150), time: 1500}
                , {position: new V2(295, 160), time: 250}, {position: new V2(285, 165), time: 150}, {position: new V2(270, 160), time: 250}
                , {position: new V2(260, 150), time: 500}, {position: new V2(240, 190), time: 350}, {position: new V2(220, 130), time: 500}, {position: new V2(200, 160), time: 400}
                , {position: new V2(170, 180), time: 250}, {position: new V2(130, 100), time: 450}, {position: new V2(100, 140), time: 350}, {position: new V2(80, 155), time: 550}
                , {position: new V2(70, 165), time: 350}, {position: new V2(65, 125), time: 350}, {position: new V2(60, 165), time: 450}, {position: new V2(55, 135), time: 350}]
           for(let i = 0; i < 5; i++){
            this.pointer.scriptedMovement.push({position: new V2(getRandomInt(30,55), getRandomInt(110,140)), time: getRandomInt(100,200)})    
           }
           this.pointer.scriptedMovement = [...this.pointer.scriptedMovement, ...[{position: new V2(50, 150), time: 350}, {position: new V2(90, 150), time: 350}, {position: new V2(110, 150), time: 350, fall: true}]]
        }, this, false);
    }

    afterMainWork(now){
        if(this.pointerClickDemoTimer)
            doWorkByTimer(this.pointerClickDemoTimer, now);

        if(this.virusShakingTimer)
            doWorkByTimer(this.virusShakingTimer, now);

        if(this.holeIncreaseTimer)
            doWorkByTimer(this.holeIncreaseTimer, now);

        if(this.startPointerRunavayTimer)
            doWorkByTimer(this.startPointerRunavayTimer, now);
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

class DesctopItem extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            tileOptimization: true,
            shaking: {
                enabled: false,
                currentCount: -1,
                count: 4,
                direction: 1,
                angle: 2,
                currentAngle: 0,
                angleStep: 0.25,
                max: 7
            }
        }, options);

        super(options);
    }

    startShaking(){
        this.img = this.img2;
        let s = this.shaking;
        this.shakingTimer = createTimer(100, this.shakingTimerMethod, this, true);
        this.shakingIncreaseTimer = createTimer(100, () => {
            s.angle+=s.angleStep;
            if(s.angle >= s.max){
                s.angle = s.max;
                this.shakingIncreaseTimer = undefined;
                this.shakingTimer = undefined;
                let dist = this.position.distance(this.parentScene.holePoint);
                if(dist > 30){
                    this.speed = dist/(1500/17);
                    if(this.speed > 3)
                        this.speed = 3;

                    // let dir = this.position.direction(this.parentScene.holePoint)
                    // this.setDestination(this.position.add(dir.mul(dist/2)));
                    this.setDestination(this.parentScene.holePoint);
                }
                
                //this.setDeadOnDestinationComplete = true;
                this.originSize = this.size.clone();
                this.sizeChangeDelta = 1;
                this.addEffect(new SizeInEffect({setParentDeadOnComplete: true, initOnAdd: true, effectTime: 1000, min: 0.05, updateDelay: 50, dimension:'both'}))
            }
        }, this, false)
        s.enabled = true;
        s.currentCount = s.count;
    }

    shakingTimerMethod(){
        let s = this.shaking;
        // if(s.currentCount < 0){
        //     s.enabled = false;
        //     this.shakingTimer = undefined;
        // }

        s.currentAngle = s.direction*s.angle;
        s.direction *= -1;
        //s.currentCount--;
    }

    internalUpdate(now){
        if(this.shaking.enabled){
            if(this.shakingTimer){
                doWorkByTimer(this.shakingTimer, now);
            }
    
            if(this.shakingIncreaseTimer)
                doWorkByTimer(this.shakingIncreaseTimer, now);
        }
        

        if(this.changeSizeTimer)
            doWorkByTimer(this.changeSizeTimer, now);
    }

    internalPreRender() {
        if(this.shaking.enabled){
            this.context.translate(this.renderPosition.x, this.renderPosition.y);
            this.context.rotate(degreeToRadians(this.shaking.currentAngle));
            this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
        }
    }

    internalRender() {
        if(this.shaking.enabled){
            this.context.translate(this.renderPosition.x, this.renderPosition.y);
            this.context.rotate(degreeToRadians(-this.shaking.currentAngle));
            this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
        }
    }
}

class Selectable extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            title: 'Debug',
            shaking: {
                enabled: false,
                currentCount: 2,
                count: 4,
                direction: 1,
                angle: 5,
                currentAngle: 0
            }
        }, options);

        super(options);

        this.originImg = this.img;

        let that = this;
        this.title = this.addChild(new GO({
            position: new V2(0, this.size.y*5/6),
            size: new V2(this.size.x, this.size.y/3),
            originImg: createCanvas(new V2(this.size.x, this.size.y/3), function(ctx, size){
                ctx.font = '12px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(that.title, size.x/2, size.y*4/6);
            }),
            selectedImg: createCanvas(new V2(this.size.x, this.size.y/3), function(ctx, size){
                ctx.fillStyle = '#000080';
                ctx.fillRect(0,0, size.x, size.y);
                
                ctx.font = '12px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(that.title, size.x/2, size.y*4/6);
            })
        }));

        this.setSelected(false);
    }

    setSelected(selected){
        if(selected){
            this.img = this.selectedImg;
            this.title.img = this.title.selectedImg;    
        }
        else {
            this.img = this.originImg;
            this.title.img = this.title.originImg;
        }
        
    }

    startShaking(){
        this.shakingTimer = createTimer(100, this.shakingTimerMethod, this, true);
        this.shaking.enabled = true;
        this.shaking.currentCount = this.shaking.count;
    }

    shakingTimerMethod(){
        let s = this.shaking;
        if(s.currentCount!=-1 && s.currentCount <= 0){
            //s.enabled = false;
            this.shakingTimer = undefined;
            s.falling = true;
            this.removeChild(this.title);
            if(!this.virus){
                this.speed = 3;
                this.setDestination(this.parentScene.holePoint);
                this.setDeadOnDestinationComplete = true;
            }
            
            this.originSize = this.size.clone();
            this.sizeChangeDelta = 1;
            this.changeSizeTimer = createTimer(25, () => {
                this.size = this.originSize.mul(this.sizeChangeDelta);
                this.sizeChangeDelta-=0.025;
                if(this.virus)
                    this.needRecalcRenderProperties = true;

                if(this.sizeChangeDelta <= 0.05){
                    this.changeSizeTimer = undefined;
                    this.setDead();
                }
            }, this, false);
        }

        s.currentAngle = s.direction*s.angle;
        s.direction *= -1;
        s.currentCount--;
    }

    internalUpdate(now){
        if(this.shakingTimer){
            doWorkByTimer(this.shakingTimer, now);
        }

        if(this.changeSizeTimer){
            doWorkByTimer(this.changeSizeTimer, now);
        }
    }

    internalPreRender() {
        if(this.shaking.enabled){
            this.context.translate(this.renderPosition.x, this.renderPosition.y);
            this.context.rotate(degreeToRadians(this.shaking.currentAngle));
            this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
        }
    }

    internalRender() {
        if(this.shaking.enabled){
            this.context.translate(this.renderPosition.x, this.renderPosition.y);
            this.context.rotate(degreeToRadians(-this.shaking.currentAngle));
            this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
        }
    }
}

class Pointer extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            clickSizeChange: 0.85
        }, options);

        super(options);

        this.originSize = this.size.clone();

        this.initTimer = createTimer(2000, () => {
            let s = this.scriptedMovement.shift();
            this.moveTo(s.position, s.time);
            this.initTimer = undefined;
        }, this, false);
    }

    click(){
        this.clickTimer = createTimer(100, () => { 
            if(this.resized){
                this.clickTimer = undefined;
                this.size = this.originSize.clone();
                this.resized = undefined;
            }
            else {
                this.size = this.originSize.mul(this.clickSizeChange);
                this.resized = true;
            }

            this.needRecalcRenderProperties = true;
         }, this, true);

         if(!this.parentScene.holeStarted){
             this.parentScene.startHole();
             this.parentScene.virus.setSelected(true);
        }
    }

    moveTo(destination, time) {
        let distance = this.position.distance(destination);
        let frameLen = 1000/60;

        this.speed = distance/(time/frameLen);
        this.finalSpeed = this.speed/3;

        this.setDestination(destination);
        this.startSpeedChangeTimer = createTimer(time*2/4, () => {
            this.startSpeedChangeTimer = undefined;
            this.speedChangeCount = 10;
            this.speedChangeDelta = (this.speed - this.finalSpeed)/this.speedChangeCount;
            this.speedChangeTimer = createTimer((time/2)/this.speedChangeCount, () => {
                this.speed -= this.speedChangeDelta;
                this.speedChangeCount--;
                if(this.speedChangeCount <= 0){
                    this.speedChangeTimer = undefined;
                }
            }, this, true)
        }, this, false)
    }

    destinationCompleteCallBack(){
        if(!this.scriptedMovement.length)
            return;

        
        let s = this.scriptedMovement.shift();
        if(s.click){
            this.click();
        }

        if(s.fall){
            this.speed = 5;
            this.setDestination(this.parentScene.holePoint);
                this.setDeadOnDestinationComplete = true;
                // this.originSize = this.size.clone();
                // this.sizeChangeDelta = 1;
            this.addEffect(new SizeInEffect({setParentDeadOnComplete: true, initOnAdd: true, effectTime: 1000, min: 0.05, updateDelay: 50, dimension:'both'}))
            this.parentScene.BSOD.isVisible = true;
            this.parentScene.BSOD.addEffect(new SizeOutEffect({ effectTime: 500, updateDelay: 25, startDelay: 1500, initOnAdd: true, dimension: 'y' }));
            
            return;
        }
        
        this.moveTo(s.position, s.time);
    }

    internalUpdate(now){
        if(this.initTimer)
            doWorkByTimer(this.initTimer, now);

        if(this.clickTimer)
            doWorkByTimer(this.clickTimer, now);

        if(this.startSpeedChangeTimer)
            doWorkByTimer(this.startSpeedChangeTimer, now);

        if(this.speedChangeTimer)
            doWorkByTimer(this.speedChangeTimer, now);
    }
}