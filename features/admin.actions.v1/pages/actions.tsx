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

import CardContent from "@mui/material/CardContent";
import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import Typography from "@oxygen-ui/react/Typography";
import { CircleCheckFilledIcon, PadlockAsteriskIcon, UserPlusIcon } from "@oxygen-ui/react-icons";
import { AppConstants, history } from "@wso2is/admin.core.v1";
import FeatureStatusLabel from "@wso2is/admin.extensions.v1/components/feature-gate/models/feature-gate";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, GenericIcon, PageLayout, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, ReactNode, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Ref } from "semantic-ui-react";
import { useActionTypesDetails } from "../api/actions";
import { ActionsConstants } from "../constants";
import { ActionType, ActionTypesCountInterface } from "../models";
import "./actions.scss";

/**
 * Props for the Server Configurations page.
 */
type ActionTypesListingPageInterface = IdentifiableComponentInterface;

/**
 * Action Types listing page.
 *
 * @param props - Props injected to the component.
 * @returns Action Types listing page component.
 */
export const ActionTypesListingPage: FunctionComponent<ActionTypesListingPageInterface> = ({
    "data-componentid": _componentId = "action-types-listing-page"
}: ActionTypesListingPageInterface): ReactElement => {

    const pageContextRef: MutableRefObject<any> = useRef(null);
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const dispatch: Dispatch = useDispatch();

    const {
        data: actionTypesConfigs,
        isLoading: isActionTypesConfigsLoading,
        error: actionTypesConfigsRetrievalError
    } = useActionTypesDetails();

    const typeCounts: ActionTypesCountInterface = useMemo(() => {
        const actionTypeCounts: ActionTypesCountInterface = {};

        if (actionTypesConfigs) {
            for (const actionType of actionTypesConfigs) {
                switch (actionType.type) {
                    case ActionType.PRE_ISSUE_ACCESS_TOKEN:
                        actionTypeCounts.preIssueAccessToken = actionType.count;

                        break;
                    case ActionType.PRE_UPDATE_PASSWORD:
                        actionTypeCounts.preUpdatePassword = actionType.count;

                        break;
                    case ActionType.PRE_UPDATE_PROFILE:
                        actionTypeCounts.preUpdateProfile = actionType.count;

                        break;
                    case ActionType.PRE_REGISTRATION:
                        actionTypeCounts.preRegistration = actionType.count;

                        break;
                    default:
                        break;
                }
            }

            return actionTypeCounts;
        }
    }, [ actionTypesConfigs ]);

    /**
     * The following useEffect is used to handle if any error occurs while fetching the Action Types.
     */
    useEffect(() => {
        if (actionTypesConfigsRetrievalError && !isActionTypesConfigsLoading) {
            if (actionTypesConfigsRetrievalError.response && actionTypesConfigsRetrievalError.response.data
                && actionTypesConfigsRetrievalError.response.data.description) {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("console:manage.features.actions.notification.error.typesFetch.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.actions.notification.error.typesFetch.message")
                    })
                );
            } else {
                // Generic error message
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("console:manage.features.actions.notification.genericError" +
                            ".typesFetch.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.actions.notification.genericError.typesFetch.message")
                    })
                );
            }
        }
    }, [ ]);

    const resolveActionDescription = (): ReactNode => {

        return (
            <>
                { t("console:manage.features.actions.description") }
                <DocumentationLink
                    link={
                        getLink("develop.actions.learnMore")
                    }
                    showEmptyLink={ false }
                >
                    { t("common:learnMore") }
                </DocumentationLink>
            </>
        );
    };

    const resolveFeatureLabelClass = (featureStatus: FeatureStatusLabel) => {
        switch (featureStatus) {
            case FeatureStatusLabel.BETA:
                return "oxygen-chip-beta";
            case FeatureStatusLabel.COMING_SOON:
                return "oxygen-chip-coming-soon";
        }
    };

    const resolveConfiguredLabel = (actionType: string) => {

        let count: number = 0;

        switch (actionType) {
            case ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_TYPE:
                count = typeCounts?.preIssueAccessToken;

                break;
            case ActionsConstants.PRE_UPDATE_PASSWORD_TYPE:
                count = typeCounts?.preUpdatePassword;

                break;
            case ActionsConstants.PRE_UPDATE_PROFILE_TYPE:
                count = typeCounts?.preUpdateProfile;

                break;
            case ActionsConstants.PRE_REGISTRATION_TYPE:
                count = typeCounts?.preRegistration;

                break;
            default:
                break;
        }

        return (
            count > 0 ? (
                <div className="status-tag">
                    <CircleCheckFilledIcon className="icon-configured"/>
                    <Typography  className="text-configured" variant="h6">
                        { t("console:manage.features.actions.status.configured") }
                    </Typography>
                </div>
            ):(
                <div className="status-tag">
                    <Typography  className="text-not-configured" variant="h6">
                        {  t("console:manage.features.actions.status.notConfigured") }
                    </Typography>
                </div>
            )
        );
    };

    return (
        <PageLayout
            pageTitle={ t("console:manage.features.actions.title") }
            title={ t("console:manage.features.actions.title") }
            description={ resolveActionDescription() }
            data-componentid={ `${ _componentId }-page-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
        >
            <Ref innerRef={ pageContextRef }>
                <div className="action-types-grid-wrapper">
                    <div className="action-types-list-grid">
                        <Card
                            key="pre-issue-access-token"
                            className="action-type"
                            data-componentid="pre-issue-access-token-section"
                            onClick={ () => history.push(AppConstants.getPaths().get("PRE_ISSUE_ACCESS_TOKEN_EDIT")) }
                        >
                            <CardContent
                                className="action-type-header">
                                <div>
                                    <GenericIcon
                                        size="micro"
                                        icon={ (
                                            <Avatar
                                                variant="square"
                                                randomBackgroundColor
                                                backgroundColorRandomizer="pre-issue-access-token"
                                                className="action-type-icon-container"
                                            >
                                                <PadlockAsteriskIcon size="small" className="icon" />
                                            </Avatar>
                                        ) }
                                        inline
                                        transparent
                                        shape="square"
                                    />
                                </div>
                                <div>
                                    <Typography variant="h6">
                                        { t("console:manage.features.actions.types.preIssueAccessToken.heading") }
                                    </Typography>
                                    { resolveConfiguredLabel(ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_TYPE) }
                                </div>
                                <div
                                    className={ "ribbon " + resolveFeatureLabelClass(FeatureStatusLabel.BETA) }
                                >
                                    <span className="MuiChip-label">
                                        { t(FeatureStatusLabel.BETA) }
                                    </span>
                                </div>
                            </CardContent>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {  t("console:manage.features.actions.types.preIssueAccessToken" +
                                        ".description.shortened") }
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            key="pre-update-password"
                            data-componentid="pre-update-password-section"
                            className="action-type"
                            onClick={ () => history.push(AppConstants.getPaths().get("PRE_UPDATE_PASSWORD_EDIT")) }
                        >
                            <CardContent
                                className="action-type-header">
                                <GenericIcon
                                    size="micro"
                                    icon={ (
                                        <Avatar
                                            variant="square"
                                            randomBackgroundColor
                                            backgroundColorRandomizer="pre-update-password"
                                            className="action-type-icon-container"
                                        >
                                            <UserPlusIcon className="icon" />
                                        </Avatar>
                                    ) }
                                    inline
                                    transparent
                                    shape="square"
                                />
                                <div>
                                    <Typography variant="h6">
                                        { t("console:manage.features.actions.types.preUpdatePassword.heading") }
                                    </Typography>
                                </div>
                                <div
                                    className={ "ribbon " + resolveFeatureLabelClass(FeatureStatusLabel.COMING_SOON) }
                                >
                                    <span className="MuiChip-label">
                                        { t(FeatureStatusLabel.COMING_SOON) }
                                    </span>
                                </div>
                            </CardContent>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    { t("console:manage.features.actions.types.preUpdatePassword." +
                                        "description.shortened") }
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            key="pre-update-profile"
                            data-componentid="pre-update-profile-section"
                            className="action-type"
                            onClick={ () => history.push(AppConstants.getPaths().get("PRE_UPDATE_PROFILE_EDIT")) }
                        >
                            <CardContent
                                className="action-type-header">
                                <GenericIcon
                                    size="micro"
                                    icon={ (
                                        <Avatar
                                            variant="square"
                                            randomBackgroundColor
                                            backgroundColorRandomizer="pre-update-profile"
                                            className="action-type-icon-container"
                                        >
                                            <UserPlusIcon className="icon" />
                                        </Avatar>
                                    ) }
                                    inline
                                    transparent
                                    shape="square"
                                />
                                <div>
                                    <Typography variant="h6">
                                        { t("console:manage.features.actions.types.preUpdateProfile.heading") }
                                    </Typography>
                                </div>
                                <div
                                    className={ "ribbon " + resolveFeatureLabelClass(FeatureStatusLabel.COMING_SOON) }
                                >
                                    <span className="MuiChip-label">
                                        { t(FeatureStatusLabel.COMING_SOON) }
                                    </span>
                                </div>
                            </CardContent>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    { t("console:manage.features.actions.types.preUpdateProfile." +
                                        "description.shortened") }
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            key="pre-registration"
                            data-componentid="pre-registration-section"
                            className="action-type"
                            onClick={ () => history.push(AppConstants.getPaths().get("PRE_REGISTRATION_EDIT")) }
                        >
                            <CardContent
                                className="action-type-header">
                                <GenericIcon
                                    size="micro"
                                    icon={ (
                                        <Avatar
                                            variant="square"
                                            randomBackgroundColor
                                            backgroundColorRandomizer="pre-registration"
                                            className="action-type-icon-container"
                                        >
                                            <UserPlusIcon className="icon" />
                                        </Avatar>
                                    ) }
                                    inline
                                    transparent
                                    shape="square"
                                />
                                <div>
                                    <Typography variant="h6">
                                        { t("console:manage.features.actions.types.preRegistration.heading") }
                                    </Typography>
                                </div>
                                <div
                                    className={ "ribbon " + resolveFeatureLabelClass(FeatureStatusLabel.COMING_SOON) }
                                >
                                    <span className="MuiChip-label">
                                        { t(FeatureStatusLabel.COMING_SOON) }
                                    </span>
                                </div>
                            </CardContent>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    { t("console:manage.features.actions.types.preRegistration." +
                                        "description.shortened") }
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Ref>
        </PageLayout>
    );
};

export default ActionTypesListingPage;
