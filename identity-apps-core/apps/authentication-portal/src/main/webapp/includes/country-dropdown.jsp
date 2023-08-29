<%--
  ~ Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ page import="java.util.Locale" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.TreeMap" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%-- Localization --%>
<%@ include file="localize.jsp" %>

<%!
    /**
     * Retrieve all county codes and country display names and
     * store into a map where key/value pair is defined as the
     * country code/country display name.
     *
     * @return {Map<string, string>}
     */
    private Map<String, String> getCountryList() {
        String[] countryCodes = Locale.getISOCountries();

        Map<String, String> mapCountries = new TreeMap<>();

       for (String code : countryCodes) {
            Locale locale = new Locale("", code);
            String countryCode = locale.getCountry();
            String countryDisplayName = locale.getDisplayCountry();
            mapCountries.put(countryCode, countryDisplayName);
        }

        return mapCountries;
    }
%>

<div class="ui fluid search selection dropdown"  id="country-dropdown">
    <input type="hidden" required="${ param.required }"
    data-testid="request-claims-page-form-field-claim-${param.claim}-input"
    name="claim_mand_${param.claim}" id="claim_mand_${param.claim}">
    <i class="dropdown icon"></i>
    <div class="default text"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "select.country")%></div>
    <div class="menu">
        <c:forEach items="<%=getCountryList()%>" var="country">
            <div class="item" data-value="${country.value}">
                <i class="${country.key.toLowerCase()} flag"></i>${country.value}
            </div>
        </c:forEach>
    </div>
</div>

<script type="application/javascript">

    $(document).ready(function() {
        $("#country-dropdown").dropdown('hide');
    });

</script>
