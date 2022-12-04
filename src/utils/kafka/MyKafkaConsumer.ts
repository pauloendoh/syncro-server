import { Consumer } from "kafkajs"
import { kafkaTopics } from "./kafkaTopics"
import { myKafka } from "./myKafka"

export class MyKafkaConsumer {
  private consumer: Consumer

  constructor(private kafka = myKafka) {}

  async start() {
    this.consumer = this.kafka.consumer({ groupId: "my-group" })
    await this.consumer.connect()

    await this.consumer.subscribe({
      topics: [kafkaTopics.startMyAnimeListImport],
    })

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("🍕 Kafka Consuming: ", {
          topic,
          value: message.value?.toString(),
        })
      },
    })
  }
}
