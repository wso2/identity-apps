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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { ConfirmationModal, DangerZone, EmphasizedSegment, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { DangerZoneGroup } from "@wso2is/react-components/src";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid, Icon } from "semantic-ui-react";
import { SqlEditor } from "..";
import { deleteUserStore, patchUserStore, updateUserStore } from "../../../api";
import { RequiredBinary, TypeProperty, UserStore } from "../../../models";

/**
 * Prop types of `EditBasicDetailsUserStore` component
 */
interface EditBasicDetailsUserStorePropsInterface extends TestableComponentInterface {
    /**
     * Userstore to be edited
     */
    userStore: UserStore;
    /**
     * Initiates an update
     */
    update: () => void;
    /**
     * userstore id
     */
    id: string;
    /**
     * The connection properties.
     */
    properties: RequiredBinary;
}

/**
 * This renders the edit basic details pane.
 *
 * @param {EditBasicDetailsUserStorePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EditBasicDetailsUserStore: FunctionComponent<EditBasicDetailsUserStorePropsInterface> = (
    props: EditBasicDetailsUserStorePropsInterface
): ReactElement => {

    const {
        userStore,
        update,
        id,
        properties,
        [ "data-testid" ]: testId
    } = props;

    const [ sql, setSql ] = useState<Map<string, string>>(null);
    const [ showMore, setShowMore ] = useState(false);
    const [ confirmDelete, setConfirmDelete ] = useState(false);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (properties) {
            const tempSql = new Map<string, string>();

            properties.optional.sql.delete.forEach(property => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.insert.forEach(property => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.select.forEach(property => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.update.forEach(property => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            setSql(tempSql);
        }
    }, [ properties ]);

    const deleteConfirmation = (): ReactElement => (
        <ConfirmationModal
            onClose={ (): void => setConfirmDelete(false) }
            type="warning"
            open={ confirmDelete }
            assertion={ userStore?.name }
            assertionHint={
                <p>
                    <Trans i18nKey="adminPortal:components.userstores.confirmation.hint">
                        Please type
                        <strong data-testid={ `${ testId }-delete-confirmation-modal-assertion` }>
                            { { name: userStore?.name } }
                        </strong > to confirm.
                    </Trans>
                </p>
            }
            assertionType="input"
            primaryAction={ t("adminPortal:components.userstores.confirmation.confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ (): void => setConfirmDelete(false) }
            onPrimaryActionClick={ (): void => {
                deleteUserStore(id)
                    .then(() => {
                        dispatch(addAlert({
                            description: t("adminPortal:components.userstores.notifications." +
                                "deleteUserstore.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("adminPortal:components.userstores.notifications." +
                                "deleteUserstore.success.message")

                        }));
                        dispatch(addAlert({
                            description: t("adminPortal:components.userstores.notifications." +
                                "delay.description"),
                            level: AlertLevels.WARNING,
                            message: t("adminPortal:components.userstores.notifications." +
                                "delay.message")
                        }));
                        update();
                    })
                    .catch(error => {
                        dispatch(addAlert({
                            description: error?.description
                                ?? t("adminPortal:components.userstores.notifications." +
                                    "deleteUserstore.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: error?.message ?? t("adminPortal:components.userstores.notifications." +
                                "deleteUserstore.genericError.message")
                        }));
                    }).finally(() => {
                        setConfirmDelete(false);
                    });
            } }
            data-testid={ `${ testId }-delete-confirmation-modal` }
        >
            <ConfirmationModal.Header
                data-testid={ `${ testId }-delete-confirmation-modal-header` }
            >
                { t("adminPortal:components.userstores.confirmation.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-testid={ `${ testId }-delete-confirmation-modal-message` }
            >
                { t("adminPortal:components.userstores.confirmation.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-delete-confirmation-modal-content` }
            >
                { t("adminPortal:components.userstores.confirmation.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    const onSubmitHandler = (values: Map<string, FormValue>): void => {
        const data = { ...userStore };
        data.description = values.get("description").toString();
        data.name = values.get("name").toString();
        delete data.typeName;
        delete data.className;

        const requiredData = properties?.required.map((property: TypeProperty) => {
            return {
                operation: "REPLACE",
                path: `/properties/${property.name}`,
                value: values.get(property.name).toString()
            }
        });

        const optionalNonSqlData = showMore
            ? properties?.optional.nonSql.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: values.get(property.name).toString()
                }
            })
            : null;

        const optionalSqlInsertData = showMore
            ? properties?.optional.sql.insert.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                }
            })
            : null;

        const optionalSqlUpdateData = showMore
            ? properties?.optional.sql.update.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                }
            })
            : null;

        const optionalSqlDeleteData = showMore
            ? properties?.optional.sql.delete.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                }
            })
            : null;

        const optionalSqlSelectData = showMore
            ? properties?.optional.sql.select.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                }
            })
            : null;

        const patchData = showMore
            ? [
                ...requiredData,
                ...optionalNonSqlData,
                ...optionalSqlDeleteData,
                ...optionalSqlInsertData,
                ...optionalSqlUpdateData,
                ...optionalSqlSelectData
            ]
            : requiredData;

        updateUserStore(id, data).then(() => {
            patchUserStore(id, patchData).then(() => {
                dispatch(addAlert({
                    description: t("adminPortal:components.userstores.notifications." +
                        "updateUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("adminPortal:components.userstores.notifications." +
                        "updateUserstore.success.message")
                }));
                update();
            }).catch(error => {
                dispatch(addAlert({
                    description: error?.description
                        || t("adminPortal:components.userstores.notifications." +
                            "updateUserstore.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("adminPortal:components.userstores.notifications." +
                        "updateUserstore.genericError.message")
                }));
            });
        }).catch((error) => {
            dispatch(addAlert({
                description: error?.description ?? t("adminPortal:components.userstores.notifications." +
                    "updateUserstore.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.message ?? t("adminPortal:components.userstores.notifications." +
                    "updateUserstore.genericError.message")
            }));
        });
    };

    return (
        <>
            { confirmDelete && deleteConfirmation() }
            <EmphasizedSegment>
                <Forms
                    onSubmit={ onSubmitHandler }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 8 }>
                                <Field
                                    label={ t("adminPortal:components.userstores.forms.general.name.label") }
                                    name="name"
                                    type="text"
                                    required={ false }
                                    requiredErrorMessage={ t("adminPortal:components.userstores.forms.general." +
                                        "name.requiredErrorMessage") }
                                    placeholder={ t("adminPortal:components.userstores.forms.general.name" +
                                        ".placeholder") }
                                    value={ userStore?.name }
                                    disabled
                                    data-testid={ `${ testId }-form-name-input` }
                                />
                                <Field
                                    label={ t("adminPortal:components.userstores.forms.general.type.label") }
                                    name="type"
                                    type="text"
                                    disabled
                                    required={ false }
                                    requiredErrorMessage={ t("adminPortal:components.userstores.forms.general" +
                                        ".type.requiredErrorMessage") }
                                    value={ userStore?.typeName }
                                    data-testid={ `${ testId }-form-type-input` }
                                />
                                <Field
                                    label={ t("adminPortal:components.userstores.forms.general.description.label") }
                                    name="description"
                                    type="textarea"
                                    required={ false }
                                    requiredErrorMessage=""
                                    placeholder={ t("adminPortal:components.userstores.forms.general." +
                                        "description.placeholder") }
                                    value={ userStore?.description }
                                    data-testid={ `${ testId }-form-description-textarea` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 8 }>
                                {
                                    properties?.required?.map((property: TypeProperty, index: number) => {
                                        const name = property.description.split("#")[ 0 ];
                                        const isPassword = property.attributes
                                            .find(attribute => attribute.name === "type").value === "password";
                                        const toggle = property.attributes
                                            .find(attribute => attribute.name === "type")?.value === "boolean";
    
                                        return (
                                            isPassword
                                                ? (
                                                    <Field
                                                        name={ property.name }
                                                        type="password"
                                                        key={ index }
                                                        required={ true }
                                                        label={ name }
                                                        requiredErrorMessage={
                                                            t("adminPortal:components.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                        }
                                                        placeholder={
                                                            t("adminPortal:components.userstores.forms." +
                                                                "custom.placeholder",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                        }
                                                        showPassword={ t("common:showPassword") }
                                                        hidePassword={ t("common:hidePassword") }
                                                        data-testid={ `${ testId }-form-password-input-${
                                                            property.name }` }
                                                    />
                                                )
                                                : toggle
                                                    ? (
                                                        <Field
                                                            name={ property.name }
                                                            value={ property.value ?? property.defaultValue }
                                                            type="toggle"
                                                            key={ index }
                                                            required={ false }
                                                            label={ property.description.split("#")[ 0 ] }
                                                            requiredErrorMessage={
                                                                t("adminPortal:components.userstores.forms." +
                                                                    "custom.requiredErrorMessage",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                            }
                                                            placeholder={
                                                                t("adminPortal:components.userstores.forms." +
                                                                    "custom.placeholder",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                            }
                                                            toggle
                                                            data-testid={ `${ testId }-form-toggle-${ property.name }` }
                                                        />
                                                    ) :
                                                    (
                                                        <Field
                                                            name={ property.name }
                                                            value={ property.value ?? property.defaultValue }
                                                            type="text"
                                                            key={ index }
                                                            required={ true }
                                                            label={ property.description.split("#")[ 0 ] }
                                                            requiredErrorMessage={
                                                                t("adminPortal:components.userstores.forms." +
                                                                    "custom.requiredErrorMessage",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                            }
                                                            placeholder={
                                                                t("adminPortal:components.userstores.forms." +
                                                                    "custom.placeholder",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                            }
                                                            data-testid={ `${ testId }-form-text-input-${
                                                                property.name }` }
                                                        />
                                                    )
                                        );
                                    })
                                }
                            </Grid.Column>
                        </Grid.Row>
                        {
                            properties?.optional.nonSql.length > 0
                            || properties?.optional.sql.delete.length > 0
                            || properties?.optional.sql.insert.length > 0
                            || properties?.optional.sql.select.length > 0
                            || properties?.optional.sql.update.length > 0
                            &&
                            (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column width={ 8 } textAlign="center">
                                        <LinkButton
                                            type="button"
                                            onClick={ () => { setShowMore(!showMore) } }
                                            data-testid={ `${ testId }-show-more-button` }
                                        >
                                            <Icon name={ showMore ? "chevron up" : "chevron down" } />
                                            { showMore ? t("common:showLess") : t("common:showMore") }
                                        </LinkButton>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        { showMore && properties?.optional.nonSql.length > 0 && (
                            <Grid>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column width={ 8 }>
                                        {
                                            properties?.optional?.nonSql
                                                .map((property: TypeProperty, index: number) => {

                                                const name = property.description.split("#")[ 0 ];
                                                const isPassword = property.attributes
                                                    .find(attribute => attribute.name === "type").value === "password";
                                                const toggle = property.attributes
                                                    .find(attribute => attribute.name === "type")?.value === "boolean";
    
                                                return (
                                                    isPassword
                                                        ? (
                                                            <Field
                                                                name={ property.name }
                                                                type="password"
                                                                key={ index }
                                                                required={ false }
                                                                label={ name }
                                                                requiredErrorMessage={
                                                                    t("adminPortal:components.userstores.forms." +
                                                                        "custom.requiredErrorMessage",
                                                                        {
                                                                            name: property.description.split("#")[ 0 ]
                                                                        })
                                                                }
                                                                placeholder={
                                                                    t("adminPortal:components.userstores.forms." +
                                                                        "custom.placeholder",
                                                                        {
                                                                            name: property.description.split("#")[ 0 ]
                                                                        })
                                                                }
                                                                showPassword={ t("common:showPassword") }
                                                                hidePassword={ t("common:hidePassword") }
                                                                data-testid={
                                                                    `${ testId }-form-non-sql-password-input-${
                                                                        property.name }`
                                                                }
                                                            />
                                                        )
                                                        : toggle
                                                            ? (
                                                                <Field
                                                                    name={ property.name }
                                                                    value={ property.value ?? property.defaultValue }
                                                                    type="toggle"
                                                                    key={ index }
                                                                    required={ false }
                                                                    label={ property.description.split("#")[ 0 ] }
                                                                    requiredErrorMessage={
                                                                        t("adminPortal:components.userstores.forms." +
                                                                            "custom.requiredErrorMessage",
                                                                            {
                                                                                name: property.description
                                                                                    .split("#")[ 0 ]
                                                                            })
                                                                    }
                                                                    placeholder={
                                                                        t("adminPortal:components.userstores.forms." +
                                                                            "custom.placeholder",
                                                                            {
                                                                                name: property.description
                                                                                    .split("#")[ 0 ]
                                                                            })
                                                                    }
                                                                    toggle
                                                                    data-testid={
                                                                        `${ testId }-form-non-sql-toggle-${
                                                                            property.name }`
                                                                    }
                                                                />
                                                            )
                                                            : (
                                                                <Field
                                                                    name={ property.name }
                                                                    value={ property.value ?? property.defaultValue }
                                                                    type="text"
                                                                    key={ index }
                                                                    required={ false }
                                                                    label={ property.description.split("#")[ 0 ] }
                                                                    requiredErrorMessage={
                                                                        t("adminPortal:components.userstores.forms." +
                                                                            "custom.requiredErrorMessage",
                                                                            {
                                                                                name: property.description
                                                                                    .split("#")[ 0 ]
                                                                            })
                                                                    }
                                                                    placeholder={
                                                                        t("adminPortal:components.userstores.forms." +
                                                                            "custom.placeholder",
                                                                            {
                                                                                name: property.description
                                                                                    .split("#")[ 0 ]
                                                                            })
                                                                    }
                                                                    data-testid={
                                                                        `${ testId }-form-non-sql-text-input-${
                                                                            property.name }`
                                                                    }
                                                                />
                                                            )
                                                );
                                            })
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        )
                        }
                        {
                            properties?.optional.sql.delete.length > 0
                            || properties?.optional.sql.insert.length > 0
                            || properties?.optional.sql.select.length > 0
                            || properties?.optional.sql.update.length > 0
                            && (
                                <Grid columns={ 1 }>
                                    <Grid.Column width={ 16 }>
                                        <SqlEditor
                                            onChange={ (name: string, value: string) => {
                                                const tempSql = new Map(sql);
                                                tempSql.set(name, value);
                                                setSql(tempSql);
                                            } }
                                            properties={ properties?.optional.sql }
                                            values={ sql }
                                            data-testid={ `${ testId }-sql-editor` }
                                        />
                                    </Grid.Column>
                                </Grid>
                            )
                        }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 8 }>
                                <PrimaryButton data-testid={ `${ testId }-form-submit-button` }>
                                    { t("common:update") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            </EmphasizedSegment>

            <Divider hidden />

            <Grid columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <DangerZoneGroup
                        sectionHeader={ t("common:dangerZone") }
                        ata-testid={ `${ testId }-danger-zone-group` }
                    >
                        <DangerZone
                            actionTitle={ t("adminPortal:components.userstores.dangerZone.actionTitle") }
                            header={ t("adminPortal:components.userstores.dangerZone.header") }
                            subheader={ t("adminPortal:components.userstores.dangerZone.subheader") }
                            onActionClick={ () => setConfirmDelete(true) }
                            data-testid={ `${ testId }-delete-danger-zone` }
                        />
                    </DangerZoneGroup>
                </Grid.Column>
            </Grid>
        </>
    )
};

/**
 * Default props for the component.
 */
EditBasicDetailsUserStore.defaultProps = {
    "data-testid": "userstore-basic-details-edit"
};
