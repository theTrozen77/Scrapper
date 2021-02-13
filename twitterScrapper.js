const axios = require("axios");
const fs = require("fs");

const requestFetch = (request) => {
  axios.defaults.headers.common["Authorization"] = BEARER_AUTH_TOKEN;
  return axios.request(request);
};

const fetchUserFollowers = (source_screen_name) => {
  return requestFetch({
    method: "GET",
    url: `https://api.twitter.com/1.1/followers/list.json?cursor=-1&screen_name=${source_screen_name}&skip_status=true&include_user_entities=true`,
  });
};
const fetchFriendship = (source_screen_name, targetUser) => {
  return requestFetch({
    method: "GET",
    url: `https://api.twitter.com/1.1/friendships/show.json?source_screen_name=${source_screen_name}&target_screen_name=${targetUser}

        `,
  });
};

const getFollowerList = async (source_screen_name) => {
  try {
    const { data } = await fetchUserFollowers(source_screen_name);
    const followerParticularDetail = data.users.reverse().map((userDetails) => {
      return {
        id: userDetails.id,
        userName: userDetails.name,
        screenName: userDetails.screen_name,
      };
    });
    try {
      let newFollowerDetails = [];
      followerParticularDetail.map((details) => {
        setTimeout(async () => {
          const targetName = details.screenName;
          const response = await fetchFriendship(
            source_screen_name,
            targetName
          );
          const {
            relationship: { source },
          } = response.data;
          const canBeMessaged = source.can_dm;
          const updatedList = { ...details, canBeMessaged: canBeMessaged };

          newFollowerDetails.push(updatedList);
          console.log("newFollowerDetails", newFollowerDetails);
          var file = fs.createWriteStream("followers.txt");
          file.on("error", (err) => {
            throw new Error(err);
          });
          newFollowerDetails.forEach((v) => {
            file.write(
              `id: ${v.id} UserName: ${v.userName} ScreenName:${v.screenName} DM: ${v.canBeMessaged}` +
                "\n"
            );
          });
          file.end();
        }, 1000);
      });
    } catch (e) {
      throw new Error(e);
    }
  } catch (e) {
    throw new Error(e);
  }
};
module.exports = getFollowerList;

//  getFollowerList();
