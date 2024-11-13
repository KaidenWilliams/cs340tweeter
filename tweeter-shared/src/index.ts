// All classes that should be available to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.

// DOMAIN CLASSES
export { User } from "./model/domain/User";
export { Status } from "./model/domain/Status";
export { Follow } from "./model/domain/Follow";
export { AuthToken } from "./model/domain/AuthToken";
export { PostSegment, Type } from "./model/domain/PostSegment";

// REQUESTS
export type { PagedUserItemRequest } from "./model/net/request/PagedUserItemRequest";
export type { PagedStatusItemRequest } from "./model/net/request/PagedStatusItemRequest";
export type { ChangeFollowStateRequest } from "./model/net/request/ChangeFollowStateRequest";
export type { GetCountRequest } from "./model/net/request/GetCountRequest";
export type { GetIsFollowerRequest } from "./model/net/request/GetIsFollowerRequest";
export type { GetUserRequest } from "./model/net/request/GetUserRequest";
export type { PostStatusRequest } from "./model/net/request/PostStatusRequest";
export type { LoginRequest } from "./model/net/request/LoginRequest";
export type { RegisterRequest } from "./model/net/request/RegisterRequest";
export type { LogoutRequest } from "./model/net/request/LogoutRequest";

// RESPONSES
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse";
export type { PagedStatusItemResponse } from "./model/net/response/PagedStatusItemResponse";
export type { ChangeFollowStateResponse } from "./model/net/response/ChangeFollowStateResponse";
export type { GetUserResponse } from "./model/net/response/GetUserResponse";
export type { GetCountResponse } from "./model/net/response/GetCountResponse";
export type { GetIsFollowerResponse } from "./model/net/response/GetIsFollowerResponse";
export type { SignInResponse } from "./model/net/response/SignInResponse";

// DTOs
export type { UserDto } from "./model/dto/UserDto";
export type { StatusDto } from "./model/dto/StatusDto";

// MAPPERS
export { UserMapper } from "./model/mapper/UserMapper";
export { StatusMapper } from "./model/mapper/StatusMapper";

// OTHER
export { FakeData } from "./util/FakeData";
