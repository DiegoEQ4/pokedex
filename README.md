<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# RECURSOS PARA QUE FUNCIONE EL PROYECTO 

## Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
npm install
```
3. Tener NestCLI instalado
```
npm i -g @nestjs/cli
```


4. Levantar la base de datos
```
docker-compose up -d
```

5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. Llenar las variables de entorno definidas en el __.env__

7. Ejecutar la aplicacion en dev:

```
npm run start:dev
```

8. Reconstruir base de datos con SEED 
```
http://localhost:3040/api/v2/seed/
```
 

## STACK USADO 
* Mongo 
* Nest



# PRODUCTION BUILD 

1. Crear el archivo __.env.prod__
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```