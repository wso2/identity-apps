/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getUserStoreList } from "@wso2is/core/api";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms, Validation } from "@wso2is/forms";
import { Code, Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { PermissionList } from "./role-permission";
import { SharedUserStoreConstants } from "../../../../../features/core/constants";
import { ConfigReducerStateInterface } from "../../../../../features/core/models";
import { AppState } from "../../../../../features/core/store";
import { SharedUserStoreUtils } from "../../../../../features/core/utils";
import { searchRoleList } from "../../../../../features/roles/api";
import {
    PRIMARY_DOMAIN
} from "../../../../../features/roles/constants";
import { CreateRoleFormData, SearchRoleInterface, TreeNode } from "../../../../../features/roles/models";
import { CONSUMER_USERSTORE } from "../../../users/constants";

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
 * @param props Role Basic prop types
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

    const [ isRoleNamePatternValid, setIsRoleNamePatternValid ] = useState<boolean>(true);
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState<string>(SharedUserStoreConstants.PRIMARY_USER_STORE);
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
        let userStoreRegEx = "";
        await SharedUserStoreUtils.getUserStoreRegEx(CONSUMER_USERSTORE,
            SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.RolenameRegEx)
            .then((response) => {
                setRegExLoading(true);
                userStoreRegEx = response;
            });

        setRegExLoading(false);
        return new Promise((resolve, reject) => {
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
        const storeOptions = [
                {
                    key: -1,
                    text: "Primary",
                    value: "primary"
                }
            ];
        let storeOption = {
            key: null,
            text: "",
            value: ""
        };
        getUserStoreList()
            .then((response) => {
                if (storeOptions === []) {
                    storeOptions.push(storeOption);
                }
                response.data.map((store, index) => {
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
                onSubmit={ (values) => {
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
                                    t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                                        "roleName.label", { type: "Role" })
                                }
                                placeholder={
                                    t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
                                        "placeholder", { type: "Role" })
                                }
                                required={ true }
                                requiredErrorMessage={
                                    t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
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
                                    const response = await searchRoleList(searchData);

                                    if (response?.data?.totalResults > 0) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                                                "roleName.validations.duplicate", { type: "Role" })
                                        );
                                    }

                                    let isRoleNamePatternValid = true;
                                    await validateRoleNamePattern().then(regex => {
                                        isRoleNamePatternValid = SharedUserStoreUtils.validateInputAgainstRegEx(value, regex);
                                    });

                                    if (!isRoleNamePatternValid) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
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
