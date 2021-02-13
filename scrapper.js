const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url =
  "https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1";

const fetchData = () => {
  return axios(url);
};

const fetchPremierLeagueData = async () => {
  try {
    const response = await fetchData();
    const $ = cheerio.load(response.data);
    const statsTable = $(".statsTableContainer > tr");
    const topPremierLeagueScorers = [];
    statsTable.each(function () {
      const rank = $(this).find(".rank > strong").text();
      const playerName = $(this).find(".playerName > strong").text();
      const nationality = $(this).find(".playerCountry").text();
      const goals = $(this).find(".mainStat").text();
      topPremierLeagueScorers.push({
        rank,
        name: playerName,
        nationality,
        goals,
      });
      console.log(topPremierLeagueScorers);
    });
    var file = fs.createWriteStream("topscorers.txt");
    file.on("error", (err) => {
      throw new Error(err);
    });
    topPremierLeagueScorers.forEach((v) => {
      file.write(`rank: ${v.rank} Name: ${v.name} ` + "\n");
    });
    file.end();
  } catch (e) {
    console.log("e", e);
  }
};

fetchPremierLeagueData();
