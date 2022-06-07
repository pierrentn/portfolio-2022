import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { splitLines } from "textsplitter";

export default class Content {
  constructor(scrollContainer) {
    this.root = document.querySelector(".content");

    this.setHorizontalScroll();
    this.aboutAnim();
    this.projectsAnim();
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
          trigger: ".split-lines-about",
        },
        stagger: 0.05,
        delay: 0.1,
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
          trigger: ".contact a",
        },
        stagger: 0.05,
        delay: 0.1,
      }
    );

    ScrollTrigger.matchMedia({
      "(min-width: 1024px)": () => {
        gsap.fromTo(
          ".contact",
          {
            x: () => -window.innerWidth,
          },
          {
            x: () =>
              this.root.getBoundingClientRect().width - window.innerWidth,
            ease: "none",
            scrollTrigger: {
              trigger: this.root,
              containerAnimation: this.containerScroll,
              invalidateOnRefresh: true,
              scrub: true,
              end: () => `+=${this.root.getBoundingClientRect().width}`,
            },
          }
        );
      },
    });
  }

  projectsAnim() {
    const projects = document.querySelectorAll(".project");
    projects.forEach((el) => {
      gsap.fromTo(
        el,
        {
          x: () => (!(window.innerWidth <= 1024) ? 100 : 0),
          y: () => (window.innerWidth <= 1024 ? 100 : 0),
        },
        {
          x: 0,
          y: 0,
          scrollTrigger: {
            containerAnimation: this.containerScroll,
            trigger: el,
            start: "-50% 80%",
            end: "center 20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
          ease: "power3",
        }
      );
    });
  }

  setHorizontalScroll() {
    ScrollTrigger.matchMedia({
      "(min-width: 1024px)": () => {
        this.containerScroll = gsap.to(this.root, {
          x: () =>
            -(this.root.getBoundingClientRect().width - window.innerWidth),
          ease: "none",
        });

        const scrollTriggerInstance = ScrollTrigger.create({
          id: "contentScroller",
          animation: this.containerScroll,
          trigger: this.root,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          end: () => `+=${this.root.getBoundingClientRect().width}`,
        });
      },
    });
  }
}
