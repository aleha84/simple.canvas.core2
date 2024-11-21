var modelUtils = {
    layerMapper(l) {
        return {
            order: l.order,
            selected: l.selected,
            id: l.id,
            name: l.name,
            visible: l.visible,
            layerImage: l.layerImage
        }
    },
    groupMapper(g, deep = false) {
        if(g.groupType == 'gradient') {
            return {
                id: g.id,
                order: g.order,
                selected: g.selected,
                visible: g.visible,
                groupType: g.groupType,
                center: g.center,
                radius: g.radius,
                origin: g.origin,
                color: g.color,
                easingType: g.easingType,
                easingMethod: g.easingMethod,
                angle: g.angle,
                aValueMul: g.aValueMul,
                useValueType: g.useValueType
            }
        }

        let group = {
            order: g.order,
            selected: g.selected,
            type: g.type,
            strokeColor: g.strokeColor,
            strokeColorOpacity: g.strokeColorOpacity,
            fillColor: g.fillColor,
            fillColorOpacity: g.fillColorOpacity,
            closePath: g.closePath,
            fill: g.fill,
            fillPattern: g.fillPattern,
            patternType: g.patternType,
            numOfSegments: g.numOfSegments,
            visible: g.visible,
            clear: g.clear,
            replace: g.replace,
            id: g.id,
            //points: deep ? 
        };

        if(deep){
            group.points = g.points.map((p) => {
                return {
                    ...modelUtils.pointMapper(p)
                }
            });
        }

        return group
    },
    pointMapper(p) {
        return {
            point: new V2(p.point),
            order: p.order,
            selected: p.selected,
            id: p.id
        }
    },
    createDefaultLayer(id, order) {
        return {
            order: order,
            currentGroupId: 0,
            selected: false,
            id: id,
            name: '',
            visible: true,
            groupsEl: undefined,
            groupEl: undefined,
            groups: [],
            layerImage: undefined,
            removeImage(){
                this.layerImage = undefined;
            }
        }
    },
    createDefaultGroup(id, order, groupType = undefined){
        if(groupType == 'gradient')
            return this.createDefaultGradient(id, order);

        return {
            currentPointId: 0,
            selected: false,
            order: order,
            id: id,
            visible: true,
            clear: false,
            replace: false,
            strokeColor: '#FF0000',
            strokeColorOpacity: 1,
            fillColor: '#FF0000',
            fillColorOpacity: 1,
            fill: false,
            fillPattern: false,
            patternType: 'type1',
            numOfSegments: 16,
            closePath: false,
            type: 'dots',
            pointsEl: undefined,
            pointEl: undefined,
            showPoints: false,
            points: []
        }
    },
    createDefaultGradient(id, order) {
        return {
            id: id,
            order: order,
            selected: false,
            visible: true,
            groupType: 'gradient',
            center: new V2(),
            radius: new V2(),
            origin: new V2(),
            color: '#FFFFFF',
            easingType: 'quad',
            easingMethod: 'out',
            angle: 0,
            aValueMul: 1,
            useValueType: 'max'
        }
    },
    createDefaultPalette(paletteIndex) {
        return {
            name: "Palette" + (paletteIndex != undefined ? paletteIndex : getRandomInt(1000, 2000)),
            items: []
        }
    },
    createDefaultPaletteItem(initialColor = '#FFFFFF') {
        return {
            color: initialColor
        }
    },
    paletteMapper(palette, deep = true) {
        if(!palette)
            return modelUtils.createDefaultPalette();

        return {
            name: palette.name,
            items: deep ? palette.items.map(modelUtils.paletteItemMapper) : []
        }
    },
    paletteItemMapper(paletteItem) {
        if(!paletteItem)
            modelUtils.createDefaultPaletteItem();

        return {
            color: paletteItem.color
        };
    }
}