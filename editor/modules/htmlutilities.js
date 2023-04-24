var htmlUtils = {
    createElement(tag, props = { 
            classNames: undefined, className: undefined, text: undefined, value: undefined, 
            attributes: undefined, events: undefined, props: undefined, styles: undefined,
            children: undefined,
        } ) {
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

            if(props.styles) {
                this.setStyles(el, props.styles);
            }

            if(props.children) {
                let children = [];
                if(!isArray(props.children)) {
                    children.push(props.children)
                }
                else {
                    children = [...props.children];
                }

                children.forEach(child => this.appendChild(el, child))
            }
        }

        return el;
    },
    setStyles(el, styles) {
        Object.assign(el.style, styles);
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
            else 
                el.removeAttribute(key);
        }
    },
    setAttributes(el, attrs) {
        for(var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    },
    appendChild(parent, child, params = {asFirst: false}) {
        let children = child;
        if(!isArray(children)){
            children = [children];
        }

        children.forEach(element => {
            if(params.asFirst){
                parent.insertBefore(element,parent.firstChild)
            }
            else {
                parent.appendChild(element);
            }
            
        });
    }

}