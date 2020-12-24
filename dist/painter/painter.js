"use strict";var _pen=_interopRequireDefault(require("./lib/pen")),_downloader=_interopRequireDefault(require("./lib/downloader"));function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}var util=require("./lib/util"),downloader=new _downloader.default,MAX_PAINT_COUNT=5;function setStringPrototype(a,o){String.prototype.toPx=function(t){var e=(t?/^-?[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g:/^[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g).exec(this);if(!this||!e)return console.error("The size: ".concat(this," is illegal")),0;var n=e[2],r=parseFloat(this),i=0;return"rpx"===n?i=Math.round(r*a*(o||1)):"px"===n&&(i=Math.round(r*(o||1))),i}}Component({canvasWidthInPx:0,canvasHeightInPx:0,paintCount:0,properties:{customStyle:{type:String},palette:{type:Object,observer:function(t,e){this.isNeedRefresh(t,e)&&(this.paintCount=0,this.startPaint())}},widthPixels:{type:Number,value:0},dirty:{type:Boolean,value:!1}},data:{picURL:"",showCanvas:!0,painterStyle:""},methods:{isEmpty:function(t){for(var e in t)return!1;return!0},isNeedRefresh:function(t,e){return!(!t||this.isEmpty(t)||this.data.dirty&&util.equal(t,e))},startPaint:function(){var i=this;if(!this.isEmpty(this.properties.palette)){if(!getApp().systemInfo||!getApp().systemInfo.screenWidth)try{getApp().systemInfo=wx.getSystemInfoSync()}catch(t){var e="Painter get system info failed, ".concat(JSON.stringify(t));return that.triggerEvent("imgErr",{error:e}),void console.error(e)}var a=getApp().systemInfo.screenWidth/750;setStringPrototype(a,1),this.downloadImages().then(function(t){var e=t.width,n=t.height;if(e&&n){i.canvasWidthInPx=e.toPx(),i.properties.widthPixels&&(setStringPrototype(a,i.properties.widthPixels/i.canvasWidthInPx),i.canvasWidthInPx=i.properties.widthPixels),i.canvasHeightInPx=n.toPx(),i.setData({painterStyle:"width:".concat(i.canvasWidthInPx,"px;height:").concat(i.canvasHeightInPx,"px;")});var r=wx.createCanvasContext("k-canvas",i);new _pen.default(r,t).paint(function(){i.saveImgToLocal()})}else console.error("You should set width and height correctly for painter, width: ".concat(e,", height: ").concat(n))})}},downloadImages:function(){var h=this;return new Promise(function(n,t){var r=0,i=0,a=JSON.parse(JSON.stringify(h.properties.palette));if(a.background&&(r++,downloader.download(a.background).then(function(t){a.background=t,r===++i&&n(a)},function(){r===++i&&n(a)})),a.views){var e=!0,o=!1,s=void 0;try{for(var c,u=function(){var e=c.value;e&&"image"===e.type&&e.url&&(r++,downloader.download(e.url).then(function(t){e.url=t,wx.getImageInfo({src:e.url,success:function(t){e.sWidth=t.width,e.sHeight=t.height},fail:function(t){e.url="",console.error("getImageInfo ".concat(e.url," failed, ").concat(JSON.stringify(t)))},complete:function(){r===++i&&n(a)}})},function(){r===++i&&n(a)}))},l=a.views[Symbol.iterator]();!(e=(c=l.next()).done);e=!0)u()}catch(t){o=!0,s=t}finally{try{e||null==l.return||l.return()}finally{if(o)throw s}}}0===r&&n(a)})},saveImgToLocal:function(){var t=this,e=this;setTimeout(function(){wx.canvasToTempFilePath({canvasId:"k-canvas",success:function(t){e.getImageInfo(t.tempFilePath)},fail:function(t){console.error("canvasToTempFilePath failed, ".concat(JSON.stringify(t))),e.triggerEvent("imgErr",{error:t})}},t)},300)},getImageInfo:function(n){var r=this;wx.getImageInfo({src:n,success:function(t){if(r.paintCount>MAX_PAINT_COUNT){var e="The result is always fault, even we tried ".concat(MAX_PAINT_COUNT," times");return console.error(e),void r.triggerEvent("imgErr",{error:e})}Math.abs((t.width*r.canvasHeightInPx-r.canvasWidthInPx*t.height)/(t.height*r.canvasHeightInPx))<.01?r.triggerEvent("imgOK",{path:n}):r.startPaint(),r.paintCount++},fail:function(t){console.error("getImageInfo failed, ".concat(JSON.stringify(t))),r.triggerEvent("imgErr",{error:t})}})}}});