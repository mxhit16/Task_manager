"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Link } from "react-router-dom";


const page = () => {
    const [userId, setUserId] = useState("");
    const [pass, setPass] = useState("");
    const router = useRouter();

    return (
        <div className="flex flex-col w-[50%] items-center justify-items-center m-auto mt-[100px]">
            <input
                placeholder="userId"
                value={userId}
                type="text"
                className="p-2 border-2"
                onChange={(e) => {
                    setUserId(e.target.value);
                }}
            />

            <input
                placeholder="Password"
                value={pass}
                type="text"
                onChange={(e) => {
                    setPass(e.target.value);
                }}
                className="p-2 border-2 my-4"
            />

            <button
                className="p-2 w-[150px] border-2"
                onClick={async () => {
                    if(pass === "" || userId === ""){
                        console.log("both field required");
                        return;
                    }
                    
                    const res = await fetch("https://task-manager-backend-po7a.onrender.com/signup", {
                        method: "POST", // or 'PUT'
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({userId: userId, pass: pass}),
                    });

                    if(res.status){
                        router.push("/login");
                    }
                }}
            >
                signup
            </button>
        </div>
    );
}

export default page;