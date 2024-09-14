import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/db"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(client),
    providers: [Google],
    callbacks: {
        async session(session, user) {
            return session
        },
        async jwt(token, user) {
            return token
        }
    }
})