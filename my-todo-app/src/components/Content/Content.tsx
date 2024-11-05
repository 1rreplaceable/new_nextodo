// src/components/Content/Content.tsx
import { useEffect, useState } from "react";

type Todo = {
    id: number;
    title: string;
    completed: boolean;
    priority: string;
    startDate: string;
    endDate: string;
}

type Comment = {
    id: number;
    text: string;
    author: string;
}

type ContentProps = {
    selectedView: string;
    selectedFriend: string | null;
    userId: number;
}
const Content = ({ selectedView, selectedFriend, userId }: ContentProps) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    // 샘플 데이터
    useEffect(() => {
        const sampleTodos: Todo[] = [
            { id: 1, title: "아침에 운동하기", completed: false, priority: "상", startDate: "2024-11-03", endDate: "2024-11-10" },
            { id: 2, title: "저녁에 밥먹기", completed: true, priority: "하", startDate: "2024-11-02", endDate: "2024-11-06" },
            { id: 3, title: "보고서 작성하기", completed: false, priority: "중", startDate: "2024-11-05", endDate: "2024-11-05" },
        ];
        setTodos(sampleTodos);
    }, [selectedView]);

    const openModal = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsModalOpen(true);
        const sampleComments: Comment[] = [
            { id: 1, text: "굿!", author: "Stijn" },
            { id: 2, text: "별로", author: "Alice" },
        ];
        setComments(sampleComments);
    };

    const closeModal = () => {
        setSelectedTodo(null);
        setIsModalOpen(false);
        setComments([]);
    };

    const getStatusLabel = (todo: Todo) => {
        const startDate = todo.startDate ? new Date(todo.startDate).toISOString().split("T")[0] : null;
        const endDate = todo.endDate ? new Date(todo.endDate).toISOString().split("T")[0] : null;

        if (todo.completed) {
            return "완료";
        } else if (startDate && today < startDate) {
            return "진행전";
        } else if (startDate && endDate && startDate <= today && today <= endDate) {
            return "진행중";
        }
        return "상태 없음";
    };

    const handleCheckboxChange = (id: number) => {
        setSelectedTodos((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((todoId) => todoId !== id) : [...prevSelected, id]
        );
    };

    const handleComplete = () => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                selectedTodos.includes(todo.id) ? { ...todo, completed: true } : todo
            )
        );
        setSelectedTodos([]); // 선택 초기화
    };

    return (
        <main className="flex-1 bg-white p-6">
            {selectedView === "AllTasks" && (
                <>
                    <h1 className="text-2xl font-bold mb-4">모든 일정</h1>
                    <ul className="space-y-2">
                        {todos.map((todo) => (
                            <li key={todo.id} className="border-b py-2">
                                <button className="text-left w-full flex justify-between items-center" onClick={() => openModal(todo)}>
                                    <div>
                                        <span className="font-bold">{todo.title}</span>
                                        <span className={`ml-2 text-sm ${getStatusLabel(todo) === "완료" ? "text-green-500" : "text-gray-500"}`}>
                                {getStatusLabel(todo)}
                            </span>
                                    </div>
                                    {todo.endDate && (
                                        <span className="text-sm text-gray-500">
                                            {new Date(todo.endDate).toISOString().split("T")[0]}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {selectedView === "Today" && (
                <>
                    {selectedFriend}
                    <h1 className="text-2xl font-bold mb-4">오늘 할 일</h1>
                    <ul className="space-y-2">
                        {todos
                            .filter((todo) => getStatusLabel(todo) === "진행중" && !todo.completed)
                            .map((todo) => (
                                <li key={todo.id} className="border-b py-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedTodos.includes(todo.id)}
                                        onChange={() => handleCheckboxChange(todo.id)}
                                        className="w-4 h-4 text-blue-600 mr-2 bg-gray-100 border-gray-300 rounded dark:bg-gray-700"
                                    />
                                    <button className="text-left flex-1"
                                            onClick={() => openModal(todo)}>
                                        <span className="font-bold">{todo.title}</span>
                                        <span className="ml-2 text-sm text-gray-500">진행중</span>
                                    </button>
                                </li>
                            ))}
                    </ul>
                    <div className="pt-4 flex justify-end">
                        <button
                            className="space-y-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            onClick={handleComplete}
                        >
                    완료
                    </button>
                    </div>
                </>
            )}

            {selectedView === "AddTask" && (
                <>
                        <h1 className="text-2xl font-bold mb-4">일정 추가하기</h1>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // 일정 추가 로직 구현
                                alert("일정이 추가되었습니다!");
                            }}
                            className="space-y-4"
                        >
                            <input
                                type="text"
                                placeholder="할 일 제목"
                                className="w-full p-2 border rounded-md"
                            />
                            <input
                                type="date"
                                defaultValue={today} // 시작일 기본값
                                className="w-full p-2 border rounded-md"
                            />
                            <input
                                type="date"
                                defaultValue={today} // 종료일 기본값
                                className="w-full p-2 border rounded-md"
                            />
                            <div className="w-full justify-end flex">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    일정 추가
                                </button>
                            </div>
                        </form>
                    </>
            )}

            {selectedView === "Completed" && (
                <>
                        <h1 className="text-2xl font-bold mb-4">완료한 일정</h1>
                        <ul className="space-y-2">
                            {todos
                                .filter((todo) => getStatusLabel(todo) === "완료")
                                .map((todo) => (
                                    <li key={todo.id} className="border-b py-2">
                                        <button className="text-left w-full flex justify-between items-center"
                                                onClick={() => openModal(todo)}>
                                            <div>
                                                <span className="font-bold">{todo.title}</span>
                                                <span className="ml-2 text-sm text-green-500">완료</span>
                                            </div>
                                            <span className="text-sm text-gray-500">{todo.endDate}</span>
                                        </button>

                                    </li>
                                ))}
                        </ul>
                    </>
            )}

            {isModalOpen && selectedTodo && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg relative">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                onClick={closeModal}
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">{selectedTodo.title}</h2>
                            <p><strong>완료 여부:</strong> {getStatusLabel(selectedTodo)}</p>
                            <p><strong>우선순위:</strong> {selectedTodo.priority || "없음"}</p>
                            <p><strong>시작일:</strong> {selectedTodo.startDate || "미정"}</p>
                            <p><strong>종료일:</strong> {selectedTodo.endDate || "미정"}</p>

                            {/* 댓글 섹션 */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                                <ul className="space-y-4">
                                    {comments.map((comment) => (
                                        <li key={comment.id} className="flex items-start space-x-4">
                                            <div
                                                className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                                                {comment.author.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="bg-gray-100 rounded-lg p-4 flex-1">
                                                <p className="font-semibold">{comment.author}</p>
                                                <p>{comment.text}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 댓글 작성 폼 */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setComments([...comments, {id: Date.now(), text: "New comment", author: "User"}]);
                                }}
                                className="mt-4"
                            >
                                <input
                                    type="text"
                                    placeholder="댓글을 입력하세요"
                                    className="w-full p-2 border rounded-md"
                                />
                                <button
                                    type="submit"
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    댓글 추가
                                </button>
                            </form>
                        </div>
                    </div>
            )}
        </main>
    );
};

export default Content;
