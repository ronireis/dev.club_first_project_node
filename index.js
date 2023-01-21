

// importando a biblioteca express 

/*
    - Query params => meusite.com/users?name=Roni&age=34   // FILTROS
    - Route params => /users/2    // Buscar, Deletar ou atualizar algo especifico
    - Request bory => {"name" : "Roni", "age":}

    - Get         =>  Busca informação no Backend
    - POST        =>  Cria informaçoes no Backend
-   - PUT / PATH  =>  Altera/Atualiza informaçoes no backend
    - DELETE      =>  Deleta informaçoes no backend

    - Middleware  =>  INTERCEPTAR => tem o poder de parar ou alterar dados da requisição

*/
const express = require(`express`) //  Importanto o (framework "express")
const port = 3000
const app = express()
app.use(express.json()) //esse modo é usado para que possa reconhecer em teste o json
const uuid = require(`uuid`)

const users = [] // em modelo de produção não pode ser usado uma variavel para "guardar objetos"

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({ error: "User not found"}) // nesse trexo, foi feito uma requisição se for -1 (não encontrada) vai aparecer um mensagem "User not found " e a barra 404
    }

    request.userIndex = index
    request.userId = id

    next()

}

// Buscando informaçoes usando (GET)
app.get(`/users`, (request, response) => {
    return response.json(users)
    
})

// Criando novas informaçoes para serem consumida (POST)
app.post(`/users`, (request, response) => {
    const {name, age} = request.body

    const user = {id: uuid.v4(), name, age}

    users.push(user)

    return response.status(201).json(users)
    
})

// Alterando ou atulizando alguma informação ja existente (PUT / PATH)
app.put(`/users/:id`, checkUserId, (request, response) => {
   
    const {name, age} = request.body
    const index = request.userIndex
    const id = request.userId

    const updataUser = {id, name, age}
    
    users[index] = updataUser

    return response.json(updataUser)
    
})

// Deletando informação usando (DELETE)
app.delete(`/users/:id`, checkUserId, (request, response) => {
    const { id } = request.params
    
    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    users.splice(index,1)

    return response.status(204).json()
    
})


app.listen(port, () =>{
    console.log(` o server esta em execução na porta ${port}`) 
})
