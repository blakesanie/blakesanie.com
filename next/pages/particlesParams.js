exports.particlesParams = {
  autoPlay: true,
  background: {
    opacity: 0,
  },
  detectRetina: true,
  fpsLimit: 60,
  interactivity: {
    detectsOn: "window",
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "grab",
        parallax: {
          enable: false,
          force: 2,
          smooth: 10,
        },
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 200,
        links: {
          blink: false,
          consent: false,
          opacity: 1,
        },
      },
      push: {
        quantity: 1,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      distance: 110,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: "top",
      distance: 0,
      enable: true,
      outModes: {
        default: "out",
      },
      random: false,
      size: false,
      speed: 1,
    },
    number: {
      density: {
        enable: true,
        area: 800,
        factor: 600,
      },
      limit: 0,
    },
    opacity: {
      value: 0.4,
    },
    size: {
      value: 4,
      animation: {
        destroy: "none",
        enable: true,
        minimumValue: 1,
        speed: 2,
        startValue: "max",
        sync: false,
      },
    },
  },
  pauseOnBlur: true,
  pauseOnOutsideViewport: false,
};
