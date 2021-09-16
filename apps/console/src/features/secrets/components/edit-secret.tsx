/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FC, ReactElement } from "react";
import SecretDescriptionForm from "./secret-description-form";
import SecretValueForm from "./secret-value-form";
import { SecretModel } from "../models/secret";

/**
 * Props type interface of {@link EditSecret}
 */
export type EditSecretProps = {
    editingSecret: SecretModel;
} & IdentifiableComponentInterface;

/**
 * Don't get confused with the component {@link SecretEdit}. This component
 * is basically the inner component that actually does the editing. The
 * other one {@link SecretEdit} is just the page.
 *
 * @param props {EditSecretProps}
 * @constructor
 */
const EditSecret: FC<EditSecretProps> = (props: EditSecretProps): ReactElement => {

    const { editingSecret } = props;

    return (
        <EmphasizedSegment padded="very">
            <SecretValueForm editingSecret={ editingSecret } showInfoBanner/>
            <SecretDescriptionForm editingSecret={ editingSecret }/>
        </EmphasizedSegment>
    );

};

/**
 * Default props of {@link EditSecret}
 */
EditSecret.defaultProps = {
    "data-componentid": "edit-secret"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default EditSecret;
