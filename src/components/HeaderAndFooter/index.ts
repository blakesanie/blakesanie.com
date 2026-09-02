import type { HeaderVars } from "./shared"; // @ts-ignore

// @ts-ignore
const headerVars = window.headerVars as HeaderVars;
const {
  mobileHeaderHeight,
  headerHeightTransitionDuration,
  headerPositionTransitionDuration,
  mobileMaxWidth,
  noTab,
  hoverZoneBehind,
} = headerVars;

//  __    __                             __    __
// /  \  /  |                           /  |  /  |
// $$  \ $$ |  ______   __     __       $$ |  $$ |  ______   __     __  ______    ______
// $$$  \$$ | /      \ /  \   /  |      $$ |__$$ | /      \ /  \   /  |/      \  /      \
// $$$$  $$ | $$$$$$  |$$  \ /$$/       $$    $$ |/$$$$$$  |$$  \ /$$//$$$$$$  |/$$$$$$  |
// $$ $$ $$ | /    $$ | $$  /$$/        $$$$$$$$ |$$ |  $$ | $$  /$$/ $$    $$ |$$ |  $$/
// $$ |$$$$ |/$$$$$$$ |  $$ $$/         $$ |  $$ |$$ \__$$ |  $$ $$/  $$$$$$$$/ $$ |
// $$ | $$$ |$$    $$ |   $$$/          $$ |  $$ |$$    $$/    $$$/   $$       |$$ |
// $$/   $$/  $$$$$$$/     $/           $$/   $$/  $$$$$$/      $/     $$$$$$$/ $$/
const nav = document.querySelector<HTMLElement>("nav");
const header = document.querySelector<HTMLElement>("header");
if (!nav || !header) throw new Error("Header navigation is not mounted");
const anchors: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
  "nav .navSection:not(#nowPlayingSection) a",
);
const mouseOffSections = document.querySelectorAll("nav");
const mouseNoFocusSections = document.querySelectorAll("#nowPlayingSection");

// some div .navHoverZone may exist within a nav anchor element. Get that here
const activeNavHoverZone = document.querySelector<HTMLElement>(".active .navHoverZone");
let activeAnchor = activeNavHoverZone?.parentElement as HTMLAnchorElement | null;
const hoverZone: HTMLElement = (
  activeAnchor
    ? hoverZoneBehind
      ? nav.insertBefore(activeNavHoverZone!, nav.firstChild)
      : nav.appendChild(activeNavHoverZone!)
    : document.querySelector<HTMLElement>(".navHoverZone")
)!;

if (activeAnchor) {
  positionHoverAtAnchor(activeAnchor);
}

let menuExpanded = false;

for (let i = 0; i < anchors.length; i++) {
  anchors[i].addEventListener("mouseenter", () => {
    moveHoverToAnchor(anchors[i]);
  });
  anchors[i].addEventListener("mousemove", (e) => {
    e.stopPropagation();
  });

  anchors[i].addEventListener("click", () => {
    activeAnchor = anchors[i];
    moveHoverToAnchor(anchors[i]);
  });
}

// release hover effect back to resting state when leaving specified area
for (let i = 0; i < mouseOffSections.length; i++) {
  mouseOffSections[i].addEventListener("mouseleave", () => {
    moveHoverToAnchor(undefined);
  });
  mouseOffSections[i].addEventListener("mousemove", () => {
    if (window.innerWidth <= mobileMaxWidth) {
      moveHoverToAnchor(undefined);
    }
  });
}
// some elements within the area may not need a hover focus, so explicitly call them out here
for (let i = 0; i < mouseNoFocusSections.length; i++) {
  mouseNoFocusSections[i].addEventListener("mouseenter", () => {
    moveHoverToAnchor(undefined);
  });
}

let hoveFadeOutTimeout: ReturnType<typeof setTimeout>;

function moveHoverToAnchor(anchor: HTMLAnchorElement | undefined) {
  if (!anchor) {
    if (!activeAnchor) {
      // just fade out
      clearTimeout(hoveFadeOutTimeout);
      hoverZone.style.opacity = "0";
      hoveFadeOutTimeout = setTimeout(() => {
        hoverZone.classList.remove("hoverZoneTransition");
      }, 200);
    } else {
      // move hover zone back to original space
      positionHoverAtAnchor(activeAnchor);
    }
    return;
  }
  if (!activeAnchor) {
    clearTimeout(hoveFadeOutTimeout);
    positionHoverAtAnchor(anchor);
    requestAnimationFrame(() => {
      hoverZone.classList.add("hoverZoneTransition");
      hoverZone.style.opacity = "1";
    });
  } else {
    hoverZone.classList.add("hoverZoneTransition");
    positionHoverAtAnchor(anchor);
  }
}

function positionHoverAtAnchor(anchor: HTMLAnchorElement) {
  const targetY = anchor.offsetTop;
  const targetX = anchor.offsetLeft;
  // move to target space
  hoverZone.style.transform = `translate(${targetX}px, ${targetY}px)`;
  hoverZone.style.height = anchor.offsetHeight + "px";
  hoverZone.style.width =
    noTab && window.innerWidth > mobileMaxWidth
      ? `calc(${anchor.offsetWidth + "px"} - var(--navPadding) * 2)`
      : anchor.offsetWidth + "px";
}

window.addEventListener("resize", function () {
  hoverZone.classList.remove("hoverZoneTransition");
  // even if arg is null, that case would hide the hoverzone
  if (activeAnchor) {
    positionHoverAtAnchor(activeAnchor);
  }
});

//  __    __                            __                             ______                                 __  __
// /  |  /  |                          /  |                           /      \                               /  |/  |
// $$ |  $$ |  ______    ______    ____$$ |  ______    ______        /$$$$$$  |  _______   ______    ______  $$ |$$ |
// $$ |__$$ | /      \  /      \  /    $$ | /      \  /      \       $$ \__$$/  /       | /      \  /      \ $$ |$$ |
// $$    $$ |/$$$$$$  | $$$$$$  |/$$$$$$$ |/$$$$$$  |/$$$$$$  |      $$      \ /$$$$$$$/ /$$$$$$  |/$$$$$$  |$$ |$$ |
// $$$$$$$$ |$$    $$ | /    $$ |$$ |  $$ |$$    $$ |$$ |  $$/        $$$$$$  |$$ |      $$ |  $$/ $$ |  $$ |$$ |$$ |
// $$ |  $$ |$$$$$$$$/ /$$$$$$$ |$$ \__$$ |$$$$$$$$/ $$ |            /  \__$$ |$$ \_____ $$ |      $$ \__$$ |$$ |$$ |
// $$ |  $$ |$$       |$$    $$ |$$    $$ |$$       |$$ |            $$    $$/ $$       |$$ |      $$    $$/ $$ |$$ |
// $$/   $$/  $$$$$$$/  $$$$$$$/  $$$$$$$/  $$$$$$$/ $$/              $$$$$$/   $$$$$$$/ $$/        $$$$$$/  $$/ $$/
let prevScroll = 0;
let prevScrollTimestamp = 0;
let menuIsDown = false;
let existingInterval: ReturnType<typeof setTimeout> | undefined;
const moveHeaderDown = (isDown: boolean, isAnimated: boolean) => {
  header.style.position = "fixed";
  if (existingInterval) {
    clearTimeout(existingInterval);
  }
  if (isAnimated) {
    header.classList.add("transitionHeaderPosition");
  }
  if (isDown) {
    header.style.transform = "none";
  } else if (!menuExpanded) {
    header.style.transform = `translateY(${-100}%)`;
  }
  // header.style.transform = `translateY(${isDown ? 0 : -100}%)`;
  if (isAnimated) {
    existingInterval = setTimeout(() => {
      header.classList.remove("transitionHeaderPosition");
    }, headerPositionTransitionDuration * 1000);
  }
};

window.addEventListener("scroll", () => {
  if (window.innerWidth > mobileMaxWidth) {
    return;
  }
  const currentScroll = window.scrollY;
  const timestamp = new Date().getTime();
  const scrollVelocity = (currentScroll - prevScroll) / (timestamp - prevScrollTimestamp);
  if (currentScroll <= 0) {
    menuIsDown = false;
    header.style.position = "fixed";
  } else if (currentScroll <= mobileHeaderHeight) {
    if (menuIsDown) {
    } else if (!menuExpanded) {
      header.style.position = "absolute";
      header.style.transform = "none";
    }
  } else if (currentScroll > mobileHeaderHeight && prevScroll <= mobileHeaderHeight) {
    if (menuIsDown) {
    } else {
      moveHeaderDown(false, false);
      menuIsDown = false;
    }
  } else if (scrollVelocity > 0) {
    moveHeaderDown(false, true);
    menuIsDown = false;
  } else if (scrollVelocity < -0.8) {
    moveHeaderDown(true, true);
    menuIsDown = true;
  }
  prevScroll = currentScroll;
  prevScrollTimestamp = timestamp;
});

//  __       __                                      ________                                                    __
// /  \     /  |                                    /        |                                                  /  |
// $$  \   /$$ |  ______   _______   __    __       $$$$$$$$/  __    __   ______    ______   _______    _______ $$/   ______   _______
// $$$  \ /$$$ | /      \ /       \ /  |  /  |      $$ |__    /  \  /  | /      \  /      \ /       \  /       |/  | /      \ /       \
// $$$$  /$$$$ |/$$$$$$  |$$$$$$$  |$$ |  $$ |      $$    |   $$  \/$$/ /$$$$$$  | $$$$$$  |$$$$$$$  |/$$$$$$$/ $$ |/$$$$$$  |$$$$$$$  |
// $$ $$ $$/$$ |$$    $$ |$$ |  $$ |$$ |  $$ |      $$$$$/     $$  $$<  $$ |  $$ | /    $$ |$$ |  $$ |$$      \ $$ |$$ |  $$ |$$ |  $$ |
// $$ |$$$/ $$ |$$$$$$$$/ $$ |  $$ |$$ \__$$ |      $$ |_____  /$$$$  \ $$ |__$$ |/$$$$$$$ |$$ |  $$ | $$$$$$  |$$ |$$ \__$$ |$$ |  $$ |
// $$ | $/  $$ |$$       |$$ |  $$ |$$    $$/       $$       |/$$/ $$  |$$    $$/ $$    $$ |$$ |  $$ |/     $$/ $$ |$$    $$/ $$ |  $$ |
// $$/      $$/  $$$$$$$/ $$/   $$/  $$$$$$/        $$$$$$$$/ $$/   $$/ $$$$$$$/   $$$$$$$/ $$/   $$/ $$$$$$$/  $$/  $$$$$$/  $$/   $$/
//                                                                      $$ |
//                                                                      $$ |
//                                                                      $$/
// let menuExpanded = false;
const hamburger = document.getElementById("hamburger");

// let pendingHamburgerClick = false;
const hamburgerClick = () => {
  // if (!pendingHamburgerClick) {
  //   pendingHamburgerClick;
  // }
  const innerHeight = header.scrollHeight;
  if (menuExpanded) {
    header?.classList.remove("expanded");
    header.style.setProperty("--headerHeight", Math.min(innerHeight, window.innerHeight) + "px");
    setTimeout(() => {
      header.style.setProperty("--headerHeight", mobileHeaderHeight + "px");
    }, 0);
  } else {
    moveHoverToAnchor(undefined);

    header?.classList.add("expanded");
    header.style.setProperty("--headerHeight", Math.min(innerHeight, window.innerHeight) + "px");
    setTimeout(() => {
      header.style.setProperty("--headerHeight", "auto");
    }, headerHeightTransitionDuration * 1000);
    header.style.position = "fixed";
  }
  menuExpanded = !menuExpanded;
  // console.log("menuExpanded: ", menuExpanded);
};

hamburger?.addEventListener("click", hamburgerClick);

// const navLis = querySelectorAll("nav li");
// for (let i = 0; i < navLis.length; i++) {
//   navLis[i].addEventListener("click", function () {
//     alert("click!");
//     if (window.innerWidth <= mobileMaxWidth && menuExpanded) {
//       // hamburger.click();
//     }
//   });
// }

let wideScrollY = 0;

let wasMobile = false;
const evaluateTransitionable = () => {
  const isMobile = window.innerWidth <= mobileMaxWidth;
  // console.log(isMobile);
  if (isMobile && !wasMobile) {
    header.classList.add("headerTransitionable");
    // const originalScrollTop = wideScrollY;
    // console.log("widescrolly before mobile", wideScrollY);
    wideScrollY = header.scrollTop;
    header.scrollTop = 0;
    // hoverZone.style.transition = "none";
    // hoverZone?.classList.remove("hoverZoneTransition");
    // moveHoverToAnchor(undefined);
  } else if (!isMobile && wasMobile) {
    header.style.position = "fixed";
    header.classList.remove("headerTransitionable");
    header.style.transform = "none";
    // hoverZone.style.transition = "none";
    // hoverZone?.classList.remove("hoverZoneTransition");
    // moveHoverToAnchor(undefined);
    // console.log(wideScrollY);
    console.log("widescrolly when wide", wideScrollY);
    header.scrollTop = wideScrollY;
  }
  wasMobile = isMobile;
  if (menuExpanded) {
    // debugger;
    // hoverZone?.classList.remove("hoverZoneTransition");
    // moveHoverToAnchor(undefined);
  }
};
evaluateTransitionable();
window.addEventListener("resize", evaluateTransitionable);

header.addEventListener("click", (e) => {
  e.stopPropagation();
});
window.addEventListener("click", () => {
  if (menuExpanded && window.innerWidth <= mobileMaxWidth) {
    hamburgerClick();
  }
});

// if mouse scrollbar, add extra width
if (header && nav) {
  const headerWidth = header.offsetWidth;
  const navWidth = nav.offsetWidth;
  const delta = headerWidth - navWidth;
  if (delta > 0) {
    const newHeaderWidth = headerWidth + delta + "px";
    header.style.setProperty("--headerWidth", newHeaderWidth);
  }
}

// Listen for external navigation updates (e.g. from photo mode toggle)
window.addEventListener("update-nav-active", (e: any) => {
  const { href } = e.detail;
  const targetAnchor = Array.from(anchors).find((a) => a.getAttribute("href") === href);
  if (targetAnchor && targetAnchor !== activeAnchor) {
    // Update active class on parent LI elements
    anchors.forEach((a) => a.parentElement?.classList.remove("active"));
    targetAnchor.parentElement?.classList.add("active");

    activeAnchor = targetAnchor;
    moveHoverToAnchor(targetAnchor);
  }
});
