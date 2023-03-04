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
const itemsPerPage = 20;

app.post("/clubs", (req, res) => {
  const { query, pageNumber } = req.body;
  const start = pageNumber * itemsPerPage;
  const end = Math.min((pageNumber + 1) * itemsPerPage, clubs.length);
  const wantedClubs = clubs.slice(start, end);
  res.status(200).json({ clubs: wantedClubs, hasMore: end < clubs.length });
});

app.listen(PORT, () => {
  console.log(`SERVER STARTED ON PORT ${PORT}`);
});
