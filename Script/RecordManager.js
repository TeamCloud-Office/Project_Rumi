//RecordManager.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


// 미완성 코드
// 추후 다시 제작

Broadcast.send("Default"); //Default 불러오기
Broadcast.send("Common"); //Common 불러오기
Broadcast.send("Object"); //Object 불러오기

Broadcast.send("DataBase"); //DataBase 불러오기

function RecordManager() {
  let recordList = [];
  let recordDump = new Common.DumpModule();

  let actPropertyList = DataBase.getPropertyList("act");

  return {
    LoadData: function () {
      let tmpList = Common.read(Default.fileList["RecordList"]);
      for (let i = 0; i < tmpList.length; i++) recordList.push(UserRecord(tmpList[i]));
    },
    Find: function (id) {
      for (let i = 0; i < recordDump.dumpList.length; i++) { //recordDump에서 먼저 찾기
        if (recordDump.dumpList[i].name === id) {
          recordDump.resetTimeStemp(i);
          return recordDump.dumpList[i];
        }
      }
      for (let i = 0; i < recordList.length; i++) { //위에서 찾지 못했다면 recordList에서 찾기
        if (recordList[i].name === id) {
          recordDump.addDump(recordList[i]);
          return recordList[i];
        }
      }
      return null;
    },
    Delete: function (id) {
      for (let i = 0; i < recordList.length; i++) {
        if (recordList[i].name === id) {
          recordList.splice(i, 1);
          break;
        }
      }
      Save();
    },
    MakeJson: function () {
      let jsonArr = [];
      for (let i = 0; i < recordList.length; i++) jsonArr.push(JSON.stringify(recordList[i]));
      return jsonArr;
    },
    CreateRecord: function (name, id, coin) {
      let obj = {
        name: name,
        id: id,
        coin: coin,
        act: {
          eatfood: 0,
          sleep: 0
        },
        chatCount: 0
      };
      recordList.push(userRecord(obj));
    },
    Save: function () {
      Common.write(Default.fileList["RecordList"], this.MakeJson());
    },
    setEventListerner: function (listerner) {
      ConditionEvnet = listerner;
    },
    CheckCondition: function (type, checkidx, currCount, record) {
      let property = DataBase.getProperty(checkidx);
      let reachCount = 0; //목표값

      switch (type) {
        case 0:
          reachCount = property.count;
          break;
        case 1:
          reachCount = property.count;
          currCount = record.chatCount;
          break;
      }
      if (currCount >= reachCount) this.setEventListerner(property, record.name);
    }
  };
}