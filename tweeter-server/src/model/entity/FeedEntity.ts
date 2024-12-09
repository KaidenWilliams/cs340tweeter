// TODO FIGURE OUT THIS SORT KEY SHENANIGANS LATER

export class FeedEntity {
  // followerAlias: person who is FOLLOWING
  // followeeAlias: person who is BEING FOLLOWED

  //Sort Key: combo of timestamp + followee_alias

  constructor(
    public followerAlias: string,
    public followeeAlias: string,
    public timestamp: number,
    public post: string
  ) {}
}
