import React, { useState } from 'react'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import SearchResults from '../SearchResults'
import styles from './index.module.css'
import searchImg from '../../images/search.svg'


const SearchField = ({ asideOn }) => {
    const [searchInput, setSearchInput] = useState('')
    const [showSearchForm, setShowSearchForm, dropdownRefSearch] = useDetectOutsideClick()
    const [showSearchInput, setShowSearchInput] = useState(false)

    const onBlur = () => {
        setTimeout(() => (setShowSearchForm(false)), 120)
        setTimeout(() => (setShowSearchInput(!showSearchInput)),120)

    }

    return (
        <>
            <div className={styles['search-button']} onClick={() => setShowSearchInput(!showSearchInput)} >
                <img className={styles['search-icon']} src={searchImg} alt='search' />
            </div>
            <div className={showSearchInput ? 
                ( asideOn? 
                    (`${styles['new-line']} ${styles['search-fields']} ${styles['small']} `)
                    :(`${styles['new-line']} ${styles['search-fields']}`)) 
                : styles['search-fields']} >
                <input 
                    className={styles.input} 
                    type='text'
                    placeholder={!showSearchForm ? 'Search...' : 'Enter Project or Team name'}
                    autoComplete='off'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onClick={() => setShowSearchForm(true)}
                    onBlur={onBlur}
                />
                {
                    (
                        searchInput.length > 0
                        &&
                        showSearchForm) ?
                        <div ref={dropdownRefSearch}>
                            <SearchResults searchInput={searchInput} hideForm={() => { setShowSearchForm(!showSearchForm); setSearchInput('') }} />
                        </div>
                        : null
                }
            </div>
        </>
    )
}

export default SearchField