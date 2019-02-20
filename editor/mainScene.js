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

        // let _fillPoints = []

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

                                if(layer.fill){
                                    ctx.fillStyle = layer.fillColor;
                                    let uniquePoints = distinct(filledPixels, (p) => p.x+'_'+p.y);
                                    this.fill(pp, uniquePoints)//, _fillPoints);
                                }
                                
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

        // let delay = 0;
        // for(let p of _fillPoints){
        //     let go = mg.addChild(new GO({
        //         position: new V2(mg.tl.x + mg.itemSize.x/2 + mg.itemSize.x*p.x, mg.tl.y + mg.itemSize.y/2 + mg.itemSize.y*p.y),
        //         size: mg.itemSize,
        //         img: createCanvas(new V2(1,1), (ctx, size) => {
        //             ctx.fillStyle = 'blue'; ctx.fillRect(0,0, size.x, size.y);
        //         }),
        //         isVisible: false
        //     }));

            
        //     go.addEffect(new FadeInEffect({startDelay: delay, effectTime: 150,updateDelay: 40,  beforeStartCallback: function() {
        //         this.parent.isVisible = true;
        //     }}))
        //     delay+=50
        // }

        mg.needRecalcRenderProperties = true;
    }

    fill(pp, filledPoints) {//, _fillPoints) {
        let checkBoundaries = function(p) {
            let checkedPoints = [];
            //check left
            let boundaryFound = false;
            for(let i = p.x-1; i >= extrX.min;i--){
                if(matrix[p.y][i] != undefined && matrix[p.y][i].filled){
                    boundaryFound = true;
                    break;
                }

                checkedPoints.push({x: i, y: p.y});
            }

            if(!boundaryFound)
                return false;

            // check right
            boundaryFound = false;
            for(let i = p.x+1; i <= extrX.max;i++){
                if(matrix[p.y][i] != undefined && matrix[p.y][i].filled){
                    boundaryFound = true;
                    break;
                }

                checkedPoints.push({x: i, y: p.y});
            }

            if(!boundaryFound)
                return false;

            // check above
            boundaryFound = false;
            for(let i = p.y-1; i >= extrY.min;i--){
                if(matrix[i][p.x] != undefined && matrix[i][p.x].filled){
                    boundaryFound = true;
                    break;
                }

                checkedPoints.push({x: p.x, y: i});
            }

            if(!boundaryFound)
                return false;

             // check below
             boundaryFound = false;
             for(let i = p.y+1; i <= extrY.max;i++){
                 if(matrix[i][p.x] != undefined && matrix[i][p.x].filled){
                     boundaryFound = true;
                     break;
                 }
 
                 checkedPoints.push({x: p.x, y: i});
             }

             if(!boundaryFound)
                return false;

            return checkedPoints;
        }

        // 1. create matrix
        let matrix = [];
        let extrX = {min: filledPoints[0].x, max: filledPoints[0].x};
        let extrY = {min: filledPoints[0].y, max: filledPoints[0].y};
        for(let fp of filledPoints){
            if(matrix[fp.y] == undefined){
                matrix[fp.y] = [];
            }

            matrix[fp.y][fp.x] = { filled: true };
            // 2. find extremums
            if(fp.x < extrX.min) extrX.min = fp.x;
            if(fp.x > extrX.max) extrX.max = fp.x;
            if(fp.y < extrY.min) extrY.min = fp.y;
            if(fp.y > extrY.max) extrY.max = fp.y;
        }

        if(extrX.max - extrX.min < 2 || extrY.max - extrY.min < 2) 
            return;

        // 3. Check all points
        for(let r = extrY.min+1; r  < extrY.max; r++){
            for(let c = extrX.min+1;c < extrX.max; c++){
                let p = {x: c, y: r};
                // 3.0 Check fill
                if(matrix[p.y][p.x] != undefined && matrix[p.y][p.x].filled)
                    continue;

                // 3.1 Check boundaries
                let checkedPoints = checkBoundaries(p);

                // 3.2 no boundaries
                if(isBoolean(checkedPoints) && checkedPoints === false)
                    continue;

                // 3.3 Fill point and checked points
                matrix[p.y][p.x] = { filled: true };
                pp.setPixel(p.x, p.y);
                //_fillPoints.push({x: p.x, y: p.y})

                for(let cp of checkedPoints){
                    matrix[cp.y][cp.x] = { filled: true };
                    pp.setPixel(cp.x, cp.y);
                    //_fillPoints.push({x: cp.x, y: cp.y})
                }
                
            }
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

