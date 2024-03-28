/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, IdentifiableComponentInterface, RoleGroupsInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, Heading } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import { EditRoleFederatedGroupsAccordion } from "./edit-role-federated-groups-accordion";
import { EditRoleLocalGroupsAccordion } from "./edit-role-local-groups-accordion";
import { useGetApplication } from "../../../admin-applications-v1/api/use-get-application";
import { AuthenticationStepInterface, AuthenticatorInterface } from "../../../admin-applications-v1/models/application";
import { AuthenticatorManagementConstants } from "../../../admin-connections-v1/constants/autheticator-constants";
import {
    PatchGroupAddOpInterface,
    PatchGroupRemoveOpInterface
} from "../../../admin-groups-v1";
import { useIdentityProviderList } from "../../../identity-providers/api/identity-provider";
import { IdentityProviderInterface, StrictIdentityProviderInterface } from "../../../identity-providers/models";
import { updateRoleDetails } from "../../api";
import { RoleAudienceTypes, Schemas } from "../../constants";
import { PatchRoleDataInterface, RoleEditSectionsInterface } from "../../models/roles";
import { RoleManagementUtils } from "../../utils";

type RoleGroupsPropsInterface = IdentifiableComponentInterface & RoleEditSectionsInterface;

export const RoleGroupsList: FunctionComponent<RoleGroupsPropsInterface> = (
    props: RoleGroupsPropsInterface
): ReactElement => {

    const {
        role,
        onRoleUpdate,
        isReadOnly,
        tabIndex
    } = props;

    const roleAudience: string = role.audience?.type?.toUpperCase();
    const assignedGroups: Map<string, RoleGroupsInterface[]> = RoleManagementUtils
        .getRoleGroupsGroupedByIdp(role?.groups);
    const LOCAL_GROUPS_IDENTIFIER_ID: string = "LOCAL";

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ filteredIdpList, setFilteredIdpList ] = useState<IdentityProviderInterface[]>([]);
    const [ selectedGroupsIds, setSelectedGroupsIds ] = useState<Map<string, string[]>>(new Map<string, string[]>());
    const [ removedGroupsIds, setRemovedGroupsIds ] = useState<Map<string, string[]>>(new Map<string, string[]>());
    const [ expandedGroupIndex, setExpandedGroupIndex ] = useState<string>(LOCAL_GROUPS_IDENTIFIER_ID);

    const {
        data: idpList,
        isLoading: isIdPListRequestLoading,
        error: idpListError
    } = useIdentityProviderList(null, null, null, "federatedAuthenticators", true);

    const {
        data: applicationData,
        isLoading: isApplicationRequestLoading,
        error: applicationRequestError
    } = useGetApplication(role.audience?.value, roleAudience === RoleAudienceTypes.APPLICATION);

    const excludedIDPs: string[] = [
        AuthenticatorManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID,
        AuthenticatorManagementConstants.LEGACY_EMAIL_OTP_AUTHENTICATOR_ID,
        AuthenticatorManagementConstants.LEGACY_SMS_OTP_AUTHENTICATOR_ID
    ];

    /**
     * Filter out the IDPs.
     */
    useEffect(() => {
        if (isIdPListRequestLoading || idpListError) {
            return;
        }

        if (roleAudience === RoleAudienceTypes.APPLICATION
            && (isApplicationRequestLoading || applicationRequestError)) {
            return;
        }

        const filteredList: StrictIdentityProviderInterface[] = idpList?.identityProviders?.filter(
            (provider: StrictIdentityProviderInterface) => {
                return !excludedIDPs.includes(provider.federatedAuthenticators.defaultAuthenticatorId);
            }
        );

        // If the role is an application role, filter out the IDPs that are configured for the application.
        if (roleAudience === RoleAudienceTypes.APPLICATION) {
            const applicationIDPList: StrictIdentityProviderInterface[] = [];

            applicationData.authenticationSequence.steps.forEach((step: AuthenticationStepInterface) => {
                step.options.forEach((option: AuthenticatorInterface) => {
                    const idp: StrictIdentityProviderInterface = filteredList?.find(
                        (idp: StrictIdentityProviderInterface) => idp.name === option.idp);

                    if (idp) {
                        applicationIDPList.push(idp);
                    }
                });
            });
            setFilteredIdpList(applicationIDPList);
        } else {
            setFilteredIdpList(filteredList);
        }
    }, [ isIdPListRequestLoading, idpListError, isApplicationRequestLoading, applicationRequestError ]);

    /**
     * Handles the change of the selected groups list.
     *
     * @param idpID - Identity provider ID.
     * @param selectedGroupsIDs - List of selected groups IDs.
     * @param removedGroupsIDs - List of removed groups IDs.
     */
    const onSelectedGroupsChange = (idpID: string, selectedGroupsIDs: string[], removedGroupsIDs: string[]) => {
        setSelectedGroupsIds((prevState: Map<string, string[]>) => {
            const newState: Map<string, string[]> = new Map<string, string[]>(prevState);

            newState.set(idpID ?? LOCAL_GROUPS_IDENTIFIER_ID, selectedGroupsIDs);

            return newState;
        });

        setRemovedGroupsIds((prevState: Map<string, string[]>) => {
            const newState: Map<string, string[]> = new Map<string, string[]>(prevState);

            newState.set(idpID ?? LOCAL_GROUPS_IDENTIFIER_ID, removedGroupsIDs);

            return newState;
        });
    };

    /**
     * Listener for the group accordion expansion.
     *
     * @param idpID - Identity provider ID.
     * @param isExpanded - Is the accordion expanded.
     */
    const onGroupAccordionExpanded = (idpID: string, isExpanded: boolean) => {
        if (!isExpanded) {
            setExpandedGroupIndex(undefined);
        } else {
            setExpandedGroupIndex(idpID);
        }
    };

    /**
     * Handles the update of the groups list.
     */
    const onGroupsUpdate = (): void => {
        setIsSubmitting(true);
        const groupIDsToBeRemoved: string[] = [];

        removedGroupsIds?.forEach((groupIDs: string[]) => {
            if (groupIDs?.length > 0) {
                groupIDsToBeRemoved.push(...groupIDs);
            }
        });

        const groupIDsToBeAdded: string[] = [];
        const flattenedSelectedGroupsIds: string[][] = Array.from(selectedGroupsIds.values());

        flattenedSelectedGroupsIds.forEach((groupIDs: string[]) => {
            groupIDs?.forEach((groupID: string) => {
                if (!role.groups?.find((group: RoleGroupsInterface) => group.value === groupID)) {
                    groupIDsToBeAdded.push(groupID);
                }
            });
        });

        const patchOperations: PatchGroupAddOpInterface[] | PatchGroupRemoveOpInterface[] = [];

        patchOperations.push({
            "op": "add",
            "value": {
                "groups": groupIDsToBeAdded?.map((groupID: string) => {
                    return {
                        "value": groupID
                    };
                })
            }
        });

        groupIDsToBeRemoved.forEach((groupID: string) => {
            patchOperations.push({
                "op": "remove",
                "path": `groups[value eq ${ groupID }]`
            });
        });

        const roleUpdateData: PatchRoleDataInterface = {
            Operations: patchOperations,
            schemas: [ Schemas.PATCH_OP ]
        };

        updateRoleDetails(role.id, roleUpdateData)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("roles:edit.groups.notifications.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("roles:edit.groups.notifications.success.message")
                    })
                );
                onRoleUpdate(tabIndex);
            })
            .catch( (error: AxiosError) => {
                if (error.response && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description:
                                t("roles:edit.groups.notifications.error.description",
                                    { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: t("roles:edit.groups.notifications.error.message")
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: t("roles:edit.groups.notifications.genericError" +
                                ".description"),
                            level: AlertLevels.ERROR,
                            message: t("roles:edit.groups.notifications.genericError.message")
                        })
                    );
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <EmphasizedSegment padded="very">
            <Heading as="h4">
                { t("roles:edit.groups.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("roles:edit.groups.subHeading") }
            </Heading>
            <Heading as="h5">
                { t("roles:edit.groups.localGroupsHeading") }
            </Heading>
            {
                <EditRoleLocalGroupsAccordion
                    key={ "role-group-accordion-local" }
                    isReadOnly={ isReadOnly }
                    onUpdate={ onGroupsUpdate }
                    initialSelectedGroups={ assignedGroups[LOCAL_GROUPS_IDENTIFIER_ID] }
                    onSelectedGroupsListChange={ onSelectedGroupsChange }
                    isUpdating={ isSubmitting }
                />
            }
            {
                filteredIdpList?.length > 0 && (
                    <>
                        <Divider hidden />
                        <Divider />
                        <Heading as="h5">
                            { t("roles:edit.groups.externalGroupsHeading") }
                        </Heading>
                    </>
                )
            }
            { filteredIdpList?.map((idp: IdentityProviderInterface) => {
                const initialSelectedGroupsOptions: RoleGroupsInterface[] = assignedGroups[idp.id];

                return (
                    <EditRoleFederatedGroupsAccordion
                        key={ `role-group-accordion-${idp.id}` }
                        isReadOnly={ isReadOnly }
                        onUpdate={ onGroupsUpdate }
                        initialSelectedGroups={ initialSelectedGroupsOptions }
                        identityProvider={ idp }
                        onSelectedGroupsListChange={ onSelectedGroupsChange }
                        isExpanded={ expandedGroupIndex === idp.id }
                        onExpansionChange={ onGroupAccordionExpanded }
                        isUpdating={ isSubmitting }
                    />
                );
            }) }
        </EmphasizedSegment>
    );
};

/**
 * Default props for application roles tab component.
 */
RoleGroupsList.defaultProps = {
    "data-componentid": "edit-role-group"
};
