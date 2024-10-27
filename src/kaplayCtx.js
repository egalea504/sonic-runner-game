import kaplay from "kaplay";

const k = kaplay({
  width: 1920,
  height: 1080,
  letterbox: true,
  background: (0,0,0),
  global: false,
  // for mobile
  touchToMouse: true,
  // create key and assign keyboard keys
  buttons: {
    jump: {
    keyboard: ["space"],
    mouse: "left"
    },
  },
  debugKey: "d",
  // deactivate at the end of
  debug: true
});

export default k;