import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ee from "./utils/emiter.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import * as THREE from "three";

import landingVertex from "../shaders/landing/vertex.glsl";
import landingFragment from "../shaders/landing/fragment.glsl";

import noiseVertex from "../shaders/noise/vertex.glsl";
import noiseFragment from "../shaders/noise/fragment.glsl";

import projectVertex from "../shaders/project/vertex.glsl";
import projectFragment from "../shaders/project/fragment.glsl";

export default class WebGL {
  constructor(canvas, asscroll) {
    this.canvas = canvas;
    this.scroller = asscroll;

    this.contentContainer = document.querySelector(".content");
    this.contentContainerWidth =
      this.contentContainer.getBoundingClientRect().width;

    this.landingContainer = document.querySelector(".webgl-el.landing");
    this.images = document.querySelectorAll(".webgl-el.img");

    this.sizes = {
      width: window.innerWidth + 1,
      height: window.innerHeight + 1,
    };

    this.delayedMouse = {
      x: 0,
      y: 0,
    };

    this.mouse = {
      x: 0,
      y: 0,
    };

    this.clock = new THREE.Clock();

    this.uniforms = {
      uProgressTrans: 0.9,
      uProgressFade: 0.999,
      uColor1: new THREE.Color("#00190a"),
      // uColor2: new THREE.Color("#aca577"),
      uColor2: new THREE.Color("#ded7ab"),
      uColor3: new THREE.Color("#00190a"),
      // uColor4: new THREE.Color("#aca577"),
      uColor4: new THREE.Color("#ded7ab"),

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
    // this.setControls();
    this.setRayCaster();
    this.setBackgroundPlane();
    this.setLandingPlane();
    this.setRenderer();
    this.setPostProcessing();
    this.loop();

    window.addEventListener("resize", () => this.onResize());
    window.addEventListener("load", () => {
      this.pageLoaded = true;
      this.introAnim();
      this.setImages();
    });
    this.scroller.on("update", (scrollPos) => {
      this.setLandingPlanePosition();
      if (this.pageLoaded) this.setImagesPositions();
    });
  }

  setScene() {
    this.scene = new THREE.Scene();
  }

  setCamera() {
    this.cameraDistance = 600;
    const cameraFov =
      2 *
      Math.atan(this.sizes.height / 2 / this.cameraDistance) *
      (180 / Math.PI);

    this.camera = new THREE.PerspectiveCamera(
      cameraFov,
      this.sizes.width / this.sizes.height,
      200,
      1500
    );

    this.camera.position.set(0, 0, this.cameraDistance);
    this.scene.add(this.camera);
  }

  setControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  setBackgroundPlane() {
    this.backgroundPlaneGeo = new THREE.PlaneGeometry(
      this.sizes.width * 1.5,
      this.sizes.height * 1.5
    );
    this.backgroundPlaneMat = new THREE.MeshBasicMaterial({
      color: this.uniforms.uColor2,
    });
    this.backgroundPlane = new THREE.Mesh(
      this.backgroundPlaneGeo,
      this.backgroundPlaneMat
    );
    this.scene.add(this.backgroundPlane);
  }

  setLandingPlane() {
    const { top, left, width, height } =
      this.landingContainer.getBoundingClientRect();
    this.landingPlaneGeo = new THREE.PlaneGeometry(width, height);

    this.landingPlaneMat = new THREE.ShaderMaterial({
      fragmentShader: landingFragment,
      vertexShader: landingVertex,
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
        uMouse: { value: this.delayedMouse },
      },
      transparent: true,
    });

    this.landingPlane = new THREE.Mesh(
      this.landingPlaneGeo,
      this.landingPlaneMat
    );
    // this.landingPlane.position.set(0, 0, -1);

    this.landingPlane.position.x = left - this.sizes.width / 2 + width / 2;

    this.landingPlane.position.y = -top + this.sizes.height / 2 - height / 2;

    this.scene.add(this.landingPlane);
  }

  setLandingPlanePosition() {
    const { top, left, width, height } =
      this.landingContainer.getBoundingClientRect();
    this.landingPlane.position.x = left - this.sizes.width / 2 + width / 2;

    this.landingPlane.position.y = -top + this.sizes.height / 2 - height / 2;
  }

  setImages() {
    this.imagesStore = [...this.images].map((el, i) => {
      const bounds = el.getBoundingClientRect();

      const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height);
      const material = new THREE.ShaderMaterial({
        fragmentShader: projectFragment,
        vertexShader: projectVertex,
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: new THREE.TextureLoader().load(el.src) },
          uMouseUv: { value: new THREE.Vector2(0, 0) },
          uRez: {
            value: new THREE.Vector2(this.sizes.width, this.sizes.height),
          },
          uProgress: { value: 0 },
        },
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = bounds.left - this.sizes.width / 2 + bounds.width / 2;
      mesh.position.y = -bounds.top + this.sizes.height / 2 - bounds.height / 2;

      this.scene.add(mesh);

      return {
        el,
        mesh,
      };
    });
  }

  setImagesPositions() {
    this.imagesStore.forEach((img, i) => {
      const { top, left, width, height } = img.el.getBoundingClientRect();
      // if (i == 0) console.log(left - this.sizes.width / 2 + width / 2);
      img.mesh.position.x = left - this.sizes.width / 2 + width / 2;
      img.mesh.position.y = -top + this.sizes.height / 2 - height / 2;
    });
  }

  introAnim() {
    if (!this.landingPlaneMat) return;
    //Scale
    gsap.fromTo(
      this.landingPlaneMat.uniforms.uProgressTrans,
      {
        value: 0.9,
      },
      {
        value: 0,
        duration: 2,
        ease: "power1.out",
        yoyoEase: "power4.out",
        delay: 1,
      }
    );

    //FadeIn
    gsap.fromTo(
      this.landingPlaneMat.uniforms.uProgressFade,
      {
        value: 0.999,
      },
      {
        value: 0,
        duration: 2.4,
        ease: "power2.inOut",
        yoyoEase: "power4.out",
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
      alpha: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  }

  setPostProcessing() {
    this.postProcess = {};

    this.postProcess.renderPass = new RenderPass(this.scene, this.camera);

    this.noiseShader = {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
      },
      fragmentShader: noiseFragment,
      vertexShader: noiseVertex,
    };

    this.postProcess.noiseShader = new ShaderPass(this.noiseShader);

    this.postProcess.composer = new EffectComposer(this.renderer);
    this.postProcess.composer.addPass(this.postProcess.renderPass);
    this.postProcess.composer.addPass(this.postProcess.noiseShader);
    this.postProcess.composer.setSize(this.sizes.width, this.sizes.height);
    this.postProcess.composer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );
  }

  onMouseMove(e) {
    gsap.to(this.delayedMouse, {
      x: (e.clientX / this.sizes.width) * 2 - 1,
      y: -(e.clientY / this.sizes.height) * 2 + 1,
      duration: 4.5,
      ease: "power4",
    });

    this.mouse = {
      x: (e.clientX / this.sizes.width) * 2 - 1,
      y: -(e.clientY / this.sizes.height) * 2 + 1,
    };
  }

  setRayCaster() {
    this.raycaster = new THREE.Raycaster();
  }

  castRay() {
    if (!this.imagesStore) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const objectsToTest = this.imagesStore.map((i) => i.mesh);
    const intersects = this.raycaster.intersectObjects(objectsToTest);

    for (const intersect of intersects) {
      intersect.object.material.uniforms.uMouseUv.value = intersect.uv;
      gsap.to(intersect.object.material.uniforms.uProgress, {
        value: 1,
        duration: 2,
      });
    }

    for (const object of objectsToTest) {
      if (!intersects.find((intersect) => intersect.object === object)) {
        gsap.to(object.material.uniforms.uProgress, {
          value: 0,
          duration: 2.5,
          ease: "power4",
        });
      }
    }
  }

  loop() {
    this.elapsed = this.clock.getElapsedTime();

    this.castRay();

    if (this.landingPlaneMat)
      this.landingPlaneMat.uniforms.uTime.value = this.elapsed;
    this.postProcess.noiseShader.uniforms.uTime.value = this.elapsed * 0.00005;

    if (this.imagesStore) {
      this.imagesStore
        .map((i) => i.mesh)
        .forEach((image) => {
          image.material.uniforms.uTime.value = this.elapsed;
        });
    }

    if (this.controls) this.controls.update();

    // this.renderer.render(this.scene, this.camera);
    this.postProcess.composer.render(this.scene, this.camera);

    window.requestAnimationFrame(() => this.loop());
  }

  onResize() {
    //Update Sizes
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    //Update Camera
    const cameraFov =
      2 *
      Math.atan(this.sizes.height / 2 / this.cameraDistance) *
      (180 / Math.PI);
    this.camera.fov = cameraFov;
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    //Update Renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.postProcess.composer.setSize(this.sizes.width, this.sizes.height);
    this.postProcess.composer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );
  }
}
