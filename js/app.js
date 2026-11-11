
document.addEventListener("DOMContentLoaded",function(){
  buildLightbox();
  initSwap();
  initDays();
  initSnow();
  initCube();
});

function buildLightbox(){
  var lb=document.createElement("div");
  lb.className="lb";
  lb.innerHTML='<div class="lb-box"><button class="lb-close">&times;</button><img class="lb-img" src="" alt=""/><p class="lb-cap"></p></div>';
  document.body.appendChild(lb);
  var img=lb.querySelector(".lb-img"),cap=lb.querySelector(".lb-cap"),btn=lb.querySelector(".lb-close");
  function open(src,c){img.src=src;cap.textContent=c||"";lb.classList.add("show");document.body.style.overflow="hidden";}
  function close(){lb.classList.remove("show");document.body.style.overflow="";setTimeout(function(){img.src="";},300);}
  btn.addEventListener("click",close);
  lb.addEventListener("click",function(e){if(e.target===lb)close();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")close();});
  document.querySelectorAll("[data-zoom]").forEach(function(el){
    if(el.closest(".diptych"))return;
    el.style.cursor="pointer";
    el.addEventListener("click",function(){
      open(el.getAttribute("data-zoom"),el.getAttribute("data-cap")||"");
    });
  });
  window._lb=open;
}

function initSwap(){
  document.querySelectorAll(".diptych").forEach(function(d){
    d.addEventListener("click",function(){d.classList.toggle("swapped");});
  });
}

function initDays(){
  var el=document.getElementById("dayCount"),ae=document.getElementById("ageEl"),de=document.getElementById("dateEl");
  if(!el)return;
  var birth=new Date(2002,10,17),now=new Date();
  var days=Math.floor((Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())-Date.UTC(2002,10,17))/864e5);
  var age=now.getFullYear()-2002,m=now.getMonth()-10;
  if(m<0||(m===0&&now.getDate()<17))age--;
  el.textContent=days.toLocaleString("zh-CN");
  if(ae)ae.textContent=age;
  if(de)de.textContent=now.getFullYear()+"."+String(now.getMonth()+1).padStart(2,"0")+"."+String(now.getDate()).padStart(2,"0");
}

function initSnow(){
  var c=document.getElementById("snowCanvas");if(!c)return;
  var ctx=c.getContext("2d"),w,h;
  function resize(){w=c.width=innerWidth;h=c.height=innerHeight;}resize();
  window.addEventListener("resize",resize);
  var n=Math.min(55,Math.floor(innerWidth/18)),fl=[];
  for(var i=0;i<n;i++)fl.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*2.5+.6,s:Math.random()*.7+.3,d:Math.random()*.5-.25,o:Math.random()*.5+.2});
  function draw(){
    ctx.clearRect(0,0,w,h);
    fl.forEach(function(f){
      ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fillStyle="rgba(255,255,255,"+f.o+")";ctx.fill();
      f.y+=f.s;f.x+=f.d;
      if(f.y>h){f.y=-5;f.x=Math.random()*w;}
      if(f.x<0)f.x=w;if(f.x>w)f.x=0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function initCube(){
  var stage=document.getElementById("cubeStage"),box=document.getElementById("cubeBox");
  if(!stage||!box)return;
  var spinning=true,expanded=false,rx=-18,ry=22,dragging=false,sx=0,sy=0;
  var btnSpin=document.getElementById("btnSpin"),btnOpen=document.getElementById("btnOpen"),btnReset=document.getElementById("btnReset");
  if(btnSpin)btnSpin.addEventListener("click",function(){
    spinning=!spinning;box.classList.toggle("spin",spinning);
    btnSpin.classList.toggle("on",spinning);
    btnSpin.textContent=spinning?"⏸ 暂停":"▶ 旋转";
    if(!spinning)box.style.transform="rotateX("+rx+"deg) rotateY("+ry+"deg)";
  });
  if(btnOpen)btnOpen.addEventListener("click",function(){
    expanded=!expanded;stage.classList.toggle("open",expanded);
    btnOpen.classList.toggle("on",expanded);
    btnOpen.textContent=expanded?"📦 合拢":"✨ 展开";
  });
  if(btnReset)btnReset.addEventListener("click",function(){rx=-18;ry=22;box.style.transform="rotateX("+rx+"deg) rotateY("+ry+"deg)";});
  function pd(e){
    dragging=true;var t=e.touches?e.touches[0]:e;sx=t.clientX;sy=t.clientY;
    if(spinning){spinning=false;box.classList.remove("spin");if(btnSpin){btnSpin.classList.remove("on");btnSpin.textContent="▶ 旋转";}box.style.transform="rotateX("+rx+"deg) rotateY("+ry+"deg)";}
  }
  function pm(e){
    if(!dragging)return;var t=e.touches?e.touches[0]:e;
    ry+=(t.clientX-sx)*.45;rx-=(t.clientY-sy)*.45;
    rx=Math.max(-85,Math.min(85,rx));
    box.style.transform="rotateX("+rx+"deg) rotateY("+ry+"deg)";
    sx=t.clientX;sy=t.clientY;
  }
  stage.addEventListener("mousedown",pd);window.addEventListener("mousemove",pm);window.addEventListener("mouseup",function(){dragging=false;});
  stage.addEventListener("touchstart",pd,{passive:true});window.addEventListener("touchmove",pm,{passive:true});window.addEventListener("touchend",function(){dragging=false;},{passive:true});
}
