import { ClashClient } from "../../services/clash-client/ClashClient.ts";
import { Clan, ClanMemberWarActivity } from "../../domain/Clan.ts";

export class DownloadCommand {
  constructor(
    public readonly apiKey: string,
    public readonly clanTag: string,
  ) {}
}

export class ClanAnalysisDTO {
  constructor(
    public members: string[],
    public lastWars: {
      description: string;
      warParticipation: Record<string, ClanMemberWarActivity>;
    }[],
  ) {}
}

class DownloadHandler {
  public async handle(command: DownloadCommand) {
    const { apiKey, clanTag } = command;
    // Extract API key and clan tag from request (support both GET query and POST body)
    const clashClient = new ClashClient(apiKey);

    console.log("Fetching clan members...");
    const members = await clashClient.getClanMembers(clanTag);
    console.log(`Fetched ${members.length} members.`);

    const warLogResponse = await clashClient.fetchClanWarLogLast(5, clanTag);

    const clan = new Clan(members);
    clan.syncLastWars(warLogResponse);
    const lastWars = clan.getLastWars();
    const memberWarActivity = clan.getMemberWarActivity();

    const currentWar = await clashClient.getCurrentWar(clanTag);
    console.log(currentWar);
    console.log(`Fetched last wars: ${warLogResponse.length}`);
    return new ClanAnalysisDTO(
      members,
      lastWars.map((war) => ({
        description: war.warDescription,
        warParticipation: war.playerParticipation,
      })),
    );
  }
}

export const downloadHandler = new DownloadHandler();
