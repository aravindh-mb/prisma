const express = require("express");
const app = express();
const port = 6673;
const dotenv = require("dotenv");
const usersData = require("./users.json");

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const bodyParser = require('body-parser');

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/get-users', async(req,res)=>{
    const users = await prisma.user.findMany();
    res.send(users)
})

app.get('/delete-user', async (req, res) => {
 

  try {
    const deleteUser = await prisma.user.delete({
      where: {
        id: 1,
      },
    });
    
    res.json(deleteUser);

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/create-user',async(req,res)=>{
  try {
    for (let i = 11; i < usersData.length; i++) {
      await prisma.user.create({
        data: {
          name: usersData[i].first_name,
          email: usersData[i].email,
          password: usersData[i].last_name,
        }
      });
    }

    res.send("Users created successfully");
  } catch (error) {
    console.error("Error creating users:", error);
    res.status(500).send("Failed to create users");
  }
});

app.get('/update-user',async(req,res)=>{

  const updatedUser = await prisma.user.update({
    where: {
      id: 3, // Replace with the actual ID of the user you want to update
    },
    data: {
      name: "siva",
      email: "updated-email@example.com",
      password: "password",
    },
  });
  res.send(updatedUser);
  
})

app.listen(port , ()=> console.log(`app running on ${port} port`));
