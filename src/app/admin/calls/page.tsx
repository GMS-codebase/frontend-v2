import { BiSearch } from "react-icons/bi";

const Page = ()=>{
    return(
        <div className="w-full flex flex-col bg-white">
            <div>
                <div className="relative">
                    <span className="absolute ">
                        <BiSearch size={25}/>
                    </span>
                    <input name="search" className="p-3 text-base text-black rounded-full bg-[#005DE908]" placeholder="Search"/>
                </div>
            </div>
        </div>
    )
}
export default Page;