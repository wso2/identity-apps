<%--
  ~ Copyright (c) 2023, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~  http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%
    String castleFraudDetectionEnabled = application.getInitParameter("castle_fraud_detection_enabled");
    String castlePublicKey = application.getInitParameter("castle_fraud_detection_public_key");
%>

<script src="./libs/castle.browser.js"></script>
<script text="text/javascript">
    
    var CastleFruadIntegration = /** @class */ ( function () {

    function CastleFruadIntegration() {

        this.castle_fraud_detection_enabled = false;
        this.castle_fraud_detection_public_key;
        this.castle_fraud_detection_token;
    }

    /**
     * Returns an instance of the Castle Fruad Integration class.
     *
     * @returns {CastleFruadIntegration}
    */
    CastleFruadIntegration.getInstance = function () {

        if (!this.castleFruadIntegrationInstance) {
            this.castleFruadIntegrationInstance = new CastleFruadIntegration();
        }

        return this.castleFruadIntegrationInstance;
    };

    /**
     * Set the Castle request token.
     * 
     * @param {boolean} castle_fraud_detection_enabled - Whether Castle Fruad Integration is enabled.
     *
    */
    CastleFruadIntegration.prototype.setCastleRequestToken = function (castle_fraud_detection_enabled, castle_fraud_detection_public_key) {

        this.castle_fraud_detection_enabled = castle_fraud_detection_enabled;
        this.castle_fraud_detection_public_key = castle_fraud_detection_public_key;

        if (this.castle_fraud_detection_enabled) {
            var castle = Castle.configure({ pk: this.castle_fraud_detection_public_key });
            castle.createRequestToken().then((requestToken) => {
                document.getElementById("castleRequestToken").value = requestToken;
            });
        }
    };

    return CastleFruadIntegration;

}());   
</script>

<script>
    var castle_fraud_detection_enabled = "<%=castleFraudDetectionEnabled%>";
    var castle_fraud_detection_public_key = "<%=castlePublicKey%>";
    var castleFruadIntegration = CastleFruadIntegration.getInstance();
    castleFruadIntegration.setCastleRequestToken(castle_fraud_detection_enabled, castle_fraud_detection_public_key);
</script>
