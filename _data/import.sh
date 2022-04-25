#! /bin/bash

for file in /_data/*.csv
do
  collection="$(basename $file | cut -d '.' -f1)"
  mongoimport --host formula1-data \
  --db formula1 \
  --collection $collection \
  --type csv \
  --headerline \
  --file $file
done
