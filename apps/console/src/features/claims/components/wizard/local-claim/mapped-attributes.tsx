/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { attributeConfig } from "../../../../../extensions";
import { AppState } from "../../../../core";
import { getUserStoreList } from "../../../../userstores/api";
import { UserStoreListItem } from "../../../../userstores/models/user-stores";

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
        getUserStoreList().then((response: AxiosResponse) => {
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
