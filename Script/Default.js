//Defalf.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


/////////////////
// (string) msg.content: 메시지의 내용
// (string) msg.room: 메시지를 받은 방 이름
// (User) msg.author: 메시지 전송자
// (string) msg.author.name: 메시지 전송자 이름
// (Image) msg.author.avatar: 메시지 전송자 프로필 사진
// (string) msg.author.avatar.getBase64()
// (string | null) msg.author.userHash: 사용자의 고유 id
// (boolean) msg.isGroupChat: 단체/오픈채팅 여부
// (boolean) msg.isDebugRoom: 디버그룸에서 받은 메시지일 시 true
// (string) msg.packageName: 메시지를 받은 메신저의 패키지명
// (void) msg.reply(string): 답장하기
// (boolean) msg.isMention: 메세지 맨션 포함 여부
// (bigint) msg.logId: 각 메세지의 고유 id
// (bigint) msg.channelId: 각 방의 고유 id
/////////////////

(function () {
  function funcDefault() {
    return {
      Version: "1.0.0", //버전
      defLog: true, //로그
      More: "\n200b".repeat(500), //더보기
      FS: FileStream, //FileStream
      delay: java.lang.Thread.sleep,

      RunTime: false, //RunTime 출력 유무 설정
      SendErrorMessage: true, //오류 전송 여부
      CommandDelay: 60 * 1000, //명령어당 대기 시간

      MainRoomName: "TeamCloud 개발방", //메인방 이름
      CommandPrefix: "루미야", //접두사 설정
      DumpTimeOut: 5 * 60 * 1000,

      DefaultCoin: 50000, //초기 기본 Coin
      BettingCoinLimit: 1000000, //최대 도박 한도
      MaxRemittance: 500000, //최대 송금 한도
      MiningDefaultSpeed: 60 * 1000, //채굴 시간 (ms)
      BackupTime: 5, // 60// 1000, //자동 백업 시간
      FavorabilityMaxCount: 99, //최대 호감도 횟수
      Fullness: 100, //포만감
      Hunger: 2, //허기(-)

      rootPath: "sdcard/TeamCloud/",
      fileList: {
        UserList: "Rumi_Data/Users/UserList.json",
        AttenList: "Rumi_Data/Game/AttenList.json",
        SetList: "Rumi_Data/ETC/SetList.json",
        StockList: "Rumi_Data/Game/StockList.json",
        PostList: "Rumi_Data/Users/PostList.json",
        // RecordList: "Rumi_Data/Records/RecordList.json"
      },

      DBFileList: {
        Message: "Rumi_Data/DB/Message.json",
        BadgeItem: "Rumi_Data/DB/BadgeItem.json",
        StarsItem: "Rumi_Data/DB/StarsItem.json",
        FoodItem: "Rumi_Data/DB/FoodItem.json",
        TicketItem: "Rumi_Data/DB/TicketItem.json",
        MandrelItem: "Rumi_Data/DB/MandrelItem.json",
        MineralItem: "Rumi_Data/DB/MineralItem.json"
      },

      ItemType: {
        BadgeItem: "BadgeItem", //배지
        StarsItem: "StarsItem", //멤버쉽
        FoodItem: "FoodItem", //음식
        TicketItem: "TicketItem", //사용권
        MandrelItem: "MandrelItem", //곡괭이
        MineralItem: "MineralItem" //광석
      }
    }
  }


  module.exports = {
    Default: funcDefault()
  }


})()