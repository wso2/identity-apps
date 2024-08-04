/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { FeatureGateContextPropsInterface } from "../models/feature-gate";

const useCheckFeatureTags = (path: string): string[] => {
    const featureTagsPath: string = `${ path }.tags`;
    const features: FeatureGateContextPropsInterface = useContext(FeatureGateContext);

    return get(features?.features, featureTagsPath);
};

export default useCheckFeatureTags;
