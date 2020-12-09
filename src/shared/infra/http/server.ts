import 'reflect-metadata'

import express, { Request, Response, NextFunction } from 'express' // funcionalidade dos ESmodules: todas as features mais recentes da linguagem
import 'express-async-errors'
// src/server.ts
import cors from 'cors'
import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'
import routes from './routes'

import '@shared/infra/typeorm'
import '@shared/container'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadsFolder))
app.use(routes)
// tratativa dos errors tem que ser depois das rotas. Middleware de tratamento de erros: 4 parametros
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  // console.error(err)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!')
})

// ts-dev-server: tsc + nodemon
// no script do ts-dev-server: -- transpile-only => nao tem responsabilidade
// checar se o código ta correto ou errado, se os tipos estão batendo: otimizar tempo.
//                            : --ignore-watch node_module => o proprio nome já diz.
