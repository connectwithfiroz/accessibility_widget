import { FDraggable } from './FDraggable.js';
let renderDraggableInterval = setInterval(() => {
    if(isAccessabilityRendered){
        clearInterval(renderDraggableInterval);
        const options = {
            'elementId' : 'main_w_container', // myDraggleElement - DRAGGLE ELEMENT ID
            'elementHeaderId' : 'widget_header' //THERE MUST HEADER ELEMENT ALSO
        }
        let myDraggable = new FDraggable(options);
    }
}, 2000);