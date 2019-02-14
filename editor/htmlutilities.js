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
                this.setAttributes(el, props.props)
            }
        }

        return el;
    },
    removeChilds(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    setAttributes(el, attrs) {
        for(var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    },

    setProps(el, props){
        for(var key in props) {
            el.setAttribute(key, '');
        }
    }
}