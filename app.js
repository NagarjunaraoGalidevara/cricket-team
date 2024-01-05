const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

app.use(express.json())

const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null

const InitilizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('local host running in 3000')
    })
  } catch (e) {
    console.log(`DB ERROR: ${e.message}`)
    process.exit(1)
  }
}
InitilizeDBAndServer()

// API-1 GET ALL PLAYERS

app.get('/players/', async (request, response) => {
  const getAllPlayers = `
        SELECT
         *
        FROM
        cricket_team
        ORDER BY
        player_id;`
  const playersArr = await db.all(getAllPlayers)
  response.send(playersArr)
})

// API-2 CREATE NEW PLAYER ID

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addPlayer = `
      INSERT INTO
      cricket_team (player_name,jersey_number,role)
      VALUES
      ( '${playerName}',
         ${jerseyNumber},
         '${role}');`
  const dbResponse = await db.run(addPlayer)
  //const playerId = dbResponse.lastID
  response.send('Player Added to Team')
})

// GET ANY ONE PLAYER ID

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetaile = `
       SELECT
         *
      FROM
      cricket_team
      WHERE
      player_id = ${playerId};`
  const player = await db.get(playerDetaile)
  response.send(player)
})

// UPDATE A PLAYER DETAILS

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayer = `
       UPDATE
        cricket_team
       SET 
       player_name = '${playerName}',
       jersey_number =  ${jerseyNumber},
        role =  '${role}';
        WHERE 
        player_id = ${playerId};`
  await db.run(updatePlayer)
  response.send('Player Details Updated')
})

// DELETE ONE PLAYER

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayer = `
      DELETE FROM
       cricket_team
       WHERE
       player_id = ${playerId};`
  await db.run(deletePlayer)
  response.send('Player Removed')
})

module.exports = app
