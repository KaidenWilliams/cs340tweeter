// TODO FIGURE OUT THIS SORT KEY SHENANIGANS LATER

export class Feed {
  // followerAlias: person who is FOLLOWING
  // followeeAlias: person who is BEING FOLLOWED
  constructor(
    public follower_alias: string,
    public followee_alias: string,
    public sort_key: string, // combo of ISO timestamp + followee_alias
    public timestamp: number,
    public post: string
  ) {}
}
