const STORAGE_KEY = 'role-amigo-events-v2';
let events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

const grid = document.getElementById('events-grid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');

function saveEvents() { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)) }

function formatDate(iso) {
    if (!iso) return 'Sem data';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleString();
}

function escapeHtml(str) { return str ? String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') : '' }

function render(list = events) {
    grid.innerHTML = '';
    if (list.length === 0) { grid.innerHTML = '<p style="grid-column:1/-1;color:#475569">Nenhum evento encontrado.</p>'; return }
    list.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    list.forEach(ev => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <img src="${ev.img || 'https://picsum.photos/400/200'}" alt="${escapeHtml(ev.title)}">
          <div class="content">
            <div class="meta">${formatDate(ev.datetime)} • ${escapeHtml(ev.place)}</div>
            <div class="title">${escapeHtml(ev.title)}</div>
            <div class="desc">${escapeHtml(ev.desc || 'Sem descrição.')}</div>
          </div>
          <div class="card-footer">
            <div class="pill">${escapeHtml(ev.interest || 'Geral')}</div>
            <div style="margin-left:auto;display:flex;gap:8px">
              <button class="btn secondary" onclick="openModal('view','${ev.id}')">Ver</button>
              <button class="btn secondary" onclick="openModal('edit','${ev.id}')">Editar</button>
              <button class="btn secondary" onclick="deleteEvent('${ev.id}')">Excluir</button>
              <button class="btn" onclick="rsvpToEvent('${ev.id}')">Quero ir</button>
            </div>
          </div>`;
        grid.appendChild(card);
    })
}

function openModal(type, id = null) {
    modal.style.display = 'flex';
    if (type === 'create' || type === 'edit') {
        const ev = id ? events.find(e => e.id === id) : {};
        modalBody.innerHTML = `
          <button onclick="closeModal()" style="float:right">✕</button>
          <h3>${id ? 'Editar' : 'Criar'} evento</h3>
          <form id="event-form">
            <div class="field"><label>Nome</label><input id="evt-name" value="${escapeHtml(ev?.title || '')}" required></div>
            <div class="field"><label>Interesse</label><input id="evt-interest" value="${escapeHtml(ev?.interest || '')}"></div>
            <div class="field"><label>Data e hora</label><input type="datetime-local" id="evt-date" value="${ev?.datetime || ''}" required></div>
            <div class="field"><label>Local</label><input id="evt-place" value="${escapeHtml(ev?.place || '')}"></div>
            <div class="field"><label>Imagem URL</label><input id="evt-img" value="${escapeHtml(ev?.img || '')}"></div>
            <div class="field"><label>Descrição</label><textarea id="evt-desc">${escapeHtml(ev?.desc || '')}</textarea></div>
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button type="button" class="btn secondary" onclick="closeModal()">Cancelar</button>
              <button class="btn" type="submit">Salvar</button>
            </div>
          </form>`;
        document.getElementById('event-form').onsubmit = (e) => {
            e.preventDefault();
            const newEvt = {
                id: id || crypto.randomUUID(),
                title: document.getElementById('evt-name').value.trim(),
                interest: document.getElementById('evt-interest').value.trim(),
                datetime: document.getElementById('evt-date').value,
                place: document.getElementById('evt-place').value.trim(),
                img: document.getElementById('evt-img').value.trim(),
                desc: document.getElementById('evt-desc').value.trim()
            };
            if (new Date(newEvt.datetime) < new Date()) { alert('Escolha uma data futura!'); return }
            if (id) { events = events.map(e => e.id === id ? newEvt : e); } else { events.push(newEvt) }
            saveEvents(); render(); closeModal();
        }
    }
    if (type === 'view') {
        const ev = events.find(e => e.id === id);
        modalBody.innerHTML = `
          <button onclick="closeModal()" style="float:right">✕</button>
          <h3>${escapeHtml(ev.title)}</h3>
          <img src="${ev.img || 'https://picsum.photos/400/200'}" style="width:100%;border-radius:8px">
          <div>${formatDate(ev.datetime)} • ${escapeHtml(ev.place)}</div>
          <p>${escapeHtml(ev.desc)}</p>
          <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">
            <button class="btn secondary" onclick="closeModal()">Fechar</button>
            <button class="btn" onclick="rsvpToEvent('${ev.id}')">Quero ir</button>
          </div>`;
    }
}

function closeModal() { modal.style.display = 'none' }
function deleteEvent(id) { if (confirm('Excluir este evento?')) { events = events.filter(e => e.id !== id); saveEvents(); render() } }

function rsvpToEvent(id) {
    const key = 'role-amigo-rsvps';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    if (list.includes(id)) { alert('Já confirmado.'); return }
    list.push(id); localStorage.setItem(key, JSON.stringify(list));
    alert('Presença confirmada!');
}

document.getElementById('open-create').onclick = () => openModal('create');
document.getElementById('open-create-2').onclick = () => openModal('create');

document.getElementById('see-my-rsvps').onclick = () => {
    const key = 'role-amigo-rsvps';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    render(events.filter(e => list.includes(e.id)))
}

document.getElementById('clear-filters').onclick = () => { document.getElementById('search').value = ''; document.getElementById('interest').value = ''; render() }
document.getElementById('search').oninput = applyFilters;
document.getElementById('interest').onchange = applyFilters;

function applyFilters() {
    const q = document.getElementById('search').value.toLowerCase();
    const i = document.getElementById('interest').value;
    render(events.filter(ev => {
        const hay = (ev.title + ' ' + ev.desc + ' ' + ev.place).toLowerCase();
        return (!q || hay.includes(q)) && (!i || ev.interest === i)
    }));
}

render();
