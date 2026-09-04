(() => {
  const KEY = 'rn-handbook-say-v1';
  const stored = JSON.parse(localStorage.getItem(KEY) || '{}');
  const state = {
    query: '', category: '', status: '',
    done: stored.done || [], saved: stored.saved || [], dark: !!stored.dark,
    open: new Set(),            // expanded card ids, kept across re-renders
    closedSections: new Set(),  // collapsed category sections
  };

  const $ = s => document.querySelector(s);
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Spoken answers are written with markdown-style `code` spans; render them as chips.
  const fmt = s => esc(s).replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`);
  const save = () => localStorage.setItem(KEY, JSON.stringify({ done: state.done, saved: state.saved, dark: state.dark }));

  // Introduction lives at the end of data.js so the original question ids (and any
  // saved progress keyed to them) stay put, but it reads first.
  const allCats = [...new Set(HANDBOOK.map(x => x.category))];
  const cats = ['Introduction', ...allCats.filter(c => c !== 'Introduction')];
  const slug = c => c.replace(/[^a-z0-9]+/gi, '-').toLowerCase();

  function match(x) {
    const hay = (x.question + ' ' + x.say + ' ' + x.example + ' ' + x.category).toLowerCase();
    if (state.query && !hay.includes(state.query)) return false;
    if (state.category && x.category !== state.category) return false;
    if (state.status === 'bookmarked') return state.saved.includes(x.id);
    if (state.status === 'completed') return state.done.includes(x.id);
    if (state.status === 'uncompleted') return !state.done.includes(x.id);
    return true;
  }

  const card = x => `<details class="card${state.done.includes(x.id) ? ' is-done' : ''}" data-id="${x.id}" ${state.open.has(x.id) ? 'open' : ''}>
    <summary>
      <span class="num">${String(x.id).padStart(3, '0')}</span>
      <span class="question">${esc(x.question)}</span>
      <button class="bookmark ${state.saved.includes(x.id) ? 'on' : ''}" data-save="${x.id}"
        aria-label="Bookmark question" aria-pressed="${state.saved.includes(x.id)}">★</button>
    </summary>
    <div class="answer">
      <b class="label">Say this in the interview</b>
      <p class="say">${fmt(x.say)}</p>
      <div class="example">
        <b class="label">Quick example</b>
        <pre><code>${esc(x.example)}</code></pre>
      </div>
      <label class="done"><input type="checkbox" data-done="${x.id}" ${state.done.includes(x.id) ? 'checked' : ''}> Mark as prepared</label>
    </div>
  </details>`;

  function stats(shown) {
    $('#count').textContent = shown;
    $('#bookmarks').textContent = state.saved.length;
    $('#progressText').textContent = `${state.done.length} / ${HANDBOOK.length}`;
    $('#progressBar').style.width = `${state.done.length / HANDBOOK.length * 100}%`;
  }

  function render() {
    document.body.classList.toggle('dark', state.dark);
    $('#themeToggle').textContent = state.dark ? '☀' : '☾';

    const shown = HANDBOOK.filter(match);
    const groups = cats.map(c => [c, shown.filter(x => x.category === c)]).filter(([, items]) => items.length);

    $('#content').innerHTML = groups.map(([c, items]) => `<details class="section" id="cat-${slug(c)}" data-cat="${esc(c)}" ${state.closedSections.has(c) ? '' : 'open'}>
      <summary class="section-title"><h2>${esc(c)}</h2><span>${items.length} question${items.length === 1 ? '' : 's'}</span></summary>
      <div class="cards">${items.map(card).join('')}</div>
    </details>`).join('');

    $('#empty').hidden = shown.length !== 0;
    stats(shown.length);
    syncExpandLabel();
  }

  function syncExpandLabel() {
    const cards = [...document.querySelectorAll('.card')];
    $('#expandAll').textContent = cards.length && cards.every(c => c.open) ? 'Collapse all' : 'Expand all';
  }

  // Delegated handlers: toggling a bookmark or checkbox never rebuilds the list,
  // so open answers stay open and the scroll position stays put.
  $('#content').addEventListener('click', e => {
    const btn = e.target.closest('[data-save]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const id = +btn.dataset.save;
    const on = !state.saved.includes(id);
    state.saved = on ? [...state.saved, id] : state.saved.filter(v => v !== id);
    save();
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', String(on));
    if (state.status === 'bookmarked') render(); else stats(+$('#count').textContent);
  });

  $('#content').addEventListener('change', e => {
    const box = e.target.closest('[data-done]');
    if (!box) return;
    const id = +box.dataset.done;
    state.done = box.checked ? [...new Set([...state.done, id])] : state.done.filter(v => v !== id);
    save();
    box.closest('.card').classList.toggle('is-done', box.checked);
    if (state.status === 'completed' || state.status === 'uncompleted') render();
    else stats(+$('#count').textContent);
  });

  $('#content').addEventListener('toggle', e => {
    const el = e.target;
    if (el.classList.contains('card')) {
      const id = +el.dataset.id;
      el.open ? state.open.add(id) : state.open.delete(id);
      syncExpandLabel();
    } else if (el.classList.contains('section')) {
      const c = el.dataset.cat;
      el.open ? state.closedSections.delete(c) : state.closedSections.add(c);
    }
  }, true);

  const setCategory = c => {
    state.category = c;
    $('#categoryFilter').value = c;
    document.querySelectorAll('#categoryNav button').forEach(b => b.classList.toggle('active', b.dataset.cat === c));
    render();
  };

  $('#search').oninput = e => { state.query = e.target.value.trim().toLowerCase(); render(); };
  $('#categoryFilter').onchange = e => setCategory(e.target.value);
  $('#statusFilter').onchange = e => { state.status = e.target.value; render(); };
  $('#categoryNav').onclick = e => {
    const btn = e.target.closest('button[data-cat]');
    if (btn) setCategory(btn.dataset.cat);
  };
  $('#themeToggle').onclick = () => {
    state.dark = !state.dark;
    save();
    document.body.classList.toggle('dark', state.dark);
    $('#themeToggle').textContent = state.dark ? '☀' : '☾';
  };
  $('#resetProgress').onclick = () => {
    if (!confirm('Clear all prepared questions and bookmarks?')) return;
    state.done = []; state.saved = []; save(); render();
  };
  $('#expandAll').onclick = () => {
    const cards = [...document.querySelectorAll('.card')];
    const open = !(cards.length && cards.every(c => c.open));
    cards.forEach(c => {
      c.open = open;
      open ? state.open.add(+c.dataset.id) : state.open.delete(+c.dataset.id);
    });
    syncExpandLabel();
  };

  $('#categoryFilter').insertAdjacentHTML('beforeend', cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join(''));
  $('#categoryNav').innerHTML = `<button class="active" data-cat="">All</button>` +
    cats.map(c => `<button data-cat="${esc(c)}">${esc(c)}</button>`).join('');

  render();
})();
