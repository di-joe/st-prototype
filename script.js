/* global gsap, ScrollTrigger */
gsap.registerPlugin(ScrollTrigger);

// 1) Slide the leftStage up between INTRO and EVAPORATION pins
gsap.fromTo(
  "#leftStage",
  { y: "100%" },
  {
    y: "0%",
    ease: "none",
    scrollTrigger: {
      trigger: "#section-intro",
      start: "top 30%",
      endTrigger: "#section-evaporation",
      end: "top 30%",   // fully seated as evaporation pins
      scrub: true,
      markers: false
    }
  }
);

// 2) Inline the SVG so we can animate internal layers reliably
//    Put your exported file (with correct IDs) in the same folder.
const SVG_URL = "waterCycle_evaporation-01.svg";

fetch(SVG_URL)
  .then(r => {
    if (!r.ok) throw new Error("SVG fetch failed: " + r.status);
    return r.text();
  })
  .then(svgText => {
    const host = document.getElementById("evapSvgHost");
    host.innerHTML = svgText;

    const svgRoot = host.querySelector("svg");
    if (svgRoot) {
      // Fill the stage like background-size: cover
      svgRoot.setAttribute("width", "100%");
      svgRoot.setAttribute("height", "100%");
      svgRoot.setAttribute("preserveAspectRatio", "xMidYMid slice");
    }

    // Target layers by id (export from Illustrator with these names)
    const night = host.querySelector("#night");
    const sun   = host.querySelector("#sun");
    console.log("Found layers:", { night: !!night, sun: !!sun });

    if (night) gsap.set(night, { opacity: 1 });
    if (sun)   gsap.set(sun,   { y: "100%", transformOrigin: "50% 50%" });

    // 3) Animate during the EVAPORATION section's pin
    ScrollTrigger.create({
      trigger: "#section-evaporation",
      start: "top 30%",
      end:   "bottom 30%",
      scrub: true,
      markers: false,
      onUpdate: (self) => {
        const p = self.progress; // 0..1
        if (night) gsap.to(night, { opacity: 1 - p, overwrite: "auto" });
        if (sun)   gsap.to(sun,   { y: (100 - 100 * p) + "%", overwrite: "auto" });
      }
    });
  })
  .catch(err => console.warn(err));

// 4) Optional: per-step pinning (add as needed)
// Example: pause each section for 100% viewport height
// document.querySelectorAll(".step").forEach(step => {
//   ScrollTrigger.create({
//     trigger: step,
//     start: "top 30%",
//     end: "+=100%",
//     pin: false,       // set true if you want the TEXT pinned; we keep text scrolling here
//     scrub: false,
//     markers: false
//   });
// });
