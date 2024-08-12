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

import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import {
    CircleCheckFilledIcon,
    KeyFlowIcon,
    PadlockAsteriskFlowIcon,
    ProfileFlowIcon,
    UserFlowIcon
} from "@oxygen-ui/react-icons";
import { AppConstants, AppState, history } from "@wso2is/admin.core.v1";
import FeatureStatusLabel from "@wso2is/admin.extensions.v1/components/feature-gate/models/feature-gate";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, GenericIcon, PageLayout, ResourceGrid, useDocumentation } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    useEffect,
    useMemo
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import useGetActionTypes from "../api/use-get-action-types";
import { ActionsConstants } from "../constants/actions-constants";
import { ActionType, ActionTypeCardInterface, ActionTypesCountInterface } from "../models/actions";
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

    const actionsFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state.config.ui.features?.actions);

    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const dispatch: Dispatch = useDispatch();

    const {
        data: actionTypesConfigs,
        isLoading: isActionTypesConfigsLoading,
        error: actionTypesConfigsRetrievalError
    } = useGetActionTypes();

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
        if (isActionTypesConfigsLoading || !actionTypesConfigsRetrievalError) {
            return;
        }

        if (actionTypesConfigsRetrievalError.response?.data?.description) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("actions:notification.error.typesFetch.description",
                        { description: actionTypesConfigsRetrievalError.response.data.description }
                    ),
                    level: AlertLevels.ERROR,
                    message: t("actions:notification.error.typesFetch.message")
                })
            );
        } else {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("actions:notification.genericError.typesFetch.description"),
                    level: AlertLevels.ERROR,
                    message: t("actions:notification.genericError.typesFetch.message")
                })
            );
        }
    }, [ isActionTypesConfigsLoading, actionTypesConfigsRetrievalError ]);

    const checkFeatureEnabledStatus = (actionType: string): boolean => {

        switch (actionType) {
            case ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_URL_PATH:
                return isFeatureEnabled(actionsFeatureConfig, "actions.filterPreIssueAccessToken");
            case ActionsConstants.PRE_UPDATE_PASSWORD_URL_PATH:
                return isFeatureEnabled(actionsFeatureConfig, "actions.filterPreUpdatePassword");
            case ActionsConstants.PRE_UPDATE_PROFILE_URL_PATH:
                return isFeatureEnabled(actionsFeatureConfig, "actions.filterPreUpdateProfile");
            case ActionsConstants.PRE_REGISTRATION_URL_PATH:
                return isFeatureEnabled(actionsFeatureConfig, "actions.filterPreRegistration");
            default:
                return false;
        }
    };

    const resolveActionDescription = (): ReactNode => (
        <>
            { t("pages:actions.subTitle") }
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

    const resolveFeatureLabelClass = (featureStatus: FeatureStatusLabel): string => {
        switch (featureStatus) {
            case FeatureStatusLabel.BETA:
                return "oxygen-chip-beta";
            case FeatureStatusLabel.COMING_SOON:
                return "oxygen-chip-coming-soon";
        }
    };

    const renderActionConfiguredStatus = (actionType: string): ReactElement => {
        let count: number = 0;

        switch (actionType) {
            case ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_URL_PATH:
                count = typeCounts?.preIssueAccessToken;

                break;
            case ActionsConstants.PRE_UPDATE_PASSWORD_URL_PATH:
                count = typeCounts?.preUpdatePassword;

                break;
            case ActionsConstants.PRE_UPDATE_PROFILE_URL_PATH:
                count = typeCounts?.preUpdateProfile;

                break;
            case ActionsConstants.PRE_REGISTRATION_URL_PATH:
                count = typeCounts?.preRegistration;

                break;
            default:
                break;
        }

        if (count > 0) {
            return (
                <div className="status-tag">
                    <CircleCheckFilledIcon className="icon-configured"/>
                    <Typography  className="text-configured" variant="h6">
                        { t("actions:status.configured") }
                    </Typography>
                </div>
            );
        } else {
            return (
                <div className="status-tag">
                    <Typography  className="text-not-configured" variant="h6">
                        {  t("actions:status.notConfigured") }
                    </Typography>
                </div>
            );
        }
    };

    const actionTypesCardsInfo = (): ActionTypeCardInterface[] => {
        return [
            {
                description: t("actions:types.preIssueAccessToken.description.shortened"),
                disabled: false,
                featureStatusLabel: FeatureStatusLabel.BETA,
                heading: t("actions:types.preIssueAccessToken.heading"),
                icon: <KeyFlowIcon size="small" className="icon"/>,
                identifier: ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_URL_PATH,
                route: AppConstants.getPaths().get("PRE_ISSUE_ACCESS_TOKEN_EDIT")
            },
            {
                description: t("actions:types.preUpdatePassword.description.shortened"),
                disabled: true,
                featureStatusLabel: FeatureStatusLabel.COMING_SOON,
                heading: t("actions:types.preUpdatePassword.heading"),
                icon: <PadlockAsteriskFlowIcon size="small" className="icon"/>,
                identifier: ActionsConstants.PRE_UPDATE_PASSWORD_URL_PATH,
                route: AppConstants.getPaths().get("PRE_UPDATE_PASSWORD_EDIT")
            },
            {
                description: t("actions:types.preUpdateProfile.description.shortened"),
                disabled: true,
                featureStatusLabel: FeatureStatusLabel.COMING_SOON,
                heading: t("actions:types.preUpdateProfile.heading"),
                icon: <ProfileFlowIcon size="small" className="icon"/>,
                identifier: ActionsConstants.PRE_UPDATE_PROFILE_URL_PATH,
                route: AppConstants.getPaths().get("PRE_UPDATE_PROFILE_EDIT")
            },
            {
                description: t("actions:types.preRegistration.description.shortened"),
                disabled: true,
                featureStatusLabel: FeatureStatusLabel.COMING_SOON,
                heading: t("actions:types.preRegistration.heading"),
                icon: <UserFlowIcon size="small" className="icon"/>,
                identifier: ActionsConstants.PRE_REGISTRATION_URL_PATH,
                route: AppConstants.getPaths().get("PRE_REGISTRATION_EDIT")
            } ];
    };

    return (
        <PageLayout
            pageTitle={ t("pages:actions.title") }
            title={ t("pages:actions.title") }
            description={ resolveActionDescription() }
            data-componentid={ `${ _componentId }-page-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
        >
            <ResourceGrid
                isLoading={ isActionTypesConfigsLoading }
                isEmpty={
                    (!actionTypesConfigs
                        || !Array.isArray(actionTypesConfigs)
                        || actionTypesConfigs.length <= 0)
                }
                data-componentid={ `${ _componentId }-resource-grid` }
            >
                <Grid
                    container
                    spacing={ { md: 3, xs: 2 } }
                    className="actions-page"
                >
                    { actionTypesCardsInfo().map((cardProps: ActionTypeCardInterface) => {
                        return checkFeatureEnabledStatus(cardProps.identifier) && (
                            <Grid
                                xs={ 12 }
                                sm={ 6 }
                                md={ 4 }
                                lg={ 4 }
                            >
                                <Card
                                    key={ cardProps.identifier }
                                    className={ cardProps.disabled ? "action-card disabled" : "action-card" }
                                    data-componentid={ `${ cardProps.identifier }-action-type-card` }
                                    onClick={ () => history.push(cardProps.route) }
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
                                                        backgroundColorRandomizer={ cardProps.identifier }
                                                        className="action-type-icon-container"
                                                    >
                                                        { cardProps.icon }
                                                    </Avatar>
                                                ) }
                                                inline
                                                transparent
                                                shape="square"
                                            />
                                        </div>
                                        <div>
                                            <Typography variant="h6">
                                                { cardProps.heading }
                                            </Typography>
                                            { !cardProps.disabled ?
                                                renderActionConfiguredStatus(cardProps.identifier) : null }
                                        </div>
                                        <div
                                            className={ "ribbon " +
                                                        resolveFeatureLabelClass(cardProps.featureStatusLabel) }
                                        >
                                            <span className="MuiChip-label">
                                                { t(cardProps.featureStatusLabel) }
                                            </span>
                                        </div>
                                    </CardContent>
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            {  cardProps.description }
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    }) }
                </Grid>
            </ResourceGrid>
        </PageLayout>
    );
};

export default ActionTypesListingPage;
