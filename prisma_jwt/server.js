const { PrismaClient } = require('@prisma/client');
const { queryType, mutationType, stringArg, makeSchema, objectType, nonNull } = require('nexus');
const { ApolloServer } = require('apollo-server');

const users = require('./users.json');

const prisma = new PrismaClient();

const client = objectType({
    name: 'client',
    definition(t){
        t.string('id');
        t.string('name');
        t.string('email');
        t.list.field('profile', {
            type: 'profile',
            resolve: (parent,_args) => {
                return prisma.client.findUnique({
                    where: {
                        id: parent.id || undefined
                    },
                })
                .profile();
            }
        })
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
                return prisma.profile.findUnique({
                    where: {
                        id: parent.id || undefined
                    },
                })
                .client()
            }
        })
    }
})

const query = queryType({
    definition(t) {
        t.field('singleClient', {
            type: 'client',
            args: {
                id: nonNull(stringArg()),
            },
            resolve: (_, args) => {
                return prisma.client.findUnique({
                    where: {
                        id: args.id,
                        profile: {
                            where: {
                                client_id: args.id,
                                is_deleted: false,
                            }
                        },
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
            resolve: (_, args) => {
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
            resolve: async (_parent, args) => {
                return prisma.client.create({
                    data: {
                        name: args.name,
                        email: args.email,
                    },
                });
            },
        });

        t.field('createManyClient',{
            type:"client",
            args:{
                name: nonNull(stringArg()),
                email: nonNull(stringArg())
            },
            resolve :()=>{
                const many_clients = users.map(single_user =>({
                     data : {
                        name :single_user.first_name,
                        email:single_user.email
                     }
                })) 

                return prisma.client.createMany({
                     data : many_clients
                })
            }
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

        t.field('upsertProfile', {
            type: 'profile',
            args: {
                id: nonNull(stringArg()),
                bio: nonNull(stringArg()),
                client_id: nonNull(stringArg()),
            },
            resolve: (_, args) => {
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
                        // client_id: args.bio
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


async function retrieve(){
    const user = await prisma.$queryRaw `SELECT * FROM client;`;
    user.forEach(i => {
        console.log(i);
    });
}
retrieve()


const schema = makeSchema({
    types: [client, profile, query, mutation]
});

const users = [
    {
        "id": 1,
        "first_name": "Sena",
        "last_name": "Devinn",
        "email": "sdevinn0@eventbrite.com",
        "gender": "Bigender",
        "ip_address": "178.16.15.216",
        "address": "7518 Calypso Plaza"
    },
    {
        "id": 2,
        "first_name": "Dieter",
        "last_name": "Merdew",
        "email": "dmerdew1@so-net.ne.jp",
        "gender": "Male",
        "ip_address": "177.141.80.57",
        "address": "75 Del Mar Street"
    },
    {
        "id": 3,
        "first_name": "Emmett",
        "last_name": "Bohlens",
        "email": "ebohlens2@people.com.cn",
        "gender": "Male",
        "ip_address": "90.129.31.123",
        "address": "17 Jana Center"
    },
    {
        "id": 4,
        "first_name": "Alvira",
        "last_name": "Aleksich",
        "email": "aaleksich3@dmoz.org",
        "gender": "Female",
        "ip_address": "86.78.200.133",
        "address": "99 Pierstorff Alley"
    },
    {
        "id": 5,
        "first_name": "Tulley",
        "last_name": "Husher",
        "email": "thusher4@163.com",
        "gender": "Male",
        "ip_address": "6.243.120.10",
        "address": "3 Columbus Terrace"
    },
    {
        "id": 6,
        "first_name": "Archy",
        "last_name": "Camilio",
        "email": "acamilio5@dedecms.com",
        "gender": "Male",
        "ip_address": "19.157.182.125",
        "address": "3171 Summer Ridge Park"
    },
    ]

const data = users.map(item =>({
    email : item.email,
    name : item.address
}))

async function seed(){
    await prisma.client.createMany({
        data
    })
}

seed().catch(e =>{
    console.log(e)
    process.exit(1)
})

const server = new ApolloServer({ schema });
server.listen(5000, () => {
    console.log("running on 5000");
});
