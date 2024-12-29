import { GoAlertFill } from "react-icons/go";

interface AnnouncementProps{
    announcement: any
    setShowAnnouncement: (value: boolean) => void
}
const Announcement = ({
    announcement,
    setShowAnnouncement
}: AnnouncementProps)=>{
    return(
        <div className="w-full bg-red-400 p-3 mb-2 relative rounded-sm font-bold">
        <div
          className={`text-white pr-8 text-lg ${announcement?.announcement?.length > 100 ? "animate-scroll" : ""}`}
        >
          <span className="relative pl-7"> <GoAlertFill className="absolute" size={23}/> Announcement: </span>{" "}
          {announcement?.announcement}
        </div>
        <button
          onClick={() => setShowAnnouncement(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-800 hover:text-blue-600"
          aria-label="Close announcement"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="white"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    )
}

export default Announcement;