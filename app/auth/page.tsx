import { SignInForm } from "@/components/auth/SignInForm"
import { SignUpForm } from "@/components/auth/SignUpForm"
import { TabSwitcher } from "@/components/TabSwitcher"
import { getUser } from "@/lib/lucia"
import { redirect } from "next/navigation"

const AuthPage = async () => {
    const user = await getUser()
    if (user) {
        redirect('/dashboard')
    }
    return (
        <div className="relative flex w-full h-screen bg-background justify-center items-center">
            <div className="max-w-3xl">
                <TabSwitcher SignInTab={<SignInForm />} SignUpTab={<SignUpForm />} />
            </div>
        </div>
    )
}

export default AuthPage