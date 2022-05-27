

const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `
  type Query {
    users: [User!]!
  }

  type Query {
    user(id: String!): User
  }

  type User {
    userId: String!
    name: String!
    pincode: String!
    state: String!
    country: String!
  }
`

let users = [{
    userId: '102',
    name: 'Max',
    pincode: '110000',
    state: 'Delhi',
    country: 'India'
  },
  {
    userId: '103',
    name: 'Alex',
    pincode: '110001',
    state: 'UP',
    country: 'India'
  }
]

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
  
  const resolvers = {
    Query: {
      users: () => users,
      user: (args) => {
        return users.find(user => user.userId === args.id);
      }
  
    },
    User: {
      userId: (parent) => parent.userId,
      name: (parent) => parent.name,
      pincode: (parent) => parent.pincode,
      state: (parent) => parent.state,
      country: (parent) => parent.country
    }
  }



//   meet.google.com/siw-nckj-fie

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
  });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });