import React, { useContext } from 'react';
import ProjectContext from '../../contexts/ProjectContext';
import ListColor from '../ListColor'
import styles from './index.module.css';

const ButtonHideList = ({ list, type }) => {
    const { hiddenLists, setHiddenLists } = useContext(ProjectContext)

    const onClick = () => {
        const newHiddenLists = [...hiddenLists]
        /* REVIEW: Метода .indexOf() връща -1 ако не намери дадения елемент в масива. В момента се изцикля newHiddenLists
        два пъти - веднъж заради .includes(), намира се дали го има или няма този елемент, и после пак се изцикля масива,
        за да се намери индекса му. Ако се случи да е най-накрая на масива, се изцикля целия масив два пъти, а може да се
        мине с един път. Като знаем, че indexOf връща -1 ако не намери елемента, може да се направи такава проверка:

        const listIndex = newHiddenLists.indexOf(list._id)
        if (listIndex >= 0) {
            newHiddenLists.splice(listIndex, 1)
        } else {
            newHiddenLists.push(list._id)
        }
        */
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