//Main.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////

let {
  Default
} = require("Default");
let {
  Common
} = require("Common");
let {
  Helper
} = require("Helper");
let {
  UserManager
} = require("UserManager");

let {
  RecordManager
} = require("RecordManager");
let {
  SystemManager
} = require("SystemManager");
let {
  FriendsManager
} = require("FriendsManager");
let {
  DataBase
} = require("DataBase");

function onMessage(msg) {

  let botMessage = JSON.parse(Common.read(Default.fileList["Message"]));


  if (msg.content == `${Default.prefix} 기본정보`) {
    msg.reply([
      `방이름: ${msg.room.name}`,
      `사람이름: ${msg.author.name}`,
      `방 분류: ${msg.room.name == Default.MainRoomName ? "TRUE(1)" : "FALSE"}`
    ].join("\n"));
  } else {
    if (msg.content == Default.prefix + "도움말") msg.reply([
      `${msg.author.name}님! 아래 도움말을 참고해보세요!`,
      `https://www.team-cloud.kro.kr/manual`
    ].join("\n"));
    if (msg.room.name == Default.MainRoomName) {
      if (msg.content.includes(Default.prefix + "eval")) {
        if (Default.evalFlag) msg.send(eval(msg.content.replice(Default.prefix + "eval", "")));
      }
    } else {
      if (msg.isGroupChat) return;
      if (msg.startsWith(Default.prefix)) {
        if (checkCommandING(msg.room.name)) return msg.reply(`현재 명령어를 실행중이에요. 나중에 다시 시도해주세요!`);
        msg.reply(setCommandING(msg.room.name, true));
      }
      try {
        msg.reply(userCommand(msg.room.name, msg.content, msg.author.name, msg.author.hash))
      } catch (e) {
        Common.logE([
          botMessage["Error"].getRandom(),
          `room: ${msg.room.name}`,
          `sender: ${msg.author.name} (${msg.author.hash})`,
          `errorTitle: ${e.name}`,
          `errorMessage: ${e.message}`,
          `errorStack: ${e.stack}`
        ].join("\n"));
        msg.reply([
          botMessage["Bug"].getRandom(),
          `[${e.name}: ${e.message}]`,
          `[${e.stack}]`
        ].join("\n"));
      }
    }



  }
}

function userCommand(roomName, message, authorName, authorHash, reply) {
  let userID = UserManager.findUserHash(authorHash)
  if (message == `${Default.prefix} 등록`) {
    let userId = '';
    let list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''); //배열로 변경
    do {
      for (let i = 0; i < 5; i++) {
        userId += list.getRandom();
      }
    } while ((UserManager.contain(userId) !== false ? true : false)); //사용자 검색이 될 경우(되지 않지 않았을 경우) true 반환
    if (UserManager.makeUser(authorName, userId, authorHash)) {
      RecordManager.rcdAction(userId, "user", "회원가입을 시도함.");
      bot.send(Default.MainRoomName, `[${authorName}]님이 회원가입을 완료했어요`);
      RecordManager.rcdAction(userId, "bot", `회원가입을 완료함.`);
      reply(`회원가입을 완료했어요:)`);
    } else {
      RecordManager.rcdAction(userID, "user", `회원가입을 시도함.`)
      reply(`이미 회원가입을 완료했어요.`)
      RecordManager.rcdAction(userID, "bot", `회원가입을 실패함.(이미 회원가입을 완료함.)`)
    }
  } else if (message === `${Default.prefix} 계정정보`) {
    reply(`${UserManager.UserInfo}`);
  } else if (message.includes(`${Default.prefix} 친구`)) {
    let splitMessage = message.split(" ");

    if (splitMessage[2] === "추가") {
      RecordManager.rcdAction(userID, "user", `친구 추가를 시도함.`)
      if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
      let friend = message.replice(`${Default.prefix} 친구 추가 `, "");
      if (UserManager.contain(friend)) {
        FriendsManager.addFriend(UserManager.findUserHash(userID)["id"], authorName, friend);
        RecordManager.rcdAction(userID, "bot", `[${friend}]친구 추가를 성공함.`)
        reply(`[${friend}]님을 친구로 추가했어요.`);
        SystemManager.postMessage(friend, `[${authorName}]님이 당신을 친구로 추가했어요.`);
      } else {
        RecordManager.rcdAction(userID, "bot", `친구 추가를 실패함.`)
        reply(`[${friend}]님이 누구야?`);
      }
    }
    if (splitMessage[2] === "삭제") {
      RecordManager.rcdAction(userID, "user", `친구 삭제를 시도함.`)
      if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
      let friend = message.replice(`${Default.prefix} 친구 삭제 `, "");
      if (UserManager.contain(friend)) {
        FriendsManager.removeFriend(["id"], friend);
        RecordManager.rcdAction(userID, "bot", `[${friend}]친구 삭제를 성공함.`)
        reply(`[${friend}]님을 친구에서 삭제했어요.`);
        SystemManager.postMessage(friend, `[${authorName}]님이 당신을 친구에서 삭제했어요.`);
      } else {
        RecordManager.rcdAction(userID, "bot", `친구 삭제를 실패함.`)
        reply(`[${friend}]님이 누구야?`);
      }
    }
    if (splitMessage[2] === "확인") {
      RecordManager.rcdAction(userID, "user", `친구 확인을 시도함.`)
      if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
      let arr, rtnStr;
      arr = FriendsManager.getFollowing(userID);
      rtnStr += `[내가 추가한 친구들]\n\n`;
      for (let i = 0; i < arr.length; i++) rtnStr += ` - ${arr[i]}\n`;
      rtnStr += '\n나를 추가한 친구들]\n\n';
      arr = FriendsManager.getFollower(userID);
      for (let i = 0; i < arr.length; i++) rtnStr += ` - ${arr[i]}\n`;
      reply(rtnStr);
      RecordManager.addAction(userID, "bot", `친구 확인을 성공함.`)
    }
    if (splitMessage[2] === "우편") {
      RecordManager.rcdAction(userID, "user", `친구에게 우편 보내기를 시도함.`)
      if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
      if (message.replice(`${Default.prefix} 친구 우편 `, "")[0] == undefined && message.replice(`${Default.prefix} 친구 우편 `, "")[0].length === 6) return;
      let friend = message.replice(`${Default.prefix} 친구 우편 `, "");
      let sendMessage = message.replice(`${Default.prefix} 친구 우편 `, "").slice(6);
      SystemManager.postMessage(friend, sendMessage)
      reply(`[${friend}]님께 우편을 보냈어요.`)
      RecordManager.addAction(userID, "bot", `친구에게 우편 보내기를 성공함.`)
    }
  } else {
    PlayCommand(room, message, authorName, authorHash, reply)
  }
}


function PlayCommand(room, message, authorName, authorHash, reply) {
  let command = (commandText) => {
    return message === `${Default.prefix} ${commandText}`;
  };
  let commandWith = (commandText) => {
    return message.startsWith(`${Default.prefix} ${commandText}`);
  };

  let userID = UserManager.findUserHash(authorHash);
  let splitMessage = message.split(" ");
  if (Helper(room, message) === undefined) return;

  if (command(``)) {
    if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
    if (Helper(room, message.replice(`${Default.prefix} `, "")) === undefined) return;
    reply(Helper(room, message.replice(`${Default.prefix} `, "")))
  } else

  if (command(`식사`)) {
    if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
    reply(UserManager.Eat(id, message.replice(`${Default.prefix} 식사 `, "")));
  } else

  if (command(`대출하기`)) {
    if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
    reply([
      `대출은 '루미야 대출 [금액] [대출명]'이라고 입력해주세요.`,
      `예시를 보여 줄게요. ex) 루미야 대출 100000 스타대출`,
      `위 명령어는 스타대출로 100000스타를 대출하겠다는 의미에요.`
    ].join("\n"));
    reply(UserManager.getLoanList(userID));
  } else
  if (commandWith(`대출`)) {
    if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
    if (splitMessage[2] === undefined || splitMessage[3] === undefined) return reply(`명령어를 제대로 입력해주세요.`);
  } else
  if (commandWith(`정산`)) {
    if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
    reply(UserManager.calcLoan(userID));
  } else
  if (commandWith(`해지`)) {
    if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
    reply(UserManager.cancelLoan(userID));
  } else

  if (command(`구매하기`)) {
    if (!UserManager.contain(userID)) reply(`생성된 계정이 없어요`);
    reply([
      `구매를 하려면 '루미야 구매 [갯수] [아이템명]'이라고 입력해주세요.`,
      `예시를 보여 줄게요. ex) 루미야 구매 5 쿠키`,
      `위 명령어는 쿠키를 5개 구매한다는 의미에요.`
    ].join("\n"));
    reply(UserManager.getSaleItem(userID));
  } else
  if (commandWith(`구매`)) {
    if (!UserManager.contain(userID)) reply(`생선된 계정이 없어요.`);
    let itemName = splitMessage[2];
    let count = splitMessage[3];
    reply(UserManager)
  }

}



//11/24 수정
function checkCommandING(roomName) {

}




Array.prototype.getRandom = function () {
  if (this.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * this.length);
  return this[randomIndex];
}