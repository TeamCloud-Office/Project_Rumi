//UserManager.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////

Broadcast.send("Default"); //Default 불러오기
Broadcast.send("Common"); //Common 불러오기
Broadcast.send("Object"); //Object 불러오기

Broadcast.send("DataBase"); //DataBase 불러오기
// Broadcast.send("RecordManager"); //RecordManager 불러오기
Broadcast.send("SystemManager"); //SystemManager 불러오기

function UserManager() {
  let userList = [];
  // let userOptionList = [];
  let UserDump = new Common.DumpModule();
  // let OptDump = new Common.DumpModule();

  let Load = function () {
    let UserList = Common.read(Default.fileNameList["UserList"]);
    for (let i = 0; i < tmpList.length; i++) userList.push(clsUser(tmpList[i]));
  }();

  let Contain = function (id) {
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].name === id) return i;
    }
    return false
  };

  let Find = function (id) {
    for (let i = 0; i < UserDump.dumpList.length; i++) {
      if (UserDump.dumpList[i].name === id) {
        UserDump.resetTimeStemp(i);
        return UserDump.dumpList[i];
      }
    }
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].name === id) {
        UserDump.addDump(userList[i]);
        return userList[i];
      }
    }
    return null;
  };

  // let _FindOption = function (id) {
  //   for (let i = 0; i < OptDump.dumpList.length; i++) {
  //     if (OptDump.dumpList[i].name === id) {
  //       OptDump.resetTimeStemp(i);
  //       return OptDump.dumpList[i];
  //     }
  //   }
  //   for (let i = 0; i < userOptionList.length; i++) {
  //     if (userOptionList[i].name === id) {
  //       userOptionList.addDump(userOptionList[i]);
  //       return userOptionList[i];
  //     }
  //   }
  //   return null;
  // }

  let MakeJson = function () {
    let jsonArr = [];
    for (let i = 0; i < userList.length; i++) jsonArr.push(JSON.stringify(userList[i]));
    return jsonArr;
  };

  // let MakeJsonOption = function () {
  //   let jsonArr = [];
  //   for (let i = 0; i < userOptionList.length; i++) jsonArr.push(JSON.stringify(userOptionList[i]));
  //   return jsonArr;
  // };

  let CreateUser = function (name, id, profileId) {
    let obj = {
      name: name,
      id: id,
      profileId: profileId,
      signUpDate: [new Date().getFullYear(), new Date().getMonth(), new Date().getDay()],
      state: {
        hunger: 0
      },
      admin: false,
      ban: false,
      warn: 0,
      coin: 10000,
      stocks: {},
      membership: {
        signUpDate: [],
        remainingPeriod: 0
      },
      inventory: {
        food: {
          candy: 0,
          chocolate: 0
        },
        badges: {

        },
        ticket: {

        }
      },
      chatCount: 0,
      etc: {}
    };
    userList.push(clsUser(obj));

    // let opt = {
    //   name: name,
    //   id: id,
    //   foodEat: ""
    // };
    // userOptionList.push(clsUserOption(opt))
  }

  let DeleteUser = function (id) {
    userList.filter(i => i !== id);
    Save();
  }

  let Save = function () {
    Common.write(Default.fileList["UserList"], MakeJson);
  }

  let RecivePost = function (user, item, coin) {
    let rtnStr = "";
    let _item;
    for (let i = 0; i < item.length; i++) {
      _item = item[i];
      user.addItem(_item.type, _item.name, _item.count)
      rtnStr += ` - ${_item.name}을(를) 받았어요.\n`
    }
    if (Number(coin)) {
      user.addRune(Number(coin));
      rtnStr += ` - ${coin}스타를 받았어요.`
    }
    return rtnStr;
  }

  return {
    deleteUser: function (id) {
      DeleteUser(id);
    },
    makeUser: function (id) {
      let idx = Contain(id);
      if (!idx) {
        CreateUser(id);
        return true;
      } else {
        return false;
      }
    },
    UserInfo: function (id) {
      let user = Find(id);
      if (user === null) return "생성된 계정이 없어요.";
      return [
        `[${user.name} 계정 정보]`,
        ` - 이름: ${user.name}`,
        ` - 사용자ID: ${user.id}`,
        ` - 가입일: ${user.signUpDate}`,
        ` - 정지: ${user.ban ? `정지됨`:"정지안됨"}`,
        ` - 재화: ${user.coin}스타`,
        `<가방>`,
        ` - 배지: ${user.inventory.badges}`,
        ` - 음식: ${user.inventory.food}`,
        ` - 사용권: ${user.inventory.ticket}`,
        `<멤버쉽>`,
        ` - 가입일: ${user.membership.signUpDate}`,
        ` - 남은일: ${user.membership.remainingPeriod}`,
        `<기타>`,
        ` - 채팅횟수: ${user.chatCount}`,
      ].join('\n')
    },
    getFoodItem: function (id) {
      let user = Find(id);
      if (user === null) return "생성된 계정이 없어요.";
      let food = (user) => {
        let rtnStr;
        for (let i = 0; i < user.inventory.food.length; i++) {
          let item = Object.keys(user.inventory.food)[i];
          rtnStr += `${item}: ${user.inventory.food[item]}개\n`
        }
      }
      return [
        `[보유한 음식]`,
        `${food(user)}`
      ].join('\n')
    },

    Betting: function (id, coin, target) {
      let user = Find(id);
      let rate = (Common.Random(1, 10) < 4 ? 1 : 2);
      let winFlag;
      let random;
      if (obj === null) return "생성된 계정이 없어요.";
      if (obj.loan > 0) return "대출이 있어 도박을 할 수 없어요.";
      if (Number(coin) > Default.BettingCoinLimit) return [
        `배팅 금액 한도를 넘었어요.`,
        `배팅 금액 한도는 ${Default.BettingCoinLimit}스타 에요`
      ].join('\n');
      if (user.coin <= Number(coin)) return `현재 배팅 금액에 해당하는 재화를 가지고 있지 않아요.`;
      if (target === "흑" || target === "백") {
        random = (Common.Random(0, 1) === 0 ? "흑" : "백");
        if (random === target) {
          rate *= 2;
          winFlag = true;
        } else {
          winFlag = false;
        }
      } else {
        random = Common.Random(1, 5);
        if (Number(target) === random) {
          rate *= 3;
          winFlag = true;
        } else {
          winFlag = false;
        }
      }
      if (winFlag) {
        obj.addCoin(Number(coin) * rate);
        return [`룰렛을 돌릴게요.`,
          `당신은 ${target}에 배팅했어요.`, ,
          `룰렛 결과는 [${random}]이에요.`,
          `당첨이에요. 배팅 금액인 ${coin}스타의 ${rate}배의 재화인 ${Number(coin) * rate}스타를 받았어요.`
        ].join('\n');
      } else {
        obj.addCoin(-(Number(coin)));
        return [`룰렛을 돌릴게요.`,
          `당신은 ${target}에 배팅했어요.`, ,
          `룰렛 결과는 [${random}]이에요.`,
          `낙첨이에요. 배팅 금액인 ${coin}스타를 잃었어요.`
        ].join('\n');
      }
    },

    RecivePost: function (id, item, coin) {
      let user = Find(id);
      if (user === null) return `생성된 계정이 없어요.`;
      Save();
      return RecivePost(user, item, coin);
    },
    ReciveAllPost: function (id, postlist) {
      let user = Find(id);
      let rtnStr;
      let post;
      if (user === null) `생성된 계정이 없어요.`;
      for (let i = 0; i < postlist.length; i++) {
        post = postlist[i];
        rtnStr += RecivePost(user, post.item, post.coin)
      }
      Save();
      return rtnStr;
    },

    RankingInfo: function (id, room) {
      let user = Find(id)
      if (user === null) return `생성된 계정이 없어요`;
      let getCoinTopList = (count) => {
        let _user = []
        for (let i = 0; i < userList.length; i++) {
          arr.push({
            name: userList[i].name,
            coin: userList[i].coin
          });
        }
        _user.sort(function (a, b) {
          return b.coin - a.coin
        });
        let top = arr.slice(0, count);
        return top.map(function (entry, index) {
          return `${index + 1}위 : ${entry.name} - ${entry.coin}스타`
        }).join("\n")
      }
      return [
        `[재화 순위 Top10]`,
        Default.more, ,
        getCoinTopList(10)
      ].join('\n');
    },

    getLoanList: function (id) {
      let user = Find(id);
      let DBLoan = DataBase.getLoanList();
      let rtnStr;
      if (user === null) return `생성된 계정이 없어요`;
      if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return "은행 업무를 볼 수 있는 시간이 아니에요.";
      for (let i = 0; i < DBLoan.length; i++) {
        rtnStr += ` - ${DBLoan[i].name} (기간: ${DBLoan[i].period}일, 금리: ${Math.floor(Number(DBLoan[i].rate)*100)}%)\n`
      }
      return [
        `[은행 대출 목록]`,
        `${rtnStr}`
      ].join("\n");
    },
    Loan: function (id, coin, target) {
      let user = Find(id);
      let DBLoan = DataBase.getLoanByName(target);
      if (user === null) return `생성된 계정이 없어요.`;
      if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return "은행 업무를 볼 수 있는 시간이 아니에요.";
      if (coin > Default.LoanMaxCoin) return `대출 한도를 넘어섰어요. 대출 한도는 ${Default.LoanMaxCoin}스타에요.`;
      if (DBLoan === null) return `해당 대출명은 존재하지 않아요.`;
      if (!user.setLoan(DBLoan.index, coin)) return `해당 사용자는 이미 대출 정보가 있어서 더이상 은행 업무를 볼 수 없어요. 현재 대출이 종료된 후에 다시 시도해주세요.`;
      user.addCoin(coin);
      Save();
      return [
        `${DBLoan.name}을(를) 했어요`,
        ` - ${coin}스타를 얻었어요.`,
        ` - 대출 금리는 ${Math.floor(Number(DBLoan.rate) * 100)}%에요`,
        ` - ${DBLoan.period}일 후에 ${Math.floor(coin * (1 + Number(DBLoan.rate)))}를 정산해주세요.`
      ].join('\n');
    },
    calcLoan: function (id) {
      let user = Find(id);
      let DBLoan = DataBase.getLoanByName(target);
      let loan = user.loan
      if (User === null) return `생성된 계정이 없어요.`;
      if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return "은행 업무를 볼 수 있는 시간이 아니에요.";
      let remainTime = loan.time + (Number(DBLoan.period) * 86400000) - new Date().getTime();
      if (remainTime > 0) return `정산일이 아니에요.`;
      if (loan.index === "") return `현재 대출을 보유하고 있지 않아요.`
      let calcCoin = Math.floor(loan.coin * (1 + Number(DBLoan.rate)));
      if (calcCoin > user.coin) return [
        `정산을 시작할게요.`,
        ,
        `사용자가 보유한 재화가 부족해요.`
      ].join("\n");
      user.addCoin(-calcCoin);
      user.removeLoan();
      Save();
      return [
        `정산을 시작할게요.`,
        ,
        `${calcCoin}스타를 갚았어요.`
      ].join("\n");
    },
    cancelLoan: function (id) {
      let user = Find(id);
      if (user === null) return `생성된 계정이 없어요.`
      if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return "은행 업무를 볼 수 있는 시간이 아니에요.";
      let loan = user.loan;
      if (loan.index === "") return `현재 대출을 보유하고 있지 않아요.`;
      let DBLoan = DataBase.getLoan(loan.index);
      let calcCoin = Math.floor(loan.coin * (1 + Number(DBLoan.rate)));
      if (calcCoin > user.coin) return [
        `현재 대출을 해지할게요. 중도해지라도 이자를 차감해요.`,
        `사용자가 보유한 재화가 부족해요.`
      ].join('\n');
      user.addCoin(-calcCoin);
      user.removeLoan();
      return [
        `현재 대출을 해지할게요. 중도해지라도 이자를 차감해요.`,
        `${calcCoin}스타를 갚았어요.`
      ].join('\n');
    },


    //추후 사용
    findUser: function (id) {
      return Find(id);
    },
    SaveUser: function () {
      Save();
    }
  }
}