<p align="center"><img src="./src/assets/mylogo.svg" alt="logo" title="logo" width="80"></p>
<h1 align="center">TowelShop42 Backend</h1>

This is the backend part of an e-commerce fullstack project called **TowelShop42**. My main goal was to apply my knowledge about the **MERN stack** and have fun in the process by making reference to one of the best books ever written: **The Hitchhiker's Guide to the Galaxy**, by Douglas Adams.

For informations about the frontend or screenshots of the project, please check [this other repo](https://github.com/MarinaFroes/towelshop-frontend).

## Tech Stack

- Frontend language: Typescript
- Frontend library: React.js
- State management: Redux
- UI: Semantic UI
- Backend languages: Node.js + Typescript
- Backend framework: Express.js
- Database: MongoDb
- Devops: Docker
- Testing: Jest
- oauth2: Passport.js + Google strategy

## How to install and use it

- Clone the client, backend and the revproxy repositories.
- In the client repository, run:

```bash
# Build the images
$ docker-compose build

# Run the containers
$ docker-compose up
```

- Access it on `localhost:8080`

- To stop the containers

```bash
$ docker-compose stop
```

## References

- This backend was based on this [Node + Typescript starter code](https://github.com/microsoft/TypeScript-Node-Starter).
- [Typescript Documentation](https://www.typescriptlang.org/docs/home)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [MongoDb Documentation](https://docs.mongodb.com/)
- [Jest Documentation](https://jestjs.io/docs/en/getting-started)
- [MDN Documentation](https://developer.mozilla.org)
