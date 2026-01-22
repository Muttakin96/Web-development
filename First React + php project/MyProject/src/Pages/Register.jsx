import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";

function Register() {
    const [ isRegister, setIsRegister ] = useState(true);
    const dispatch = useDispatch();
    const {loading, error} = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(form));
    };

    function handleRedirectLogin() {
        navigate("/login");
    }

    return (
        <>
            {isRegister &&
            <div className="fixed inset-0 bg-black/50 bg-[url('src/assets/artistic.jpg')] flex justify-center items-center z-50">
                <button onClick={() => navigate("/")} className="text-white px-10 py-5">Cancel</button>
                <div className="bg-slate-900 p-20 rounded-lg text-white">
                    <h1 className="text-center">Register</h1>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="firstName">First Name</label>
                            <br />
                            <input onChange={handleChange} className="border-2 border-[#000000] rounded-md px-3 py-1 text-black" type="text" name="firstName" id="firstName" placeholder="First Name" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <br />
                            <input onChange={handleChange} className="border-2 border-[#000000] rounded-md px-3 py-1 text-black" type="text" name="lastName" id="lastName" placeholder="Last Name" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <br />
                            <input onChange={handleChange} className="border-2 border-[#000000] rounded-md px-3 py-1 text-black" type="email" name="email" id="registerEmail" placeholder="Email" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <br />
                            <input onChange={handleChange} className="border-2 border-[#000000] rounded-md px-3 py-1 text-black" type="password" name="password" id="registerPassword" placeholder="Password" />
                        </div>
                        <button type="submit" className="bg-slate-950 px-5 py-2 mt-3 rounded-lg" disabled={loading}>
        {loading ? "Registering..." : "Register"}</button>
                        {error && <p>{error}</p>}
                    </form>
                    <p>Already have an acount?</p>
                    <button onClick={handleRedirectLogin}>Login</button>
                </div>
            </div>
            }
        </>
    )
}

export default Register