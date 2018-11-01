class ControlsDemoScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options);

        this.addUIGo(new UIButton({
            size: new V2(100, 25),
            text: GO.getTextPropertyDefaults('Default'),
            position: new V2(60,20), 
            asImage: true
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

        this.addUIGo(new UICheckbox({
            position: new V2(20, 100),
            size: new V2(20,20),
            label: {
                value: 'checkbox',
                color: 'white'
            }
        }));

        this.addUIGo(new UIRadioButton({
            position: new V2(20, 125),
            size: new V2(20,20),
            group: 'demo1'
        }));

        this.addUIGo(new UIRadioButton({
            position: new V2(45, 125),
            size: new V2(20,20),
            group: 'demo1'
        }));

        this.addUIGo(new UIRadioButton({
            position: new V2(70, 125),
            size: new V2(20,20),
            group: 'demo1'
        }));

        this.addUIGo(new UIRadioButton({
            position: new V2(20, 150),
            size: new V2(20,20),
            group: 'demo2',
            label: {
                value: 'Red',
                color: 'red'
            }
        }));

        this.addUIGo(new UIRadioButton({
            position: new V2(95, 150),
            size: new V2(20,20),
            group: 'demo2',
            label: {
                value: 'Green',
                color: 'green'
            }
        }));

        this.addUIGo(new UIRadioButton({
            position: new V2(185, 150),
            size: new V2(20,20),
            group: 'demo2',
            label: {
                value: 'Blue',
                color: 'blue'
            }
        }));

        let panel1 = new UIPanel({
            position: new V2(200, 80),
            size: new V2(100,100)
        });

        // panel1.addControl(new UIButton({
        //     size: new V2(80, 25),
        //     text: GO.getTextPropertyDefaults('Inner'),
        //     position: new V2(0, -30)
        // }));

        panel1.addControl(new UIButton({
            size: new V2(80, 25),
            text: GO.getTextPropertyDefaults('Inner'),
            position: new V2(0, 50),
            asImage: true
        }));

        this.addUIGo(panel1)
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}