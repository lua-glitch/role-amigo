 
    const sample = [
      {
        id: crypto.randomUUID(),
        title: 'Barzinho e samba',
        interest: 'Música',
        datetime: '2025-09-20T20:00',
        place: 'Bar do Zé',
        img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60',
        desc: 'Noite de samba, roda de amigos e caipirinha. Traga boa energia!'
      },
      {
        id: crypto.randomUUID(),
        title: 'Noite de games',
        interest: 'Jogos',
        datetime: '2025-09-18T19:30',
        place: 'Casa do Pedro',
        img: 'https://images.unsplash.com/photo-1605902711622-cfb43c44367e?auto=format&fit=crop&w=800&q=60',
        desc: 'Sessão de jogos multiplayer: Mario Kart, Valorant e board games.'
      },
      {
        id: crypto.randomUUID(),
        title: 'Cine Pipoca',
        interest: 'Filmes',
        datetime: '2025-09-26T21:00',
        place: 'CineClub',
        img: 'https://images.unsplash.com/photo-1517604931442-7dcbf6fb9d9b?auto=format&fit=crop&w=800&q=60',
        desc: 'Filme cult + pipoca grátis. Debate depois da sessão.'
      }
    ];

    // Local Storage helpers
    const STORAGE_KEY = 'role-amigo-events-v1';
    function loadEvents(){
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return sample.slice();
      try{ return JSON.parse(raw)}catch(e){return sample.slice()}
    }
    function saveEvents(list){localStorage.setItem(STORAGE_KEY, JSON.stringify(list))}

    let events = loadEvents();
    const grid = document.getElementById('events-grid');

    
    function render(list){
      grid.innerHTML = '';
      if(list.length===0){grid.innerHTML = '<p style="grid-column:1/-1;color:#475569">Nenhum evento encontrado. Crie o primeiro!</p>';return}

      list.forEach(ev => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <img src="${ev.img || 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60'}" alt="${escapeHtml(ev.title)}">
          <div class="content">
            <div class="meta">${formatDate(ev.datetime)} • ${escapeHtml(ev.place)}</div>
            <div class="title">${escapeHtml(ev.title)}</div>
            <div class="desc">${escapeHtml(ev.desc||'Sem descrição.')}</div>
          </div>
          <div class="card-footer">
            <div class="pill">${escapeHtml(ev.interest||'Geral')}</div>
            <div style="margin-left:auto;display:flex;gap:8px">
              <button class="btn secondary" data-id="${ev.id}" data-action="view">Ver</button>
              <button class="btn" data-id="${ev.id}" data-action="rsvp">Quero ir</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      })
    }

    
    function formatDate(iso){ if(!iso) return 'Sem data'; const d = new Date(iso); if(isNaN(d)) return iso; return d.toLocaleString(); }
    function escapeHtml(str){ if(!str) return ''; return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }

    
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('event-form');
    let currentView = null;

    function openModal(type, id){
      currentView = {type,id};
      modal.style.display = 'flex';
      if(type==='create'){
        modalTitle.textContent = 'Criar evento';
        form.style.display = '';
        fillForm();
      }else{
        modalTitle.textContent = 'Detalhes do evento';
        form.style.display = 'none';
        showDetails(id);
      }
    }

    function closeModal(){ modal.style.display = 'none'; currentView = null }
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-create').addEventListener('click', closeModal);
    document.getElementById('open-create').addEventListener('click', ()=>openModal('create'));
    document.getElementById('open-create-2').addEventListener('click', ()=>openModal('create'));

    modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal() })

   
    function fillForm(data={}){
      document.getElementById('evt-name').value = data.title||'';
      document.getElementById('evt-interest').value = data.interest||'';
      document.getElementById('evt-date').value = data.datetime||'';
      document.getElementById('evt-place').value = data.place||'';
      document.getElementById('evt-img').value = data.img||'';
      document.getElementById('evt-desc').value = data.desc||'';
    }

    form.addEventListener('submit',(ev)=>{
      ev.preventDefault();
      const newEvt = {
        id: crypto.randomUUID(),
        title: document.getElementById('evt-name').value.trim(),
        interest: document.getElementById('evt-interest').value.trim(),
        datetime: document.getElementById('evt-date').value,
        place: document.getElementById('evt-place').value.trim(),
        img: document.getElementById('evt-img').value.trim(),
        desc: document.getElementById('evt-desc').value.trim(),
      };
      if(!newEvt.title){alert('Informe um nome para o evento');return}
      events.unshift(newEvt);
      saveEvents(events);
      render(events);
      closeModal();
    })

    function showDetails(id){
      const ev = events.find(x=>x.id===id);
      if(!ev){modal.querySelector('.modal-body').innerHTML = '<p>Evento não encontrado.</p>';return}
      modal.querySelector('.modal-body').innerHTML = `
        <button id="close-modal" style="float:right;background:none;border:0;font-size:18px;cursor:pointer">✕</button>
        <h3>${escapeHtml(ev.title)}</h3>
        <img src="${ev.img||'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60'}" alt="" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin:10px 0">
        <div class="meta">${formatDate(ev.datetime)} • ${escapeHtml(ev.place)}</div>
        <p style="margin-top:8px">${escapeHtml(ev.desc)}</p>
        <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
          <button class="btn secondary" id="closeDetails">Fechar</button>
          <button class="btn" id="confirmRsvp">Quero ir</button>
        </div>
      `;
      
      document.getElementById('closeDetails').addEventListener('click', closeModal);
      document.getElementById('confirmRsvp').addEventListener('click', ()=>{
        rsvpToEvent(ev.id);
      });
      document.getElementById('close-modal').addEventListener('click', closeModal);
    }

    function rsvpToEvent(id){
      
      const key = 'role-amigo-rsvps-v1';
      const raw = localStorage.getItem(key);
      let list = raw?JSON.parse(raw):[];
      if(list.includes(id)){
        alert('Você já confirmou presença neste evento.');
        return;
      }
      list.push(id);
      localStorage.setItem(key, JSON.stringify(list));
      alert('Presença confirmada!');
      closeModal();
    }

    document.getElementById('see-my-rsvps').addEventListener('click', ()=>{
      const key = 'role-amigo-rsvps-v1';
      const raw = localStorage.getItem(key);
      const list = raw?JSON.parse(raw):[];
      if(list.length===0){alert('Você não confirmou presença em nenhum evento.') ;return}
      const myEvents = events.filter(e=>list.includes(e.id));
      
      render(myEvents);
      window.scrollTo({top:0,behavior:'smooth'});
    })


    grid.addEventListener('click',(e)=>{
      const btn = e.target.closest('button'); if(!btn) return;
      const action = btn.dataset.action; const id = btn.dataset.id;
      if(action==='view') openModal('view', id);
      if(action==='rsvp') rsvpToEvent(id);
    })

    const search = document.getElementById('search');
    const interest = document.getElementById('interest');
    const clear = document.getElementById('clear-filters');

    function applyFilters(){
      const q = search.value.trim().toLowerCase();
      const i = interest.value;
      let result = events.filter(ev => {
        const hay = (ev.title+' '+(ev.desc||'')+' '+(ev.place||'')).toLowerCase();
        if(q && !hay.includes(q)) return false;
        if(i && ev.interest !== i) return false;
        return true;
      })
      render(result);
    }

    search.addEventListener('input', applyFilters);
    interest.addEventListener('change', applyFilters);
    clear.addEventListener('click', ()=>{search.value='';interest.value='';render(events)})

    
    render(events);