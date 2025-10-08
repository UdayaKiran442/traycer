# To run the backend project

- Clone github repository using below command
```sh
git clone https://github.com/UdayaKiran442/traycer

cd traycer
```

- Go to the backend project folder
```sh
cd traycer-backend
```

- Install dependencies
```sh
bun install
```

- Add .env file at root of backend folder, fill the below details in .env file
```ts
OPENAI_API_KEY: string,
PINECONE_API_KEY: string,
DATABASE_URL: string // Add Neon db url here
```

- Run the project using
```sh
bun run dev
```

- Project will run in http://localhost:3000
