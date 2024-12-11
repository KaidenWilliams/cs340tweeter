import { DynamoDbDaoFactory } from "../../model/dao/daoFactory/DynamoDbDaoFactory";
import { FeedEntity } from "../../model/entity/FeedEntity";
import { SQSEvent } from "aws-lambda";

// GETS FEED ENTITY FROM POSTFEED QUEUE AND CREATES FEED ENTITY IN DYNAMODB
export const handler = async (event: SQSEvent): Promise<void> => {
  const feedDao = new DynamoDbDaoFactory().createFeedDao();

  for (const record of event.Records) {
    const feedEntity: FeedEntity = JSON.parse(record.body);

    try {
      await feedDao.createFeed(feedEntity);
    } catch (error) {
      console.error("Error posting feed message:", error);
    }
  }
};
