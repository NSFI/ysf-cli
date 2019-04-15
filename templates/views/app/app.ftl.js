module.exports = `<#include "../common/macro.ftl">
<!DOCTYPE html>
<html lang="en">
<@headWrapper>
<title>{{PageName}}</title>
</@headWrapper>
<body>
<@bodyWrapper>
  <@setting >
  </@setting>
<div id="react-content"></div>
</@bodyWrapper>
</body>
</html>
`
