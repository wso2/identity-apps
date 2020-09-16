<%
    String authCode = (String) session.getAttribute("authCode");
    String sessionState = (String) session.getAttribute("sessionState");

    if(authCode == null) {
        authCode = "";
    }

    if(sessionState == null) {
        sessionState = "";
    }

    out.print("{\"authCode\": \""+authCode+"\", \"sessionState\": \""+sessionState+"\"}");

    authCode = "";
    sessionState = "";
    session.setAttribute("authCode", "");
    session.setAttribute("sessionState", "");
%>
