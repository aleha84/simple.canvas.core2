const weaponTypes = ['pistol', 'submachinegun', 'rifle', 'sniper', 'machinegun', 'rpg'];

class Cell extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {  
            handlers: {
                // move: () => this.moveHandler()
                down: () => this.downHandler(),
                up: () => this.upHandler()
            }      
        }, options);

        super(options);
    }

    checkIndexInBoard(){
        return  this.index.x >= 0 && this.index.x < this.board.columns
            && this.index.y >= 0 && this.index.y < this.board.rows;
    }

    downHandler(){
        if(!this.checkIndexInBoard())
            return;

         this.board.selectedCell = this;
         this.content.setRotation(true);
    }

    upHandler() {
        this.board.selectedCell.content.stopRotation();
        if(!this.checkIndexInBoard()){
            this.board.selectedCell = undefined;
            return;
        }

        if(this.board.selectedCell == this){
            this.board.selectedCell = undefined;
            return;
        }
        
        //console.log(`from ${this.board.selectedCell.index} to ${this.index}`);
        //this.board.selectedCell.content.setDestination(new V2(this.size.x,0));
        
        // this.board.swap(this.board.selectedCell, this);
        // this.board.selectedCell = undefined;
        this.board.userAction(this.board.selectedCell, this);
    }

    addContent(go){
        this.content = go;
        this.addChild(go);
    }

    removeContent(go, setDead = false) {
        if(!go)
            return;

        this.content = undefined;
        this.removeChild(go);
        if(setDead){
            go.setDead();
        }
        else {
            let cell = this;
            go.fadeAway = true;
            go.position = this.getAbsolutePosition();
            go.size = go.size.clone();
            SCG.scenes.activeScene.addGo(go,1);
            SCG.scenes.activeScene.addGo(new MovingGO({
                size: go.size.division(2),
                position: go.position.clone(),
                imgPropertyName: "weapons",
                destSourceSize: go.weaponSpriteSourceSize.clone(),//new V2(150,150),
                destSourcePosition: go.weaponSpriteSourcePosition.clone(),
                setDestinationOnInit: true,
                setDeadOnDestinationComplete: true,
                destination: new V2(250, 0),
                destinationCompleteCallBack: function(){
                    cell.parent.parentScene.points.addPoint(go.weaponType);
                },
                speed: 4
            }),1);
        }
    }

    internalRender(){
        if(!this.highlight)
            return;

        let ctx = this.context;
        let hbw = SCG.viewport.scale /2;
        let prevLineWidth = ctx.lineWidth;
        let prevStrokeStyle = ctx.strokeStyle;
        ctx.lineWidth = 2*SCG.viewport.scale;
        if(this.fallSide === 'top')
            ctx.strokeStyle = 'blue';
        else if(this.fallSide === 'bottom')
            ctx.strokeStyle = 'red';
        else if(this.fallSide === 'left')
            ctx.strokeStyle = 'green';
        else if(this.fallSide === 'right')
            ctx.strokeStyle = 'yellow';

        ctx.beginPath();
        ctx.moveTo(this.renderBox.topLeft.x + hbw, this.renderBox.topLeft.y + hbw);
        ctx.lineTo(this.renderBox.topRight.x - hbw, this.renderBox.topRight.y + hbw);
        ctx.lineTo(this.renderBox.bottomRight.x - hbw, this.renderBox.bottomRight.y - hbw);
        ctx.lineTo(this.renderBox.bottomLeft.x + hbw, this.renderBox.bottomLeft.y - hbw);
        ctx.closePath();
        ctx.stroke();

        ctx.lineWidth = prevLineWidth;
        ctx.strokeStyle = prevStrokeStyle;
    }
}

let typeTodspMap = {
    type01: new V2(0,0),type02: new V2(275,0),type03: new V2(550,0),type04: new V2(825,0),type05: new V2(1100,0),type06: new V2(1375,0),
    type07: new V2(0,275),type08: new V2(275,275),type09: new V2(550,275),type10: new V2(825,275),type11: new V2(1100,275),type12: new V2(1375,275)
}

class CellContent extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            tileOptimization: true,
            initialSpeed: 1,
            speed: 1,
            speedDelta: 0.1,
            imgPropertyName: 'crystals',
            destSourceSize: new V2(275,275),
            fadeAway: false,
            alpha: 1,
            alphaDelta: 0.11,
            sizeDelta: 0.6,
            powerUp: {
                canvas: undefined,
                colorChangeDelta: 8,
                colorChangeDirection: -1,
                currentColor: [255,255,255]
            }
        }, options);

        if(!options.cellType)
            throw 'Cell type is undefined';

        super(options);
        this.destSourcePosition = typeTodspMap[this.cellType];

        this.rotationTimer = createTimer(getRandomInt(100,10000), this.setRotation, this, false);
        this.weaponType = weaponTypes[getRandomInt(0,weaponTypes.length-1)];

        if(this.weaponType) {
            switch(this.weaponType){
                case 'pistol': {
                    this.weaponSpriteSourcePosition = new V2(0,0);
                    break;
                }
                case 'submachinegun': {
                    this.weaponSpriteSourcePosition = new V2(150,0);
                    break;
                }
                case 'rifle': {
                    this.weaponSpriteSourcePosition = new V2(300,0);
                    break;
                }
                case 'sniper': {
                    this.weaponSpriteSourcePosition = new V2(450,0);
                    break;
                }
                case 'machinegun': {
                    this.weaponSpriteSourcePosition = new V2(600,0);
                    break;
                }
                case 'rpg': {
                    this.weaponSpriteSourcePosition = new V2(750,0);
                    break;
                }
                default: {
                    throw 'Unknown weapon type';
                }
            }

            this.weaponSpriteSourceSize = new V2(150,150);
        }
        // this.addChild(new GO({
        //     size: this.size.division(2.5),
        //     position: new V2(),
        //     imgPropertyName: "weapons",
        //     destSourceSize: new V2(150,150),
        //     destSourcePosition: new V2()
        // }));
    }

    powerUpPulsating(){
        let p = this.powerUp;
        if(!p.canvas){
            p.size = new V2(this.size.x*4, this.size.y*4);    
        }

        p.canvas = document.createElement('canvas');
        p.canvas.width = p.size.x;
        p.canvas.height = p.size.y;
        p.context = p.canvas.getContext('2d');

        p.gradient = 
                p.context.createRadialGradient(
                    0, 0, p.size.x/10,
                    0, 0, p.size.x/4
                );
        
        p.gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        p.gradient.addColorStop(1, `rgba(${p.currentColor.join(',')}, 0)`);

        p.context.translate(p.size.x/2,p.size.y/2);
        if(p.isHorizontal){
            p.context.rotate(degreeToRadians(90));
        }

        p.context.scale(1,2);
        p.context.fillStyle=p.gradient;
        p.context.fillRect(-p.size.x/2,-p.size.y/2, p.size.x, p.size.y)

        if(p.currentColor[0] + p.colorChangeDelta*p.colorChangeDirection < 0){
            p.colorChangeDirection = 1;
            p.currentColor[0] = 0;
            p.currentColor[1] = 0;
        }
        else if(p.currentColor[0] + p.colorChangeDelta*p.colorChangeDirection > 255){
            p.colorChangeDirection = -1;
            p.currentColor[0] = 255;
            p.currentColor[1] = 255;
        }
        else {
            p.currentColor[0]+=p.colorChangeDelta*p.colorChangeDirection;
            p.currentColor[1]+=p.colorChangeDelta*p.colorChangeDirection;
        }
        
    }

    stopRotation(){
        this.rotation.stop = true;
    }

    setRotation(fastAndLong){
        this.rotating = true;
        this.rotation = {
            max: fastAndLong ? 15 : getRandomInt(2,5),
            min: fastAndLong ? -15 : getRandomInt(-5,-2),
            speed: fastAndLong ? 5 : fastRoundWithPrecision(getRandom(0.8,1.2),2),
            repeat: fastAndLong ? 60 :  getRandomInt(1,5),
            currentRepeat: 0,
            currentAngle: 0,
            direction: 1
        }
    }

    destinationCompleteCallBack(){
        this.speed = this.initialSpeed;
        this.parent.removeChild(this);
        this.newParent.addContent(this);
        this.newParent = undefined;

        this.position = new V2();
        this.needRecalcRenderProperties = true;
        
        this.parent.board.transitionCompleted(this);
    }

    internalPreRender() {
        this.context.save();
        if(this.fadeAway)
            this.context.globalAlpha = this.alpha;
        
        if(this.rotating){
            this.context.translate(this.renderPosition.x, this.renderPosition.y);
            this.context.rotate(degreeToRadians(this.rotation.currentAngle));
            this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
        }
    }

    internalRender() {
        if(this.hasLineRemover && this.powerUp.canvas) {
            this.context.drawImage(this.powerUp.canvas, 
                (this.renderPosition.x - this.renderSize.x/2), 
                (this.renderPosition.y - this.renderSize.y/2), 
                this.renderSize.x, 
                this.renderSize.y);
            
        }
        
        if(!this.fadeAway){
            this.context.globalAlpha = 0.25;
            this.context.drawImage(SCG.images.weapons, 
                this.weaponSpriteSourcePosition.x,
                this.weaponSpriteSourcePosition.y,
                this.weaponSpriteSourceSize.x,
                this.weaponSpriteSourceSize.y,
                (this.renderPosition.x - this.renderSize.x/6), 
                (this.renderPosition.y - this.renderSize.y/6), 
                this.renderSize.x/3, 
                this.renderSize.y/3);
        }
        

        this.context.restore();
    }

    beforePositionChange(now){
        if(this.hasLineRemover){
            this.powerUpPulsating();
        }

        if(this.fadeAway) {
            if(this.alpha === 0)
                this.setDead();
            else {
                this.alpha-=this.alphaDelta;
                if(this.alpha < 0)
                    this.alpha = 0;

                this.size.x -= this.sizeDelta;
                this.size.y -= this.sizeDelta;
                this.needRecalcRenderProperties = true;
            }
        }
        
            
        if(this.destination) {
            this.speed+=this.speedDelta;
        }
        else {
            if(!this.rotating) {
                doWorkByTimer(this.rotationTimer, now);
            }
            else {
                if(this.rotating) {
                    let r = this.rotation;

                    if(r.stop){
                        r.currentAngle = 0;
                        this.rotating = false;
                        this.rotationTimer = createTimer(getRandomInt(2000,10000), this.setRotation, this, false);
                    }

                    if(r.currentAngle >= r.max){
                        r.direction = -1;
                        r.currentAngle = r.max;
                    }
                    else if(r.currentAngle <= r.min) {
                        r.direction = 1;
                        r.currentAngle = r.min;
                    }
    
                    let prev = r.currentAngle;
                    r.currentAngle += r.speed*r.direction;
    
                    if(
                        (prev === 0 || r.currentAngle === 0)
                        || (prev < 0 && r.currentAngle > 0)
                        || (prev > 0 && r.currentAngle < 0) 
                    ){
                        r.currentRepeat++;
                        if(r.currentRepeat >= r.repeat){
                            r.currentAngle = 0;
                            this.rotating = false;
                            this.rotationTimer = createTimer(getRandomInt(2000,10000), this.setRotation, this, false);
                        }
                    }
                }
            }
        }
        

    }
}