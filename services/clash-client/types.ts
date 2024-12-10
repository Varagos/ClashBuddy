export interface ClanWarAttack {
  order: number;
  attackerTag: string;
  defenderTag: string;
  starts: number;
  destructionPercentage: number;
  duration: number;
}

export interface ClanWarMember {
  tag: string;
  name: string;
  mapPosition: number;
  townhallLevel: number;
  opponentAttacks: number;
  bestOpponentAttack: ClanWarAttack;
  attacks: ClanWarAttack[];
}

export interface WarClan {
  tag: string;
  name: string;
  badgeUrls: {
    small: string;
    large: string;
    medium: string;
  };
  clanLevel: number;
  attacks: number;
  stars: number;
  destructionPercentage: number;
  expEarned: number;
  members?: ClanWarMember[];
}
export interface ClanWarLogEntry {
  result: "win" | "lose" | "tie";
  endTime: string;
  clan: WarClan;
  teamSize: number;
  attacksPerMember: number;
  battleModifier: "none" | "hard_mode";
  opponent: WarClan;
}
