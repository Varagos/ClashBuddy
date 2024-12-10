import type { ClanWarLogEntry } from "./types.ts";

export class ClashClient {
  constructor(private readonly apiKey: string) {}

  private baseUrl = "https://api.clashofclans.com/v1";

  /**
   * Function to fetch clan members from the Clash of Clans API
   * @param {string} apiKey - The API key for the Clash of Clans API
   * @param {string} clanTag - The tag of the clan to fetch members from
   * @returns {Promise<string[]>} List of member names
   */
  public async getClanMembers(
    clanTag: string,
  ): Promise<string[]> {
    const encodedClanTag = encodeURIComponent(clanTag);

    const data = await this.fetchRequest(
      `${this.baseUrl}/clans/${encodedClanTag}/members`,
      "GET",
    );
    return data.items.map((member: any) => member.name);
  }

  public async fetchClanWarLogLast(
    lastNWars: number,
    clanTag: string,
  ): Promise<ClanWarLogEntry[]> {
    // const url = `${this.baseUrl}/clans/${encodeURIComponent("#2G99PVOLG")}/warlog`;
    const url = new URL(
      `${this.baseUrl}/clans/${encodeURIComponent(clanTag)}/warlog`,
    );

    url.searchParams.append("limit", "1"); //lastNWars.toString());

    // Add limit parameter

    const data = await this.fetchRequest(
      url.toString(),
      "GET",
    );
    // Get last n wars
    return data.items.slice(-lastNWars);
  }

  public getCurrentWar(clanTag: string): Promise<ClanWarLogEntry> {
    return this.fetchRequest(
      `${this.baseUrl}/clans/${encodeURIComponent(clanTag)}/currentwar`,
      "GET",
    );
  }

  private fetchRequest = async (url: string, method: string, body?: any) => {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorMsg = `Failed to fetch data: ${response.statusText}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    return response.json();
  };
}
