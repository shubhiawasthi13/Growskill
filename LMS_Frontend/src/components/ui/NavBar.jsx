import { use, useEffect, useState } from "react";
import { Moon, Sun, BrainCircuit, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../../theme/ThemeContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../features/api/authApi.js";
import { userLoggedOut } from "@/features/authSlice.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const { darkMode, setDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const role = "instructor";
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "user logout");
      dispatch(userLoggedOut());
      navigate("/");
    }
  }, [isSuccess]);

  const logoutHandler = async () => {
    await logoutUser();
  };

  return (
    <>
      <nav className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md z-50 relative sticky top-0">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <BrainCircuit
              size={30}
              className="text-blue-600 dark:text-blue-400"
            />
            <span className="text-xl font-bold">
              <Link to="/">GrowSkill</Link>
            </span>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Desktop Only: Avatar or Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.photoUrl || "https://github.com/shadcn.png"}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {user?.role === "student" && (
                        <DropdownMenuItem>
                          <Link to="/my-learning" className="w-full">
                            My Learning
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem>
                        <Link to="/profile" className="w-full">
                          Edit Profile
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        {user?.role === "instrutor" && (
                          <Link to="/admin/dashboard" className="w-full">
                            Dashboard
                          </Link>
                        )}
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={logoutHandler}>
                        <Button> Log out</Button>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline">
                    <Link to="/login" className="w-full">
                      login/signup
                    </Link>
                  </Button>
                  {/* <Button>Signup</Button> */}
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <ul className="md:hidden px-6 pb-4 pt-2 flex flex-col gap-3 font-medium bg-white dark:bg-gray-900 absolute w-full left-0 z-40 shadow-md">
            {user ? (
              <>
                <li>
                  {user?.role === "student" && (
                    <Link
                      to="/my-learning"
                      className="block py-2 hover:text-blue-500 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Learning
                    </Link>
                  )}
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="block py-2 hover:text-blue-500 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Edit Profile
                  </Link>
                </li>
                {user?.role === "instrutor" && (
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="block py-2 hover:text-blue-500 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                <li
                  className="block py-2 hover:text-blue-500 cursor-pointer"
                  onClick={() => {
                    logoutHandler();
                    setMenuOpen(false);
                  }}
                >
                  <Button>Log out</Button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="block py-2 hover:text-blue-500 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <Button>Login / Signup</Button>
                </Link>
              </li>
            )}
          </ul>
        )}
      </nav>
    </>
  );
}
