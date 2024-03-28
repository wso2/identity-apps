/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { Field, Forms, Validation } from "@wso2is/forms";
import { Code, Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { PermissionList } from "./role-permission";
import { SharedUserStoreConstants } from "../../../../../admin-core-v1/constants";
import { ConfigReducerStateInterface } from "../../../../../admin-core-v1/models";
import { AppState } from "../../../../../admin-core-v1/store";
import { SharedUserStoreUtils } from "../../../../../admin-core-v1/utils";
import { searchRoleList } from "../../../../../admin-roles-v2/api";
import { CreateRoleFormData, SearchRoleInterface, TreeNode } from "../../../../../admin-roles-v2/models";
import { getUserStoreList } from "../../../../../admin-userstores-v1/api";
import { CONSUMER_USERSTORE } from "../../../../../admin-userstores-v1/constants";

/**
 * Interface to capture role basics props.
 */
interface RoleBasicProps extends TestableComponentInterface {
    dummyProp?: string;
    triggerSubmit: boolean;
    initialValues: any;
    isAddGroup: boolean;
    onSubmit: (values: any) => void;
}

/**
 * Component to capture basic details of a new role.
 *
 * @param props - Role Basic prop types
 */
export const RoleBasics: FunctionComponent<RoleBasicProps> = (props: RoleBasicProps): ReactElement => {

    const {
        onSubmit,
        triggerSubmit,
        initialValues,
        isAddGroup,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ , setUserStoresList ] = useState([]);
    const [ isRegExLoading, setRegExLoading ] = useState<boolean>(false);
    const [ permissions, setPermissions ] = useState<TreeNode[]>([]);

    useEffect(() => {
        getUserStores();
    }, [ isAddGroup ]);

    /**
     * The following function validates role name against the user store regEx.
     *
     * @param roleName - User input role name
     */
    const validateRoleNamePattern = async (): Promise<string> => {
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
     * The following function fetch the user store list and set it to the state.
     */
    const getUserStores = () => {
        const storeOptions: any = [
            {
                key: -1,
                text: "Primary",
                value: "primary"
            }
        ];

        let storeOption: any = {
            key: null,
            text: "",
            value: ""
        };

        getUserStoreList()
            .then((response: any) => {
                if (storeOptions.length === 0) {
                    storeOptions.push(storeOption);
                }
                response.data.map((store: any, index: number) => {
                    storeOption = {
                        key: index,
                        text: store.name,
                        value: store.name
                    };
                    storeOptions.push(storeOption);
                }
                );
                setUserStoresList(storeOptions);
            });

        setUserStoresList(storeOptions);
    };

    /**
     * Util method to collect form data for processing.
     *
     * @param values - contains values from form elements
     */
    const getFormValues = (values: any): CreateRoleFormData => {
        return {
            roleName: values.get("rolename").toString()
        };
    };

    return (
        <>
            <Forms
                data-testid={ testId }
                onSubmit={ (values: any) => {
                    onSubmit({
                        basic: getFormValues(values),
                        permissions
                    });
                } }
                submitState={ triggerSubmit }
            >
                <Grid>
                    <GridRow>
                        <GridColumn mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Field
                                data-testid={ `${ testId }-role-name-input` }
                                type="text"
                                name="rolename"
                                label={
                                    t("roles:addRoleWizard.forms.roleBasicDetails." +
                                        "roleName.label", { type: "Role" })
                                }
                                placeholder={
                                    t("roles:addRoleWizard.forms.roleBasicDetails.roleName." +
                                        "placeholder", { type: "Role" })
                                }
                                required={ true }
                                requiredErrorMessage={
                                    t("roles:addRoleWizard.forms.roleBasicDetails.roleName." +
                                        "validations.empty", { type: "Role" })
                                }
                                validation={ async (value: string, validation: Validation) => {

                                    const searchData: SearchRoleInterface = {
                                        filter: "displayName eq " + value.toString(),
                                        schemas: [
                                            "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
                                        ],
                                        startIndex: 1
                                    };
                                    const response: any = await searchRoleList(searchData);

                                    if (response?.data?.totalResults > 0) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("roles:addRoleWizard.forms.roleBasicDetails." +
                                                "roleName.validations.duplicate", { type: "Role" })
                                        );
                                    }

                                    let isRoleNamePatternValid: boolean = true;

                                    await validateRoleNamePattern().then((regex: string) => {
                                        isRoleNamePatternValid = SharedUserStoreUtils.
                                            validateInputAgainstRegEx(value, regex);
                                    });

                                    if (!isRoleNamePatternValid) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("roles:addRoleWizard.forms.roleBasicDetails." +
                                                "roleName.validations.invalid", { type: "role" })
                                        );
                                    }
                                } }
                                value={ initialValues && initialValues.basic.roleName }
                                loading={ isRegExLoading }
                            />
                            <Hint>
                                A name for the role.
                                { " " }
                                Can contain between 3 to 30 alphanumeric characters, dashes (<Code>-</Code>),{ " " }
                                and underscores (<Code>_</Code>).
                            </Hint>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </Forms>
            <Heading as="h5" className="mt-3">Add Permissions</Heading>
            <Hint>
                Select permissions to manage access to the { config.ui.productName } console
            </Hint>
            <PermissionList
                data-testid="new-role-permissions"
                isEdit={ false }
                initialValues={ initialValues && initialValues.permissions }
                onChange={ (permissions: TreeNode[]) => setPermissions(permissions) }
            />
        </>
    );
};
