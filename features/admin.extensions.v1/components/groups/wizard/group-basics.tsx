/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, Validation } from "@wso2is/forms";
import { Code, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { SharedUserStoreConstants, SharedUserStoreUtils } from "@wso2is/admin.core.v1";
import { CreateGroupFormData, SearchGroupInterface, searchGroupList } from "@wso2is/admin.groups.v1";
import { CONSUMER_USERSTORE, PRIMARY_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import { commonConfig } from "../../../configs/common";

/**
 * Interface to capture group basics props.
 */
interface GroupBasicProps extends TestableComponentInterface {
    dummyProp?: string;
    triggerSubmit: boolean;
    initialValues: any;
    onSubmit: (values: any) => void;
}

/**
 * Component to capture basic details of a new role.
 *
 */
export const GroupBasics: FunctionComponent<GroupBasicProps> = (props: GroupBasicProps): ReactElement => {

    const {
        onSubmit,
        triggerSubmit,
        initialValues,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isRegExLoading, setRegExLoading ] = useState<boolean>(false);

    const groupName: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>();

    /**
     * The following function validates role name against the user store regEx.
     *
     */
    const validateGroupNamePattern = async (): Promise<string> => {
        let userStoreRegEx: string = "";

        await SharedUserStoreUtils.getUserStoreRegEx(CONSUMER_USERSTORE,
            SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.RolenameRegEx)
            .then((response: string) => {
                setRegExLoading(true);
                userStoreRegEx = response;
            });

        setRegExLoading(false);

        return new Promise((resolve: any, reject: any) => {
            if (userStoreRegEx !== "") {
                resolve(userStoreRegEx);
            } else {
                reject("");
            }
        });

    };

    /**
     * Util method to collect form data for processing.
     *
     * @param values - contains values from form elements
     */
    const getFormValues = (values: any): CreateGroupFormData => {
        return {
            domain: commonConfig?.primaryUserstoreOnly ? PRIMARY_USERSTORE : CONSUMER_USERSTORE,
            groupName: values.get("groupName").toString()
        };
    };

    return (
        <Forms
            data-testid={ testId }
            onSubmit={ (values: any) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <GridRow>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            ref={ groupName }
                            data-testid={ `${ testId }-role-name-input` }
                            type="text"
                            name="groupName"
                            label={ t("roles:addRoleWizard.forms.roleBasicDetails." +
                                "roleName.label", { type: "Group" }) }
                            placeholder={ t("roles:addRoleWizard.forms." +
                                "roleBasicDetails.roleName.placeholder", { type: "group" }) }
                            required={ true }
                            requiredErrorMessage={ t("roles:addRoleWizard.forms." +
                                "roleBasicDetails.roleName.validations.empty", { type: "Group" }) }
                            validation={ async (value: string, validation: Validation) => {
                                let isGroupNameValid: boolean = true;

                                await validateGroupNamePattern().then((regex: string) => {
                                    isGroupNameValid = SharedUserStoreUtils.validateInputAgainstRegEx(value, regex);
                                });

                                if (!isGroupNameValid) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(t("console:manage.features.businessGroups" +
                                        ".fields.groupName.validations.invalid",
                                    { type: "group" }));
                                }

                                const searchData: SearchGroupInterface = {
                                    filter: `displayName eq  ${ CONSUMER_USERSTORE }/${ value }`,
                                    schemas: [
                                        "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
                                    ],
                                    startIndex: 1
                                };

                                await searchGroupList(searchData).then((response: any) => {
                                    if (response?.data?.totalResults !== 0) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("roles:addRoleWizard." +
                                                "forms.roleBasicDetails.roleName.validations.duplicate",
                                            { type: "Group" }));
                                    }
                                }).catch(() => {
                                    dispatch(addAlert({
                                        description: t("console:manage.features.groups.notifications." +
                                            "fetchGroups.genericError.description"),
                                        level: AlertLevels.ERROR,
                                        message: t("console:manage.features.groups.notifications.fetchGroups." +
                                            "genericError.message")
                                    }));
                                });

                            } }
                            value={ initialValues && initialValues.groupName }
                            loading={ isRegExLoading }
                        />
                        <Hint>
                            A name for the group.
                            { " " }
                            Can contain between 3 to 30 alphanumeric characters, dashes (<Code>-</Code>),{ " " }
                            and underscores (<Code>_</Code>).
                        </Hint>
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    );
};
