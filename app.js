const translations = {
  zh: {
    archive: '视觉作品档案', live: '本地预览', eyebrow: '东方意象 · 视觉实验 · 动态叙事', heroLineOne: '静观万象', heroLineTwo: '形与势皆在流动',
    heroNote: '一份由场景、人物与视频组成的视觉档案。以古意的秩序容纳当代的想象。', scroll: '向下浏览', heroHint: '选择一个入口开始',
    scenesKicker: '空间意象', scenesTitle: '场景', scenesIntro: '从一扇窗、一座桥、一片云海开始，收拢东方空间的光与气。',
    charactersKicker: '形神档案', charactersTitle: '人物角色', charactersIntro: '每一张脸都带着自己的气场；服饰、纹理与姿态共同构成角色的来处。',
    videosKicker: '时间影像', videosTitle: '视频', videosIntro: '把静止的意象推向下一秒，用运动、节奏和声音之外的画面完成叙事。',
    creaturesKicker: '灵兽图鉴', creaturesTitle: '幻想生物', creaturesIntro: '从羽翼、鳞甲到山海异形，记录不属于现实却有着真实气息的生命形态。',
    aboutKicker: '观物 · 造境 · 成像', aboutLineOne: '把东方的留白', aboutLineTwo: '留给想象继续生长', aboutBody: '这个档案以三种媒介展开：空间承载氛围，角色承载情绪，视频让一切发生。点击任意图片或封面，进入更大的观看尺度。',
    navHome: '序章', navScenes: '场景', navCharacters: '人物', navVideos: '视频', navCreatures: '灵兽', navAbout: '观览', loading: '正在整理视觉档案…', view: '展开观看', collection: '图像档案', play: '播放'
  },
  en: {
    archive: 'Visual archive', live: 'Local preview', eyebrow: 'Eastern imagery · visual studies · moving narratives', heroLineOne: 'A quiet study of everything', heroLineTwo: 'Form and force always in motion',
    heroNote: 'A visual archive made from spaces, characters and moving images — ancient order holding contemporary imagination.', scroll: 'Scroll to explore', heroHint: 'Choose an entry point',
    scenesKicker: 'Spatial imagery', scenesTitle: 'Scenes', scenesIntro: 'From a window, a bridge, a sea of clouds — collecting the light and atmosphere of imagined East.',
    charactersKicker: 'Form & spirit', charactersTitle: 'Characters', charactersIntro: 'Every face carries its own field of energy; costume, texture and gesture give each figure a home.',
    videosKicker: 'Moving image', videosTitle: 'Videos', videosIntro: 'Pushing still imagery into the next second, where motion, rhythm and picture complete the story.',
    creaturesKicker: 'Bestiary', creaturesTitle: 'Fantasy Creatures', creaturesIntro: 'Wings, scales and Shanhai forms for lives that do not belong to reality but still feel real.',
    aboutKicker: 'Observe · shape · render', aboutLineOne: 'Leave the quiet space', aboutLineTwo: 'for imagination to grow', aboutBody: 'This archive unfolds through three mediums: space holds atmosphere, characters hold emotion, and moving images make everything happen. Click any image or cover to enter a larger view.',
    navHome: 'Intro', navScenes: 'Scenes', navCharacters: 'Characters', navVideos: 'Videos', navCreatures: 'Creatures', navAbout: 'About', loading: 'Arranging the archive…', view: 'Open view', collection: 'Image archive', play: 'Play'
  }
};

let lang = localStorage.getItem('archive-language') || 'zh';
let data = null;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

function setLanguage(next) {
  lang = next;
  localStorage.setItem('archive-language', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  for (const node of $$('[data-i18n]')) node.textContent = translations[lang][node.dataset.i18n] || node.textContent;
  const button = $('#langToggle');
  button.querySelector('.lang-active').textContent = lang === 'zh' ? '中' : 'EN';
  button.querySelectorAll('span')[2].textContent = lang === 'zh' ? 'EN' : '中';
  button.setAttribute('aria-label', lang === 'zh' ? '切换到英文' : 'Switch to Chinese');
  document.title = lang === 'zh' ? '万象集 · Visual Archive' : 'Visual Archive · 万象集';
  if (data) { renderGroups('#sceneGrid', data.scenes, 'scene'); renderGroups('#characterGrid', data.characters, 'character'); renderGroups('#creatureGrid', data.creatures, 'creature'); renderVideos(); }
}

function groupMarkup(group, kind) {
  const title = group.title[lang] || group.title.zh;
  const items = group.items.map((item) => `<button class="media-frame" type="button" data-image="${esc(item.url)}" data-alt="${esc(title)}"><img loading="lazy" src="${esc(item.url)}" alt="${esc(title)}" /></button>`).join('');
  return `<article class="group-card"><div class="group-title"><h3>${esc(title)}</h3><span>${translations[lang].collection}</span></div><div class="media-strip">${items}</div></article>`;
}

function renderGroups(selector, groups, kind) {
  const root = $(selector); if (!root) return;
  root.innerHTML = groups.map((group) => groupMarkup(group, kind)).join('');
  $$('.media-frame', root).forEach((button) => button.addEventListener('click', () => openLightbox({ type: 'image', src: button.dataset.image, alt: button.dataset.alt })));
}

function renderVideos() {
  const root = $('#videoGrid'); if (!root || !data) return;
  root.innerHTML = data.videos.map((item) => {
    const title = item.title[lang] || item.title.zh;
    return `<article class="video-card" data-video="${esc(item.video)}" data-cover="${esc(item.cover || '')}" data-title="${esc(title)}"><div class="video-poster"><img loading="lazy" decoding="async" src="${esc(item.cover || '')}" alt="${esc(title)}" /><video muted loop playsinline preload="none" poster="${esc(item.cover || '')}" data-src="${esc(item.video)}"></video><span class="play-badge">▶</span></div><div class="video-meta"><strong>${esc(title)}</strong><span>${translations[lang].play} ↗</span></div></article>`;
  }).join('');
  $$('.video-card', root).forEach((card) => {
    const video = $('video', card);
    const primeVideo = () => { if (!video.dataset.loaded) { video.src = video.dataset.src; video.dataset.loaded = 'true'; video.load(); } };
    card.addEventListener('mouseenter', () => { primeVideo(); card.classList.add('is-playing'); video.play().catch(() => {}); });
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; card.classList.remove('is-playing'); });
    card.addEventListener('click', () => openLightbox({ type: 'video', src: card.dataset.video, poster: card.dataset.cover, alt: card.dataset.title }));
  });
}

function openLightbox(item) {
  const box = $('#lightbox'); const inner = $('#lightboxInner');
  inner.innerHTML = item.type === 'image' ? `<img src="${esc(item.src)}" alt="${esc(item.alt)}" />` : `<video controls autoplay playsinline poster="${esc(item.poster || '')}"><source src="${esc(item.src)}" type="video/mp4" /></video>`;
  box.classList.add('open'); box.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
}
function closeLightbox() { const box = $('#lightbox'); const video = $('video', box); if (video) video.pause(); box.classList.remove('open'); box.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; setTimeout(() => { $('#lightboxInner').innerHTML = ''; }, 350); }

function setupNavigation() {
  const sections = $$('[data-view]'); const links = $$('.dock-link[data-nav]');
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) links.forEach((link) => link.classList.toggle('active', link.dataset.nav === entry.target.dataset.view)); }), { rootMargin: '-32% 0px -58% 0px', threshold:0 });
  sections.forEach((section) => observer.observe(section));
  $('#langToggle').addEventListener('click', () => setLanguage(lang === 'zh' ? 'en' : 'zh'));
  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lightbox').addEventListener('click', (event) => { if (event.target.id === 'lightbox') closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
}

async function init() {
  setupNavigation(); setLanguage(lang);
  try {
    let response = await fetch('manifest.json', { cache: 'no-store' });
    if (!response.ok) response = await fetch('api/manifest', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Manifest ${response.status}`); data = await response.json();
    renderGroups('#sceneGrid', data.scenes, 'scene'); renderGroups('#characterGrid', data.characters, 'character'); renderGroups('#creatureGrid', data.creatures, 'creature'); renderVideos();
  } catch (error) {
    console.error(error);
    const message = lang === 'zh' ? '档案暂时无法载入，请确认本地预览服务正在运行。' : 'The archive could not load. Please confirm the local preview server is running.';
    $$('.group-grid, .video-grid').forEach((node) => node.innerHTML = `<div class="loading"><span>${message}</span></div>`);
  }
}

init();
