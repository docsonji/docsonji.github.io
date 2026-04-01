document.addEventListener('DOMContentLoaded', function(){
  const buttons = document.querySelectorAll('.copy-btn');
  const status = document.getElementById('contact-msg');
  if(!buttons) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const text = btn.dataset.copy;
      if(!text) return;
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){
          await navigator.clipboard.writeText(text);
        } else {
          // fallback
          const ta = document.createElement('textarea');
          ta.value = text; document.body.appendChild(ta);
          ta.select(); document.execCommand('copy');
          document.body.removeChild(ta);
        }
        // feedback
        const prevHTML = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        if(status){ status.textContent = 'Copied: ' + text; }
        setTimeout(()=>{ btn.classList.remove('copied'); btn.innerHTML = prevHTML; if(status) status.textContent = ''; }, 1500);
      }catch(err){
        if(status) status.textContent = 'Copy failed';
        console.error('copy failed', err);
      }
    });
  });
});
