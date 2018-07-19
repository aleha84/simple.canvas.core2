class Scene {
    constructor(props = {}){
        if(!props.name)
            throw "Can't create scene without name";
        
        assignDeep(this,{
            viewport: new V2(500, 300),
            goLayers: [],
            workplace: {},
            AI: undefined,
            ui: []
        }, props);    
    }

    addUIGo(go) {
        if(go === undefined)
            throw 'No GO provided';
        
        if(this.ui.indexOf(go) !== -1)
            return;

        this.ui.push(go);
        go.regEvents();

        go.parentScene = this;

        return go;
    }

    addGo(go, layerIndex = 0, regEvents = false) { // must be called instead of adding go directly
        if(go === undefined)
            throw 'No GO provided';

        if(this.goLayers[layerIndex] === undefined)
            this.goLayers[layerIndex] = [];

        this.goLayers[layerIndex].push(go);
        if(regEvents)
            go.regEvents(layerIndex);

        go.parentScene = this;
    }

    innerStart(sceneProperties) {
        SCG.viewport.graphInit();
        SCG.UI.invalidate();
        for(let layerIndex = 0; layerIndex < this.goLayers.length; layerIndex++){ 
            if(this.goLayers[layerIndex] === undefined)
                this.goLayers[layerIndex] = [];

            let goLayer = this.goLayers[layerIndex];

            for(let goi = 0; goi < goLayer.length; goi++){
                goLayer[goi].regEvents();
            }
        }

        this.start(sceneProperties);
    }

    start(sceneProperties) {}

    backgroundRender() {}
    
    innerDispose(){
        SCG.controls.clearEventsHandlers(); //reset event hadlers

        this.dispose();
    }
    
    dispose() {}

    preMainWorkInner(now) {
        SCG.contexts.main.clearRect(0, 0, SCG.viewport.real.width, SCG.viewport.real.height);
        this.preMainWork(now);
    }

    preMainWork(now) {
         
    }

    afterMainWork(now) {}

    cycleWork(now) {
        this.preMainWorkInner(now);

        for(let layerIndex = 0; layerIndex < this.goLayers.length; layerIndex++){
            let goLayer = this.goLayers[layerIndex];
            if(goLayer === undefined)
                continue;

            let i = goLayer.length;
            while (i--) {
                goLayer[i].update(now);
                goLayer[i].render();
        
                if(SCG.frameCounter && goLayer[i].renderPosition!=undefined){
                    SCG.frameCounter.visibleCount++;
                }
        
                if(!goLayer[i].alive){
                    var deleted = goLayer.splice(i,1);
                }
            }
        }
        
        this.afterMainWork(now);
    }
}

SCG.scenes = {
    activeScene: undefined,
    cachedScenes: {},
    selectScene(scene, sceneProperties){
        if(!scene)
            throw 'Cant select undefined scene';
        if(this.activeScene)
            this.activeScene.innerDispose(); //disposing current scene if exists

        if(scene instanceof Scene)
            this.activeScene = scene;
        else if(typeof(scene) === 'string')
            this.activeScene = this.cachedScenes[scene];

        if(!this.activeScene)
            throw 'No scene selected';      

        SCG.viewport.logical = new Box(new V2, this.activeScene.viewport);

        // AI creation
		SCG.AI.initialize();        

        this.activeScene.innerStart(sceneProperties);
    },
    cacheScene(scene) { //to reuse later
        if(!scene)
            throw "Can't register undefined scene";
        if(scene.name === undefined)
            throw "Can't register scene without name";

        this.cachedScenes[scene.name] = scene;
    }
}