/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Progress } from "semantic-ui-react";
import { getWidgetIcons } from "../../../configs";
import { AppConstants, CommonConstants, UIConstants } from "../../../constants";
import { history } from "../../../helpers";
import { ConfigReducerStateInterface, ProfileCompletion, ProfileCompletionStatus } from "../../../models";
import { AppState } from "../../../store";
import { CommonUtils } from "../../../utils";
import { SettingsSection } from "../../shared";

/**
 * Prop-types for the user sessions edit component.
 * Also see {@link UserSessionsEdit.defaultProps}
 */
interface ProfileWidgetPropsInterface extends TestableComponentInterface {
    userSource?: string;
}

/**
 * Profile widget.
 * Also see {@link ProfileWidget.defaultProps}
 *
 * @param props - Props injected to the component.
 * @returns Profile widget component.
 */
export const ProfileWidget: FunctionComponent<ProfileWidgetPropsInterface> = (
    props: ProfileWidgetPropsInterface
): ReactElement => {

    const {
        userSource,
        ["data-testid"]: testId
    } = props;


    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const navigate = () => {
        history.push(AppConstants.getPaths().get("PERSONAL_INFO") + "#" + CommonConstants.PERSONAL_INFO);
    };

    const profileCompletion: ProfileCompletion = useSelector((state: AppState) => state.profile.completion);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    /**
     * Return the profile completion percentage.
     *
     * @returns Profile completion percentage.
     */
    const getProfileCompletionPercentage = (): number => {
        return profileCompletion && profileCompletion.percentage ? profileCompletion.percentage : 0;
    };

    /**
     * Get the profile status based on the profile completion percentage.
     *
     * @returns Profile status.
     */
    const getProfileStatus = (): ProfileCompletionStatus => {

        const percentage = getProfileCompletionPercentage();

        if (percentage <= UIConstants.ERROR_ACCOUNT_STATUS_UPPER_LIMIT) {
            return ProfileCompletionStatus.ERROR;
        } else if (percentage <= UIConstants.WARNING_ACCOUNT_STATUS_UPPER_LIMIT) {
            return ProfileCompletionStatus.WARNING;
        }

        return ProfileCompletionStatus.SUCCESS;
    };

    /**
     * Generates the profile completion progress bar .
     *
     * @returns Completion progress.
     */
    const generateCompletionProgress = (): ReactElement => (
        <Progress
            percent={
                (profileCompletion && profileCompletion.percentage)
                    ? profileCompletion.percentage
                    : 0
            }
            size="tiny"
            className="account-status-progress"
            success={ getProfileStatus() === ProfileCompletionStatus.SUCCESS }
            warning={ getProfileStatus() === ProfileCompletionStatus.WARNING }
            error={ getProfileStatus() === ProfileCompletionStatus.ERROR }
        >
            {
                t("myAccount:components.overview.widgets.profileStatus.completionPercentage",
                    {
                        percentage: profileCompletion && profileCompletion.percentage
                            ? profileCompletion.percentage
                            : 0
                    })
            }
        </Progress>
    );

    return (
        <div className="widget profile" data-testid={ testId }>
            <SettingsSection
                className="overview"
                data-testid={ `${testId}-settings-section` }
                header={ t("myAccount:components.overview.widgets.profileStatus.header" ,
                    { productName: config.ui.productName }) }
                description={
                    (<>
                        {
                            userSource && (
                                <div
                                    className="overview-page-header"
                                >
                                    {
                                        t("myAccount:components.overview.widgets.profileStatus.userSourceText" ,
                                            { source: userSource })
                                    }
                                </div>
                            )
                        }
                        {
                            !CommonUtils.isProfileReadOnly(isReadOnlyUser)
                                ? generateCompletionProgress()
                                : t("myAccount:components.overview.widgets.profileStatus.profileText")
                        }
                    </>)
                }
                primaryAction={
                    !CommonUtils.isProfileReadOnly(isReadOnlyUser)
                        ? t("myAccount:components.overview.widgets.profileStatus.description")
                        : t("myAccount:components.overview.widgets.profileStatus.readOnlyDescription")
                }
                onPrimaryActionClick={ navigate }
                icon={ getWidgetIcons().profile }
                iconMini={ getWidgetIcons().profile }
                iconSize="tiny"
                iconStyle="twoTone"
            />
        </div>
    );
};

/**
 * Default properties of {@link ProfileWidget}
 *
 * {@link ProfileWidget} has no component specific properties to
 * be defined in a typed interface so instead it directly uses
 * {@link TestableComponentInterface} as its prop type definition.
 *
 * Example to extend if {@link ProfileWidget} has custom props: -
 *
 * ```
 * interface ProfileWidgetProps extends TestableComponentInterface { prop: type }
 *
 * // Wrap props interface with {@link React.PropsWithChildren} if has child widgets.
 * export const ProfileWidget: FunctionComponent<ProfileWidgetProps> = (
 *      props: ProfileWidgetProps
 * ): JSX.Element => { ... }
 * ```
 */
ProfileWidget.defaultProps = {
    "data-testid": "profile-status-overview-widget"
};
