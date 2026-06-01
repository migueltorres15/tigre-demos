(function(){
  'use strict';
  function safe(fn,n){try{fn();}catch(e){console.warn('[TanYua]',n,e);}}
  function waitGSAP(cb){if(window.gsap&&window.ScrollTrigger){cb();return;}var t=0,p=setInterval(function(){t+=100;if(window.gsap&&window.ScrollTrigger){clearInterval(p);cb();}if(t>4000){clearInterval(p);cb();}},100);}

  setTimeout(function(){
    document.querySelectorAll('.reveal:not(.in-view)').forEach(function(el){el.style.opacity='1';el.style.transform='none';el.classList.add('in-view');});
  },6000);

  function initNav(){
    var nav=document.getElementById('nav');
    if(!nav)return;
    window.addEventListener('scroll',function(){nav.classList.toggle('solid',window.scrollY>60);},{passive:true});
    var burger=document.getElementById('navBurger');
    var drawer=document.getElementById('navDrawer');
    if(burger&&drawer){
      burger.addEventListener('click',function(){drawer.classList.toggle('open');});
      drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){drawer.classList.remove('open');});});
    }
  }

  function initAnchors(){
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click',function(e){
        var id=a.getAttribute('href').slice(1);var t=id&&document.getElementById(id);
        if(!t)return;e.preventDefault();
        window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-72,behavior:'smooth'});
      });
    });
  }

  function initReveal(){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting)return;
        var el=entry.target;
        var siblings=Array.from((el.parentElement||document.body).querySelectorAll('.reveal'));
        setTimeout(function(){el.classList.add('in-view');},Math.min(siblings.indexOf(el)*70,350));
        io.unobserve(el);
      });
    },{threshold:0.05,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  }

  function initHero(){
    if(!window.gsap)return;
    var logo=document.querySelector('.hero-logo-wrap');
    var rest=['.hero-tagline','.hero-rule','.hero-services','.hero-ctas'].map(function(s){return document.querySelector(s);}).filter(Boolean);
    var tl=gsap.timeline({delay:0.4});
    if(logo)tl.fromTo(logo,{opacity:0},{opacity:1,duration:2.0,ease:'power1.inOut'});
    if(rest.length)tl.fromTo(rest,{opacity:0,y:14},{opacity:1,y:0,duration:1.0,ease:'power2.out',stagger:0.14},'+=0.1');
  }

  function initGSAP(){
    if(!window.gsap||!window.ScrollTrigger)return;
    gsap.registerPlugin(ScrollTrigger);
    safe(function(){gsap.to('.hero-bg-img',{yPercent:18,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.5}});},'heroParallax');
    safe(function(){
      var cards=document.querySelectorAll('.svc-card,.paq-card');
      gsap.fromTo(cards,{opacity:0,y:40},{opacity:1,y:0,duration:.7,ease:'power2.out',stagger:.08,
        scrollTrigger:{trigger:'.svc-grid, .paq-grid',start:'top 82%',once:true},
        onComplete:function(){cards.forEach(function(c){c.classList.add('in-view');});}
      });
    },'cards');
    safe(function(){gsap.to('.cta-bg img',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.cta-section',start:'top bottom',end:'bottom top',scrub:1.5}});},'ctaParallax');
  }

  window.handleNewsletter=function(e){
    e.preventDefault();
    var btn=e.target.querySelector('button');var input=e.target.querySelector('.nl-input');
    if(btn)btn.textContent='¡Suscrita! ✓';if(input)input.value='';
    setTimeout(function(){if(btn)btn.textContent='Suscribirse →';},3000);
  };

  function init(){
    safe(initNav,'nav');safe(initAnchors,'anchors');safe(initReveal,'reveal');
    waitGSAP(function(){safe(initHero,'hero');safe(initGSAP,'gsap');});
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
