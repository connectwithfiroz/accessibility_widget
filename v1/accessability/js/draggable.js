import { FDraggable } from './FDraggable.js';
document.addEventListener('DOMContentLoaded', () => {

    const options = {
        'elementId' : 'main_w_container', // myDraggleElement - DRAGGLE ELEMENT ID
        'elementHeaderId' : 'widget_header'
    }
    let myDraggable = new FDraggable(options);
});