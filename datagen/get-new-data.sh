DATA=$(curl -s http://ergast.com/api/f1/current/last/results.json)
LATEST_SEASON="$( echo $DATA | jq -r .MRData.RaceTable.season)"
LATEST_ROUND="$( echo $DATA | jq -r .MRData.RaceTable.round)"

CURRENT_SEASON="$(cat datagen/metadata.json | jq -r .latest.season)"
CURRENT_ROUND="$(cat datagen/metadata.json | jq -r .latest.round)"

echo "Latest data is for: $(echo $DATA | jq -r '.MRData.RaceTable.Races[0].raceName') $LATEST_SEASON"

if [ "$CURRENT_SEASON" = "$LATEST_SEASON" ] && [ "$CURRENT_ROUND" = "$LATEST_ROUND" ]; then
	echo "No new data found!"
else
	echo "New data exists"
	echo "Downloading latest data"
	wget http://ergast.com/downloads/f1db.sql.gz -O initdb.d/f1db.sql.gz
	echo "Stopping existing docker if running"
	docker compose down
	sleep 2
	echo "Staring docker"
	docker compose up -d
	while ! node datagen/index.mjs >/dev/null 2>&1; do
		echo "Trying datagen"
		sleep 2
	done
	echo "Datagen done!"
	echo "Stopping docker"
	docker compose down
	NEW_CONTENT="$(jq --arg season $LATEST_SEASON --arg round $LATEST_ROUND '.latest.round = ($round|tonumber) | .latest.season = ($season|tonumber)' datagen/metadata.json)"
	echo $NEW_CONTENT > datagen/metadata.json
fi

