# expense-explorer

Created to better make sense of my spending.
It reads in a CSV from iExpense (mobile app), and feeds in all expenses into elasticsearch. Aggreagation summaries are then generated based on what a calendar UI helps the user request.

Stack:
- React TS / redux
- Node TS / graphQL API / elasticsearch
- docker / docker-compose


## work on / run

- update left hand side of data volume import (`/home/sam/Dropbox/Apps/Iexpense lite:/server/importer/data`)` to contain your own export folder
	- import script assumes all CSVs in that folder are named like `ix_20190417.csv`
- `docker-compose up` to start
- `docker-compose run server sh` and then `yarn run import`
- browse to `http://localhost:3400`

## todo

missing/todo:
- map dropbox folder in via docker-compose (like I did on python project)
- take latest file from folder, not just first it finds
- mean median mode?
- number display component (takes currency as param), formats with commas and decimals, and displays currency eg. 12 dkk or $12

bigger features:
- filterable table of expenses
- category filter, ie. show a category over time (month/year)
- single expense filter, ie. show a recurring expense over time (lunch/dinner/flights/beer/pad thai)

## usecases

- see a month by month summary of expenses
- for a single expense, see all instances of it
- summary and calendar view
- see a yearly view
- option to omit certain items from a report (like bhutan trip)