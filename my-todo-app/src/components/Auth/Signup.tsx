// src/components/Auth/SignUp.tsx
import React, { useState } from "react";

type SignUpProps = {
    onSignUp: () => void;
};

const SignUp = ({ onSignUp }: SignUpProps) => {
    const URL = "http://localhost:8081/nextodo/signup";
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetch(URL,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: userEmail,
                userName: userName,
                userPassword: userPassword,
            }),
        }).then(res => res.json());
        //alert("회원가입이 완료되었습니다.");
        onSignUp();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="이메일"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
            />
            <input
                type="text"
                placeholder="닉네임"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 border rounded-md"
            />
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                회원가입
            </button>
        </form>
    );
};

export default SignUp;
