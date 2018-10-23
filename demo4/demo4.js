document.addEventListener("DOMContentLoaded", function() {

    SCG.globals.version = 0.1;

    SCG.src = {
	}

    debugger;
    
    let defaultViewpot = new V2(500,300);
    SCG.scenes.cacheScene(new ChildrenGOScene({
        name:'children',
        viewport: defaultViewpot
    }));

    SCG.scenes.selectScene('children');
    
    SCG.main.start();
});