"use client"
import React from "react";
import Image from "next/image";
import  img  from "../assets/Images/404.svg";

const NotFound = ()=> {
    return (
        <>
            <div className="w-full h-full flex flex-col  align-middle rounded-3xl bg-white p-8 relative">
                <div>
                    <div className="flex flex-col text-center  w-full h-full font-bold mb-4 justify-center items-center ">
                        <Image src={img} alt="hello" className="w-[70%]" />
                    </div>
                    <div className="flex flex-col justify-center items-center text-center gap-2">
                        <h3 className="font-bold w-[90%] text-3xl">
                            Something went wrong
                        </h3>
                        <div className="font-medium w-[70%] text-2xl">
                            <p>
                                Sorry , We can’t find this page you’re looking
                                for.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="text-white bg-primary  py-4 font-semibold  rounded-full text-center cursor-pointer w-fit flex items-center justify-center  m-auto px-24 mt-8 text-xl"
                   
                >
                    Got to back
                </div>
            </div>
        </>
    );
};

export default NotFound;
