//Main.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////

Broadcast.send("Default"); //Default 불러오기
Broadcast.send("Common"); //Common 불러오기
Broadcast.send("Helper"); //Helper 불러오기
Broadcast.send("UserManager"); //UserManager 불러오기

Broadcast.send("RecordManager"); //RecordManager 불러오기
Broadcast.send("SystemManager"); //SystemManager 불러오기
Broadcast.send("FriendsManager"); //FriendsManager 불러오기
Broadcast.send("DataBase"); //DataBase 불러오기

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
      RecordManager.rcdAction(authorHash, "user", `회원가입을 시도함.`)
      reply(`이미 회원가입을 완료했어요.`)
      RecordManager.rcdAction(authorHash, "bot", `회원가입을 실패함.(이미 회원가입을 완료함.)`)
    }
  }
  if (message === `${Default.prefix} 계정정보`) reply(`${UserManager.UserInfo}`);

  if (message.includes(`${Default.prefix} 친구`)) {
    let splitMessage = message.split(" ");

    if (splitMessage[2] === "추가") {
      RecordManager.rcdAction(authorHash, "user", `친구 추가를 시도함.`)
      if (!UserManager.contain(authorHash)) return reply(``);
      let friend = message.replice(`${Default.prefix} 친구추가 `, "");
      if (UserManager.contain(friend)) {
        FriendsManager.addFriend(UserManager.findUserHash(authorHash)["id"], authorName, friend);
        RecordManager.rcdAction(authorHash, "bot", `[${friend}]친구 추가를 성공함.`)
        reply(`[${friend}]님을 친구로 추가했어요.`);
        SystemManager.postMessage(friend, `[${authorName}]님이 당신을 친구로 추가했어요.`);
      } else {
        RecordManager.rcdAction(authorHash, "bot", `친구 추가를 실패함.`)
        reply(`[${friend}]라는 사람이 누구야..?`);
      }
    }
    if (splitMessage[2] === "삭제") {
      RecordManager.rcdAction(authorHash, "user", `친구 삭제를 시도함.`)
      if (!UserManager.contain(authorHash)) return reply(``);
      let friend = message.replice(`${Default.prefix} 친구삭제 `, "");
      if (UserManager.contain(friend)) {
        FriendsManager.removeFriend(UserManager.findUserHash(authorHash)["id"], friend);
        RecordManager.rcdAction(authorHash, "bot", `[${friend}]친구 삭제를 성공함.`)
        reply(`[${friend}]님을 친구에서 삭제했어요.`);
        SystemManager.postMessage(friend, `[${authorName}]님이 당신을 친구에서 삭제했어요.`);
      } else {
        RecordManager.rcdAction(authorHash, "bot", `친구 삭제를 실패함.`)
        reply(`[${friend}]라는 사람이 누구야..?`);
      }
    }
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