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
export type { ChangeFollowStateRequest } from "./model/net/request/ChangeFollowStateRequest";
export type { GetUserCountRequest } from "./model/net/request/GetUserCountRequest";
export type { GetIsFollowerRequest } from "./model/net/request/GetIsFollowerRequest";

// RESPONSES
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse";
export type { ChangeFollowStateResponse } from "./model/net/response/ChangeFollowStateResponse";
export type { GetUserCountResponse } from "./model/net/response/GetUserCountResponse";
export type { GetIsFollowerResponse } from "./model/net/response/GetIsFollowerResponse";

// DTOs
export type { UserDto } from "./model/dto/UserDto";

// MAPPERS
export { UserMapper } from "./model/mapper/UserMapper";

// OTHER
export { FakeData } from "./util/FakeData";
