const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const clubs = [];
for (let i = 0; i < 45; i++) {
  clubs.push({
    id: i,
    name: `club_name_${i}`,
  });
}
const matches = [];
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

app.post("/getNotFullMatches", (req, res) => {
  const filteredMatches = matches.filter((match) => {
    return match.secondTeam == null;
  });
  res.status(200).json({ matches: filteredMatches });
});

app.post("/addMatch", (req, res) => {
  const { id } = req.body;
  const alreadyUsed = matches.some((match) => {
    return match.firstTeam == clubs[id] || match.secondTeam == clubs[id];
  });
  if (!alreadyUsed) {
    const footballMatch = {
      matchID: matches.length,
      firstTeam: clubs[id],
      secondTeam: null,
    };
    matches.push(footballMatch);
    res.status(200).json({ success: true });
  } else {
    res.status(200).json({ success: false });
  }
});

app.post("/setOpponent", (req, res) => {
  const { matchID, opponentID } = req.body;
  const alreadyUsed = matches.some((match) => {
    return (
      match.firstTeam == clubs[opponentID] ||
      match.secondTeam == clubs[opponentID]
    );
  });
  if (!alreadyUsed) {
    matches[matchID].secondTeam = clubs[opponentID];
    const filteredMatches = matches.filter((match) => {
      return match.secondTeam != null;
    });
    res.status(200).json({ success: true, matches: filteredMatches });
  } else {
    res.status(200).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`SERVER STARTED ON PORT ${PORT}`);
});
