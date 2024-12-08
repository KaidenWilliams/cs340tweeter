export class FollowEntity {
  // follower_handle: person who is FOLLOWING
  // followee_handle: person who is BEING FOLLOWED
  constructor(public followerHandle: string, public followeeHandle: string) {}
}
