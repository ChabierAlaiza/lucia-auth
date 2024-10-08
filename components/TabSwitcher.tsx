'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


type Props = {
    SignUpTab: React.ReactNode,
    SignInTab: React.ReactNode
}

export const TabSwitcher = (props: Props) => {
    return (
        <Tabs className="max-w-[500px]" defaultValue="sign-in">
            <TabsList>
                <TabsTrigger value="sign-in">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="sign-up">Registrarse</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">{props.SignInTab}</TabsContent>
            <TabsContent value="sign-up">{props.SignUpTab}</TabsContent>
        </Tabs>
    )
}