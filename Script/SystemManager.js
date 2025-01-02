//SystemManager

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
  UserManager
} = require("UserManager");

let threadQueue = [];
let BackupList = Default.fileList;

(function () {
  let funcSystemManager = (function () {
    let UserFile = Default.fileList.UserList;
    let PostFile = Default.fileList.PostList;
    let ItemType = Default.ItemType;
    let DBFileList = Default.DBFileList;

    let DB = {};
    let PostList = [];
    let UserList = [];

    let file = function (path) {
      return Default.rootPath + path;
    };
    let read = function (path) {
      try {
        return JSON.parse(Default.FS.read(file(path)));
      } catch (e) {
        Log.e(`read() error --- ${e.message}`);
      }
    };
    let write = function (path, obj) {
      try {
        Default.FS.write(file(path), JSON.stringify(obj));
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
          index: (PostList.length + 1),
          name: name,
          id: id,
          items: itemList,
          coin: coin,
          message: message
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

  module.exports = {
    UserManager: UserManager()
  }

})()