import "./src/styles/style.scss";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ASScroll from "@ashthornton/asscroll";
import Experience from "./src/scripts/Experience";
import Landing from "./src/scripts/views/Landing";
import Content from "./src/scripts/views/Content";
import ee from "./src/scripts/utils/emiter.js";

gsap.registerPlugin(ScrollTrigger);
const asscroll = new ASScroll({
  disableRaf: true,
});

gsap.ticker.add(asscroll.update);

ScrollTrigger.defaults({
  scroller: asscroll.containerElement,
});

ScrollTrigger.scrollerProxy(asscroll.containerElement, {
  scrollTop(value) {
    return arguments.length
      ? (asscroll.currentPos = value)
      : asscroll.currentPos;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
});

asscroll.on("update", ScrollTrigger.update);
ScrollTrigger.addEventListener("refresh", asscroll.resize);

new Experience(document.querySelector("canvas.webgl"));

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
  document.querySelector("#app").style.setProperty("visibility", "visible");
  new Landing();
  new Content(asscroll.containerElement);
});
ee.on("loadingFinished", () => asscroll.enable());
