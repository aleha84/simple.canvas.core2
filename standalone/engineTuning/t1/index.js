document.addEventListener("DOMContentLoaded", function() {
    function sceneSelectByHashValue(){
        let sceneName = location.hash.replace('#','');
        if(sceneName == ''){
            return;
        }
        
        if(SCG.scenes.cachedScenes[sceneName] != undefined)
            SCG.scenes.selectScene(sceneName);
        else 
            return;
    }

    SCG.globals.version = 0.1;

    SCG.src = {
        
    }

    
    SCG.scenes.cacheScene(new EngineTuningT1Scene({
        name:'t1',
        viewport: new V2(100,200),
        //fitToScreen: true
    }));

    //SCG.scenes.selectScene('t1');
    //debugger;
    SCG.main.startV2('t1');
});