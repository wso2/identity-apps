/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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
import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Typography from "@oxygen-ui/react/Typography";
import {
    CircleCheckFilledIcon,
    KeyFlowIcon,
    PadlockAsteriskFlowIcon,
    ProfileFlowIcon,
    UserFlowIcon
} from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagLabel from "@wso2is/admin.feature-gate.v1/components/feature-flag-label";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    FeatureAccessConfigInterface,
    FeatureFlagsInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, GenericIcon, PageLayout, useDocumentation } from "@wso2is/react-components";
import classNames from "classnames";
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
import { Placeholder } from "semantic-ui-react";
import useGetActionTypes from "../api/use-get-action-types";
import { ActionsConstants } from "../constants/actions-constants";
import {
    ActionType,
    ActionTypeCardInterface,
    ActionTypesCountInterface,
    ActionTypesResponseInterface
} from "../models/actions";
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

    const { isSubOrganization } = useGetCurrentOrganizationType();
    const {
        data: actionTypesConfigs,
        isLoading: isActionTypesConfigsLoading,
        error: actionTypesConfigsRetrievalError
    } = useGetActionTypes();

    const isActionTypeDisabled = (actionType: string): boolean => {
        const prefix: string = isSubOrganization() ? "actions.types.org.list" : "actions.types.list";
        const featureKey: string = `${prefix}.${actionType}`;

        // Feature flag with COMING_SOON label is considered as a disabled action type.
        return actionsFeatureConfig?.featureFlags?.some((featureFlag: FeatureFlagsInterface) =>
            featureFlag.feature === featureKey && featureFlag.flag === ActionsConstants.ACTION_COMING_SOON_LABEL
        );
    };

    const getFeatureFlagStatus = (actionType: string): string => {
        const prefix: string = isSubOrganization() ? "actions.types.org.list" : "actions.types.list";

        return `${prefix}.${actionType}`;
    };

    const actionTypesCardsInfo: ActionTypeCardInterface[] = [
        {
            description: t("actions:types.preIssueAccessToken.description.shortened"),
            disabled: isActionTypeDisabled(ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_API_PATH),
            featureStatusKey: getFeatureFlagStatus(ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_API_PATH),
            heading: t("actions:types.preIssueAccessToken.heading"),
            icon: <KeyFlowIcon size="small" className="icon"/>,
            identifier: ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_URL_PATH,
            route: isActionTypeDisabled(ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_API_PATH) ? undefined :
                AppConstants.getPaths().get("PRE_ISSUE_ACCESS_TOKEN_EDIT"),
            type: ActionType.PRE_ISSUE_ACCESS_TOKEN
        },
        {
            description: t("actions:types.preUpdatePassword.description.shortened"),
            disabled: isActionTypeDisabled(ActionsConstants.PRE_UPDATE_PASSWORD_API_PATH),
            featureStatusKey: getFeatureFlagStatus(ActionsConstants.PRE_UPDATE_PASSWORD_API_PATH),
            heading: t("actions:types.preUpdatePassword.heading"),
            icon: <PadlockAsteriskFlowIcon size="small" className="icon"/>,
            identifier: ActionsConstants.PRE_UPDATE_PASSWORD_URL_PATH,
            route: isActionTypeDisabled(ActionsConstants.PRE_UPDATE_PASSWORD_API_PATH) ? undefined :
                AppConstants.getPaths().get("PRE_UPDATE_PASSWORD_EDIT"),
            type: ActionType.PRE_UPDATE_PASSWORD
        },
        {
            description: t("actions:types.preUpdateProfile.description.shortened"),
            disabled: isActionTypeDisabled(ActionsConstants.PRE_UPDATE_PROFILE_API_PATH),
            featureStatusKey: getFeatureFlagStatus(ActionsConstants.PRE_UPDATE_PROFILE_API_PATH),
            heading: t("actions:types.preUpdateProfile.heading"),
            icon: <ProfileFlowIcon size="small" className="icon"/>,
            identifier: ActionsConstants.PRE_UPDATE_PROFILE_URL_PATH,
            route: isActionTypeDisabled(ActionsConstants.PRE_UPDATE_PROFILE_API_PATH) ? undefined :
                AppConstants.getPaths().get("PRE_UPDATE_PROFILE_EDIT"),
            type: ActionType.PRE_UPDATE_PROFILE
        },
        {
            description: t("actions:types.preRegistration.description.shortened"),
            disabled: isActionTypeDisabled(ActionsConstants.PRE_REGISTRATION_API_PATH),
            featureStatusKey: getFeatureFlagStatus(ActionsConstants.PRE_REGISTRATION_API_PATH),
            heading: t("actions:types.preRegistration.heading"),
            icon: <UserFlowIcon size="small" className="icon"/>,
            identifier: ActionsConstants.PRE_REGISTRATION_URL_PATH,
            route: isActionTypeDisabled(ActionsConstants.PRE_REGISTRATION_API_PATH) ? undefined :
                AppConstants.getPaths().get("PRE_UPDATE_REGISTRATION_EDIT"),
            type: ActionType.PRE_REGISTRATION
        }
    ];

    /**
     * This useMemo is used to filter the action types returned in the API and disabled via feature flags.
     */
    const enabledActionTypeCards: ActionTypeCardInterface[] = useMemo((): ActionTypeCardInterface[] => {
        if (!actionTypesConfigs) return;

        const actionTypeToFeatureKeyMap: Record<string, string> = {
            [ActionType.PRE_ISSUE_ACCESS_TOKEN]:  ActionsConstants.PRE_ISSUE_ACCESS_TOKEN_API_PATH,
            [ActionType.PRE_UPDATE_PASSWORD]: ActionsConstants.PRE_UPDATE_PASSWORD_API_PATH,
            [ActionType.PRE_UPDATE_PROFILE]: ActionsConstants.PRE_UPDATE_PROFILE_API_PATH,
            [ActionType.PRE_REGISTRATION]: ActionsConstants.PRE_REGISTRATION_API_PATH
        };

        const checkFeatureEnabledStatus = (actionType: string): boolean => {
            const featureKey: string = actionTypeToFeatureKeyMap[actionType];

            if (!featureKey) return false;
            const prefix: string = isSubOrganization() ? "actions.types.org.list" : "actions.types.list";

            return isFeatureEnabled(actionsFeatureConfig, `${prefix}.${featureKey}`);
        };

        const enabledTypes: string[] = actionTypesConfigs
            .map((actionType: ActionTypesResponseInterface) => actionType.type)
            .filter(checkFeatureEnabledStatus);

        // If the organization is not a sub-organization, include pre-registration action type if enabled
        // even it is not returned in the API.
        if (!isSubOrganization() && isFeatureEnabled(actionsFeatureConfig, "actions.types.list.preRegistration")) {
            enabledTypes.push(ActionType.PRE_REGISTRATION);
        }

        return actionTypesCardsInfo.filter((card: ActionTypeCardInterface) => enabledTypes.includes(card.type));
    }, [ actionTypesConfigs, actionsFeatureConfig, isSubOrganization ]);

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
                <div
                    className="status-tag"
                    data-componentid={ `${ _componentId }-${ actionType }-configured-status-tag` }
                >
                    <CircleCheckFilledIcon className="icon-configured"/>
                    <Typography  className="text-configured" variant="h6">
                        { t("actions:status.configured") }
                    </Typography>
                </div>
            );
        } else {
            return (
                <div
                    className="status-tag"
                    data-componentid={ `${ _componentId }-${ actionType }-not-configured-status-tag` }
                >
                    <Typography  className="text-not-configured" variant="h6">
                        {  t("actions:status.notConfigured") }
                    </Typography>
                </div>
            );
        }
    };

    /**
     * This function returns loading placeholders.
     */
    const renderLoadingPlaceholder = (): ReactElement => {
        const placeholders: ReactElement[] = [];
        const cardsPerRow: number[] = [ 3, 1 ];

        for (let rowIndex: number = 0; rowIndex < cardsPerRow.length; rowIndex++) {
            const cardsInRow: number = cardsPerRow[ rowIndex ];
            const cards: ReactElement[] = [];

            for (let columnIndex: number = 0; columnIndex < cardsInRow; columnIndex++) {
                cards.push(
                    <Box
                        className="placeholder-box"
                        data-componentid={ `${ _componentId }-loading-card` }
                    >
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line length="medium" />
                                <Placeholder.Line length="full" />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Box>
                );
            }

            placeholders.push(
                <div key={ rowIndex }>
                    <div className="action-types-grid-wrapper">
                        <div className="action-types-grid">
                            { cards }
                        </div>
                    </div>
                </div>
            );
        }

        return <>{ placeholders }</>;
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
            { isActionTypesConfigsLoading ? renderLoadingPlaceholder() : (
                <div className="action-types-grid-wrapper" data-componentid={ `${ _componentId }-grid` }>
                    <div className="action-types-grid">
                        { enabledActionTypeCards?.map((cardProps: ActionTypeCardInterface) => {
                            return (
                                <Card
                                    key={ cardProps.identifier }
                                    className={ classNames("action-type", { "disabled": cardProps.disabled }) }
                                    data-componentid={ `${ cardProps.identifier }-action-type-card` }
                                    onClick={ () => history.push(cardProps.route) }
                                >
                                    <CardContent className="action-type-header">
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
                                        <FeatureFlagLabel
                                            featureFlags={ actionsFeatureConfig?.featureFlags }
                                            featureKey={ cardProps.featureStatusKey }
                                            type="ribbon"
                                        />
                                    </CardContent>
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            {  cardProps.description }
                                        </Typography>
                                    </CardContent>
                                </Card>
                            );
                        }) }
                    </div>
                </div>
            ) }
        </PageLayout>
    );
};

export default ActionTypesListingPage;
