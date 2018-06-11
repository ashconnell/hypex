!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("mobx")):"function"==typeof define&&define.amd?define(["mobx"],t):"object"==typeof exports?exports.mobxQuantum=t(require("mobx")):e.mobxQuantum=t(e.mobx)}(window,function(e){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=50)}([function(t,n){t.exports=e},function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e}},function(e,t,n){var r=n(12),o=n(48),i=n(47),u="[object Null]",c="[object Undefined]",a=r?r.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?c:u:a&&a in Object(e)?o(e):i(e)}},function(e,t,n){e.exports=n(43)},function(e,t){var n=Array.isArray;e.exports=n},function(e,t){e.exports=function(e,t){var n="000000000"+e;return n.substr(n.length-t)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Types=void 0;var r,o=n(3),i=(r=o)&&r.__esModule?r:{default:r};var u=t.Types={ID:"id",STRING:"string",NUMBER:"number",BOOLEAN:"boolean",DATE:"date",ARRAY:"array",ENUM:"enum",MODEL:"model",MIXED:"mixed",VIRTUAL:"virtual"},c=function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.name=t,this.default=n.default,this.enum=n.enum,this.schema=n.schema,this.of=n.of,this.value=n.value},a={};(0,i.default)(u,function(e){a[e]=function(t){return new c(e,t)}}),t.default=a},function(e,t,n){var r=n(13),o=n(8);e.exports=function(e){return null!=e&&o(e.length)&&!r(e)}},function(e,t){var n=9007199254740991;e.exports=function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=n}},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(this,n(49))},function(e,t,n){var r=n(10),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();e.exports=i},function(e,t,n){var r=n(11).Symbol;e.exports=r},function(e,t,n){var r=n(2),o=n(46),i="[object AsyncFunction]",u="[object Function]",c="[object GeneratorFunction]",a="[object Proxy]";e.exports=function(e){if(!o(e))return!1;var t=r(e);return t==u||t==c||t==i||t==a}},function(e,t,n){"use strict";n.r(t),n.d(t,"PENDING",function(){return f}),n.d(t,"FULFILLED",function(){return l}),n.d(t,"REJECTED",function(){return p}),n.d(t,"fromPromise",function(){return b}),n.d(t,"isPromiseBasedObservable",function(){return v}),n.d(t,"moveItem",function(){return y}),n.d(t,"lazyObservable",function(){return h}),n.d(t,"fromResource",function(){return j}),n.d(t,"toStream",function(){return w}),n.d(t,"fromStream",function(){return _}),n.d(t,"ViewModel",function(){return A}),n.d(t,"createViewModel",function(){return E}),n.d(t,"whenWithTimeout",function(){return M}),n.d(t,"keepAlive",function(){return D}),n.d(t,"queueProcessor",function(){return I}),n.d(t,"chunkProcessor",function(){return S}),n.d(t,"now",function(){return N}),n.d(t,"NOOP",function(){return o}),n.d(t,"IDENTITY",function(){return i}),n.d(t,"invariant",function(){return u}),n.d(t,"deprecated",function(){return a}),n.d(t,"addHiddenProp",function(){return s}),n.d(t,"asyncAction",function(){return V}),n.d(t,"whenAsync",function(){return C}),n.d(t,"expr",function(){return L}),n.d(t,"createTransformer",function(){return B});var r=n(0),o=function(){},i=function(e){return e};function u(e,t){if(void 0===t&&(t="Illegal state"),!e)throw new Error("[mobx-utils] "+t)}var c=[];function a(e){-1===c.indexOf(e)&&(c.push(e),console.error("[mobx-utils] Deprecated: "+e))}function s(e,t,n){Object.defineProperty(e,t,{enumerable:!1,writable:!0,configurable:!0,value:n})}var f="pending",l="fulfilled",p="rejected";function d(e){switch(this.state){case f:return e.pending&&e.pending();case p:return e.rejected&&e.rejected(this.value);case l:return e.fulfilled&&e.fulfilled(this.value)}}var b=function(e){if(u(1===arguments.length,"fromPromise expects exactly one argument"),u("function"==typeof e||"object"==typeof e&&e&&"function"==typeof e.then,"Please pass a promise or function to fromPromise"),!0===e.isPromiseBasedObservable)return e;"function"==typeof e&&(e=new Promise(e));var t=e;return e.then(Object(r.action)("observableFromPromise-resolve",function(e){t.value=e,t.state=l}),Object(r.action)("observableFromPromise-reject",function(e){t.value=e,t.state=p})),t.isPromiseBasedObservable=!0,t.case=d,Object(r.extendObservable)(t,{value:void 0,state:f},{},{deep:!1}),t};function v(e){return e&&!0===e.isPromiseBasedObservable}function y(e,t,n){if(m(e,t),m(e,n),t!==n){var o,i=e[r.$mobx].values;return o=t<n?i.slice(0,t).concat(i.slice(t+1,n+1),[i[t]],i.slice(n+1)):i.slice(0,n).concat([i[t]],i.slice(n,t),i.slice(t+1)),e.replace(o),e}}function m(e,t){if(t<0)throw new Error("[mobx.array] Index out of bounds: "+t+" is negative");var n=e[r.$mobx].values.length;if(t>=n)throw new Error("[mobx.array] Index out of bounds: "+t+" is not smaller than "+n)}function h(e,t){void 0===t&&(t=void 0);var n=!1,o=r.observable.box(t,{deep:!1}),i=function(){return n||(n=!0,e(function(e){Object(r._allowStateChanges)(!0,function(){o.set(e)})})),o.get()},u=Object(r.action)("lazyObservable-reset",function(){return o.set(t),o.get()});return{current:i,refresh:function(){return n?(n=!1,i()):o.get()},reset:function(){return u()}}}function j(e,t,n){void 0===t&&(t=o),void 0===n&&(n=void 0);var i=!1,c=!1,a=n,s=function(){i&&(i=!1,t())},f=Object(r.createAtom)("ResourceBasedObservable",function(){u(!i&&!c),i=!0,e(function(e){Object(r._allowStateChanges)(!0,function(){a=e,f.reportChanged()})})},s);return{current:function(){return u(!c,"subscribingObservable has already been disposed"),f.reportObserved()||i||console.warn("Called `get` of an subscribingObservable outside a reaction. Current value will be returned but no new subscription has started"),a},dispose:function(){c=!0,s()},isAlive:function(){return i}}}b.reject=Object(r.action)("fromPromise.reject",function(e){var t=b(Promise.reject(e));return t.state=p,t.value=e,t}),b.resolve=Object(r.action)("fromPromise.resolve",function(e){void 0===e&&(e=void 0);var t=b(Promise.resolve(e));return t.state=l,t.value=e,t});var O=function(e,t,n,r){var o,i=arguments.length,u=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)u=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(u=(i<3?o(u):i>3?o(t,n,u):o(t,n))||u);return i>3&&u&&Object.defineProperty(t,n,u),u};function g(){return this}function w(e,t){var n;void 0===t&&(t=!1);var o=Object(r.computed)(e);return(n={subscribe:function(e){return{unsubscribe:o.observe("function"==typeof e?function(t){var n=t.newValue;return e(n)}:function(t){var n=t.newValue;return e.next(n)},t)}}})["function"==typeof Symbol&&Symbol.observable||"@@observable"]=g,n}var x=function(){function e(e,t){var n=this;this.current=void 0,Object(r.runInAction)(function(){n.current=t,n.subscription=e.subscribe(n)})}return e.prototype.dispose=function(){this.subscription&&this.subscription.unsubscribe()},e.prototype.next=function(e){this.current=e},e.prototype.complete=function(){this.dispose()},e.prototype.error=function(e){this.current=e,this.dispose()},O([r.observable.ref],e.prototype,"current",void 0),O([r.action.bound],e.prototype,"next",null),O([r.action.bound],e.prototype,"complete",null),O([r.action.bound],e.prototype,"error",null),e}();function _(e,t){return void 0===t&&(t=void 0),new x(e,t)}var T=function(e,t,n,r){var o,i=arguments.length,u=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)u=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(u=(i<3?o(u):i>3?o(t,n,u):o(t,n))||u);return i>3&&u&&Object.defineProperty(t,n,u),u},P=["model","reset","submit","isDirty","isPropertyDirty","resetProperty"],A=function(){function e(e){var t=this;this.model=e,this.localValues=r.observable.map({}),this.localComputedValues=r.observable.map({}),this.isPropertyDirty=function(e){return t.localValues.has(e)},u(Object(r.isObservableObject)(e),"createViewModel expects an observable object"),Object.getOwnPropertyNames(e).forEach(function(n){if(n!==r.$mobx&&"__mobxDidRunLazyInitializers"!==n){if(u(-1===P.indexOf(n),"The propertyname "+n+" is reserved and cannot be used with viewModels"),Object(r.isComputedProp)(e,n)){var o=Object(r._getAdministration)(e,n).derivation;t.localComputedValues.set(n,Object(r.computed)(o.bind(t)))}Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:function(){return Object(r.isComputedProp)(e,n)?t.localComputedValues.get(n).get():t.isPropertyDirty(n)?t.localValues.get(n):t.model[n]},set:Object(r.action)(function(e){(t.isPropertyDirty(n)||e!==t.model[n])&&t.localValues.set(n,e)})})}})}return Object.defineProperty(e.prototype,"isDirty",{get:function(){return this.localValues.size>0},enumerable:!0,configurable:!0}),e.prototype.submit=function(){var e=this;Object(r.keys)(this.localValues).forEach(function(t){var n=e.localValues.get(t),o=e.model[t];Object(r.isObservableArray)(o)?o.replace(n):Object(r.isObservableMap)(o)?(o.clear(),o.merge(n)):Object(r.isComputed)(n)||(e.model[t]=n)}),this.localValues.clear()},e.prototype.reset=function(){this.localValues.clear()},e.prototype.resetProperty=function(e){this.localValues.delete(e)},T([r.computed],e.prototype,"isDirty",null),T([r.action.bound],e.prototype,"submit",null),T([r.action.bound],e.prototype,"reset",null),T([r.action.bound],e.prototype,"resetProperty",null),e}();function E(e){return new A(e)}function M(e,t,n,o){return void 0===n&&(n=1e4),void 0===o&&(o=function(){}),a("whenWithTimeout is deprecated, use mobx.when with timeout option instead"),Object(r.when)(e,t,{timeout:n,onError:o})}function D(e,t){var n=Object(r.getAtom)(e,t);if(!n)throw new Error("No computed provided, please provide an object created with `computed(() => expr)` or an object + property name");return n.observe(function(){})}function I(e,t,n){if(void 0===n&&(n=0),!Object(r.isObservableArray)(e))throw new Error("Expected observable array as first argument");Object(r.isAction)(t)||(t=Object(r.action)("queueProcessor",t));var o=function(){var n=e.slice(0);Object(r.runInAction)(function(){return e.splice(0)}),n.forEach(t)};return n>0?Object(r.autorun)(o,{delay:n}):Object(r.autorun)(o)}function S(e,t,n,o){if(void 0===n&&(n=0),void 0===o&&(o=0),!Object(r.isObservableArray)(e))throw new Error("Expected observable array as first argument");Object(r.isAction)(t)||(t=Object(r.action)("chunkProcessor",t));var i=function(){for(var n=function(){var n=0===o?e.length:Math.min(e.length,o),i=e.slice(0,n);Object(r.runInAction)(function(){return e.splice(0,n)}),t(i)};e.length>0;)n()};return n>0?Object(r.autorun)(i,{delay:n}):Object(r.autorun)(i)}var R={};function N(e){return void 0===e&&(e=1e3),Object(r._isComputingDerivation)()?(R[e]||(R[e]="number"==typeof e?function(e){var t;return j(function(n){t=setInterval(function(){return n(Date.now())},e)},function(){clearInterval(t)},Date.now())}(e):t=j(function(e){!function n(){window.requestAnimationFrame(function(){e(Date.now()),t.isAlive()&&n()})}()},function(){},Date.now())),R[e].current()):Date.now();var t}var k=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e};function V(e,t){if("string"==typeof arguments[1]){var n=arguments[1],o=arguments[2];return o&&o.value?Object.assign({},o,{value:Object(r.flow)(o.value)}):Object.assign({},o,{set:function(e){Object.defineProperty(this,n,k({},o,{value:Object(r.flow)(e)}))}})}var i="string"==typeof e?t:e;return a("asyncAction is deprecated. use mobx.flow instead"),Object(r.flow)(i)}function C(e,t){return void 0===t&&(t=0),a("whenAsync is deprecated, use mobx.when without effect instead"),Object(r.when)(e,{timeout:t})}function L(e){return Object(r._isComputingDerivation)()||console.warn("'expr' should only be used inside other reactive functions."),Object(r.computed)(e).get()}var U=0;function B(e,t){u("function"==typeof e&&e.length<2,"createTransformer expects a function that accepts one argument");var n={};return function(o){var i,u,c,a,f,l=function(e){if("string"==typeof e||"number"==typeof e)return e;if(null===e||"object"!=typeof e)throw new Error("[mobx-utils] transform expected an object, string or number, got: "+e);var t=e.$transformId;void 0===t&&(t=++U,s(e,"$transformId",t));return t}(o),p=n[l];return p?p.get():(p=n[l]=(i=l,u=o,a=Object(r.computed)(function(){return c=e(u)},{name:"Transformer-"+e.name+"-"+i}),f=Object(r.onBecomeUnobserved)(a,function(){delete n[i],f(),t&&t(c,u)}),a)).get()}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.toJS=t.serialize=void 0;var r,o=n(3),i=(r=o)&&r.__esModule?r:{default:r},u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=n(0),a=n(6),s=n(14);var f=(0,s.createTransformer)(function(e){var t={};return e._isStore||(t._type=e._schema.name,t._id=e._id),(0,i.default)(e._schema.props,function(n,r){var o=e[r];if(o)switch(n.name){case a.Types.ID:case a.Types.STRING:case a.Types.NUMBER:case a.Types.BOOLEAN:case a.Types.DATE:case a.Types.ENUM:case a.Types.MIXED:t[r]=o;break;case a.Types.ARRAY:n.of.name===a.Types.MODEL?t[r]=(0,c.values)(e._ids[r]):t[r]=(0,c.values)(o);break;case a.Types.MODEL:t[r]=e._ids[r];break;case a.Types.VIRTUAL:}}),e._isStore&&(t._models={},(0,i.default)(e._models,function(e,n){t._models[n]=f(e)})),t}),l=(0,s.createTransformer)(function(e){var t={};return(0,i.default)(e._schema.props,function(n,r){var o=e[r];if(o)switch(n.name){case a.Types.ID:case a.Types.STRING:case a.Types.NUMBER:case a.Types.BOOLEAN:case a.Types.DATE:case a.Types.ENUM:t[r]=o;break;case a.Types.MIXED:t[r]=u({},o);break;case a.Types.ARRAY:n.of.name===a.Types.MODEL?t[r]=e._ids[r].map(function(t){return l(e._store.get(t))}):t[r]=(0,c.values)(o);break;case a.Types.MODEL:t[r]=l(e._store.get(e._ids[r]));break;case a.Types.VIRTUAL:}}),t});t.serialize=f,t.toJS=l},function(e,t,n){var r=n(5),o="object"==typeof window?window:self,i=Object.keys(o).length,u=r(((navigator.mimeTypes?navigator.mimeTypes.length:0)+navigator.userAgent.length).toString(36)+i.toString(36),4);e.exports=function(){return u}},function(e,t,n){var r=n(16),o=n(5),i=0,u=4,c=36,a=Math.pow(c,u);function s(){return o((Math.random()*a<<0).toString(c),u)}function f(){return i=i<a?i:0,++i-1}function l(){return"c"+(new Date).getTime().toString(c)+o(f().toString(c),u)+r()+(s()+s())}l.slug=function(){var e=(new Date).getTime().toString(36),t=f().toString(36).slice(-4),n=r().slice(0,1)+r().slice(-1),o=s().slice(-2);return e.slice(-2)+t+n+o},l.fingerprint=r,e.exports=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0);Object.defineProperty(t,"flow",{enumerable:!0,get:function(){return r.flow}});t.delay=function(e){return new Promise(function(t,n){setTimeout(t,e)})}},function(e,t){e.exports=function(e){return e}},function(e,t,n){var r=n(19);e.exports=function(e){return"function"==typeof e?e:r}},function(e,t,n){var r=n(7);e.exports=function(e,t){return function(n,o){if(null==n)return n;if(!r(n))return e(n,o);for(var i=n.length,u=t?i:-1,c=Object(n);(t?u--:++u<i)&&!1!==o(c[u],u,c););return n}}},function(e,t){e.exports=function(e,t){return function(n){return e(t(n))}}},function(e,t,n){var r=n(22)(Object.keys,Object);e.exports=r},function(e,t){var n=Object.prototype;e.exports=function(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||n)}},function(e,t,n){var r=n(24),o=n(23),i=Object.prototype.hasOwnProperty;e.exports=function(e){if(!r(e))return o(e);var t=[];for(var n in Object(e))i.call(e,n)&&"constructor"!=n&&t.push(n);return t}},function(e,t,n){(function(e){var r=n(10),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,u=i&&i.exports===o&&r.process,c=function(){try{var e=i&&i.require&&i.require("util").types;return e||u&&u.binding&&u.binding("util")}catch(e){}}();e.exports=c}).call(this,n(9)(e))},function(e,t){e.exports=function(e){return function(t){return e(t)}}},function(e,t,n){var r=n(2),o=n(8),i=n(1),u={};u["[object Float32Array]"]=u["[object Float64Array]"]=u["[object Int8Array]"]=u["[object Int16Array]"]=u["[object Int32Array]"]=u["[object Uint8Array]"]=u["[object Uint8ClampedArray]"]=u["[object Uint16Array]"]=u["[object Uint32Array]"]=!0,u["[object Arguments]"]=u["[object Array]"]=u["[object ArrayBuffer]"]=u["[object Boolean]"]=u["[object DataView]"]=u["[object Date]"]=u["[object Error]"]=u["[object Function]"]=u["[object Map]"]=u["[object Number]"]=u["[object Object]"]=u["[object RegExp]"]=u["[object Set]"]=u["[object String]"]=u["[object WeakMap]"]=!1,e.exports=function(e){return i(e)&&o(e.length)&&!!u[r(e)]}},function(e,t,n){var r=n(28),o=n(27),i=n(26),u=i&&i.isTypedArray,c=u?o(u):r;e.exports=c},function(e,t){var n=9007199254740991,r=/^(?:0|[1-9]\d*)$/;e.exports=function(e,t){var o=typeof e;return!!(t=null==t?n:t)&&("number"==o||"symbol"!=o&&r.test(e))&&e>-1&&e%1==0&&e<t}},function(e,t){e.exports=function(){return!1}},function(e,t,n){(function(e){var r=n(11),o=n(31),i="object"==typeof t&&t&&!t.nodeType&&t,u=i&&"object"==typeof e&&e&&!e.nodeType&&e,c=u&&u.exports===i?r.Buffer:void 0,a=(c?c.isBuffer:void 0)||o;e.exports=a}).call(this,n(9)(e))},function(e,t,n){var r=n(2),o=n(1),i="[object Arguments]";e.exports=function(e){return o(e)&&r(e)==i}},function(e,t,n){var r=n(33),o=n(1),i=Object.prototype,u=i.hasOwnProperty,c=i.propertyIsEnumerable,a=r(function(){return arguments}())?r:function(e){return o(e)&&u.call(e,"callee")&&!c.call(e,"callee")};e.exports=a},function(e,t){e.exports=function(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}},function(e,t,n){var r=n(35),o=n(34),i=n(4),u=n(32),c=n(30),a=n(29),s=Object.prototype.hasOwnProperty;e.exports=function(e,t){var n=i(e),f=!n&&o(e),l=!n&&!f&&u(e),p=!n&&!f&&!l&&a(e),d=n||f||l||p,b=d?r(e.length,String):[],v=b.length;for(var y in e)!t&&!s.call(e,y)||d&&("length"==y||l&&("offset"==y||"parent"==y)||p&&("buffer"==y||"byteLength"==y||"byteOffset"==y)||c(y,v))||b.push(y);return b}},function(e,t,n){var r=n(36),o=n(25),i=n(7);e.exports=function(e){return i(e)?r(e):o(e)}},function(e,t){e.exports=function(e){return function(t,n,r){for(var o=-1,i=Object(t),u=r(t),c=u.length;c--;){var a=u[e?c:++o];if(!1===n(i[a],a,i))break}return t}}},function(e,t,n){var r=n(38)();e.exports=r},function(e,t,n){var r=n(39),o=n(37);e.exports=function(e,t){return e&&r(e,t,o)}},function(e,t,n){var r=n(40),o=n(21)(r);e.exports=o},function(e,t){e.exports=function(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&!1!==t(e[n],n,e););return e}},function(e,t,n){var r=n(42),o=n(41),i=n(20),u=n(4);e.exports=function(e,t){return(u(e)?r:o)(e,i(t))}},function(e,t,n){var r=n(2),o=n(4),i=n(1),u="[object String]";e.exports=function(e){return"string"==typeof e||!o(e)&&i(e)&&r(e)==u}},function(e,t,n){var r=n(2),o=n(1),i="[object Number]";e.exports=function(e){return"number"==typeof e||o(e)&&r(e)==i}},function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},function(e,t){var n=Object.prototype.toString;e.exports=function(e){return n.call(e)}},function(e,t,n){var r=n(12),o=Object.prototype,i=o.hasOwnProperty,u=o.toString,c=r?r.toStringTag:void 0;e.exports=function(e){var t=i.call(e,c),n=e[c];try{e[c]=void 0;var r=!0}catch(e){}var o=u.call(e);return r&&(t?e[c]=n:delete e[c]),o}},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.types=void 0;var r=d(n(13)),o=d(n(45)),i=d(n(44)),u=d(n(3)),c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(6);Object.defineProperty(t,"types",{enumerable:!0,get:function(){return d(a).default}});var s=n(18);Object.keys(s).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return s[e]}})}),t.createStore=function(e,t){var n=t.snapshot,s=t.onChange,d=t.actions;(0,r.default)(n)&&(n=n());console.time("[quantum] built schemas");var y=function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(n[t.name])return;(0,u.default)(t.props,function(e,t){(0,r.default)(e.schema)&&(e.schema=e.schema()),e.of&&(0,r.default)(e.of.schema)&&(e.of.schema=e.of.schema())});n[t.name]=t;(0,u.default)(t.props,function(t,r){t.name===a.Types.MODEL&&e(t.schema,n),t.name===a.Types.ARRAY&&t.of.name===a.Types.MODEL&&e(t.of.schema,n)});return n}(e);console.timeEnd("[quantum] built schemas"),console.time("[quantum] built models"),(0,u.default)(y,function(e){return function(e,t){if(e.Model)return;var n=function(){function n(t){var r=this,o=t.store,i=t.data,c=t.onChange,a=t.actions;v(this,n),this._schema=e,this._interceptors={},this._ids={},this._models={},i||(i={}),this._isStore=!o,this._store=o||this,this._isStore&&(0,u.default)(a,function(e,t){(0,f.extendObservable)(r,b({},t,function(){return e(r).apply(void 0,arguments)}),b({},t,f.action))}),this.set(i),this._store.register(this),this._isStore&&(0,f.autorun)(function(){console.time("onChange");var e=(0,p.serialize)(r),t=(0,p.toJS)(r);console.timeEnd("onChange"),c&&c({snapshot:e,js:t})})}return c(n,[{key:"set",value:function(e){var n=this;this._isStore&&(0,u.default)(e._models,function(e,r){var o=t[e._type],i=new o.Model({store:n,data:e});n._models[i._id]=i}),(0,u.default)(this._schema.props,function(t,o){var i=(0,r.default)(t.default)?t.default():t.default,u=e[o]||i;switch(n._interceptors[o]&&n._interceptors[o](),t.name){case a.Types.ID:n._interceptors[o]=(0,f.intercept)(n,o,function(e){return n._id=e.newValue||l.default.slug(),e}),n[o]=u;break;case a.Types.STRING:case a.Types.NUMBER:case a.Types.BOOLEAN:case a.Types.DATE:case a.Types.ENUM:case a.Types.MIXED:case a.Types.ARRAY:case a.Types.MODEL:n[o]=u}}),this._isStore||this._id||(this._id=e._id||l.default.slug())}},{key:"register",value:function(e){if(!this._isStore)throw new Error("must register on a store");e!==this&&(this._models[e._id]=e)}},{key:"resolveId",value:function(e,t){var n=this._store;if(!t)return null;if((0,i.default)(t)||(0,o.default)(t))return t;if(t instanceof e.Model)return t._id;var r=t[e.idKey];if(!r){var u=new e.Model({store:n,data:t});return n._models[u._id]=u,u._id}var c=n._models[r];return c||(c=new e.Model({store:n,data:t}),n._models[c._id]=c),c._id}},{key:"get",value:function(e){var t=this._store,n=t._models[e];return n||e}}]),n}();Object.defineProperty(n,"name",{value:e.name,writable:!1}),(0,f.decorate)(n,{_id:f.observable,_ids:f.observable,_models:f.observable}),e.Model=n,(0,u.default)(e.props,function(e,t){switch(e.name){case a.Types.ID:case a.Types.STRING:case a.Types.NUMBER:case a.Types.BOOLEAN:case a.Types.DATE:case a.Types.ENUM:case a.Types.MIXED:(0,f.decorate)(n,b({},t,f.observable));break;case a.Types.ARRAY:Object.defineProperty(n.prototype,t,{enumerable:!0,configurable:!0,set:function(n){var r=this;if(n){var o=n.map(function(t){return r.resolveId(e.of.schema,t)});this._ids[t]=o}else this._ids[t]=null},get:function(){var n=this,r=this._ids[t];if(!r)return null;r=(0,f.observable)(r.map(function(e){return n.get(e)}));var o=t+"Val";return this._interceptors[o]&&this._interceptors[o](),this._interceptors[o]=(0,f.intercept)(r,function(r){var o;switch(r.type){case"splice":var i=r.added.map(function(t){return n.resolveId(e.of.schema,t)});(o=n._ids[t]).splice.apply(o,[r.index,r.removedCount].concat(function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(i)))}return r}),r}}),(0,f.decorate)(n,b({},t,f.computed));break;case a.Types.MODEL:Object.defineProperty(n.prototype,t,{enumerable:!0,configurable:!0,set:function(n){if(n){var r=this.resolveId(e.schema,n);this._ids[t]=r}else this._ids[t]=null},get:function(){var e=this._ids[t];return this.get(e)}}),(0,f.decorate)(n,b({},t,f.computed));break;case a.Types.VIRTUAL:Object.defineProperty(n.prototype,t,{enumerable:!0,configurable:!0,get:e.value}),(0,f.decorate)(n,b({},t,f.computed))}})}(e,y)}),console.timeEnd("[quantum] built models"),console.time("[quantum] built store");var m=new e.Model({data:n,onChange:s,actions:d});return console.timeEnd("[quantum] built store"),m},t.schema=function(e,t){return new y(e,t)};var f=n(0),l=d(n(17)),p=n(15);function d(e){return e&&e.__esModule?e:{default:e}}function b(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(0,f.configure)({enforceActions:!0});var y=function e(t,n){var r=this;v(this,e),this.name=t,this.props=n,(0,u.default)(n,function(e,t){e.name===a.Types.ID&&(r.idKey=t)})}}])});