// TODO FIGURE OUT THIS SORT KEY SHENANIGANS LATER

export class FeedEntity {
  // followerAlias: person who is FOLLOWING
  // followeeAlias: person who is BEING FOLLOWED
  constructor(
    public followerAlias: string,
    public followeeAlias: string,
    public sortKey: string, // combo of ISO timestamp + followee_alias
    public timestamp: number,
    public post: string
  ) {}
}
