//Object.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


Broadcast.send("Default"); //Default.js의 변수 불러오기
Broadcast.send("Common"); //Common.js의 변수 불러오기
Broadcast.send("DataBase"); //DataBase.js의 변수 불러오기


function clsUserInfo(info) { //info = {id: "id", name: "name"}
  let _signUpState = false;
  return {
    id: info.id,
    signUpState: function () {
      return _signUpState;
    },
    equal: function (obj) {
      return (info.id === obj.id) && (info.name === obj.name);
    },
    setState: function (state) {
      _signUpState = state;
    },
    getJson: function () {
      return {
        id: info.id,
        name: info.name
      };
    }
  }
}


function clsUser(userInfo) {

  let FindInventory = function (type, itemName) {
    return userInfo.inventory.find(i => i.type === type && i.name === itemName);
  };

  return {
    getJson: function () { //userInfo Json 가져오기
      return {
        name: userInfo.name,
        id: userInfo.id,
        profileId: userInfo.profileId,
        signUpDate: userInfo.signUpDate,
        state: userInfo.state,
        admin: userInfo.admin,
        ban: userInfo.ban,
        warn: userInfo.warn,
        coin: userInfo.coin,
        badges: userInfo.badges,
        stocks: userInfo.stocks,
        membership: {
          signUpDate: userInfo.membership.signUpDate,
          remainingPeriod: userInfo.membership.remainingPeriod
        },
        inventory: userInfo.inventory,
        chatCount: userInfo.chatCount,
        etc: userInfo.etc
      }
    },

    getState: function (stateName) { //상태 가져오기
      return userInfo.state[stateName];
    },
    setMaxState: function () { //전체 상태 최대로 설정하기
      userState = {
        hunger: 0
      };
    },
    setState: function (stateName, stateCount) { //상태 설정하기
      return userInfo.state[stateName] += stateCount;
    },

    getCoin: function () { //재화 가져오기
      return userInfo.coin;
    },
    setCoin: function (coin) { //코인 설정하기
      userInfo.coin = coin
    },
    addCoin: function (coin) { //코인 변경하기
      let remain = userInfo.coin + coin;
      if (remain >= 0) {
        userInfo.coin = remain;
        return true;
      }
      return false;
    },

    addItem: function (type, itemName, itemCount) { //가방에 물건 추가하기
      let item = FindInventory(type, itemName); //물건 찾기
      if (!item) userInfo.inventory.push({ //가지고 있지 않다면 물건 추가하기
        type: type,
        name: itemName,
        count: itemCount
      });
      item.count = Number(item.count) + Number(count); //가지고 있다면 물건 개수 증가하기
    },
    removeItem: function (type, itemName, itemCount) { //가방에 물건 삭제하기
      let item = FindInventory(type, itemName); //물건 찾기
      if (item) { //가지고 있다면
        if (Number(item.count) < Number(itemCount)) return false; //물건의 수가 적다면 실패 반환하기
        if (Number(item.count) === Number(itemCount)) { //물건의 수가 같다면 해당 물건 객체 삭제하고 성공 반환하기
          userInfo.inventory.filter(i => i !== item);
          return true;
        }
        if (Number(item.count) > Number(itemCount)) { //물건의 수가 많다면 해당 물건의 수 감소하고 성공 반환하기
          item.count = Number(item.count) - Number(itemCount);
          return true;
        }
      }
      return false; //가지고 있지 않다면 실패 반환하기
    },
    getItemList: function (type) { //물건 목록 반환하기
      if (type === "all") return userInfo.inventory; // type이 all이라면 가방의 모든 물건 반환하기
      return userInfo.inventory.find(i => i.type === type); //해당 물건을 찾아 반환하기
    },
    isItem: function (type, itemName) { //물건의 존재 여부 반환하기
      return Boolean(FindInventory(type, itemName));
    },
    isItemCount: function (type, itemName, itemCount) { //물건의 갯수 확인하기
      return Boolean(userInfo.inventory.find(i => i.type === type && i.name === itemName && i.count === itemCount));
    },
    isItemCount: function (type, itemName) { //물건의 개수 반환하기
      let item = FindInventory(type, itemName);
      if (item) return item.count;
      return false;
    }
  }
}


function clsUserRecord(userInfo) {
  return {
    getJson: function () {
      return {
        name: userInfo.name,
        action: userInfo.action
      };
    },
    addAction: function (type, time, act) {
      let count = userInfo.action[type].length + 1
      userInfo.action[type].push({
        count: [time, act]
      });
    },
    getAction: function () {
      return userInfo.action
    }
  }
}


function clsAttendance(info) {
  let day = info.day,
    month = info.month,
    year = info.year,
    pushList = info.pushlist;

  return {
    day: day,
    month: month,
    year: year,
    getJson: function () {
      return {
        day: day,
        month: month,
        year: year,
        pushList: pushList
      };
    },
    Push: function (id) {
      pushList.push(id);
    },
    isUser: function (id) {
      return (pushList.includes(id))
    }
  }
}


Broadcast.register("clsUserInfo", () => {
  return eval(clsUserInfo = clsUserInfo())
});
Broadcast.register("clsUser", () => {
  return eval(clsUser = clsUser())
});
// Broadcast.register("clsUserRecord", () => {
//   return eval(userRecord = clsUserRecord())
// });
Broadcast.register("clsAttendance", () => {
  return eval(clsAttendance = clsAttendance())
});