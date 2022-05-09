var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function l(e){e.forEach(t)}function o(e){return"function"==typeof e}function s(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function r(t,n,l){t.$$.on_destroy.push(function(t,...n){if(null==t)return e;const l=t.subscribe(...n);return l.unsubscribe?()=>l.unsubscribe():l}(n,l))}function c(e,t,n){return e.set(n),t}function u(e,t){e.appendChild(t)}function i(e,t,n){e.insertBefore(t,n||null)}function a(e){e.parentNode.removeChild(e)}function p(e){return document.createElement(e)}function f(e){return document.createTextNode(e)}function d(){return f(" ")}function $(e,t,n,l){return e.addEventListener(t,n,l),()=>e.removeEventListener(t,n,l)}function m(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function g(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function v(e,t){e.value=null==t?"":t}function h(e,t,n,l){null===n?e.style.removeProperty(t):e.style.setProperty(t,n,l?"important":"")}let b;function _(e){b=e}function y(e,t){const n=e.$$.callbacks[t.type];n&&n.slice().forEach((e=>e.call(this,t)))}const x=[],k=[],w=[],z=[],E=Promise.resolve();let T=!1;function L(e){w.push(e)}function C(e){z.push(e)}const M=new Set;let S=0;function A(){const e=b;do{for(;S<x.length;){const e=x[S];S++,_(e),P(e.$$)}for(_(null),x.length=0,S=0;k.length;)k.pop()();for(let e=0;e<w.length;e+=1){const t=w[e];M.has(t)||(M.add(t),t())}w.length=0}while(x.length);for(;z.length;)z.pop()();T=!1,M.clear(),_(e)}function P(e){if(null!==e.fragment){e.update(),l(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(L)}}const H=new Set;let N;function j(e,t){e&&e.i&&(H.delete(e),e.i(t))}function q(e,t,n,l){if(e&&e.o){if(H.has(e))return;H.add(e),N.c.push((()=>{H.delete(e),l&&(n&&e.d(1),l())})),e.o(t)}}function B(e,t,n){const l=e.$$.props[t];void 0!==l&&(e.$$.bound[l]=n,n(e.$$.ctx[l]))}function F(e){e&&e.c()}function O(e,n,s,r){const{fragment:c,on_mount:u,on_destroy:i,after_update:a}=e.$$;c&&c.m(n,s),r||L((()=>{const n=u.map(t).filter(o);i?i.push(...n):l(n),e.$$.on_mount=[]})),a.forEach(L)}function G(e,t){const n=e.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function R(e,t){-1===e.$$.dirty[0]&&(x.push(e),T||(T=!0,E.then(A)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function I(t,o,s,r,c,u,i,p=[-1]){const f=b;_(t);const d=t.$$={fragment:null,ctx:null,props:u,update:e,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(f?f.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:o.target||f.$$.root};i&&i(d.root);let $=!1;if(d.ctx=s?s(t,o.props||{},((e,n,...l)=>{const o=l.length?l[0]:n;return d.ctx&&c(d.ctx[e],d.ctx[e]=o)&&(!d.skip_bound&&d.bound[e]&&d.bound[e](o),$&&R(t,e)),n})):[],d.update(),$=!0,l(d.before_update),d.fragment=!!r&&r(d.ctx),o.target){if(o.hydrate){const e=function(e){return Array.from(e.childNodes)}(o.target);d.fragment&&d.fragment.l(e),e.forEach(a)}else d.fragment&&d.fragment.c();o.intro&&j(t.$$.fragment),O(t,o.target,o.anchor,o.customElement),A()}_(f)}class D{$destroy(){G(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function J(e){let t,n;return{c(){t=p("p"),n=f(e[3]),m(t,"class","msg-text svelte-15epcr5")},m(e,l){i(e,t,l),u(t,n)},p(e,t){8&t&&g(n,e[3])},d(e){e&&a(t)}}}function K(t){let n,o,s,r,c,b,_,y,x,k,w=t[3]&&J(t);return{c(){n=p("div"),o=p("div"),s=p("h4"),r=f(t[1]),c=d(),w&&w.c(),b=d(),_=p("input"),m(s,"class","svelte-15epcr5"),m(o,"class","title svelte-15epcr5"),m(_,"type","text"),m(_,"class",y="inp"+(t[3]?" msg":"")+" svelte-15epcr5"),h(_,"background-image","url("+t[2]+")"),m(n,"class","input-group")},m(e,l){i(e,n,l),u(n,o),u(o,s),u(s,r),u(o,c),w&&w.m(o,null),u(n,b),u(n,_),v(_,t[0]),x||(k=[$(_,"input",t[5]),$(_,"input",t[4])],x=!0)},p(e,[t]){2&t&&g(r,e[1]),e[3]?w?w.p(e,t):(w=J(e),w.c(),w.m(o,null)):w&&(w.d(1),w=null),8&t&&y!==(y="inp"+(e[3]?" msg":"")+" svelte-15epcr5")&&m(_,"class",y),4&t&&h(_,"background-image","url("+e[2]+")"),1&t&&_.value!==e[0]&&v(_,e[0])},i:e,o:e,d(e){e&&a(n),w&&w.d(),x=!1,l(k)}}}function Q(e,t,n){let{title:l}=t,{icon:o}=t,{value:s}=t,{message:r=null}=t;return e.$$set=e=>{"title"in e&&n(1,l=e.title),"icon"in e&&n(2,o=e.icon),"value"in e&&n(0,s=e.value),"message"in e&&n(3,r=e.message)},[s,l,o,r,function(t){y.call(this,e,t)},function(){s=this.value,n(0,s)}]}class U extends D{constructor(e){super(),I(this,e,Q,K,s,{title:1,icon:2,value:0,message:3})}}const V=[];const W=function(t,n=e){let l;const o=new Set;function r(e){if(s(t,e)&&(t=e,l)){const e=!V.length;for(const e of o)e[1](),V.push(e,t);if(e){for(let e=0;e<V.length;e+=2)V[e][0](V[e+1]);V.length=0}}}return{set:r,update:function(e){r(e(t))},subscribe:function(s,c=e){const u=[s,c];return o.add(u),1===o.size&&(l=n(r)||e),s(t),()=>{o.delete(u),0===o.size&&(l(),l=null)}}}}({bill:0,people:0,tip_percentage:0,reset_disabled:!0});function X(t){let n,l,o,s,r,c,v,h,b;return{c(){n=p("input"),o=d(),s=p("label"),r=f(t[0]),c=f("%"),m(n,"type","radio"),m(n,"name",t[1]),n.value=t[0],m(n,"id",l=`per_${t[0]}`),m(n,"class","svelte-8fioic"),m(s,"for",v=`per_${t[0]}`),m(s,"class","btn svelte-8fioic")},m(e,l){i(e,n,l),i(e,o,l),i(e,s,l),u(s,r),u(s,c),h||(b=$(n,"change",t[2]),h=!0)},p(e,[t]){2&t&&m(n,"name",e[1]),1&t&&(n.value=e[0]),1&t&&l!==(l=`per_${e[0]}`)&&m(n,"id",l),1&t&&g(r,e[0]),1&t&&v!==(v=`per_${e[0]}`)&&m(s,"for",v)},i:e,o:e,d(e){e&&a(n),e&&a(o),e&&a(s),h=!1,b()}}}function Y(e,t,n){let{amount:l}=t,{group_name:o}=t;return e.$$set=e=>{"amount"in e&&n(0,l=e.amount),"group_name"in e&&n(1,o=e.group_name)},[l,o,function(t){y.call(this,e,t)}]}class Z extends D{constructor(e){super(),I(this,e,Y,X,s,{amount:0,group_name:1})}}function ee(t){let n,o,s,r,c,u;return{c(){n=p("input"),s=d(),r=p("input"),m(n,"type","radio"),m(n,"name",t[1]),m(n,"id","cust"),n.value=t[0],n.checked=o=!!t[0],m(n,"class","svelte-c0msvf"),m(r,"class","btn svelte-c0msvf"),m(r,"placeholder","Custom")},m(e,l){i(e,n,l),i(e,s,l),i(e,r,l),v(r,t[0]),c||(u=[$(r,"change",t[2]),$(r,"input",t[3])],c=!0)},p(e,[t]){2&t&&m(n,"name",e[1]),1&t&&(n.value=e[0]),1&t&&o!==(o=!!e[0])&&(n.checked=o),1&t&&r.value!==e[0]&&v(r,e[0])},i:e,o:e,d(e){e&&a(n),e&&a(s),e&&a(r),c=!1,l(u)}}}function te(e,t,n){let{value:l=""}=t,{group_name:o}=t;return e.$$set=e=>{"value"in e&&n(0,l=e.value),"group_name"in e&&n(1,o=e.group_name)},[l,o,function(t){y.call(this,e,t)},function(){l=this.value,n(0,l)}]}class ne extends D{constructor(e){super(),I(this,e,te,ee,s,{value:0,group_name:1})}}function le(e,t,n){const l=e.slice();return l[5]=t[n],l}function oe(t){let n,l;return n=new Z({props:{amount:t[5],group_name:"percent"}}),n.$on("change",t[2]),{c(){F(n.$$.fragment)},m(e,t){O(n,e,t),l=!0},p:e,i(e){l||(j(n.$$.fragment,e),l=!0)},o(e){q(n.$$.fragment,e),l=!1},d(e){G(n,e)}}}function se(e){let t,n,o,s,r,c,f,$,g=e[1],v=[];for(let t=0;t<g.length;t+=1)v[t]=oe(le(e,g,t));const h=e=>q(v[e],1,1,(()=>{v[e]=null}));function b(t){e[3](t)}let _={group_name:"percent"};return void 0!==e[0]&&(_.value=e[0]),c=new ne({props:_}),k.push((()=>B(c,"value",b))),c.$on("change",e[2]),{c(){t=p("div"),n=p("h4"),n.textContent="Select Tip %",o=d(),s=p("div");for(let e=0;e<v.length;e+=1)v[e].c();r=d(),F(c.$$.fragment),m(n,"class","svelte-wdyr1p"),m(s,"class","pc-buttons svelte-wdyr1p"),m(t,"class","tip-select svelte-wdyr1p")},m(e,l){i(e,t,l),u(t,n),u(t,o),u(t,s);for(let e=0;e<v.length;e+=1)v[e].m(s,null);u(s,r),O(c,s,null),$=!0},p(e,[t]){if(6&t){let n;for(g=e[1],n=0;n<g.length;n+=1){const l=le(e,g,n);v[n]?(v[n].p(l,t),j(v[n],1)):(v[n]=oe(l),v[n].c(),j(v[n],1),v[n].m(s,r))}for(N={r:0,c:[],p:N},n=g.length;n<v.length;n+=1)h(n);N.r||l(N.c),N=N.p}const n={};!f&&1&t&&(f=!0,n.value=e[0],C((()=>f=!1))),c.$set(n)},i(e){if(!$){for(let e=0;e<g.length;e+=1)j(v[e]);j(c.$$.fragment,e),$=!0}},o(e){v=v.filter(Boolean);for(let e=0;e<v.length;e+=1)q(v[e]);q(c.$$.fragment,e),$=!1},d(e){e&&a(t),function(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}(v,e),G(c)}}}function re(e,t,n){let l;r(e,W,(e=>n(4,l=e)));let o="";return[o,[5,10,15,25,50],e=>console.log(c(W,l.tip_percentage=e.target.value,l)),function(e){o=e,n(0,o)}]}class ce extends D{constructor(e){super(),I(this,e,re,se,s,{})}}function ue(e){let t,n,l,o,s,r,c,f,$;function g(t){e[3](t)}let v={title:"Bill",icon:"./images/icon-dollar.svg"};function h(t){e[4](t)}void 0!==e[1].bill&&(v.value=e[1].bill),n=new U({props:v}),k.push((()=>B(n,"value",g))),n.$on("input",e[2]),s=new ce({});let b={title:"Number of People",icon:"./images/icon-person.svg",placeholder:"0",message:e[0]};return void 0!==e[1].people&&(b.value=e[1].people),c=new U({props:b}),k.push((()=>B(c,"value",h))),c.$on("input",e[2]),{c(){t=p("div"),F(n.$$.fragment),o=d(),F(s.$$.fragment),r=d(),F(c.$$.fragment),m(t,"class","control svelte-1ddmpeb")},m(e,l){i(e,t,l),O(n,t,null),u(t,o),O(s,t,null),u(t,r),O(c,t,null),$=!0},p(e,[t]){const o={};!l&&2&t&&(l=!0,o.value=e[1].bill,C((()=>l=!1))),n.$set(o);const s={};1&t&&(s.message=e[0]),!f&&2&t&&(f=!0,s.value=e[1].people,C((()=>f=!1))),c.$set(s)},i(e){$||(j(n.$$.fragment,e),j(s.$$.fragment,e),j(c.$$.fragment,e),$=!0)},o(e){q(n.$$.fragment,e),q(s.$$.fragment,e),q(c.$$.fragment,e),$=!1},d(e){e&&a(t),G(n),G(s),G(c)}}}function ie(e,t,n){let l;r(e,W,(e=>n(1,l=e)));let o=null;return[o,l,e=>{0==l.people?n(0,o="can't be zero"):(n(0,o=null),c(W,l.reset_disabled=!1,l)),console.log(o)},function(t){e.$$.not_equal(l.bill,t)&&(l.bill=t,W.set(l))},function(t){e.$$.not_equal(l.people,t)&&(l.people=t,W.set(l))}]}class ae extends D{constructor(e){super(),I(this,e,ie,ue,s,{})}}function pe(t){let n,l,o,s,r,c,v,h,b,_,y,x,k,w,z,E,T,L,C,M,S;return{c(){n=p("div"),l=p("div"),o=p("div"),s=p("div"),s.innerHTML='<div class="label-title svelte-1kcz7bt">Tip Amount</div> \n        <div class="label-person svelte-1kcz7bt">/ person</div>',r=d(),c=p("span"),v=f(t[2]),h=p("br"),b=d(),_=p("div"),y=p("div"),y.innerHTML='<div class="label-title svelte-1kcz7bt">Total</div> \n        <div class="label-person svelte-1kcz7bt">/ person</div>',x=d(),k=p("span"),w=f(t[1]),z=p("br"),E=d(),T=p("button"),L=f("RESET"),m(s,"class","label"),m(c,"class","amount svelte-1kcz7bt"),m(o,"class","amount-line svelte-1kcz7bt"),m(y,"class","label"),m(k,"class","amount svelte-1kcz7bt"),m(_,"class","amount-line svelte-1kcz7bt"),m(l,"class","amount-outputs"),m(T,"class","reset svelte-1kcz7bt"),T.disabled=C=t[0].reset_disabled,m(n,"class","panel svelte-1kcz7bt")},m(e,a){i(e,n,a),u(n,l),u(l,o),u(o,s),u(o,r),u(o,c),u(c,v),u(o,h),u(l,b),u(l,_),u(_,y),u(_,x),u(_,k),u(k,w),u(_,z),u(n,E),u(n,T),u(T,L),M||(S=$(T,"click",t[3]),M=!0)},p(e,[t]){4&t&&g(v,e[2]),2&t&&g(w,e[1]),1&t&&C!==(C=e[0].reset_disabled)&&(T.disabled=C)},i:e,o:e,d(e){e&&a(n),M=!1,S()}}}function fe(e,t,n){let l,o,s;r(e,W,(e=>n(0,s=e)));return e.$$.update=()=>{1&e.$$.dirty&&n(2,l="$"+(0!=s.people?s.bill*s.tip_percentage/100/s.people:0).toFixed(2)),1&e.$$.dirty&&n(1,o="$"+(0!=s.people?s.bill*(1+s.tip_percentage/100)/s.people:0).toFixed(2))},[s,o,l,()=>{W.set({bill:0,people:0,tip_percentage:null,reset_disabled:!0})}]}class de extends D{constructor(e){super(),I(this,e,fe,pe,s,{})}}function $e(t){let n,l,o,s,r;return l=new ae({}),s=new de({}),{c(){n=p("div"),F(l.$$.fragment),o=d(),F(s.$$.fragment),m(n,"class","calc svelte-817tek")},m(e,t){i(e,n,t),O(l,n,null),u(n,o),O(s,n,null),r=!0},p:e,i(e){r||(j(l.$$.fragment,e),j(s.$$.fragment,e),r=!0)},o(e){q(l.$$.fragment,e),q(s.$$.fragment,e),r=!1},d(e){e&&a(n),G(l),G(s)}}}class me extends D{constructor(e){super(),I(this,e,null,$e,s,{})}}function ge(t){let n,l,o,s,r,c,f;return s=new me({}),{c(){n=p("main"),l=p("h1"),l.innerHTML="SPLI<br/>TTER",o=d(),F(s.$$.fragment),r=d(),c=p("footer"),c.innerHTML='<div class="attribution">Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. Coded by\n    <a href="https://github.com/LeeGvs">Lee Greaves</a>.</div>',m(l,"class","title svelte-9pe66z"),m(n,"class","container")},m(e,t){i(e,n,t),u(n,l),u(n,o),O(s,n,null),i(e,r,t),i(e,c,t),f=!0},p:e,i(e){f||(j(s.$$.fragment,e),f=!0)},o(e){q(s.$$.fragment,e),f=!1},d(e){e&&a(n),G(s),e&&a(r),e&&a(c)}}}return new class extends D{constructor(e){super(),I(this,e,null,ge,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
