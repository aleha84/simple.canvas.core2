var grassTileSize = new V2(10,10);
var grassSheetSize = new V2(30,10);
var viewport = new V2(100,100);

class DemoScene extends Scene {
    constructor(options = {}) {
        //options.bgGo = [];
        if(options.go === undefined)
            options.go = [];


        for(let x = 0; x < options.viewport.x/grassTileSize.x; x++) {
            for(let y = 0; y < options.viewport.y/grassTileSize.y; y++) {
                options.go.push(
                    new GrassTile(
                        {
                            position: new V2((x*grassTileSize.x)+grassTileSize.x/2, (y*grassTileSize.y)+grassTileSize.y/2),
                            shaking: {
                                enabled: x == 2 && y == 2
                            }
                        }
                    )
                );
            }
        }
        super(options);
    }

    backgroundRender(){
        // for(let i = 0; i < this.bgGo.length;i++) {
        //     this.bgGo[i].needRecalcRenderProperties = true;
        //     this.bgGo[i].update();
        //     this.bgGo[i].render();
        // }
        // SCG.contexts.background.beginPath();
        // SCG.contexts.background.rect(0, 0, SCG.viewport.real.width, SCG.viewport.real.height);
        // SCG.contexts.background.fillStyle ='lightgreen';
        // SCG.contexts.background.fill()
    }
}

class DemoGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            imgPropertyName: 'tree_sprite_sheet',
            size: new V2(20,20),
            destSourceSize: new V2(45,45),
            destSourcePosition: new V2
        }, options);

        super(options);
    }
}

class GrassTile extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            imgPropertyName: 'grass_sheet',
            destSourcePosition: new V2((getRandomInt(0,(grassSheetSize.x/grassTileSize.x)-1))*grassTileSize.x,0),//new V2(getRandomInt(0,20), getRandomInt(0,10)),
            destSourceSize: grassTileSize.clone(),
            size: grassTileSize.clone(),
            // contextName: 'background',
            shaking: {
                enabled: false,
                step: 0,
                maxStep: 3
            },
            internalPreUpdate: (now) => {
                if(this.shaking.enabled)
                    doWorkByTimer(this.shaking.timer, now);
            }
        }, options);

        super(options);

        this.shaking.timer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: 500,
            originDelay: 500,
            doWorkInternal: () => {
                let sh = this.shaking;
                sh.step++;
                if(sh.step > sh.maxStep)
                    sh.enabled = false;

                switch(sh.step){
                    case 0:
                    case 2:
                    default:
                        this.destSourcePosition.y = 0;
                        break;
                    case 1: 
                        this.destSourcePosition.y = 10;
                        break;
                    case 3: 
                        this.destSourcePosition.y = 20;
                        break;
                }

            },
            content: this
        };
    }
}

class BunnyGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            imgPropertyName: 'bunny_sheet',
            isAnimated: true,
            animation: {
                totalFrameCount: 13,
                framesInRow: 13,
                framesRowsCount: 1,
                frameChangeDelay: 250,
                destinationFrameSize: new Vector2(10,10),
                sourceFrameSize: new Vector2(10,10),
                loop: true,
            },
            size: new V2(10,10),
        }, options);

        super(options);
    }
}

document.addEventListener("DOMContentLoaded", function() {

    SCG.src = {
        tree_sprite_sheet: 'content/tree1.png',
        grass_sheet: 'content/grass_sheet.png',
        bunny_sheet: 'content/bunny_sheet.png'
	}

    debugger;
    SCG.scenes.selectScene(new DemoScene( 
        { 
            viewport: viewport.clone(),
            name: 'demo_s1',
            go: [
            //    new DemoGO({position: new V2(50,50)})
                new BunnyGO({position: new V2(viewport.x/2,viewport.y/2)})
            ]
        }));
    
    SCG.main.start();
});