//DataBase.js

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

(function () {
  function funcDBManager() {
    let DB = {};
    let json = [{
      "index": Number,
      "itemName": String,
      "description": String,
      "price": Number,
      "upItem": String
    }]
    let DUMP = {};

    let LoadData = function () {
      DB.Message = Common.read(Default.DBFileList["Message"]);
      DB.BasicItem = Common.read(Default.DBFileList["BasicItem"]);
      DB.BadgeItem = Common.read(Default.DBFileList["BadgeItem"]);
      DB.StarsItem = Common.read(Default.DBFileList["StarsItem"]);
      DB.FoodItem = Common.read(Default.DBFileList["FoodItem"]);
      DB.TicketItem = Common.read(Default.DBFileList["TicketItem"]);
      DB.MineralItem = Common.read(Default.DBFileList["MineralItem"]);
      DB.LoanItem = Common.read(Default.DBFileList["LoanItem"]);

      DUMP.Message = new Common.DumpModule();
      DUMP.BasicItem = new Common.DumpModule();
      DUMP.BadgeItem = new Common.DumpModule();
      DUMP.StarsItem = new Common.DumpModule();
      DUMP.FoodItem = new Common.DumpModule();
      DUMP.TicketItem = new Common.DumpModule();
      DUMP.MineralItem = new Common.DumpModule();
      DUMP.LoanItem = new Common.DumpModule();
    }();

    let Find = function (type, key, value) { //데이터 조회(성능 최적화)
      let infos = DUMP[type].dumpList;
      if (value !== null) {
        for (let i = 0; i < infos.length; i++) { //캐시에서 데이터 조회
          if (infos[i][key] === value) {
            DUMP[type].resetTimeStemp(i);
            return infos[i];
          }
        }
        infos = DB[type];
        for (i = 0; i < infos.length; i++) { //캐시에 없음: 데이터베이스 조회, 캐시 업데이트
          if (infos[i][key] === value) {
            DUMP[type].addDump(infos[i]);
            return infos[i];
          }
        }
        return null;
      } else {
        let list;
        for (let i = 0; i < infos.length; i++) { //캐시에서 데이터 조회
          DUMP[type].resetTimeStemp(i);
          list.push(infos[i]);
        }
        infos = DB[type];
        for (i = 0; i < infos.length; i++) { //캐시에 없음: 데이터베이스 조회, 캐시 업데이트
          DUMP[type].addDump(infos[i]);
          list.push(infos[i]);
        }
        return list;
      }
    };
    let FindList = function (type, key, value) {
      let infos = DB[type];
      let list = [];
      if (key === "all") return infos;
      for (let i = 0; i < infos.length; i++) {
        if (infos[i][key] === value) list.push(infos[i]);
      }
      return list;
    }

    /**
     * @param {String} name 아이템 이름
     * @param {String} type 아이템 종류 ["BadgeItem","StarsItem","FoodItem","TicketItem","MandrelItem","MineralItem"]
     */
    let Dic = function (type, name) {
      let rtnStr = `[${name}의 검색 결과]\n\n`;

      if (type == "TicketItem") {
        let obj = Find("TicketItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[티켓]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")

          let tmpObj = Find("TicketItem", "itemName", obj["upItem"]);
          if (tmpObj === null) tmpList = [];
          if (tmpObj !== null) rtnStr += [
            `== 상위 티켓 ==`,
            `\t- 아이템명 : ${(tmpObj === "" ? "없음" : tmpObj["name"])}`
          ].join("\n")
        }
      }

      if (type == "BadgeItem") {
        let obj = Find("BadgeItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[닉네임]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")

          let tmpObj = Find("BadgeItem", "itemName", obj["upItem"]);
          if (tmpObj === null) tmpList = [];
          if (tmpObj !== null) rtnStr += [
            `== 상위 닉네임 ==`,
            `\t- 아이템명 : ${(tmpObj === "" ? "없음" : tmpObj["name"])}`
          ].join("\n")
        }
      }

      if (type == "StarsItem") {
        let obj = Find("StarsItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[멤버쉽]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")
        }
      }

      if (type == "FoodItem") {
        let obj = Find("FoodItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[음식]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")

          let tmpObj = Find("FoodItem", "itemName", obj["upItem"]);
          if (tmpObj === null) tmpList = [];
          if (tmpObj !== null) rtnStr += [
            `== 상위 음식 ==`,
            `\t- 아이템명 : ${(tmpObj === "" ? "없음" : tmpObj["name"])}`
          ].join("\n")
        }
      }

      if (type == "MandrelItem") {
        obj = Find("MandrelItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[곡괭이]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")

          tmpObj = Find("MandrelItem", "itemName", obj["upItem"]);
          if (tmpObj === null) tmpList = [];
          if (tmpObj !== null) rtnStr += [
            `== 상위 곡괭이 ==`,
            `\t- 아이템명 : ${(tmpObj === "" ? "없음" : tmpObj["name"])}`
          ].join("\n")
        }
      }

      if (type == "MineralItem") {
        obj = Find("MineralItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[광물]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")

          tmpObj = Find("MineralItem", "itemName", obj["upItem"]);
          if (tmpObj == null) tmpList = [];
          if (tmpObj !== null) rtnStr += [
            `== 상위 광물 ==`,
            `\t- 아이템명 : ${(tmpObj === "" ? "없음" : tmpObj["name"])}`
          ].join("\n")
        }
      }

      return rtnStr;
    };

    return {
      Search: function (type, key, value) {
        return Find(type, key, value);
      },

      Dictionary: function (name) {
        return Dic(name);
      },

      getItem: function (type, value) {
        if (Default.ItemType.includes(type)) return Find(type, "index", value);
        return null;
      },
      isItem: function (type, value) {
        return (this.getItem(type, value) !== null ? true : false);
      },
      getItemByName: function (itemName) {
        for (let type of Default.ItemType) {
          let obj = Find(type, "itemName", itemName);
          if (obj !== null) return {
            type,
            obj
          };
        }
        return {
          type: null,
          obj: null
        };
      },

      getLoanList: function () {
        return DB["LoanItem"];
      },
      getLoanByName: function (nameItem) {
        return Find("LoanItem", "nameItem", nameItem);
      },
      getLoan: function (index) {
        return Find("LoanItem", "index", index);
      }
    }
  }

  module.exports = {
    DataBase: funcDBManager()
  }


})()