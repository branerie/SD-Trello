import React, { useState } from 'react'
import styles from './index.module.css'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import SearchResults from '../SearchResults'
import searchImg from '../../images/search.svg'


const SearchField = ({ isAsideOn }) => {
    const [searchInput, setSearchInput] = useState('')
    const [showSearchForm, setShowSearchForm, dropdownRefSearch] = useDetectOutsideClick()
    const [isShownSearchInput, setIsShownSearchInput] = useState(false)

    const onBlur = () => {
        setTimeout(() => (setShowSearchForm(false)), 120)
        setTimeout(() => (setIsShownSearchInput(!isShownSearchInput)), 120)
    }

    const hideSearchResult = () => {
        setShowSearchForm(!showSearchForm)
        setSearchInput('')
    }

    return (
        <>
            <div className={styles['search-button']} onClick={() => setIsShownSearchInput(!isShownSearchInput)} >
                <img className={styles['search-icon']} src={searchImg} alt='search' />
            </div>
            <div className={isShownSearchInput ? 
                ( isAsideOn
                    ? (`${styles['new-line']} ${styles['search-fields']} ${isAsideOn && styles['small']}`)
                    : (`${styles['new-line']} ${styles['search-fields']}`)
                )
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
                {( searchInput.length > 0 && showSearchForm)
                    ?   <div ref={dropdownRefSearch}>
                            <SearchResults searchInput={searchInput} hideSearchResult={hideSearchResult} />
                        </div>
                    : null
                }
            </div>
        </>
    )
}

export default SearchField