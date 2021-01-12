### expert-journal-server
A simple nodejs based API server for managing tasks for authenticated user.

## How to install?
- Clone the repo
- install the dependencies `yarn`
- start the server `yarn`
- on local server if hitting API's via browser, the browser will block the request. Just try after turning off the CORS flag or use a proxy server to hit the localhost server.
- Have docker? Just run `docker-compose up -d`


### List of APIs:

- *Authentication* `/user/login` POST request with JSON body:
```
{
    "id": "test",
    "name": "test"
}
```
- *All tasks* `/user/tasks` GET request don't forget to add the bearer token in header.
- *Create task* `/user/tasks` POST request don't forget to add the bearer token in header.
JSON Body:
```
{
    "name": "test"
}
```
- *All tasks* `/user/tasks/:id` PUT request don't forget to add the bearer token in header.
JSON Body:
```
{"completed": true}
```

- *Delete task* `/user/tasks/:id` DELETE request don't forget to add the bearer token in header.

- *Dashboard* `/user/dashboard` GET request don't forget to add the bearer token in header.
