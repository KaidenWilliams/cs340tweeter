import { User } from "../domain/User";
import { UserDto } from "../dto/UserDto";

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      alias: user.alias,
      imageUrl: user.imageUrl,
    };
  }

  static fromDto(userDto: UserDto | null): User | null {
    if (userDto == null) return null;
    return new User(userDto.firstName, userDto.lastName, userDto.alias, userDto.imageUrl);
  }
}
