/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { EmphasizedSegment, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon } from "semantic-ui-react";
import { SqlEditor } from "..";
import { userstoresConfig } from "../../../../extensions";
import { patchUserStore } from "../../api";
import { CONSUMER_USERSTORE_ID } from "../../constants";
import { PatchData, PropertyAttribute, RequiredBinary, TypeProperty, UserstoreType } from "../../models";

/**
 * Prop types of `EditGroupDetails` component
 */
interface EditGroupDetailsPropsInterface extends TestableComponentInterface {
    /**
     * Initiates an update
     */
    update: () => void;
    /**
     * userstore id
     */
    id: string;
    /**
     * The type meta data
     */
    type: UserstoreType;
    /**
     * The connection properties.
     */
    properties: RequiredBinary;
    /**
     * Readonly attribute for the component.
     */
    readOnly?: boolean;
}

/**
 * This renders the edit userstore group details pane.
 *
 * @param props - Props injected to the component.
 *
 * @returns Edit userstore group details component.
 */
export const EditGroupDetails: FunctionComponent<EditGroupDetailsPropsInterface> = (
    props: EditGroupDetailsPropsInterface
): ReactElement => {

    const {
        id,
        properties,
        readOnly,
        update,
        [ "data-testid" ]: testId
    } = props;

    const [ showMore, setShowMore ] = useState(false);
    const [ disabled, setDisabled ] = useState(true);
    const [ sql, setSql ] = useState<Map<string, string>>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    useEffect(() => {
        if (properties) {
            const tempSql: Map<string,string> = new Map<string, string>();

            properties.optional.sql.delete.forEach((property: TypeProperty) => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.insert.forEach((property: TypeProperty) => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.select.forEach((property: TypeProperty) => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.update.forEach((property: TypeProperty) => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            setSql(tempSql);
        }
    }, [ properties ]);

    useEffect(() => {
        if (properties) {
            const master: TypeProperty = properties?.required.find((property: TypeProperty) =>
                property.name === "ReadGroups");

            setDisabled(!(master?.value === "true"));
        }
    }, [ properties ]);

    const onSubmitHandler = (values: Map<string, FormValue>): void => {
        const requiredData: PatchData[] = properties?.required.map((property: TypeProperty) => {
            return {
                operation: "REPLACE",
                path: `/properties/${property.name}`,
                value: values.get(property.name)?.toString()
            };
        });

        const optionalNonSqlData: PatchData[] = showMore
            ? properties?.optional.nonSql.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: values.get(property.name)?.toString()
                };
            })
            : null;

        const optionalSqlInsertData: PatchData[] = showMore
            ? properties?.optional.sql.insert.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name)?.toString()
                };
            })
            : null;

        const optionalSqlUpdateData: PatchData[] = showMore
            ? properties?.optional.sql.update.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name)?.toString()
                };
            })
            : null;

        const optionalSqlDeleteData: PatchData[] = showMore
            ? properties?.optional.sql.delete.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name)?.toString()
                };
            })
            : null;

        const optionalSqlSelectData: PatchData[] = showMore
            ? properties?.optional.sql.select.map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name)?.toString()
                };
            })
            : null;

        const data: PatchData[] = showMore
            ? [
                ...requiredData,
                ...optionalNonSqlData,
                ...optionalSqlDeleteData,
                ...optionalSqlInsertData,
                ...optionalSqlUpdateData,
                ...optionalSqlSelectData
            ]
            : requiredData;

        setIsSubmitting(true);

        patchUserStore(id, data)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.userstores.notifications." +
                        "updateUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.userstores.notifications." +
                        "updateUserstore.success.message")
                }));

                // ATM, userstore operations run as an async task in the backend. Hence, The changes aren't
                // applied at once. As a temp solution, a notification informing the delay is shown here.
                // See https://github.com/wso2/product-is/issues/9767 for updates on the backend improvement.
                // TODO: Remove delay notification and fetch the new updates once backend is fixed.
                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.userstores.notifications.updateDelay.description"),
                    level: AlertLevels.WARNING,
                    message: t("console:manage.features.userstores.notifications.updateDelay.message")
                }));

                // Re-fetch the userstore details
                update();
            })
            .catch((error: IdentityAppsError) => {
                dispatch(addAlert<AlertInterface>({
                    description: error?.description
                        || t("console:manage.features.userstores.notifications." +
                            "updateUserstore.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("console:manage.features.userstores.notifications." +
                        "updateUserstore.genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <EmphasizedSegment padded="very">
            <Forms
                onSubmit={ onSubmitHandler }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 8 }>
                            {
                                properties?.required?.map((property: TypeProperty, index: number) => {
                                    const name: string = property.description.split("#")[ 0 ];
                                    const isPassword: boolean = property.attributes
                                        .find((attribute: PropertyAttribute) =>
                                            attribute.name === "type").value === "password";
                                    const toggle: boolean = property.attributes
                                        .find((attribute: PropertyAttribute) =>
                                            attribute.name === "type")?.value === "boolean";
                                    const master: boolean = property.name === "ReadGroups";

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
                                                        `${property.description.split("#")[ 0 ]} is  required`
                                                    }
                                                    showPassword={ t("common:showPassword") }
                                                    hidePassword={ t("common:hidePassword") }
                                                    placeholder={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.placeholder",
                                                        {
                                                            name: property.description.split("#")[ 0 ]
                                                        })
                                                    }
                                                    data-testid={ `${ testId }-form-password-input-${ property.name }` }
                                                    disabled={ readOnly }
                                                />
                                            )
                                            : toggle
                                                ? (id !== CONSUMER_USERSTORE_ID)
                                                && (
                                                    master
                                                        ? (
                                                            <Field
                                                                name={ property.name }
                                                                value={ property.value ?? property.defaultValue }
                                                                type="toggle"
                                                                key={ index }
                                                                required={ false }
                                                                label={ property.description.split("#")[ 0 ] }
                                                                requiredErrorMessage={
                                                                    t("console:manage.features.userstores.forms." +
                                                                    "custom.requiredErrorMessage",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                                }
                                                                listen={ (values: Map<string, FormValue>) => {
                                                                    setDisabled(
                                                                        values.get(property.name)
                                                                            .toString() === "false"
                                                                    );
                                                                } }
                                                                toggle
                                                                placeholder={
                                                                    t("console:manage.features.userstores.forms." +
                                                                    "custom.placeholder",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                                }
                                                                data-testid={ `${ testId }-form-toggle-master-${
                                                                    property.name }` }
                                                                disabled={ readOnly }
                                                            />
                                                        )
                                                        : (
                                                            <Field
                                                                name={ property.name }
                                                                value={ property.value ?? property.defaultValue }
                                                                type="toggle"
                                                                key={ index }
                                                                required={ false }
                                                                label={ property.description.split("#")[ 0 ] }
                                                                requiredErrorMessage={
                                                                    t("console:manage.features.userstores.forms.edit." +
                                                                        "custom.requiredErrorMessage",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                                }
                                                                disabled={ disabled || readOnly }
                                                                toggle
                                                                placeholder={
                                                                    t("console:manage.features.userstores.forms." +
                                                                        "custom.placeholder",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                                }
                                                                data-testid={ `${ testId }-form-toggle-${
                                                                    property.name }` }
                                                            />
                                                        )
                                                )
                                                : (
                                                    <Field
                                                        name={ property.name }
                                                        value={ property.value ?? property.defaultValue }
                                                        type="text"
                                                        key={ index }
                                                        required={ !disabled }
                                                        label={ property.description.split("#")[ 0 ] }
                                                        requiredErrorMessage={
                                                            t("console:manage.features.userstores.forms.edit." +
                                                                "custom.requiredErrorMessage",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                        }
                                                        disabled={
                                                            readOnly ||
                                                            (userstoresConfig.userstoreEdit.groupDetails.showToggles
                                                            && id !== CONSUMER_USERSTORE_ID
                                                                ? disabled
                                                                : false)
                                                        }
                                                        placeholder={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.placeholder",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                        }
                                                        data-testid={ `${ testId }-form-text-input-${ property.name }` }
                                                    />
                                                )
                                    );
                                })
                            }

                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                { !disabled
                    && (properties?.optional.nonSql.length > 0
                        || properties?.optional.sql.delete.length > 0
                        || properties?.optional.sql.insert.length > 0
                        || properties?.optional.sql.select.length > 0
                        || properties?.optional.sql.update.length > 0)
                    && (id !== CONSUMER_USERSTORE_ID)
                    && (
                        <Grid columns={ 1 }>
                            <Grid.Column width={ 8 } textAlign="center">
                                <LinkButton
                                    type="button"
                                    onClick={ () => { setShowMore(!showMore); } }
                                    data-testid={ `${ testId }-show-more-button` }
                                >
                                    <Icon name={ showMore ? "chevron up" : "chevron down" } />
                                    { showMore ? t("common:showLess") : t("common:showMore") }
                                </LinkButton>
                            </Grid.Column>
                        </Grid>
                    ) }

                { !disabled
                    && showMore && properties?.optional.nonSql.length > 0 && (
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 8 }>
                                {
                                    properties?.optional?.nonSql.map((property: TypeProperty, index: number) => {
                                        const name: string = property.description.split("#")[ 0 ];
                                        const isPassword: boolean = property.attributes
                                            .find((attribute: PropertyAttribute) =>
                                                attribute.name === "type").value === "password";
                                        const toggle: boolean = property.attributes
                                            .find((attribute: PropertyAttribute) =>
                                                attribute.name === "type")?.value === "boolean";

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
                                                            t("console:manage.features.userstores.forms.edit." +
                                                                "custom.requiredErrorMessage",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                        }
                                                        showPassword={ t("common:showPassword") }
                                                        hidePassword={ t("common:hidePassword") }
                                                        placeholder={
                                                            t("console:manage.features.userstores.forms." +
                                                                    "custom.placeholder",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                        }
                                                        data-testid={ `${ testId }-form-non-sql-password-input-${
                                                            property.name }` }
                                                        disabled={ readOnly }
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
                                                                t("console:manage.features.userstores.forms." +
                                                                        "custom.requiredErrorMessage",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                            }
                                                            disabled={ disabled || readOnly }
                                                            toggle
                                                            placeholder={
                                                                t("console:manage.features.userstores.forms." +
                                                                    "custom.placeholder",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                            }
                                                            data-testid={ `${ testId }-form-non-sql-toggle-${
                                                                property.name }` }
                                                        />
                                                    ) :
                                                    (
                                                        <Field
                                                            name={ property.name }
                                                            value={ property.value ?? property.defaultValue }
                                                            type="text"
                                                            key={ index }
                                                            required={ false }
                                                            label={ property.description.split("#")[ 0 ] }
                                                            requiredErrorMessage={
                                                                t("console:manage.features.userstores.forms" +
                                                                    ".custom.requiredErrorMessage",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                            }
                                                            disabled={ disabled || readOnly }
                                                            placeholder={
                                                                t("console:manage.features.userstores.forms." +
                                                                    "custom.placeholder",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                            }
                                                            data-testid={ `${ testId }-form-non-sql-text-input-${
                                                                property.name }` }
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
                { !disabled
                    && showMore
                    && (properties?.optional.sql.delete.length > 0
                        || properties?.optional.sql.insert.length > 0
                        || properties?.optional.sql.select.length > 0
                        || properties?.optional.sql.update.length > 0)
                    && (
                        <Grid columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <SqlEditor
                                    onChange={ (name: string, value: string) => {
                                        const tempSql: Map<string, string> = new Map(sql);

                                        tempSql.set(name, value);
                                        setSql(tempSql);
                                    } }
                                    properties={ properties?.optional.sql }
                                    values={ sql }
                                    data-testid={ `${ testId }-sql-editor` }
                                    readOnly={ readOnly }
                                />
                            </Grid.Column>
                        </Grid>
                    )
                }
                <Grid columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        {
                            !readOnly && (
                                <PrimaryButton
                                    type="submit"
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting || disabled }
                                    data-testid={ `${ testId }-form-submit-button` }
                                >
                                    Update
                                </PrimaryButton>
                            )
                        }
                    </Grid.Column>
                </Grid>
            </Forms>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the component.
 */
EditGroupDetails.defaultProps = {
    "data-testid": "userstore-group-details-edit"
};
