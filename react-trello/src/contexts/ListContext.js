import React from 'react'

const ListContext = React.createContext({
  lists: [] ,
  setLists: () => {},
  hiddenLists: [],
  setHiddenLists: () => {}
})

export default ListContext
