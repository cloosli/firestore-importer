# Firestore Importer

## Getting Started

1. Run `npm install`
2. Download service account credentials from Firebase project
3. Run `npm run build`

You can compile the source code and link the command by running: 
`npm run build-link`

## Examples

        fire-migrate --src samples/wind.csv --collection wind
        fire-migrate --src samples/city.list.json --collection ow_citylist --id id

