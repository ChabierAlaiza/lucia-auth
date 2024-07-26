'use client'

import { signOut } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

type Props = {
    children: React.ReactNode;
}

export const SignOutButton = ({ children }: Props) => {
    return (
        <Button onClick={() => signOut()}>
            {children}
        </Button>
    )
}