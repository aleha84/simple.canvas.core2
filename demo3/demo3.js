document.addEventListener("DOMContentLoaded", function() {
    let scenesNames = ['tilemap', 'movement'];

    function sceneSelectByHashValue(){
        let sceneIndex = location.hash !== '' ? scenesNames.indexOf(location.hash.replace('#','')) : 0;
        if(sceneIndex === -1)
            sceneIndex = 0;

        SCG.scenes.selectScene(scenesNames[sceneIndex]);
    }
    
    SCG.globals.version = 0.2;

    SCG.src = {
        tilemap: 'content/tilemap.png',
        terrain_atlas: 'content/terrain_atlas.png',
        treesTileSet1: 'content/treesTileSet1.png'
	}

    debugger;
    
    let defaultViewpot = new V2(500,300);
    SCG.scenes.cacheScene(new ViewportMovementScene({
        name:'movement',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new TileMapScene({
        name:'tilemap',
        viewport: defaultViewpot
    }));

    sceneSelectByHashValue();

    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});