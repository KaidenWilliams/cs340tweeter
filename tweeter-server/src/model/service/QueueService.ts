import { SQSClient, SendMessageBatchCommand, SendMessageCommand } from "@aws-sdk/client-sqs";
import { StatusDto } from "tweeter-shared";
import { config } from "../../config/config";
import { FeedEntity } from "../entity/FeedEntity";

export class QueueService {
  private sqsClient: SQSClient;
  private POST_STATUS_QUEUE_URL = "https://sqs.us-east-2.amazonaws.com/214630358865/PostStatusQueue";
  private POST_FEED_QUEUE_URL = "https://sqs.us-east-2.amazonaws.com/214630358865/PostFeedQueue";
  BATCH_SIZE = 10;

  constructor() {
    this.sqsClient = new SQSClient({ region: config.AWS_REGION });
  }

  // SENDS MESSAGE WITH POSTSTATUS TO QUEUE
  async postStatusToQueue(newStatus: StatusDto): Promise<void> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.POST_STATUS_QUEUE_URL,
        MessageBody: JSON.stringify(newStatus),
      });

      await this.sqsClient.send(command);
    } catch (error) {
      console.error("Error posting status to queue:", error);
      throw new Error("Failed to post status to queue");
    }
  }

  // SENDS ALL FEEDENTITIES TO QUEUE
  async sendFeedMessagesToQueue(feedMessages: FeedEntity[]): Promise<void> {
    try {
      for (let i = 0; i < feedMessages.length; i += this.BATCH_SIZE) {
        const batch = feedMessages.slice(i, i + this.BATCH_SIZE);

        const command = new SendMessageBatchCommand({
          // Unique ID for each message in the batch needed
          QueueUrl: this.POST_FEED_QUEUE_URL,
          Entries: batch.map((message, index) => ({
            Id: `msg-${i + index}`,
            MessageBody: JSON.stringify(message),
          })),
        });

        await this.sqsClient.send(command);
      }
    } catch (error) {
      console.error("Error sending feed messages to queue:", error);
      throw new Error("Failed to send feed messages");
    }
  }
}
