// src/components/Auth/Login.tsx
import React, {useState} from "react";

type LoginProps = {
    onLogin: (userName: string, userId: number) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetch("http://localhost:8081/nextodo/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: userEmail,
                userPassword: userPassword,
            }),
        }).then((res) => {
            if (!res.ok) {
                throw new Error("로그인에 실패했습니다.");
            }
            return res.json();
        }).then((data) => {
            onLogin(data.userName, data.userId);
            alert("로그인에 성공했습니다.");
        }).catch((error) => {
            alert(error.message);
        });
    };

    return (
        <div className="flex items-center flex-col">
            <div className="mb-10 font-bold text-3xl">Login</div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="아이디"
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
                <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    로그인
                </button>
            </form>
        </div>
    );
};

export default Login;
