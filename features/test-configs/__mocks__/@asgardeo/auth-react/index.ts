/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AsgardeoSPAClient, DecodedIDTokenPayload } from "@asgardeo/auth-react";

const AsgardeoSPAClientMock: {
    getInstance: jest.Mock<AsgardeoSPAClient>
} = {
    getInstance: jest.fn().mockReturnValue({
        httpRequest: jest.fn(),
        httpRequestAll: jest.fn()
    })
};

const getDecodedIDToken: jest.Mock<Promise<DecodedIDTokenPayload | undefined>> = jest.fn().mockResolvedValue({
    aud: "",
    email: "",
    iss: "",
    preferred_username: "",
    sub: "",
    tenant_domain: ""
});

enum ResponseMode {
    formPost = "form_post",
    query = "query"
}

export {
    AsgardeoSPAClientMock as AsgardeoSPAClient,
    getDecodedIDToken,
    ResponseMode
};
