/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppState } from "@wso2is/admin.core.v1/store";
import { attributeConfig, userstoresConfig } from "@wso2is/admin.extensions.v1";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models/user-stores";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";

/**
 * Prop types of `MappedAttributes` component
 */
interface MappedAttributesPropsInterface extends TestableComponentInterface {
    /**
     * Trigger submit
     */
    submitState: boolean;
    /**
     * Handles update
     */
    onSubmit: (data: any, values: Map<string, FormValue>) => void;
    /**
     * The key values to be stored
     */
    values: Map<string, FormValue>;
}

/**
 * This component renders the Mapped Attributes step of the wizard.
 *
 * @param props - Props injected to the component.
 *
 * @returns Map Attributes component.
 */
export const MappedAttributes: FunctionComponent<MappedAttributesPropsInterface> = (
    props: MappedAttributesPropsInterface
): ReactElement => {

    const {
        onSubmit,
        submitState,
        values,
        [ "data-testid" ]: testId
    } = props;

    const hiddenUserStores: string[] = useSelector((state: AppState) => state.config.ui.hiddenUserStores ?? []);
    const systemReservedUserStores: string[] =
        useSelector((state: AppState) => state.config.ui.systemReservedUserStores ?? []);
    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName ?? userstoresConfig.primaryUserstoreName);

    const { t } = useTranslation();

    const {
        isLoading: isUserStoreListFetchRequestLoading,
        userStoresList
    } = useUserStores();

    const userStore: UserStoreListItem[] = useMemo(() => {
        const userstore: UserStoreListItem[] = [];

        if (attributeConfig.localAttributes.createWizard.showPrimaryUserStore) {
            userstore.push({
                description: "",
                enabled: true,
                id: primaryUserStoreDomainName,
                name: primaryUserStoreDomainName,
                self: ""
            });
        }

        if (!isUserStoreListFetchRequestLoading && userStoresList?.length > 0) {
            userStoresList.forEach((store: UserStoreListItem) => {
                if (
                    store.enabled &&
                    !hiddenUserStores.includes(store.name) &&
                    !systemReservedUserStores?.includes(store.name)
                ) {
                    userstore.push(store);
                }
            });
        }

        return userstore;
    }, [ userStoresList, isUserStoreListFetchRequestLoading ]);

    return (
        <Grid data-testid={ testId }>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 14 }>
                    <h4>{ t("claims:local.wizard." +
                        "steps.mapAttributes") }</h4>
                    <p>
                        { t("claims:local.mappedAttributes.hint") }
                    </p>
                    <Divider hidden />
                    <Divider hidden />
                    <Forms
                        submitState={ submitState }
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const submitData: any = {
                                attributeMapping: Array.from(values).map(
                                    ([ userstore, attribute ]: [ string, FormValue ]) => {
                                        return {
                                            mappedAttribute: attribute,
                                            userstore: userstore
                                        };
                                    })
                            };

                            onSubmit(submitData, values);
                        } }
                    >
                        <Grid>
                            { userStore.map((store: UserStoreListItem, index: number) => {
                                return (
                                    <>
                                        { store?.enabled && (
                                            <Grid.Row columns={ 2 } key={ index }>
                                                <Grid.Column className="centered-text" width={ 4 }>
                                                    { store.name }
                                                </Grid.Column>
                                                <Grid.Column width={ 12 }>
                                                    <Field
                                                        type="text"
                                                        name={ store.name }
                                                        placeholder={ t("claims:local.forms." +
                                                            "attribute.placeholder") }
                                                        required={ true }
                                                        requiredErrorMessage={ t("claims:" +
                                                            "local.forms.attribute.requiredErrorMessage") }
                                                        value={ values?.get(store.name)?.toString() }
                                                        data-testid={ `${ testId }-form-store-name-input` }
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        ) }
                                    </>
                                );
                            }) }
                        </Grid>
                    </Forms>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the application creation wizard.
 */
MappedAttributes.defaultProps = {
    "data-testid": "mapped-attributes"
};
