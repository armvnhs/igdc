
var hd=document.getElementById('hdr'),mb=document.getElementById('mb');

function mn(o){hd.classList.toggle('open',o);mb.setAttribute('aria-expanded',o?'true':'false');mb.setAttribute('aria-label',o?'بستن منو':'باز کردن منو')}
mb.onclick=function(){mn(!hd.classList.contains('open'))};
document.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',function(){mn(false)})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')mn(false)});
document.addEventListener('click',function(e){if(!hd.contains(e.target))mn(false)});

var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var word=document.querySelector('.stage b'),stage=document.querySelector('.stage'),tick=0;
function par(){tick=0;if(!word||!stage)return;var t=stage.getBoundingClientRect().top;if(t<innerHeight&&t>-innerHeight){var v=Math.max(-22,Math.min(22,-t*0.055));word.style.transform='translate3d(0,'+v+'px,0)'}}
if(word&&!reduce){addEventListener('scroll',function(){if(!tick)tick=requestAnimationFrame(par)},{passive:true});par()}

var form=document.getElementById('cf'),fst=document.getElementById('fstat');
if(form){form.addEventListener('submit',function(e){e.preventDefault();if(!form.checkValidity()){form.reportValidity();return}var data=new FormData(form);var subject='باشگاه طراحان گرافیک اصفهان — '+data.get('subject');var body='نام: '+data.get('name')+'\nایمیل: '+data.get('email')+'\n\n'+data.get('message');fst.textContent='پیش‌نویس در برنامهٔ ایمیل شما باز می‌شود؛ ارسال را همان‌جا تکمیل کنید.';window.location.href='mailto:'+(form.dataset.recipient||'hello@igdc.ir')+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)})}

var lb=document.getElementById('lb'),lbi=document.getElementById('lbimg');
var lastTile=null;
function openTile(tile){var im=tile.querySelector('.shot');if(!im||!im.naturalWidth)return;lastTile=tile;lbi.src=im.currentSrc||im.src;lbi.alt=im.alt||'';lb.hidden=false;document.body.style.overflow='hidden';document.getElementById('lbx').focus()}
document.addEventListener('click',function(e){var tile=e.target.closest('.tile');if(tile)openTile(tile)});
document.addEventListener('keydown',function(e){var tile=e.target.closest('.tile');if(tile&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openTile(tile)}});
function lbc(){lb.hidden=true;lbi.removeAttribute('src');document.body.style.overflow='';if(lastTile)lastTile.focus()}
document.getElementById('lbx').onclick=lbc;
lb.addEventListener('click',function(e){if(e.target===lb)lbc()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)lbc()});

var els=document.querySelectorAll('.rv'),secs=[].slice.call(document.querySelectorAll('main section[id]')),mp={};
document.querySelectorAll('nav a').forEach(function(a){mp[a.getAttribute('href')]=a});
els.forEach(function(e){var n=0,s=e.previousElementSibling;while(s){if(s.classList&&s.classList.contains('rv'))n++;s=s.previousElementSibling}e.style.animationDelay=Math.min(n,5)*70+'ms'});
if('IntersectionObserver' in window){
var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');o.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
els.forEach(function(e){o.observe(e)});
var sp=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var k='#'+e.target.id;for(var x in mp){if(x.charAt(0)!=='#')continue;var on=x===k;mp[x].classList.toggle('on',on);if(on)mp[x].setAttribute('aria-current','page');else mp[x].removeAttribute('aria-current')}}})},{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(function(s){sp.observe(s)});
}else{els.forEach(function(e){e.classList.add('on')})}
