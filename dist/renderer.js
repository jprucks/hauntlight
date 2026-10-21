/* Hauntlight canvas projection renderer. Perspective math: perspective-transform 1.1.3 (MIT). */
(function (root) {
  'use strict';
  function finite(n) { return typeof n === 'number' && isFinite(n); }
  function clamp(n, low, high, fallback) { return finite(n) ? Math.max(low, Math.min(high, n)) : fallback; }
  function validQuad(p) {
    if (!Array.isArray(p) || p.length !== 4) return false;
    var i, area = 0, sign = 0;
    for (i = 0; i < 4; i++) {
      if (!Array.isArray(p[i]) || p[i].length !== 2 || !finite(p[i][0]) || !finite(p[i][1])) return false;
    }
    for (i = 0; i < 4; i++) {
      var a = p[i], b = p[(i + 1) % 4], c = p[(i + 2) % 4];
      var cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      if (Math.abs(cross) < 0.00001 || (sign && cross * sign <= 0)) return false;
      sign = cross;
      area += a[0] * b[1] - b[0] * a[1];
    }
    return Math.abs(area) > 0.0001;
  }
  function matrix(p, width, height, sourceWidth, sourceHeight) {
    if (!validQuad(p) || !finite(width) || !finite(height) || !finite(sourceWidth) || !finite(sourceHeight) || Math.min(width, height, sourceWidth, sourceHeight) <= 0) return null;
    try {
      // Solve in normalized coordinates to avoid ill-conditioned pixel-sized normal equations.
      var flat = [], i;
      for (i = 0; i < 4; i++) flat.push(p[i][0], p[i][1]);
      var h = new root.PerspT([0, 0, 1, 0, 1, 1, 0, 1], flat).coeffs;
      for (i = 0; i < 9; i++) if (!finite(h[i])) return null;
      // The homography must not cross its plane at infinity inside the source rectangle.
      if (Math.min(1, 1 + h[6], 1 + h[7], 1 + h[6] + h[7]) <= 0.000001) return null;
      return [h[0] * width / sourceWidth, h[3] * height / sourceWidth, 0, h[6] / sourceWidth,
        h[1] * width / sourceHeight, h[4] * height / sourceHeight, 0, h[7] / sourceHeight,
        0, 0, 1, 0, h[2] * width, h[5] * height, 0, 1];
    } catch (error) { return null; }
  }
  function canvas() { return root.document.createElement('canvas'); }
  function makeMask(w, h, feather, shape) {
    var mask = canvas(), c = mask.getContext('2d');
    mask.width = w; mask.height = h;
    if (shape === 'ellipse') {
      c.save(); c.translate(w / 2, h / 2); c.scale(w / 2, h / 2);
      if (feather > 0) {
        var radial = c.createRadialGradient(0, 0, Math.max(0, 1 - feather * 2), 0, 0, 1);
        radial.addColorStop(0, 'rgba(255,255,255,1)'); radial.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = radial;
      } else c.fillStyle = '#fff';
      c.beginPath(); c.arc(0, 0, 1, 0, Math.PI * 2); c.fill(); c.restore();
    } else {
      c.fillStyle = '#fff'; c.fillRect(0, 0, w, h);
      if (feather > 0) {
        var edge = Math.min(w, h) * feather;
        c.globalCompositeOperation = 'destination-in';
        var horizontal = c.createLinearGradient(0, 0, w, 0);
        horizontal.addColorStop(0, 'rgba(255,255,255,0)'); horizontal.addColorStop(edge / w, '#fff');
        horizontal.addColorStop(1 - edge / w, '#fff'); horizontal.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = horizontal; c.fillRect(0, 0, w, h);
        var vertical = c.createLinearGradient(0, 0, 0, h);
        vertical.addColorStop(0, 'rgba(255,255,255,0)'); vertical.addColorStop(edge / h, '#fff');
        vertical.addColorStop(1 - edge / h, '#fff'); vertical.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = vertical; c.fillRect(0, 0, w, h);
      }
    }
    return mask;
  }
  function grid(c, w, h, label) {
    c.fillStyle = '#071312'; c.fillRect(0, 0, w, h);
    c.lineWidth = 1; c.strokeStyle = '#72cbb5';
    c.beginPath();
    for (var i = 0; i <= 10; i++) { c.moveTo(i * w / 10, 0); c.lineTo(i * w / 10, h); c.moveTo(0, i * h / 10); c.lineTo(w, i * h / 10); }
    c.stroke(); c.lineWidth = 4; c.strokeStyle = '#fff'; c.strokeRect(2, 2, w - 4, h - 4);
    c.beginPath(); c.moveTo(0, 0); c.lineTo(w, h); c.moveTo(w, 0); c.lineTo(0, h); c.stroke();
    c.font = 'bold ' + Math.round(w / 22) + 'px sans-serif'; c.textAlign = 'center';
    c.fillStyle = '#071312'; c.fillRect(w * 0.18, h * 0.41, w * 0.64, h * 0.18);
    c.fillStyle = '#fff'; c.fillText(String(label || 'Surface').slice(0, 25), w / 2, h * 0.52);
  }
  function HauntRenderer(container) {
    this.container = container; this.surfaces = []; this.records = Object.create(null); this.width = 1; this.height = 1;
    this.quality = 'balanced'; this.container.style.overflow = 'hidden';
  }
  HauntRenderer.prototype.setSurfaces = function (surfaces) {
    this.surfaces = surfaces || [];
    var keep = Object.create(null), self = this;
    this.surfaces.forEach(function (s) {
      var key = String(s.id), rec = self.records[key]; keep[key] = true;
      if (!rec) {
        var node = canvas(); node.className = 'projection-surface';
        node.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0;-webkit-transform-origin:0 0;pointer-events:none;';
        node.setAttribute('aria-hidden', 'true');
        rec = self.records[key] = { canvas: node, ctx: node.getContext('2d'), maskKey: '', transformKey: '' };
      }
      if(self.container.children[self.surfaces.indexOf(s)]!==rec.canvas)self.container.insertBefore(rec.canvas,self.container.children[self.surfaces.indexOf(s)]||null);
    });
    Object.keys(this.records).forEach(function (key) {
      if (!keep[key]) { self.records[key].canvas.remove(); delete self.records[key]; }
    });
  };
  HauntRenderer.prototype.resize = function (width, height) {
    this.width = Math.max(1, width); this.height = Math.max(1, height);
  };
  HauntRenderer.prototype.render = function (t, calibrate) {
    var self = this, w = this.sourceWidth || (this.quality === 'low' ? 384 : (this.quality === 'high' ? 768 : 512)), h = Math.round(w * 5 / 8);
    this.surfaces.forEach(function (s) {
      var rec = self.records[String(s.id)]; if (!rec) return;
      var node = rec.canvas;
      if (s.visible === false || s.opacity <= 0 || !validQuad(s.points)) { node.style.display = 'none'; return; }
      var transformKey = JSON.stringify(s.points) + ':' + self.width + ':' + self.height + ':' + w;
      if (transformKey !== rec.transformKey) {
        var m = matrix(s.points, self.width, self.height, w, h);
        if (!m) { node.style.display = 'none'; return; }
        node.style.transform = 'matrix3d(' + m.join(',') + ')';
        node.style.webkitTransform = node.style.transform; rec.transformKey = transformKey;
      }
      node.style.display = 'block'; node.style.opacity = String(clamp(s.opacity, 0, 1, 1));
      if (node.width !== w || node.height !== h) { node.width = w; node.height = h; }
      var paintKey = [calibrate ? 'grid' : s.scene, calibrate ? s.name : t * s.speed, w, self.quality, s.feather, s.shape].join(':');
      if(rec.paintKey === paintKey) return;
      rec.paintKey = paintKey;
      var c = rec.ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, w, h);
      c.save();
      if (calibrate) grid(c, w, h, s.name || s.id);
      else if (root.HauntScenes) root.HauntScenes.draw(c, s.scene, t * clamp(s.speed, 0.1, 3, 1), w, h, {detail:self.quality});
      c.restore();
      var feather = clamp(s.feather, 0, 0.4, 0), shape = s.shape === 'ellipse' ? 'ellipse' : 'quad';
      if (feather || shape === 'ellipse') {
        var maskKey = w + ':' + feather + ':' + shape;
        if (rec.maskKey !== maskKey) { rec.mask = makeMask(w, h, feather, shape); rec.maskKey = maskKey; }
        c.save(); c.globalCompositeOperation = 'destination-in'; c.drawImage(rec.mask, 0, 0); c.restore();
      }
    });
  };
  HauntRenderer.prototype.destroy = function () {
    var self = this; Object.keys(this.records).forEach(function (key) { self.records[key].canvas.remove(); });
    this.records = Object.create(null); this.surfaces = [];
  };
  root.HauntGeometry = { validQuad: validQuad, matrix: matrix };
  root.HauntRenderer = HauntRenderer;
}(typeof window !== 'undefined' ? window : globalThis));
