import { TweeterResponse } from "./TweeterResponse";

export interface ChangeFollowStateResponse extends TweeterResponse {
  readonly countFollower: number;
  readonly countFollowee: number;
}
