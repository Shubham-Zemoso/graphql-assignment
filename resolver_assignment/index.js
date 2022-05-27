

const { ApolloServer, gql } = require('apollo-server');
const data = require("./data.json");

const {v4:uuid} = require('uuid')



// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `
type Tweet {
    id: ID!
    # The tweet text. No more than 140 characters!
    body: String
    # When the tweet was published
    date: Date
    # Who published the tweet
    author: User
    # Views, retweets, likes, etc
    stats: Stat
 }
 
 type User {
    id: ID!
    username: String
    first_name: String
    last_name: String
    full_name: String
    avatar_url: Url
 }
 
 
 
 type Stat {
    views: Int
    likes: Int
    retweets: Int
    responses: Int

}

type Notification {
    id: ID
    date: Date
    type: String
 }
 
 
 
 type Meta {
    count: Int
 }
 
 
 
 scalar Url
 scalar Date
 
 
 type Query {
    tweet(id: ID!): Tweet
    tweets(limit: Int, skip: Int, sort_field: String, sort_order: String): [Tweet]
    tweetsMeta: Meta
    user(id: ID!): User
    notifications(limit: Int): [Notification]
 
}

type Mutation {
    createTweet (
        body: String
    ): Tweet
    deleteTweet(id: ID!): Tweet
    markTweetRead(id: ID!): Boolean
 }
 
  
`

const user = {
    "id": "u002",
    "username": "max",
    "first_name": "Max",
    "last_name": "Well",
    "full_name": "Max Well",
    "avatar_url": "avatarurl2"
}

const stats = {
    "views": 0,
    "likes": 0,
    "retweets": 0,
    "reponses": 0
}

const sort_by_key = (array, key)=>
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
  
  const resolvers = {
    Query: {
        tweets: (parent, {limit, sort_field, sort_order}, context) => {
            let tweets = data.tweets;
            tweets = sort_by_key(tweets,sort_field)
            return sort_order==='asc'? tweets.slice(0,limit): tweets.reverse().slice(0,limit);
        },

        tweet: (parent, {id}, context) => {
            return data.tweets.find(tweet => tweet.id === id);
        },
        tweetsMeta: () => data.tweets_meta,
        user: (parent, args, context) => {
            return data.users.find(user => user.id === args.id);
        },
        notifications: (parent, args, context) => {
            return data.notifications.slice(0,args.limit);
        }
  
    },

    Mutation: {
        createTweet: (parent, {body}, context) => {
            const newTweet = {
                id: uuid(),
                body: body,
                date: new Date(),
                author: user,
            }

            data.tweets.push(newTweet);
            return newTweet;
        },

        deleteTweet: (parent, {id}, context) => {
            const tweet = data.tweets.find(tweet => tweet.id === id);
            data.tweets = data.tweets.filter(tweet => tweet.id!==id);
            return tweet;
        },
        
        markTweetRead: (parent, {id}, context) => {
            for(let i=0;i<data.tweets.length;i++)
            {
                if(data.tweets[i].id===id)
                {
                    data.tweets[i].stats.views++;
                    return true;
                }
            }

            return false;
            
        }
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
    //   console.log(data.tweets);
    console.log(`🚀  Server ready at ${url}`);
  });