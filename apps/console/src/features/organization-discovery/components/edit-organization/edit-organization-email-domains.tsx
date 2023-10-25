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

import {
    Autocomplete,
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@mui/material";
import { Chip, TextField } from "@oxygen-ui/react";
import InputLabel from "@oxygen-ui/react/InputLabel/InputLabel";
import {
    AlertLevels,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ContentLoader,
    EmphasizedSegment,
    PrimaryButton
} from "@wso2is/react-components";
import { IdentityAppsError } from "modules/core/dist/types/errors";
import React, {
    FunctionComponent,
    ReactElement,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Form as SemanticForm } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../../core";
import { updateOrganizationDiscoveryAttributes } from "../../api";
import {
    OrganizationDiscoveryAttributeDataInterface,
    OrganizationResponseInterface
} from "../../models";

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
}

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
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ emailDomainData, setEmailDomainData ] = useState<string[]>();

    const optionsArray: string[] = [];

    const handleSubmit = () => {
        setIsSubmitting(true);

        const emailDomainDiscoveryData: OrganizationDiscoveryAttributeDataInterface = {
            attributes: [
                {
                    type: "emailDomain",
                    values: emailDomainData
                }
            ]
        };

        updateOrganizationDiscoveryAttributes(organization.id, emailDomainDiscoveryData)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizationDiscovery.notifications." +
                            "updateOrganizationDiscoveryAttributes.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.organizationDiscovery.notifications." +
                            "updateOrganizationDiscoveryAttributes.success.message"
                        )
                    })
                );

                onOrganizationUpdate(organization.id);
            })
            .catch((error: IdentityAppsError) => {
                if (error.description) {
                    dispatch(
                        addAlert({
                            description: error.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizationDiscovery.notifications." +
                                "updateOrganizationDiscoveryAttributes.error.message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizationDiscovery.notifications" +
                            ".updateOrganizationDiscoveryAttributes.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.organizationDiscovery.notifications" +
                            ".updateOrganizationDiscoveryAttributes.genericError.message"
                        )
                    })
                );
            })
            .finally(() => setIsSubmitting(false));
    };

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
                                    <label>
                                        { t("console:manage.features.organizationDiscovery.edit.fields.name.label") }
                                    </label>
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
                                                t("console:manage.features.organizationDiscovery.edit.fields." +
                                                "emailDomains.label")
                                            }
                                        </InputLabel>
                                        <TextField
                                            id="tags-filled"
                                            InputLabelProps= { {
                                                required: true
                                            } }
                                            { ...params }
                                            required
                                            placeholder={
                                                t("console:manage.features.organizationDiscovery.edit.fields." +
                                                "emailDomains.placeHolder")
                                            }
                                        />
                                    </>
                                ) }
                                onChange={ (
                                    event: React.SyntheticEvent<Element, Event>,
                                    value: string[]
                                ) => {
                                    setEmailDomainData(value);
                                } }
                            />

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider hidden />
                { !isReadOnly && (
                    <PrimaryButton
                        data-testid="group-mgt-update-roles-modal-save-button"
                        disabled={ isSubmitting }
                        loading={ isSubmitting }
                        onClick={ () => handleSubmit() }
                    >
                        { t("common:update") }
                    </PrimaryButton>
                ) }
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
