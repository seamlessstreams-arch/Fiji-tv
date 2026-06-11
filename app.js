// Fiji TV — App Logic

(function () {
  'use strict';

  // ── Channel data ──────────────────────────────────────────
  const channels = [
    { id: 1,  name: 'Fiji One',        category: 'general',  emoji: '📺', program: 'Morning News',          live: true,  hd: false },
    { id: 2,  name: 'FBC TV',          category: 'general',  emoji: '🎙️', program: 'Talk Show Live',         live: true,  hd: true  },
    { id: 3,  name: 'Fiji Sports',     category: 'sports',   emoji: '⚽', program: 'Rugby Highlights',       live: true,  hd: true  },
    { id: 4,  name: 'Island Movies',   category: 'movies',   emoji: '🎬', program: 'Action Blockbuster',     live: false, hd: true  },
    { id: 5,  name: 'Pacific Kids',    category: 'kids',     emoji: '🌈', program: 'Cartoon Hour',           live: true,  hd: false },
    { id: 6,  name: 'Fiji News 24',    category: 'news',     emoji: '📰', program: 'Breaking News',          live: true,  hd: true  },
    { id: 7,  name: 'Ocean Music',     category: 'music',    emoji: '🎵', program: 'Pacific Top 40',         live: true,  hd: false },
    { id: 8,  name: 'Coral Docs',      category: 'docs',     emoji: '🌊', program: 'Ocean Wonders',          live: false, hd: true  },
    { id: 9,  name: 'Sports Extra',    category: 'sports',   emoji: '🏈', program: 'Cricket Live',           live: true,  hd: true  },
    { id: 10, name: 'Island Cinema',   category: 'movies',   emoji: '🎥', program: 'Evening Feature Film',   live: false, hd: true  },
    { id: 11, name: 'Sunrise Kids',    category: 'kids',     emoji: '🧸', program: 'Story Time',             live: false, hd: false },
    { id: 12, name: 'Pacific News',    category: 'news',     emoji: '📡', program: 'World News',             live: true,  hd: true  },
  ];

  // ── EPG data (today's guide) ──────────────────────────────
  const epgSchedule = [
    { time: '06:00', title: 'Morning Sunrise',      channel: 'Fiji One',     duration: 60 },
    { time: '07:00', title: 'Breakfast Show',       channel: 'FBC TV',       duration: 90 },
    { time: '08:30', title: 'Rugby World Cup Replay', channel: 'Fiji Sports', duration: 120 },
    { time: '09:00', title: 'Morning News',         channel: 'Fiji News 24', duration: 60 },
    { time: '10:00', title: 'Cartoon Bonanza',      channel: 'Pacific Kids', duration: 120 },
    { time: '10:30', title: 'Pacific Top 40',       channel: 'Ocean Music',  duration: 60 },
    { time: '12:00', title: 'Midday Update',        channel: 'Fiji News 24', duration: 30 },
    { time: '13:00', title: 'Island Legends (Doc)', channel: 'Coral Docs',   duration: 60 },
    { time: '14:00', title: 'Live Cricket',         channel: 'Sports Extra', duration: 180 },
    { time: '18:00', title: 'Prime Time News',      channel: 'Fiji One',     duration: 60 },
    { time: '19:30', title: 'Evening Feature Film', channel: 'Island Cinema', duration: 120 },
    { time: '21:30', title: 'Late Night Talk',      channel: 'FBC TV',       duration: 60 },
  ];

  // ── Utility: get current time string HH:MM ────────────────
  function currentTimeStr() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  // ── Render channel cards ──────────────────────────────────
  function renderChannels(filter = 'all', query = '') {
    const grid = document.getElementById('channelGrid');
    const noResults = document.getElementById('noResults');
    if (!grid) return;

    const lowerQuery = query.toLowerCase().trim();

    let visible = 0;
    grid.querySelectorAll('.channel-card').forEach(card => {
      const catMatch = filter === 'all' || card.dataset.category === filter;
      const name = card.dataset.name.toLowerCase();
      const prog = card.dataset.program.toLowerCase();
      const searchMatch = !lowerQuery || name.includes(lowerQuery) || prog.includes(lowerQuery);

      if (catMatch && searchMatch) {
        card.classList.remove('hidden');
        visible++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (noResults) {
      noResults.classList.toggle('visible', visible === 0);
    }
  }

  // ── Build channel grid ────────────────────────────────────
  function buildChannelGrid() {
    const grid = document.getElementById('channelGrid');
    if (!grid) return;

    grid.innerHTML = channels.map(ch => {
      const badges = [
        ch.live ? '<span class="badge badge-live">Live</span>' : '',
        ch.hd   ? '<span class="badge badge-hd">HD</span>'   : '',
      ].join('');

      return `
        <article class="channel-card"
          data-category="${ch.category}"
          data-name="${ch.name}"
          data-program="${ch.program}"
          tabindex="0"
          role="button"
          aria-label="Watch ${ch.name}"
          onclick="FijiTV.openChannel(${ch.id})">
          <div class="channel-thumb">
            <span class="channel-logo" role="img" aria-label="${ch.name} logo">${ch.emoji}</span>
            <span class="ch-num" aria-hidden="true">${ch.id}</span>
            <div class="channel-status">${badges}</div>
          </div>
          <div class="channel-info">
            <h3>${ch.name}</h3>
            <p>${ch.program}</p>
          </div>
        </article>`;
    }).join('') + '<p class="no-results" id="noResults">No channels match your search.</p>';
  }

  // ── Build EPG table ───────────────────────────────────────
  function buildEPG() {
    const tbody = document.getElementById('epgBody');
    if (!tbody) return;

    const now = currentTimeStr();

    tbody.innerHTML = epgSchedule.map(item => {
      const isNow = item.time <= now && now < addMinutes(item.time, item.duration);
      const rowClass = isNow ? 'epg-now' : '';
      const nowLabel = isNow ? ' <span class="badge badge-live">Now</span>' : '';
      return `
        <tr class="${rowClass}">
          <td>${item.time}</td>
          <td class="epg-title">${item.title}${nowLabel}</td>
          <td>${item.channel}</td>
          <td>${item.duration} min</td>
        </tr>`;
    }).join('');
  }

  // ── Helper: add minutes to HH:MM string ──────────────────
  function addMinutes(timeStr, minutes) {
    const [h, m] = timeStr.split(':').map(Number);
    const total = h * 60 + m + minutes;
    const hh = Math.floor(total / 60) % 24;
    const mm = total % 60;
    return hh.toString().padStart(2, '0') + ':' + mm.toString().padStart(2, '0');
  }

  // ── Category filter buttons ───────────────────────────────
  function initCategoryFilter() {
    const buttons = document.querySelectorAll('.category-btn');
    let currentFilter = 'all';
    let currentQuery = '';

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        renderChannels(currentFilter, currentQuery);
      });
    });

    // Store reference for search handler
    window._fijiFilter = () => ({ filter: currentFilter, query: currentQuery });
    window._fijiSetQuery = q => { currentQuery = q; renderChannels(currentFilter, currentQuery); };
  }

  // ── Search ────────────────────────────────────────────────
  function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (window._fijiSetQuery) window._fijiSetQuery(input.value);
      }, 200);
    });
  }

  // ── Clock ──────────────────────────────────────────────────
  function initClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;

    function tick() {
      const now = new Date();
      el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    tick();
    setInterval(tick, 1000);
  }

  // ── Public API: open a channel ────────────────────────────
  function openChannel(id) {
    const ch = channels.find(c => c.id === id);
    if (!ch) return;
    // In a real app this would open a video player or navigate to a stream URL.
    alert(`▶ Now watching: ${ch.name}\n📺 ${ch.program}`);
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    buildChannelGrid();
    buildEPG();
    initCategoryFilter();
    initSearch();
    initClock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Public namespace ──────────────────────────────────────
  window.FijiTV = { openChannel };
})();
