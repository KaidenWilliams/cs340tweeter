import { StatusDto } from "tweeter-shared";
import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { QueueService } from "../../model/service/QueueService";
import { FeedEntity } from "../../model/entity/FeedEntity";
import { SQSEvent } from "aws-lambda";

// GETS POSTSTATUS MESSAGE FROM POSTSTATUS QUEUE, GETS FOLLOWERS, CREATES FEEDENTITIE FOR EACH FOLLOWER AND SENDS TO POSTFEED QUEUE
export const handler = async (event: SQSEvent): Promise<void> => {
  const followDao = new DynamoDbDaoFactory().createFollowDao();
  const queueService = new QueueService();

  for (const record of event.Records) {
    const newStatus: StatusDto = JSON.parse(record.body);

    try {
      const followEntities = await followDao.getAllFollowersForFollowee(newStatus.userDto.alias);

      const feedMessages: FeedEntity[] = followEntities.map((followEntity) => ({
        followerAlias: followEntity.followerHandle,
        posterAlias: newStatus.userDto.alias,
        timestamp: newStatus.timestamp,
        post: newStatus.post,
      }));

      await queueService.sendFeedMessagesToQueue(feedMessages);
    } catch (error) {
      console.error("Error processing status for feed generation:", error);
    }
  }
};
