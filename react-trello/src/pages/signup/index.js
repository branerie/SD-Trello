import React, { useContext, useState } from "react";
import SubmitButton from "../../components/button/submit-button";
import Input from "../../components/input";
import PageLayout from "../../components/page-layout";
import Title from "../../components/title";
import styles from "./index.module.css";
import authenticate from "../../utils/authenticate";
import UserContext from "../../Context";
import { useHistory } from "react-router-dom";

const SignupPage = () => {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);
    const [rePassword, setRePassword] = useState(null);
    const [alert, setAlert] = useState(false);
    const context = useContext(UserContext);
    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== rePassword) {
            setAlert(true)
            return
        }

        await authenticate("http://localhost:4000/api/user/register", 'POST', {
            email,
            username,
            password
        }, (user) => {
            context.logIn(user);
            history.push("/");
        }, (e) => {
            console.log("Error", e);
        })

    };

    return (
        <PageLayout>
            {alert ? (<div className={styles.alert}>
                Passwords do not match
            </div>) : null}
            <form className={styles.container} onSubmit={handleSubmit}>
                <Title title="Register" />
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label="Username"
                    id="username"
                />
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    id="email"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    id="password"
                />
                <Input
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    label="Re-Password"
                    id="re-password"
                />

                <SubmitButton title="Register" />
            </form>
        </PageLayout>
    )

}

export default SignupPage;