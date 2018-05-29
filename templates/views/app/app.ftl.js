module.exports = `<#include "../common/macro.ftl">
<!DOCTYPE html>
<html lang="en">
<@headWrapper>
<title>@{app}</title>
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