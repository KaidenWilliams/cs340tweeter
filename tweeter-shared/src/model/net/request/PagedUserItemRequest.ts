// Don't name interfaces with I- prefix because in
// -TS, don't really have an interface vs a concrete class
// you just create a new "object" that has the fields that the interface specifies
// just create an object, which technically is the concrete implementation
// but there is no class for it, it just is made on the spot,
// so don't need to distinguish the interface vs the concrete implementation naming wise

import { UserDto } from "../../dto/UserDto";
import { PagedItemRequest } from "./PagedItemRequest";

export interface PagedUserItemRequest extends PagedItemRequest<UserDto> {}
