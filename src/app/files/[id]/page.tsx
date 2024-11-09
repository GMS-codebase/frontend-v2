// import React, { useEffect, useState } from "react";
// import mammoth from "mammoth";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import { useParams } from "next/navigation";

// const Page = () => {
//   const { id } = useParams<{ id: string }>();
//   const [htmlContent, setHtmlContent] = useState("");
//   const [fileType, setFileType] = useState("");

//   useEffect(() => {
//     const extension = file.name.split(".").pop().toLowerCase();
//     setFileType(extension);

//     if (extension === "docx") {
//       renderDocx(file);
//     } else if (extension === "doc") {
//       alert(
//         "Currently, .doc files need to be converted to .pdf or .docx for rendering."
//       );
//     }
//   }, [file]);

//   const renderDocx = async (file) => {
//     const arrayBuffer = await file.arrayBuffer();
//     const { value } = await mammoth.convertToHtml({ arrayBuffer });
//     setHtmlContent(value);
//   };

//   return (
//     <div>
//       {fileType === "pdf" && (
//         <Worker
//           workerUrl={`https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js`}
//         >
//           <Viewer fileUrl={URL.createObjectURL(file)} />
//         </Worker>
//       )}
//       {fileType === "docx" && (
//         <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
//       )}
//       {fileType === "doc" && (
//         <p>
//           Unsupported file type: Please convert .doc files to .pdf or .docx.
//         </p>
//       )}
//     </div>
//   );
// };

// export default Page;
