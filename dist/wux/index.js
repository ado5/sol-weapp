"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.$wuxBackdrop=void 0;var getCtx=function(e,t){var r=(1<arguments.length&&void 0!==t?t:getCurrentPages()[getCurrentPages().length-1]).selectComponent(e);if(!r)throw new Error("无法找到对应的组件，请按文档说明使用组件");return r},$wuxBackdrop=function(e,t){return getCtx(0<arguments.length&&void 0!==e?e:"#wux-backdrop",1<arguments.length?t:void 0)};exports.$wuxBackdrop=$wuxBackdrop;