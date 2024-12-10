import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { ContentType } from "../_helpers.ts";
import { ClanAnalysisDTO } from "../application-handlers/download/download.handler.ts";
import { clanTag } from "../signals/clanTag.ts";

interface DownloadButton {
  // clanTag: string;
  apiKey: string;
}

export default function DownloadButton(props: DownloadButton) {
  const tableData = useSignal<string[][] | null>(null);

  const handleShowData = async () => {
    try {
      console.log(`Showing Data... for clanTag ${clanTag.value}`);
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": ContentType.JSON,
        },
        body: JSON.stringify({
          key: props.apiKey,
          tag: clanTag.value,
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to fetch data");
      }

      const data = await response.json() as ClanAnalysisDTO;
      console.log("Full Response Data:", data);
      console.log("Members:", data.members);
      console.log("Last Wars:", data.lastWars.length);

      const totalData: string[][] = [[
        "Member",
        ...data.lastWars.map((_, i) => `War ${i + 1}`),
      ]];
      console.log("Header", totalData);

      for (const member of data.members) {
        const memberTotalActivity = [];
        for (const warData of data.lastWars) {
          const memberActivity = warData.warParticipation[member] ?? "N/A";
          memberTotalActivity.push(memberActivity);
        }
        totalData.push([member, ...memberTotalActivity]);
      }

      console.log(
        "Rows:",
        totalData.length,
        "Columns:",
        totalData[0]?.length,
      );
      console.log("Table Data Shape:", totalData.length, totalData[0]?.length);
      console.log("Table Data Content:", totalData);
      tableData.value = totalData;
      console.log("Final tableData.value:", tableData.value);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDownload = async () => {
    try {
      console.log(`Downloading file...`);
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": ContentType.EXCEL,
        },
        body: JSON.stringify({
          key: props.apiKey,
          tag: clanTag.value,
        }),
      });

      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "clan.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleRefreshWar = async () => {
    try {
      console.log(`Refreshing current war data...`);
      const response = await fetch("/api/refresh-war", {
        method: "POST",
        headers: {
          "Content-Type": ContentType.JSON,
        },
        body: JSON.stringify({
          key: props.apiKey,
          tag: clanTag.value,
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to refresh war data");
      }

      const data = await response.json();
      console.log("Current War Refreshed Data:", data);

      // Optional: Update table data if the war data needs to be displayed in the table
      // tableData.value = data; // Uncomment this if the response contains table data
    } catch (error) {
      console.error("Error refreshing current war data:", error);
    }
  };

  return (
    <div class="flex flex-col items-center justify-center gap-16">
      {/* Buttons for Show Data and Download File */}
      <div class="flex flex-row items-center justify-center gap-4">
        <Button
          onClick={handleShowData}
          class="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        >
          Show Data
        </Button>
        <Button
          onClick={handleDownload}
          class="mt-6 px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
        >
          Download File
        </Button>
      </div>

      {/* Refresh Current War Macro Button */}
      <div class="mt-10">
        <Button
          onClick={handleRefreshWar}
          class="px-6 py-3 bg-orange-500 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg"
        >
          Refresh Current War
        </Button>
      </div>

      {tableData.value && tableData.value.length > 0
        ? (
          <table class="table-auto mt-8 border-collapse">
            <thead>
              <tr>
                {tableData.value[0].map((header, index) => (
                  <th key={`header-${index}`} class="border px-4 py-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.value.slice(1).map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  class="even:bg-gray-50 odd:bg-white hover:bg-gray-100"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      class="border px-4 py-2 text-center"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )
        : <p class="mt-4 text-gray-500">No data available to display.</p>}
    </div>
  );
}
