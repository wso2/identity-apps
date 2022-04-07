/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { getUserStoreList } from "@wso2is/core/api";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { AddGroupUsers } from "./group-assign-users";
import { SharedUserStoreConstants } from "../../../core/constants";
import { SharedUserStoreUtils } from "../../../core/utils";
// TODO: Remove this once the api is updated.
import {
    APPLICATION_DOMAIN,
    INTERNAL_DOMAIN
} from "../../../roles/constants";
import { searchGroupList } from "../../api";
import { CreateGroupFormData, SearchGroupInterface } from "../../models";

/**
 * Interface to capture group basics props.
 */
interface GroupBasicProps extends TestableComponentInterface {
    dummyProp?: string;
    triggerSubmit: boolean;
    initialValues: { basicDetails: any; userList: any };
    onSubmit: (values: { basicDetails: any; userList: any }) => void;
}

/**
 * Component to capture basic details of a new role.
 *
 * @param props Group Basic prop types
 */
export const GroupBasics: FunctionComponent<GroupBasicProps> = (props: GroupBasicProps): ReactElement => {

    const {
        onSubmit,
        triggerSubmit,
        initialValues,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState<string>();
    const [ isRegExLoading, setRegExLoading ] = useState<boolean>(false);
    const [ basicDetails, setBasicDetails ] = useState<any>(null);
    const [ userList, setUserList ] = useState<any>(null);

    const groupName = useRef<HTMLDivElement>();

    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        if (basicDetails && userList) {
            onSubmit({ basicDetails, userList });
        }
    }, [ basicDetails, userList ]);

    /**
     * Contains domains needed for role creation.
     *
     * Note : Since primary domain is available all time,
     *        hardcoded in the dropdown elements.
     *
     * TODO : Discuss and add or remove the Hybrid domains
     *        to the dropdown.
     */
    const groupDomains = [ {
        key: -1,
        text: SharedUserStoreConstants.PRIMARY_USER_STORE, value: SharedUserStoreConstants.PRIMARY_USER_STORE
    } ];

    const roleDomains = [
        {
            key: -1,
            text: APPLICATION_DOMAIN, value: APPLICATION_DOMAIN
        },
        {
            key: 0,
            text: INTERNAL_DOMAIN, value: INTERNAL_DOMAIN
        }
    ];

    /**
     * The following function change of the user stores.
     *
     * @param values
     */
    const handleDomainChange = (values: Map<string, FormValue>) => {
        const domain: string = values.get("domain").toString();

        setUserStore(domain);
    };

    useEffect(() => {
        if (userStore && initialValues?.basicDetails?.groupName) {
            const input: HTMLInputElement = groupName.current.children[0].children[1].children[0] as HTMLInputElement;

            input.focus();
            input.blur();
        }
    }, [ userStore ]);

    /**
     * The following function validates role name against the user store regEx.
     *
     * @param roleName - User input role name
     */
    const validateGroupNamePattern = async (): Promise<string> => {
        let userStoreRegEx = "";

        if (userStore && userStore !== SharedUserStoreConstants.PRIMARY_USER_STORE) {
            await SharedUserStoreUtils.getUserStoreRegEx(userStore,
                SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.RolenameRegEx)
                .then((response) => {
                    setRegExLoading(true);
                    userStoreRegEx = response;
                });
        } else {
            await SharedUserStoreUtils.getPrimaryUserStore().then((response) => {
                setRegExLoading(true);
                if (response && response.properties) {
                    userStoreRegEx = response?.properties?.filter(property => {
                        return property.name === "RolenameJavaScriptRegEx";
                    })[ 0 ].value;
                }
            });
        }

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
    const getFormValues = (values: any): CreateGroupFormData => {
        return {
            domain: values.get("domain").toString(),
            groupName: values.get("groupName").toString()
        };
    };

    return (
        <>
            <Forms
                data-testid={ testId }
                onSubmit={ (values) => {
                    setBasicDetails(getFormValues(values));
                } }
                submitState={ triggerSubmit }
            >
                <Grid>
                    <GridRow columns={ 2 }>
                        <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                data-testid={ `${ testId }-domain-dropdown` }
                                type="dropdown"
                                label={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                                    "domain.label.group") }
                                name="domain"
                                children={ userStoreOptions }
                                placeholder={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                                    "domain.placeholder") }
                                requiredErrorMessage={ t("console:manage.features.roles.addRoleWizard.forms." +
                                    "roleBasicDetails.domain.validation.empty.group") }
                                required={ true }
                                element={ <div></div> }
                                listen={ handleDomainChange }
                                value={ initialValues?.basicDetails?.domain ?? userStoreOptions[ 0 ]?.value }
                            />
                        </GridColumn>
                        <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                ref={ groupName }
                                data-testid={ `${ testId }-role-name-input` }
                                type="text"
                                name="groupName"
                                label={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                                    "roleName.label", { type: "Group" }) }
                                placeholder={ t("console:manage.features.roles.addRoleWizard.forms." +
                                    "roleBasicDetails.roleName.placeholder", { type: "Group" }) }
                                required={ true }
                                requiredErrorMessage={ t("console:manage.features.roles.addRoleWizard.forms." +
                                    "roleBasicDetails.roleName.validations.empty", { type: "Group" }) }
                                validation={ async (value: string, validation: Validation) => {
                                    if (value) {
                                        let isGroupNameValid = true;

                                        await validateGroupNamePattern().then(regex => {
                                            isGroupNameValid = SharedUserStoreUtils
                                                .validateInputAgainstRegEx(value, regex);
                                        });

                                        if (!isGroupNameValid) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("console:manage.features.roles." +
                                                    "addRoleWizard.forms.roleBasicDetails.roleName.validations.invalid",
                                                { type: "group" })
                                            );
                                        }

                                        const searchData: SearchGroupInterface = {
                                            filter: `displayName eq  ${ 
                                                userStore ?? SharedUserStoreConstants.PRIMARY_USER_STORE }/${ value }`,
                                            schemas: [
                                                "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
                                            ],
                                            startIndex: 1
                                        };

                                        await searchGroupList(searchData).then(response => {
                                            if (response?.data?.totalResults !== 0) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(
                                                    t("console:manage.features.roles.addRoleWizard." +
                                                        "forms.roleBasicDetails.roleName.validations.duplicate",
                                                    { type: "Group" })
                                                );
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
                                    }
                                } }
                                value={ (initialValues?.basicDetails?.groupName) }
                                loading={ isRegExLoading }
                            />
                        </GridColumn>
                    </GridRow>
                </Grid>
            </Forms>
            <Heading size="tiny">{ t("console:manage.features.roles.addRoleWizard.wizardSteps.2") }</Heading>
            <AddGroupUsers
                data-testid="new-group"
                isEdit={ false }
                triggerSubmit={ triggerSubmit }
                userStore={ userStore ?? SharedUserStoreConstants.PRIMARY_USER_STORE }
                initialValues={ initialValues?.userList }
                onSubmit={ (values) => setUserList(values) }
            />
        </>
    );
};
