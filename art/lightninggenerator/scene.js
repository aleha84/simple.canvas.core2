class LightningGeneratorScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let that = this;

        let animationSize = new V2(100, 100);
        
        let downloadSizeMultiplier = 1;
        let backgroundColor = '#000000';
        let transparentColor = '#00FF00';

        let animationColors = {
            main: '#8BE4EC',
            darker: '#6dafbf',
            brighter: '#F0FAFC'
        }

        this.createRow = function() {
            return htmlUtils.createElement('div', { className: 'row' })
        }

        this.setFrames = function() {
            let frames = animationHelpers.createLightningFrames({ 
                framesCount: 100, itemsCount: 1, 
                itemFrameslength: 50, 
                size: animationSize,
                colors: animationColors
            }).map(frame => createCanvas(animationSize, (ctx, size, hlp) => {
                if(!transparentCheckBox.chk.checked) {
                    hlp.setFillColor(backgroundColorPicker.getValue()).rect(0,0,size.x, size.y);
                }
                
                ctx.drawImage(frame, 0, 0)
            }));

            that.lightning.setFrames(frames);
        }

        let controlsHolder = htmlUtils.createElement('div', { className:'controls', attributes: {style: 'width:400px; height: 100%; z-index: 2000; background-color:lightgray' } })

        let generateParamsRow = this.createRow();
        let animationSizeV2 = components.createV2(animationSize, 'Animation size')
        htmlUtils.appendChild(generateParamsRow, animationSizeV2);

        let mainColorPicker = components.createColorPicker(animationColors.main, 'Main color', (value) => { animationColors.main = value })
        htmlUtils.appendChild(generateParamsRow, mainColorPicker);
        let darkerColorPicker = components.createColorPicker(animationColors.darker, 'Darker color', (value) => { animationColors.darker = value })
        htmlUtils.appendChild(generateParamsRow, darkerColorPicker);
        let brighterColorPicker = components.createColorPicker(animationColors.brighter, 'Brighter color', (value) => { animationColors.brighter = value })
        htmlUtils.appendChild(generateParamsRow, brighterColorPicker);

        htmlUtils.appendChild(controlsHolder, generateParamsRow);

        let transparentCheckBox = components.createCheckBox(true, 'Transparent background', (checked) => {
            backgroundColorPicker.disable(checked)
            if(!checked){
                backgroundColor = '#000000';
                backgroundColorPicker.setValue(backgroundColor)
            }
            else {
                backgroundColor = transparentColor
            }
        })

        let backgroundColorPicker = components.createColorPicker('#000000', 'Background color', 
            (value) => { 
                backgroundColor = value;
            })

        backgroundColorPicker.disable(true)

        htmlUtils.appendChild(generateParamsRow, transparentCheckBox);
        htmlUtils.appendChild(generateParamsRow, backgroundColorPicker);


        let btn = components.createButton('Generate', this.setFrames)
        let r1 = this.createRow();
        htmlUtils.appendChild(r1, btn);
        htmlUtils.appendChild(controlsHolder, r1);

        htmlUtils.appendChild(controlsHolder, htmlUtils.createElement('hr'));


        //--------------------------------------//
        let rDownloadGif = this.createRow();

        let downloadMultiplierInput = components.createInput(downloadSizeMultiplier, 'Size multiplier: ', 
            (value) => { 
                downloadSizeMultiplier = parseInt(value); 
            },
            (value) => {
                return /^\+?(0|[1-9]\d*)$/.test(value);
            } 
        )

        let downloadGif = components.createButton('Download GIF', () => {
            if(!that.lightning.frames){
                alert('Generate frames first!')
                return;
            }

            downloadGif.disabled = true;
            let mSize = animationSize.mul(downloadSizeMultiplier)

            let params = {
                workers: 2,
                quality: 1,
                workerScript: '../../utilities/libs/gif.worker.js'
            }

            if(transparentCheckBox.chk.checked) {
                params.transparent = transparentColor;
                params.background = transparentColor;
            }

            var gif = new GIF(params);
            
            for(let f = 0; f < that.lightning.frames.length; f++){
                gif.addFrame(
                createCanvas(animationSize.mul(downloadSizeMultiplier), (ctx, size, hlp) => { 
                    ctx.drawImage(that.lightning.frames[f], 0, 0, size.x, size.y); 
                })
                , {delay: 15});
            }

            gif.on('finished', function(blob) {
                window.open(URL.createObjectURL(blob));
                downloadGif.disabled = false;
            });

            gif.render();
        })
        
        htmlUtils.appendChild(rDownloadGif, downloadMultiplierInput);
        htmlUtils.appendChild(rDownloadGif, downloadGif);
        htmlUtils.appendChild(controlsHolder, rDownloadGif);

        document.body.append(controlsHolder)

        this.lightning = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            setFrames(frames) {
                this.unregTimer(this.timer);
                this.frames = frames;
                this.registerFramesDefaultTimer({});
            },
        }), 1)

    }
}