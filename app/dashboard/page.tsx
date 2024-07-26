import { SignOutButton } from "@/components/SignOutButton";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
    const user = await getUser()
    if (!user) {
        redirect('/auth')
    }
    return (
        <div>
            <div>Has iniciado seisión como {user.email}</div>
            <SignOutButton>Cerrar Sesión</SignOutButton>
        </div>
    );
}

export default DashboardPage;