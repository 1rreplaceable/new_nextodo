// src/App.tsx
import React, { useState } from "react";
import Nav from "./components/Nav/Nav";
import Sidebar from "./components/Sidebar/Sidebar";
import Content from "./components/Content/Content";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/Signup";

type AuthView = "login" | "signup" | null;

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authView, setAuthView] = useState<AuthView>(null);
    const [selectedView, setSelectedView] = useState("Today");
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState<number>(1);
    const [selectedMember, setSelectedMember] = useState<number | null>(null);

    const handleLogin = (userName: string, userId: number) => {
        setIsLoggedIn(true);
        setUserName(userName);
        setUserId(userId);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName("");
        setUserId(0);
    };

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
                    <Sidebar setSelectedView={setSelectedView} userId={userId} setSelectedMember={setSelectedMember}/>
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
