import React from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Card, CardBody, CardHeader } from "@heroui/card";


function FileSection({ files }) {
  return (
    <Card className="bg-white dark:bg-dark shadow-lg mt-4">
      <CardHeader>Files</CardHeader>
      <CardBody>
        <Accordion selectionMode="multiple">
          {files.map((file) => {
            switch (file.type) {
              case "photos":
                return (
                  <AccordionItem
                    // key="1"
                    aria-label="Accordion 1"
                    title={file.count + " Photos"}
                  >
                    {"ABC"}
                  </AccordionItem>
                );
              case "files":
                return (
                  <AccordionItem
                    // key="1"
                    aria-label="Accordion 1"
                    title={file.count + " Files"}
                  >
                    {"ABC"}
                  </AccordionItem>
                );
              case "shared links":
                return (
                  <AccordionItem
                    // key="1"
                    aria-label="Accordion 1"
                    title={file.count + " Shared Links"}
                  >
                    {"ABC"}
                  </AccordionItem>
                );
            }
          })}
        </Accordion>
      </CardBody>
    </Card>
  );
}

export default FileSection;
