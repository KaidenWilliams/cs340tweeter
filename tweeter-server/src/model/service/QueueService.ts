import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { StatusDto } from "tweeter-shared";
import { config } from "../../config/config";
import { FeedEntity } from "../entity/FeedEntity";

export class QueueService {
  private sqsClient: SQSClient;
  private POST_STATUS_QUEUE_URL = process.env.POST_STATUS_QUEUE_URL || "";
  private POST_FEED_QUEUE_URL = process.env.POST_FEED_QUEUE_URL || "";

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
      const sendPromises = feedMessages.map((message) => {
        const command = new SendMessageCommand({
          QueueUrl: this.POST_FEED_QUEUE_URL,
          MessageBody: JSON.stringify(message),
        });
        return this.sqsClient.send(command);
      });

      await Promise.all(sendPromises);
    } catch (error) {
      console.error("Error sending feed messages to queue:", error);
      throw new Error("Failed to send feed messages");
    }
  }
}
