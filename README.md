# Miguelito_Eventos

# Integrantes
- Federico Greco
- Rocío Penalva
- Ignacio Comin

# Aclaración sobre Contributors del repositorio
Entre los contributors se encuentran otros usuario de github debido a que por accidente no configuramos correctamente las computadoras del colegio y al hacer push se hicieron varios con los usuarios que estaban configurados en esa computadora.

# Compilar y correr el proyecto

## Servidor
Para compilar y correr el servidor:
```bash
cd ./backend
npm install
npm run db:migrate
npm run dev
``` 

## Cliente web
Para compilar y correr el cliente web:
```bash
cd ./frontend
npm install
npm run build
npm run dev
``` 
Y el cliente debería estar corriendo en la dirección http://localhost:3000

## Tests
Una vez configurados (Observaciones) basta con correr el siguiente comando dentro de la carpeta "backend":
```bash
npm run test
``` 

# Observaciones
## Tests
Los tests quedaron configurados para utilizar la db principal del proyecto, por lo que al ser utilizados tendrán efecto directo en esto, y deben ser correctamente configurados para que pasen. Para acceder a los datos dentro de la db (e.g. ids) se puede utilizar la extención de vscode "SQLite" (luego de instalarla con ctrl + shift + p se selcciona la opción "SQLite: Open Database", se selecciona la db, y aparecerá en el explorer de archivos (abajo a la izquierda). ahí se elige la tabla que se quiere revisar, click derecho y "Show table") o se puede user un explorador de sqlite databases en la web.
A continuación se deja las configuraciones exactas para cada test:
### Crear evento
En este test es necesario poner el id de un usuario existente en la db en el token, donde está debidamente comentado.

### Registrar usuario
En este test es neceario utilizar un username y un email que no existan en la db (en ambos tests), las tres lineas están debidamente comentadas para encontrarlas

### Unirse a un evento
Para este test es necesario poner un id de usuario existente (que no sea el creador del evento utilizado) en el token y el id de un evento que ya exista, y luego en los expect completar con ambos mismos datos en las lineas debidamente comentadas.

### Cancelar reservas
Nuevamente se debe poner el id de un usuario en el token y el id de un evento existente, al que el usuario utilizado se haya unido.

## Error pagina evento
Como fue comentado en clase, en algunos casos al abrir la página de un evento salta un error de que no se encontró el evento y se lleva a la página pertinente, pero para arreglar esto es tan simple como recargar la página y se debería solucionar y encontrar el evento y cargar la página.

## Issues de Next
Durante el uso del cliente web puede que el logo de next (que se ve abajo a la izquierda) se ponga rojo. Esto debería ignorarse salvo que realmente salte un error que no permita la ejecución del cliente, ya que existen casos en los que next detecta cosas "ilegales" pero que están manejadas en el frontend, por lo que no debería ser un problema (por ejemplo, al comprar entradas si el campo de cantidad se deja vacío next dirá que NaN no es válido, pero si se intenat comprar sin completarlo no se podrá).
