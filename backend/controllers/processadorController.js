const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const XLSX = require('xlsx');
const fs = require('fs');
const userModel = require('../models/userModel');

const app = express();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Permitindo acesso do seu front-end
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Headers permitidos
    res.setHeader('Access-Control-Allow-Credentials', true); // Permitindo credenciais (cookies, por exemplo)
    next();
});

const httpServer = http.createServer(app);
// Configurando o middleware CORS diretamente no Socket.IO
const io = socketIO(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

let isProcessing = false; 
let stopProcessing = false;  

async function buildAnimeList(filePath, TypeDesc, SourceDesc, idUser, socket) {
    console.log("Montando a lista de anime");
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    var totalRows = await  userModel.countAnimeByUserId(idUser);
     for (let row = 2; ; row++) {
        // verifica se o processamento deve dar um stop
        if (stopProcessing) {
            console.log('Processamento interrompido.');
            stopProcessing = false; // Resetar a variável para false
            socket.clear
            break;
        }

        const genderCell = worksheet['A' + row];
        if (!genderCell || !genderCell.v) break;
        const gender = genderCell.v;
        const title = worksheet['B' + row].v;
        const type = worksheet['C' + row].v;
        const source = worksheet['D' + row].v;
 
        if (type === TypeDesc && source === SourceDesc) {
   
            let res = await userModel.insertAnime(gender, title, type, source, idUser);
            // manda pro front o numero da row, que seria o numero em que está o processamento
            if(res){
                totalRows++;
                socket.emit('processing', { totalRows });
             }
         
            await new Promise(resolve => setTimeout(resolve, 350));

            // da um timing p continuar por conta da att no navegador 
        }
    }

    // Emitir o evento 'finishedProcessing' quando o processamento estiver completo
    socket.emit('finishedProcessing');
}

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id); 

    socket.on('startProcessing', async ({ idUser, TypeDesc, SourceDesc }) => {
        // Verificar se já está em processo de processamento 
            isProcessing = true;
            const path = "/app/Data/finalAnime.xlsx";
            const animes = buildAnimeList(path, TypeDesc, SourceDesc, idUser, socket);
        
    });

    socket.on('stopProcessing', () => {
        if (isProcessing) {
            stopProcessing = true; // Sinalizar para interromper o processamento
        } else {
            console.log('Nenhum processo em execução.');
        }
    });

    socket.on('startPlanProcess', ({ idUser }) => { 
        console.log("idUser " + idUser)
         setInterval(async () => {
            try {
                var animes = await getAnimesListUser(idUser);
              if (animes.length > 0) {
                    socket.emit('animesData', { animes });
                }
            } catch (error) {
                console.error('Erro ao buscar animes:', error);
            }
        }, 1000); 
    });
    
});

async function getAnimesListUser(idUser) {
      return animes= await  userModel.AnimeByUserId(idUser);
     
   
 
}

httpServer.listen(3002, () => {
    console.log('Servidor socket.io ouvindo na porta 3002');
});
