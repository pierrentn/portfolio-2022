import gsap from "gsap";
import { splitLines } from "textsplitter";

export default class Content {
  constructor() {
    this.root = document.querySelector(".content");
    this.fixedNav = document.querySelector(".content .fixed");

    this.rootWidth = this.root.getBoundingClientRect().width;
    this.sizes = {
      height: window.innerWidth,
      width: window.innerWidth,
    };

    this.setHorizontalScroll();
    this.aboutAnim();
    this.projectsAnim()
    window.addEventListener("resize", () => this.onResize());
  }

  aboutAnim() {
    const aboutText = document.querySelector(".about");
    splitLines(aboutText, '<span class="split-lines-about">', "</span>");

    gsap.fromTo(
      ".split-lines-about",
      {
        alpha: 0,
        y: 15,
      },
      {
        alpha: 1,
        y: 0,
        scrollTrigger: {
          // containerAnimation: this.containerScroll,
          trigger: ".split-lines-about",
        },
        stagger: 0.05,
        delay: 0.1
      }
    );

    gsap.fromTo(
      ".contact a",
      {
        alpha: 0,
        y: 15,
      },
      {
        alpha: 1,
        y: 0,
        scrollTrigger: {
          // containerAnimation: this.containerScroll,
          trigger: ".contact a",
        },
        stagger: 0.05,
        delay: 0.1
      }
    );
  }

  projectsAnim() {
    const projects = document.querySelectorAll('.project')
    projects.forEach(el => {
      gsap.fromTo(el, {
        x: 100,
      }, {
        x: 0,
        scrollTrigger: {
          containerAnimation: this.containerScroll,
          trigger: el,
          start: '-30% 80%',
          end: 'center 20%',
          scrub: true,
        },
        ease: 'power3'
      })
    })
  }

  setHorizontalScroll() {
    this.containerScroll =  gsap.to(this.root, {
      x: -(this.rootWidth - this.sizes.width),
      ease: "none",
      scrollTrigger: {
        trigger: this.root,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
        end: `+=${this.rootWidth}`,
      },
    });
  }

  onResize() {
    this.rootWidth = this.root.getBoundingClientRect().width;
    this.sizes = {
      height: window.innerWidth,
      width: window.innerWidth,
    };
  }
}
