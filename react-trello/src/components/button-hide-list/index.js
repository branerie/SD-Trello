import React, { useContext } from "react";
import ProjectContext from "../../contexts/ProjectContext";
import ListColor from '../list-color'
import styles from "./index.module.css";

const ButtonHideList = ( { list, type } ) => {
    const projectContext = useContext(ProjectContext)

    function onClick() {
        const newHiddenLists = [...projectContext.hiddenLists]
        
        if (newHiddenLists.includes(list._id)) {
            const index = newHiddenLists.indexOf(list._id)
            newHiddenLists.splice(index, 1)
        } else {
            newHiddenLists.push(list._id)
        }
        projectContext.setHiddenLists(newHiddenLists)
    }

    return (
    <button onClick={onClick} className={styles.submit}>
        <ListColor color={list.color || '#A6A48E'} type={type} />
        {list.name}
    </button>
    )
}

export default ButtonHideList