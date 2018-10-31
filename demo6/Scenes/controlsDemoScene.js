class ControlsDemoScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options);

        this.addUIGo(new UIButton({
            size: new V2(100, 25),
            text: GO.getTextPropertyDefaults('Default'),
            position: new V2(60,20)
        }));

        this.addUIGo(new UIButton({
            size: new V2(100, 25),
            text: {
                value: 'Custom',
                color: 'Purple',
                size: 10
            },
            position: new V2(60,50)
        }));

        this.addUIGo(new UICheckbox({
            position: new V2(20, 75),
            size: new V2(20,20)
        }));

        this.addUIGo(new UICheckbox({
            position: new V2(40, 75),
            size: new V2(15,15)
        }));

        this.addUIGo(new UICheckbox({
            position: new V2(55, 75),
            size: new V2(10,10)
        }));

        this.addUIGo(new UICheckbox({
            position: new V2(65, 75),
            size: new V2(5,5)
        }));
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}