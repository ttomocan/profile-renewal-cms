// JS が動かない場合は最終字形を表示。ロード失敗時も待ち続けない。
export const handwritingScript = `(function(){
var root=document.currentScript.parentElement;
try {
 if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 root.dataset.handwriting='pending';
 var settled=false;
 var fallback=setTimeout(function(){settled=true;delete root.dataset.handwriting;},5000);
 function start(){
  if(settled) return;
  settled=true;
  clearTimeout(fallback);
  root.dataset.handwriting='drawing';
  setTimeout(function(){delete root.dataset.handwriting;},2600);
 }
 if(document.readyState==='complete') requestAnimationFrame(start);
 else window.addEventListener('load',start,{once:true});
} catch(e){delete root.dataset.handwriting;}
})();`;
