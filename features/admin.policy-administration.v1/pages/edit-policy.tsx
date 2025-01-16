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
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import { AppConstants, history } from "@wso2is/admin.core.v1";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import lowerCase from "lodash-es/lowerCase";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import "./edit-policy.scss";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { updatePolicy } from "../api/entitlement-policies";
import { useGetPolicy } from "../api/useGetPolicy";
import startCase from "lodash-es/startCase";
import PolicyEditor from "../components/policy-editor/policy-editor";
import { PolicyInterface } from "../models/policies";



type EditPolicyPageProps = IdentifiableComponentInterface & RouteComponentProps;

/**
 * Component for editing a policy.
 *
 * @param props - Props injected to the component.
 * @returns Policy edit page component.
 */
const EditPolicyPage: FunctionComponent<EditPolicyPageProps> = ({
    match,
    ["data-componentid"]: componentId = "policy-edit-page"
}: EditPolicyPageProps & RouteComponentProps): ReactElement => {
    const policyId: string = match.params["id"];
    const dispatch: Dispatch = useDispatch();

    const shouldFetchPolicy: boolean = !isEmpty(policyId);
    const [ updatedPolicyScript, setUpdatedPolicyScript ] = useState<string | undefined>();

    /**
     * Converts kebab-case to snake_case.
     *
     * @param kebab - Kebab case string.
     * @returns Snake case string.
     */
    const kebabToSnakeCase = (kebab: string): string => {
        return kebab.replace(/-/g, "_");
    };

    // Fetch the policy using the useGetPolicy hook
    const { data: policy, isLoading, error } = useGetPolicy(
        kebabToSnakeCase(policyId || ""),
        shouldFetchPolicy
    );

    const { t } = useTranslation();

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("POLICY_ADMINISTRATION"));
    };


    const handleUpdateButtonClick = (): void => {
        if (!policy) {
            return;
        }

        const updatedPolicy: Partial<PolicyInterface> = {
            active: policy.active,
            attributeDTOs: [],
            policy: updatedPolicyScript,
            policyEditorData: policy.policyEditorData,
            policyId: policy.policyId,
            policyIdReferences: policy.policyIdReferences,
            policyOrder: policy.policyOrder,
            policySetIdReferences: policy.policySetIdReferences,
            promote: policy.promote
        };

        updatePolicy(updatedPolicy)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("policyAdministration:editPolicy.notifications.updatePolicy." +
                            "success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("policyAdministration:editPolicy.notifications.updatePolicy.success.message")
                    })
                );

            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("policyAdministration:editPolicy.notifications.updatePolicy.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("policyAdministration:editPolicy.notifications.updatePolicy.error.message")
                    })
                );
            });
    };

    return (
        <PageLayout
            title={ startCase(lowerCase(policy?.policyId)) || t("policyAdministration:editPolicy.loadingTitle") }
            backButton={ {
                "data-componentid": `${componentId}-edit-policy-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("policyAdministration:editPolicy.backBtn")
            } }
            data-componentid={ componentId }
        >
            { /* Loading State */ }
            { isLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) }

            { /* Error State */ }
            { error && (
                <Alert severity="error" title={ t("policyAdministration:editPolicy.errorTitle") }>
                    { t("policyAdministration:editPolicy.errorDescription") }
                </Alert>
            ) }

            { /* Render Policy Script Editor only if policy data is available */ }
            { !isLoading && !error && policy && (
                <Box className="script-editor">
                    <PolicyEditor
                        policyScript ={ policy.policy }
                        data-componentid={ `${componentId}-policy-editor` }
                        onScriptChange={ (updatedScript: string) => setUpdatedPolicyScript(updatedScript) }
                    />
                </Box>
            ) }

            { /* Update Button: Show only if policy data is available */ }
            { !isLoading && !error && policy && (
                <Button
                    className="edit-policy-btn"
                    color="primary"
                    variant="contained"
                    onClick={ handleUpdateButtonClick }>
                    { t("common:update") }
                </Button>
            ) }
        </PageLayout>
    );
};

export default EditPolicyPage;
