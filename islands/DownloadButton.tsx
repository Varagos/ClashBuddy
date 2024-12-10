import { Button } from "../components/Button.tsx";

interface DownloadButton {
  clanTag: string;
  apiKey: string;
}

export default function DownloadButton(props: DownloadButton) {
  // Function to trigger the download
  const handleDownload = async () => {
    try {
      console.log(`Downloading file...`);
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: props.apiKey,
          tag: props.clanTag,
        }),
      });
      if (!response.ok) throw new Error("Failed to download file");

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a link element and click it to download the file
      const link = document.createElement("a");
      link.href = url;
      link.download = "clan.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the object URL after download
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  return (
    <Button
      onClick={() => {
        console.log("Downloading file...");
        handleDownload();
      }}
      class="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
    >
      Download File
    </Button>
  );
}
