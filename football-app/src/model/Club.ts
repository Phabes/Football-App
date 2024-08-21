export interface Club {
  id: number;
  name: string;
  formation: Array<number>;
  colors: {
    mainColor: string;
    secondaryColor: string;
  };
}
