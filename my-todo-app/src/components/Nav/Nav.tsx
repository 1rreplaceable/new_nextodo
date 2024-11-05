// src/components/Nav/Nav.tsx
type NavProps = {
    isLoggedIn: boolean;
    userName: string;
    onLoginClick: () => void;
    onSignUpClick: () => void;
    onLogoutClick: () => void;
};

const Nav = ({ isLoggedIn, userName, onLoginClick, onSignUpClick, onLogoutClick }: NavProps) => {
    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow-md">
            <h1 className="text-4xl text-blue-500 font-bold">Nextodo</h1>

            <ul className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <>
                        <div className="w-10 h-10 rounded-full bg-gray-400 text-xl flex items-center justify-center text-white font-bold">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <li className="font-medium text-gray-700">{userName}</li>
                        <button onClick={onLogoutClick} className="ml-4 text-red-500 hover:underline">Logout</button>
                    </>
                ) : (
                    <>
                        <button className="mr-4" onClick={onLoginClick}>Login</button>
                        <button onClick={onSignUpClick}>Sign Up</button>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Nav;
