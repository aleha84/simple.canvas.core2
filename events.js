SCG.events = {
    register(){
        addListenerMulti(window, 'orientationchange resize', function(e){
			SCG.viewport.graphInit();
        });
        
        addListenerMulti(SCG.canvases.ui, 'mouseup touchend', function(e){
			absorbTouchEvent(e);
			SCG.controls.mouse.up(e);
        });
        
        addListenerMulti(SCG.canvases.ui, 'mousedown touchstart', function(e){
			absorbTouchEvent(e);
			SCG.controls.mouse.down(e);
        });
        
        addListenerMulti(SCG.canvases.ui, 'mousemove touchmove', function(e){
			absorbTouchEvent(e);
			SCG.controls.mouse.move(e);
        });
        
        addListenerMulti(SCG.canvases.ui, 'mouseout touchend touchcancel', function(e){
			absorbTouchEvent(e);
			SCG.controls.mouse.out(e);
        });
        
        SCG.canvases.ui.addEventListener('mousewheel', function(e){
			absorbTouchEvent(e);
			SCG.controls.mouse.scroll(e);
        }, false);

        SCG.canvases.ui.addEventListener('contextmenu', function(e){
			e.preventDefault();
			return false;
        }, false);

        document.addEventListener('keyup', function(e) {
            SCG.controls.keyboard.keyup(e);
        })

        if(SCG.globals.isMobile)
            {
                setTimeout( function(){ window.scrollTo(0, 1); }, 100 );
    
                addListenerMulti(document, 'fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function(e){
                    SCG.viewport.graphInit();
                });
            }
    }
}