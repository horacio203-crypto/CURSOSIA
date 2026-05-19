function getPath(obj,path){return path.split(".").reduce((a,k)=>a&&a[k],obj)}
async function loadSiteSettings(){
 try{
  const res=await fetch("data/site.json",{cache:"no-store"});
  if(!res.ok)return; const data=await res.json();
  document.querySelectorAll("[data-site]").forEach(el=>{const v=getPath(data,el.dataset.site); if(v!==undefined&&v!==null)el.textContent=v});
  document.querySelectorAll("[data-site-placeholder]").forEach(el=>{const v=getPath(data,el.dataset.sitePlaceholder); if(v!==undefined&&v!==null)el.setAttribute("placeholder",v)});
  if(data.seo?.title)document.title=data.seo.title;
  const m=document.getElementById("metrics"); if(m&&Array.isArray(data.metrics))m.innerHTML=data.metrics.map(x=>`<article><strong>${x.value}</strong><span>${x.label}</span></article>`).join("");
 }catch(e){}
}
loadSiteSettings();

const menu=document.getElementById("menu");const nav=document.getElementById("nav");if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))})}
const iconMap={chatgpt:"i-brain",automation:"i-gear",python:"i-code",marketing:"i-chart",prompt:"i-search",canva:"i-design",default:"i-brain"};
const sampleCourses=[
{"title":"ChatGPT y Prompt Engineering para todos","category":"IA Generativa","provider":"Udemy","level":"Principiante","rating":"4.7","price":"19.99 USD","tags":"chatgpt prompt engineering inteligencia artificial generativa negocios productividad","description":"Aprendé a usar ChatGPT y prompts efectivos para trabajo, estudio, ventas y creación de contenidos.","image":"curso-ejemplo-2.png","link":"#"},
{"title":"Automatización con IA para empresas","category":"Automatización","provider":"Platzi","level":"Intermedio","rating":"4.8","price":"Gratis","tags":"automatizacion ia make zapier empresas productividad no-code procesos","description":"Automatizá tareas repetitivas, flujos comerciales, respuestas y procesos internos con inteligencia artificial.","image":"curso-automatizacion.svg","link":"#"},
{"title":"Python aplicado a inteligencia artificial","category":"Programación IA","provider":"Coursera","level":"Intermedio","rating":"4.7","price":"A consultar","tags":"python inteligencia artificial machine learning datos programacion","description":"Desde cero hasta proyectos de IA con Python, datos, APIs y fundamentos de machine learning.","image":"curso-ejemplo-3.png","link":"#"},
{"title":"IA para marketing digital","category":"Negocios digitales","provider":"Domestika","level":"Principiante","rating":"4.6","price":"24.90 USD","tags":"marketing digital ia anuncios contenido redes ventas embudos","description":"Estrategias de marketing con IA para crear campañas, anuncios, contenidos y mensajes comerciales.","image":"curso-marketing-ia.svg","link":"#"},
{"title":"Prompt Engineering para equipos","category":"Prompt engineering","provider":"LinkedIn Learning","level":"Intermedio","rating":"4.8","price":"29.99 USD","tags":"prompt engineering prompts empresas chatgpt productividad equipos","description":"Dominá instrucciones avanzadas para mejorar resultados con ChatGPT, Gemini, Claude y asistentes IA.","image":"curso-prompts.svg","link":"#"},
{"title":"Canva IA para emprendedores","category":"Diseño con IA","provider":"Hotmart","level":"Principiante","rating":"4.7","price":"Gratis","tags":"canva ia diseño imagenes emprendedores redes branding","description":"Creá piezas visuales, anuncios, posts y presentaciones profesionales con herramientas de diseño asistido.","image":"curso-canva-ia.svg","link":"#"}
];
function norm(s){return (s||"").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function imgSrc(c){if(!c.image)return ""; if(/^https?:\/\//.test(c.image)||c.image.startsWith("/")) return c.image; return "assets/courses/"+c.image;}
function renderCourses(courses){const grid=document.getElementById("courseGrid");if(!grid)return;grid.innerHTML=courses.map(c=>{const icon=iconMap[c.icon||c.image]||iconMap.default;const link=c.link||"#";const image=imgSrc(c);const art=image?`<img src="${image}" alt="Imagen del curso ${c.title}" loading="lazy">`:`<svg aria-hidden="true"><use href="assets/icons.svg#${icon}"/></svg>`;return `<article class="course-card" data-search="${norm([c.title,c.category,c.provider,c.level,c.tags,c.description].join(" "))}">
<div class="course-art">${art}<span class="course-badge">${c.badge||"Destacado"}</span></div>
<div class="course-body"><div class="course-top"><span>${c.provider||"Academia"}</span><strong class="rating">★ ${c.rating||"4.7"}</strong></div>
<h3>${c.title}</h3><p>${c.description}</p><div class="course-meta"><span>${c.category}</span><span>${c.level}</span><span>${c.price||"A consultar"}</span></div>
<a href="${link}" rel="sponsored nofollow">Ver curso</a></div></article>`}).join("")}
async function loadCourses(){try{const res=await fetch("data/cursos.json",{cache:"no-store"});if(!res.ok)throw new Error("no json");const data=await res.json();renderCourses(data)}catch(e){renderCourses(sampleCourses)}}
loadCourses();
function filterCourses(q){q=norm(q);document.querySelectorAll(".course-card").forEach(card=>{card.style.display=!q||card.dataset.search.includes(q)?"block":"none"})}
const input=document.getElementById("q");document.querySelectorAll("[data-query]").forEach(btn=>btn.addEventListener("click",()=>{if(input){input.value=btn.dataset.query;filterCourses(input.value);document.getElementById("cursos")?.scrollIntoView({behavior:"smooth"})}}));
document.getElementById("buscador")?.addEventListener("submit",e=>{e.preventDefault();filterCourses(input?.value||"");document.getElementById("cursos")?.scrollIntoView({behavior:"smooth"})});input?.addEventListener("input",e=>filterCourses(e.target.value));

function fixBrokenImages(){
  document.querySelectorAll("img").forEach(img=>{
    img.addEventListener("error",()=>{
      img.style.display="none";
      const parent=img.parentElement;
      if(parent && !parent.querySelector(".image-fallback")){
        const f=document.createElement("div");
        f.className="image-fallback";
        f.textContent="CursosIA";
        parent.appendChild(f);
      }
    },{once:true});
  });
}
window.addEventListener("load",fixBrokenImages);
