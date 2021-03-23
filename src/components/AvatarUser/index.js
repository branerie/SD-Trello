import React from 'react'
import Avatar from 'react-avatar'
import Image from 'cloudinary-react/lib/components/Image'
import Transformation from 'cloudinary-react/lib/components/Transformation'
import styles from './index.module.css'

const AvatarUser = ({ user, onClick, className, size }) => {
    return (
        user.image
            ? <Image
                publicId={user.image.publicId}
                onClick={onClick}
                className={`${styles['profile-picture']} ${className}`}
                title={user.username}
            >
                <Transformation
                    width={size}
                    height={size}
                    gravity='faces'
                    crop='fill'
                />
            </Image>
            : <Avatar
                className={className}
                onClick={onClick}
                name={user.username}
                size={size}
                round={true}
                maxInitials={2}
            />
    )
}

export default AvatarUser