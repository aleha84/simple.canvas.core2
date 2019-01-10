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
        person: 'images/person_small.png',
        personHeadless: 'images/person_small_headless.png',
        back: 'images/back1.jpg',
        head: 'images/head.png',
        headSad: 'images/head_sad.png',
        hood: 'images/hood.png',
        headSadHooded: 'images/head_sad_hooded.png',
        headHooded: 'images/head_hooded.png',
        headHoodedGlasses: 'images/head_hooded_glasses.png'
	}

    debugger;
    
    let defaultViewpot = new V2(500,300);
    SCG.scenes.cacheScene(new EffectsScene({
        name:'effects',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new EffectsScene2({
        name:'effects2',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new PointerScene({
        name:'pointer',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new KaambezoneScene({
        name:'kaambezone',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new ItemsScene({
        name:'items',
        viewport: defaultViewpot
    }));

    

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});