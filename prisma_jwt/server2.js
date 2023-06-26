const { PrismaClient } = require('@prisma/client');
const { queryType, mutationType, stringArg, makeSchema, objectType, nonNull, fieldAuthorizePlugin } = require('nexus');
const { ApolloServer } = require('apollo-server');
const { profileLoader, clientLoader } = require('./loaders/loaders');
// const { shield, allow, deny, rule } = require('nexus-plugin-shield');
const { validate } = require('graphql');
const { generateToken ,jwt } = require('./security/jwt');
const Cookies = require('js-cookie');

const token = generateToken()

console.log("mytoken",token)

const prisma = new PrismaClient(); 

const client = objectType({
    name: 'client',
    definition(t){
        t.string('id');
        t.string('name');
        t.string('email');
        t.list.field('profile', {
            type: 'profile',
            resolve: (parent, _args) => {
                return profileLoader.load(parent.id);
            }
        });
    },
});

const profile = objectType({
    name: 'profile',
    definition(t) {
        t.string('id');
        t.string('bio');
        t.boolean('is_deleted');
        t.string('client_id');
        t.field('client', {
            type: 'client',
            resolve: (parent, _args) => {
                return clientLoader.load(parent.client_id);
            },
        })
    }
})

const rules = {
    isAuthenticated: (parent, args, ctx) => {
        console.log(ctx.request.headers.token,token);
        
      if (ctx.request.headers.token === token) {
        Cookies.set('myCookie', 'hello', { expires: 1 });
        return true;
      }
      return "invalid or expired token";
    },
    // Add more rules if needed
  };

const query = queryType({
    definition(t) {
        t.field('singleClient', {
            type: 'client',
            args: {
                id: nonNull(stringArg()),
            },
            authorize: rules.isAuthenticated,
            resolve: (_, args,ctx) => {
                // const headers = ctx.request.headers;
             
                

                const cookieValue = Cookies.get('myCookie');

                console.log("my cookie",cookieValue);

                return prisma.client.findUnique({
                    where: {
                        id: args.id,
                        // profile: {
                        //     where: {
                        //         client_id: args.id,
                        //         is_deleted: false,
                        //     },
                        // },
                    },
                    
                });
            }
        })

        t.list.field('manyClients', {
            type: 'client',
            resolve: () => {
                return prisma.client.findMany();
            },
        });

        t.field('singleProfile', {
            type: 'profile',
            args: {
                id: nonNull(stringArg()),
            },
            resolve: (_, args,ctx) => {
                // const token = generateToken();
                Cookies.set('myCookie', 'hello', { expires: 1 });
                console.log(ctx.token,"myToken")
                return prisma.profile.findUnique({
                    where: {
                        id: args.id,
                    },
                });
            },
        });

        t.list.field('manyProfiles', {
            type: 'profile',
            resolve: () => {
                return prisma.profile.findMany({
                    where:{
                        is_deleted:false,
                    }
                });
            },
        });
    },
});

const mutation = mutationType({
    definition(t){
        t.field('createClient', {
            type: 'client',
            args: {
                name: nonNull(stringArg()),
                email: nonNull(stringArg())
            },
            resolve: async (_parent, args,ctx) => {
                console.log(ctx)
                return prisma.client.create({
                    data: {
                        name: args.name,
                        email: args.email,
                    },
                });
            },
        });

        t.field('createProfile', {
            type: 'profile',
            args: {
                bio:nonNull(stringArg()),
                client_id: nonNull(stringArg()),
            },
            resolve: (_parent, args) => {
                return prisma.profile.create({
                    data: {
                        bio: args.bio,
                        client: {
                            connect: {
                                id: args.client_id,
                            }
                        },
                    },
                });
            },
        });

        t.field('deleteClient', {
            type: 'client',
            args: {
                id: nonNull(stringArg()),
            },
            resolve: (_, args) => {
               return prisma.client.delete({
                    where: {
                        id: args.id,
                    },
                });  
            }
        });

        t.field('deleteProfile', {
            type: 'profile',
            args: {
                id: nonNull(stringArg()),
            },
            resolve: (_, args) => {
                return prisma.profile.delete({
                    where: {
                        id: args.id,
                    },
                });
            },
        });

        t.field('updateClient', {
            type: 'client',
            args: {
                id: nonNull(stringArg()),
                data: nonNull(stringArg()),
            },
            resolve: (_, args) => {
                clientLoader.clear(args.id);
                return prisma.client.update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        name: args.data
                    },
                })
            }
        })

        t.field('upsertProfile', {
            type: 'profile',
            args: {
                id: nonNull(stringArg()),
                bio: nonNull(stringArg()),
                client_id: nonNull(stringArg()),
            },
            resolve: (_, args) => {
                clientLoader.clear(args.id);
                return prisma.profile.upsert({
                    where:{
                        id: args.id,
                    },
                    create: {
                        bio: args.bio,
                        client: {
                            connect: {
                                id: args.client_id,
                            }
                        }
                    },
                    update: {
                        bio: args.bio,
                    },

                })
            },
        });

        t.field('softDeleteProfile', {
            type: 'profile',
            args: {
                id: nonNull(stringArg()),
            },
            resolve:async (_, args) => {
                return await prisma.profile.update({
                    where:{
                        id: args.id,
                    },
                    data: {
                        is_deleted: true,
                    },
                });
            },
        });
    },
});

// raw query
// async function retrieve(){
//     const user = await prisma.$queryRaw `SELECT * FROM profile;`;
//     user.forEach(i => {
//         console.log("bio:",i.bio);
//     });
// }
// retrieve()

const schema = makeSchema({
    types: [client, profile, query, mutation],
    plugins:[fieldAuthorizePlugin()],
});

const server = new ApolloServer({ 
    schema                                                                                   ,
    context: ({ req }) => ({
        request: req,
      }),
    clientLoader,
    profileLoader,
})

server.listen(8081, () => {
    console.log("server on 8081");
});
