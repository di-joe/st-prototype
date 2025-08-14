/* global gsap, ScrollTrigger */
gsap.registerPlugin(ScrollTrigger);

// Load and inject the splash screen SVG
const SPLASH_SVG = "splashScreen_v3.svg";

fetch(SPLASH_SVG)
  .then(r => {
    if (!r.ok) throw new Error("Splash SVG fetch failed: " + r.status);
    return r.text();
  })
  .then(svgText => {
    const splashHost = document.getElementById("splashScreen");
    splashHost.innerHTML = svgText;

    const splashSvg = splashHost.querySelector("svg");
    if (splashSvg && !splashSvg.hasAttribute("viewBox")) {
      splashSvg.setAttribute("viewBox", "0 0 1920 1080"); // adjust if needed
    }

    // Hide all elements initially
  gsap.set([
  "#logoD", "#logoI", "#d2", "#flask", "#flaskLip", "#d1", 
  "#d3", "#d4", "#d5", "#d6", "#d7", "#d8", "#d9", "#scroll",
  "#underscore", 

  ], { opacity: 0 });

    // Animate logo sequence
    const splashTL = gsap.timeline();

    splashTL
      .to("#logoD", { opacity: 1, duration: 1 })
      .to(["#logoI", "#d2"], { opacity: 1, duration: 1, stagger: 0.5 }, "+=0.1")
      
      .to("#underscore", { opacity: 1, duration: 0.5 })
  
      // Blinking effect
      .to("#underscore", {
      opacity: 0,
      repeat: 3,
      yoyo: true,
      duration: 0.5,
      ease: "none"
      }, ) // slight delay after it appears

      .to([], { duration: 0.3 }); // <-- pause before letters

    // Animate letters dropping in with bounce
    const letters = ["#S", "#c", "#i", "#e", "#n", "#c2", "#e2"];

    letters.forEach((id) => {
      splashTL.from(id, {
        y: "-200vh",
        opacity: 0,
        duration: 0.6,
        ease: "back.out(2)",
      }, "<+=0.1");
    });
  splashTL
  .from("#exclamation", {
    scale: 100,
    opacity: 0,
    duration: 0.4,
    transformOrigin: "center center",
    ease: "none"
  }, "+=0.1") // starts after last letter drops

  .from("#point2", {
    scale: 100,
    opacity: 0,
    duration: 0.4,
    transformOrigin: "center center",
    ease: "none"
  }, "<+=0.1") // just after exclamation starts

  .to("#point2", {
  rotate: 3600,
  duration: 1.5,
  ease: "power4.out",
  transformOrigin: "center center"
  }, "<");

  // 1) Fade out logoI, fade in flask and flaskLip
  splashTL
  .to("#logoI", {
    opacity: 0,
    duration: 0.6
  }, "+=0.3") // slight delay after point slam

  .to(["#flask", "#flaskLip"], {
    opacity: 1,
    duration: 0.6,
    stagger: 0.1
  }, "<"); // start flask fade as logoI fades out

  const bubbleIds = ["#d1", "#d3", "#d4", "#d5", "#d6", "#d7", "#d8", "#d9"];

  bubbleIds.forEach((id, i) => {
  gsap.fromTo(id,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1,
      repeat: -1,
      transformOrigin: "center center",
      yoyo: true,
      ease: "sine.inOut",
      delay: splashTL.duration() + i * 0.3
    }
  );
  });

  gsap.fromTo("#scroll",
  { opacity: 0, y: 0 },
  {
    opacity: 1,
    y: -10,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: splashTL.duration() + 0.5 // starts after splash finishes
  }
  );



  })
  
let splashDismissed = false;

function hideSplash() {
  if (splashDismissed) return;
  splashDismissed = true;

  gsap.to("#splashScreen", {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      document.getElementById("splashScreen").style.display = "none";
      setupScrollSections(); // ✅ create the ScrollTriggers *after* splash is gone
      ScrollTrigger.refresh(); // optional but good backup
    }
  });
}

// Detect first scroll interaction
window.addEventListener("scroll", hideSplash, { once: true })
  




// Crossfade hero image out as SVG scrolls in
gsap.to("#heroImage", {
  scrollTrigger: {
    trigger: "#section-intro",
    start: "bottom 50% bottom",   // bottom of intro hits bottom of screen
    end: "bottom 10% top",        // bottom of intro scrolls past top of screen
    scrub: true,
    markers: true
  },
  opacity: 0,
  ease: "none"
});



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

    const svgRoot = host.querySelector('svg');
    if (svgRoot && !svgRoot.hasAttribute('viewBox')) {
      svgRoot.setAttribute('viewBox', '0 0 1366 768');
    }

    const night = host.querySelector("#night");
    const sun = host.querySelector("#sun");

    if (night) gsap.set(night, { opacity: 1 });
    if (sun) gsap.set(sun, { y: "200%", transformOrigin: "50% 50%" });

    gsap.fromTo("#evapSvgHost", 
      { y: "100%" }, 
      { 
        y: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: "#section-intro",
          start: "bottom 50% bottom",
          end: "bottom 10% top",
          scrub: true,
          markers: false
        }
      }
    );

    ScrollTrigger.create({
      trigger: "#section-evaporation",
      start: "top 30%",
      end: "bottom 30%",
      scrub: true,
      markers: false,
      onUpdate: (self) => {
        const p = self.progress;
        if (night) gsap.to(night, { opacity: 1 - p, overwrite: "auto" });
        if (sun) gsap.to(sun, { y: (200 - 200 * p) + "%", overwrite: "auto" });
      }
    });
  })
  .catch(err => {
    console.error("🔥 Error loading or animating evaporation SVG:", err);
    alert("There was a problem loading the evaporation animation.");
  });





// Pin each step (except the hero) for a custom number of viewport heights.
// Example: <section class="step" id="section-evaporation" data-hold="200">
function setupScrollSections() {
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
}