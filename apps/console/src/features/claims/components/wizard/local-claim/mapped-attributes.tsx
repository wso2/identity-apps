/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { attributeConfig } from "../../../../../extensions";
import { AppState, store } from "../../../../core";
import { UserStoreListItem } from "../../../../userstores";
import { getUserStoreList } from "../../../../userstores/api";

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
 * @param {MappedAttributesPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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

    const [ userStore, setUserStore ] = useState<UserStoreListItem[]>([]);
    const hiddenUserStores: string[] = useSelector((state: AppState) => state.config.ui.hiddenUserStores);

    const { t } = useTranslation();

    useEffect(() => {
        const userstore: UserStoreListItem[] = [];

        if (attributeConfig.localAttributes.createWizard.showPrimaryUserStore) {
            userstore.push({
                description: "",
                enabled: true,
                id: "PRIMARY",
                name: "PRIMARY",
                self: ""
            });
        }
        getUserStoreList(store.getState().config.endpoints.userStores).then((response) => {
            if (hiddenUserStores && hiddenUserStores.length > 0) {
                response.data.map((store: UserStoreListItem) => {
                    if (hiddenUserStores.length > 0 && !hiddenUserStores.includes(store.name)) {
                        userstore.push(store);
                    }
                });
            } else {
                userstore.push(...response.data);
            }
            setUserStore(userstore);
        }).catch(() => {
            setUserStore(userstore);
        });
    }, []);

    return (
        <Grid data-testid={ testId }>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 14 }>
                    <h4>{ t("console:manage.features.claims.local.wizard." +
                        "steps.mapAttributes") }</h4>
                    <p>
                        { t("console:manage.features.claims.local.mappedAttributes.hint") }
                    </p>
                    <Divider hidden />
                    <Divider hidden />
                    <Forms
                        submitState={ submitState }
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const submitData = {
                                attributeMapping: Array.from(values).map(([ userstore, attribute ]) => {
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
                                                        placeholder={ t("console:manage.features.claims.local.forms." +
                                                            "attribute.placeholder") }
                                                        required={ true }
                                                        requiredErrorMessage={ t("console:manage.features.claims." +
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
