import Link from "next/link"
const Layout = ({ children }) => {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full flex">
        <nav className="w-1/12 h-full border-r border-gray-400 flex flex-col justify-between items-center p-2">
          <div className="flex flex-col">
            <span className="font-bold mb-2">Admin</span>
            <Link href="weeklyquestions">
              <a>Weekly Questions</a>
            </Link>
            <Link href="settings">
              <a>Settings</a>
            </Link>
          </div>
          <button>Salir</button>
        </nav>
        <div className="w-11/12 h-full p-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout