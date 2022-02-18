---
sh: node '<%= cwd %>/_templates/generator/tanker/main.js' --dataPath '<%- process.argv[process.argv.indexOf('--dataPath') + 1] %>' 
---
