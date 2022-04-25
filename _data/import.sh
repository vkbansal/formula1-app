#! /bin/bash
mongoimport --host formula1-data \
  --db formula1 \
  --collection collection_name_here \
  --type json \
  --file /mongo-seed/file_name_here.json
