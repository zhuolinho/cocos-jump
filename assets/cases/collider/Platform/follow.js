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
        }
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
    },

    initEvent() {
        response.prototype.init(this);
        this.node.on(msg.MATCHVS_JOIN_ROOM_NOTIFY, this.onEvent, this);
    },

    setFrameRate() {
        var result = engine.prototype.setFrameSync(Const.FPS);
        if (result !== 0) {
            console.warn('设置帧同步率失败,错误码:' + result);
        }
    },

    onEvent: function (event) {
        console.warn(event);
    }
});
