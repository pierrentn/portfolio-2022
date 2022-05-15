import gsap from "gsap";

export default class Content {
  constructor() {
    this.root = document.querySelector(".content");
    this.rootWidth = this.root.getBoundingClientRect().width;
    gsap.to(this.root, {
      x: -(this.rootWidth - window.innerWidth),
      scrollTrigger: {
        trigger: this.root,
        scrub: 1,
        pin: true,
        end: `+=${this.rootWidth}`,
      },
    });
  }
}
