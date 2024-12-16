//SystemManager

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


Broadcast.send("Default"); //Default 불러오기
Broadcast.send("Common"); //Common 불러오기
Broadcast.send("UserManager"); //UserManager 불러오기

let MasterRoom = "TeamCloud 개발방"; //관리방
let threadQueue = [];
let CompileList = ["Defalt.js", "Common.js", "DataBase.js", "Helper.js", "Object.js", "UserManger.js", "Main.js"];
let BackupList = Defaulf.fileList;

let funcSystemManager = (function () {
  let UserFile = Defaulf.fileList.UserList;
  let PostFile = Defaulf.fileList.PostList;
  let ItemType = Defaulf.ItemType;
  let DBFileList = Defaulf.DBFileList;

  let DB = {};
  let PostList = [];
  let UserList = [];

  let file = function (path) {
    return Defaulf.rootPath + path;
  };
  let read = function (path) {
    try {
      return JSON.parse(Defaulf.FS.read(file(path)));
    } catch (e) {
      Log.e(`read() error --- ${e.message}`);
    }
  };
  let write = function (path, obj) {
    try {
      Defaulf.FS.write(file(path), JSON.stringify(obj));
    } catch (e) {
      Log.e(`write() error --- ${e.message}`);
    }
  };

  let LoadData = function () {
    DB.BadgeItem = read(DBFileList['BadgeItem']);
    DB.StarsItem = read(DBFileList['StarsItem']);
    DB.FoodItem = read(DBFileList['FoodItem']);
    DB.TicketItem = read(DBFileList["TicketItem"]);
    DB.MandrelItem = read(DBFileList["MandrelItem"]);
    DB.MineralItem = read(DBFileList["MineralItem"]);
    PostList = read(PostFile);
  }();

  let Find = function (id) {
    let rtnArr = [];
    let tmpPost = null;
    for (let i = 0; i < PostList.length; i++) {
      tmpPost = PostList[i];
      if (tmpPost.name === id) rtnArr.push(tmpPost);
    }
    return rtnArr;
  };
  let FindUser = function (id) {
    UserList = read(UserFile);
    let tmpUser = null;
    for (let i = 0; i < UserList.length; i++) {
      tmpUser = UserList[i];
      if (tmpUser.name === id) return true;
    }
    return false;
  };
  let FindItem = function (itemName) {
    let rtnObj = {
      type: "",
      index: "",
      name: ""
    };
    let tmpItem = null;
    for (let i = 0; i < DB.BadgeItem.length; i++) {
      tmpItem = DB.BadgeItem[i];
      if (tmpItem.name === itemName) {
        rtnObj.type = ItemType.BadgeItem;
        rtnObj.index = tmpItem.index;
        rtnObj.name = itemName;
        return rtnObj;
      }
    }
    for (let i = 0; i < DB.StarsItem.length; i++) {
      tmpItem = DB.StarsItem[i];
      if (tmpItem.name === itemName) {
        rtnObj.type = ItemType.StarsItem;
        rtnObj.index = tmpItem.index;
        rtnObj.name = itemName;
        return rtnObj;
      }
    }
    for (let i = 0; i < DB.FoodItem.length; i++) {
      tmpItem = DB.FoodItem[i];
      if (tmpItem.name === itemName) {
        rtnObj.type = ItemType.FoodItem;
        rtnObj.index = tmpItem.index;
        rtnObj.name = itemName;
        return rtnObj;
      }
    }
    for (let i = 0; i < DB.TicketItem.length; i++) {
      tmpItem = DB.TicketItem[i];
      if (tmpItem.name === itemName) {
        rtnObj.type = ItemType.TicketItem;
        rtnObj.index = tmpItem.index;
        rtnObj.name = itemName;
        return rtnObj;
      }
    }
    for (let i = 0; i < DB.MandrelItem.length; i++) {
      tmpItem = DB.MandrelItem[i];
      if (tmpItem.name === itemName) {
        rtnObj.type = ItemType.MandrelItem;
        rtnObj.index = tmpItem.index;
        rtnObj.name = itemName;
        return rtnObj;
      }
    }
    for (let i = 0; i < DB.MineralItem.length; i++) {
      tmpItem = DB.MineralItem[i];
      if (tmpItem.name === itemName) {
        rtnObj.type = ItemType.MineralItem;
        rtnObj.index = tmpItem.index;
        rtnObj.name = itemName;
        return rtnObj;
      }
    }
    return rtnObj;
  };
  let Remove = function (index) {
    let tmpPost = null;
    for (let i = PostList.length - 1; i >= 0; i--) {
      tmpPost = PostList[i];
      if (tmpPost.index === index) {
        PostList.splice(i, 1);
        return true;
      }
    }
    return false;
  };
  let RemoveID = function (id) {
    let tmpPost = null;
    for (let i = PostList.length - 1; i >= 0; i--) {
      tmpPost = PostList[i];
      if (tmpPost.id === id) {
        PostList.splice(i, 1);
        return true;
      }
    }
    return false;
  };

  return {
    getPostList: function () {
      return PostList;
    },
    getPostListID: function (id) {
      return Find(id);
    },
    itemObj: function (itemName, count) {
      let itemObj = FindItem(itemName);
      itemObj.count = Number(count);
      return itemObj;
    },
    postMessage: function (id, name, itemList, coin, message) {
      PostList.push({
        name: name,
        id: id,
        items: itemList,
        coin: coin,
        message: message,
        index: (PostList.length + 1)
      });
      write(PostFile, PostList);
    },
    removeMessage: function (index) {
      let rtn = Remove(index);
      write(PostFile, PostList);
      return rtn;
    },
    removeMessageAll: function (id) {
      let rtn = RemoveID(id);
      write(PostFile, PostList);
      return rtn;
    },
    isUserName: function (userName) {
      return FindUser(userName);
    },
    getAllUser: function () {
      UserList = read(UserFile);
      let rtnArr = [];
      for (let i = 0; i < UserList.length; i++) {
        rtnArr.push(UserList[i].name);
      }
      return rtnArr;
    }
  };
})();

Broadcast.register("SystemManager", () => {
  return eval(SystemManager = funcSystemManager());
});

//--------------------------------//

let bot = BotManager.getCurrentBot();

function onMessage(msg) {

  if (msg.room != Admin) return;

  if (msg.content == Defaulf.Prefix) {
    switch (msg.content.replace(`${Defaulf.Prefix} `, "")[0]) {
      case "컴파일":
        startComplie();
        break;
      case "시작":
        if (!BotManager.getPower("Main")) {
          BotManager.setPower("Main", true);
          msg.reply(`[ ${User.get(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템을 시작할게요!`);
        } else {
          msg.reply(`[ ${User.get(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템이 작동중이에요.`)
        }
        break;
      case "정지":
        if (BotManager.getPower("Main")) {
          BotManager.setPower("Main", false);
          msg.reply(`[ ${User.get(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템을 정지할게요!`);
        } else {
          msg.reply(`[ ${User.get(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 이미 시스템이 정지되어 있어요.`)
        }
        break;
    }
    if (msg.content.startsWith(`${Defaulf.Prefix} 공지`)) {
      let replaceMessage = msg.content.replace(`${Defaulf.Prefix} 공지`, "");

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
      bot.send(MasterRoom, [
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
    for (let i = 0; i < CompileList.length; ++i) {
      succ = BotManager.compile(CompileList[i], true);
      if (!succ) bot.send(Admin, `${CompileList[i]} Fail`);
    }
  } catch (e) {
    bot.send(Admin, `title: ${e.name} message: ${e.message}`);
    succ = false;
  }

  bot.send(Admin, "컴파일 종료");
}