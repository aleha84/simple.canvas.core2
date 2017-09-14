var grassTileSize = new V2(10,10);

class DemoScene extends Scene {
    constructor(options = {}) {
        options.bgGo = [];
        for(let x = 0; x < options.viewport.x/grassTileSize.x; x++) {
            for(let y = 0; y < options.viewport.y/grassTileSize.y; y++) {
                options.bgGo.push(new GrassTile({position: new V2((x*grassTileSize.x)+grassTileSize.x/2, (y*grassTileSize.y)+grassTileSize.y/2)}));
            }
        }
        super(options);
    }

    backgroundRender(){
        for(let i = 0; i < this.bgGo.length;i++) {
            this.bgGo[i].needRecalcRenderProperties = true;
            this.bgGo[i].update();
            this.bgGo[i].render();
        }
        // SCG.contexts.background.beginPath();
        // SCG.contexts.background.rect(0, 0, SCG.viewport.real.width, SCG.viewport.real.height);
        // SCG.contexts.background.fillStyle ='lightgreen';
        // SCG.contexts.background.fill()
    }
}

class DemoGO extends GO {
    constructor(options = {}) {
        options = Object.assign({}, {
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
        options = Object.assign({}, {
        imgPropertyName: 'grass_sheet',
        destSourcePosition: new V2,//new V2(getRandomInt(0,20), getRandomInt(0,10)),
        size: grassTileSize.clone(),
        contextName: 'background'
        }, options);

        super(options);
    }
}

document.addEventListener("DOMContentLoaded", function() {

    SCG.src = {
        tree_sprite_sheet: 'content/tree1.png',
        grass_sheet: 'content/grasstile1.png'
	}

    debugger;
    SCG.scenes.selectScene(new DemoScene( 
        { 
            viewport: new V2(100,100),
            name: 'demo_s1',
            go: [new DemoGO({position: new V2(250,150)})]
        }));
    
    SCG.main.start();
});