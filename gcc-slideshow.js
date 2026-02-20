(function(){
'use strict';

var CDN='https://res.cloudinary.com/dy2cmsmu1/image/upload';
var TOTAL=56;
var PH='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function sImg(n,w){return CDN+'/f_auto,q_auto'+(w?',w_'+w:'')+'/stock/'+n+'.png';}
function gImg(n,w){return CDN+'/f_auto,q_auto'+(w?',w_'+w:'')+'/gcam/'+n+'.png';}

var scenes=[
  'Daylight Landscape','Urban Street','Portrait Close-up','Indoor Warmth','Golden Hour Glow',
  'Night Cityscape','Macro Detail','Food Photography','Architecture Lines','Sky & Clouds',
  'Sunset Palette','Low Light Room','Backlit Subject','HDR Highlight','Color Accuracy',
  'Shadow Recovery','Highlight Detail','White Balance','Skin Tone Test','Green Foliage',
  'Open Blue Sky','Cozy Interior','Cool Exterior','Surface Texture','Fine Pattern',
  'High Contrast','Flat Even Light','Dramatic Side Light','Dynamic Range','Noise Handling',
  'Edge Sharpness','Bokeh Rendering','Wide Angle View','Telephoto Zoom','Mixed Lighting',
  'Vivid Saturation','Muted Pastels','Natural Scenery','Night Street','Dawn Colors',
  'Twilight Blues','Overcast Mood','Bright Outdoors','Dim Ambient','Tonal Gradient',
  'Deep Shadows','Crisp Whites','Mid-tone Balance','Rich Color Depth','Micro Contrast',
  'Overall Clarity','Resolve Detail','Processing Style','True-to-Life','Final Verdict','Bonus Shot'
];

var SVG_DRAG='<svg viewBox="0 0 24 24"><path d="M8.5 8.5L4 12l4.5 3.5M15.5 8.5L20 12l-4.5 3.5"/></svg>';
var SVG_EXPAND='<svg viewBox="0 0 24 24"><path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z"/></svg>';
var SVG_SEARCH='<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/></svg>';

var cur=0,mIdx=0,mMode='sbs',mOpen=false,isDragging=false;

function $(s,c){return(c||document).querySelector(s);}
function $$(s,c){return(c||document).querySelectorAll(s);}

/* MAIN SLIDESHOW */
function buildMain(){
  var root=$('#gccRoot');
  var h='';
  h+='<div class="gcc-hdr">';
  h+='<span class="gcc-badge">📱 Camera Comparison</span>';
  h+='<h2 class="gcc-title">Stock Camera vs GCam — Real Shots</h2>';
  h+='<p class="gcc-desc">56 side-by-side comparisons. Click any image for a detailed interactive view with drag-to-compare.</p>';
  h+='</div><div class="gcc-show" id="gccShow"><div class="gcc-vp" id="gccVp">';

  for(var i=0;i<TOTAL;i++){
    var n=i+1,isEarly=i<3;
    h+='<div class="gcc-slide'+(i===0?' active':'')+'" data-i="'+i+'"><div class="gcc-sbs"><div class="gcc-pnl">';
    h+='<img src="'+(isEarly?sImg(n,600):PH)+'"'+(isEarly?'':' data-src="'+sImg(n,600)+'"')+' alt="Stock Camera Sample '+n+'">';
    h+='<span class="gcc-tag gcc-tag-s">📷 Stock</span></div><div class="gcc-pnl">';
    h+='<img src="'+(isEarly?gImg(n,600):PH)+'"'+(isEarly?'':' data-src="'+gImg(n,600)+'"')+' alt="GCam Sample '+n+'">';
    h+='<span class="gcc-tag gcc-tag-g">📸 GCam</span></div></div>';
    h+='<div class="gcc-cap">'+scenes[i]+' — Sample '+n+' of '+TOTAL+'</div></div>';
  }

  h+='<div class="gcc-hover"><div class="gcc-hover-icon">'+SVG_EXPAND+'</div><span>Click for detailed comparison</span></div></div>';
  h+='<div class="gcc-hint" id="gccHint">'+SVG_SEARCH+'<span>Tap to explore in full-screen detail</span></div>';
  h+='<div class="gcc-nav"><button class="gcc-btn" id="gccPrev" aria-label="Previous slide">&#9664;</button>';
  h+='<div class="gcc-prog" id="gccProgWrap"><div class="gcc-prog-bar" id="gccProg" style="width:'+(100/TOTAL).toFixed(2)+'%"></div></div>';
  h+='<span class="gcc-cnt" id="gccCnt">1 / '+TOTAL+'</span>';
  h+='<button class="gcc-btn" id="gccNext" aria-label="Next slide">&#9654;</button></div></div>';
  root.innerHTML=h;
}

/* MODAL */
function buildModal(){
  var m=$('#gccModal');
  var h='<div class="gcc-m-bg" id="gccMBg"></div><div class="gcc-m-wrap">';
  h+='<div class="gcc-m-head"><div class="gcc-m-toggle" id="gccTog"><button class="active" data-mode="sbs">☷ Side by Side</button><button data-mode="drag">⇔ Drag Compare</button></div>';
  h+='<div class="gcc-m-info"><span class="gcc-m-cnt" id="gccMCnt">1 / '+TOTAL+'</span><button class="gcc-m-close" id="gccMClose" aria-label="Close">✕</button></div></div>';
  h+='<div class="gcc-m-body" id="gccMBody"><button class="gcc-m-arrow prev" id="gccMP" aria-label="Previous">&#9664;</button><div class="gcc-m-content" id="gccMC"></div><button class="gcc-m-arrow next" id="gccMN" aria-label="Next">&#9654;</button></div>';
  h+='<div class="gcc-m-cap" id="gccMCap"></div><div class="gcc-m-foot">';

  /* ADS */
  h+='<div class="gcc-ad-desk"><div class="gcc-ad-lb"><div class="gcc-ad-slot"><span class="gcc-ad-lbl">Advertisement</span><div class="gcc-ad-ph">[ 728×90 Leaderboard — Paste ad code here ]</div></div></div></div>';
  h+='<div class="gcc-ad-mob"><div class="gcc-ad-mb"><div class="gcc-ad-slot"><span class="gcc-ad-lbl">Advertisement</span><div class="gcc-ad-ph">[ 320×50 Mobile — Paste ad code here ]</div></div></div></div>';
  h+='</div></div>';
  m.innerHTML=h;
  if(!document.body.contains(m)) document.body.appendChild(m);
}

function renderModal(){
  var n=mIdx+1;
  var mc=$('#gccMC');
  var s=sImg(n,1200),g=gImg(n,1200);
  var h='';
  if(mMode==='sbs'){
    h+='<div class="gcc-m-sbs"><div class="gcc-m-sbs-pnl"><img src="'+s+'" alt="Stock '+n+'"><span class="gcc-tag gcc-tag-s">📷 Stock</span></div>';
    h+='<div class="gcc-m-sbs-pnl"><img src="'+g+'" alt="GCam '+n+'"><span class="gcc-tag gcc-tag-g">📸 GCam</span></div></div>';
  } else {
    h+='<div class="gcc-m-drag" id="gccDrag"><div class="gcc-m-drag-after"><img src="'+g+'" alt="GCam '+n+'"></div>';
    h+='<div class="gcc-m-drag-before"><img src="'+s+'" alt="Stock '+n+'"></div><div class="gcc-m-drag-line"></div>';
    h+='<div class="gcc-m-drag-knob">'+SVG_DRAG+'</div><span class="gcc-tag gcc-tag-s" style="top:14px;left:14px">📷 Stock</span><span class="gcc-tag gcc-tag-g" style="top:14px;right:14px">📸 GCam</span></div>';
  }
  mc.innerHTML=h;
  $('#gccMCnt').textContent=(mIdx+1)+' / '+TOTAL;
  $('#gccMCap').textContent=scenes[mIdx]+' — Sample '+n+' of '+TOTAL;
}

function goSlide(idx){
  if(idx<0)idx=TOTAL-1;if(idx>=TOTAL)idx=0;
  $$('.gcc-slide',$('#gccShow'))[cur].classList.remove('active');
  cur=idx;
  $$('.gcc-slide',$('#gccShow'))[cur].classList.add('active');
  $('#gccProg').style.width=((cur+1)/TOTAL*100).toFixed(2)+'%';
  $('#gccCnt').textContent=(cur+1)+' / '+TOTAL;
  loadNear(cur);
}

function loadNear(idx){
  for(var d=-2;d<=2;d++){
    var si=idx+d;if(si<0||si>=TOTAL)continue;
    var imgs=$$('.gcc-slide[data-i="'+si+'"] img[data-src]');
    for(var j=0;j<imgs.length;j++){imgs[j].src=imgs[j].getAttribute('data-src');imgs[j].removeAttribute('data-src');}
  }
}

function openModal(idx){
  mIdx=idx;mOpen=true;
  renderModal();
  $('#gccModal').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeModal(){
  mOpen=false;
  $('#gccModal').classList.remove('open');
  document.body.style.overflow='';
  goSlide(mIdx);
}

function goModal(idx){
  if(idx<0)idx=TOTAL-1;if(idx>=TOTAL)idx=0;
  mIdx=idx;renderModal();
}

function setMode(mode){
  if(mode===mMode)return;mMode=mode;
  var btns=$$('#gccTog button');
  for(var i=0;i<btns.length;i++)btns[i].classList.toggle('active',btns[i].getAttribute('data-mode')===mode);
  renderModal();
}

function initDrag(){
  document.addEventListener('pointerdown',function(e){
    var dc=e.target.closest('#gccDrag');if(!dc)return;
    e.preventDefault();isDragging=true;dc.setPointerCapture(e.pointerId);
    moveDrag(dc,e.clientX);
    function onMove(ev){moveDrag(dc,ev.clientX);}
    function onUp(){isDragging=false;dc.removeEventListener('pointermove',onMove);dc.removeEventListener('pointerup',onUp);dc.removeEventListener('pointercancel',onUp);}
    dc.addEventListener('pointermove',onMove);dc.addEventListener('pointerup',onUp);dc.addEventListener('pointercancel',onUp);
  });
}

function moveDrag(dc,cx){
  var r=dc.getBoundingClientRect();
  var pct=Math.max(0,Math.min(100,((cx-r.left)/r.width)*100));
  var bf=$('.gcc-m-drag-before',dc),ln=$('.gcc-m-drag-line',dc),kb=$('.gcc-m-drag-knob',dc);
  if(bf)bf.style.clipPath='inset(0 '+(100-pct)+'% 0 0)';
  if(ln)ln.style.left=pct+'%';
  if(kb)kb.style.left=pct+'%';
}

function initEvents(){
  $('#gccPrev').addEventListener('click',function(e){e.stopPropagation();goSlide(cur-1);});
  $('#gccNext').addEventListener('click',function(e){e.stopPropagation();goSlide(cur+1);});
  $('#gccVp').addEventListener('click',function(){openModal(cur);});
  $('#gccHint').addEventListener('click',function(){openModal(cur);});
  $('#gccMClose').addEventListener('click',closeModal);
  $('#gccMBg').addEventListener('click',closeModal);
  $('#gccMP').addEventListener('click',function(){goModal(mIdx-1);});
  $('#gccMN').addEventListener('click',function(){goModal(mIdx+1);});
  $('#gccTog').addEventListener('click',function(e){var btn=e.target.closest('button');if(btn)setMode(btn.getAttribute('data-mode'));});

  document.addEventListener('keydown',function(e){
    if(mOpen){
      if(e.key==='Escape')closeModal();
      if(e.key==='ArrowLeft')goModal(mIdx-1);
      if(e.key==='ArrowRight')goModal(mIdx+1);
      if(e.key==='d'||e.key==='D')setMode(mMode==='sbs'?'drag':'sbs');
    } else {
      var show=$('#gccShow');if(!show)return;
      var r=show.getBoundingClientRect();
      if(r.top>window.innerHeight||r.bottom<0)return;
      if(e.key==='ArrowLeft')goSlide(cur-1);
      if(e.key==='ArrowRight')goSlide(cur+1);
      if(e.key==='Enter')openModal(cur);
    }
  });

  var sx=0,vp=$('#gccVp');
  vp.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  vp.addEventListener('touchend',function(e){if(!sx)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45){dx<0?goSlide(cur+1):goSlide(cur-1);}sx=0;});

  var msx=0,mBody=$('#gccMBody');
  mBody.addEventListener('touchstart',function(e){if(e.target.closest('.gcc-m-drag')){msx=0;return;}msx=e.touches[0].clientX;},{passive:true});
  mBody.addEventListener('touchend',function(e){if(!msx||isDragging)return;var dx=e.changedTouches[0].clientX-msx;if(Math.abs(dx)>45){dx<0?goModal(mIdx+1):goModal(mIdx-1);}msx=0;},{passive:true});

  $('#gccProgWrap').addEventListener('click',function(e){var r=this.getBoundingClientRect();goSlide(Math.round(((e.clientX-r.left)/r.width)*(TOTAL-1)));});
}

function init(){
  buildMain();
  buildModal();
  loadNear(0);
  initDrag();
  initEvents();
  // Auto-open if the user clicked the skeleton slide before script loaded
  if(window.gccNeedsAutoOpen) openModal(0);
}

// Execute immediately since the lazy loader only fetches this when needed
init();

})();