(()=>{"use strict";var e,r,t,o,n,a={10:(e,r,t)=>{t.d(r,{a:()=>o});const o={scrapboxProjectName:"",scrapboxURL:"https://scrapbox.io"}},450:(e,r,t)=>{t.a(e,(async e=>{var r=t(10);const o=document.querySelector("#scrapbox-project-name-input"),n=document.querySelector("#scrapbox-url-input");if(!(o instanceof HTMLInputElement&&n instanceof HTMLInputElement))throw new Error("Cannot find scrapbox project name or URL input element");o.addEventListener("input",(()=>chrome.storage.sync.set({scrapboxProjectName:o.value}))),n.addEventListener("input",(()=>chrome.storage.sync.set({scrapboxURL:n.value})));const{scrapboxProjectName:a,scrapboxURL:c}=await chrome.storage.sync.get(r.a);o.value=a,n.value=c,e()}),1)}},c={};function p(e){var r=c[e];if(void 0!==r)return r.exports;var t=c[e]={exports:{}};return a[e](t,t.exports,p),t.exports}e="function"==typeof Symbol?Symbol("webpack then"):"__webpack_then__",r="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",t=e=>{e&&(e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},o=e=>!--e.r&&e(),n=(e,r)=>e?e.push(r):o(r),p.a=(a,c,p)=>{var s,u,i,m=p&&[],b=a.exports,f=!0,l=!1,v=(r,t,o)=>{l||(l=!0,t.r+=r.length,r.map(((r,n)=>r[e](t,o))),l=!1)},x=new Promise(((e,r)=>{i=r,u=()=>(e(b),t(m),m=0)}));x[r]=b,x[e]=(e,r)=>{if(f)return o(e);s&&v(s,e,r),n(m,e),x.catch(r)},a.exports=x,c((a=>{if(!a)return u();var c,p;s=(a=>a.map((a=>{if(null!==a&&"object"==typeof a){if(a[e])return a;if(a.then){var c=[];a.then((e=>{p[r]=e,t(c),c=0}));var p={};return p[e]=(e,r)=>(n(c,e),a.catch(r)),p}}var s={};return s[e]=e=>o(e),s[r]=a,s})))(a);var i=new Promise(((e,t)=>{(c=()=>e(p=s.map((e=>e[r])))).r=0,v(s,c,t)}));return c.r?i:p})).then(u,i),f=!1},p.d=(e,r)=>{for(var t in r)p.o(r,t)&&!p.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},p.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),p(450)})();