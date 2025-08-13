import React from "react";
import { PulsatingButton } from "./magicui/pulsating-button";

const DownloadButton = () => {
  const handleDownload = () => {
    const fileUrl = "/vite.svg"; // path in public folder or full URL
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "downloaded-file.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PulsatingButton onClick={handleDownload}>
      <p className=" text-white " >Download File</p>
    </PulsatingButton>
  );
};

export default DownloadButton;
