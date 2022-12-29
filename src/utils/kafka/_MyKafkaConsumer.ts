import { Consumer } from "kafkajs"
import { MalRatingImportService } from "../../domains/mal-rating-import/MalRatingImportService"
import { kafkaTopics } from "./kafkaTopics"
import { myKafka } from "./myKafka"

export class MyKafkaConsumer {
  private consumer: Consumer

  constructor(
    private kafka = myKafka,
    private malRatingImportService = new MalRatingImportService()
  ) {}

  async start() {
    this.consumer = this.kafka.consumer({ groupId: "my-group" })
    await this.consumer.connect()

    await this.consumer.subscribe({
      topics: [
        kafkaTopics.startMyAnimeListImport,
        kafkaTopics.importRatingItem,
      ],
    })

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        // disable kafka for now
        // console.log("🍕 Kafka Consuming: ", {
        //   topic,
        //   value: message.value?.toString(),
        // })
        // if (topic === kafkaTopics.importRatingItem) {
        //   const value = message.value?.toString()
        //   if (value)
        //     this.malRatingImportService.processRatingsImportItem(
        //       JSON.parse(value)
        //     )
        // }
      },
    })
  }
}
