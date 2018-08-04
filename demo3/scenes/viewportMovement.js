class ViewportMovementScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            space: new V2(1000, 1000),
            // events: {
            //     move: () => console.log('!!!')
            // }
        }, options);

        super(options);
        this.gos = [];

        for(let x = 1; x < 10; x++){
            this.gos.push(this.addGo(new ViewportMovementSample({
                position: new V2(x*100, 100)
            }),1));
        }

        this.cameraShiftDelta = new V2(0.25,0);
        this.cameraShiftDeltaDirection = 1;

        this.cameraMovementTimer = createTimer(50, this.cameraMovementProcesser, this, false);

        this.visibleObjectLabel = this.addUIGo(new UILabel(
            { 
                position: new V2(25,10), 
                text: {
                    size: 6,
                    color: 'black'
                },
                format: {
                    format: "Visible objects: {0}",
                    argsRetriever: () => { 
                        return [this.gos.filter((item) => item.renderPosition !== undefined ).length]; }
                }
            }))
    }

    cameraMovementProcesser(){
        let currentShift = SCG.viewport.shift;
        if(currentShift.x+this.viewport.x >= this.space.x){
            this.cameraShiftDeltaDirection = -1;
        }
        else if(currentShift.x <= 0)
        {
            this.cameraShiftDeltaDirection = 1;
        }

        SCG.viewport.camera.updatePosition(SCG.viewport.shift.add(this.cameraShiftDelta.mul(this.cameraShiftDeltaDirection)));
        SCG.UI.invalidate();
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'lightgray';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now){
        doWorkByTimer(this.cameraMovementTimer, now);
    }
}

class ViewportMovementSample extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(60,60),
            isCustomRender: true,
            //speed: 0.2
        }, options);

        super(options);

        this.text = GO.getTextPropertyDefaults(this.position.toString())
        this.text.autoCenter = true;
        this.text.size = 9;

        this.setDestination(new V2(this.position.x, this.position.y + 100));
    }

    customRender(){
        this.context.fillStyle = this.fillStyle;
        let center = this.renderPosition;
        let radius = this.renderSize.x;
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius/2, 0, 2 * Math.PI, false);
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'red';
        this.context.stroke();

        this.renderText();
        //this.renderBox.render();
    }
}