const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
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

const clubs = [];
for (let i = 0; i < 120; i++) {
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
  matches.push({
    id: currentMatchID++,
    homeTeam: clubs[i],
    awayTeam: clubs[i + 1],
    currentTeam: "homeTeam",
    currentPlayer: 5,
    subscribers: [],
  });
}
const itemsPerPage = 20;

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
    ({ ["subscribers"]: _, ...rest }) => rest
  );
  res.status(200).json({
    matches: finalWantedMatches,
    hasMore: end < matches.length,
  });
});

app.post("/newMatch", (req, res) => {
  const { match } = req.body;
  const alreadyUsed = matches.some((singleMatch) => {
    return (
      singleMatch.homeTeam.id == match.homeTeam.id ||
      singleMatch.homeTeam.id == match.awayTeam.id ||
      singleMatch.awayTeam?.id == match.homeTeam.id ||
      singleMatch.awayTeam?.id == match.awayTeam.id
    );
  });
  if (!alreadyUsed) {
    const footballMatch = {
      id: currentMatchID++,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      currentTeam: "homeTeam",
      currentPlayer: 5,
      subscribers: [],
    };
    matches.push(footballMatch);
    res.status(200).json({ success: true });
  } else {
    res.status(200).json({ success: false });
  }
});

app.post("/match", (req, res) => {
  const { matchID } = req.body;
  const match = findMatchByID(matchID);
  res.status(200).json({
    id: match.id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
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
  const loseBall = Math.random();
  if (loseBall < 0.3)
    match.currentTeam == "homeTeam"
      ? (match.currentTeam = "awayTeam")
      : (match.currentTeam = "homeTeam");
  match.currentPlayer = Math.floor(Math.random() * 11);
};

const refreshMatchesData = () => {
  matches.forEach((match, i) => {
    const randomNumber = Math.random();
    const lastTeam = match.currentTeam;
    const lastPlayer = match.currentPlayer;
    evaluateAction(match);
    match.subscribers.forEach((socket) => {
      socket.emit(`matches/${i}`, {
        // data: `matches/${i} ${randomNumber}`,
        matchData: {
          currentTeam: match.currentTeam,
          currentPlayer: match.currentPlayer,
          lastTeam: lastTeam,
          lastPlayer: lastPlayer,
        },
      });
    });
  });
};

const intervalId = setInterval(() => {
  try {
    refreshMatchesData();
  } catch (error) {
    console.error("Error occurred during refreshing matches data:", error);
  }
}, 2000);

const findMatchByID = (matchID) => {
  return matches.find((match) => match.id == matchID);
};

const deleteIfExists = (arr, value) => {
  const index = arr.indexOf(value);
  if (index !== -1) arr.splice(index, 1);
};

io.on("connection", (socket) => {
  console.log(`user id ${socket.id}`);

  socket.on("disconnect", () => {
    matches.forEach((match) => {
      deleteIfExists(match.subscribers, socket);
    });
    console.log("A user disconnected");
  });

  socket.on(`matches`, (data) => {
    console.log("Received message:", data);
    const match = findMatchByID(data.matchID);
    if (!match.subscribers.includes(socket)) match.subscribers.push(socket);
  });
});
