export class FDraggable {
    constructor(params) {
        this.elementId = params.elementId;
        this.elementHeaderId = params.elementHeaderId || this.elementId + "Header   ";
        this.element = document.getElementById(this.elementId);
        this.elementHeader = document.getElementById(this.elementHeaderId);
        if (this.element) {
            this.element.parentNode.style.position = 'relative';
            this.element.style.transition = 'unset';
            this.element.style.position = 'fixed';
            this.element.style.zIndex = '9';
        }else{
            alert('Invalid element ID passed');
        }

        if (this.elementHeader) {
            this.elementHeader.style.zIndex = '10';
            this.elementHeader.style.cursor = 'move';
            this.elementHeader.onmousedown = this.dragMouseDown.bind(this);
        }else{
            alert('Invalid element ID Header passed. If elementName is - myElement then must be a header inside with name - myElementHeader');
        }
        this.pos1 = 0;
        this.pos2 = 0;
        this.pos3 = 0;
        this.pos4 = 0;
    }

    dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.onmouseup = this.closeDragElement.bind(this);
        document.onmousemove = this.elementDrag.bind(this);
    }

    elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;

        let newTop = this.element.offsetTop - this.pos2;
        let newLeft = this.element.offsetLeft - this.pos1;

        let viewportHeight = window.innerHeight;
        let viewportWidth = window.innerWidth;
        let elementHeight = this.element.offsetHeight;
        let elementWidth = this.element.offsetWidth;

        if (newTop < 0) {
            newTop = 0;
        } else if (newTop + elementHeight > viewportHeight) {
            newTop = viewportHeight - elementHeight;
        }

        if (newLeft < 0) {
            newLeft = 0;
        } else if (newLeft + elementWidth > viewportWidth) {
            newLeft = viewportWidth - elementWidth;
        }

        this.element.style.top = newTop + "px";
        this.element.style.left = newLeft + "px";
    }

    closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
    //IERldmVsb3BlZCBieSBGaXJveiBBbnNhcmk=
}
