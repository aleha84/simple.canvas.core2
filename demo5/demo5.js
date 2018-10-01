document.addEventListener("DOMContentLoaded", function() {

    SCG.globals.version = 0.1;

    SCG.src = {
        crystals: 'threeInARow/images/crystals.png',
        zombies: 'threeInARow/images/zombies.jpg',
        soldier_back: 'threeInARow/images/soldier_back.png'
	}

    debugger;
    
    let defaultViewpot = new V2(500,300);
    SCG.scenes.cacheScene(new ThreeInARowScene({
        name:'threeInARow',
        viewport: defaultViewpot
    }));

    SCG.scenes.selectScene('threeInARow');
    
    SCG.main.start();
});