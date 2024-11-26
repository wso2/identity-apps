/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import FormLabel from "@oxygen-ui/react/FormLabel";
import Grid from "@oxygen-ui/react/Grid";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CheckboxFieldAdapter, FinalFormField, FormSpy, TextFieldAdapter } from "@wso2is/form/src";
import { Heading, Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { RemoteUserStoreConstants } from "../../../constants/remote-user-stores-constants";

/**
 * Interface for the group attributes section component props.
 */
interface GroupAttributesSectionPropsInterface extends IdentifiableComponentInterface {
    /**
     * Initial values for the form fields.
     */
    initialValues: Record<string, unknown>;
    /**
     * User store manager type.
     */
    userStoreManager: RemoteUserStoreManagerType;
    /**
     * Read only mode.
     */
    isReadOnly?: boolean;
}

/**
 * Group attributes section component for the remote user store edit page.
 */
const GroupAttributesSection: FunctionComponent<GroupAttributesSectionPropsInterface> = ({
    initialValues = {},
    userStoreManager,
    isReadOnly = false,
    ["data-componentid"]: componentId = "group-attributes-section"
}: GroupAttributesSectionPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const validateGroupnameField = (value: string, allValues: Record<string, unknown>) => {
        const userStoreProperties: Record<string, string | boolean> =
            allValues["userstore-properties"] as Record<string, string | boolean>;

        if (userStoreProperties?.ReadGroups as boolean && isEmpty(value)) {
            return t("remoteUserStores:form.fields.groupnameMapping.validation.required");
        }

        return undefined;
    };

    const validateGroupIdField = (value: string, allValues: Record<string, unknown>) => {
        const userStoreProperties: Record<string, string | boolean> =
            allValues["userstore-properties"] as Record<string, string | boolean>;

        if (userStoreProperties?.ReadGroups as boolean && isEmpty(value)) {
            return t("remoteUserStores:form.fields.groupIdMapping.validation.required");
        }

        return undefined;
    };

    return (
        <div>
            <Heading as="h3">{ t("remoteUserStores:form.sections.groupAttributes") }</Heading>
            <FormSpy subscription={ { values: true } }>
                { ({ values }: { values: Record<string, unknown> }) => {
                    const userStoreProperties: Record<string, unknown> =
                        values["userstore-properties"] as Record<string, unknown>;
                    const isReadGroupsEnabled: boolean = userStoreProperties?.ReadGroups as boolean;

                    return (
                        <Grid container spacing={ 2 } className="form-grid-container">
                            <Grid xs={ 12 }>
                                <FinalFormField
                                    label={ t("remoteUserStores:form.fields.readGroups.label") }
                                    name={
                                        `userstore-properties.${RemoteUserStoreConstants.PROPERTY_NAME_READ_GROUPS}`
                                    }
                                    FormControlProps={ {
                                        fullWidth: true,
                                        margin: "dense"
                                    } }
                                    data-componentid={ `${componentId}-field-readGroups` }
                                    component={ CheckboxFieldAdapter }
                                    disabled={ isReadOnly }
                                    hint={
                                        (<Hint className="hint" compact>
                                            { t("remoteUserStores:form.fields.readGroups.helperText") }
                                        </Hint>)
                                    }
                                    initialValue={ initialValues[
                                        RemoteUserStoreConstants.PROPERTY_NAME_READ_GROUPS] === "true" }
                                />
                            </Grid>

                            { userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager && (
                                <>
                                    <Grid xs={ 12 } lg={ 5 } xl={ 4 }>
                                        <FormLabel
                                            required={
                                                isReadGroupsEnabled &&
                                                userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager
                                            }
                                            disabled={ isReadOnly || !isReadGroupsEnabled }
                                        >
                                            { t("remoteUserStores:form.fields.groupnameMapping.label") }
                                        </FormLabel>
                                    </Grid>
                                    <Grid xs={ 12 } lg={ 6 } xl={ 4 }>
                                        <FinalFormField
                                            FormControlProps={ {
                                                margin: "dense"
                                            } }
                                            data-componentid={ `${componentId}-field-groupnameMapping` }
                                            name={
                                                `userstore-properties.${
                                                    RemoteUserStoreConstants.PROPERTY_NAME_GROUPNAME}`
                                            }
                                            type="text"
                                            placeholder={ t(
                                                "remoteUserStores:form.fields.groupnameMapping.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            disabled={ isReadOnly || !isReadGroupsEnabled }
                                            helperText={
                                                (<Hint className="hint" compact>
                                                    { t("remoteUserStores:form.fields.groupnameMapping.helperText") }
                                                </Hint>)
                                            }
                                            initialValue={
                                                initialValues[RemoteUserStoreConstants.PROPERTY_NAME_GROUPNAME]
                                            }
                                            validate={ validateGroupnameField }
                                        />
                                    </Grid>
                                    <Grid />

                                    <Grid xs={ 12 } lg={ 5 } xl={ 4 }>
                                        <FormLabel
                                            required={
                                                isReadGroupsEnabled &&
                                                userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager
                                            }
                                            disabled={ isReadOnly || !isReadGroupsEnabled }
                                        >
                                            { t("remoteUserStores:form.fields.groupIdMapping.label") }
                                        </FormLabel>
                                    </Grid>
                                    <Grid xs={ 12 } lg={ 6 } xl={ 4 }>
                                        <FinalFormField
                                            FormControlProps={ {
                                                margin: "dense"
                                            } }
                                            ariaLabel="groupIdMapping"
                                            data-componentid={ `${componentId}-field-groupIdMapping` }
                                            name={
                                                `userstore-properties.${
                                                    RemoteUserStoreConstants.PROPERTY_NAME_GROUPID}`
                                            }
                                            type="text"
                                            placeholder={ t(
                                                "remoteUserStores:form.fields.groupIdMapping.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            disabled={ isReadOnly || !isReadGroupsEnabled }
                                            helperText={
                                                (<Hint className="hint" compact>
                                                    { t("remoteUserStores:form.fields.groupIdMapping.helperText") }
                                                </Hint>)
                                            }
                                            initialValue={
                                                initialValues[RemoteUserStoreConstants.PROPERTY_NAME_GROUPID]
                                            }
                                            validate={ validateGroupIdField }
                                        />
                                    </Grid>
                                    <Grid />
                                </>
                            ) }
                        </Grid>
                    );
                } }
            </FormSpy>
        </div>
    );
};

export default GroupAttributesSection;
