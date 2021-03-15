import React, { useContext, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Image, Transformation } from 'cloudinary-react'
import styles from './index.module.css'
import UserContext from '../../contexts/UserContext'
import useUserServices from '../../services/useUserServices'
import { useDetectOutsideClick } from '../../utils/useDetectOutsideClick'
import ButtonGrey from '../ButtonGrey'
import ConfirmDialog from '../../components/ConfirmationDialog'
import pen from '../../images/pen.svg'



const UpdateUserImage = ({ user, getData }) => {
    const history = useHistory()
    const { userid } = useParams()
    const { logIn } = useContext(UserContext)
    const { updateUserImage } = useUserServices()
    const [isEditPictureActive, setIsEditPictureActive, dropdownRef] = useDetectOutsideClick()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const userName = user.username
    const userImage = user.image

    const deletePic = async () => {
        const newImage = null
        const user = await updateUserImage(userid, newImage, userImage)
        logIn(user)
        getData()
    }

    const changeProfilePicture = () => {
        const widget = window.cloudinary.createUploadWidget({
            cloudName: process.env.REACT_APP_CLOUD_NAME,
            uploadPreset: process.env.REACT_APP_UPLOAD_PRESET
        }, async (error, result) => {
            if (result.event === 'success') {
                const path = result.info.path
                const publicId = result.info.public_id
                const newImage = {
                    path,
                    publicId
                }
                const user = await updateUserImage(userid, newImage, userImage)
                logIn(user)
                getData()
            }
            if (error) {
                history.push('/error')
                return
            }
        })
        widget.open()
    }

    return (
        <div className={styles['profile-pic-container']}>
            {
                isConfirmOpen &&
                <ConfirmDialog
                    title={'delete this picture'}
                    hideConfirm={() => setIsConfirmOpen(false)}
                    onConfirm={() => deletePic()}
                />
            }
            <div className={styles['profile-pic']}
                onClick={() => {
                    userImage ?
                        setIsEditPictureActive(!isEditPictureActive)
                        : changeProfilePicture()
                }}
            >
                {
                    userImage ?
                        <div className={styles['profile-picture']}>
                            <Image publicId={userImage.publicId} className={styles['profile-picture-pic']} >
                                <Transformation width='200' height='200' gravity='faces' crop='fill' />
                            </Image>
                            <div className={styles.relative}>
                                {
                                    isEditPictureActive &&
                                    <div ref={dropdownRef} className={`${styles.menu}`} >
                                        <ButtonGrey
                                            onClick={changeProfilePicture}
                                            title='Edit'
                                            className={styles.edit}
                                        />
                                        <ButtonGrey
                                            onClick={() => {
                                                setIsConfirmOpen(true)
                                            }}
                                            title='Delete'
                                            className={styles.delete}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                        :
                        <div className={styles['no-pic']}>
                            <div className={styles['load-pic-text']}>
                                Load a profile picture
                            </div>
                            
                            <img className={styles.pen} src={pen} alt='' />
                        </div>
                }
            </div>
            <div>{userName}</div>
        </div>
    )
}

export default UpdateUserImage
