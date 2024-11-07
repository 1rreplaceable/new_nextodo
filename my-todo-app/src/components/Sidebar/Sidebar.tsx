// src/components/Sidebar/Sidebar.tsx
import {useEffect, useState} from "react";

type SidebarProps = {
    setSelectedView: (view: "Today" | "AllTasks" | "Completed" | "AddTask" | "memberTasks") => void;
    userId: number;
    setSelectedMember: (memberName: string | null) => void;
}

type Member = {
    userId: number;
    memberName: string;
}

type User = {
    userId: number;
    userEmail: string;
    userName: string;
}

const Sidebar = ({setSelectedView, setSelectedMember, userId} : SidebarProps) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchMember, setSearchMember] = useState("");
    const [allMembers, setAllMembers] = useState<User[]>([]);

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8081/nextodo/getmembers?userId=${userId}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("그룹 목록을 불러오는 데 실패했습니다.");
                    }
                    return res.json();
                })
                .then((data) => setMembers(data))
                .catch((error) => console.error("Error fetching members:", error));
        }
    }, [userId]);

    useEffect(() => {
        if (isModalOpen) {
            fetch(`http://localhost:8081/nextodo/getallusers?userId=${userId}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("모든 회원 정보를 불러오는 데 실패했습니다.");
                    }
                    return res.json();
                })
                .then((data) => setAllMembers(data))
                .catch((error) => console.error("Error fetching all members:", error));
        }
    }, [isModalOpen]);

    // 멤버 추가 함수
    const handleAddMember = (memberName: string) => {
        fetch("http://localhost:8081/nextodo/addmember", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memberName: memberName, userId: userId })
        })
            .then((res) => res.json())
            .then((newMember) => {
                setMembers([...members, newMember]);
                setSearchMember("");
                setIsModalOpen(false);
            })
            .catch((error) => console.error("멤버 추가 에러:", error));
    };

    const isMemberAlreadyAdded = (userName: string) => {
        return members.some(member => member.memberName === userName);
    };

    return (
        <aside className="w-1/5 bg-gray-100 p-4 shadow-md">
            {/* 일정 섹션 */}
            <ul className="space-y-4">
                <li>
                    <button
                        className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                        onClick={() => {
                            setSelectedView("AddTask");
                            setSelectedMember("");
                        }}
                    >
                        <span>➕</span>
                        <span>일정 추가하기</span>
                    </button>
                </li>
                <li>
                    <button
                        className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                        onClick={() => {
                            setSelectedView("AllTasks");
                            setSelectedMember("");
                        }}
                    >
                        <span>📂</span>
                        <span>모든 일정</span>
                    </button>
                </li>
                <li>
                    <button
                        className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                        onClick={() =>{
                            setSelectedView("Today");
                            setSelectedMember("");
                    }}
                    >
                        <span>📅</span>
                        <span>남은 할 일</span>
                    </button>
                </li>
                <li>
                    <button
                        className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                        onClick={() => {
                            setSelectedView("Completed");
                            setSelectedMember("");
                        }}
                    >
                        <span>✅</span>
                        <span>완료한 일정</span>
                    </button>
                </li>
            </ul>
            {/* 그룹 섹션 */}
            <div className="mt-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-600">그룹</h3>
                    <button
                        type="button"
                        className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none font-medium rounded-full text-xl px-2"
                        onClick={() => setIsModalOpen(true)}
                    >
                        +
                    </button>
                </div>
                <ul className="space-y-4 mt-2">
                    {members.map((member) => (
                        <li key={member.memberName} className="relative group">
                            <button
                                className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                                onClick={() => {
                                    setSelectedView("Today");
                                    setSelectedMember(member.memberName);
                                }}
                            >
                                <div
                                    className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                                    {member.memberName ? member.memberName.charAt(0).toUpperCase() : ""}
                                </div>
                                <span>{member.memberName}</span>
                            </button>
                            <button
                                className="absolute font-semibold top-0 right-2 text-gray-400 hover:text-red-500 hidden group-hover:block"
                                // onClick={}
                            >
                                &#10005;
                            </button>
                        </li>
                    ))}
                </ul>

            </div>
            {/* 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-1/3 p-8 rounded-lg shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-center">멤버 추가하기</h2>
                        <input
                            type="text"
                            value={searchMember}
                            onChange={(e) => setSearchMember(e.target.value)}
                            placeholder="멤버 이름을 입력하세요"
                            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            list="member-options"
                        />
                        <div id="member-options"
                             className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 mb-4">
                            {allMembers.length > 0 ? (
                                <ul className="space-y-2">
                                    {allMembers
                                        .filter(member => member.userName.toLowerCase().includes(searchMember.toLowerCase()))
                                        .map((member) => (
                                            <li
                                                key={member.userId}
                                                className={`flex justify-between p-2 rounded-md cursor-pointer ${isMemberAlreadyAdded(member.userName) ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'}`}
                                                onClick={() => !isMemberAlreadyAdded(member.userName) && handleAddMember(member.userName)}
                                            >
                                                <div className="font-medium">{member.userName}</div>
                                                <div className="text-sm w-40">{member.userEmail}</div>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500">회원 목록이 없습니다.</p>
                            )}
                        </div>
                        <button
                            className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            onClick={() => setIsModalOpen(false)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
