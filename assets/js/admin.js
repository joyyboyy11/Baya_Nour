/* Espace vendeuse (admin.html) : connexion, produits, commandes, ventes, codes promo, réglages.
   Dépend de config.js et common.js. Aucun code client ici, aucun code admin dans app.js. */
const auth=LIVE?firebase.auth():null;
let user=LIVE?null:(sessionStorage.demoAdmin?{}:null),authReady=!LIVE,edit=null,tab="produits",orders=[],pend=[];
if(LIVE)auth.onAuthStateChanged(u=>{user=u;authReady=true;route()});

function pf(p){p=p||{};return`<form id="pf" class="box"><h3>${p.id?"Modifier":"Ajouter"} un baya</h3><div class="two" style="gap:1.5rem"><div><label>Nom</label><input name="name" required value="${esc(p.name)}"><label>Catégorie</label><select name="category">${CATS.map(c=>`<option ${p.category==c?"selected":""}>${c}</option>`).join("")}</select><label>Prix (FCFA)</label><input name="price" type="number" min="0" required value="${p.price||""}"><label>Prix promo (0 = aucune)</label><input name="promo" type="number" min="0" value="${p.promo||0}"><label>Stock</label><input name="stock" type="number" min="0" value="${p.stock??1}"></div>
 <div><label>Couleurs (séparées par des virgules)</label><input name="colors" value="${esc((p.colors||[]).join(", "))}"><label>Tailles (séparées par des virgules)</label><input name="sizes" value="${esc((p.sizes||[]).join(", "))}"><label>Description</label><textarea name="desc" rows="3">${esc(p.desc)}</textarea><label>Photos (jusqu'à 3)</label><input type="file" id="files" accept="image/*" multiple><small id="fl">${(p.imgs||[]).length} photo(s) enregistrée(s)</small><label><input type="checkbox" name="isNew" ${p.isNew?"checked":""}>Nouveauté</label><label><input type="checkbox" name="best" ${p.best?"checked":""}>Meilleure vente</label></div></div><div style="margin-top:1rem;display:flex;gap:.6rem"><button class="btn">Enregistrer</button><button type="button" class="btn ghost" data-act="cancel">Annuler</button></div></form>`}
const shrink=f=>new Promise(r=>{const i=new Image,u=URL.createObjectURL(f);i.onload=()=>{const k=Math.min(1,800/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;c.getContext("2d").drawImage(i,0,0,c.width,c.height);r(c.toDataURL("image/jpeg",.78))};i.src=u});
const admin=async()=>{
 if(!authReady)return`<div class="loader"><i></i></div>`;
 if(!user)return`<div class="wrap" style="max-width:420px"><h2>Espace vendeuse</h2><a class="mut" href="index.html">&larr; Retour à la boutique</a><form id="lf" class="box">${LIVE?`<label>Email</label><input name="e" type="email" required>`:`<small>Mode démo : mot de passe admin123</small>`}<label>Mot de passe</label><input name="p" type="password" required><button class="btn" style="margin-top:1rem">Se connecter</button></form></div>`;
 orders=(await D.list("orders")).sort((a,b)=>b.date.localeCompare(a.date));
 const tabs=["produits","commandes","ventes","codes","boutique"],ok=orders.filter(o=>o.status!="annulée"),ca=ok.reduce((a,o)=>a+o.total,0);
 let body="";
 if(tab=="produits")body=(edit!==null?pf(edit):`<div class="row" style="margin-top:1rem"><h3>${P.length} produits</h3><button class="btn" data-act="new">Ajouter un baya</button></div>`)+`<div class="tw box"><table><tr><th>Nom</th><th>Prix</th><th>Promo</th><th>Stock</th><th></th></tr>${P.map(p=>`<tr><td>${esc(p.name)}</td><td>${fmt(p.price)}</td><td>${p.promo>0?fmt(p.promo):"-"}</td><td>${p.stock}</td><td><button class="btn sm ghost" data-act="edit" data-id="${p.id}">Modifier</button> <button class="btn sm ghost" data-act="del" data-id="${p.id}">Supprimer</button></td></tr>`).join("")||"<tr><td colspan=\"5\">Aucun produit pour le moment. Clique sur « Ajouter un baya » pour créer le premier.</td></tr>"}</table></div>`;
 if(tab=="commandes")body=`<div class="row" style="margin-top:1rem"><h3>${orders.length} commandes</h3><button class="btn sm" data-act="csv">Exporter en CSV</button></div><div class="tw box"><table><tr><th>Date</th><th>Cliente</th><th>Articles</th><th>Total</th><th>Statut</th></tr>${orders.map(o=>`<tr><td>${new Date(o.date).toLocaleDateString("fr-FR")}</td><td>${esc(o.name)}<br><small>${esc(o.phone)} - ${esc(o.addr)}<br>${esc(o.pay)}</small></td><td>${o.items.map(i=>`${i.qty}x ${esc(i.name)} ${esc(i.color||"")}`).join("<br>")}</td><td>${fmt(o.total)}${o.code?`<br><small>Code ${esc(o.code)}</small>`:""}</td><td><select data-act="st" data-id="${o.id}">${STATUS.map(s=>`<option ${o.status==s?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join("")||"<tr><td>Aucune commande pour le moment.</td></tr>"}</table></div>`;
 if(tab=="ventes"){const m={};ok.forEach(o=>o.items.forEach(i=>m[i.name]=(m[i.name]||0)+i.qty));const top=Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const days=[...Array(7)].map((_,i)=>{const x=new Date();x.setDate(x.getDate()-6+i);return x.toISOString().slice(0,10)}),vals=days.map(x=>ok.filter(o=>o.date.slice(0,10)==x).reduce((a,o)=>a+o.total,0)),mx=Math.max(...vals,1);
  body=`<div class="stats" style="margin-top:1rem"><div class="box"><b>${fmt(ca)}</b>Chiffre d'affaires</div><div class="box"><b>${ok.length}</b>Commandes valides</div><div class="box"><b>${fmt(ok.length?Math.round(ca/ok.length):0)}</b>Panier moyen</div><div class="box"><b>${orders.filter(o=>o.status=="nouvelle").length}</b>À traiter</div></div>
  <div class="box"><h3>Ventes des 7 derniers jours</h3><svg viewBox="0 0 420 160" role="img" aria-label="Ventes par jour" style="width:100%;max-width:600px">${vals.map((v,i)=>{const h=Math.round(v/mx*100),x=18+i*57;return`<rect x="${x}" y="${125-h}" width="40" height="${h}" rx="5" fill="#8A2338"/><text x="${x+20}" y="145" font-size="11" text-anchor="middle" fill="#6A635B">${days[i].slice(8)}/${days[i].slice(5,7)}</text>${v?`<text x="${x+20}" y="${120-h}" font-size="10" text-anchor="middle" fill="#1E1A17">${Math.round(v/1000)}k</text>`:""}`}).join("")}</svg></div>
  <div class="two"><div class="box"><h3>Modèles les plus vendus</h3>${top.map(t=>`<p>${esc(t[0])} : ${t[1]}</p>`).join("")||"<p>Pas encore de ventes.</p>"}</div><div class="box"><h3>Stock à surveiller</h3>${P.filter(p=>p.stock<=2).map(p=>`<p>${esc(p.name)} : ${p.stock}</p>`).join("")||"<p>Tout est bien approvisionné.</p>"}</div></div>`}
 if(tab=="codes")body=`<form id="cdf" class="box row" style="align-items:flex-end"><div><label style="margin-top:0">Code</label><input name="code" required placeholder="BIENVENUE"></div><div><label style="margin-top:0">Réduction (%)</label><input name="pct" type="number" min="1" max="90" required></div><button class="btn">Créer le code</button></form><div class="tw box"><table><tr><th>Code</th><th>Réduction</th><th></th></tr>${CODES.map(c=>`<tr><td>${esc(c.code)}</td><td>${c.pct}%</td><td><button class="btn sm ghost" data-act="delcode" data-id="${c.id}">Supprimer</button></td></tr>`).join("")||"<tr><td>Aucun code.</td></tr>"}</table></div>`;
 if(tab=="boutique")body=`<form id="sf" class="box">${[["name","Nom de la boutique"],["slogan","Slogan"],["whatsapp","WhatsApp (ex. 221770000000)"],["instagram","Lien Instagram"],["tiktok","Lien TikTok"],["wave","Numéro Wave"]].map(([k,l])=>`<label>${l}</label><input name="${k}" value="${esc(S[k])}">`).join("")}<label>Histoire</label><textarea name="about" rows="3">${esc(S.about)}</textarea><label>Valeurs</label><textarea name="values" rows="2">${esc(S.values)}</textarea><label>Photo de bannière</label><input type="file" id="bf" accept="image/*"><button class="btn" style="margin-top:1rem">Enregistrer</button></form>`;
 return`<div class="wrap"><div class="row"><h2>Espace vendeuse</h2><div style="display:flex;gap:.6rem;flex-wrap:wrap"><a class="btn sm ghost" href="index.html">Voir la boutique</a><button class="btn sm ghost" data-act="out">Se déconnecter</button></div></div><div class="chips" style="margin-top:1rem">${tabs.map(t=>`<button class="chip ${t==tab?"on":""}" data-act="tab" data-v="${t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join("")}</div>${body}</div>`};

async function route(){
 let html;try{html=await admin()}catch(e){html=`<div class="wrap"><p>Une erreur est survenue : ${esc(e.message)}. Recharge la page.</p></div>`}
 $("#app").innerHTML=html;$("#logo").innerHTML=logoH();document.title="Espace vendeuse, "+S.name;
}

document.addEventListener("click",async e=>{
 const t=e.target.closest("[data-act]");if(!t||t.tagName=="SELECT")return;const a=t.dataset.act,id=t.dataset.id,v=t.dataset.v;
 if(a=="delcode"){await D.del("codes",id);CODES=await D.list("codes");route()}
 else if(a=="csv"){const c2=x=>'"'+String(x??"").replace(/"/g,'""')+'"',rows=[["Date","Référence","Nom","Téléphone","Adresse","Paiement","Articles","Code","Remise","Total","Statut"],...orders.map(o=>[o.date.slice(0,10),o.id,o.name,o.phone,o.addr,o.pay,o.items.map(i=>i.qty+"x "+i.name+" "+(i.color||"")).join(" | "),o.code||"",o.discount||0,o.total,o.status])],u=URL.createObjectURL(new Blob(["\ufeff"+rows.map(r=>r.map(c2).join(";")).join("\n")],{type:"text/csv"})),l=document.createElement("a");l.href=u;l.download="commandes.csv";l.click();URL.revokeObjectURL(u)}
 else if(a=="tab"){tab=v;edit=null;route()}
 else if(a=="new"){edit={};route()}
 else if(a=="edit"){edit=P.find(p=>p.id==id);route()}
 else if(a=="cancel"){edit=null;route()}
 else if(a=="del"){if(confirm("Supprimer ce produit ?")){await D.del("products",id);P=await D.list("products");route()}}
 else if(a=="out"){LIVE?await auth.signOut():sessionStorage.removeItem("demoAdmin");user=null;route()}
});
document.addEventListener("change",async e=>{
 if(e.target.dataset.act=="st"){const o=orders.find(x=>x.id==e.target.dataset.id),ns=e.target.value;
  const rs=x=>x=="confirmée"||x=="livrée",adj=async g=>{for(const i of o.items){const p=P.find(x=>x.id==i.id);if(p){p.stock=Math.max(0,p.stock+g*i.qty);await D.save("products",p)}}};
  if(!rs(o.status)&&rs(ns))await adj(-1);else if(rs(o.status)&&!rs(ns))await adj(1);
  o.status=ns;await D.save("orders",o);toast("Statut mis à jour")}
});
document.addEventListener("change",async e=>{if(e.target.id=="files"){pend=await Promise.all([...e.target.files].slice(0,3).map(shrink));$("#fl").textContent=pend.length+" nouvelle(s) photo(s) (remplace les anciennes)"}});
document.addEventListener("submit",async e=>{
 e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f)),csv=s=>(s||"").split(",").map(x=>x.trim()).filter(Boolean);
 try{
 if(f.id=="cdf"){await D.save("codes",{code:d.code.trim().toUpperCase(),pct:+d.pct});CODES=await D.list("codes");route()}
 else if(f.id=="lf"){if(LIVE)await auth.signInWithEmailAndPassword(d.e,d.p);else if(d.p=="admin123"){sessionStorage.demoAdmin=1;user={};route()}else toast("Mot de passe incorrect")}
 else if(f.id=="pf"){const p=edit||{};const o={...p,name:d.name,category:d.category,price:+d.price,promo:+d.promo||0,stock:+d.stock||0,colors:csv(d.colors),sizes:csv(d.sizes),desc:d.desc,isNew:!!d.isNew,best:!!d.best,imgs:pend.length?pend:(p.imgs||[])};
  await D.save("products",o);pend=[];edit=null;P=await D.list("products");toast("Produit enregistré");route()}
 else if(f.id=="sf"){const bf=$("#bf").files[0];S={...S,...d};if(bf)S.banner=await shrink(bf);await D.save("settings",S);toast("Boutique mise à jour");route()}
 }catch(err){document.querySelectorAll("button[type=submit]").forEach(b=>b.disabled=false);toast("Erreur : "+(err.code||err.message))}
});

window.addEventListener("error",e=>{const a=document.getElementById("app");if(a&&!a.innerHTML.trim())a.innerHTML='<div class="wrap"><h2>Oups</h2><p>'+esc(e.message)+'</p></div>'});
(async()=>{try{await load()}catch(e){console.error(e);toast("Connexion Firebase impossible : "+(e.code||e.message))}route()})();
