
import { signIn } from "@/auth"
import { Button } from "./ui/button"

export default function SignIn({ children, provider }) {
    return (
        <form
            action={async () => {
                "use server"
                await signIn(provider)
            }}
        >
            <Button type="submit" className="flex gap-1 items-center">
                {children}
            </Button>
        </form>
    )
} 