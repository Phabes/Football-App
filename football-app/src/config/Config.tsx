const config = {
  url: process.env.FOOTBALL_URL
    ? process.env.FOOTBALL_URL
    : "http://localhost:5000/",
  player2dSize: 50,
  halfPitchSize: {
    width: 52.5,
    height: 68,
  },
  pitchLinesWidth: 4,
  startScalingSize: 350,
  time: 1000,
  timeStep: 20,
};

export default config;
