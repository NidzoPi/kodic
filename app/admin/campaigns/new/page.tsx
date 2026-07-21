"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function NewCampaignPage(){

const router = useRouter();


const [name,setName] = useState("");
const [description,setDescription] = useState("");
const [discount,setDiscount] = useState("");
const [totalCoupons,setTotalCoupons] = useState("");


async function submit(e:React.FormEvent){

e.preventDefault();


await fetch("/api/admin/campaigns",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name,
description,
discount,
totalCoupons

})

});


router.push("/admin/campaigns");

}



return (

<form
onSubmit={submit}
className="bg-white p-6 rounded shadow max-w-xl"
>


<h2 className="text-2xl font-bold mb-5">
Nova kampanja
</h2>


<input
className="border p-2 w-full mb-3"
placeholder="Naziv"
value={name}
onChange={e=>setName(e.target.value)}
/>


<textarea
className="border p-2 w-full mb-3"
placeholder="Opis"
value={description}
onChange={e=>setDescription(e.target.value)}
/>


<input
className="border p-2 w-full mb-3"
placeholder="Popust %"
type="number"
value={discount}
onChange={e=>setDiscount(e.target.value)}
/>


<input
className="border p-2 w-full mb-3"
placeholder="Broj kodova"
type="number"
value={totalCoupons}
onChange={e=>setTotalCoupons(e.target.value)}
/>


<button
className="bg-black text-white px-5 py-2 rounded"
>
Kreiraj kampanju
</button>


</form>

);

}