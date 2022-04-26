#! /bin/bash
# wget -O http://ergast.com/downloads/f1db_csv.zip

# unzip -d _data -o f1db_csv.zip

rm -f f1db_csv.zip

for file in _data/*.csv
do
  sed -i "s|\\\N|null|ig" $file
done

