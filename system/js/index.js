// Droplet bounce
TweenMax.to('#Droplet-boundingShape', 3, {
  y: -15,
  yoyo: true,
  repeat: -1 });


// Droplet shadow
TweenMax.to('.Droplet-shadow', 3, {
  scale: 0.85,
  yoyo: true,
  repeat: -1,
  transformOrigin: 'center center' });


const dropletDimensions = {
  1: {
    opacity: {
      delay1: 1.85,
      value: 0.15,
      delay2: 2.85 },

    speed: 5,
    curviness: 0.5,
    values: [// Default x: 141, y: 30
    { x: 46, y: -8 },
    { x: 0, y: -16 },
    { x: -46, y: -8 },
    { x: 0, y: 0 }] },


  2: {
    opacity: {
      delay1: 3.40,
      value: 0.20,
      delay2: 6.25 },

    speed: 10,
    curviness: 0.65,
    values: [// Default x: 141, y: 86
    { x: 93.25, y: -18.5 },
    { x: 0, y: -38.25 },
    { x: -93.25, y: -18.5 },
    { x: 0, y: 0 }] },


  3: {
    opacity: {
      delay1: 3.75,
      value: 0.25,
      delay2: 7.8 },

    speed: 12,
    curviness: 0.65,
    values: [// Default x: 141, y: 151
    { x: 132, y: -26 },
    { x: 0, y: -52 },
    { x: -132, y: -26 },
    { x: 0, y: 0 }] },


  4: {
    opacity: {
      delay1: 4,
      value: 0.35,
      delay2: 9.65 },

    speed: 14,
    curviness: 0.6,
    values: [// Default x: 141, y: 219
    { x: 140.5, y: -26 },
    { x: 0, y: -52 },
    { x: -140.5, y: -26 },
    { x: 0, y: 0 }] },


  5: {
    opacity: {
      delay1: 2.20,
      value: 0.5,
      delay2: 5.5 },

    speed: 8,
    curviness: 0.65,
    values: [// Default x: 141, y: 275
    { x: 110, y: -21 },
    { x: 0, y: -41 },
    { x: -110, y: -21 },
    { x: 0, y: 0 }] } };




for (let i = 1; i <= 5; i++) {
  const tlPath = new TimelineMax({ repeat: -1 });
  const dot = `circle[data-group="${i}"]`;
  const timeDelay = i * Math.random();

  tlPath.
  to(dot, dropletDimensions[i].speed, {
    bezier: {
      values: dropletDimensions[i].values,
      curviness: dropletDimensions[i].curviness },

    ease: Power0.easeNone },
  'droplet-path').
  to(dot, 0.25, {
    delay: dropletDimensions[i].opacity.delay1,
    opacity: dropletDimensions[i].opacity.value,
    ease: Power0.easeNone },
  'droplet-path').
  to(dot, 0.25, {
    delay: dropletDimensions[i].opacity.delay2,
    opacity: 1,
    ease: Power0.easeNone },
  'droplet-path');

  tlPath.time(timeDelay);
}