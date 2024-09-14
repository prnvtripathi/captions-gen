
import Link from 'next/link';
import { WandSparkles, LogOut } from 'lucide-react';
import SignIn from './SignInButton';
import { auth } from '@/auth';
import { Button } from './ui/button';
import { FcGoogle } from 'react-icons/fc';
import { SignOut } from './SignOutButton';


export default async function Navbar() {
    const session = await auth();
    // console.log(session);
    return (
        <header className="flex justify-between mb-4 max-w-6xl mx-auto">
            <Link href="/" className="flex items-center gap-1">
                <WandSparkles size={20} color="#fff" strokeWidth={1.25} />
                Captions Generator
            </Link>
            <nav className="flex gap-4 items-center text-white/50">
                <Link href="/">Home</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/contact">Contact</Link>
                {session
                    ?
                    <div className="flex items-center">
                        <SignOut>
                            <>
                                {session?.user?.name.split(" ").slice()[0]}
                                <LogOut size={20} strokeWidth={1.25} />
                            </>
                        </SignOut>
                    </div>
                    :
                    <SignIn provider={"google"}>
                        <><FcGoogle size={20} />Signin using Google</>
                    </SignIn>
                }

            </nav>
        </header>
    )
}