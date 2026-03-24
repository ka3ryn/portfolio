(function () {

  // Traced from reference image (viewBox 0 0 32 34):
  // T=tip(2,2)  R=right-outer(28,18)  N=notch(22,22)  B=bottom(8,30)
  // N is close to R creating the tight concave angle seen in the image.
  //
  // Corner radii: T=1.5, R=3, N=3, B=3.5
  // Light face: T→R→N→T  |  Dark face: T→N→B→T
  // Shared dividing edge: (3.1,3.1)↔(19.9,19.9)

  var cursor = document.createElement('div');
  cursor.id  = 'cur-arrow';
  cursor.innerHTML = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="34" viewBox="0 0 32 34" fill="none">',
    '  <defs>',
    '    <filter id="s" x="-40%" y="-40%" width="220%" height="220%">',
    '      <feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-color="rgba(160,70,40,0.28)"/>',
    '    </filter>',
    '  </defs>',

    // Light face: T → R → N → back to T along dividing line
    '  <path d="M3.3,2.8 L25.4,16.4 Q28,18 25.5,19.7 L24.5,20.3 Q22,22 19.9,19.9 L3.1,3.1 Q2,2 3.3,2.8 Z"',
    '    fill="#FF9575"/>',

    // Dark face: T → along dividing line to N → B → back to T
    '  <path d="M3.1,3.1 L19.9,19.9 Q22,22 19.4,23.5 L11.0,28.3 Q8,30 7.3,26.6 L2.3,3.5 Q2,2 3.1,3.1 Z"',
    '    fill="#D45A38"/>',

    // Drop shadow on full outer shape
    '  <path d="M3.3,2.8 L25.4,16.4 Q28,18 25.5,19.7 L24.5,20.3 Q22,22 19.4,23.5 L11.0,28.3 Q8,30 7.3,26.6 L2.3,3.5 Q2,2 3.3,2.8 Z"',
    '    fill="none" filter="url(#s)"/>',
    '</svg>',
  ].join('');
  document.body.appendChild(cursor);

  var style = document.createElement('style');
  style.textContent = [
    '* { cursor: none !important; }',
    '#cur-arrow { position:fixed; pointer-events:none; z-index:999999; }',

    '@keyframes glitter-out {',
    '  0%   { opacity:0.9; transform:translate(-50%,-50%) scale(1.1) rotate(0deg); }',
    '  60%  { opacity:0.5; }',
    '  100% { opacity:0; transform:translate(calc(-50% + var(--gx)),calc(-50% + var(--gy))) scale(0) rotate(var(--gr)); }',
    '}',
    '.cur-glitter {',
    '  position:fixed; pointer-events:none; z-index:999997;',
    '  transform:translate(-50%,-50%);',
    '  animation:glitter-out var(--gd) ease-out forwards;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  var mx = 0, my = 0;
  var COLORS = ['#C8B6E2','#F4D1CB','#A8D8EA','#FFDAB9','#C5D5CB','#E8735A','#c75d8f'];

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

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
      'filter:drop-shadow(0 0 3px ' + color + ')',
    ].join(';');
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, parseInt(dur) + 50);
  }

  document.addEventListener('click', function (e) {
    for (var i = 0; i < 9; i++) {
      (function (d) { setTimeout(function () { spawnGlitter(e.clientX, e.clientY); }, d); })(i * 25);
    }
  });

})();
