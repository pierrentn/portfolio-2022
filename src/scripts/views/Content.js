import gsap from "gsap";

export default class Content {
  constructor() {
    this.root = document.querySelector(".content");
    this.fixedNav = document.querySelector(".content .fixed");

    this.rootWidth = this.root.getBoundingClientRect().width;
    this.sizes = {
      height: window.innerWidth,
      width: window.innerWidth,
    };

    gsap.to(this.root, {
      x: -(this.rootWidth - this.sizes.width),
      scrollTrigger: {
        trigger: this.root,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        end: `+=${this.rootWidth}`,
      },
    });

    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    this.rootWidth = this.root.getBoundingClientRect().width;
    this.sizes = {
      height: window.innerWidth,
      width: window.innerWidth,
    };
  }
}
