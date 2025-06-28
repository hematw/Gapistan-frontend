import { NavLink } from "react-router-dom";

function DashboardSidebar() {
  return (
    <aside className="h-full w-64 bg-white dark:bg-dark border-r flex flex-col py-6 px-4 shadow-lg">
      <div className="mb-8 flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-10 w-10" />
        <span className="text-xl font-bold">Gapistan Dashboard</span>
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/dashboard/users"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition font-medium ${isActive ? "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-200" : "hover:bg-gray-100 dark:hover:bg-dark-2"}`
          }
        >
          Users
        </NavLink>
        <NavLink
          to="/dashboard/reports"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition font-medium ${isActive ? "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-200" : "hover:bg-gray-100 dark:hover:bg-dark-2"}`
          }
        >
          Reports
        </NavLink>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
