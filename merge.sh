#!/bin/bash

git switch master

branches=$(git branch | grep -v 'master' | sed 's/[ *\n]//g')

for branch in $branches; do
    echo -e "\nMerging $branch into master..."
    git merge "$branch"
done

for branch in $branches; do
    echo -e "\nUpdating $branch with latest master..."
    git switch "$branch"
    git merge master
done

echo
git switch master

echo
git push --all origin
