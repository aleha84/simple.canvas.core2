document.addEventListener("DOMContentLoaded", function() {
    function sceneSelectByHashValue(){
        console.log(location.hash)
        let sceneName = location.hash.replace('#','');
        if(sceneName == ''){
            return;
        }
        

        // if(SCG.scenes.cachedScenes[sceneName] != undefined)
        //     SCG.scenes.selectScene(sceneName);
        // else 
        //     return;
    }

    SCG.globals.version = 0.1;

    SCG.src = {
        
    }

    
    SCG.scenes.cacheScene(new DraftsScene({
        name:'draft',
        viewport: new V2(150,150)
    }));

    SCG.scenes.cacheScene(new EffectsScene({
        name:'effects1',
        viewport: new V2(150,150)
    }));

    SCG.scenes.cacheScene(new Effects2Scene({
        name:'effects2',
        viewport: new V2(150,150)
    }));

    SCG.scenes.cacheScene(new Effects3Scene({
        name:'effects3',
        viewport: new V2(150,150)
    }));

    SCG.scenes.cacheScene(new Effects4Scene({
        name:'effects4',
        viewport: new V2(200,200)
    }));

    SCG.scenes.cacheScene(new Effects5Scene({
        name:'effects5',
        viewport: new V2(200,200)
    }));

    SCG.scenes.cacheScene(new LampScene({
        name:'lamp',
        viewport: new V2(150,150)
    }));

    SCG.scenes.cacheScene(new Lamp2Scene({
        name:'lamp2',
        viewport: new V2(150,150)
    }));

    SCG.scenes.cacheScene(new Lamp3Scene({
        name:'lamp3',
        viewport: new V2(150,150)
    }));

    SCG.scenes.cacheScene(new EarthScene({
        name:'earth',
        viewport: new V2(150,150)
    }));

    SCG.main.startV2('lamp3');

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});