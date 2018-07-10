
for var in $(printenv); do
    if [[ $var == * ]] ;
    then
        echo "$var" >> .env
    fi
done