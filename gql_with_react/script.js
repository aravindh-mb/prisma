// run inside `async` function
const newUser = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
    },
  })

  
  const users = await prisma.user.findMany();

  console.log(users)

  const createMany = await prisma.user.createMany({
    data: [
      { name: 'Bob', email: 'bob@prisma.io' },
      { name: 'Bobo', email: 'bob@prisma.io' }, // Duplicate unique key!
      { name: 'Yewande', email: 'yewande@prisma.io' },
      { name: 'Angelique', email: 'angelique@prisma.io' },
    ],
    skipDuplicates: true, // Skip 'Bobo'
  });
