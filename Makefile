npm-install: 
	@npm install | npm install three --legacy-peer-deps | npm install reactjs-popup --legacy-peer-deps

npm-run:
	@npm run dev

bun-install:
	@bun install

bun-run:
	@bun run dev