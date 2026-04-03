#!/bin/sh


# save current directory
DIR=$PWD

# ensure in sync with origin
cd ..
echo "pulling latest changes from origin"
git pull
wait
cd $DIR
wait

# use tomorrow as date unless one is provided
if [ -z "$1" ] 
then
    DATE=`date -v+1d +%Y-%m-%d` 
else
    DATE=$1
fi
echo "using date $DATE"

# run python script for date
python ./query_new_wordle_words.py -d $DATE
wait

# if no changes, exit
DIFF=`git diff`
wait
if [ -z "$DIFF" ]
then
    exit
fi

# offer to commit changes
read -p "Commit changes (local and remote)? y/n: " PROCEED
cd ..
wait
if [ "$PROCEED" == "y" ]
then
    git add .
    wait

    git commit -m "update word list through $DATE"
    wait

    git push origin main
    wait
else
    echo "terminated, word list changes shown below (if any)"
    git diff ./src/assets/date_to_word.js
fi


