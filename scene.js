class Scene {
    constructor(props){
        if(!props.name)
            throw "Can't create scene without name";
        
        this.name = props.name;
        this.go = [];
        this.workplace = {};
    }

    start()

    backgroundRender()

    dispose()

    preMainWork() {
        SCG.context.clearRect(0, 0, SCG.viewport.width, SCG.viewport.height);
    }

    afterMainWork()
}

Scg.scenes = {
    activeScene: undefined,
    cachedScenes: {},
    selectScene: function(scene, sceneProperties){
        if(!scene)
            throw 'Cant select undefined scene';

        if(scene instanceof Scene)
            this.activeScene = scene;
        else if(typeof(scene) === 'string')
            this.activeScene = this.cachedScenes[scene];

        if(!this.activeScene)
            throw 'No scene selected';

        this.activeScene.start();

    },
    registerScene: function(scene) { 
        if(!scene)
            throw "Can't register undefined scene";
        if(scene.name === undefined)
            throw "Can't register scene without name";

        this.scenes[scene.name] = scene;
    }
}