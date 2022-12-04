import axios from "axios"
import { NotFoundError } from "routing-controllers"
import { kafkaTopics } from "../../../utils/kafka/kafkaTopics"
import { myKafka } from "../../../utils/kafka/myKafka"
import { urls } from "../../../utils/urls"

export class _StartMyAnimeListImport {
  constructor(private kafka = myKafka) {}

  async exec(requesterId: string, username: string) {
    const malResponse = await axios
      .get(urls.myAnimeListUsername(username))
      .catch((err) => {
        throw new NotFoundError("MyAnimeList user not found.")
      })

    const producer = this.kafka.producer()
    await producer.connect()
    await producer.send({
      topic: kafkaTopics.startMyAnimeListImport,
      messages: [{ value: JSON.stringify({ requesterId, username }) }],
    })
    await producer.disconnect()

    return true
  }
}
