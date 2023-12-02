# expense-explorer

![expense explorer](./expense-explorer.png)

Created to better make sense of my spending.
It reads in a CSV from iExpense (mobile app), and feeds in all expenses into elasticsearch. Elastic queries are used along with some backend logic to make more actionable data, this is then rendered in a react SPA, having been served via graphQL.

Stack:
- React TS / redux
- Node TS / graphQL API / elasticsearch
- docker / docker-compose

## setup

### pre-run setup

0. [clone repo & cd in]
1. Make a copy of the environmental variables required by running `cp .env.sample .env` and then fill them all in.
2. build containers: `docker-compose build`
3. let each container install its js dependencies: `docker-compose run client yarn && docker-compose run server yarn`

### run

1. `docker-compose up -d` to start
2. browse to
  - `http://localhost:3400` for the client
  - `http://localhost:3300/graphql` to explore the API
  - `http://localhost:1359` for dejavu (enter `http://localhost:9201` for host, and `expense-explorer-index` for index.)

## data import

- update the env var `DROPBOX_DIR` to contain your own export folder
	- import script assumes all CSVs in that folder are named like `ix_20190417.csv`
- after starting the project (`docker-compose up -d`)
	- or in dev: `docker-compose up -d elasticsearch dejavu && docker-compose up client server`
- run `docker-compose run server yarn run import` to read in expenses




Run `bash ./sai.sh` to start the containers *and* run the importer.

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