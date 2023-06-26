const DataLoader = require("dataloader");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 

const { setFields, setArrayFields } = require('../dataloader');

const clientLoader = new DataLoader(async(ids) => {
    const clients = await prisma.client.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    return setFields(clients, ids);
}, {cache: true});

const profileLoader = new DataLoader(async(ids) => {
    const profiles = await prisma.profile.findMany({
        where: {
            client_id: {
                in: ids,
            },
        },
    });
    return setArrayFields(profiles, ids, "client_id")
},{cache:true});


module.exports = {
    clientLoader,
    profileLoader,
}
