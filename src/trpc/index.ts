import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";


/**
 * query is mainly for GET Request
 */
export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const {getUser} = getKindeServerSession()
        const user = await getUser()
        // const user = await getUser()

        // if(!user.id || !user.email) 
        //     throw new TRPCError({ code: "UNAUTHORISED" })
        if(!user || !user.id || !user.email) 
            throw new TRPCError({ code: "UNAUTHORIZED" });


        //check if the user is in the database
        const dbUser = await db.user.findFirst({
            where: {
                id: user.id,
            },
        })

        if(!dbUser) {
            //create user in db
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.email
                }
            })
        }
        return {success: true}
    }),
});


// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;