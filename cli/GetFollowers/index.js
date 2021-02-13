const yargs = require("yargs");
const getFollowerList = require("../../twitterScrapper");
const { name } = yargs(process.argv.slice(2)).argv;
getFollowerList(name);
