#! /bin/bash
DATA_DIR="/opt/seed-data"

apt update
apt install wget unzip

mkdir $DATA_DIR
cd $DATA_DIR

wget "http://ergast.com/downloads/f1db_csv.zip"

unzip -o f1db_csv.zip

for file in $DATA_DIR/*.csv
do
  sed -i "s|\\\N|null|ig" $file
done

for file in $DATA_DIR/*.csv
do
  collection="$(basename $file | cut -d '.' -f1)"
  mongoimport --host formula1-data \
  --db formula1 \
  --collection $collection \
  --type csv \
  --headerline \
  --file $file
done
