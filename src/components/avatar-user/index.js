import styles from "./index.module.css"
import Image from "cloudinary-react/lib/components/Image"
import Transformation from "cloudinary-react/lib/components/Transformation"
import Avatar from "react-avatar"

export default function AvatarUser({ user, onClick, className, key, size }) {

    return (

        user.image ?
                <Image
                    publicId={user.image.publicId}
                    onClick={onClick}
                    key={key}
                    className={`${styles['profile-picture']} ${className}`}
                    title={user.username}
                >
                    <Transformation width={size} height={size} gravity="faces" crop="fill" />
                </Image>

            :

            <Avatar
                key={key}
                className={className}
                onClick={onClick}
                name={user.username}
                size={size}
                round={true}
                maxInitials={2}
            />
    )
}