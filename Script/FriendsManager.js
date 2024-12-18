//FriendsManager.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////

Broadcast.send("Default"); //Default 불러오기
Broadcast.send("Common"); //Common 불러오기

function FriendsManager() {
  let FriendsList = [];

  let LoadData = function () {
    FriendsList = Common.read(Default.fileList["FriednsManager"]);
  }();

  let FindFollowing = function (id) {
    let rtnArr = [];
    for (let i = 0; i < FriendsList.length; i++) {
      if (FriendsList[i].id === id) rtnArr.push(FriendsList[i].follow);
    }
    return rtnArr;
  };

  let FindFollower = function (id) {
    let rtnArr = [];
    for (let i = 0; i < FriendsList.length; i++) {
      if (FriendsList[i].follow === id) rtnArr.push(FriendsList[i].name);
    }
    return rtnArr;
  };

  let Find = function (id, follow) {
    for (let i = 0; i < FriendsList.length; i++) {
      if (FriendsList[i].id === id && FriendsList[i].follow === follow) return i;
    }
    return false;
  };

  let Delete = function (id) {
    for (let i = FriendsList.length - 1; i >= 0; i--) {
      if (FriendsList[i].id === id || FriendsList[i].follow === id) FriendsList.splice(i, 1);
    }
  };

  let Save = function () {
    Common.write(Default.fileList["FriendsList"], FriendsList);
  };


  return {
    Delete: function (id) {
      Delete(id);
    },
    addFriend: function (id, name, follow) {
      let idx = Find(id, follow);
      if (idx !== false) return false;
      FriendsList.push({
        id: id,
        name: name,
        follow: follow
      });
      Save();
      return true;
    },
    removeFriend: function (id, follow) {
      let idx = Find(id, follow);
      if (idx === false) return false;
      FriendsList.splice(idx, 1);
      Save();
      return true;
    },
    getFollower: function (id) {
      return FindFollower(id);
    },
    getFollowing: function (id) {
      return FindFollowing(id);
    }
  }
}