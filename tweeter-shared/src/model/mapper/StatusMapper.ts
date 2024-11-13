import { Status } from "../domain/Status";
import { StatusDto } from "../dto/StatusDto";
import { UserMapper } from "./UserMapper";

export class StatusMapper {
  static toDto(status: Status): StatusDto {
    return {
      post: status.post,
      userDto: UserMapper.toDto(status.user),
      timestamp: status.timestamp,
    };
  }

  static fromDto(statusDTO: StatusDto | null): Status | null {
    if (statusDTO == null) return null;
    return new Status(statusDTO.post, UserMapper.fromDto(statusDTO.userDto)!, statusDTO.timestamp);
  }
}
