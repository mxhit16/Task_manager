"use client"
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'


const page = () => {
    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [mainTask, setmainTask] = useState([])
    const router = useRouter();

    if(!localStorage.getItem("todo_token")){
        router.push("/login")
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        console.log("submit");

        try {
            const response = await fetch("https://task-manager-backend-po7a.onrender.com/add", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ task: title, desc: desc }),
            });

            const result = await response.json();
            console.log("Success:", result);

            setmainTask([...mainTask, { task: title, description: desc }]);
        } catch (error) {
            console.error("Error:", error);
        }

    };

    useEffect(() => {
        fetch("https://task-manager-backend-po7a.onrender.com")
            .then(res => res.json())
            .then(data => {
                console.log(data.data);
                setmainTask(data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])



    const deleteHandler = async (t, i) => {
        try {
            const response = await fetch("https://task-manager-backend-po7a.onrender.com/delete", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: t._id }),
            });

            const result = await response.json();
            console.log("Success:", result);

            let copyTask = [...mainTask]
            copyTask.splice(i, 1)
            setmainTask(copyTask)
        } catch (error) {
            console.error("Error:", error);
        }
    };
    let renderTask = <h2>No Task Available</h2>

    if (mainTask.length > 0) {
        renderTask = mainTask.map((t, i) => {             // t- element , i - index
            return (
                <li key={i} className='flex items-center justify-between mb-8'>
                    <div className='flex items-center justify-between mb-5 w-2/3'>
                        <h5 className='font-semibold text-2xl'>{t.task}</h5>
                        <h6 className='font-medium text-xl'>{t.description}</h6>
                    </div>
                    <button
                        onClick={() => {
                            deleteHandler(t, i)
                        }}
                        className='bg-red-600 text-white px-4 py-2 m-2 border-rounded'>Delete</button>
                </li>
            );
        });
    }


    return (<>
        <h1 className='bg-black text-white p-5 text-5xl font-bold text-center'> Mohit's Task Manager</h1>
        <form onSubmit={submitHandler}>
            <input type="text" className='text-2xl border-zinc-ctrc800 border-4 m-8 px-4 py-2' placeholder="Enter Task Here"
                value={title}
                onChange={(e) => {
                    //console.log(e.target.value)
                    settitle(e.target.value)
                }}
            >
            </input>
            <input type="text" className='text-2xl border-zinc-800 border-4 m-8 px-4 py-2' placeholder="Enter Description Here"
                value={desc}
                onChange={(e) => {
                    setdesc(e.target.value)
                }}
            >
            </input>
            <button className='bg-black text-white px-3 py-2 m-5  text-l font-bold rounded'>  Add Task</button>
        </form>
        <hr></hr>
        <div className='p-8 bg-slate-200'>
            <ul>
                {renderTask}
            </ul>
        </div>
    </>)
}

export default page;