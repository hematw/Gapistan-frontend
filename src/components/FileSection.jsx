import React from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Card, CardBody, CardHeader } from "@heroui/card";
import getFileURL from "../utils/getFileURL";
import { Play } from "lucide-react";

function FileSection({ data }) {
  const getShortenedFileName = (file) => {
    const fullName = file.path.split("/").pop(); // get actual filename
    const nameWithoutExt = fullName.split(".").slice(0, -1).join(".");

    // Extract a keyword (e.g., first word or trimmed)
    const keyword = nameWithoutExt
      .replace(/[^a-zA-Z0-9]/g, " ") // remove special chars
      .split(" ")
      .filter(Boolean)[0]; // pick the first valid word

    const shortFileName = `${keyword?.slice(0, 5) || "file"}...`;
    return shortFileName;
  };

  return (
    <Card className="bg-white dark:bg-dark shadow-lg mt-4">
      <CardHeader>Files</CardHeader>
      <CardBody>
        <Accordion selectionMode="multiple">
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title={(data?.media.length || 0) + " Media"}
          >
            {
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {data?.media.map((file) => (
                  <div
                    key={file._id}
                    className="w-16 border rounded-md bg-default-300 shadow aspect-square grid place-content-center"
                  >
                    {file.mediaType === "image" && (
                      <img
                        src={getFileURL(file.path)}
                        alt="media"
                        className="w-full h-auto rounded-md object-cover aspect-square"
                      />
                    )}
                    {file.mediaType === "audio" && (
                      // <audio controls className="w-full mt-2">
                      //   <source src={getFileURL(file.path)} type="audio/webm" />
                      //   Your browser does not support the audio element.
                      // </audio>
                      <span>
                        <Play/>
                      </span>
                    )}
                    {file.mediaType === "video" && (
                      // <video
                      //   controls
                      //   className="w-full h-auto rounded-md aspect-square"
                      //   style={{ maxHeight: "300px" }}
                      // >
                      //   <source src={getFileURL(file.path)} type="video/webm" />
                      //   Your browser does not support the video tag.
                      // </video>
                      <span>
                        <Play/>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            }
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 1"
            title={(data?.files.length || 0) + " Files"}
          >
            <div className="grid grid-cols-3 gap-4">
              {data?.files.map((file) => {
                const fileName = getShortenedFileName(file);
                return (
                  <a
                    target="_blank"
                    href={getFileURL(file.path)}
                    key={file._id}
                    className="  flex flex-col items-center gap-2"
                  >
                    <span className="border rounded-md text-red-400 shadow text-xl grid place-content-center h-16 w-16 bg-white font-bold">
                      PDF
                    </span>
                    <span className="text-nowrap">{fileName}</span>
                  </a>
                );
              })}
            </div>
          </AccordionItem>
          {/* <AccordionItem
            key="3"
            aria-label="Accordion 1"
            title={(data?.links.length || 0) + " Shared Links"}
          >
            {"ABC"}
          </AccordionItem> */}
        </Accordion>
      </CardBody>
    </Card>
  );
}

export default FileSection;
