/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import ScriptEditorPanel
    from "@wso2is/admin.authentication-flow-builder.v1/components/script-editor-panel/script-editor-panel";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import "./edit-policy.scss";
import {AppConstants, history} from "@wso2is/admin.core.v1";



type EditPolicyPageProps = IdentifiableComponentInterface;

/**
 * Component for editing a policy.
 *
 * @param props - Props injected to the component.
 * @returns Policy edit page component.
 */

const EditPolicyPage: FunctionComponent<EditPolicyPageProps> = ({
    ["data-componentid"]: componentId = "policy-edit-page"
}: EditPolicyPageProps): ReactElement => {

    const { t } = useTranslation();

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("POLICY_ADMINISTRATION"));
    };


    return (
        <PageLayout
            title={ "Provisioning User Claim Based Policy" }
            backButton={ {
                "data-componentid": `${ componentId }-edit-policy-page-back-button`,
                onClick: () => handleBackButtonClick(),
                text: t("policyAdministration:editPolicy.backBtn")
            } }
            data-componentid={ componentId }
        >
            <Box className="script-editor">
                <ScriptEditorPanel language="xml" hideText={ true } />
            </Box>
            <Button className="edit-policy-btn" color="primary" variant="contained">{ t("common:update") }</Button>
        </PageLayout>
    );
};

export default EditPolicyPage;
