var Entity = (function () {
    function Entity(_element) {
        this.x = 0;
        this.y = 0;
        this.velX = 0;
        this.velY = 0;
        this.velRot = 0;
        this.rotation = 0;
        this.element = null;
        this.spin = function (e) {
            this.velRot += 3;
        };
        this.update = function () {
            this.x += this.velX;
            this.y += this.velY;
            this.rotation += this.velRot;
            this.velRot -= 0.05;
            this.element.style.position = "absolute";
            this.element.style.left = this.x + "px";
            this.element.style.top = this.y + "px";
            this.element.style.transform = "rotate(" + this.rotation + "deg)";
        };
        this.element = _element;
        this.element.addEventListener("click", this.spin.bind(this), true);
    }
    ;
    return Entity;
}());
;
var entities = [];
var Draw = function () {
    for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
        var i = entities_1[_i];
        i.update();
    }
    ;
    setTimeout(Draw, 1000 / 60);
};
window.onload = function () {
    var htmlspinners = document.getElementsByClassName("spinner");
    for (var i = htmlspinners.length - 1; i >= 0; i--) {
        var a = new Entity(htmlspinners[i]);
        entities.push(a);
    }
    ;
    setTimeout(Draw, 1000 / 60);
};
