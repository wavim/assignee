#!/bin/bash

git checkout master

branches=$(git branch | grep -v 'master' | sed 's/[ *\n]//g')

for branch in $branches; do
    echo -e "\nMerging $branch into master..."
    git merge "$branch"
done

git push origin master

for branch in $branches; do
    echo -e "\nUpdating $branch with latest master..."
    git checkout "$branch"
    git merge master
    git push origin "$branch"
done

echo
git checkout master
