import { Kafka, logLevel } from "kafkajs"

export const myKafka = new Kafka({
  brokers: [String(process.env.KAFKA_BROKERS)],
  sasl: {
    mechanism: "scram-sha-256",
    username: String(process.env.KAFKA_USERNAME),
    password: String(process.env.KAFKA_PASSWORD),
  },
  ssl: true,
  logLevel: logLevel.ERROR,
})
