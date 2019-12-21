# expense-explorer

![expense explorer](./expense-explorer.png)

Created to better make sense of my spending.
It reads in a CSV from iExpense (mobile app), and feeds in all expenses into elasticsearch. Elastic queries are used along with some backend logic to make more actionable data, this is then rendered in a react SPA, having been served via graphQL.

Stack:
- React TS / redux
- Node TS / graphQL API / elasticsearch
- docker / docker-compose

## setup

### inital setup

1. [clone repo & cd in]
2. build containers: `docker-compose build`
3. let each container install its js dependencies: `docker-compose run client yarn` and `docker-compose run server yarn`
4. start the containers: `docker-compose up -d`

### subsequent runs

1. `docker-compose up -d` to start

## work on / run

- update left hand side of data volume import (`/home/sam/Dropbox/Apps/Iexpense lite:/server/importer/data`)` to contain your own export folder
	- import script assumes all CSVs in that folder are named like `ix_20190417.csv`
- `docker-compose up -d` to start
	- or in dev: `docker-compose up -d elasticsearch dejavu && docker-compose up client server`
- `docker-compose run server yarn run import`
- browse to `http://localhost:3400` for the client, or `http://localhost:3300/graphql` to explore the API



Run `./sai.sh` to start the containers *and* run the importer.

## todo

- split up schema file

bigger features (maybe later):
- filterable table of expenses
- tests..
- three prettier files could be condensed to one ideally. Need root file for editor, how to map it to each container as read only?
- loading state while requests are being made

## usecases

- see a month by month summary of expenses
- for a single expense, see all instances of it
- summary and calendar view
- see a yearly view
- option to omit certain items from a report (like bhutan trip)

## gql

```
{
  summary(date:1566017598, scope: "month") {
    expenses {
      date,
      vendor
    }
  }
}
```