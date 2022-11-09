import React, { useState, useEffect } from 'react'

import './styles.css'

import { Card } from '../../components/Card'

/*  
  e.target.value serve para pegar 
  o valor do elemento que está sendo passado 
  
  new Date().toLocaleTimeString este código serve
  para pegar o horário atual

    */

export function Home() {
  const [studentName, setStudentName] = useState('')
  const [students, setStudents] = useState([])
  const [user, setUser] = useState ({name: '', avatar: '',})

  function handleAddStudent() {
    const newStudent = {
      name: studentName,
      time: new Date().toLocaleTimeString('pt-br', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit', 
      })
    }

    setStudents( prevState => [...prevState, newStudent])

  }

  useEffect(() => {
    // fetch('https://api.github.com/users/Will-Ifes').then(response => response.json()).then(data => {
    //   setUser({
    //     name: data.name,
    //     avatar: data.avatar_url,
    //   })
    // })

    async function fetchData() {
      const response = await fetch('https://api.github.com/users/Will-Ifes')
      const data = await response.json()

      setUser({
        name: data.name,
        avatar: data.avatar_url,
      })
    }

    fetchData()
  }, [])

  return (
    <div className='container'>
      <header>
        <h1>Lista de Preesença</h1>
        <div>
          <strong>{user.name}</strong>
          <img src={user.avatar} alt="Foto de Perfil" />
        </div>
      </header>

      <input 
      type="text" 
      placeholder="Digite o nome..."
      onChange={e => setStudentName(e.target.value)}/>

      <button type="button" onClick={handleAddStudent}>
        Adicionar
      </button>

      {
        students.map(student => (
        <Card 
          key = {student.time}
          name = {student.name} 
          time= {student.time} 
          />
        ))
      }
    </div>
  )
}


