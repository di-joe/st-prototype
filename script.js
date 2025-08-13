/* global gsap, ScrollTrigger */
gsap.registerPlugin(ScrollTrigger);


// Crossfade hero image out as SVG scrolls in
gsap.to("#heroImage", {
  scrollTrigger: {
    trigger: "#section-evaporation",
    start: "top bottom",    // Start fading when evap is near
    end: "top 30%",         // Fully faded when pinned
    scrub: true,
    markers: false
  },
  opacity: 0,
  ease: "none"
});

// 1) Slide the leftStage up between INTRO and EVAPORATION pins
// gsap.fromTo(
//  "#leftStage",
//  { y: "100%" },
//  {
//    y: "0%",
//    ease: "none",
//    scrollTrigger: {
//      trigger: "#section-intro",
//      start: "top 30%",
//      endTrigger: "#section-evaporation",
//      end: "top 30%",   // fully seated as evaporation pins
//      scrub: true,
//      markers: false
//    }
//  }
//);

// 2) Inline the SVG so we can animate internal layers reliably
//    Put your exported file (with correct IDs) in the same folder.
const SVG_URL = "waterCycle_evaporation-01.svg";

gsap.fromTo("#evapSvgHost", 
  { y: "100%" }, 
  { 
    y: "0%",
    ease: "none",
    scrollTrigger: {
      trigger: "#section-evaporation",
      start: "top bottom",
      end: "top 30%",
      scrub: true,
      markers: false
    }
  }
);


fetch(SVG_URL)
  .then(r => {
    if (!r.ok) throw new Error("SVG fetch failed: " + r.status);
    return r.text();
  })
  .then(svgText => {
    const host = document.getElementById("evapSvgHost");
    host.innerHTML = svgText;

  const svgRoot = host.querySelector('svg');
  if (svgRoot) {
  // Ensure a viewBox is present (needed for proper scaling)
  if (!svgRoot.hasAttribute('viewBox')) {
    svgRoot.setAttribute('viewBox', '0 0 1366 768'); // your artwork size
  }
}


    // Target layers by id (export from Illustrator with these names)
    const night = host.querySelector("#night");
    const sun   = host.querySelector("#sun");
    console.log("Found layers:", { night: !!night, sun: !!sun });

    if (night) gsap.set(night, { opacity: 1 });
    if (sun)   gsap.set(sun,   { y: "200%", transformOrigin: "50% 50%" });

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
        if (sun)   gsap.to(sun,   { y: (200 - 200 * p) + "%", overwrite: "auto" });
      }
    });
  })
  .catch(err => console.warn(err));



// Pin each step (except the hero) for a custom number of viewport heights.
// Example: <section class="step" id="section-evaporation" data-hold="200">
document.querySelectorAll(".step:not(.hero)").forEach((step) => {
  const hold = parseInt(step.dataset.hold || "100", 10); // default 100% (one viewport)

  ScrollTrigger.create({
    trigger: step,
    start: "top top",         // pin when step hits the top of the viewport
    end: `+=${hold}%`,        // hold for N% of viewport height
    pin: step,                // pin the whole step so only one is on screen
    pinSpacing: true,         // IMPORTANT: leave this true to prevent overlap
    anticipatePin: 1,         // smooths the start to avoid any jank
    markers: false            // turn true while tuning
  });
});