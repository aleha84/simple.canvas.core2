var htmlUtils = {
    createElement(tag, props) {
        if(!tag){
            console.error('No tag specified');
            throw 'No tag specified';
        }

        let el = document.createElement(tag);
        if(props){
            if(props.classNames){
                if(isArray(props.classNames)){
                    props.classNames.forEach(className => {
                        if(className)
                            el.classList.add(className);
                    });
                }
                else if(isString(props.classNames)){
                    el.classList.add(props.classNames);
                }
            }

            if(props.className){
                el.classList.add(props.className);
            }

            if(props.text){
                el.innerText = props.text;
            }

            if(props.value){
                el.value = props.value;
            }

            if(props.attributes){
                this.setAttributes(el, props.attributes)
            }

            if(props.events) {
                Object.keys(props.events).forEach((k) => {
                    el.addEventListener(k, props.events[k]);
                })
            }

            if(props.props){
                this.setProps(el, props.props)
            }
        }

        return el;
    },
    removeChilds(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    setProps(el, props){
        for(var key in props) {
            if(props[key])
                el.setAttribute(key, props[key]);
        }
    },
    setAttributes(el, attrs) {
        for(var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    },
    createDraggablePanel({parent, title, position, closable = false, expandable = true, contentItems = []}) {
        let editorBr = parent.querySelector('#editor').getBoundingClientRect();
        let panelBr = undefined;
        //console.log(editorBr)
        let panel = htmlUtils.createElement('div', { classNames: ['panel', 'utilities'] });
        let panelHeader = htmlUtils.createElement('div', { className: 'header' });

        let content = htmlUtils.createElement('div', { classNames: [ 'content'] });

        contentItems.forEach(c => {
            content.appendChild(c);
        })

        let dragPanel = htmlUtils.createElement('div', { text: title,classNames: [ 'drag'] });
        
        if(expandable){
            panelHeader.appendChild(htmlUtils.createElement('input', { value: 'Expand', className: 'toggle', attributes: { type: 'button' }, events: {
                click: function(){
                    panelBr = panel.getBoundingClientRect();
                    if (content.classList.contains("visible")) 
                        content.classList.remove("visible");
                    else 
                        content.classList.add('visible');
                }
            } }));
        }

        panelHeader.appendChild(dragPanel);
        if(closable){
            panelHeader.appendChild(htmlUtils.createElement('div', { text: 'x', classNames: [ 'close'], events: {
                click: () => {
                    panel.remove();
                }
            } }));
        }

        panel.appendChild(panelHeader);
        panel.appendChild(content)

        panel.style.left = position.x + 'px';
        panel.style.top = position.y + 'px';

        parent.appendChild(panel);

        panelBr = panel.getBoundingClientRect();

        let dragStartRelative = undefined;
        let dragStart = function(event) {
            panelBr = panel.getBoundingClientRect();
            dragStartRelative = {
                x: event.clientX - panelBr.left,
                y: event.clientY - panelBr.top
            }

            dragPanel.classList.add('active');

            parent.addEventListener('mousemove', move);
            parent.addEventListener('mouseup',mouseUp);
            document.addEventListener('mouseout', out);
        }

        let out = function(event){
            var from = event.relatedTarget || event.toElement;  
            if (!from || from.nodeName == "HTML"){
                mouseUp()
            }
        }

        let move = function(event) { 
            if(!dragStartRelative)
                return;

            event.preventDefault();
            let nextX = event.clientX - dragStartRelative.x;
            if(nextX < 0)
                nextX = 0;
            
            if(nextX + panelBr.width > editorBr.left + editorBr.width)
                nextX = editorBr.left + editorBr.width - panelBr.width;

            let nextY = event.clientY - dragStartRelative.y;
            if(nextY < 0)
                nextY = 0;

            if(nextY + panelBr.height > editorBr.top + editorBr.height)
                nextY = editorBr.top + editorBr.height - panelBr.height;

            panel.style.left = nextX + 'px';
            panel.style.top = nextY + 'px';
        }

        let mouseUp = function() {
            dragStartRelative = undefined;

            if (dragPanel.classList.contains("active")) {
                dragPanel.classList.remove("active");
            }

            parent.removeEventListener('mousemove', move);
            parent.removeEventListener('mouseup', mouseUp);
            document.removeEventListener('mouseout', out);
        }

        dragPanel.onmousedown  = dragStart;
    }
}