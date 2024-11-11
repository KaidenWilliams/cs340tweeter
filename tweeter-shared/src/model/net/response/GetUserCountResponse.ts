import { TweeterResponse } from "./TweeterResponse";

export interface GetUserCountResponse extends TweeterResponse {
  readonly count: number;
}
