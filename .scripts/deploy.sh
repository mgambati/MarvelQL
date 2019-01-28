yarn build
bash ./.scripts/generateEnvFile.sh
bash ./.scripts/deploy-now.sh
yarn apollo:publish