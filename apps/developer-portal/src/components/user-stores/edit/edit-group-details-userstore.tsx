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

import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon } from "semantic-ui-react";
import { SqlEditor } from "..";
import { patchUserStore } from "../../../api";
import { AlertLevels, RequiredBinary, TypeProperty, UserstoreType } from "../../../models";

/**
 * Prop types of `EditGroupDetails` component
 */
interface EditGroupDetailsPropsInterface {
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
}

export const EditGroupDetails = (
    props: EditGroupDetailsPropsInterface
): ReactElement => {

    const { update, id, properties } = props;

    const [ showMore, setShowMore ] = useState(false);
    const [ disabled, setDisabled ] = useState(true);
    const [ sql, setSql ] = useState<Map<string, string>>(null);

    const dispatch = useDispatch();

    const { t } = useTranslation();

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

    useEffect(() => {
        if (properties) {
            const master = properties?.required.find(property => property.name === "ReadGroups");
            setDisabled(!(master?.value === "true"));
        }
    }, [ properties ]);

    const onSubmitHandler = (values: Map<string, FormValue>): void => {
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

        const data = showMore
            ? [
                ...requiredData,
                ...optionalNonSqlData,
                ...optionalSqlDeleteData,
                ...optionalSqlInsertData,
                ...optionalSqlUpdateData,
                ...optionalSqlSelectData
            ]
            : requiredData;

        patchUserStore(id, data).then(() => {
            dispatch(addAlert({
                description: t("devPortal:components.userstores.notifications." +
                    "updateUserstore.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("devPortal:components.userstores.notifications." +
                    "updateUserstore.success.message")
            }));
            update();
        }).catch(error => {
            dispatch(addAlert({
                description: error?.description
                    || t("devPortal:components.userstores.notifications." +
                        "updateUserstore.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.message || t("devPortal:components.userstores.notifications." +
                    "updateUserstore.genericError.message")
            }));
        });
    };

    return (
        <Forms
            onSubmit={ onSubmitHandler }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        {
                            properties?.required?.map((property: TypeProperty, index: number) => {
                                const name = property.description.split("#")[ 0 ];
                                const isPassword = property.attributes
                                    .find(attribute => attribute.name === "type").value === "password";
                                const toggle = property.attributes
                                    .find(attribute => attribute.name === "type")?.value === "boolean";
                                const master = property.name === "ReadGroups";

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
                                            />
                                        )
                                        : toggle
                                            ? master
                                                ? (
                                                    <Field
                                                        name={ property.name }
                                                        value={ property.value ?? property.defaultValue }
                                                        type="toggle"
                                                        key={ index }
                                                        required={ false }
                                                        label={ property.description.split("#")[ 0 ] }
                                                        requiredErrorMessage={
                                                            t("devPortal:components.userstores.forms.edit.connection." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                        }
                                                        listen={ (values: Map<string, FormValue>) => {
                                                            setDisabled(
                                                                values.get(property.name)
                                                                    .toString() === "false"
                                                            )
                                                        } }
                                                        toggle
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
                                                            t("devPortal:components.userstores.forms.edit.connection." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                        }
                                                        disabled={ disabled }
                                                        toggle
                                                    />
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
                                                        t("devPortal:components.userstores.forms.edit.connection." +
                                                            "custom.requiredErrorMessage",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                    }
                                                    disabled={ disabled }
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
                && (
                    <Grid columns={ 1 }>
                        <Grid.Column width={ 8 } textAlign="center">
                            <LinkButton
                                type="button"
                                onClick={ () => { setShowMore(!showMore) } }
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
                                                            t("devPortal:components.userstores.forms.edit.connection." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                        }
                                                        showPassword={ t("common:showPassword") }
                                                        hidePassword={ t("common:hidePassword") }
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
                                                                t("devPortal:components.userstores.forms." +
                                                                    "edit.connection.custom.requiredErrorMessage",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                            }
                                                            disabled={ disabled }
                                                            toggle
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
                                                                t("devPortal:components.userstores.forms.edit" +
                                                                    ".connection.custom.requiredErrorMessage",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                            }
                                                            disabled={ disabled }
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
                                    const tempSql = new Map(sql);
                                    tempSql.set(name, value);
                                    setSql(tempSql);
                                } }
                                properties={ properties?.optional.sql }
                                values={ sql }
                            />
                        </Grid.Column>
                    </Grid>
                )
            }
            <Grid columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <PrimaryButton type="submit">
                        Update
                    </PrimaryButton>
                </Grid.Column>
            </Grid>
        </Forms>
    );
};
