/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid, Header, Icon, Popup, Progress } from "semantic-ui-react";
import { AccountStatusShields } from "../../../configs";
import * as UIConstants from "../../../constants/ui-constants";
import { ProfileCompletion, ProfileCompletionStatus } from "../../../models";
import { AppState } from "../../../store";
import { ThemeIcon } from "../../shared";

/**
 * Account status widget.
 *
 * @return {JSX.Element}
 */
export const AccountStatusWidget: FunctionComponent<{}> = (): JSX.Element => {
    const { t } = useTranslation();
    const profileCompletion: ProfileCompletion = useSelector((state: AppState) => state.profile.completion);

    /**
     * Get the profile status based on the profile completion percentage.
     *
     * @return {ProfileCompletionStatus}
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
     * Return the profile completion percentage.
     *
     * @return {number}
     */
    const getProfileCompletionPercentage = (): number => {
        return profileCompletion && profileCompletion.percentage ? profileCompletion.percentage : 0;
    };

    /**
     * Get the completion percentage based on the completion status of
     * required and optional fields.
     *
     * @remarks
     * We are not showing optional field incompletion as errors. The `isOptional` param is
     * used to distinguish if the field we're calculating the status for is optional.
     *
     * @param field - Field to check.
     * @param {boolean} isOptional - Flag to check if the calculation is for the optional field.
     * @return {ProfileCompletionStatus}
     */
    const getFieldCompletionStatus = (field: any, isOptional: boolean): ProfileCompletionStatus => {

        const percentage = (field.completedCount / field.totalCount) * 100;

        if ((percentage <= UIConstants.ERROR_ACCOUNT_STATUS_UPPER_LIMIT) && !isOptional) {
            return ProfileCompletionStatus.ERROR;
        } else if (percentage <= UIConstants.WARNING_ACCOUNT_STATUS_UPPER_LIMIT) {
            return ProfileCompletionStatus.WARNING;
        }

        return ProfileCompletionStatus.SUCCESS;
    };

    /**
     * Resolved the type of account status shield based on the completion status.
     *
     * @return {any}
     */
    const resolveStatusShield = () => {
        const status = getProfileStatus();

        if (status === ProfileCompletionStatus.SUCCESS) {
            return AccountStatusShields.good;
        } else if (status === ProfileCompletionStatus.ERROR) {
            return AccountStatusShields.danger;
        } else if (status === ProfileCompletionStatus.WARNING) {
            return AccountStatusShields.warning;
        }

        return AccountStatusShields.good;
    };

    /**
     * Generates the more info popup.
     *
     * @param attributes - Relevant attributes.
     * @return {JSX.Element}
     */
    const generatePopup = (attributes: any): JSX.Element => (
        ((attributes.completedAttributes
            && attributes.completedAttributes.length
            && attributes.completedAttributes.length > 0)
            || (attributes.incompleteAttributes
                && attributes.incompleteAttributes.length
                && attributes.incompleteAttributes.length > 0))
            ? (
                <Popup
                    trigger={ <Icon color="grey" name="info circle"/> }
                    position="bottom center"
                    className="list-content-popup"
                    hoverable
                    content={ (
                        <>
                            {
                                (attributes.completedAttributes
                                    && attributes.completedAttributes.length
                                    && attributes.completedAttributes.length > 0)
                                    ? (
                                        <>
                                            <div className="header">
                                                <Icon color="green" name="check circle"/>
                                                { t("views:components.overview.widgets.accountStatus." +
                                                    "completedFields") }
                                            </div>
                                            <ul>
                                                {
                                                    attributes.completedAttributes
                                                        .map((attr, index) => (
                                                            <li key={ index }>
                                                                {
                                                                    t("views:components.profile.fields."
                                                                        + attr.name.replace(".", "_"),
                                                                        { defaultValue: attr.displayName })
                                                                }
                                                            </li>
                                                        ))
                                                }
                                            </ul>
                                        </>
                                    )
                                    : null
                            }

                            {
                                (attributes.incompleteAttributes
                                    && attributes.incompleteAttributes.length
                                    && attributes.incompleteAttributes.length > 0)
                                    ? (
                                        <>
                                            <div className="header">
                                                <Icon color="red" name="times circle"/>
                                                { t("views:components.overview.widgets.accountStatus." +
                                                    "inCompleteFields") }
                                            </div>
                                            <ul>
                                                {
                                                    attributes.incompleteAttributes
                                                        .map((attr, index) => (
                                                            <li key={ index }>
                                                                {
                                                                    t("views:components.profile.fields."
                                                                        + attr.name.replace(".", "_"),
                                                                        { defaultValue: attr.displayName })
                                                                }
                                                            </li>
                                                        ))
                                                }
                                            </ul>
                                        </>
                                    )
                                    : null
                            }
                        </>
                    ) }
                    inverted={ true }
                />
            )
            : null
    );

    /**
     * Generates the profile completion pre=ogress bar and steps.
     * @return {JSX.Element}
     */
    const generateCompletionProgress = (): JSX.Element => (
        <ul className="vertical-step-progress">
            {
                (profileCompletion.required
                    && profileCompletion.required.totalCount
                    && profileCompletion.required.completedCount)
                    ? (
                        <li
                            className={ `progress-item ${ getFieldCompletionStatus(
                                profileCompletion.required, false) }` }
                        >
                            {
                                t("views:components.overview.widgets.accountStatus" +
                                    ".mandatoryFieldsCompletion",
                                    {
                                        completed: profileCompletion.required.completedCount,
                                        total: profileCompletion.required.totalCount
                                    })
                            }
                            { " " }
                            { generatePopup(profileCompletion.required) }
                        </li>
                    )
                    : null
            }
            {
                (profileCompletion.optional
                    && profileCompletion.optional.totalCount
                    && profileCompletion.optional.completedCount)
                    ? (
                        <li
                            className={ `progress-item ${ getFieldCompletionStatus(
                                profileCompletion.optional, true) }` }
                        >
                            {
                                t("views:components.overview.widgets.accountStatus" +
                                    ".optionalFieldsCompletion",
                                    {
                                        completed: profileCompletion.optional.completedCount,
                                        total: profileCompletion.optional.totalCount
                                    })
                            }
                            { " " }
                            { generatePopup(profileCompletion.optional) }
                        </li>
                    )
                    : null
            }
        </ul>
    );

    return (
        <div className="widget account-status">
            <Grid>
                <Grid.Row>
                    <Grid.Column largeScreen={ 6 } computer={ 5 } tablet={ 5 } mobile={ 16 }>
                        <div className="status-shield-container">
                            <ThemeIcon icon={ resolveStatusShield() } size="auto" transparent/>
                        </div>
                    </Grid.Column>
                    <Grid.Column largeScreen={ 10 } computer={ 11 } tablet={ 11 } mobile={ 16 }>
                        <div className="description">
                            <Header className="status-header" as="h3">
                                {
                                    (getProfileCompletionPercentage() === 100)
                                        ? t("views:components.overview.widgets.accountStatus.complete")
                                        : t("views:components.overview.widgets.accountStatus.inComplete")
                                }
                            </Header>
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
                                    t("views:components.overview.widgets.accountStatus.completionPercentage",
                                        {
                                            percentage: profileCompletion && profileCompletion.percentage
                                                ? profileCompletion.percentage
                                                : 0
                                        })
                                }
                            </Progress>
                            <Divider hidden/>
                            {
                                profileCompletion && (profileCompletion.required || profileCompletion.optional)
                                    ? generateCompletionProgress()
                                    : null
                            }
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};
