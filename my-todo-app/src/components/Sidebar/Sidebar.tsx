// src/components/Sidebar/Sidebar.tsx
import {useEffect, useState} from "react";

type SidebarProps = {
    setSelectedView: (view: "Today" | "AllTasks" | "Completed" | "AddTask" | "memberTasks") => void;
    userId: number;
}

type Member = {
    id: number;
    name: string;
}

const Sidebar = ({setSelectedView, userId} : SidebarProps) => {
    // const [members, setMembers] = useState<Member[]>([]);
    //
    // useEffect(() => {
    //     fetch(`http://localhost:8081/nextodo/groups?userId=${userId}`)
    //         .then((res) => {
    //             if (!res.ok) {
    //                 throw new Error("그룹 목록을 불러오는 데 실패했습니다.");
    //             }
    //             return res.json();
    //         })
    //         .then((data) => setMembers(data))
    //         .catch((error) => console.error("Error fetching members:", error));
    // }, [userId]);
    // 샘플 친구 데이터
    const members: Member[] = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
    ];
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
            {/* 친구 목록 섹션 */}
            <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">그룹</h3>
                <ul className="space-y-4">
                    {members.map((member) => (
                        <li key={member.id}>
                            <button
                                className="flex items-center space-x-3 p-2 w-full rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                                onClick={() => setSelectedView("memberTasks")}
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{member.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
