var msg = require("Lib/MatvhvsMessage");
var response = require("../Lib/MatchvsDemoResponse");
var Const = require('Const/Const');
var engine = require("Lib/MatchvsEngine");
var GameData = require('Global/GameData');

cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        },
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {
        // 由于需要键盘操作所以只能在 PC 才可用
        this.node.active = !cc.sys.isMobile;

        if (!this.target) {
            return;
        }
        var follow = cc.follow(this.target, cc.rect(0, 0, 2000, 2000));
        this.node.runAction(follow);

        this.initEvent();
        if (GameData.isOwner) this.setFrameRate();
        this.starList = {};
    },

    initEvent() {
        response.prototype.init(this);
        this.node.on(msg.MATCHVS_FRAME_UPDATE, this.onEvent, this);
    },

    setFrameRate() {
        var result = engine.prototype.setFrameSync(Const.FPS);
        if (result !== 0) {
            console.warn('设置帧同步率失败,错误码:' + result);
        }
    },

    onEvent: function (event) {
        var eventData = event.detail;
        if (eventData == undefined) {
            eventData = event;
        }
        switch (event.type) {
            case msg.MATCHVS_FRAME_UPDATE:
                // var rsp = event.detail;
                for (var i = 0; i < eventData.data.frameItems.length; i++) {
                    var info = eventData.data.frameItems[i];
                    if (info.srcUserID !== Const.userID) this.onNewWorkGameEvent(info);
                }
                break;
        }

        // this.newStar
    },

    onNewWorkGameEvent: function (info) {
        if (!this.starList[info.srcUserID]) {
            var newStar = cc.instantiate(this.starPrefab);
            this.node.addChild(newStar);
            this.starList[info.srcUserID] = newStar;
        }
        var cpProto = JSON.parse(info.cpProto);
        this.starList[info.srcUserID].setPosition(cc.v2(cpProto.x, cpProto.y));
    }
});
