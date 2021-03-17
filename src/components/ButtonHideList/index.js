import React, { useContext } from 'react';
import ProjectContext from '../../contexts/ProjectContext';
import ListColor from '../ListColor'
import styles from './index.module.css';

const ButtonHideList = ({ list, type }) => {
    const { hiddenLists, setHiddenLists } = useContext(ProjectContext)

    const onClick = () => {
        const newHiddenLists = [...hiddenLists]
        
        if (newHiddenLists.includes(list._id)) {
            const index = newHiddenLists.indexOf(list._id)
            newHiddenLists.splice(index, 1)
        } else {
            newHiddenLists.push(list._id)
        }

        setHiddenLists(newHiddenLists)
    }

    return (
        <button onClick={onClick} className={`${styles.submit} ${hiddenLists.includes(list._id) && styles.opacity}`}>
            <ListColor color={list.color || '#A6A48E'} type={type} />
            <div className={styles.name} title={list.name} >{list.name}</div>
        </button>
        )
}

export default ButtonHideList