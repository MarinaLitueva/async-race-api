/* GET */
export interface ICar {
  name: string;
  color: string;
  id: string
}
/* PUT */
export interface IUpdateDataParams {
  name?: string;
  color?: string;
  wins?: number,
  time?: number
}
/* POST */
export interface ICreateDataParams {
  name?: string;
  color?: string;
  id?: string;
  wins?: number,
  time?: number
}

/* OPTIONS */
export interface RequestInit {
  method: string,
  mode?: string,
  headers?: object,
  body?: string
}

export interface IGetCars {
  data: ICar[];
  count: string;
}

export interface IGetWinners {
  data: IWinner[];
  count: string;
}

export interface IResponsive {
  body: ReadableStream<Uint8Array> | null;
  bodyUsed: boolean;
  headers: object;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  cors?: string;
  url: string;
  json(): Promise<[]>;
}

export interface IStore {
  btnSelects: NodeList;
}

export interface IPositionAtCenterEl {
  x: number;
  y:number
}

export interface IEngine {
  velocity: number;
  distance: number;
}

export interface IDriveStatus {
  success: boolean;
  errors?: boolean;
}

export interface IRace {
  success: boolean;
  id: string;
  time: number
}

export interface IStateAnimate {
  id: number;
}

export interface IWinner {
  id: string,
  wins: number,
  time: number
}

export interface IRaceWinner {
  name: string,
  success: boolean,
  time: number,
  id?: string
}

export type IRaceAll = (promises:Promise<IRace>[], items: ICar[], ids: string[]) => IRaceWinner;
