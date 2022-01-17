### Утилита для просмотра структуры директории

Собрать проект,

```sh
pnpm i
npm run build
```

в директории dist/stc

```
node index.js -d 5  ../../..
```

Опции:

| Ключ | Опция          | Описание                                     | Значение по умолчанию |
| ---- | -------------- | -------------------------------------------- | --------------------- |
| d    | depth          | Глубина просмотра структуры файловой системы | 2                     |
|      | root directory | Директория для просмотрв                     |                       |

![](doc/Peek%202022-01-17%2009-25.gif)