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

  let LoadData = function () {
    let tmpList = Common.read(Default.fileList["RecordList"]);
    for (let i = 0; i < tmpList.length; i++) recordList.push(UserRecord(tmpList[i]));
  }();

  let Find = function (id) {
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
  }
  let Delete = function (id) {
    for (let i = 0; i < recordList.length; i++) {
      if (recordList[i].name === id) {
        recordList.splice(i, 1);
        break;
      }
    }
    Save();
  }

  let MakeJson = function () {
    let jsonArr = [];
    for (let i = 0; i < recordList.length; i++) jsonArr.push(JSON.stringify(recordList[i]));
    return jsonArr;
  }

  let CreateRecord = function (id, name, coin) {
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
  }

  let Save = function () {
    Common.write(Default.fileList["RecordList"], MakeJson());
  }

  return {
    Delete : function (id) {
      Delete(id);
    },
    newRecord : function (id, name, coin) {
      CreateRecord(id, name, coin);
    },
    
    rcdAction: function (id, actionName) {
      let rcd = Find(id);
      if (rcd === null) return;
      rcd.addAction(actionName);
      Save();
    },
  };
}