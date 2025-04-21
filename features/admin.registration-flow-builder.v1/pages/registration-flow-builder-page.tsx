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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Link from "@oxygen-ui/react/Link";
import { ArrowUpRightFromSquareIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import FlowBuilderHeader from "@wso2is/admin.flow-builder-core.v1/components/builder-layout/flow-builder-header";
import FlowBuilderLayout from "@wso2is/admin.flow-builder-core.v1/components/builder-layout/flow-builder-layout";
import useUserPreferences from "@wso2is/common.ui.v1/hooks/use-user-preferences";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import RegistrationFlowBuilder from "../components/registration-flow-builder";
import RegistrationFlowBuilderConstants from "../constants/registration-flow-builder-constants";
import useRegistrationFlowBuilder from "../hooks/use-registration-flow-builder";
import RegistrationFlowBuilderProvider from "../providers/registration-flow-builder-provider";

/**
 * Props interface of {@link RegistrationFlowBuilderPage}
 */
export type RegistrationFlowBuilderPageProps = IdentifiableComponentInterface;

/**
 * Landing page for the Registration Flow Builder.
 *
 * @param props - Props injected to the component.
 * @returns RegistrationFlowBuilderPage component.
 */
const RegistrationFlowBuilderPage: FunctionComponent<RegistrationFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId = "registration-flow-builder-page"
}: RegistrationFlowBuilderPageProps): ReactElement => {
    const { setPreferences, leftNavbarCollapsed } = useUserPreferences();

    /**
     * If the user doesn't have a `leftNavbarCollapsed` preference saved, collapse the navbar for better UX.
     * @remarks Since the builder needs more real estate, it's better to have the navbar collapsed.
     */
    useEffect(() => {
        if (leftNavbarCollapsed === undefined) {
            setPreferences({ leftNavbarCollapsed: true });
        }
    }, [ leftNavbarCollapsed, setPreferences ]);

    return (
        <RegistrationFlowBuilderProvider>
            <RegistrationFlowBuilderLayout data-componentid={ componentId } />
        </RegistrationFlowBuilderProvider>
    );
};

/**
 * Page layout for the Registration Flow Builder.
 *
 * @param props - Props injected to the component.
 * @returns RegistrationFlowBuilderLayout component.
 */
const RegistrationFlowBuilderLayout: FunctionComponent<RegistrationFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId = "registration-flow-builder-page-layout"
}: RegistrationFlowBuilderPageProps): ReactElement => {
    const { t } = useTranslation();
    const { isPublishing, onPublish } = useRegistrationFlowBuilder();
    const registrationFlowBuilderFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state?.config?.ui?.features?.registrationFlowBuilder;
    });

    const showFlowPreviewApp: boolean = !registrationFlowBuilderFeatureConfig?.disabledFeatures?.includes(
        RegistrationFlowBuilderConstants.FEATURE_DICTIONARY.FLOW_PREVIEW_APP
    );

    return (
        <FlowBuilderLayout
            header={
                (<FlowBuilderHeader
                    goBackButton={ {
                        path: AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"),
                        tooltip: t("registrationFlow:builder.header.backButton.tooltip")
                    } }
                    breadcrumbs={ [
                        {
                            children: t("registrationFlow:builder.header.breadcrumbs.level1"),
                            onClick: () => history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"))
                        },
                        {
                            children: t("registrationFlow:builder.header.breadcrumbs.level2")
                        }
                    ] }
                    actions={
                        (<Box display="flex" gap={ 2 }>
                            { showFlowPreviewApp && (
                                <Link
                                    component="button"
                                    onClick={ () => {
                                        window.open("I'm a button.");
                                    } }
                                >
                                    Preview
                                    <ArrowUpRightFromSquareIcon />
                                </Link>
                            ) }
                            <Button variant="contained" onClick={ () => onPublish() } loading={ isPublishing }>
                                { t("registrationFlow:builder.header.actions.publish.text") }
                            </Button>
                        </Box>)
                    }
                />)
            }
            data-componentid={ componentId }
        >
            <RegistrationFlowBuilder />
        </FlowBuilderLayout>
    );
};

export default RegistrationFlowBuilderPage;
