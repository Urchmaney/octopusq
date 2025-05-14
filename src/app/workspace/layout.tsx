import { Bell, UserCircle, ChevronDown, ChevronUp } from "lucide-react";
import { RefObject, useEffect, useState } from "react";
import { Form, Outlet, useLoaderData, useNavigate, useParams } from "react-router";
import { useClickOutside, useFetcherSumbit, type WorkspaceContext } from "../../hooks";
import { Input, SecondaryButton, Modal } from "../../components";

const navLinks = [
  { label: "Dashboard", path: "/workspaces/dashboards" },
  { label: "Project", path: "/workspaces/projects" },
  { label: "My Task", path: "/workspaces/tasks" },
  // { label: "Activity", path: "/workspaces/activities" },
  // { label: "Team", path: "/workspaces/" },
  // { label: "Messages", path: "/workspaces/" },
  { label: "Settings", path: "/workspaces/" }
];

type Workspace = { id: number, name: string };
type User = { email: string, fullName: string };

export const WorkspaceLayout = () => {
  const { user, workspaces } = useLoaderData() as { user: User, workspaces: Workspace[] };
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { fetcher, busy } = useFetcherSumbit();

  const [activeNavLink, setActiveNavLink] = useState(0);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(workspaces.find(x => x.id === Number(workspaceId)) || workspaces[0]);
  const [createWorkspace, setCreateWorkspace] = useState<boolean>(false);

  const clickNavLink = (index: number, navUrl: string) => {
    setActiveNavLink(index);
    navigate(navUrl);
  }

  useEffect(() => {
    if (workspaceId || workspaces.length <= 0) return;

    setActiveWorkspace(workspaces[workspaces.length - 1]);
    setCreateWorkspace(false);
  }, [workspaces.length]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="h-20 px-4 flex items-center text-xl font-bold border-b border-white/10">
          <span className="text-white">Dashboard</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-4 text-sm">
          <div className="space-y-2">
            {
              navLinks.map((x, i) => (<NavItem key={`menu_nav_link_${i}`} label={x.label} active={i === activeNavLink} onClick={() => clickNavLink(i, x.path)} />))
            }
          </div>
        </nav>
        <div className="mt-auto p-4 border-t border-white/10">
          <Workspace workspaces={workspaces} activeWorkspace={activeWorkspace} onCreateWorkspace={() => setCreateWorkspace(true)} onClickWorkspace={(workspace: Workspace) => setActiveWorkspace(workspace)} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b px-6 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">{activeWorkspace?.name || ""}</h1>
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
                <div className="text-sm text-gray-800 font-medium">{user.fullName}</div>
                <ChevronDown className="text-gray-500 w-5 h-5" />
              </div>


              <div className="group-hover:block hidden hover:block absolute top-0.5 right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden px-2" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1} >
                <div className="py-1" role="none">
                  {/* <!-- Active: "bg-gray-100 text-gray-900 outline-hidden", Not Active: "text-gray-700" --> */}
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="menu-item-0">Account settings</a>
                  <Form method="post" action={`/workspaces/${activeWorkspace.id}`}>
                    <input type="hidden" name="action_type" value={"logout"} />
                    <button type="submit" className="block cursor-pointer w-full px-4 py-2 text-left text-sm text-gray-700 bg-red-500 rounded-2xl" role="menuitem" tabIndex={-1}>Sign out</button>
                  </Form>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet context={{ activeWorkspace: activeWorkspace.id } satisfies WorkspaceContext} />
        </main>
      </div>
      {
        createWorkspace &&
        <Modal onClose={() => setCreateWorkspace(false)}>
          <div>
            <fetcher.Form className="flex flex-col gap-5" action={`/workspaces/${activeWorkspace.id}`} method="post">
              <input type="hidden" name="action_type" value={"create_workspace"} />
              <div>
                <Input
                  name="workspace_name"
                  type="text"
                  placeholder="Workspace Name"
                  className="border-0 border-b text-black border-gray-200 bg-transparent px-0 py-2 focus-visible:border-[#1a4b53] focus-visible:ring-0"
                />
              </div>

              <div>
                <SecondaryButton>
                  {busy ? "Creating..." : "Create Workspace"}
                </SecondaryButton>
              </div>
            </fetcher.Form >
          </div>
        </Modal>
      }
    </div>
  );
};

const NavItem = ({ label, active = false, onClick = () => { } }: { label: string, active?: boolean, onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`px-3 py-2 rounded-lg cursor-pointer ${active ? "bg-white text-[#2D007A] font-semibold" : "hover:bg-white/10 text-amber-50"}`}
  >
    {label}
  </div>
)

function Workspace({ workspaces, activeWorkspace, onClickWorkspace, onCreateWorkspace }: { workspaces: { id: number, name: string }[], activeWorkspace: { id: number, name: string } | undefined, onCreateWorkspace: () => void, onClickWorkspace: (workspace: Workspace) => void }) {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuRef = useClickOutside(() => { setShowMenu(false) });

  const clickWorkspace = (w: Workspace) => {
    onClickWorkspace(w);
    setShowMenu(false);
  }

  return (
    <div className="relative">
      <div className="text-xs uppercase text-white/60 mb-2">Workspace</div>
      {workspaces.length ?
        <div className="flex items-center space-x-2 justify-between hover:bg-white/10 p-2 cursor-pointer" onClick={() => setShowMenu(true)}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>
            <span>{activeWorkspace?.name || ""}</span>
          </div>

          <ChevronUp className="text-amber-50 w-5 h-5" />
        </div> :
        <div>
          <SecondaryButton onClick={onCreateWorkspace}>
            Create Workspace
          </SecondaryButton>
        </div>
      }

      {showMenu && <div className="absolute bottom-0.5 right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1} >
        <div ref={menuRef as RefObject<HTMLDivElement>} className="flex flex-col gap-2 py-1 px-2" role="none">
          {
            workspaces.map((x, i) => (
              <div key={`workspace_menu_${i}`} onClick={() => clickWorkspace(x)}>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="menu-item-0">{x.name}</a>
              </div>
            ))
          }
          <div>
            <SecondaryButton onClick={onCreateWorkspace}>
              Create Workspace
            </SecondaryButton>
          </div>
        </div>
      </div>
      }
    </div>
  )
}