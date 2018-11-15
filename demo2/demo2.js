document.addEventListener("DOMContentLoaded", function() {
    let scenesNames = ['parallax', 'nightsky', 'flythrough', 'metrotrain', 'cyberslav'];

    function sceneSelectByHashValue(){
        let sceneIndex = location.hash !== '' ? scenesNames.indexOf(location.hash.replace('#','')) : 0;
        if(sceneIndex === -1)
            sceneIndex = 0;

        SCG.scenes.selectScene(scenesNames[sceneIndex]);
    }


    SCG.globals.version = 0.2;

    SCG.src = {
        vagon: 'images/vagon_lo.png',
        vagonDark: 'images/vagon_lo_dark.png',
        character: 'images/character1_cut_mid.png',
        c_background: 'images/c_background.png',
        c_title: 'images/c_title.png'
	}

    debugger;
    
    let defaultViewpot = new V2(500,300);
    SCG.scenes.cacheScene(new ParallaxScene({
        name:'parallax',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new NightSkyScene({
        name:'nightsky',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new FlytroughScene({
        name:'flythrough',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new MetroTrainScene({
        name:'metrotrain',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new CyberslavScene({
        name:'cyberslav',
        viewport: defaultViewpot
    }));

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});