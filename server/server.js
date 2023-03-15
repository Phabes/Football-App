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

app.post("/addMatch", (req, res) => {
  const { match } = req.body;
  const alreadyUsed = matches.some((singleMatch) => {
    return (
      singleMatch.firstTeam.id == match.firstTeam.id ||
      singleMatch.firstTeam.id == match.secondTeam.id ||
      singleMatch.secondTeam.id == match.firstTeam.id ||
      singleMatch.secondTeam.id == match.secondTeam.id
    );
  });
  if (!alreadyUsed) {
    const footballMatch = {
      matchID: matches.length,
      firstTeam: match.firstTeam,
      secondTeam: match.secondTeam,
    };
    matches.push(footballMatch);
    console.log(JSON.stringify(matches, null, 5));
    res.status(200).json({ success: true });
  } else {
    res.status(200).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`SERVER STARTED ON PORT ${PORT}`);
});
