"use client";
import React, { useState, useRef } from "react";
import praseResume from "../api/praseResume";
import { DotLoader } from "react-spinners";

const PDFJSViewer = () => {
  const [extractedText, setExtractedText] = useState("");
  const [structuredData, setStructuredData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  console.log("structuredData", structuredData);

  const extractTextFromPDF = async (pdf) => {
    let finalText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const strings = textContent.items.map((item) => item.str);
      finalText += strings.join(" ") + "\n\n";
    }
    setExtractedText(finalText);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }
    const pdfjsLib = await import("pdfjs-dist/build/pdf");
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.394/build/pdf.worker.mjs";

    const reader = new FileReader();
    reader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target.result);
      try {
        const loadingTask = pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;
        extractTextFromPDF(pdf);
      } catch (error) {
        console.error("Error loading PDF:", error);
        alert("Error loading PDF");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleParseResume = async () => {
    if (!extractedText) return;
    setLoader(true);
    const result = praseResume(extractedText, setStructuredData, setLoader);

    // try {
    // const res = await fetch('/api/parseResume', {
    // method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify({ resumeText: extractedText }),
    // });

    // const data = await res.json();
    // setStructuredData?([data.structuredData?]);
    // } catch (err) {
    // console.error(err);
    // }
  };

  console.log("structuredData.length", structuredData.length);

  return (
    <main className="w-[90%] mx-auto">
      <header className="h-[60px] flex items-center">
        <h1 className="text-[1.8rem] leading-[2.7rem] font-bold text-[#f1804c] flex items-center">
         <img src="/favicon.png" alt="" className="h-[2.7rem]" /> Resume{" "}
          <span className="before:w-[30px] before:h-[2px] before:rounded-[4px] before:bg-[#f1804c] before:absolute relative before:right-0 before:top-full">
            Parser
          </span>
        </h1>
      </header>
      <section
        className="min-h-[calc(100vh-60px)] bg-gradient-to-r from-[#f3f5eb] to-[#e6e8df]
        p-[32px_16px] flex flex-col items-center justify-start rounded-[20px_20px_0_0] relative overflow-hidden"
      >
        <h2 className="text-center text-[3.4rem] text-[#2b2d2f] leading-[4.6rem] tracking-[1.1px] mb-[43px] font-lexend font-bold z-10 relative">
          Upload Resume
        </h2>

        <div className="flex items-center justify-center w-full max-w-[640px] mx-auto mb-3  z-10 relative">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full min-h-64 border-[2px] border-dashed border-[#bbc2ce] rounded-[20px] cursor-pointer bg-white relative p-[32px_16px] shadow-[0_12px_28px_-2px_#0000001a]"
          >
            <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
              <div className="relative w-[80px] h-[80px] grid place-items-center">
                <div className="w-[48px] h-[48px] bg-[#2b2d2f] rounded-full  z-[1] relative grid place-items-center">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="#ffffff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                    />
                  </svg>
                </div>
                <svg
                  className="w-[80px] h-[64px] mt-[8px] fill-[#fdf1eb] block absolute top-0 left-0"
                  width="371"
                  height="309"
                  viewBox="0 0 371 309"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M96.6483 279.243C279.371 375.552 372.29 217.761 370.404 87.1883C351.617 -101.602 229.73 72.3277 74.2056 103.295C-62.8105 127.499 17.1334 237.332 96.6483 279.243Z"></path>
                </svg>
              </div>
              <p className="mb-2 text-sm">
                <span className="text-[1.8rem] leading-[2.7rem] mb-[8px] font-bold">
                  Drag and drop a resume here
                </span>
              </p>
              <p className="text-[1.4rem] leading-[2.4rem] text-[#585e65] mb-[8px]">
                You can upload PDF
              </p>
              {fileName && (
                <p className="text-[1.4rem] leading-[1.4rem] text-[#585e65] italic line-clamp-1 min-h-[1.4rem] ">
                  {fileName}
                </p>
              )}

              {extractedText ? (
                <button
                  onClick={handleParseResume}
                  className=" mt-[24px] h-[48px] w-[268px] min-h-[48px] text-white bg-[#f1804c] flex font-bold leading-[2.4rem] items-center justify-center cursor-pointer px-[25px] py-[10px] text-[1.6rem] rounded transition-all duration-300 hover:bg-[#fb6c2a] relative z-10 items-center gap-[16px]"
                >
                  {loader && (
                    <DotLoader
                      color="#ffffff"
                      loading={true}
                      size={20}
                      speedMultiplier={1}
                    />
                  )}{" "}
                  Parse Resume
                </button>
              ) : (
                <label
                  htmlFor="dropzone-file"
                  className="mt-[24px] h-[48px] w-[268px] min-h-[48px] text-white bg-[#f1804c] flex font-bold leading-[2.4rem] items-center justify-center cursor-pointer px-[25px] py-[10px] text-[1.6rem] rounded transition-all duration-300 hover:bg-[#fb6c2a] relative z-10"
                >
                  Browse
                </label>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer text-[0px]"
            />
          </label>
        </div>

        <div className="w-full overflow-auto mt-3 z-10 relative">
          {structuredData.length !== 0 && (
            <table className="table-auto border-collapse border border-gray-300 w-full bg-white min-w-[768px]">
              <thead>
                <tr>
                  <th className="text-xl leading-[2.7rem] border border-[#bbc2ce] p-[8px] font-bold text-start">
                    Name
                  </th>
                  <th className="text-xl leading-[2.7rem] border border-[#bbc2ce] p-[8px] font-bold text-start">
                    Phone
                  </th>
                  <th className="text-xl leading-[2.7rem] border border-[#bbc2ce] p-[8px] font-bold text-start">
                    Email
                  </th>
                  <th className="text-xl leading-[2.7rem] border border-[#bbc2ce] p-[8px] font-bold text-start">
                    Skills
                  </th>
                  <th className="text-xl leading-[2.7rem] border border-[#bbc2ce] p-[8px] font-bold text-start">
                    Education
                  </th>
                  <th className="text-xl leading-[2.7rem] border border-[#bbc2ce] p-[8px] font-bold text-start">
                    Product Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border border-gray-300">
                  <td className="border border-[#bbc2ce] p-[8px] text-start text-xl align-top whitespace-nowrap">
                    {structuredData?.Name}
                  </td>
                  <td className="border border-[#bbc2ce] p-[8px] text-start text-xl align-top">
                    {structuredData?.Phone || ""}
                  </td>
                  <td className="border border-[#bbc2ce] p-[8px] text-start text-xl align-top">
                    {structuredData?.Email || ""}
                  </td>
                  <td
                    className="border border-[#bbc2ce] p-[8px] text-start text-xl align-top w-[20%]"
                  >
                    {structuredData?.Skills?.join(", ") || ""}
                  </td>
                  <td className="border border-[#bbc2ce] p-[8px] text-start text-xl align-top w-[20%]" >
                    <ul>
                      <li className="flex items-center gap-[4px] no-wrap items-start mb-[8px] last-of-type:mb-0">
                        <h3 className="whitespace-nowrap min-w-[80px] font-semibold">Degree:</h3>
                        <p>{structuredData?.Education[0]?.Degree || ""}</p>
                      </li>
                      <li className="flex items-center gap-[4px] no-wrap items-start mb-[8px] last-of-type:mb-0">
                        <h3 className="whitespace-nowrap min-w-[80px] font-semibold">Institution:</h3>
                        <p>{structuredData?.Education[0]?.Institution || ""}</p>
                      </li>
                      <li className="flex items-center gap-[4px] no-wrap items-start mb-[8px] last-of-type:mb-0">
                        <h3 className="whitespace-nowrap min-w-[80px] font-semibold">Dates:</h3>
                        <p>{structuredData?.Education[0]?.Dates || ""}</p>
                      </li>
                    </ul>
                  </td>

                  <td className="border border-[#bbc2ce] text-start text-xl align-top">
                    {structuredData?.Projects?.map((val, index) => (
                      <ul key={index} className="border-b border-[#bbc2ce] last-of-type:border-b-0 p-[8px]">
                        <li className="flex items-center gap-[4px] no-wrap items-start mb-[8px] last-of-type:mb-0">
                          <h3 className="whitespace-nowrap min-w-[80px] font-semibold">Degree : </h3>
                          <p>{val?.Title || ""}</p>
                        </li>
                        <li className="flex items-center gap-[4px] no-wrap items-start mb-[8px] last-of-type:mb-0">
                          <h3 className="whitespace-nowrap min-w-[80px] font-semibold">Institution : </h3>
                          <p>{val?.Summary || ""}</p>
                        </li>
                        <li className="flex items-center gap-[4px] no-wrap items-start mb-[8px] last-of-type:mb-0">
                          <h3 className="whitespace-nowrap min-w-[80px] font-semibold">Dates : </h3>
                          <p>{val?.TechStack.join(", ") || ""}</p>
                        </li>
                      </ul>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
};

export default PDFJSViewer;
