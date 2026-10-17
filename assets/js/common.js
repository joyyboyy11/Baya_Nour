/* Code partagé par la boutique (index.html) et l'espace vendeuse (admin.html).
   Contient : réglages, utilitaires et couche données (Firebase ou mode démo localStorage). */
const LIVE=!!CONFIG.apiKey&&typeof firebase!=="undefined";
const CATS=["Classiques","De luxe","Personnalisés","Multicolores","Ensembles multi-rangs"];
const STATUS=["nouvelle","confirmée","livrée","annulée"];
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const logoH=(f)=>`<img class="lg" src="assets/img/${f?"logo-full":"logo-header"}.png?v=3" alt="${esc(S.name)}">`;
const fmt=n=>Number(n||0).toLocaleString("fr-FR")+" FCFA";
const LS=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const toast=m=>{const t=$("#toast");t.textContent=m;t.style.display="block";setTimeout(()=>t.style.display="none",2200)};

/* ====== Couche données : Firebase ou mode démo (localStorage) ====== */
if(LIVE)firebase.initializeApp(CONFIG);
const fdb=LIVE?firebase.firestore():null;
const D={
 async list(c){if(LIVE)return(await fdb.collection(c).get()).docs.map(d=>({...d.data(),id:d.id}));return LS(c,[])},
 async get(c,id){if(LIVE){const x=await fdb.collection(c).doc(id).get();return x.exists?{...x.data(),id:x.id}:null}return LS(c,[]).find(x=>x.id==id)||null},
 async save(c,o){o={...o};const id=o.id;delete o.id;
  if(LIVE){if(id){await fdb.collection(c).doc(id).set(o);return id}return(await fdb.collection(c).add(o)).id}
  const a=LS(c,[]),i=a.findIndex(x=>x.id==id);const nid=id||"i"+Date.now()+Math.random().toString(36).slice(2,6);
  i<0?a.push({...o,id:nid}):a[i]={...o,id:nid};localStorage.setItem(c,JSON.stringify(a));return nid},
 async del(c,id){if(LIVE)return fdb.collection(c).doc(id).delete();localStorage.setItem(c,JSON.stringify(LS(c,[]).filter(x=>x.id!=id)))}
};
const DEF={id:"shop",name:"Baya by Nour",slogan:"Sublime ta féminité",whatsapp:"221768226801",instagram:"https://www.instagram.com/fatou_nour",tiktok:"https://tiktok.com/",wave:"77 000 00 00",banner:"",
 about:"Passionnée de baya depuis toujours, j'ai créé cette boutique pour offrir aux femmes sénégalaises des perles choisies avec soin, dans la tradition et avec une touche moderne.",
 values:"Authenticité, qualité des perles, service attentionné, livraison soignée."};
let P=[],S={...DEF},CODES=[];
const pr=p=>p.promo>0&&p.promo<p.price?p.promo:p.price;

async function load(){
 P=await D.list("products");
 CODES=await D.list("codes");
 const s=(await D.list("settings")).find(x=>x.id=="shop");S={...DEF,...(s||{}),id:"shop"};["name","slogan","about"].forEach(k=>{if(typeof S[k]=="string")S[k]=S[k].replace(/baya\s+nour/gi,"Baya by Nour")});
 if(!LIVE&&!LS("seeded",0)){await D.save("codes",{code:"BIENVENUE",pct:10});localStorage.setItem("seeded","1");CODES=await D.list("codes")}
}
