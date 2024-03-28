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

import { AlertLevels, TestableComponentInterface, UserstoreListResponseInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, Grid, GridColumn, GridRow } from "semantic-ui-react";
import { AddGroupUsers } from "./group-assign-users";
import { UserStoreDetails } from "../../../admin-core-v1";
import { SharedUserStoreConstants } from "../../../admin-core-v1/constants";
import { SharedUserStoreUtils } from "../../../admin-core-v1/utils";
// TODO: Remove this once the api is updated.
import { RootOnlyComponent } from "../../../organizations/components";
import { useGetCurrentOrganizationType } from "../../../organizations/hooks/use-get-organization-type";
import { getUserStoreList } from "../../../admin-userstores-v1/api";
import { UserStoreProperty } from "../../../admin-userstores-v1/models";
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
 * @param props - Group Basic prop types
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

    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState<string>();
    const [ isRegExLoading, setRegExLoading ] = useState<boolean>(false);
    const [ basicDetails, setBasicDetails ] = useState<any>(null);
    const [ userList, setUserList ] = useState<any>(null);

    const { isSuperOrganization, isFirstLevelOrganization } = useGetCurrentOrganizationType();

    const groupName: React.MutableRefObject<HTMLDivElement | undefined> = useRef<HTMLDivElement>();

    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        if (basicDetails && userList) {
            onSubmit({ basicDetails, userList });
        }
    }, [ basicDetails, userList ]);
    /**
     * The following function change of the user stores.
     *
     * @param values - contains values from form elements 
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
     */
    const validateGroupNamePattern = async (): Promise<string> => {

        let userStoreRegEx: string = "";

        if (userStore && userStore !== SharedUserStoreConstants.PRIMARY_USER_STORE.toLocaleLowerCase()) {
            await SharedUserStoreUtils.getUserStoreRegEx(userStore,
                SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.RolenameRegEx)
                .then((response: string) => {
                    setRegExLoading(true);
                    userStoreRegEx = response;
                });
        } else {
            await SharedUserStoreUtils.getPrimaryUserStore().then((response: void | UserStoreDetails) => {
                setRegExLoading(true);
                if (response && response.properties) {
                    userStoreRegEx = response?.properties?.filter((property: UserStoreProperty) => {
                        return property.name === "RolenameJavaScriptRegEx";
                    })[ 0 ].value;
                }
            });
        }

        setRegExLoading(false);

        return new Promise((resolve: (value: string) => void, reject: (reason: string) => void) => {
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
        const storeOptions: DropdownItemProps[] = [
            {
                key: -1,
                text: "Primary",
                value: "primary"
            }
        ];
        let storeOption: DropdownItemProps = {
            key: null,
            text: "",
            value: ""
        };

        setUserStore(storeOptions[ 0 ].value as string);

        if (isSuperOrganization() || isFirstLevelOrganization()) {
            getUserStoreList()
                .then((response: UserstoreListResponseInterface[] | any) => {
                    if (storeOptions.length === 0) {
                        storeOptions.push(storeOption);
                    }
                    response.data.map((store: UserstoreListResponseInterface, index: number) => {
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
        }

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
                onSubmit={ (values: Map<string, FormValue>) => {
                    setBasicDetails(getFormValues(values));
                } }
                submitState={ triggerSubmit }
            >
                <Grid>
                    <GridRow columns={ 2 }>
                        <RootOnlyComponent>
                            <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    data-testid={ `${ testId }-domain-dropdown` }
                                    type="dropdown"
                                    label={ t("roles:addRoleWizard.forms.roleBasicDetails." +
                                        "domain.label.group") }
                                    name="domain"
                                    children={ userStoreOptions }
                                    placeholder={ t("roles:addRoleWizard." +
                                        "forms.roleBasicDetails.domain.placeholder") }
                                    requiredErrorMessage={ t("roles:addRoleWizard.forms." +
                                        "roleBasicDetails.domain.validation.empty.group") }
                                    required={ true }
                                    element={ <div></div> }
                                    listen={ handleDomainChange }
                                    value={ initialValues?.basicDetails?.domain ?? userStoreOptions[ 0 ]?.value }
                                />
                            </GridColumn>
                        </RootOnlyComponent>
                        <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                ref={ groupName }
                                data-testid={ `${ testId }-role-name-input` }
                                type="text"
                                name="groupName"
                                label={ t("roles:addRoleWizard.forms.roleBasicDetails." +
                                    "roleName.label", { type: "Group" }) }
                                placeholder={ t("roles:addRoleWizard.forms." +
                                    "roleBasicDetails.roleName.placeholder", { type: "Group" }) }
                                required={ true }
                                requiredErrorMessage={ t("roles:addRoleWizard.forms." +
                                    "roleBasicDetails.roleName.validations.empty", { type: "Group" }) }
                                validation={ async (value: string, validation: Validation) => {
                                    if (value) {
                                        let isGroupNameValid: boolean = true;

                                        await validateGroupNamePattern().then((regex: string) => {
                                            isGroupNameValid = SharedUserStoreUtils
                                                .validateInputAgainstRegEx(value, regex);
                                        });


                                        if (!isGroupNameValid) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("roles:" +
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

                                        await searchGroupList(searchData).then((response: any) => {
                                            if (response?.data?.totalResults !== 0) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(
                                                    t("roles:addRoleWizard." +
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
            <Heading size="tiny">{ t("roles:addRoleWizard.wizardSteps.2") }</Heading>
            <AddGroupUsers
                data-testid="new-group"
                isEdit={ false }
                triggerSubmit={ triggerSubmit }
                userStore={ userStore ?? SharedUserStoreConstants.PRIMARY_USER_STORE }
                initialValues={ initialValues?.userList }
                onSubmit={ (values: any) => setUserList(values) }
            />
        </>
    );
};
