components.createDraggablePanel = function({parent, title, position, closable = false, panelClassNames = [], expandable = true, contentWidth = undefined, contentItems = [],
    onClose = () => {}, onCreate = () => {}, onMove = () => {}
}) {
    let editorBr = parent.querySelector('#editor').getBoundingClientRect();
    let panelBr = undefined;
    //console.log(editorBr)
    let panel = htmlUtils.createElement('div', { classNames: ['panel', ...panelClassNames] });
    let panelHeader = htmlUtils.createElement('div', { className: 'header' });

    let content = htmlUtils.createElement('div', { classNames: [ 'content'] });

    if(contentWidth){
        content.style.minWidth = contentWidth + 'px';
    }

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
    else {
        content.classList.add('visible')
    }

    panelHeader.appendChild(dragPanel);
    if(closable){
        panelHeader.appendChild(htmlUtils.createElement('div', { text: 'x', classNames: [ 'close'], events: {
            click: () => {
                events.remove();
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
    let events = {
        remove() {
            panel.remove();
            onClose();
        },
        dragStart(event) {
            panelBr = panel.getBoundingClientRect();
            dragStartRelative = {
                x: event.clientX - panelBr.left,
                y: event.clientY - panelBr.top
            }

            dragPanel.classList.add('active');

            parent.addEventListener('pointermove', events.move);
            parent.addEventListener('pointerup',events.mouseUp);
            document.addEventListener('pointerout', events.out);
        },
        out(event){
            var from = event.relatedTarget || event.toElement;  
            if (!from || from.nodeName == "HTML"){
                events.mouseUp()
            }
        },
        move(event) { 
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

            onMove(new V2(nextX, nextY))
        },
        mouseUp() {
            dragStartRelative = undefined;

            if (dragPanel.classList.contains("active")) {
                dragPanel.classList.remove("active");
            }

            parent.removeEventListener('pointermove', events.move);
            parent.removeEventListener('pointerup', events.mouseUp);
            document.removeEventListener('pointerout', events.out);
        }
    }

    dragPanel.onmousedown  = events.dragStart;

    onCreate();

    let setPosition = function(position) {
        panel.style.left = position.x + 'px';
        panel.style.top = position.y + 'px';
    }

    let getSize = function() {
        let br = panel.getBoundingClientRect();
        return new V2(br.width, br.height);
    }

    return {
        panel,
        panelHeader,
        content,
        contentItems,
        events,
        methods: {
            setPosition,
            getSize,
        },
        remove() {
            events.remove();
        }
    }
}


components.draggable = {
    init(context) {
        this.context = context;
    },
    createColorPicker: function(){

        if(this.context.editor.panels.colorPicker){
            this.context.editor.panels.colorPicker.remove();
        }
        else {
            this.context.editor.mode.toggleColorPicker();
            this.context.updateEditor();

            let cp = components.createDraggablePanel({
                title: 'C picker', 
                parent: document.body, 
                position: this.context.editor.panels.lastPositions.colorPicker || new V2(40,60), 
                closable: true,
                expandable: false,
                contentWidth: 150,
                onClose: () => { 
                    this.context.editor.panels.colorPicker = undefined;
                    this.context.editor.mode.toggleColorPicker();
                    this.context.updateEditor();
                 },
                 onMove: (nextPosition) => {
                    this.context.editor.panels.lastPositions.colorPicker = nextPosition;
                 },
                contentItems: [
                    components.createSceneColorPicker()
                ]
            });

            this.context.editor.panels.colorPicker = cp;

            cp.setValue = (value) => {
                cp.contentItems[0].setValue(value);
            }
        }
    }
}