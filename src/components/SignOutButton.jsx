import { signOut } from "@/auth"
import { Button } from "./ui/button"

export function SignOut({ children }) {
    return (
        <form
            action={async () => {
                "use server"
                await signOut()
            }}
        >
            <Button type="submit" className="flex gap-1 items-center">
                {children}
            </Button>
        </form>
    )
}