var notifications = {
    positions: {
        tl: 'topLeft',
        tc: 'topCenter',
        tr: 'topRight',
        bl: 'bottomLeft',
        bc: 'bottomCenter',
        br: 'bottomRight',
    },
    types: {
        normal: 'normal',
        done: 'done',
        error: 'error',
        warning: 'warning',
    },
    queues: {
        topLeft: {holderEl: undefined, queue: [], state: 'idle'},
        topCenter: {holderEl: undefined, queue: [], state: 'idle'},
        topRight: {holderEl: undefined, queue: [], state: 'idle'},
        bottomLeft: {holderEl: undefined, queue: [], state: 'idle'},
        bottomCenter: {holderEl: undefined, queue: [], state: 'idle'},
        bottomRight: {holderEl: undefined, queue: [], state: 'idle'}
    },
    error(message, autoHide = undefined) {
        this.add({position: this.positions.tc, message, type: this.types.error, autoHide: autoHide})
    },
    done(message, autoHide = undefined){
        this.add({position: this.positions.tc, message, type: this.types.done, autoHide: autoHide})
    },
    warning(message, autoHide = undefined){
        this.add({position: this.positions.tc, message, type: this.types.warning, autoHide: autoHide})
    },
    add(event = { position, type, message, autoHide: false }) {
        event.timestamp = new Date();
        if(!event.position){
            event.position = this.positions.tl;
        }

        if(!event.type){
            event.type = this.types.normal
        }

        let notificationElement = htmlUtils.createElement('div', { 
            classNames: ['notification', event.type],
            events: {
                click: (event) => {
                    notificationElement.classList.add('beforeRemove');
                },
                transitionend: (event) => {
                    if(event.propertyName == 'opacity'){
                        notificationElement.remove();
                    }

                }
            }
         })

        htmlUtils.appendChild(notificationElement, [
            htmlUtils.createElement('div', { text: event.timestamp.toLocaleTimeString() }),
            htmlUtils.createElement('div', { text: event.message })
        ]) 

        let positionedQueue = this.queues[event.position];

        if(!positionedQueue.holderEl){
            positionedQueue.holderEl = htmlUtils.createElement('div', { 
                classNames: ['notificationsHolder', event.position]
             })

            htmlUtils.appendChild(document.body, positionedQueue.holderEl);
        }

        notificationElement.eventObject = event;

        htmlUtils.appendChild(positionedQueue.holderEl, notificationElement, { asFirst: event.position.indexOf('top') != -1 });
        
        if(event.autoHide){
            setTimeout(() => {
                notificationElement.classList.add('beforeRemove');
            }, event.autoHide)
        }

    },
    process() {

    }
}