import { Bell, UserCircle, ChevronDown } from "lucide-react";
import { Form, Outlet } from "react-router";

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="h-20 px-4 flex items-center text-xl font-bold border-b border-white/10">
          <span className="text-white">Dashboard</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-4 text-sm">
          <div className="space-y-2">
            <NavItem label="Dashboard" />
            <NavItem label="Project" active />
            <NavItem label="My Task" />
            <NavItem label="Activity" />
            <NavItem label="Team" />
            <NavItem label="Messages" />
            <NavItem label="Settings" />
          </div>
        </nav>
        <div className="mt-auto p-4 border-t border-white/10">
          <div className="text-xs uppercase text-white/60 mb-2">Workspace</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>
            <span>Superboard</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b px-6 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Project</h1>
          <div className="flex items-center gap-4">
            {/* <input
              type="text"
              placeholder="Search anything..."
              className="border rounded-lg px-4 py-2 text-sm w-64"
            /> */}
            <Bell className="text-gray-500 w-5 h-5" />
            <div className="group relative inline-block text-left">
              <div className="flex items-center gap-1">
                <UserCircle className="text-gray-500 w-8 h-8" />
                <div className="text-sm text-gray-800 font-medium">Jackson Pierce</div>
               <ChevronDown className="text-gray-500 w-5 h-5" />
              </div>


              <div className="group-hover:block hidden hover:block absolute top-0.5 right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1} >
                <div className="py-1" role="none">
                  {/* <!-- Active: "bg-gray-100 text-gray-900 outline-hidden", Not Active: "text-gray-700" --> */}
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="menu-item-0">Account settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="menu-item-1">Support</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="menu-item-2">License</a>
                  <Form method="post" action="/dashboard">
                    <input type="hidden" name="action_type" value={"logout"} />
                    <button type="submit" className="block cursor-pointer w-full px-4 py-2 text-left text-sm text-gray-700" role="menuitem" tabIndex={-1}>Sign out</button>
                  </Form>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ label, active = false }: { label: string, active?: boolean }) => (
  <div
    className={`px-3 py-2 rounded-lg cursor-pointer ${active ? "bg-white text-[#2D007A] font-semibold" : "hover:bg-white/10 text-amber-50"
      }`}
  >
    {label}
  </div>
);