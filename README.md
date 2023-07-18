# osm-example

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## 사전준비 
1. 대한민국 지도파일 준비 (http://download.geofabrik.de/asia/south-korea-latest.osm.pbf)

2. 도커에 타일서버 설치 및 데이터 셋팅
   <br>ref: https://switch2osm.org/serving-tiles/using-a-docker-container/
   <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; https://hub.docker.com/r/overv/openstreetmap-tile-server/
   <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; https://github.com/Overv/openstreetmap-tile-server
```sh
//도커 볼륨 생성
docker volume create osm-data

// 내려받은 지도파일을 이용하여 타일서버 셋팅
docker run ^
	-v C:\osm\south-korea-latest.osm.pbf:/data/region.osm.pbf ^
	-v osm-data:/data/database/ ^
	overv/openstreetmap-tile-server ^
	import
```
컨테이너가 오류 없이 종료 되면 데이터 가져오기 성공!!<br>(소요시간 약 30~ 1시간)

3. 타일서버 구동
```shell
docker run ^
	-p 8282:80 ^
	-e THREADS=24 ^
	-v osm-data:/data/database/ ^
	-d overv/openstreetmap-tile-server ^
	run
```
타일서버 구동확인 http://localhsot:8282
(대한민국 지도 정보만 등록하였으므로 다른 국가는 표시안됨)
## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```
