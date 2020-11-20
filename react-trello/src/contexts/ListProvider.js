import React, { useState } from 'react'
import ListContext from './ListContext'

function ListProvider({ children }) {
  const [lists, setLists] = useState([])
  const [hiddenLists, setHiddenLists] = useState([])
  
  return (
    <ListContext.Provider value={ { lists, setLists, hiddenLists, setHiddenLists } }>
      {children}
    </ListContext.Provider>
  )
}

export default ListProvider
