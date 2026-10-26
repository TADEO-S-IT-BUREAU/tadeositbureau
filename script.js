const packages = [
  {name:"Computer Repair & Maintenance",icon:"⚙",desc:"Diagnose common computer problems, maintain devices and learn safe troubleshooting.",topics:["Computer diagnosis","Hardware care","Troubleshooting"]},
  {name:"Website Design & Digital Presence",icon:"▣",desc:"Plan, design and publish responsive websites for individuals and businesses.",topics:["HTML and CSS","Responsive design","Website publishing"]},
  {name:"Computer Training",icon:"⌨",desc:"Build computer confidence from the basics to office productivity and internet skills.",topics:["Computer basics","Word and Excel","Internet and email"]},
  {name:"Computer Accessories & Supplies",icon:"▤",desc:"Understand, choose and use computer accessories, peripherals and essential supplies.",topics:["Keyboards and mice","Printers and cables","Buying and care"]},
  {name:"Software Development",icon:"{ }",desc:"Learn programming logic and build useful websites, apps and software projects.",topics:["Programming basics","Web apps","Project building"]},
  {name:"Data Backup & Recovery",icon:"◈",desc:"Create safer backup routines and learn responsible file recovery practices.",topics:["Backup planning","Cloud and offline copies","Recovery basics"]},
  {name:"Cybersecurity & Digital Safety",icon:"⬡",desc:"Develop safer password, privacy, phishing awareness and device-security habits.",topics:["Password safety","Scam awareness","Device protection"]},
  {name:"Software Installation & IT Setup",icon:"⌘",desc:"Learn how to prepare devices, install trusted software and configure basic IT setups.",topics:["Operating systems","Software setup","Device configuration"]}
];
const icons = ["⚙","▣","⌨","▤","{ }","◈","⬡","⌘"];
const starterTutorials = [
  {id:"starter-1",title:"Computer Basics: Meet Your Computer",package:2,description:"Understand the main parts of a computer, what each part does and how to use a mouse and keyboard.",notes:"1. Identify the monitor, system unit, keyboard and mouse.\\n2. Explain the difference between hardware and software.\\n3. Practise clicking, double-clicking, dragging and typing.\\n4. Shut down the computer safely.",task:"Draw or list five computer parts and explain the function of each.",video:"",starter:true},
  {id:"starter-2",title:"Keeping a Computer Clean and Healthy",package:0,description:"Learn safe everyday habits that help prevent common computer problems.",notes:"Turn off and unplug equipment before external cleaning. Use a soft, dry cloth. Keep food and liquids away. Ensure vents are not blocked. Do not open power supplies or attempt repairs beyond your training.",task:"Create a weekly computer-maintenance checklist.",video:"",starter:true},
  {id:"starter-3",title:"Plan Your First Website",package:1,description:"Learn how to identify a website's audience, pages, content and visual style before coding.",notes:"1. Define the purpose of the site.\\n2. Identify the target audience.\\n3. Sketch the Home, About, Services and Contact pages.\\n4. Choose readable colours and fonts.\\n5. Make sure the layout can work on a phone.",task:"Sketch a four-page website for a small business.",video:"",starter:true},
  {id:"starter-4",title:"Password Safety and Phishing Awareness",package:6,description:"Recognise suspicious messages and practise safer account habits.",notes:"Use unique passwords or a password manager. Enable multi-factor authentication where possible. Check sender addresses and links carefully. Never share verification codes. If unsure, contact the organisation through its official channel.",task:"Write five warning signs of a suspicious email or message.",video:"",starter:true}
];
let tutorials = loadTutorials();
const serviceGrid = document.getElementById("serviceGrid");
const packageFilter = document.getElementById("packageFilter");
const lessonPackage = document.getElementById("lessonPackage");
function loadTutorials(){try{const saved=localStorage.getItem("tadeosTutorials");return saved?JSON.parse(saved):starterTutorials.slice()}catch(e){return starterTutorials.slice()}}
function saveTutorials(){try{localStorage.setItem("tadeosTutorials",JSON.stringify(tutorials))}catch(e){alert("This browser could not save lessons. You can still view them during this session.")}}
function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]))}
function renderPackages(){
  serviceGrid.innerHTML=packages.map((p,i)=>`<article class="service-card"><div class="service-icon">${icons[i]}</div><h3>${p.name}</h3><p>${p.desc}</p><a href="#tutorials" data-package="${i}">Explore lessons <span>↗</span></a></article>`).join("");
  const opts=packages.map((p,i)=>`<option value="${i}">${p.name}</option>`).join("");
  packageFilter.insertAdjacentHTML("beforeend",opts);lessonPackage.insertAdjacentHTML("beforeend",opts);
  serviceGrid.querySelectorAll("[data-package]").forEach(a=>a.addEventListener("click",()=>{packageFilter.value=a.dataset.package;renderTutorials()}));
}
function renderTutorials(){
  const query=document.getElementById("tutorialSearch").value.trim().toLowerCase();
  const filter=packageFilter.value;
  const filtered=tutorials.filter(t=>{
    const p=packages[Number(t.package)]?.name||"General";
    return (filter==="all"||String(t.package)===filter)&&[t.title,t.description,t.notes,t.task,p].join(" ").toLowerCase().includes(query);
  });
  document.getElementById("tutorialCount").textContent=`${filtered.length} tutorial${filtered.length===1?"":"s"}`;
  document.getElementById("emptyState").hidden=filtered.length!==0;
  document.getElementById("tutorialGrid").innerHTML=filtered.map(t=>`<article class="tutorial-card"><span class="tutorial-tag">${escapeHTML(packages[Number(t.package)]?.name||"General")}</span><h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.description)}</p><div class="tutorial-card-bottom"><small>${t.video?"Video lesson available":"Notes & practical learning"}</small><button data-open="${escapeHTML(t.id)}">Open lesson ↗</button></div></article>`).join("");
  document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>openLesson(b.dataset.open)));
}
const tutorialDialog=document.getElementById("tutorialDialog"),lessonDialog=document.getElementById("lessonDialog");
function openAdd(){document.getElementById("tutorialForm").reset();document.getElementById("dialogTitle").textContent="Add a tutorial";tutorialDialog.showModal()}
function closeAdd(){tutorialDialog.close()}
document.getElementById("showAddTutorial").addEventListener("click",openAdd);
document.getElementById("sidebarAdd").addEventListener("click",openAdd);
document.getElementById("closeDialog").addEventListener("click",closeAdd);
document.getElementById("cancelDialog").addEventListener("click",closeAdd);
document.getElementById("tutorialSearch").addEventListener("input",renderTutorials);
packageFilter.addEventListener("change",renderTutorials);
document.getElementById("tutorialForm").addEventListener("submit",e=>{
  e.preventDefault();
  const item={id:"lesson-"+Date.now(),title:document.getElementById("lessonTitle").value.trim(),package:Number(document.getElementById("lessonPackage").value),description:document.getElementById("lessonDescription").value.trim(),video:document.getElementById("lessonVideo").value.trim(),notes:document.getElementById("lessonNotes").value.trim(),task:document.getElementById("lessonTask").value.trim(),starter:false};
  if(!item.title||!item.description)return;
  tutorials.unshift(item);saveTutorials();renderTutorials();closeAdd();
});
function getYoutubeEmbed(url){
  try{const u=new URL(url);let id="";
    if(u.hostname.includes("youtu.be"))id=u.pathname.slice(1);
    else if(u.hostname.includes("youtube.com"))id=u.searchParams.get("v")||u.pathname.split("/").filter(Boolean).pop();
    if(id&&/^[\w-]{6,}$/.test(id))return `https://www.youtube-nocookie.com/embed/${id}`;
    if(u.hostname==="www.youtube-nocookie.com"||u.hostname==="youtube-nocookie.com")return url;
  }catch(e){}
  return "";
}
function openLesson(id){
  const t=tutorials.find(x=>x.id===id);if(!t)return;
  document.getElementById("viewTitle").textContent=t.title;
  document.getElementById("viewPackage").textContent=packages[Number(t.package)]?.name||"General";
  document.getElementById("viewDescription").textContent=t.description;
  document.getElementById("viewNotes").textContent=t.notes||"No notes have been added to this lesson yet.";
  document.getElementById("viewTask").textContent=t.task||"No practical assignment has been added yet.";
  document.getElementById("taskBlock").hidden=!t.task;
  const video=document.getElementById("videoContainer"),embed=getYoutubeEmbed(t.video||"");
  if(embed)video.innerHTML=`<iframe class="video-frame" src="${escapeHTML(embed)}" title="${escapeHTML(t.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
  else if(t.video)video.innerHTML=`<a class="video-link" href="${escapeHTML(t.video)}" target="_blank" rel="noopener">Open lesson video in a new tab ↗</a>`;
  else video.innerHTML="";
  const old=document.getElementById("deleteCurrent");if(old)old.remove();
  if(!t.starter){const del=document.createElement("button");del.id="deleteCurrent";del.className="delete-tutorial";del.textContent="Delete this tutorial";del.style.marginLeft="14px";del.addEventListener("click",()=>{if(confirm("Delete this tutorial from this browser?")){tutorials=tutorials.filter(x=>x.id!==id);saveTutorials();renderTutorials();lessonDialog.close()}});document.getElementById("doneLesson").after(del)}
  lessonDialog.showModal();
}
document.getElementById("closeLesson").addEventListener("click",()=>lessonDialog.close());
document.getElementById("doneLesson").addEventListener("click",()=>lessonDialog.close());
document.getElementById("menuToggle").addEventListener("click",()=>{const nav=document.getElementById("navMenu");const open=nav.classList.toggle("open");document.getElementById("menuToggle").setAttribute("aria-expanded",String(open))});
document.querySelectorAll("#navMenu a").forEach(a=>a.addEventListener("click",()=>{document.getElementById("navMenu").classList.remove("open");document.getElementById("menuToggle").setAttribute("aria-expanded","false")}));
document.getElementById("year").textContent=new Date().getFullYear();
renderPackages();renderTutorials();
