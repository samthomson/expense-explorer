# expense-explorer

Created to better make sense of my spending.
It reads in a CSV from iExpense (mobile app), and feeds in all expenses into elasticsearch. Aggreagation summaries are then generated based on what a calendar UI helps the user request.

Stack:
- React TS / redux
- Node TS / graphQL API / elasticsearch
- docker / docker-compose


## work on / run

`docker-compose up` to start

## todo

- client containter
- ejected react ts with redux
- graphql api
- elasticsearch container
- read csv and store in elasticsearch