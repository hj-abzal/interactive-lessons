---
to: src/codgen/tanker/ru/<%= destination %>.json
force: true
---
<%
const tree = JSON.parse(data)
-%>
<%- JSON.stringify(tree, null, 2) %>