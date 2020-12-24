"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,i){return t&&_defineProperties(e.prototype,t),i&&_defineProperties(e,i),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var util=require("./util"),SAVED_FILES_KEY="savedFiles",KEY_TOTAL_SIZE="totalSize",KEY_PATH="path",KEY_TIME="time",KEY_SIZE="size",MAX_SPACE_IN_B=6291456,savedFiles={},Dowloader=function(){function e(){_classCallCheck(this,e),getApp().PAINTER_MAX_LRU_SPACE&&(MAX_SPACE_IN_B=getApp().PAINTER_MAX_LRU_SPACE),wx.getStorage({key:SAVED_FILES_KEY,success:function(e){e.data&&(savedFiles=e.data)}})}return _createClass(e,[{key:"download",value:function(o){return new Promise(function(t,i){if(o&&util.isValidUrl(o)){var n=getFile(o);n?wx.getSavedFileInfo({filePath:n[KEY_PATH],success:function(e){t(n[KEY_PATH])},fail:function(e){console.error("the file is broken, redownload it, ".concat(JSON.stringify(e))),downloadFile(o).then(function(e){t(e)},function(){i()})}}):downloadFile(o).then(function(e){t(e)},function(){i()})}else t(o)})}}]),e}();function downloadFile(a){return new Promise(function(n,o){wx.downloadFile({url:a,success:function(t){if(200!==t.statusCode)return console.error("downloadFile ".concat(a," failed res.statusCode is not 200")),void o();var i=t.tempFilePath;wx.getFileInfo({filePath:i,success:function(e){var t=e.size;doLru(t).then(function(){saveFile(a,t,i).then(function(e){n(e)})},function(){n(i)})},fail:function(e){console.error("getFileInfo ".concat(t.tempFilePath," failed, ").concat(JSON.stringify(e))),n(t.tempFilePath)}})},fail:function(e){console.error("downloadFile failed, ".concat(JSON.stringify(e)," ")),o()}})})}function saveFile(n,o,t){return new Promise(function(i,e){wx.saveFile({tempFilePath:t,success:function(e){var t=savedFiles[KEY_TOTAL_SIZE]?savedFiles[KEY_TOTAL_SIZE]:0;savedFiles[n]={},savedFiles[n][KEY_PATH]=e.savedFilePath,savedFiles[n][KEY_TIME]=(new Date).getTime(),savedFiles[n][KEY_SIZE]=o,savedFiles.totalSize=o+t,wx.setStorage({key:SAVED_FILES_KEY,data:savedFiles}),i(e.savedFilePath)},fail:function(e){console.error("saveFile ".concat(n," failed, then we delete all files, ").concat(JSON.stringify(e))),i(t),reset()}})})}function reset(){wx.removeStorage({key:SAVED_FILES_KEY,success:function(){wx.getSavedFileList({success:function(e){removeFiles(e.fileList)},fail:function(e){console.error("getSavedFileList failed, ".concat(JSON.stringify(e)))}})}})}function doLru(d){return new Promise(function(e,t){var i=savedFiles[KEY_TOTAL_SIZE]?savedFiles[KEY_TOTAL_SIZE]:0;if(d+i<=MAX_SPACE_IN_B)e();else{var n=[],o=JSON.parse(JSON.stringify(savedFiles));delete o[KEY_TOTAL_SIZE];var a=Object.keys(o).sort(function(e,t){return o[e][KEY_TIME]-o[t][KEY_TIME]}),r=!0,l=!1,s=void 0;try{for(var c,f=a[Symbol.iterator]();!(r=(c=f.next()).done);r=!0){var u=c.value;if(i-=savedFiles[u].size,n.push(savedFiles[u][KEY_PATH]),delete savedFiles[u],i+d<MAX_SPACE_IN_B)break}}catch(e){l=!0,s=e}finally{try{r||null==f.return||f.return()}finally{if(l)throw s}}savedFiles.totalSize=i,wx.setStorage({key:SAVED_FILES_KEY,data:savedFiles,success:function(){0<n.length&&removeFiles(n),e()},fail:function(e){console.error("doLru setStorage failed, ".concat(JSON.stringify(e))),t()}})}})}function removeFiles(e){var t=!0,i=!1,n=void 0;try{for(var o,a=function(){var t=o.value,e=t;"object"===_typeof(t)&&(e=t.filePath),wx.removeSavedFile({filePath:e,fail:function(e){console.error("removeSavedFile ".concat(t," failed, ").concat(JSON.stringify(e)))}})},r=e[Symbol.iterator]();!(t=(o=r.next()).done);t=!0)a()}catch(e){i=!0,n=e}finally{try{t||null==r.return||r.return()}finally{if(i)throw n}}}function getFile(e){if(savedFiles[e])return savedFiles[e].time=(new Date).getTime(),wx.setStorage({key:SAVED_FILES_KEY,data:savedFiles}),savedFiles[e]}exports.default=Dowloader;