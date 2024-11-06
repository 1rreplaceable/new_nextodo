// src/App.tsx
import React, {useEffect, useState} from "react";
import Nav from "./components/Nav/Nav";
import Sidebar from "./components/Sidebar/Sidebar";
import Content from "./components/Content/Content";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/Signup";

type AuthView = "login" | "signup" | null;

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authView, setAuthView] = useState<AuthView>("login");
    const [selectedView, setSelectedView] = useState("Today");
    const [userName, setUserName] = useState<string>("");
    const [userId, setUserId] = useState<number>(1);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);

    useEffect(() => {
        const storedUserName = sessionStorage.getItem("userName");
        const storedUserId = sessionStorage.getItem("userId");

        if (storedUserName && storedUserId) {
            setUserName(storedUserName);
            setUserId(parseInt(storedUserId, 10));
            setIsLoggedIn(true);
        }
    }, []);
    const handleLogin = (userName: string, userId: number) => {
        setIsLoggedIn(true);
        setUserName(userName);
        setUserId(userId);
        sessionStorage.setItem("userId", userId.toString());
        sessionStorage.setItem("userName", userName);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName("");
        setUserId(0);
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("userName");
    };
    console.log(sessionStorage.getItem("userName"));
    return (
        <div className="flex flex-col h-screen">
            <Nav
                isLoggedIn={isLoggedIn}
                userName={userName}
                onLoginClick={() => setAuthView("login")}
                onSignUpClick={() => setAuthView("signup")}
                onLogoutClick={handleLogout}
            />
            {isLoggedIn ? (
                <div className="flex flex-1">
                    <Sidebar key={userId} setSelectedView={setSelectedView} userId={userId} setSelectedMember={setSelectedMember}/>
                    <Content selectedView={selectedView} selectedMember={selectedMember} userId={userId} userName={userName}/>
                </div>
            ) : (
                <div className="flex flex-1 items-center justify-center">
                    {authView === "login" && <Login onLogin={handleLogin} />}
                    {authView === "signup" && <SignUp onSignUp={() => setAuthView("login")} />}
                </div>
            )}
        </div>
    );
};

export default App;
