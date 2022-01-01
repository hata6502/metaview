(()=>{"use strict";const t=()=>{const t=[...document.querySelectorAll('script[type="application/ld+json" i]')].flatMap((t=>{if(!(t instanceof HTMLScriptElement))return[];try{const e=JSON.parse(t.innerText);return(Array.isArray(e)?e:[e]).flatMap((t=>l(t)?[t]:[]))}catch(t){return console.error(t),[]}})),e=location.href,u=c(),m=document.querySelector('meta[property="og:image" i]'),p=document.querySelector('link[rel="icon" i]'),d=m instanceof HTMLMetaElement&&m.content||s({structuredDataList:t})||p instanceof HTMLLinkElement&&p.href||void 0,f={url:e,description:`${[u,e,[a({structuredDataList:t}),r({structuredDataList:t})].filter((t=>t)).join("\n"),n({structuredDataList:t}),i({structuredDataList:t}),o()].filter((t=>t)).join("\n\n")}\n\n`,imageURL:d,metadata:[...[...document.querySelectorAll("meta[name]")].flatMap((t=>t instanceof HTMLMetaElement?[`${t.name}:${t.content}`]:[])),...[...document.querySelectorAll('script[type="application/ld+json" i]')].flatMap((t=>t instanceof HTMLElement?[t.innerText]:[]))].join(" "),title:u};chrome.runtime.sendMessage(f)};document.addEventListener("DOMContentLoaded",t),addEventListener("load",t),setInterval(t,1e3);const e=({structuredDataList:t})=>{const e=t.flatMap((t=>{if(!("@type"in t))return[];const e=t["@type"];return"Article"===e||"BlogPosting"===e||"NewsArticle"===e?[t]:[]}));if(!(e.length<1))return e[0]},n=({structuredDataList:t})=>t.flatMap((t=>{if(!("@type"in t)||"BreadcrumbList"!==t["@type"])return[];const{itemListElement:e}=t;return Array.isArray(e)?[[...e].sort(((t,e)=>t.position-e.position)).flatMap((t=>{if(!t)return[];const e=t.item?.name??t.name;return"string"==typeof e?[m(e)]:[]})).join(" > ")]:[]})).join("\n"),r=({structuredDataList:t})=>{const n=e({structuredDataList:t}),r=n?.author,a=n?.publisher,i=[...new Set([u(r)&&r.name,u(a)&&a.name,,...[...document.querySelectorAll('meta[name="author" i], meta[name="creator" i], meta[name="publisher" i]')].flatMap((t=>t instanceof HTMLMetaElement?[t.content]:[]))].flatMap((t=>"string"==typeof t?[t]:[])))];return i.length>=1&&`by ${i.map(m).join(" ")}`},a=({structuredDataList:t})=>{const n=e({structuredDataList:t}),r=n?.dateModified??n?.datePublished;return"string"==typeof r&&new Date(r).toLocaleString()},i=({structuredDataList:t})=>{const n=document.querySelector('meta[name="description" i]'),r=document.querySelector('meta[property="og:description" i]');return r instanceof HTMLMetaElement&&r.content||n instanceof HTMLMetaElement&&n.content||e({structuredDataList:t})?.headline},o=()=>{const t=document.querySelector('meta[name="keywords" i]');return(t instanceof HTMLMetaElement&&t.content||"").split(",").flatMap((t=>{const e=t.trim();return""===e?[]:[e]})).map(m).join(" ")},s=({structuredDataList:t})=>{const n=e({structuredDataList:t});if(n){const{image:t,publisher:e}=n,r=Array.isArray(t)&&t[0];if("string"==typeof r)return r;const a=u(e)&&u(e.logo)&&e.logo.url;if("string"==typeof a)return a}const r=t.flatMap((t=>"@type"in t&&"Organization"===t["@type"]?[t]:[]));if(r.length>=1){const{logo:t}=r[0];if("string"==typeof t)return t}},c=()=>{const t=document.querySelector('meta[property="og:title" i]');return t instanceof HTMLMetaElement&&t.content||document.title},u=t=>"object"==typeof t&&null!==t,l=t=>u(t)&&["http://schema.org","https://schema.org"].includes(t["@context"]),m=t=>`#${t.replaceAll(" ","_")}`})();