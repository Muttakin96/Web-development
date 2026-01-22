import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, error} = useSelector(state => state.auth);
    const [loginSuccess, setLoginSuccess] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        
        dispatch(loginUser({email, password}))
            .unwrap()
            .then(() => {
                setLoginSuccess(true)
                //navigate to dashboard using loginSuccess
                // navigate("/Dashboard")
            })
            .catch(() => setLoginSuccess(false));
    }

    function handleRedirectRegister() {
        navigate("/register");
    }

    // navigate to dashboard using token
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        if (token) navigate("/dashboard");
    }, [token]);


    return(
        <>
            {isLogin &&
            <div className="fixed inset-0 bg-black/50 bg-[url('src/assets/artistic.jpg')] flex justify-center items-center z-100">
                <div className="bg-slate-900 p-20 rounded-lg text-white">
                    <h1 className="text-center">Login</h1>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <br />
                            <input value={email} onChange={event => setEmail(event.target.value)} className="border-2 border-[#000000] rounded-md px-3 py-1 text-black" type="email" name="email" id="loginEmail" placeholder="Email" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <br />
                            <input value={password} onChange={event => setPassword(event.target.value)} className="border-2 border-[#000000] rounded-md px-3 py-1 text-black" type="password" name="password" id="loginPassword" placeholder="Password" />
                        </div>
                        <button type="submit" className="bg-slate-950 px-5 py-2 mt-3 rounded-lg" disabled={loading}>Login</button>
                        {error && <p>{error}</p>} {loginSuccess && <p>Login Succesfull</p>}
                    </form>
                    <p>Don't have an account?</p>
                    <button onClick={handleRedirectRegister}>Register</button>
                </div>
            </div>
            }
        </>
    )
}

export default Login