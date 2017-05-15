function Spinner (s) {
  this.dec = .15;
  this.rot = 0;
  this.vel = 0;
  this.spi = s;
  this.pos = {x: window.innerWidth*0.2, y: window.innerHeight*0.2};
  this.spi.addEventListener("touchstart", this.spin.bind(this));
  this.spi.addEventListener("mousedown", this.spin.bind(this));
};
Spinner.prototype.update = function () {
  this.vel += this.rot;
  if(this.vel > this.dec) { this.vel -= this.dec } else { this.vel = 0 };
  this.spi.style.transform = "rotate(somedeg)".replace("some",this.rot);
  this.spi.style.position = "absolute";
  this.spi.style.left = this.pos.x+"px";
  this.spi.style.top = this.pos.y+"px";
};

Spinner.prototype.spin = function () {
  this.vel += this.dec*10;
};
