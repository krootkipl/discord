export interface AtlasElement {
  position: {
    g: number;
    s: number;
    pos: number;
  },
  player: string;
  status: string;
  planet: string;
  alliance: string;
  rank: string;
  moon: string;
  links: {
    planetLink: string;
    spyLink: string;
    playerLink: string;
  }
}