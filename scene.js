class Scene {
    constructor(props = {}){
        if(!props.name)
            throw "Can't create scene without name";
        
        props = Object.assign({
            viewport: new V2(500, 300)
        }, props);
        
        //todo add merge ?

        this.name = props.name;
        this.go = [];
        this.workplace = {};
        this.viewport = props.viewport;
    }

    start()

    backgroundRender()

    dispose()

    preMainWork() {
        SCG.context.clearRect(0, 0, SCG.viewport.width, SCG.viewport.height);
    }

    afterMainWork()

    cycleWork() {
        this.preMainWork();

        var i = this.go.length;
        while (i--) {
            this.go[i].update(now);
            this.go[i].render();
    
            if(SCG.frameCounter && this.go[i].renderPosition!=undefined){
                SCG.frameCounter.visibleCount++;
            }
    
            if(!this.go[i].alive){
                var deleted = this.go.splice(i,1);
            }
        }

        this.afterMainWork();
    }
}

SCG.scenes = {
    activeScene: undefined,
    cachedScenes: {},
    selectScene: function(scene, sceneProperties){
        if(!scene)
            throw 'Cant select undefined scene';
        if(this.activeScene)
            this.activeScene.dispose(); //disposing current scene if exists

        if(scene instanceof Scene)
            this.activeScene = scene;
        else if(typeof(scene) === 'string')
            this.activeScene = this.cachedScenes[scene];

        if(!this.activeScene)
            throw 'No scene selected';      

        SCG.viewport.logical = new Box(new V2, this.viewport);

        this.activeScene.start();
    },
    cacheScene: function(scene) { //to reuse later
        if(!scene)
            throw "Can't register undefined scene";
        if(scene.name === undefined)
            throw "Can't register scene without name";

        this.cachedScenes[scene.name] = scene;
    }
}