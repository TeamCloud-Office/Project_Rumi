//SystemManagerScript.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////



let {
  Default
} = require("Default");
let {
  UserManager
} = require("UserManager");
let {
  SystemManager
} = require("SystemManager");


let bot = BotManager.getCurrentBot();

function onMessage(msg) {

  if (msg.room !== Default.MainRoomName) return;

  if (msg.content == Default.Prefix) {
    switch (msg.content.replace(`${Default.Prefix} `, "")[0]) {
      case "컴파일":
        startComplie();
        break;
      case "시작":
        if (!BotManager.getPower("Main")) {
          BotManager.setPower("Main", true);
          msg.reply(`[ ${UserManager.FindUser(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템을 시작할게요!`);
        } else {
          msg.reply(`[ ${UserManager.FindUser(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템이 작동중이에요.`)
        }
        break;
      case "정지":
        if (BotManager.getPower("Main")) {
          BotManager.setPower("Main", false);
          msg.reply(`[ ${UserManager.FindUser(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템을 정지할게요!`);
        } else {
          msg.reply(`[ ${UserManager.FindUser(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 이미 시스템이 정지되어 있어요.`)
        }
        break;
    }
    if (msg.content.startsWith(`${Default.Prefix} 공지`)) {
      let replaceMessage = msg.content.replace(`${Default.Prefix} 공지`, "");

      let roomList = {
        'TeamCloud 커뮤니티': false,
        '': false
      }

      for (let i = 0; i < Object.keys(roomList).length; i++) {
        bot.send(Object.keys(roomList)[i], `[ TeamCloud 공지 메시지 ]\n${replaceMessage}`);
        Object.keys(roomList)[i] = true
      }
      let t, f
      for (let i = 0; i < Object.keys(roomList).length; i++) {
        if (Object.keys(roomList)[i] == false) t++
        if (Object.keys(roomList)[i] == false) f++
      }
      bot.send(Default.MainRoomName, [
        `공지 메시지를 모두 전달했어요.`,
        `전달 성공 채팅방: ${t}개`,
        `전달 실패 채팅방: ${f}개`
      ].join("\n"))
    }
  }
}
bot.addListener(Event.MESSAGE, onMessage);


function MakeDir(path) {
  let folder = new File(path);
  folder.mkdirs();
}

function startComplie() {
  let succ = true;
  try {
    BotManager.compileAll();
  } catch (e) {
    bot.send(Default.MainRoomName, `title: ${e.name} message: ${e.message}`);
    succ = false;
  }

  bot.send(Default.MainRoomName, "컴파일을 성공했어요.");
}