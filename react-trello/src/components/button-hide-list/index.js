import React, { useContext } from "react";
import ListContext from "../../contexts/ListContext";
import ListColor from '../list-color'
import styles from "./index.module.css";

const ButtonHideList = ( { list } ) => {
    const listContext = useContext(ListContext)

    function onClick() {
        const newHiddenLists = listContext.hiddenLists
        
        if (newHiddenLists.includes(list._id)) {
            const index = newHiddenLists.indexOf(list._id)
            newHiddenLists.splice(index, 1)
        } else {
            newHiddenLists.push(list._id)
        }
        listContext.setHiddenLists(newHiddenLists)
    }

    return (
    <button onClick={onClick} className={styles.submit}>
        <ListColor />
        {list.name}
    </button>
    )
}

export default ButtonHideList