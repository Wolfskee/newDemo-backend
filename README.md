# New Demo API

A NestJS repository for the New Demo application.


## Project setup

```bash
$ npm install
```

### Database Setup

The development database runs in a Docker container.

**Start the database**

```bash
npm run db:dev:up
```

**Generate Prisma Client**

```bash
npx prisma generate
```

**Push Prisma schema to the database**

```bash
npx prisma db push
```

**Stop and remove the database**

```bash
npm run db:dev:rm
```

**Restart the database**

```bash
npm run db:dev:restart
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
