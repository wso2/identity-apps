/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import get from "lodash-es/get";
import  {
    useContext
} from "react";
import FeatureGateContext from "../context/feature-gate-context";
import { FeatureGateContextPropsInterface, FeatureStatus } from "../models";

const useCheckFeatureStatus = (path: string): FeatureStatus => {
    const featureStatusPath: string = `${ path }.status`;
    const features: FeatureGateContextPropsInterface = useContext(FeatureGateContext);
    // obtain the status path and return the status.

    return get(features?.features, featureStatusPath);
};

export default useCheckFeatureStatus;
