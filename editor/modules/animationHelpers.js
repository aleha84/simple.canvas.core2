components.animationHelpers = {
    updateNextFrame: () => {
        let frames = components.editor.image.main;
        let currentFrameIndex = components.editor.image.general.currentFrameIndex;

        let f = currentFrameIndex+1;
        if(currentFrameIndex == frames.length-1){
            if(!confirm('Clone (override) selected group to first frame?')) {
                return;
            }

            f = 0;
        }
            

        let { groupId, layerId } = components.editor.editor.selected;
        if(groupId == undefined) {
            notifications.error('No group selected', 2000);
            return;
        }

        let nextFrameLayer = frames[f].layers.find(l => l.id == layerId);
        if(!nextFrameLayer){
            notifications.error('No layer with id: ' + layerId + ' found in frame index: ' + f , 2000);
            return;
        }

        let sameIdGroup = nextFrameLayer.groups.find(g => g.id == groupId);
        let selectedGroup = frames[currentFrameIndex].layers.find(l => l.id == layerId).groups.find(g => g.id == groupId);
        //groups.filter(g => g.selected)[0];
        // let sameIdGroup = undefined;
        
        if(!sameIdGroup){
            //alert('Not found same Id group');
            let g = assignDeep(
                {},
                modelUtils.createDefaultGroup(selectedGroup.id, groups.length), 
                modelUtils.groupMapper(selectedGroup, true));

            let sameLayer = frames[f].layers.find(l => l.id == components.editor.editor.selected.layerId);
            if(sameLayer){
                if(sameLayer.groups == undefined){
                    sameLayer.groups = [];
                }
                sameLayer.groups.push(g);
                alert('Added new group to next frame');
                return;
            }
            else {
                alert('Same layer in next frame not found!')
                return;
            }
        }

        sameIdGroup.points = selectedGroup.points.map(p => ({
            ...p,
            point: {...p.point}
        }));

        //alert('Done');
        notifications.done('Done', 2000);
    }
}