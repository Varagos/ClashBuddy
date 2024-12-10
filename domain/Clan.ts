import { ClanWarLogEntry } from "../services/clash-client/types.ts";

type ClanMemberWarActivity = "out" | "zero" | "one" | "two" | "unknown";

export class ClanWar {
  constructor(
    public warDescription: string,
    public playerParticipation: Record<string, ClanMemberWarActivity> = {},
  ) {}
}

export class Clan {
  private lastWars: ClanWar[] = [];

  constructor(private members: string[]) {}

  public syncLastWars(clanWarLogEntries: ClanWarLogEntry[]) {
    this.lastWars = [];

    for (const clanWarLogEntry of clanWarLogEntries) {
      const activityMapping: Record<number, ClanMemberWarActivity> = {
        0: "zero",
        1: "one",
        2: "two",
      };

      // Use a single loop to process member participation
      const currentMembersWarLog: Record<string, ClanMemberWarActivity> = {};

      if (!clanWarLogEntry.clan.members) {
        console.log(
          `No members found for war with ${clanWarLogEntry.opponent.name}`,
        );
        continue;
      }

      for (const member of clanWarLogEntry.clan.members) {
        const participation = activityMapping[member.attacks.length] ||
          "unknown";
        currentMembersWarLog[member.tag] = participation;
      }

      // Make sure to track only the current members of the clan (not past members)
      for (const memberTag of this.members) {
        if (!currentMembersWarLog[memberTag]) {
          currentMembersWarLog[memberTag] = "out";
        }
      }

      // Create a ClanWar object for this specific war
      this.lastWars.push(
        new ClanWar(
          `${clanWarLogEntry.clan.name} vs ${clanWarLogEntry.opponent.name} - ${clanWarLogEntry.endTime}`,
          currentMembersWarLog,
        ),
      );
    }
  }

  public getLastWars(): ClanWar[] {
    return this.lastWars;
  }

  /**
   * First col is the member name, the rest are the war activities
   */
  public getMemberWarActivity(): string[][] {
    const memberWarActivity: string[][] = [[
      "Members",
      ...this.lastWars.map((war) => war.warDescription),
    ]];

    for (const member of this.members) {
      const memberActivity = [member];
      for (const war of this.lastWars) {
        memberActivity.push(war.playerParticipation[member]);
      }
      memberWarActivity.push(memberActivity);
    }

    return memberWarActivity;
  }
}
