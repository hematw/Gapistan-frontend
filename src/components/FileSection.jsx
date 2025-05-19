import React from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Card, CardBody, CardHeader } from "@heroui/card";
import getFileURL from "../utils/setFileURL";

function FileSection({ data }) {
  return (
    <Card className="bg-white dark:bg-dark shadow-lg mt-4">
      <CardHeader>Files</CardHeader>
      <CardBody>
        <Accordion selectionMode="multiple">
          <AccordionItem
            // key="1"
            aria-label="Accordion 1"
            title={data?.media.length + " Media"}
          >
            {
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {data?.media.map((file) => (
                  <div
                    key={file._id}
                    className="w-16 border rounded-md bg-default-300 shadow aspect-square"
                  >
                    {file.mediaType === "image" && (
                      <img
                        src={getFileURL(file.path)}
                        alt="media"
                        className="w-full h-auto rounded-md object-cover aspect-square"
                      />
                    )}
                    {file.mediaType === "audio" && (
                      <audio controls className="w-full mt-2">
                        <source src={getFileURL(file.path)} type="audio/webm" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    {file.mediaType === "video" && (
                      <video
                        controls
                        className="w-full h-auto rounded-md aspect-square"
                        style={{ maxHeight: "300px" }}
                      >
                        <source src={getFileURL(file.path)} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ))}
              </div>
            }
          </AccordionItem>
          <AccordionItem
            // key="1"
            aria-label="Accordion 1"
            title={data?.files.length + " Files"}
          >
            <div className="grid grid-cols-3 gap-4">
              {data?.files.map((file) => {
                // const fileName =
                //   file.path.split("/")[file.path.split("/").length - 1];
                return (
                  <a
                    target="_blank"
                    href={getFileURL(file.path)}
                    key={file._id}
                    className="  border rounded-md  shadow flex items-center gap-2"
                  >
                    <span className="text-red-400 text-xl grid place-content-center h-16 w-16 bg-white font-bold">PDF</span>
                    {/* <span className="text-nowrap">{fileName}</span> */}
                  </a>
                );
              })}
            </div>
          </AccordionItem>
          );
          <AccordionItem
            // key="1"
            aria-label="Accordion 1"
            title={data?.links.length + " Shared Links"}
          >
            {"ABC"}
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  );
}

export default FileSection;
