import jsonServer from 'json-server';

const PORT = process.env.PORT || 8080;
const server = jsonServer.create();
const router = jsonServer.router('db/data.json');  
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
