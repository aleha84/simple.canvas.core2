class DemoScene extends Scene {
    backgroundRender(){
        SCG.contexts.background.beginPath();
        SCG.contexts.background.rect(0, 0, SCG.viewport.real.width, SCG.viewport.real.height);
        SCG.contexts.background.fillStyle ='lightgreen';
        SCG.contexts.background.fill()
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

document.addEventListener("DOMContentLoaded", function() {

    SCG.src = {
		tree_sprite_sheet: 'content/tree1.png',
	}

    debugger;
    SCG.scenes.selectScene(new DemoScene( 
        { 
            name: 'demo_s1',
            go: [new DemoGO({position: new V2(250,150)})]
        }));
    
    SCG.main.start();
});