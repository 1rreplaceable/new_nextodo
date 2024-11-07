// src/components/Content/Content.tsx
import { useEffect, useState} from "react";

type Todo = {
    todoId: number;
    title: string;
    complete: string;
    startDate: Date;
    endDate: Date;
}

type Comments = {
    text: string;
    writer: string;
    todoId: number;
}

type ContentProps = {
    selectedView: string;
    selectedMember: string | null;
    userId: number;
    userName: string;
}

const Content = ({ selectedView, selectedMember, userId, userName }: ContentProps) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
    const [comments, setComments] = useState<Comments[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [commentText, setCommentText] = useState("");
    const targetUserId = userId;

    useEffect(() => {
        if (selectedMember !== "") {
            fetch(`http://localhost:8081/nextodo/getmemberstodo?memberName=${selectedMember}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("멤버 일정을 불러오는 데 실패했습니다.");
                    }
                    return res.json();
                })
                .then((data) => setTodos(data))
                .catch((error) => console.error("데이터 불러오기 에러:", error));
        } else {
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
        }
    }, [selectedMember, selectedView]);

    const openModal = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsModalOpen(true);
        fetch(`http://localhost:8081/nextodo/getcomments?todoId=${todo.todoId}`)
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
        const endDate = todo.startDate ? new Date(todo.endDate).toISOString().split("T")[0] : null;

        if (todo.complete === "true") {
            return "완료";
        } else if(todo.complete === "false") {
            if (startDate && today < startDate) {
                return "진행전";
            } else if (endDate && today > endDate) {
                return "기한만료"
            } else {
                return "진행중";
            }
        }
    };
    const handleCheckboxChange = (id: number) => {
      if(selectedTodos.includes(id)) {
          setSelectedTodos((prev) => prev.filter((todoid) => todoid != id));
      } else {
          setSelectedTodos((prev) => [...prev, id])
      }
    };

    const handleComplete = async () => {
        if (selectedTodos.length === 0) return;
        try {
            const response = await fetch("http://localhost:8081/nextodo/complete", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( selectedTodos),
            });

            if (!response.ok) {
                throw new Error("완료 상태 업데이트에 실패했습니다.");
            }

            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    selectedTodos.includes(todo.todoId) ? { ...todo, complete: "true" } : todo
                )
            );
            setSelectedTodos([]);
        } catch (error) {
            console.error("Error updating todo status:", error);
            alert("완료 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <main className="flex-1 bg-white p-6">
            {selectedView === "AddTask" && (
                <>
                    <h1 className="text-2xl font-bold mb-4">일정 추가하기</h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const dateCheck = startDate <= endDate;
                            if (title !== "" && dateCheck) {
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
                            } else {
                                alert("일정 추가 양식을 따라주세요.");
                                setStartDate(today);
                                setEndDate(today);
                            }
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
            {selectedView === "AllTasks" && (
                <>
                    <h1 className="text-2xl font-bold mb-4">모든 일정</h1>
                    {todos.length > 0 ? (
                        <ul>
                            {todos.map((todo) => (
                                <li key={todo.todoId} className="border-b py-4 hover:bg-gray-100">
                                    <button className="text-left w-full flex justify-between items-center" onClick={() => openModal(todo)}>
                                        <div className="flex items-center">
                                            <div
                                                className={`mr-4 text-sm pl-0 w-14 ${
                                                    getStatusLabel(todo) === "완료"
                                                        ? "text-green-500"
                                                        : getStatusLabel(todo) === "진행전"
                                                            ? "text-blue-500"
                                                            : getStatusLabel(todo) === "기한만료"
                                                                ? "text-red-500"
                                                                : "text-gray-500"
                                                }`}
                                            >
                                                {getStatusLabel(todo)}
                                            </div>
                                            <span className="font-bold">{todo.title}</span>
                                        </div>
                                        <div>
                                            {getStatusLabel(todo) === "진행전" && (
                                                <span className="text-sm text-blue-500 mr-4">
                                    {new Date(todo.startDate).toISOString().split("T")[0]}
                                </span>
                                            )}
                                            {todo.endDate && (
                                                <span className="text-sm text-gray-500">
                                    {new Date(todo.endDate).toISOString().split("T")[0]}
                                </span>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                            일정이 없습니다.
                        </div>
                    )}
                </>
            )}
            {selectedView === "Today" && (
                <>
                    <h1 className="text-2xl font-bold mb-4">
                        {selectedMember ? `${selectedMember}'s 남은 할 일` : "남은 할 일"}
                    </h1>
                    {todos.filter((todo) => getStatusLabel(todo) === "진행중" || getStatusLabel(todo) === "기한만료").length > 0 ? (
                        <>
                            <ul>
                                {todos
                                    .filter((todo) => getStatusLabel(todo) === "진행중" || getStatusLabel(todo) === "기한만료")
                                    .map((todo) => (
                                        <li key={todo.todoId} className="border-b py-4 hover:bg-gray-100 flex items-center">
                                            {selectedMember === "" && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTodos.includes(todo.todoId)}
                                                    onChange={() => handleCheckboxChange(todo.todoId)}
                                                    className="w-4 h-4 text-blue-600 mr-2 bg-gray-100 border-gray-300 rounded"
                                                />
                                            )}
                                            <button className="text-left w-full flex justify-between items-center"
                                                    onClick={() => openModal(todo)}
                                            >
                                                <div className="flex items-center">
                                                    <div className={`mr-4 text-sm pl-0 w-14 text-gray-500 ${
                                                        getStatusLabel(todo) === "진행전"
                                                            ? "text-blue-500"
                                                            : getStatusLabel(todo) === "기한만료"
                                                                ? "text-red-500"
                                                                : "text-gray-500"
                                                    }`}>{getStatusLabel(todo)}</div>
                                                    <span className="font-bold">{todo.title}</span>
                                                </div>
                                                <span
                                                    className="text-sm text-gray-500">{new Date(todo.endDate).toISOString().split("T")[0]}</span>
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                            {selectedMember === "" && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handleComplete}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        완료
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                            일정이 없습니다.
                        </div>
                    )}

                </>
            )}
            {selectedView === "Completed" && (
                <>
                    <h1 className="text-2xl font-bold mb-4">완료한 일정</h1>
                    {todos.filter((todo) => getStatusLabel(todo) === "완료").length > 0 ? (
                        <ul>
                            {todos
                                .filter((todo) => getStatusLabel(todo) === "완료")
                                .map((todo) => (
                                    <li key={todo.todoId} className="border-b py-4 hover:bg-gray-100">
                                        <button className="text-left w-full flex justify-between items-center"
                                                onClick={() => openModal(todo)}>
                                            <div className="flex items-center">
                                                <span className="mr-4 text-sm pl-0 w-10 text-green-500">완료</span>
                                                <span className="font-bold">{todo.title}</span>
                                            </div>
                                            <span
                                                className="text-sm text-gray-500">{new Date(todo.endDate).toISOString().split("T")[0]}</span>
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                            완료한 일정이 없습니다.
                        </div>
                    )}
                </>
            )}
            {isModalOpen && selectedTodo && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg relative max-h-fit">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">{selectedTodo.title}</h2>
                        <p><strong>완료 여부:</strong> {getStatusLabel(selectedTodo)}</p>
                        <p>
                                <strong>시작일:</strong> {selectedTodo.startDate ? new Date(selectedTodo.startDate).toLocaleDateString() : "미정"}
                            </p>
                            <p>
                                <strong>종료일:</strong> {selectedTodo.endDate ? new Date(selectedTodo.endDate).toLocaleDateString() : "미정"}
                            </p>
                            {/* 댓글 섹션 */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                                <ul className="space-y-4">
                                    {comments.map((comment) => (
                                        <li key={comment.todoId} className="flex items-start space-x-4 relative group">
                                            <div
                                                className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                                                {comment.writer.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="bg-gray-100 rounded-lg p-4 flex-1">
                                                <p className="font-semibold">{comment.writer}</p>
                                                <p>{comment.text}</p>
                                            </div>
                                            {userName === comment.writer && (
                                                <button
                                                    className="absolute top-1 right-3 text-red-500 group-hover:block"
                                                    // onClick={}
                                                >
                                                    &#10005;
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        {/* 댓글 작성 폼 */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (commentText != "") {
                                    fetch("http://localhost:8081/nextodo/writecomment", {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            text: commentText,
                                            writer: userName,
                                            todoId: selectedTodo?.todoId,
                                        }),
                                    }).then((res) => {
                                        if (!res.ok) {
                                                throw new Error("댓글 입력에 실패했습니다.");
                                            }
                                            return res.json();
                                        }).then((newComment) => {
                                            setComments((prevComments) => [...prevComments, newComment]);
                                            alert("댓글이 입력되었습니다!");
                                        })
                                        setCommentText("");
                                    } else {
                                        alert("댓글 내용을 입력하세요.");
                                    }
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
