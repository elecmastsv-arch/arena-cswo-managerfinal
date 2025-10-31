import React, { useState, useEffect } from 'react'
import Background from './Background'
import { listTournaments, getTournament, deleteTournament, addPlayer, toggleDropPlayer } from './Storage'

export default function TournamentSelector({ onCreate, onOpen, onDelete }){
  const [name,setName] = useState('Mi Torneo CSWO')
  const [items, setItems] = useState(listTournaments())
  const [selected, setSelected] = useState(null)
  const [playerName, setPlayerName] = useState('')

  useEffect(()=>{ setItems(listTournaments()) },[])

  const handleOpen = (slug)=>{
    const t = getTournament(slug)
    setSelected(t)
  }

  const handleAddPlayer = ()=>{
    if(!playerName.trim() || !selected) return
    const updated = addPlayer(selected, playerName.trim())
    setSelected({...updated})
    setPlayerName('')
  }

  const handleToggleDrop = (playerId)=>{
    if(!selected) return
    const updated = toggleDropPlayer(selected, playerId)
    setSelected({...updated})
  }

  return (
    <div className='min-h-screen text-white'>
      <Background/>
      <div className='max-w-5xl mx-auto px-4 py-12'>
        <h1 className='neon-title text-center text-3xl font-extrabold'>COMUNIDAD CSWO</h1>
        <p className='text-center text-gray-300 mt-2'>Selecciona un torneo o crea uno nuevo</p>

        <div className='card mt-6'>
          <div className='grid md:grid-cols-3 gap-3'>
            <input className='input md:col-span-2' value={name} onChange={e=>setName(e.target.value)} placeholder='Nombre del torneo' />
            <button className='btn' onClick={()=> onCreate(name)}>Nuevo torneo</button>
          </div>
        </div>

        <div className='card mt-4'>
          <h2 className='text-lg font-semibold text-cyan-300'>Torneos guardados</h2>
          {items.length===0? <p className='text-gray-400 mt-2'>Aún no hay torneos guardados.</p> :
            <ul className='mt-3 grid md:grid-cols-2 gap-3'>
              {items.map(t=>(
                <li key={t.slug} className='bg-white/5 border border-white/10 rounded-xl p-3'>
                  <div className='flex items-center justify-between gap-2'>
                    <div>
                      <div className='font-semibold'>{t.meta?.name||t.slug}</div>
                      <div className='text-xs text-gray-400'>Fecha: {t.meta?.date||'-'} • Última act.: {new Date(t.updatedAt||0).toLocaleString()}</div>
                    </div>
                    <div className='flex gap-2'>
                      <button className='btn' onClick={()=>handleOpen(t.slug)}>Reanudar</button>
                      <button className='btn-ghost' onClick={()=> onDelete(t.slug)}>Eliminar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          }
        </div>

        {selected && (
          <div className='card mt-8'>
            <h2 className='text-xl font-bold text-cyan-400 mb-3'>Jugadores de {selected.meta?.name}</h2>
            
            <div className='flex gap-3 mb-4'>
              <input
                className='input flex-grow'
                value={playerName}
                onChange={e=>setPlayerName(e.target.value)}
                placeholder='Nombre del jugador'
              />
              <button
                className='px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 font-semibold'
                onClick={handleAddPlayer}
              >
                ➕ Agregar
              </button>
            </div>

            {(!selected.players || selected.players.length===0) ? (
              <p className='text-gray-400'>No hay jugadores registrados.</p>
            ):(
              <ul className='space-y-2'>
                {selected.players.map(p=>(
                  <li key={p.id} className={`flex items-center justify-between px-3 py-2 rounded-lg ${p.dropped? 'bg-red-900/30' : 'bg-green-900/30'}`}>
                    <span className={`font-medium ${p.dropped? 'line-through text-gray-400' : 'text-white'}`}>{p.name}</span>
                    <button
                      className={`px-3 py-1 rounded-lg font-semibold transition ${p.dropped? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                      onClick={()=>handleToggleDrop(p.id)}
                    >
                      {p.dropped? '🔄 Reintegrar' : '❌ Drop'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
      <footer className='text-center text-xs text-gray-400 py-8'>By CSWO Team</footer>
    </div>
  )
}
