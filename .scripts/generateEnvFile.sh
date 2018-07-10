
for var in $(printenv); do
    if [[ $var == GRAPHQL_* ]] ;
    then
        echo "$var" >> .env
    fi
done