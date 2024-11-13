import { UserDto } from "./UserDto";

export interface StatusDto {
  readonly post: string;
  readonly userDto: UserDto;
  readonly timestamp: number;
}
