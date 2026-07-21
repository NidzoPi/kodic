import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";


async function main() {

    const email = "admin@kodic.net";
    const password = "123!";


    const existing =
        await prisma.user.findUnique({
            where:{
                email
            }
        });


    if (existing) {

        console.log("Admin već postoji");
        return;

    }


    const hashedPassword =
        await bcrypt.hash(password, 10);



    const admin =
        await prisma.user.create({

            data: {

                email,

                password: hashedPassword,

                name: "Kodic Admin",

                role: Role.ADMIN

            }

        });


    console.log(
        "Admin kreiran:",
        admin.email
    );

}


main()
.then(async()=>{

    await prisma.$disconnect();

})
.catch(async(error)=>{

    console.error(error);

    await prisma.$disconnect();

    process.exit(1);

});