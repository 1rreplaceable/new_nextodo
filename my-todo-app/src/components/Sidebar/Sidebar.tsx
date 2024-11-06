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

const Sidebar = ({setSelectedView, setSelectedMember, userId} : SidebarProps) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8081/nextodo/getmembers?userId=${userId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("그룹 목록을 불러오는 데 실패했습니다.");
                }
                return res.json();
            })
            .then((data) => setMembers(data))
            .catch((error) => console.error("Error fetching members:", error));
    }, [userId]);

    // 멤버 추가 함수
    const handleAddMember = () => {
        fetch("http://localhost:8081/nextodo/addmember", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memberName: newMemberName, userId: userId })
        })
            .then((res) => res.json())
            .then((newMember) => {
                setMembers([...members, newMember]);
                setNewMemberName("");
                setIsModalOpen(false);
            })
            .catch((error) => console.error("Error adding member:", error));
    };
    return (
        <aside className="w-1/5 bg-gray-100 p-4 shadow-md">
            {/* 일정 섹션 */}
            <ul className="space-y-4">
                <li>
                    <button
                        className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                        onClick={() => setSelectedView("AddTask")}
                    >
                        <span>➕</span>
                        <span>일정 추가하기</span>
                    </button>
                </li>
                <li>
                    <button
                        className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                        onClick={() => setSelectedView("AllTasks")}
                    >
                        <span>📂</span>
                        <span>모든 일정</span>
                    </button>
                </li>
                <li>
                    <button
                        className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                        onClick={() => setSelectedView("Today")}
                    >
                        <span>📅</span>
                        <span>오늘 할 일</span>
                    </button>
                </li>
                <li>
                    <button
                        className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                        onClick={() => setSelectedView("Completed")}
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
                <ul className="space-y-4">
                    {members.map((member) => (
                        <li key={member.memberName}>
                            <button
                                className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                                onClick={() => {
                                    setSelectedView("Today");
                                    setSelectedMember(member.memberName);
                                }}
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                                    {member.memberName ? member.memberName.charAt(0).toUpperCase() : ""}
                                </div>
                                <span>{member.memberName}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">멤버 추가하기</h2>
                        <input
                            type="text"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="멤버 이름"
                            className="w-full p-2 border rounded-md mb-4"
                        />
                        <button
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            onClick={handleAddMember}
                        >
                            추가하기
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
