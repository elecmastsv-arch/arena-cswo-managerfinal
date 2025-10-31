const KEY='cswo_tournaments_v3';

export function listTournaments(){
  cleanup();
  const db = JSON.parse(localStorage.getItem(KEY) || '{}');
  return Object.values(db).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
}

export function getTournament(slug){
  const db = JSON.parse(localStorage.getItem(KEY) || '{}');
  return db[slug] || null;
}

export function saveTournament(t){
  const db = JSON.parse(localStorage.getItem(KEY) || '{}');
  t.updatedAt = Date.now();
  db[t.slug] = t;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function deleteTournament(slug){
  const db = JSON.parse(localStorage.getItem(KEY) || '{}');
  delete db[slug];
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function slugify(name){
  return (name||'torneo').toLowerCase().normalize('NFD')
    .replace(/\p{Diacritic}/gu,'')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)/g,'');
}

function cleanup(){
  const db = JSON.parse(localStorage.getItem(KEY) || '{}');
  const now = Date.now();
  const TTL = 60*24*60*60*1000; // 60 días
  let changed = false;
  for (const k of Object.keys(db)){
    if((now - (db[k].updatedAt||0)) > TTL){
      delete db[k]; changed = true;
    }
  }
  if(changed) localStorage.setItem(KEY, JSON.stringify(db));
}

// --- NUEVAS FUNCIONES ---

function ensurePlayers(t){
  if(!t.players) t.players = [];
}

// Agregar nuevo jugador
export function addPlayer(t, name){
  ensurePlayers(t);
  const id = t.players.length ? Math.max(...t.players.map(p=>p.id))+1 : 1;
  t.players.push({ id, name, dropped:false });
  saveTournament(t);
  return t;
}

export function dropPlayer(t, playerId){
  ensurePlayers(t);
  t.players = t.players.map(p => p.id === playerId ? {...p, dropped:true} : p);
  saveTournament(t);
  return t;
}

export function undropPlayer(t, playerId){
  ensurePlayers(t);
  t.players = t.players.map(p => p.id === playerId ? {...p, dropped:false} : p);
  saveTournament(t);
  return t;
}

export function toggleDropPlayer(t, playerId){
  ensurePlayers(t);
  t.players = t.players.map(p => p.id === playerId ? {...p, dropped:!p.dropped} : p);
  saveTournament(t);
  return t;
}
