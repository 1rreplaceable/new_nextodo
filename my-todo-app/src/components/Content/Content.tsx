// src/components/Content/Content.tsx
import { useEffect, useState } from "react";

type Todo = {
    id: number;
    title: string;
    completed: boolean;
    startDate: Date;
    endDate: Date;
}

type Comment = {
    id: number;
    text: string;
    writer: string;
    userId: number;
}

type ContentProps = {
    selectedView: string;
    selectedMember: number | null;
    userId: number;
    userName: string;
}

const Content = ({ selectedView, selectedMember, userId, userName }: ContentProps) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [commentText, setCommentText] = useState("");

    const targetUserId = selectedMember || userId;

    useEffect(() => {
        fetch(`http://localhost:8081/nextodo/getalltodo?userId=${targetUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("일정을 불러오는 데 실패했습니다.");
                }
                return res.json();
            })
            .then((data) => setTodos(data))
            .catch((error) => console.error("데이터 불러오기 에러:", error));
    }, [targetUserId, selectedView]);

    const openModal = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsModalOpen(true);
        fetch(`http://localhost:8081/nextodo/comments?todoId=${todo.id}`)
            .then((res) => res.json())
            .then((data) => setComments(data))
            .catch((error) => console.error("Error fetching comments:", error));
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
    const handleComplete = () => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                selectedTodos.includes(todo.id) ? { ...todo, completed: true } : todo
            )
        );
        setSelectedTodos([]); // 완료 처리 후 선택 초기화
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
                    <h1 className="text-2xl font-bold mb-4">
                        {selectedMember ? "그룹 멤버의 오늘 할 일" : "오늘 할 일"}
                    </h1>
                    <ul className="space-y-2">
                        {todos
                            .filter((todo) => getStatusLabel(todo) === "진행중" && !todo.completed)
                            .map((todo) => (
                                <li key={todo.id} className="border-b py-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedTodos.includes(todo.id)}
                                        onChange={() =>
                                            setSelectedTodos((prevSelected) =>
                                                prevSelected.includes(todo.id)
                                                    ? prevSelected.filter((id) => id !== todo.id)
                                                    : [...prevSelected, todo.id]
                                            )
                                        }
                                        className="w-4 h-4 text-blue-600 mr-2 bg-gray-100 border-gray-300 rounded"
                                    />
                                    <button
                                        className="text-left flex-1"
                                        onClick={() => openModal(todo)}
                                    >
                                        <span className="font-bold">{todo.title}</span>
                                        <span className="ml-2 text-sm text-gray-500">진행중</span>
                                    </button>
                                </li>
                            ))}
                    </ul>

                    {/* 완료 버튼 추가 */}
                    {selectedTodos.length > 0 && (
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => handleComplete()}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                완료
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedView === "AddTask" && (
                <>
                    <h1 className="text-2xl font-bold mb-4">일정 추가하기</h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetch("http://localhost:8081/nextodo/addtodo", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId: userId,
                                    complete: false,
                                    title: title,
                                    startDate: startDate,
                                    endDate: endDate,
                                }),
                            })
                                .then((res) => {
                                    if (!res.ok) {
                                        throw new Error("일정 추가에 실패했습니다.");
                                    }
                                    return res.json();
                                })
                                .then((newTodo) => {
                                    setTodos((prevTodos) => [...prevTodos, newTodo]); // 새로운 일정 추가
                                    alert("일정이 추가되었습니다!");
                                    setTitle("");
                                    setStartDate(today);
                                    setEndDate(today);
                                })
                                .catch((error) => {
                                    console.error("일정 추가 오류:", error);
                                    alert("일정 추가에 실패했습니다.");
                                });
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="text"
                            placeholder="할 일 제목"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
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
                            <p><strong>시작일:</strong> {selectedTodo.startDate || "미정"}</p>
                            <p><strong>종료일:</strong> {selectedTodo.endDate || "미정"}</p>

                            {/* 댓글 섹션 */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                                <ul className="space-y-4">
                                    {comments.map((comment) => (
                                        <li key={comment.userId} className="flex items-start space-x-4">
                                            <div
                                                className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                                                {comment.writer.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="bg-gray-100 rounded-lg p-4 flex-1">
                                                <p className="font-semibold">{comment.writer}</p>
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
                                    console.log(userId + " " + userName + " " + commentText);
                                    setComments([...comments, {id: 1, text: commentText, writer: userName, userId: userId}]);
                                    fetch("http://localhost:8081/nextodo/todos/comment", {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            text: commentText,
                                            writer: userName,
                                            userId: userId,
                                        }),
                                    }).then((res) => {
                                        if (!res.ok) {
                                            throw new Error("댓글 입력에 실패했습니다.");
                                        }
                                        return res.json();
                                    }).then((newComment) => {
                                        setComments((prevComments) => [...prevComments, newComment]);
                                        alert("댓글이 입력되었습니다!");
                                        setCommentText("");
                                    }).catch((error) => {
                                        console.error("일정 추가 오류:", error);
                                        alert("댓글 입력에 실패했습니다.");
                                    });
                                }}
                                className="mt-4"
                            >
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
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
