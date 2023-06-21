const { buildSchema } = require('graphql');

export const customSchema = buildSchema(`
  type Event {
    id: Int
    first_name: String
    last_name: String
    email: String
    gender: String
    ip_address: String
    address: String
  }

  type RootQuery {
    events: [Event!]!
  }

  type RootMutation {
    createEvent(name: String): String!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
