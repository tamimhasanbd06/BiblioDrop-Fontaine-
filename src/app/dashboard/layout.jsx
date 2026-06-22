import Sidebar from "./sidebar";
import { useSession } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex">
      <Sidebar role={session.user.role} />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}