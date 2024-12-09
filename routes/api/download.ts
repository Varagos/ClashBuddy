import { HandlerContext } from '$fresh/server.ts';
// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs';

/**
 * Function to fetch clan members from the Clash of Clans API
 * @param {string} apiKey - The API key for the Clash of Clans API
 * @param {string} clanTag - The tag of the clan to fetch members from
 * @returns {Promise<string[]>} List of member names
 */
async function getClanMembers(apiKey: string, clanTag: string): Promise<string[]> {
  const API_URL = 'https://api.clashofclans.com/v1';
  const encodedClanTag = encodeURIComponent(clanTag);

  const response = await fetch(`${API_URL}/clans/${encodedClanTag}/members`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorMsg = `Failed to fetch clan members: ${response.statusText}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return data.items.map((member: any) => member.name);
}

/**
 * Function to create an Excel file from a list of clan members
 * @param {string[]} memberNames - List of clan member names
 * @returns {Uint8Array} The Excel file contents as a binary blob
 */
function createExcelFile(memberNames: string[]): Uint8Array {
  const worksheetData = memberNames.map((name) => [name]);
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clan Members');

  // Write the workbook to binary (array) format
  const fileContent = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(fileContent);
}

export const handler = async (req: Request, _ctx: HandlerContext) => {
  try {
    // Extract API key and clan tag from request (support both GET query and POST body)
    let apiKey = '';
    let clanTag = '';

    console.log(`Request method: ${req.method}`);

    if (req.method === 'GET') {
      const url = new URL(req.url);
      apiKey = url.searchParams.get('key') || '';
      clanTag = url.searchParams.get('tag') || '';
    } else if (req.method === 'POST') {
      const body = await req.json();
      apiKey = body.key || '';
      clanTag = body.tag || '';
    }

    // Validate required fields
    if (!apiKey || !clanTag) {
      return new Response('Missing API key or Clan tag', { status: 400 });
    }

    console.log('Fetching clan members...');
    const members = await getClanMembers(apiKey, clanTag);
    console.log(`Fetched ${members.length} members.`);

    const blob = createExcelFile(members);
    console.log('Excel file has been created successfully.');

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="clan_members.xlsx"',
      },
    });
  } catch (error: any) {
    console.error('Server-side error:', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
};
