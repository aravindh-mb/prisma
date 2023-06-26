const jwt = require('jsonwebtoken');

const secret = 'nexus_prisma';

const user = {
  id : "2345",
  role : 'ADMIN',
  address : "sdsdsdsd"
}

// const user = ["2345",'ADMIN','thiruthuraipoondi'];

const generateToken = () => {

    const expiresIn = '1d';


  return jwt.sign(user, secret, { expiresIn });
  };

// const token = generateToken();

// console.log(token)

  const decoded = jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMjM0NSIsInJvbGUiOiJBRE1JTiIsImFkZHJlc3MiOiJzZHNkc2RzZCJ9LCJpYXQiOjE2ODc3NjU3NzEsImV4cCI6MTY4Nzg1MjE3MX0.tCX8Lc8njswruNq6ZHqh0vhH0DnUc41qkyILyTpXhmI", secret)

console.log("decoded",decoded)

 const verify = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMjM0NSIsInJvbGUiOiJBRE1JTiIsImFkZHJlc3MiOiJzZHNkc2RzZCJ9LCJpYXQiOjE2ODc3NjU3NzEsImV4cCI6MTY4Nzg1MjE3MX0.tCX8Lc8njswruNq6ZHqh0vhH0DnUc41qkyILyTpXhmI", secret);

 console.log("verify",verify);


// const validateToken = (req)=>{
    //   // Extract the JWT token from the request headers
    // const token = req.cookies.token || '';

    // try {
    //   // Verify and decode the JWT token
    //   const decoded = jwt.verify(token, secret);

    //   // Extract the user ID from the decoded token
    //   const userId = decoded.userId;

    //   // Add the user ID to the context
    //   return {
    //     prisma,
    //     user: { id: userId },
    //   };
    // } catch (error) {
    //   // If the token is invalid or expired, return an empty user object
    //   return {
    //     prisma,
    //     user: null,
    //   };
    // }
//     return true ;
// }  

  module.exports = {
    generateToken,
    jwt
  }