import { splitLetters } from "textsplitter";
import gsap from "gsap";
import ee from "../utils/emiter";

export default class Landing {
  constructor() {
    this.splitTitles();
  }

  splitTitles() {
    const titles = document.querySelectorAll(".landing h2");
    titles.forEach((el) =>
      splitLetters(el, "<span class='split-title'>", "</span>")
    );

    gsap.to(".split-title", {
      alpha: 1,
      y: 0,
      stagger: 0.025,
      delay: 2.5,
      ease: "power2",
      onComplete: () => {
        ee.emit("loadingFinished");
      },
    });
  }
}
