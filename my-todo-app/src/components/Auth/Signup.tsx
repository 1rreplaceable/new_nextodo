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
    const emailCheck =
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const emailValid = emailCheck.test(userEmail);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (emailValid) {
            try {
                const response = await fetch(URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userEmail: userEmail,
                        userName: userName,
                        userPassword: userPassword,
                    }),
                });
                if (response.ok) {
                    alert("회원가입이 완료되었습니다.");
                    onSignUp();
                } else {
                    alert("회원가입에 실패했습니다. 다시 시도해주세요.");
                }
            } catch (error) {
                console.error("Error during sign-up:", error);
                alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
            }
        } else {
            alert("아이디 형식을 이메일로 해주세요.");
            setUserName("");
            setUserEmail("");
            setUserPassword("");
        }
    };


    return (
        <div className="flex items-center flex-col">
            <div className="mb-10 font-bold text-3xl">Sign Up</div>
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
        </div>
    );
};

            export default SignUp;