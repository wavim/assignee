#!/bin/bash

# Hard resets all branches to <master>

branches=$(git branch | grep -v 'master' | sed 's/[ *\n]//g')

for branch in $branches; do
    echo -e "\nResetting $branch to master..."
	git switch "$branch"
    git reset --hard master
done

echo
git switch master

echo
git push -f --all origin
