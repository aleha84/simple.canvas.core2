class Scene {
    constructor(props = {}){
        if(!props.name)
            throw "Can't create scene without name";
        
        assignDeep(this,{
            viewport: new V2(500, 300),
            goLayers: [],
            space: new V2(500, 300),
            AI: undefined,
            ui: [],
            clearGOOnDispose: true,
            timers: [],
            debug: {
                enabled: false,
                font: (25*SCG.viewport.scale) + 'px Arial',
                textAlign: 'left',
                fillStyle: 'red',
                position: new V2(20*SCG.viewport.scale, 20*SCG.viewport.scale),
                showFrameTimeLeft: false,
                estimatedFrameLength: 1000/60,
                additional: []
            },
            collisionDetection: {
                enabled: false,
                level: 1,
                cells: [],
                init(spaceSize){
                    if(this.level == 0){
                        this.enabled = false;
                    }

                    if(!this.enabled)
                        return;

                    this.cellSize = new V2(spaceSize.x/this.level, spaceSize.y/this.level);

                    let rowsCount = parseInt(spaceSize.y/this.cellSize.y);
                    let columnsCount = parseInt(spaceSize.x/this.cellSize.x);
                    this.cells = [];

                    for(let ri = 0; ri < rowsCount; ri++){
                        this.cells[ri] = [];

                        for(let ci = 0; ci < columnsCount; ci++){
                            this.cells[ri][ci] = [];
                        }
                    }
                },
                remove(go) {
                    if(!go.collisionDetection || !go.collisionDetection.enabled){
                        console.trace();
                        throw `GO id: ${go.id} collision detection is disabled.`;
                    }
                        

                    for(let ci = 0; ci < go.collisionDetection.cells.length; ci++){
                        let goCdCell = go.collisionDetection.cells[ci];
                        let sceneCdCell = this.cells[goCdCell.y][goCdCell.x];
                        let index = sceneCdCell.indexOf(go);
                        if(index > -1){
                            sceneCdCell.splice(index, 1);
                        }
                    }
                },
                update(go){
                    if(!this.enabled) {
                        console.trace();
                        throw `Scene collision detection is disabled.`;
                    }

                    if(!go.collisionDetection || !go.collisionDetection.enabled){
                        console.trace();
                        throw `GO id: ${go.id} collision detection is disabled.`;
                    }

                    this.remove(go);

                    go.collisionDetection.cells = [];

                    if(!go.alive)
                        return;

                    //let corners = [go.collisionDetection.box.topLeft, go.collisionDetection.box.topRight, go.collisionDetection.box.bottomLeft, go.collisionDetection.box.bottomRight];

                    let tl = go.collisionDetection.box.topLeft;
                    let topLeftIndex = {x: Math.floor(tl.x/this.cellSize.x), y :Math.floor(tl.y/this.cellSize.y)};
                    let br = go.collisionDetection.box.bottomRight;
                    let bottomRightIndex = { x: Math.floor(br.x/this.cellSize.x), y: Math.floor(br.y/this.cellSize.y)};

                    for(let ri = topLeftIndex.y; ri <= bottomRightIndex.y;ri++){
                        for(let ci = topLeftIndex.x; ci <= bottomRightIndex.x;ci++){
                            let index = new V2(ci, ri);
                            if(go.collisionDetection.cells.filter((c) => c.equals(index)).length == 0){
                                if(this.cells[index.y] === undefined || this.cells[index.y][index.x] === undefined)
                                    continue;
    
                                go.collisionDetection.cells.push(index);
                                this.cells[index.y][index.x].push(go);
                            }
                        }
                    }

                    // for(let ci = 0; ci < corners.length;ci++){
                    //     let corner = corners[ci];
                    //     let index = new V2(Math.floor(corner.x/this.cellSize.x), Math.floor(corner.y/this.cellSize.y));
                    //     if(go.collisionDetection.cells.filter((c) => c.equals(index)).length == 0){
                    //         if(this.cells[index.y][index.x] === undefined)
                    //             continue;

                    //         go.collisionDetection.cells.push(index);
                    //         this.cells[index.y][index.x].push(go);
                    //     }
                    // }

                    this.check(go);
                },
                getCircuit(go) {
                    if(!go.collisionDetection.enabled){
                        console.trace();
                        throw `GO id: ${go.id} collision detection is disabled.`;
                    }

                    let cd = go.collisionDetection;
                    let aCircuit = []
                    if(cd.circuit.length){
                        let position = go.position;
                        if(go.parent){
                            position = go.absolutePosition;
                        }
                        return cd.circuit.map((item) => item.add(position));
                    }
                    else 
                        return [ cd.box.topLeft, cd.box.topRight, cd.box.bottomRight, cd.box.bottomLeft ];
                },
                checkCircuitsIntersection(go1, go2) {
                    let c1 = this.getCircuit(go1);
                    let c2 = this.getCircuit(go2);
                    let intersections = [];
                    for(let ci1 = 1; ci1 <= c1.length; ci1++){
                        if(c1.length == 2 && ci1 == 2)
                            continue;

                        let line1 = { begin: c1[ci1-1], end: c1[ci1 == c1.length ? 0:ci1] };
                        for(let ci2 = 1; ci2 <= c2.length; ci2++){
                            if(c2.length == 2 && ci2 == 2)
                                continue;

                            let line2 = { begin: c2[ci2-1], end: c2[ci2 == c2.length ? 0:ci2] };
                            let intersection = segmentsIntersectionVector2_1_noV2(line1, line2);//segmentsIntersectionVector2(line1, line2);
                            if(intersection !== undefined){
                                intersections.push({intersection, line: line2});
                            }
                        }
                    }

                    return intersections;
                },
                check(go){
                    let collidedWith = [];
                    let onCollisionPayload = [];
                    for(let ci = 0; ci < go.collisionDetection.cells.length; ci++){
                        let goCell = go.collisionDetection.cells[ci];
                        let sceneCdCell = this.cells[goCell.y][goCell.x];

                        if(sceneCdCell.length <= 1)
                            continue;

                        for(let gi = 0; gi < sceneCdCell.length; gi++){
                            let goInSceneCdCell = sceneCdCell[gi];
                            if(goInSceneCdCell == go)
                                continue;

                            if(
                                go.collisionDetection.exclude.indexOf(goInSceneCdCell) != -1
                                || goInSceneCdCell.collisionDetection.exclude.indexOf(go) != -1 )
                                continue;

                            if(collidedWith.indexOf(goInSceneCdCell) != -1)
                                continue;

                            if(go.collisionDetection.preCheck 
                                && isFunction(go.collisionDetection.preCheck) 
                                && !go.collisionDetection.preCheck.call(go, goInSceneCdCell))
                                continue;

                            if(go.collisionDetection.box.isIntersectsWithBox(goInSceneCdCell.collisionDetection.box)){ // todo more preciese collision
                                if(go.collisionDetection.circuit.length || goInSceneCdCell.collisionDetection.circuit.length){
                                    let inetersections = this.checkCircuitsIntersection(go, goInSceneCdCell);
                                    if(inetersections.length){
                                        onCollisionPayload.push({collidedWith: goInSceneCdCell, collisionPoints:inetersections.map(i => i.intersection), details: inetersections})
                                        //go.collisionDetection.onCollision.call(go, goInSceneCdCell, inetersections);    
                                        collidedWith.push(goInSceneCdCell);
                                    }
                                }
                                else {
                                    onCollisionPayload.push({go: goInSceneCdCell});
                                    //go.collisionDetection.onCollision.call(go, goInSceneCdCell);
                                    collidedWith.push(goInSceneCdCell);
                                }
                            }
                        }
                    }

                    if(onCollisionPayload.length){
                        if(onCollisionPayload.length == 1){
                            go.collisionDetection.onCollision.call(go, onCollisionPayload[0].collidedWith, onCollisionPayload[0].collisionPoints, onCollisionPayload[0].details);
                        }
                        else {
                            go.collisionDetection.onCollision.call(go, onCollisionPayload);
                        }
                    }
                }
            },
            events: { // custom event handling
                up: undefined,
                down: undefined,
                move: undefined,
                keyup: undefined
            },
            scrollOptions: { // default scroll options
                enabled: false,
                type: SCG.viewport.scrollTypes.drag,
                restrictBySpace: true
            }
        }, props);   
        
        if(!props.space)
            this.space = this.viewport;

        this.sceneCenter = new V2(this.viewport.x/2, this.viewport.y/2);
    }

    backgroundRenderDefault(color){
        SCG.contexts.background.fillStyle = color || 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    backgroundRenderImage(img) {
        SCG.contexts.background.drawImage(img, 0,0, SCG.viewport.real.width,SCG.viewport.real.height);
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

    clearGo(layerIndex) {
        if(layerIndex === undefined)
            this.goLayers = [];
        else 
            this.goLayers[layerIndex] = [];
    }

    addGo(go, layerIndex = 0, regEvents = false) { // must be called instead of adding go directly
        if(go === undefined)
            throw 'No GO provided';

        if(!(go instanceof GO))
            throw 'To addGo must be passed object derived from GO';

        if(this.goLayers[layerIndex] === undefined)
            this.goLayers[layerIndex] = [];

        this.goLayers[layerIndex].push(go);
        if(regEvents)
            go.regEvents(layerIndex);

        go.parentScene = this;
        go.layerIndex = layerIndex;

        return go;
    }

    removeGo(go, regEvents = false){
        let goIndex = this.goLayers[go.layerIndex].indexOf(go);
        if(goIndex == -1){
            return false;
        }

        if(regEvents)
            go.unRegEvents();

        this.goLayers[go.layerIndex].splice(goIndex,1);

        return true;
    }

    changeLayer(go, layerIndex, regEvents) {
        if(!this.removeGo(go, regEvents)){
            console.log('failed to change layer for GO. Not found in layer');
            return;
        }

        // let goIndex = this.goLayers[go.layerIndex].indexOf(go);
        // if(goIndex == -1){
        //     console.log('failed to change layer for GO. Not found in layer');
        //     return;
        // }

        // if(regEvents)
        //     go.unRegEvents();

        // this.goLayers[go.layerIndex].splice(goIndex,1);
         
        go.changeLayerIndex = undefined;
        this.addGo(go, layerIndex, regEvents);

        return go;
    }

    innerStart(sceneProperties) {
        SCG.viewport.graphInit();
        SCG.UI.invalidate();
        for(let layerIndex = 0; layerIndex < this.goLayers.length; layerIndex++){ 
            if(this.goLayers[layerIndex] === undefined)
                this.goLayers[layerIndex] = [];

            let goLayer = this.goLayers[layerIndex];

            for(let goi = 0; goi < goLayer.length; goi++){
                goLayer[goi].regEvents(layerIndex);
                // todo reg events for childrens
            }
        }

        // init collision detection matrix
        if(this.collisionDetection && this.collisionDetection.enabled){
            this.collisionDetection.init(this.space);
        }

        this.start(sceneProperties);
    }

    start(sceneProperties) {}

    backgroundRender() {}
    
    innerDispose(){
        SCG.controls.clearEventsHandlers(); //reset event hadlers

        if(this.clearGOOnDispose)
            this.clearGo();

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

    processTimers(now) {
        for(let timer of this.timers) {
            doWorkByTimer(timer, now);
        }
    }

    registerTimer(timer) {
        if(this.timers.indexOf(timer) == -1)
            this.timers.push(timer);

        return timer;
    }

    regTimerDefault(delay, callback) {
        return this.registerTimer(createTimer(delay, callback, this, true));
    }

    unregTimer(timer) {
        let p = this.timers.indexOf(timer);
        if(p != -1)
            this.timers.splice(p, 1);
    }

    cycleWork(now) {
        this.preMainWorkInner(now);

        for(let layerIndex = 0; layerIndex < this.goLayers.length; layerIndex++){
            let goLayer = this.goLayers[layerIndex];
            if(goLayer === undefined)
                continue;

            let i = goLayer.length;
            while (i--) {
                if(goLayer[i].changeLayerIndex != undefined){
                    let go = this.changeLayer(goLayer[i], goLayer[i].changeLayerIndex, true);
                    go.render();
                    continue;
                }
                goLayer[i].update(now);
                goLayer[i].render();
        
                // if(SCG.frameCounter && goLayer[i].renderPosition!=undefined){
                //     SCG.frameCounter.visibleCount++;
                // }
        
                if(!goLayer[i].alive){
                    var deleted = goLayer.splice(i,1);
                    if(deleted.length){
                        deleted[0].afterDead();
                    }
                    
                }
            }
        }
        
        this.afterMainWork(now);
        
        this.processTimers(now);

        if(this.debug.enabled){

            let ctx = SCG.contexts.main;

            ctx.font = this.debug.font;
            ctx.textAlign = this.debug.textAlign;
            ctx.fillStyle = this.debug.fillStyle;
            
            ctx.fillText(SCG.main.performance.fps, this.debug.position.x, this.debug.position.y);

            if(this.debug.showFrameTimeLeft){
                let flROunded = SCG.main.performance.frameLengthInMilliseconds;
                this.debug.additional[0] = 'Frame performance load (%): ' + fastRoundWithPrecision(100* flROunded/this.debug.estimatedFrameLength,1);
                this.debug.additional[1] = 'Frame time (ms): ' + fastRoundWithPrecision(SCG.main.performance.frameLengthInMilliseconds,1);
            }

            let p = this.debug.position.y;
            for(let debugData of this.debug.additional){
                p+=12*SCG.viewport.scale;
                ctx.fillText(debugData, this.debug.position.x, p);
            }
        }
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
        SCG.viewport.originalLogical = new Box(new V2, this.activeScene.viewport);
        SCG.viewport.scrollOptions = this.activeScene.scrollOptions;

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
    },
    setNeedRecalcRenderProperties(){
        for(let layerIndex = 0; layerIndex < SCG.scenes.activeScene.goLayers.length; layerIndex++){ 
            if(SCG.scenes.activeScene.goLayers[layerIndex] === undefined)
                continue;
                
            for(let goi = 0; goi <  SCG.scenes.activeScene.goLayers[layerIndex].length; goi++){ // force recalculate go render params
                SCG.scenes.activeScene.goLayers[layerIndex][goi].needRecalcRenderProperties = true;
            }
        }
    }
}