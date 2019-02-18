class EditorScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options)
    }

    start(){
        // this.addGo(new GO({
        //     position: this.sceneCenter,
        //     size: new V2(200, 200),
        //     img: createCanvas(new V2(20,20), (ctx, size)=> {
        //         let pp = new PP({ context: ctx });
        //         ctx.fillStyle = '#00FF00';
        //         pp.line(0, size.y/2, size.x, 0)
        //     })
        // }));

        this.mainGo = this.addGo(new EditorGO({
            position: this.sceneCenter
        }),0, true);

        this.editor = new Editor({
            parentElementSelector: '.controlsWrapper',
            renderCallback: this.renderModel.bind(this)
        })

        
    }

    renderModel(model){
        console.log(model);
        let mg = this.mainGo;
        let {general, main} = model;
        mg.model = model;

        mg.img = createCanvas(general.size, (ctx, size) => {
            let pp = new PerfectPixel({context: ctx});
            for(let layer of main.layers.sort((a,b) => { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); })) {
                ctx.fillStyle = layer.strokeColor;
                if(layer.type == 'dots'){
                    for(let po of layer.points){
                        pp.setPixel(po.point.x, po.point.y);
                    }
                }
                else if(layer.type == 'lines'){
                    if(layer.points.length == 1){
                        pp.setPixel(layer.points[0].point.x, layer.points[0].point.y);
                    }
                    else{
                        let filledPixels = [];
                        for(let i = 0; i < layer.points.length;i++){
                            let p = layer.points;
                            if(i < p.length-1)
                                filledPixels= [...filledPixels, ...pp.lineV2(p[i].point, p[i+1].point)];
                            else if(layer.closePath){
                                filledPixels = [...filledPixels, ...pp.lineV2(p[i].point, p[0].point)];

                                let uniquePoints = distinct(filledPixels);
                                this.fill(ctx, pp, uniquePoints, layer, size);
                            }
                                
                        }


                    }
                    
                }
            }
        });



        mg.originalSize = general.originalSize;
        mg.size = general.size.mul(general.zoom);
        mg.showGrid = general.showGrid;
        mg.invalidate();

        mg.needRecalcRenderProperties = true;
    }

    fill(ctx, pp, filledPoints, layer, size) {
        

        let allLeftPoints = [];
        for(let i = 0; i < filledPoints.length; i++){
            let fp = filledPoints[i];
            if(allLeftPoints[fp.y] == undefined || allLeftPoints[fp.y].x > fp.x){
                allLeftPoints[fp.y] = fp;
            }
        }

        ctx.fillStyle = 'green';

        for(let i = 0; i < allLeftPoints.length; i++){
            let lp = allLeftPoints[i];
            if(lp == undefined)
                continue;

            fillNextPoint({ x: lp.x+1, y: lp.y });
        }

        
        let fillNextPoint = function(p){
            if(filledPoints.filter(fp => fp.x == p.x && fp.y == p.y).length)
                return;
            
            if(!checkBoundaries(p))
                return;

            
        }

        let checkBoundaries = function(p){
            let hasBoundary = false;
            if(p.x < size.x){
                for(let i = p.x; i < size.x;i++){
                    if(filledPoints.filter(fp => fp.x == i && fp.y == p.y).length){
                        hasBoundary = true;
                        break;
                    }
                }
            

                if(!hasBoundary)
                    return false;
            }

            if(p.x > 0){
                hasBoundary = false;
                for(let i = p.x; i >= 0;i--){
                    if(filledPoints.filter(fp => fp.x == i && fp.y == p.y).length){
                        hasBoundary = true;
                        break;
                    }
                }

                if(!hasBoundary)
                    return false;
            }

            if(p.y < size.y){
                hasBoundary = false;
                for(let i = p.y; i < size.y;i++){
                    if(filledPoints.filter(fp => fp.x == p.x && fp.y == i).length){
                        hasBoundary = true;
                        break;
                    }
                }

                if(!hasBoundary)
                    return false;
            }


            if(p.y > 0){
                hasBoundary = false;
                for(let i = p.y; i >= 0;i--){
                    if(filledPoints.filter(fp => fp.x == p.x && fp.y == i).length){
                        hasBoundary = true;
                        break;
                    }
                }
            
            }
            return hasBoundary;
        }
    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }
}

SCG.globals.version = 0.1;
SCG.globals.parentId = 'editor'

let defaultViewpot = new V2(500,300);
SCG.scenes.cacheScene(new EditorScene({
    name:'editor',
    viewport: defaultViewpot
}));

SCG.scenes.selectScene('editor');
document.addEventListener("DOMContentLoaded", function() {
    SCG.main.start();
})

