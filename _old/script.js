gsap.registerPlugin(ScrollTrigger);

gsap.to(".trigger", {
  scrollTrigger: {
    trigger: ".trigger",
    start: "top 80%",
    end: "bottom 50%",
    scrub: true
  },
  scale: 1.2,
  rotation: 10
});
