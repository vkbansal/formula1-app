export async function query(db) {
  const data = await db
    .collection('constructors')
    .aggregate([
      {
        $lookup: {
          from: 'results',
          as: 'race_results',
          localField: 'constructorId',
          foreignField: 'constructorId',
          pipeline: [
            { $group: { _id: '$position', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ]
        }
      },
      {
        $project: {
          _id: 0,
          constructorId: 1,
          constructorRef: 1,
          name: 1,
          nationality: 1,
          total_races: {
            $reduce: {
              input: '$race_results',
              initialValue: 0,
              in: { $add: ['$$value', '$$this.count'] }
            }
          },
          race_wins: {
            $function: {
              body: `function foo(results) {
                const first = results.find((r) => r._id === 1);

                return first ? first.count : 0;
              }`,
              args: ['$race_results'],
              lang: 'js'
            }
          },
          podiums: {
            $function: {
              body: `function foo(results) {
                const second = results.find((r) => r._id === 2);
                const third = results.find((r) => r._id === 3);

                return (second ? second.count : 0) + (third ? third.count : 0);
              }`,
              args: ['$race_results'],
              lang: 'js'
            }
          }
        }
      },
      {
        $addFields: {
          win_pct: {
            $round: [
              {
                $multiply: [
                  {
                    $cond: [
                      { $gt: ['$total_races', 0] },
                      { $divide: ['$race_wins', '$total_races'] },
                      0
                    ]
                  },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      { $sort: { name: 1 } }
    ])
    .toArray();

  return {
    data,
    path: 'constructors/index.yaml'
  };
}
