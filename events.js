SCG.events = {
    register(){
        addListenerMulti(window, 'orientationchange resize', function(e){
			SCG.viewport.graphInit();
        });
        
        if(SCG.globals.isMobile)
            {
                setTimeout( function(){ window.scrollTo(0, 1); }, 100 );
    
                addListenerMulti(document, 'fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function(e){
                    SCG.viewport.graphInit();
                });
            }
    }
}