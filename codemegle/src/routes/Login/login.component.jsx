import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword, registerWithEmailAndPassword } from "../../utils/firebase/firebase.utils";
import "./login.styles.css";
import logo from "./logo.png";

const Login = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            if (!loginEmail) {
                console.log('Enter email address!');
            }
            if (!loginPassword) {
                console.log('Enter password!');
            }
            if (loginEmail&&loginPassword) {
                await logInWithEmailAndPassword(loginEmail, loginPassword).then(() => {navigate("/home")});
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRegister = async () => {
        if (!registerEmail) {
            console.log('Enter email address!');
        }
        if (!registerPassword) {
            console.log('Enter password!');
        }
        if (registerEmail&&registerPassword) {
            await registerWithEmailAndPassword(registerEmail, registerPassword).then(() => {navigate("/home")});
        }
    };

    return (
        <div className="page">
            <img src={logo} alt="logo" height={150} width={400}/>
            <div className="row">

                <div className="login col card">
                    <h2 className="cardTitle">Sign In</h2>

                    <div className="login__container">
                        <div>
                            <label className="cardText">E-mail Address</label>
                            <input 
                                type="text"
                                className="login__textBox"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail((e.target.value).toLowerCase())}
                                required
                            />
                        </div>
                        <div>
                            <label className="cardText">Password</label>
                            <input
                                type="password"
                                className="login__textBox"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            className="login__btn"
                            onClick={handleSignIn}
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                <div className="register col card">
                    <h2 className="cardTitle">Create Account</h2>

                    <div className="login__container">
                        <div>
                            <label className="cardText">E-mail Address</label>
                            <input
                                type="text"
                                className="login__textBox"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail((e.target.value).toLowerCase())}
                                required
                            />
                        </div>
                        <div>
                            <label className="cardText">Password</label>
                            <input
                                type="text"
                                className="login__textBox"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                required
                                
                            />
                        </div>
                        <button
                            className="login__btn"
                            onClick={handleRegister}
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default Login;