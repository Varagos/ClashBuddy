import { FreshContext, RouteConfig } from "$fresh/server.ts";
// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";
import { ClashClient } from "../../services/clash-client/ClashClient.ts";
import { Clan } from "../../domain/Clan.ts";
import { downloadHandler } from "../../application-handlers/download/download.handler.ts";
import { ContentType } from "../../_helpers.ts";

/**
 * Function to create an Excel file from a list of clan members
 * @param {string[]} memberNames - List of clan member names
 * @returns {Uint8Array} The Excel file contents as a binary blob
 */
function createExcelFile(worksheetData: string[][]): Uint8Array {
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clan Members");

  // Write the workbook to binary (array) format
  const fileContent = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Uint8Array(fileContent);
}

class DownloadController {
  public async handler(req: Request, _ctx: FreshContext) {
    try {
      // Extract API key and clan tag from request (support both GET query and POST body)
      let apiKey = "";
      let clanTag = "";

      console.log(`Request method: ${req.method}`);

      const responseContentType = req.headers.get("Content-Type");
      if (req.method === "GET") {
        const url = new URL(req.url);
        apiKey = url.searchParams.get("key") || "";
        clanTag = url.searchParams.get("tag") || "";
      } else if (req.method === "POST") {
        const body = await req.json();
        apiKey = body.key || "";
        clanTag = body.tag || "";
      }

      // Validate required fields
      if (!apiKey || !clanTag) {
        return new Response("Missing API key or Clan tag", { status: 400 });
      }
      console.log("before downloadHandler.handle");
      const result = await downloadHandler.handle({ apiKey, clanTag });

      if (responseContentType === ContentType.JSON) {
        console.log("Returning JSON response");
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": ContentType.JSON },
        });
      }

      if (
        responseContentType ===
          ContentType.EXCEL
        // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        console.log("Creating Excel file...");
        const worksheetData = result.members.map((name) => [name]);
        const blob = createExcelFile(worksheetData);
        console.log("Excel file has been created successfully.");
        return new Response(blob, {
          status: 200,
          headers: {
            "Content-Type": ContentType.EXCEL,
            "Content-Disposition": 'attachment; filename="clan_members.xlsx"',
          },
        });
      }

      console.log("Invalid content type");
      return new Response("Invalid content type", { status: 400 });
    } catch (error: any) {
      console.error("Server-side error:", error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
}

export const handler = new DownloadController().handler;
