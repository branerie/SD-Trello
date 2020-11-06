import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom';
import UserContext from '../../Context';
import authenticateUpdate from '../../utils/authenticate-update';
import SubmitButton from '../button/submit-button';
import Input from '../input';
import Title from '../title';
import styles from './index.module.css'

export default function EditProfile(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const context = useContext(UserContext);
    const params = useParams()
    const id = params.userid

    const handleSubmit = async (event) => {
        event.preventDefault();

        await authenticateUpdate(`http://localhost:4000/api/user/${id}`, 'PUT', {
            username,
            password
        }, (user) => {
            context.logIn(user)
        }, (e) => {
            console.log("Error", e);
        })
        props.hideForm()
    };

    return (
        <div className={styles.form}>
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Edit Profile" />
                <Input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    label="New Username"
                    id="username"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    label="New Password"
                    id="password"
                />
                <SubmitButton title="Update" />
            </form>
        </div>
    )
}
