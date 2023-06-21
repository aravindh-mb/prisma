const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const data = require("./users.json")
const cors = require("cors")
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


app.use(bodyParser.json());

app.use(cors());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
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
            createEvent(name: String): String
            updateUserInfo(id: Int, name: String, email: String, job_title: String): Boolean
        }

        type Company {
          id: Int
          name: String
          age: Int
          address: String
          salary: Float
        }
        
        type Query {
          companies: [Company!]!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return data;
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      }
    },
    graphiql: true
  })
);

app.post('/',(req,res)=>{
  
  res.status(200).json("running")
})

// app.post('/job', async (req, res) => {
//   console.log(req.body)
//   const user = await prisma.company.create({
//      id: req.body.id,
//      name:req.body.email,
//      age:req.body.name,
//      address:req.body.address,
//      salary:req.body.salary,
//      join_data : req.body.join_date
//     });
//   res.json(user);
// });

app.post('/find', async (req, res) => {
  const job = await prisma.company.findMany();
  console.log(job)
  res.json(job);
});

app.listen(3000);

console.log("now server running!")