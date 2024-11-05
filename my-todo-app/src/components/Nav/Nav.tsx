// src/components/Nav/Nav.tsx
type NavProps = {
    isLoggedIn: boolean;
    userName: string;
}
const Nav = ({ isLoggedIn, userName } : NavProps) => {
    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow-md">
            <h1 className="text-4xl text-blue-500 font-bold">Nextodo</h1>

            <ul className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <>
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                            {userName?.charAt(0).toUpperCase()}
                        </div>
                        <li className="font-medium text-gray-700">{userName}</li>
                    </>
                ) : (
                    <>
                        <li className="font-medium text-blue-500">Login</li>
                        <li className="font-medium text-blue-500">Signup</li>
                    </>
                    )}
            </ul>
        </nav>
    );
};

export default Nav;
