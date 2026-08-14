/* Click sparkle for kathryn-portfolio.com
 *
 * The custom ARROW no longer lives here. It is a CSS `cursor: url(<png>)` rule
 * inlined into every page's <head> (look for <style id="cursor-css">), because a
 * stale cached copy of this file made it impossible to tell whether a fix had
 * actually reached the browser. Inline ships with the page; nothing to cache.
 *
 * This file now only draws the sparkle burst on click.
 *
 * Three hard-won rules, all from the Aug 2026 debugging session:
 *
 * Rules learned the hard way, kept here because this is where anyone will look:
 *
 *   1. NEVER hide the native cursor first. The original design set `cursor: none`
 *      on <html> and drew a <div> arrow from JS, so any failure left NO cursor at
 *      all. Every cursor rule now ends in `, auto` or `, pointer`.
 *   2. ONE plain `url()` per rule, never `image-set()`. Chrome accepts image-set
 *      in the cursor property, wins the cascade with it, then paints nothing.
 *   3. A computed `cursor` value of `url(...)` does NOT prove the cursor renders.
 *      Only looking at the screen does.
 *
 * Pages load this before </body>:   <script src="../cursor.js?v=4"></script>
 */
(function () {

  // Bumped whenever this file changes, so a stale cached copy is obvious.
  window.CURSOR_JS_VERSION = 4;

  // Touch devices have no pointer to restyle.
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  /* ---- click sparkle, unchanged ---------------------------------------- */

  var COLORS = ['#C8B6E2', '#F4D1CB', '#A8D8EA', '#FFDAB9', '#C5D5CB', '#E8735A', '#c75d8f'];

  var glitterStyle = document.createElement('style');
  glitterStyle.textContent = [
    '@keyframes glitter-out {',
    '  0%   { opacity:0.9; transform:translate(-50%,-50%) scale(1.1) rotate(0deg); }',
    '  60%  { opacity:0.5; }',
    '  100% { opacity:0; transform:translate(calc(-50% + var(--gx)),calc(-50% + var(--gy))) scale(0) rotate(var(--gr)); }',
    '}',
    '.cur-glitter {',
    '  position:fixed; pointer-events:none; z-index:999997;',
    '  transform:translate(-50%,-50%);',
    '  animation:glitter-out var(--gd) ease-out forwards;',
    '}'
  ].join('\n');
  (document.head || document.documentElement).appendChild(glitterStyle);

  function spawnGlitter(x, y) {
    var el = document.createElement('div');
    el.className = 'cur-glitter';
    var isStar = Math.random() > 0.4;
    var size  = isStar ? (4 + Math.random() * 5) : (3 + Math.random() * 4);
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];
    var gx    = (-20 + Math.random() * 40).toFixed(1) + 'px';
    var gy    = (-20 + Math.random() * 40).toFixed(1) + 'px';
    var gr    = (-180 + Math.random() * 360).toFixed(0) + 'deg';
    var dur   = (500 + Math.random() * 400).toFixed(0) + 'ms';
    el.style.cssText = [
      'left:' + x + 'px', 'top:' + y + 'px',
      'width:' + size + 'px', 'height:' + size + 'px',
      'background:' + color,
      '--gx:' + gx, '--gy:' + gy, '--gr:' + gr, '--gd:' + dur,
      isStar
        ? 'clip-path:polygon(50% 0%,56% 44%,100% 50%,56% 56%,50% 100%,44% 56%,0% 50%,44% 44%)'
        : 'border-radius:50%',
      'filter:drop-shadow(0 0 3px ' + color + ')'
    ].join(';');
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, parseInt(dur) + 50);
  }

  document.addEventListener('click', function (e) {
    for (var i = 0; i < 9; i++) {
      (function (d) {
        setTimeout(function () { spawnGlitter(e.clientX, e.clientY); }, d);
      })(i * 25);
    }
  });

})();
