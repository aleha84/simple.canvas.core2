var components = {
    editorContext: undefined,
    array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    },

    createMidColor() {
        let type = 'rgb'
        let midColorFoo = (c1, c2) => {
            if(type == 'rgb') {
                let c1rgb = hexToRgb(c1, true);
                let c2rgb = hexToRgb(c2, true);
                return '#' + rgbToHex( c1rgb.map((el, i) => fast.r((c1rgb[i] + c2rgb[i])/2)) )
            }
            else if(type == 'hsv') {
                let c1hsv = colors.hexToHsv(c1);
                let c2hsv = colors.hexToHsv(c2);

                return hsvToHex({hsv: { h: (c1hsv.h+c2hsv.h)/2, s: (c1hsv.s+c2hsv.s)/2, v: (c1hsv.v+c2hsv.v)/2 },hsvAsObject: true, hsvAsInt: false})
            }

            notifications.error('Unknown color type: ' + type, 5000);
            
        }

        let container = htmlUtils.createElement('div');

        let typeEl = components.createSelect(type, ['rgb', 'hsv'], 'Type', (value) => {
            type = value;
            result.setValue(midColorFoo(color1.getValue(), color2.getValue()))
        });

        let color1 = this.createColorPicker('#FFFFFF', 'C1', () => {
            result.setValue(midColorFoo(color1.getValue(), color2.getValue()))
        })
        let color2 = this.createColorPicker('#FFFFFF', 'C2', (value) => {
            result.setValue(midColorFoo(color1.getValue(), color2.getValue()))
        })
        let result = this.createColorPicker('#FFFFFF', 'R', () => {})

        container.appendChild(typeEl);
        container.appendChild(color1);
        container.appendChild(color2);
        container.appendChild(result);

        container.appendChild(htmlUtils.createElement('input', { value: 'Reset',  attributes: { type: 'button' }, events: {
            click: function(){
                color1.setValue('#FFFFFF')
                color2.setValue('#FFFFFF')
                result.setValue('#FFFFFF')
            }}}));  

        return container;
    },

    createSceneColorPicker() {
        let container = htmlUtils.createElement('div');

        let color1 = this.createColorPicker('#FFFFFF', 'C1', () => {})

        container.appendChild(color1);
        container.setValue = (value) => {
            color1.setValue(value);

            let hexInput = color1.hexInput;
            hexInput.focus();
            hexInput.select();

            try {
                var successful = document.execCommand('copy');
            } catch (err) {
            alert('Failed to copy to clipboard');
            }

            hexInput.blur();
        }


        return container;
    },

    createCShift() {
        let type = 'rgb'
        let midColorFoo = (c1, c2, count) => {
            count = parseInt(count);
            if(isNaN(count))
                count = 3;

            htmlUtils.removeChilds(result);
            let steps = count+2;
            if(type == 'rgb') {
                let c1rgb = hexToRgb(c1, true);
                let c2rgb = hexToRgb(c2, true);
    
                let rValues = easing.fast({from: c1rgb[0], to: c2rgb[0], steps, type: 'linear', method:'base'}).map(value => fast.r(value));
                let gValues = easing.fast({from: c1rgb[1], to: c2rgb[1], steps, type: 'linear', method:'base'}).map(value => fast.r(value));
                let bValues = easing.fast({from: c1rgb[2], to: c2rgb[2], steps, type: 'linear', method:'base'}).map(value => fast.r(value));
                for(let i = 0; i < steps; i++){
                    result.appendChild(this.createColorPicker('#' + rgbToHex([rValues[i], gValues[i], bValues[i]]), 'C'+i, () => {}, { readOnly: true }))
                }
            }
            else if(type == 'hsv') {
                let c1hsv = colors.hexToHsv(c1);
                let c2hsv = colors.hexToHsv(c2);

                let hValues = easing.fast({from: c1hsv.h, to: c2hsv.h, steps, type: 'linear'});
                let sValues = easing.fast({from: c1hsv.s, to: c2hsv.s, steps, type: 'linear'});
                let vValues = easing.fast({from: c1hsv.v, to: c2hsv.v, steps, type: 'linear'});

                for(let i = 0; i < steps; i++){
                    result.appendChild(this.createColorPicker(
                        hsvToHex({hsv: { h: hValues[i], s: sValues[i], v: vValues[i] },hsvAsObject: true, hsvAsInt: false}), 
                        'C'+i, () => {}, { readOnly: true }))
                }
                //return hsvToHex({hsv: { h: (c1hsv.h+c2hsv.h)/2, s: (c1hsv.s+c2hsv.s)/2, v: (c1hsv.v+c2hsv.v)/2 },hsvAsObject: true, hsvAsInt: false})
            }
            else {
                notifications.error('Unknown color type: ' + type, 5000);
            }
            
            
            //return '#' + rgbToHex( c1rgb.map((el, i) => fast.r((c1rgb[i] + c2rgb[i])/2)) )
        }

        let container = htmlUtils.createElement('div');

        let result = htmlUtils.createElement('div');

        let typeEl = components.createSelect(type, ['rgb', 'hsv'], 'Type', (value) => {
            type = value;
            midColorFoo(color1.getValue(), color2.getValue(), count.value);
        });

        let color1 = this.createColorPicker('#FFFFFF', 'C1', () => {
            midColorFoo(color1.getValue(), color2.getValue(), count.value);
        })
        let color2 = this.createColorPicker('#FFFFFF', 'C2', (value) => {
            midColorFoo(color1.getValue(), color2.getValue(), count.value);
        })

        let count = htmlUtils.createElement('input', { value: '1', attributes: { type: 'number' },
        events: {
            change: (event) => {
                midColorFoo(color1.getValue(), color2.getValue(), count.value);
            }
        } });

        container.appendChild(typeEl);
        container.appendChild(color1);
        container.appendChild(color2);
        container.appendChild(count);
        container.appendChild(result);

        return container;
    },

    createRotationControl(angleChangeCallback, rotationOrigin, applyCallback) {
        let container = htmlUtils.createElement('div');

        let currentAngle = 0;
        let angleRange = {current: currentAngle, max: 180, min: -180, step: 1, round: 0};

        let angleValueWrapper = htmlUtils.createElement('div', { classNames: ['inputBox', 'rowFlex'] });
        angleValueWrapper.appendChild(htmlUtils.createElement('div', { className: 'title', text: 'Angle' }))
        let angleValue = htmlUtils.createElement('input', { classNames: ['marginLeft5', 'paddingLeft2'], attributes: { type: 'number' }, value: currentAngle.toString(),events: {
            change: (event) => {
                let value = angleValue.value;
                let parsed = parseInt(value);
                if(isNaN(parsed))
                    parsed = 0;
                    
                currentAngle = parsed;
                angleChangeCallback(parsed);
                range.setValue(parsed);
            }
        } });
        angleValue.style.width = '30px';
        angleValueWrapper.appendChild(angleValue);
        
        let rOrigin = components.createV2(rotationOrigin, 'Origin', (value) => {
            angleChangeCallback(undefined, rotationOrigin);
        }, { rowClassName: 'rowFlex' })

        let range = components.createRange(angleRange, 'Angle', () => {}, (value) => {
            //console.log(angleRange.current);
            angleValue.value = value.toString();
            angleChangeCallback(angleRange.current);
        }, { rowClassName: 'rowFlex' });

        let applyBtn = htmlUtils.createElement('input', {
            attributes: { 
                type: 'button', 
                value: 'Apply' 
            },
            events: { 
                click: function(e) { 
                    applyCallback();
                } }
        });

        container.appendChild(angleValueWrapper);
        container.appendChild(range);
        container.appendChild(rOrigin);
        container.appendChild(applyBtn);

        return container;
    }
}