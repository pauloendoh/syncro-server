import * as swaggerUiExpress from "swagger-ui-express"
const { defaultMetadataStorage } = require("class-transformer/cjs/storage")

import { validationMetadatasToSchemas } from "class-validator-jsonschema"
import path from "path"
import "reflect-metadata"

import { config } from "dotenv"
import express from "express"
import {
  Action,
  createExpressServer,
  getMetadataArgsStorage,
  RoutingControllersOptions,
} from "routing-controllers"
import { routingControllersToSpec } from "routing-controllers-openapi"
import { createProfileForUsersWithoutProfile } from "./temp/createProfileForUsersWithoutProfile"
import { validateJwt } from "./utils/auth/validateJwt"
config()

const routingControllersOptions: RoutingControllersOptions = {
  cors: true,
  controllers: [path.join(__dirname + "/**/*Controller{.js,.ts}")],

  currentUserChecker: async (action: Action) => {
    const token = action.request.headers["authorization"]
    const user = await validateJwt(token)
    return user
  },
}

const app = createExpressServer(routingControllersOptions)

app.use("/public", express.static(__dirname + "/public"))
app.get("/ping", (req: any, res: any) => res.json({ message: "pong" }))

// Parse class-validator classes into JSON Schema:
const schemas = validationMetadatasToSchemas({
  classTransformerMetadataStorage: defaultMetadataStorage,
  refPointerPrefix: "#/components/schemas/",
})

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    schemas,
    securitySchemes: {
      basicAuth: {
        scheme: "basic",
        type: "http",
      },
    },
  },
  info: {
    description: "Generated with `routing-controllers-openapi`",
    title: "A sample API",
    version: "1.0.0",
  },
})

app.use("/swagger", swaggerUiExpress.serve, swaggerUiExpress.setup(spec))

const port = process.env.PORT || 3001

const server = app.listen(port, () => {
  console.log(`
🚀 Server ready at: http://localhost:${port}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)

  // temp (remove when all production users have a profile)
  createProfileForUsersWithoutProfile()
})
