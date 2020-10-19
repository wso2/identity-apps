/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

module.exports = {
    globals: {
        APP_BASENAME: "myaccount",
        APP_HOME_PATH: "/overview",
        APP_LOGIN_PATH: "/login",
        CLIENT_HOST_DEFAULT: "https://localhost:9000",
        CLIENT_ID_DEFAULT: "USER_PORTAL",
        LOGIN_CALLBACK_URL: "https://localhost:9000/myaccount/login",
        SERVER_HOST_DEFAULT: "https://localhost:9443"
    },
    moduleNameMapper: {
        "\\.(css|less)$": "<rootDir>/test-configs/style-mock.js",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/test-configs/file-mock.js"
    },
    setupFilesAfterEnv: ["<rootDir>/test-configs/setup-test.ts"],
    transform: {
        "^.+\\.js$": "babel-jest",
        "^.+\\.jsx$": "babel-jest",
        "^.+\\.ts$": "ts-jest",
        "^.+\\.tsx$": "ts-jest"
    }
};
