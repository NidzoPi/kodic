import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";


async function main() {

  const users = await prisma.user.findMany({
    where:{
      referralCode:null
    }
  });


  for(const user of users){

    await prisma.user.update({
      where:{
        id:user.id
      },
      data:{
        referralCode: randomUUID()
      }
    });

  }


  console.log("Referral codes generated");

}


main()
.then(()=>{
  process.exit();
})
.catch((e)=>{
  console.error(e);
  process.exit(1);
});