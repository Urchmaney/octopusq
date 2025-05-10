import { logout } from "../../services";

export function Dashboard() {
  
  return (
    <div className="text-2xl text-black">Dashboard<button className="bg-red-600 p-2 cursor-pointer" onClick={() => logout()}>Logout</button></div>
  );
}