---
to: src/codgen/<%= destination %>.ts
force: true
---
<% 
const imagesThree = JSON.parse(data);
const images2 = JSON.parse(images);
-%>
/* eslint-disable */
<% images2.forEach(imageInfo => { -%>
import <%= 
'image_' + imageInfo.id.replace(':', '_') 
%> from '<%=
// './images/' + imageInfo.path.join('/') + '.' + imageInfo.ext
'./images/' + imageInfo.fsPath.join('/') + '.' + imageInfo.ext
%>';
<% }) %>
<%# Делает из обычного JSON объект, листья которого ссылаются на переменные выше -%>
const <%= destination %> = <%- JSON.stringify(imagesThree).replace(/\"(image_.*?)\"/gm, '$1') %>;
export default <%= destination %>;
