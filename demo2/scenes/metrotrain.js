class MetroTrainScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            vagons: [],
            vagonsMaxCount: 7
        }, options);

        super(options);
        // let colors = [0,0,255];
        let darkerBy = 5;
        let currentSize = new V2(this.space.y, this.space.y);
        let currentPosition = new V2(this.space.x/2, this.space.y/2);
        let shiftDelta = 0;
        for(let i = this.vagonsMaxCount; i >= 0; i--){
            let vagon = new MetroVagon({
                imgPropertyName: 'vagon',
                position: currentPosition.clone(),
                size: currentSize.clone(),
                effectLenght: 150,
                darkerBy: darkerBy,
                vagonName: 'vagon_' + i,
                scene: this
            });

            this.vagons[i] = vagon;
            if(i != this.vagonsMaxCount){
                this.vagons[i+1].followedBy = vagon;
                vagon.precededBy = this.vagons[i+1];
            }

            this.addGo(vagon, i, false);
            darkerBy+=10;
            currentSize.mul(0.5, true);
            currentPosition.x-=shiftDelta;
            shiftDelta/=2;
        }

        this.lightTimer = createTimer(1500, this.lightTimerMethod, this, false);
        this.shakingTimer = createTimer(1000, this.shakingTimerMethod, this, false);
        this.darkVagonTimer = createTimer(5000, this.darkVagonTimerMethod, this, false);

        this.startTurnTimer();
    }

    darkVagonTimerMethod(){
        let triggeredVagon = this.vagons[getRandomInt(0, this.vagonsMaxCount)];
        triggeredVagon.triggerDarkVagon = true;
        triggeredVagon.darkVagon.time = getRandomInt(1000,5000);
    }

    lightTimerMethod(){
        let triggeredVagon = this.vagons[this.vagonsMaxCount];
        triggeredVagon.triggerLight = true;
        triggeredVagon.light.side = getRandomBool() ? 'left': 'right'
    }

    shakingTimerMethod(){
        let triggeredVagon = this.vagons[this.vagonsMaxCount];
        triggeredVagon.triggerShaking = true;
    }

    turnBackTimerMethod(){
        this.turnBackTimer = undefined;
        let triggeredVagon = this.vagons[this.vagonsMaxCount-1];
        triggeredVagon.triggerTurnBack = true;
    }

    turnTimerMethod(){
        this.turnTimer = undefined;
        let triggeredVagon = this.vagons[0];
        triggeredVagon.triggerTurn = true;
        triggeredVagon.turn.direction = getRandomBool() ? 'right': 'left';
    }

    startTurnBackTimer(){
        this.turnBackTimer = createTimer(getRandomInt(2000,6000), this.turnBackTimerMethod, this, false); // randomize time
    }

    startTurnTimer(){
        this.turnTimer = createTimer(getRandomInt(4000, 8000), this.turnTimerMethod, this, false); // randomize time
    }

    preMainWork(now){
        doWorkByTimer(this.lightTimer, now);
        doWorkByTimer(this.shakingTimer, now);
        doWorkByTimer(this.darkVagonTimer, now);
        
        if(this.turnBackTimer){
            doWorkByTimer(this.turnBackTimer, now);
        }

        if(this.turnTimer){
            doWorkByTimer(this.turnTimer, now);
        }
    }

    createVagonCanvas(makeDarkerBy = 5) {
        let width = this.space.y;
        let height = this.space.y;
        let center = new V2(width/2, height/2);
        let vagonCanvas =  document.createElement('canvas');
        vagonCanvas.width = width;
        vagonCanvas.height = height;
        let ctx = vagonCanvas.getContext('2d');

        ctx.fillStyle = `rgb(${0+makeDarkerBy},${255-makeDarkerBy},${0+makeDarkerBy})`;
        ctx.beginPath();
        ctx.moveTo(0,0);ctx.lineTo(width,0);ctx.lineTo(center.x,center.y);ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0,height);ctx.lineTo(width,height);ctx.lineTo(center.x,center.y);ctx.fill();
        ctx.fillStyle = `rgb(${255-makeDarkerBy},${0+makeDarkerBy},${0+makeDarkerBy})`;
        ctx.beginPath();
        ctx.moveTo(0,0);ctx.lineTo(0,height);ctx.lineTo(center.x,center.y);ctx.fill();
        ctx.beginPath();
        ctx.moveTo(width,0);ctx.lineTo(width,height);ctx.lineTo(center.x,center.y);ctx.fill();

        let clearWidth = width/2;
        let clearHeight = height/2;
        ctx.fillStyle = `rgb(${0+makeDarkerBy},${0+makeDarkerBy},${255-makeDarkerBy})`;
        ctx.fillRect(width/2-clearWidth/2, height/2-clearHeight/2, clearWidth, clearHeight);

        let holeSize = new V2(clearWidth/2, clearHeight);
        ctx.fillStyle = `rgba(0,0,0,0)`;
        ctx.moveTo(width/2,height/2+clearHeight/2);ctx.lineTo(width/2-clearHeight/4,height/2+clearHeight/2);
        
        this.moveByPoints(ctx, new V2(width/2,height/2+clearHeight/2), 
        [new V2(-clearWidth/4, 0), new V2(0,-clearWidth/4), new V2(-clearWidth/8, 0), new V2(0, (-clearHeight/2)-clearHeight/8), 
            new V2(clearWidth*3/4, 0), new V2(0, (clearHeight/2)+clearHeight/8), new V2(-clearWidth/8, 0), new V2(0, clearHeight/4)], 
        'rgba(0,0,0,0)');
        ctx.clearRect(0, 0, width, height);

        return vagonCanvas;
    }

    moveByPoints(ctx, startFrom, deltaPoints, fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(startFrom.x, startFrom.y);
        let current = startFrom.clone();
        for(let i =0;i<deltaPoints.length;i++){
            current.add(deltaPoints[i], true);
            ctx.lineTo(current.x, current.y);
        }
        //ctx.fill();
        ctx.closePath();
        //ctx.stroke();
        ctx.clip();
    }
}

class MetroVagon extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            shaking: { 
                enabled: false 
            },
            darkVagon: {
                enabled: false,
                time: 1000
            },
            light: {
                enabled: false,
                side: 'right',
                color: [255,255,255],
                gradient: undefined
            },
            turn: {
                enabled: false,
                direction: 'left',
            },
            turnBack: {
                enabled: false,
                direction: 'right',
            }
        }, options);

        super(options);

        //this.turn.maxShift = this.size.x*0.1;
        this.shaking.max = this.size.y/400;
    }

    shakingMethod(){
        this.shaking.enabled = false;
        if(this.followedBy) {
            this.followedBy.triggerShaking = true;
        }
    }

    lightOffMethod() {
        this.light.enabled = false;
        if(this.followedBy) {
            this.followedBy.triggerLight = true;
            this.followedBy.light.side = this.light.side;
        }
    }

    darkVagonMethod(){
        this.darkVagon.enabled = false;
        this.img = SCG.images['vagon'];
        // if(this.followedBy) {
        //     this.followedBy.triggerDarkVagon = true;
        // }
    }

    destinationCompleteCallBack() {
        if(this.turn.enabled){
            this.turn.enabled = false;
            if(this.precededBy && this.precededBy.precededBy) {
                this.precededBy.triggerTurn = true;
                this.precededBy.turn.direction = this.turn.direction;
            }
            else {
                this.scene.startTurnBackTimer();
            }
        }
        

        if(this.turnBack.enabled){
            this.turnBack.enabled = false;
            if(this.followedBy) {
                this.followedBy.triggerTurnBack = true;
                this.followedBy.turnBack.direction = this.turnBack.direction;
            }
            else {
                this.scene.startTurnTimer();
            }
        }
    }

    positionChangedCallback(delta){
        if(this.turn.enabled || this.turnBack.enabled){
            if(this.followedBy) {
                this.followedBy.shiftFollower(delta);
            }
        }
    }

    shiftFollower(delta) {
        this.position.add(delta, true);
        this.needRecalcRenderProperties = true;
        if(this.followedBy) {
            this.followedBy.shiftFollower(delta);
        }
    }

    internalUpdate(now) {
        if(this.triggerTurn){
            this.triggerTurn = false;
            this.turn.enabled = true;

            let shift = this.size.x/10;
            this.speed =  shift/60;
            this.setDestination(new V2((this.turn.direction === 'left' ? -1 : 1) *shift, 0), true);
        }

        if(this.triggerTurnBack){
            this.triggerTurnBack = false;
            this.turnBack.enabled = true;
            this.turnBack.direction = (this.turn.direction === 'left' ? 'right': 'left');
            let shift = this.size.x/10;
            this.speed =  shift/60;
            this.setDestination(new V2((this.turnBack.direction === 'left' ? -1 : 1) *shift, 0), true);
        }

        if(this.triggerLight){
            this.triggerLight = false;
            this.light.enabled = true;
            this.lightOffTimer = createTimer(this.effectLenght, this.lightOffMethod, this, false);
        }

        if(this.triggerShaking) {
            this.triggerShaking = false;
            this.shaking.enabled = true;
            this.shakingTimer = createTimer(this.effectLenght, this.shakingMethod, this, false);
        }

        if(this.triggerDarkVagon){
            this.triggerDarkVagon = false;
            this.darkVagon.enabled = true;
            this.img = SCG.images['vagonDark'];
            this.darkVagonTimer = createTimer(this.darkVagon.time, this.darkVagonMethod, this, false);
        }

        if(this.light.enabled){
            doWorkByTimer(this.lightOffTimer, now);
        }

        if(this.shaking.enabled){
            doWorkByTimer(this.shakingTimer, now);
        }

        if(this.darkVagon.enabled){
            doWorkByTimer(this.darkVagonTimer, now);
        }


    }

    internalPreRender(){
        this.context.fillStyle = `rgb(${0+this.darkerBy},${255-this.darkerBy},${0+this.darkerBy})`;
        this.context.fillRect(this.renderPosition.x-this.renderSize.x/2, this.renderPosition.y+this.renderSize.y/2-(this.renderSize.y*0.1), this.renderSize.x, this.renderSize.y*0.2);

        if(this.shaking.enabled){
            if( this.shaking.enabled){
                let shake = this.shaking.max*SCG.viewport.scale;
                if(shake < 1)
                    shake = 1;

                this.renderPosition.y += shake
                this.needRecalcRenderProperties = true;
            }
        }
    }

    internalRender(){
        this.context.save();
        if(this.light.enabled){
            if(this.light.side === 'both'){
                this.context.fillStyle = this.light.color;
                this.context.fillRect(this.renderPosition.x-this.renderSize.x/2, this.renderPosition.y-this.renderSize.y/2, this.renderSize.x, this.renderSize.y);
            }
            else {
                let gradient = undefined; 
                if(this.light.side === 'left'){
                    gradient = this.context.createLinearGradient(this.renderPosition.x-this.renderSize.x/2, this.renderPosition.y, this.renderPosition.x, this.renderPosition.y);
                    gradient.addColorStop(0, `rgba(${this.light.color.join(',')}, 0.5)` );
                    gradient.addColorStop(1, `rgba(${this.light.color.join(',')}, 0)`);
                    this.context.fillStyle = gradient;
                    this.context.fillRect(this.renderPosition.x-this.renderSize.x/2, this.renderPosition.y-this.renderSize.y/2, this.renderSize.x/2, this.renderSize.y);
                }
                else if(this.light.side === 'right'){
                    gradient = this.context.createLinearGradient(this.renderPosition.x, this.renderPosition.y, this.renderPosition.x+this.renderSize.x/2, this.renderPosition.y);
                    gradient.addColorStop(0, `rgba(${this.light.color.join(',')}, 0)` );
                    gradient.addColorStop(1, `rgba(${this.light.color.join(',')}, 0.5)`);
                    this.context.fillStyle = gradient;
                    this.context.fillRect(this.renderPosition.x, this.renderPosition.y-this.renderSize.y/2, this.renderSize.x/2, this.renderSize.y);
                }
            }
        }

        this.context.restore();
    }
}