import{_ as u}from"./TheHeader.vue_vue_type_script_setup_true_lang-EcSDAvht.js";import{u as d,s as p}from"./VSelect-DPZYliKr.js";import{d as _,w as f,c as o,a as m,a6 as s,b as c,$ as h,aa as g,ab as S,o as n,a4 as l}from"./index-4589w5do.js";const y={key:0,class:"ma-4"},L=c("h3",null,"Лог изменений валютной пары",-1),P=_({__name:"SettingsPage",setup(V){const e=d();return f(()=>e.selectedPair,(i,a)=>{const r=new Date().toLocaleString();e.pairLog.push({id:`${a}_${i}_${r}`,from:a,to:i,timestamp:r})}),(i,a)=>{const r=u;return n(),o("div",null,[m(r),m(p,{modelValue:s(e).selectedPair,"onUpdate:modelValue":a[0]||(a[0]=t=>s(e).selectedPair=t),items:s(e).pairs,label:"Выберите валютную пару",variant:"outlined",class:"ma-4"},null,8,["modelValue","items"]),s(e).pairLog.length>0?(n(),o("div",y,[L,c("ul",null,[(n(!0),o(h,null,g(s(e).pairLog,t=>(n(),o("li",{key:t.id,class:"no-bullets"}," Изменение с "+l(t.from)+" на "+l(t.to)+" - "+l(t.timestamp),1))),128))])])):S("",!0)])}}});export{P as default};