/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import PropTypes from "prop-types";
import React, { createContext } from "react";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ globalData, children }) => {

    return (
        <GlobalContext.Provider value={ { contextData: globalData } }>
            { children }
        </GlobalContext.Provider>
    );
};

GlobalContextProvider.propTypes = {
    children: PropTypes.any.isRequired,
    globalData: PropTypes.object.isRequired
};
