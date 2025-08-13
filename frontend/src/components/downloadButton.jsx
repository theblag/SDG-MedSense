import React from "react";
import { PulsatingButton } from "./magicui/pulsating-button";
import { ShinyButton } from "./magicui/shiny-button";
import { Button } from "./ui/stateful-button";

const DownloadButton = () => {
  const handleDownload = () => {
    const fileUrl = "/extension.zip"; // path in public folder or full URL
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "downloaded-file.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  };

  return (
    <Button onClick={handleDownload}>Download</Button>

  );
};

export default DownloadButton;
