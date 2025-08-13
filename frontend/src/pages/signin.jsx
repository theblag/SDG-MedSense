import { auth, database, googleprovider } from '../config/firebase';
import { useState, useEffect, useRef } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import googlepic from '../assets/Googlepic.png';
import { addDoc, collection } from 'firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import WavesHero from "@/components/nurui/waves-hero";
import { GlowCard } from '../components/nurui/spotlight-card';

const Signin = () => {
    const navigate = useNavigate();
    const [username, setusername] = useState("");
    const iconRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleCardHover = () => {
        if (iconRef.current) {
            iconRef.current.playFromBeginning();
        }
    };

    const signInWithGoogle = async () => {
        if (!username) {
            alert("Please enter username");
            return;
        }
        try {
            await signInWithPopup(auth, googleprovider);
            addUser();
            navigate("/home");
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            alert("Error signing in with Google. Please try again.");
        }
    };
    
    const addUser = async () => {
        const userRef = collection(database, "Users");
        const userDocRef = doc(userRef, auth.currentUser.uid);

        try {
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                await setDoc(userDocRef, {
                    username: username,
                    email: auth.currentUser.email,
                });
            }
        } catch (err) {
            console.error("Error adding user:", err);
        }
    };

    return (
        <div className='bg-black'>
            <div className='sec2bg'>
                <div className="grid place-items-center w-[90vw] mx-auto custom-cursor py-20">
                    <GlowCard
                        customSize
                        className="w-full max-w-md h-auto py-[3rem] px-[2rem] flex items-center justify-center"
                        glowColor="blue"
                        onMouseEnter={handleCardHover}
                    >
                        <div className="glow-card-content w-full">
                            <div className="icon flex justify-center mb-[10%]">
                                <lord-icon
                                    ref={iconRef}
                                    src="https://cdn.lordicon.com/hrjifpbq.json"
                                    colors="primary:#ebe6ef,secondary:#3a3347,tertiary:#a66037,quaternary:#f9c9c0,quinary:#6366f1"
                                    trigger="hover"
                                    style={{
                                        width: 'clamp(40px, 8vw, 65px)',
                                        height: 'clamp(40px, 8vw, 65px)',
                                        marginBottom: '0px',
                                        cursor: 'pointer',
                                        margin: "0px"
                                    }}
                                />
                            </div>
                            <div className="title text-center text-[1.5rem] text-white leading-[1.5rem] mb-[2rem]">Welcome to MedSense</div>
                            
                            <div className="mb-6">
                                <label className="block text-slate-400 text-sm font-medium mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400"
                                    onChange={(e) => setusername(e.target.value)}
                                />
                            </div>

                            <div className="mb-6">
                                <button
                                    onClick={signInWithGoogle}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white font-medium transition-all duration-200"
                                >
                                    <img className="w-6 h-6" src={googlepic} alt="Google logo" />
                                    Sign in with Google
                                </button>
                            </div>

                            <div className="text-center text-slate-400 text-sm mt-6">
                                By signing in, you agree to our Terms and Privacy Policy
                            </div>
                        </div>
                    </GlowCard>
                </div>
            </div>
        </div>
    );
};

export default Signin;