---
sh: node '<%= cwd %>/_templates/generator/images/image-loader.js' --dataPath '<%- process.argv[process.argv.indexOf('--dataPath') + 1] %>' 
---
<%# Такие скачки по шаблонам сделаны для того чтобы у бека была одна точка входа HYGEN (да мне лень) %>