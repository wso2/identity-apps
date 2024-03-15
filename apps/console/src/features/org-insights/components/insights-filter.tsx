/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

// Need to add this icon to oxygen icons
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DropdownChild, Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { I18n } from "@wso2is/i18n";
import { LinkButton, Popup, PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Form, Grid } from "semantic-ui-react";
import { getFilterAttributeListByActivityType } from "../config/org-insights";
import { OrgInsightsConstants } from "../constants/org-insights";
import {
    ActivityType,
    AuthenticatorFilterValue,
    FilterCondition,
    OnboardingMethodFilterValue
} from "../models/insights";
import { getAllDisabledFeaturesForInsights } from "../utils/insights";

const dropdownInputRequiredAttributesForFilterValue: string[] = [ "onboardingMethod", "authenticator" ];

const filterValueDropdownItems: Record<string,DropdownChild[]> = {
    "authenticator": [
        {
            key:   1,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "basic"
            ).toString(),
            value: AuthenticatorFilterValue.BASIC
        },
        {
            key:   2,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "identifierFirst"
            ).toString(),
            value: AuthenticatorFilterValue.IDENTIFIER_FIRST
        },
        {
            key:   3,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "fido2"
            ).toString(),
            value: AuthenticatorFilterValue.FIDO2
        },
        {
            key:   4,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "magicLink"
            ).toString(),
            value: AuthenticatorFilterValue.MAGIC_LINK
        },
        {
            key:   5,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "emailOtp"
            ).toString(),
            value: AuthenticatorFilterValue.EMAIL_OTP
        },
        {
            key:   6,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "smsOtp"
            ).toString(),
            value: AuthenticatorFilterValue.SMS_OTP
        },
        {
            key:   7,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "totp"
            ).toString(),
            value: AuthenticatorFilterValue.TOTP
        },
        {
            key:   8,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "backupCodes"
            ).toString(),
            value: AuthenticatorFilterValue.BACK_UP_CODE
        },
        {
            key:   9,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "google"
            ).toString(),
            value: AuthenticatorFilterValue.GOOGLE
        },
        {
            key:   10,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "facebook"
            ).toString(),
            value: AuthenticatorFilterValue.FACEBOOK
        },
        {
            key:   11,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "github"
            ).toString(),
            value: AuthenticatorFilterValue.GITHUB
        },
        {
            key:   12,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "apple"
            ).toString(),
            value: AuthenticatorFilterValue.APPLE
        },
        {
            key:   13,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "oidc"
            ).toString(),
            value: AuthenticatorFilterValue.OIDC
        },
        {
            key:   14,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "saml"
            ).toString(),
            value: AuthenticatorFilterValue.SAML
        },
        {
            key:   15,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "hypr"
            ).toString(),
            value: AuthenticatorFilterValue.HYPR
        },
        {
            key:   16,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.login.filters.authenticator.values." +
                "iproov"
            ).toString(),
            value: AuthenticatorFilterValue.IPROOV
        }
    ],
    "onboardingMethod": [
        {
            key:   1,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.registration.filters.onboardingMethod.values." +
                "adminInitiated"
            ).toString(),
            value: OnboardingMethodFilterValue.ADMIN_INITIATED
        },
        {
            key:   2,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.registration.filters.onboardingMethod.values." +
                "userInvited"
            ).toString(),
            value: OnboardingMethodFilterValue.USER_INVITE
        },
        {
            key:   3,
            text:  I18n.instance.t(
                "console:manage.features.insights.activityType.registration.filters.onboardingMethod.values." +
                "selfSignUp"
            ).toString(),
            value: OnboardingMethodFilterValue.SELF_SIGN_UP
        }
    ]
};

const filterConditions: FilterCondition[] = [
    {
        key: 1,
        text: I18n.instance.t("common:equals") as ReactNode,
        value: "eq"
    }
];

interface InsightsFilterProps extends IdentifiableComponentInterface {
    onFilteringQuerySubmitted: (filteringQuery: string, displayingQuery: string) => void;
    selectedActivityType: ActivityType;
    showResetButton?: boolean;
}

export const InsightsFilter = (props: InsightsFilterProps): ReactElement => {
    const {
        onFilteringQuerySubmitted,
        selectedActivityType,
        showResetButton,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ isFilteringModalOpen, setIsFilteringModalOpen ] = useState<boolean>(false);
    const [ isFiltersReset, setIsFiltersReset ] = useState<boolean>(false);
    const [ selectedFilterAttribute, setSelectedFilterAttribute ] = useState<string>(
        getFilterAttributeListByActivityType(selectedActivityType)?.[0].value
    );
    const [ selectedFilterCondition,setSelectedFilterCondition ] = useState<string>(filterConditions[0].value);
    const [ selectedFilterValue, setSelectedFilterValue ] = useState<string>("");

    useEffect(() => {
        setSelectedFilterAttribute(getFilterAttributeListByActivityType(selectedActivityType)?.[0].value);
    }, [ selectedActivityType ]);

    useEffect(() => {
        setSelectedFilterValue("");
    },[ selectedFilterAttribute ]);

    useEffect(() => {
        if (dropdownInputRequiredAttributesForFilterValue.includes(selectedFilterAttribute)) {
            setSelectedFilterValue(filterValueDropdownItems[selectedFilterAttribute]?.[0].value);
        }
    },[ selectedFilterAttribute ]);

    const handleFormSubmit = (values: Map<string, FormValue>) => {
        setSelectedFilterAttribute(values.get("filterAttribute").toString());
        setSelectedFilterCondition(values.get("filterCondition").toString());
        setSelectedFilterValue(values.get("filterValue").toString());

        const query: string = values.get("filterAttribute")
            + "+"
            + values.get("filterCondition")
            + "+"
            + values.get("filterValue");

        const displayQueryParts: string[] = query.split("+");

        const matchingAttribute: Omit<DropdownChild,"key"> =
            getFilterAttributeListByActivityType(selectedActivityType)?.find(
                (dropdownItem: DropdownChild) =>
                    dropdownItem.value === values.get("filterAttribute")
            );

        const matchingValue: DropdownChild = filterValueDropdownItems[values.get("filterAttribute").toString()]?.
            find((dropdownItem: DropdownChild) =>
                dropdownItem.value === values.get("filterValue")
            );

        if (matchingValue) {
            displayQueryParts[2] = "\"" + matchingValue?.text?.toString() + "\"";
        }

        if (matchingAttribute) {
            displayQueryParts[0] = matchingAttribute?.text?.toString();
        }

        displayQueryParts[1] = "=";

        onFilteringQuerySubmitted(query, displayQueryParts.join(" "));
        setIsFilteringModalOpen(false);
    };

    const handleResetFilter = (): void => {
        setSelectedFilterValue("");
        onFilteringQuerySubmitted("", "");
        setIsFiltersReset(true);
    };

    return (
        <Popup
            open={ isFilteringModalOpen }
            onClose={ () => setIsFilteringModalOpen(false) }
            content={
                (
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <Forms
                                    onSubmit={ handleFormSubmit }
                                    resetState={ isFiltersReset }
                                >
                                    <Field
                                        children={
                                            getFilterAttributeListByActivityType(selectedActivityType)?.filter(
                                                (attribute: DropdownChild) =>  !getAllDisabledFeaturesForInsights().
                                                    includes(
                                                        "filterBy:" + attribute.value
                                                    )
                                            )
                                        }
                                        label={
                                            t("console:common.advancedSearch.form.inputs.filterAttribute.label")
                                        }
                                        name={ "filterAttribute" }
                                        requiredErrorMessage={
                                            t("console:common.advancedSearch.form.inputs.filterAttribute" +
                                        ".validations.empty")
                                        }
                                        type="dropdown"
                                        listen={ (data: Map<string, FormValue>) => {
                                            setSelectedFilterAttribute(data.get("filterAttribute")?.toString());
                                        } }
                                        value={ selectedFilterAttribute }
                                        data-componentid={ `${ componentId }-attribute-dropdown` }
                                    />
                                    <Form.Group widths="equal">
                                        <Field
                                            children={
                                                filterConditions.map(
                                                    (attribute: DropdownChild, index: number) => {
                                                        return {
                                                            key: index,
                                                            text: attribute.text,
                                                            value: attribute.value
                                                        };
                                                    })
                                            }
                                            label={
                                                t("console:common.advancedSearch.form.inputs.filterCondition.label")
                                            }
                                            name={ "filterCondition" }
                                            requiredErrorMessage={ t("console:common.advancedSearch.form.inputs" +
                                        ".filterCondition.validations.empty") }
                                            type="dropdown"
                                            value={ selectedFilterCondition }
                                            data-testid={ `${ componentId }-condition-dropdown` }
                                        />
                                        { dropdownInputRequiredAttributesForFilterValue.includes(
                                            selectedFilterAttribute) ?

                                            (<Field
                                                children={
                                                    filterValueDropdownItems[selectedFilterAttribute].map(
                                                        (attribute: DropdownChild, index: number) => {
                                                            return {
                                                                key: index,
                                                                text: attribute.text,
                                                                value: attribute.value
                                                            };
                                                        })
                                                }
                                                label={
                                                    t("console:common.advancedSearch.form.inputs.filterValue." +
                                                         "label")
                                                }
                                                name={ "filterValue" }
                                                required={ true }
                                                requiredErrorMessage={
                                                    t("console:common.advancedSearch.form.inputs" +
                                                        ".filterCondition.validations.empty")
                                                }
                                                value={ selectedFilterValue }
                                                type="dropdown"
                                                data-testid={ `${ componentId }-value-dropdown` }
                                            />) :
                                            (<Field
                                                label={
                                                    t("console:common.advancedSearch.form.inputs.filterValue." +
                                                        "label")
                                                }
                                                name={ "filterValue" }
                                                required
                                                requiredErrorMessage={
                                                    t("console:common.advancedSearch.form." +
                                                        "inputs.filterValue.validations.empty")
                                                }
                                                type="text"
                                                validation={ (value: string, _validation: Validation) => {
                                                    if (
                                                        value.length >
                                                        OrgInsightsConstants.FILTER_VALUE_INPUT_MAX_LENGTH
                                                    ) {
                                                        _validation.isValid = false;
                                                        _validation.errorMessages.push(t("common:maxValidation", {
                                                            max: OrgInsightsConstants.FILTER_VALUE_INPUT_MAX_LENGTH
                                                        }));
                                                    }
                                                } }
                                                value={ selectedFilterValue }
                                                data-componentid={ `${ componentId }-value-input` }
                                            />)
                                        }

                                    </Form.Group>
                                    <Divider hidden/>
                                    <Form.Group inline>
                                        <PrimaryButton
                                            size="small"
                                            type="submit"
                                            data-testid={ `${ componentId }-submit-button` }
                                            data-componentid={ `${ componentId }-submit-button` }
                                        >
                                            { t("common:search") }
                                        </PrimaryButton>
                                        {
                                            showResetButton && (
                                                <LinkButton
                                                    size="small"
                                                    type="reset"
                                                    data-testid={ `${ componentId }-reset-button` }
                                                    data-componentid={ `${ componentId }-reset-button` }
                                                    onClick={ () => handleResetFilter() }
                                                >
                                                    { t("common:resetFilters") }
                                                </LinkButton>
                                            )
                                        }
                                    </Form.Group>
                                </Forms>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
            on="click"
            position="bottom right"
            size="small"
            trigger={
                (
                    <div
                        data-componentid={ componentId + "-trigger" }
                        className="org-insights-advanced-filter-trigger"
                        onClick={ () => setIsFilteringModalOpen(!isFilteringModalOpen) }
                    >
                        <FilterAltIcon className="org-insights-filter-icon" />
                    </div>
                )
            }
        />
    );
};
