import gsap from "gsap";
import ee from "./utils/emiter.js";
import * as THREE from "three";

import vertex from "../shaders/landing/vertex.glsl";
import fragment from "../shaders/landing/fragment.glsl";

export default class Experience {
  constructor(canvas) {
    this.canvas = canvas;

    this.sizes = {
      width: window.innerWidth + 1,
      height: window.innerHeight + 1,
    };

    this.mousePos = {
      x: 0.5,
      y: 0.5,
    };

    this.clock = new THREE.Clock();

    this.uniforms = {
      uProgressTrans: 0.9,
      uProgressFade: 0.999,
      uColor1: new THREE.Color("#00190a"),
      uColor2: new THREE.Color("#fefae0"),
      uColor3: new THREE.Color("#00190a"),
      uColor4: new THREE.Color("#fefae0"),

      // uColor1: new THREE.Color("rgb(41, 112, 205)"),
      // uColor2: new THREE.Color("rgb(237, 174, 200)"),
      // uColor3: new THREE.Color("rgb(234, 60, 5)"),
      // uColor4: new THREE.Color("rgb(239, 177, 8)"),

      // uColor1: new THREE.Color("#870141"),
      // uColor2: new THREE.Color("#dfd137"),
      // uColor3: new THREE.Color("#021967"),
      // uColor4: new THREE.Color("#7bc7b3"),

      uColor2Intensity: 1,
      uColor1Intensity: 10,
      uColorGradientIntens: 8,
      uGridProgress: 1,
      uLineWidth: 0.01,
      uWhiteWidth: 1.5,
      uWhiteFade: 1.5,
    };

    this.setScene();
    this.setCamera();
    this.setVisibleSize();
    // this.setControls();
    this.setObjects();
    this.setRenderer();
    this.loop();

    window.addEventListener("resize", () => this.onResize());
    window.addEventListener("load", () => this.introAnim());
  }

  setVisibleSize() {
    this.visibleSize = {};

    let depth = 0;
    depth -= this.camera.position.z;
    const vFOV = (this.camera.fov * Math.PI) / 180;

    this.visibleSize.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth);
    this.visibleSize.width = this.visibleSize.height * this.camera.aspect;
  }

  setScene() {
    this.scene = new THREE.Scene();
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.sizes.width / this.sizes.height,
      0.01,
      1000
    );
    this.camera.position.set(0, 0, 2);
    this.scene.add(this.camera);
  }

  setControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  setObjects() {
    this.planeGeo = new THREE.PlaneGeometry(
      this.visibleSize.width,
      this.visibleSize.height
    );

    this.planeMat = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        uTime: { value: 0 },
        uColor2: { value: this.uniforms.uColor2 },
        uColor1: { value: this.uniforms.uColor1 },
        uColor3: { value: this.uniforms.uColor3 },
        uColor4: { value: this.uniforms.uColor4 },
        uProgressTrans: { value: this.uniforms.uProgressTrans },
        uProgressFade: { value: this.uniforms.uProgressFade },
        uColorGradientIntens: { value: this.uniforms.uColorGradientIntens },
        uLineWidth: { value: this.uniforms.uLineWidth },
        uWhiteWidth: { value: this.uniforms.uWhiteWidth },
        uWhiteFade: { value: this.uniforms.uWhiteFade },
        uGridProgress: { value: this.uniforms.uGridProgress },
        uMouse: { value: this.mousePos },
      },
      transparent: true,
    });

    this.plane = new THREE.Mesh(this.planeGeo, this.planeMat);
    this.plane.position.set(0, 0, 0);

    this.scene.add(this.plane);
  }

  introAnim() {
    //Scale
    gsap.fromTo(
      this.planeMat.uniforms.uProgressTrans,
      {
        value: 0.9,
      },
      {
        value: 0,
        duration: 2,
        ease: "power1.out",
        yoyoEase: "power4.out",
        // repeat: -1,
        // repeatDelay: 1.5,
        // yoyo: "true",
        delay: 1,
      }
    );

    //FadeIn
    gsap.fromTo(
      this.planeMat.uniforms.uProgressFade,
      {
        value: 0.999,
      },
      {
        value: 0,
        duration: 2.4,
        ease: "power2.inOut",
        yoyoEase: "power4.out",
        // repeat: -1,
        // repeatDelay: 1.5,
        // yoyo: "true",
        delay: 1.5,
        onComplete: () => {
          this.introFinished = true;
        },
      }
    );

    setTimeout(() => {
      window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    }, 2000);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  }

  onMouseMove(e) {
    // if (this.introFinished) {
    gsap.to(this.mousePos, {
      x: e.clientX / this.sizes.width,
      y: 0.4 + (e.clientY / this.sizes.height) * 0.2,
      duration: 4.5,
      ease: "power4",
    });
    // }
  }

  loop() {
    this.elapsed = this.clock.getElapsedTime();

    this.planeMat.uniforms.uTime.value = this.elapsed;

    if (this.controls) this.controls.update();

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(() => this.loop());
  }

  onResize() {
    //Update Sizes
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    //Update Camera
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    //Update Renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
