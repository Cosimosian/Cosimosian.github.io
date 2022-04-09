<%--
  Created by IntelliJ IDEA.
  User: hj
  Date: 2022/3/30
  Time: 16:33
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>这是我的第一个intelliJ IDEA&JSP&Tomcat项目</title>
  </head>
  <body>
    <div style="margin:200px 300px" backgroud-color="bfc">
      请输入小写字母：
      <input type="text" id="lower" style="height: 30px;width: 700px;margin: auto">
      <button id="btn" style="height: 30px;width: 55px">转换</button>
      <br>
      <br>
      生成的大写字母：
      <input type="text" id="upper" style="height: 30px;width: 700px;margin: auto">
    </div>
  </body>
  <script>
    window.onload=function(){
      var btn=document.getElementById("btn");
      btn.onclick=function () {
        var lower=document.getElementById("lower").value;
        var upper=document.getElementById("upper").value;
        var arr=new Array();

        if(!lower) {
          alert("请输入小写字母！");
        }else{
          for(var i=0;i<lower.length;i++){
            arr.push(lower[i].toUpperCase());
          }
          var s=arr.join("");
          //alert(s.toString());
          document.getElementById("upper").value=s.toString();
        }
      }
    }
  </script>
</html>
