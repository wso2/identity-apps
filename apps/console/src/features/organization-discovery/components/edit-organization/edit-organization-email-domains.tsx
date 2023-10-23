/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {
    Autocomplete,
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@mui/material";
import { Chip, TextField } from "@oxygen-ui/react";
import InputLabel from "@oxygen-ui/react/InputLabel/InputLabel";
import { AccessControlConstants, Show } from "@wso2is/access-control";
import {
    AlertLevels,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ContentLoader,
    EmphasizedSegment,
    PrimaryButton
} from "@wso2is/react-components";
import moment from "moment";
import React, {
    FunctionComponent,
    ReactElement,
    useCallback,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Form as SemanticForm, Grid } from "semantic-ui-react";
import { AppState, FeatureConfigInterface } from "../../../core";
import {
    ORGANIZATION_DESCRIPTION_MAX_LENGTH,
    ORGANIZATION_DESCRIPTION_MIN_LENGTH,
    ORGANIZATION_NAME_MAX_LENGTH,
    ORGANIZATION_NAME_MIN_LENGTH
} from "../../constants";
import {
    OrganizationDiscoveryAttributeDataInterface,
    OrganizationPatchData,
    OrganizationResponseInterface,
} from "../../models";

interface OrganizationEditFormProps {
    name: string;
    description?: string;
}

interface EditOrganizationEmailDomainsPropsInterface
    extends SBACInterface<FeatureConfigInterface>,
    TestableComponentInterface {
    /**
     * Organization info
     */
    organization: OrganizationResponseInterface;
    /**
     * Organization discovery info
     */
    organizationDiscoveryData: OrganizationDiscoveryAttributeDataInterface;
    /**
     * Is read only view
     */
    isReadOnly: boolean;
    /**
     * Callback for when organization update
     */
    onOrganizationUpdate: (organizationId: string) => void;
    /**
     * Callback for when organization delete
     */
    onOrganizationDelete: (organizationId: string) => void;
}

const FORM_ID: string = "edit-organization-email-domains-form";

/**
 * Organization overview component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const EditOrganizationEmailDomains: FunctionComponent<EditOrganizationEmailDomainsPropsInterface> = (
    props: EditOrganizationEmailDomainsPropsInterface
): ReactElement => {
    const {
        organization,
        organizationDiscoveryData,
        isReadOnly,
        onOrganizationUpdate,
        onOrganizationDelete,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const editableFields: Array<string> = [ "name", "description" ];

    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ emailDomainData, setEmailDomainData ] = useState<string[]>();
    const [ isEmailDataError, setIsEmailDataError ] = useState<boolean>(false);
    const [ emailDataError, setEmailDataError ] = useState<string>("");

    const optionsArray: string[] = [];

    // const handleSubmit = useCallback(
    //     async (values: OrganizationResponseInterface): Promise<void> => {
    //         setIsSubmitting(true);

    //         const patchData: OrganizationPatchData[] = Object.keys(values)
    //             .filter(field => editableFields.includes(field))
    //             .map(field => {
    //                 return {
    //                     operation: "REPLACE",
    //                     path: `/${ field }`,
    //                     value: values[ field ]
    //                 };
    //             });
    //         console.log(patchData);

    //         patchOrganization(organization.id, patchData)
    //             .then(_response => {
    //                 dispatch(
    //                     addAlert({
    //                         description: t(
    //                             "console:manage.features.organizations.notifications.updateOrganization." +
    //                             "success.description"
    //                         ),
    //                         level: AlertLevels.SUCCESS,
    //                         message: t(
    //                             "console:manage.features.organizations.notifications.updateOrganization." +
    //                             "success.message"
    //                         )
    //                     })
    //                 );

    //                 onOrganizationUpdate(organization.id);
    //             })
    //             .catch(error => {
    //                 if (error.description) {
    //                     dispatch(
    //                         addAlert({
    //                             description: error.description,
    //                             level: AlertLevels.ERROR,
    //                             message: t(
    //                                 "console:manage.features.organizations.notifications.updateOrganization." +
    //                                 "error.message"
    //                             )
    //                         })
    //                     );

    //                     return;
    //                 }

    //                 dispatch(
    //                     addAlert({
    //                         description: t(
    //                             "console:manage.features.organizations.notifications" +
    //                             ".updateOrganization.genericError.description"
    //                         ),
    //                         level: AlertLevels.ERROR,
    //                         message: t(
    //                             "console:manage.features.organizations.notifications" +
    //                             ".updateOrganization.genericError.message"
    //                         )
    //                     })
    //                 );
    //             })
    //             .finally(() => setIsSubmitting(false));
    //     },
    //     [ organization, setIsSubmitting ]
    // );

    return organization ? (
        <>
            <EmphasizedSegment padded="very" key={ organization?.id }>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                            <SemanticForm>
                                <SemanticForm.Field
                                    data-testid={ `${ testId }-email-domain-form-name-input` }
                                >
                                    <label>{ t("console:manage.features.organizationDiscovery.edit.fields.name.label") }</label>
                                    <input value={ organization.name } readOnly />
                                </SemanticForm.Field>
                            </SemanticForm>
                            <Divider hidden />
                            <Autocomplete
                                size="small"
                                fullWidth
                                disableCloseOnSelect
                                multiple
                                id="tags-filled"
                                options={ optionsArray.map((option: string) => option) }
                                defaultValue={ organizationDiscoveryData?.attributes[0]?.values }
                                freeSolo
                                renderTags={ (
                                    value: readonly string[],
                                    getTagProps: AutocompleteRenderGetTagProps
                                ) =>
                                    value.map((option: string, index: number) => (
                                        <Chip
                                            key={ "" }
                                            size="medium"
                                            label={ option }
                                            { ...getTagProps({ index }) }
                                        />
                                    ))
                                }
                                renderInput={ (params: AutocompleteRenderInputParams) => (
                                    <>
                                        <InputLabel
                                            htmlFor="tags-filled"
                                            disableAnimation
                                            shrink={ false }
                                            margin="dense"
                                            className="mt-2"
                                        >
                                            {
                                                t("console:manage.features.organizationDiscovery.edit.fields.emailDomains.label")
                                            }
                                        </InputLabel>
                                        <TextField
                                            id="tags-filled"
                                            // error={ isEmailDataError }
                                            // helperText= {
                                            //     isEmailDataError
                                            //     && emailDataError
                                            // }
                                            InputLabelProps= { {
                                                required: true
                                            } }
                                            { ...params }
                                            required
                                            placeholder={
                                                t("console:manage.features.organizationDiscovery.edit.fields.emailDomains.placeHolder")
                                            }
                                        />
                                    </>
                                ) }
                                onChange={ (
                                    event: React.SyntheticEvent<Element, Event>,
                                    value: string[]
                                ) => {
                                    setEmailDomainData(value);
                                    console.log(organizationDiscoveryData);
                                    // validateEmail(value);
                                } }
                                onInputChange={ () => {
                                    setIsEmailDataError(false);
                                } }
                            />

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider hidden />
                <PrimaryButton
                    data-testid="group-mgt-update-roles-modal-save-button"
                    // floated="right"
                    disabled={ isSubmitting }
                    loading={ isSubmitting }
                    // onClick={ () => handleSubmit1(emailDomainData) }
                >
                    { t("common:update") }
                </PrimaryButton>
                            {/* <Form
                                id={ FORM_ID }
                                data-testid={ `${ testId }-form` }
                                onSubmit={ handleSubmit }
                                uncontrolledForm={ false }
                                validate={ validate }
                            >
                                { !isReadOnly && (
                                    <Field.Button
                                        form={ FORM_ID }
                                        size="small"
                                        buttonType="primary_btn"
                                        ariaLabel="Update button"
                                        name="update-button"
                                        className="form-button"
                                        data-testid={ `${ testId }-form-update-button` }
                                        disabled={ isSubmitting }
                                        loading={ isSubmitting }
                                        label={ t("common:update") }
                                    />
                                ) }
                            </Form> */}
                        {/* </Grid.Column>
                    </Grid.Row>
                </Grid> */}
            </EmphasizedSegment>
        </>
    ) : (
        <ContentLoader dimmer />
    );
};

/**
 * Default props for the component.
 */
EditOrganizationEmailDomains.defaultProps = {
    "data-testid": "edit-organization-email-domains"
};
