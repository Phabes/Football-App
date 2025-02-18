const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const config = require("./config/config");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const availableFormations = [
  [1, 4, 4, 2],
  [1, 4, 3, 3],
  [1, 3, 4, 3],
  [1, 3, 5, 2],
];

const availableColors = [
  "#eb8181",
  "#ed6639",
  "#edb451",
  "#dae01d",
  "#88db2a",
  "#20f532",
  "#20f5b5",
  "#1cd1e6",
  "#1679db",
  "#ac72f2",
  "#911ad6",
  "#d62dd1",
  "#e62984",
  "#d11141",
];

const randomFormation = () => {
  const formation = Math.floor(Math.random() * availableFormations.length);
  return availableFormations[formation];
};

const randomColor = () => {
  const color = Math.floor(Math.random() * availableColors.length);
  return availableColors[color];
};

const triggerTimeout = (match) => {
  const speed = refreshMatchData(match);

  match.interval = setTimeout(triggerTimeout, speed, match);
};

const usersData = new Map();
// const uniqueUsers = new Set();

const clubs = [];
for (let i = 0; i < 10; i++) {
  clubs.push({
    id: i,
    name: `club_name_${i}`,
    formation: randomFormation(),
    colors: { mainColor: randomColor(), secondaryColor: randomColor() },
  });
}
const matches = [];
let currentMatchID = 0;
for (let i = (clubs.length - 2) / 2 + 1; i < clubs.length - 2 + 1; i += 2) {
  const match = {
    id: currentMatchID++,
    homeTeam: clubs[i],
    awayTeam: clubs[i + 1],
    currentTeam: "homeTeam",
    currentPlayer: 5,
    score: [0, 0],
    actions: [],
    interval: null,
  };
  match.interval = setTimeout(triggerTimeout, 0, match);
  matches.push(match);
}
const itemsPerPage = config.itemsPerPage;

app.post("/clubs", (req, res) => {
  const { query, pageNumber } = req.body;
  const filteredClubs = clubs.filter((club) => {
    return club.name.includes(query);
  });
  const start = pageNumber * itemsPerPage;
  const end = Math.min((pageNumber + 1) * itemsPerPage, filteredClubs.length);
  const wantedClubs = filteredClubs.slice(start, end);
  res
    .status(200)
    .json({ clubs: wantedClubs, hasMore: end < filteredClubs.length });
});

app.post("/matches", (req, res) => {
  const { pageNumber } = req.body;
  const start = pageNumber * itemsPerPage;
  const end = Math.min((pageNumber + 1) * itemsPerPage, matches.length);
  const wantedMatches = matches.slice(start, end);
  const finalWantedMatches = wantedMatches.map(
    ({ currentTeam, currentPlayer, actions, interval, ...rest }) => rest
  );
  res.status(200).json({
    matches: finalWantedMatches,
    hasMore: end < matches.length,
  });
});

app.post("/newMatch", (req, res) => {
  const { match } = req.body;

  const homeTeamInUse = matches.some((singleMatch) => {
    return (
      singleMatch.homeTeam.id == match.homeTeam.id ||
      singleMatch.awayTeam.id == match.homeTeam.id
    );
  });
  const awayTeamInUse = matches.some((singleMatch) => {
    return (
      singleMatch.homeTeam.id == match.awayTeam.id ||
      singleMatch.awayTeam.id == match.awayTeam.id
    );
  });

  if (!homeTeamInUse && !awayTeamInUse) {
    const footballMatch = {
      id: currentMatchID++,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      currentTeam: "homeTeam",
      currentPlayer: 5,
      score: match.score,
      actions: [],
      interval: null,
    };
    footballMatch.interval = setTimeout(triggerTimeout, 0, footballMatch);
    matches.push(footballMatch);
    res.status(200).json({ success: true, message: "Match created" });
  } else if (homeTeamInUse && awayTeamInUse) {
    res
      .status(200)
      .json({ success: false, message: `Both teams already in play` });
  } else if (homeTeamInUse) {
    res
      .status(200)
      .json({ success: false, message: `Home Team already in play` });
  } else {
    res
      .status(200)
      .json({ success: false, message: `Away Team already in play` });
  }
});

app.post("/match", (req, res) => {
  const { matchID } = req.body;
  const match = findMatchByID(matchID);
  res.status(200).json({
    id: match.id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    score: match.score,
    numberOfActions: match.actions.length,
  });
});

const appServer = app.listen(PORT, () => {
  console.log(`SERVER STARTED ON PORT ${PORT}`);
});

const io = new Server(appServer, {
  cors: {
    origin: "*",
  },
});

const evaluateAction = (match) => {
  const score = Math.random();
  const goal = score < config.scoringChance;
  if (goal) {
    match.currentTeam == "homeTeam" ? match.score[0]++ : match.score[1]++;
  }
  const loseBall = Math.random();
  if (goal || loseBall < config.loseBallChance)
    match.currentTeam == "homeTeam"
      ? (match.currentTeam = "awayTeam")
      : (match.currentTeam = "homeTeam");
  match.currentPlayer = Math.floor(Math.random() * 11);
};

const refreshMatchData = (match) => {
  const lastTeam = match.currentTeam;
  const lastPlayer = match.currentPlayer;

  const speed =
    Math.floor(Math.random() * (config.variableTime / config.timeStep)) *
      config.timeStep +
    config.minTime;

  evaluateAction(match);

  const action = {
    index: match.actions.length + 1,
    currentTeam: match.currentTeam,
    currentPlayer: match.currentPlayer,
    lastTeam: lastTeam,
    lastPlayer: lastPlayer,
    speed: speed,
    score: match.score,
  };
  match.actions.push(action);

  return speed;
};

const findMatchByID = (matchID) => {
  return matches.find((match) => match.id == matchID);
};

const emitNextAction = (socket) => {
  const [matchID, matchAction, timeoutID] = usersData.get(socket.id);

  clearTimeout(timeoutID);

  const match = findMatchByID(matchID);

  if (matchAction == 0 && match.actions.length == 0) {
    usersData.set(socket.id, [
      matchID,
      0,
      setTimeout(emitNextAction, config.minTime + config.variableTime, socket),
    ]);
    return;
  }

  if (matchAction >= match.actions.length) {
    usersData.set(socket.id, [
      matchID,
      matchAction,
      setTimeout(
        emitNextAction,
        match.actions[match.actions.length - 1].speed,
        socket
      ),
    ]);
    return;
  }

  socket.emit(`matches/${match.id}`, {
    // actionNumber: matchAction,
    totalNumberOfActions: match.actions.length,
    action: match.actions[matchAction],
  });

  const nextAction = matchAction + 1;

  usersData.set(socket.id, [
    matchID,
    nextAction,
    setTimeout(emitNextAction, match.actions[matchAction].speed, socket),
  ]);
};

io.on("connection", (socket) => {
  console.log(`user id ${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`A user ${socket.id} disconnected`);
    if (!usersData.has(socket.id)) {
      return;
    }
    const [matchID, matchAction, timeoutID] = usersData.get(socket.id);
    clearTimeout(timeoutID);
    usersData.delete(socket.id);
  });

  socket.on(`matches`, (data) => {
    console.log("Received message:", data);
    const match = findMatchByID(data.matchID);

    usersData.set(socket.id, [
      match.id,
      Math.max(match.actions.length - 1, 0),
      setTimeout(emitNextAction, 0, socket),
    ]);
  });
});
