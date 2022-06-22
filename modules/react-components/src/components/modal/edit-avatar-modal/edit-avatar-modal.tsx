/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { getGravatarImage } from "@wso2is/core/api";
import { GravatarFallbackTypes, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { ImageUtils, ProfileUtils, URLUtils } from "@wso2is/core/utils";
import classNames from "classnames";
import React, {
    ChangeEvent,
    FormEvent,
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import {
    Card,
    CardProps,
    Checkbox,
    CheckboxProps,
    Dropdown,
    DropdownProps,
    Form,
    Grid,
    Input, LabelProps,
    Message,
    Modal,
    ModalProps
} from "semantic-ui-react";
import { UserAvatar } from "../../avatar";
import { LinkButton, PrimaryButton } from "../../button";
import { SelectionCard } from "../../card";
import { ContentLoader } from "../../loader";
import { Hint } from "../../typography";

/**
 * Edit Avatar Modal props interface.
 */
export interface EditAvatarModalPropsInterface extends ModalProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Set of Emails to look for Gravatar.
     */
    emails?: string[];
    /**
     * Modal Heading.
     */
    heading?: ReactNode;
    /**
     * Name to use for system generated avatar.
     */
    name: string;
    /**
     * Cancel button text.
     */
    cancelButtonText?: string;
    /**
     * Show/Hide option title. ex: Retro, Initials etc.
     */
    showOptionTitle?: boolean;
    /**
     * Submit button text.
     */
    submitButtonText?: string;
    /**
     * Callback function for the submit button.
     * @param {<HTMLButtonElement>} e - Event.
     * @param {string} url - Submitted URL.
     */
    onSubmit?: (e: MouseEvent<HTMLButtonElement>, url: string) => void;
    /**
     * Callback function for the cancel button.
     * @param {<HTMLButtonElement>} e - Event.
     */
    onCancel?: (e: MouseEvent<HTMLButtonElement>) => void;
    /**
     * i18n translations for modal content.
     */
    translations?: EditAvatarModalContentI18nInterface;
    /**
     * Existing profile image url.
     */
    imageUrl?: string;
    /**
     * Flag to decide whether to show the hosted URL option.
     */
    showHostedURLOption?: boolean;
    /**
     * Specifies if there is a pending submission.
     */
}

const GRAVATAR_IMAGE_MIN_SIZE = 80;

const SystemGeneratedAvatars: Map<string, SystemGeneratedAvatarURLs> = new Map<string, SystemGeneratedAvatarURLs>([
    [ "Initials", "system_gen_i_1" ]
]);

/**
 * Different Avatar types.
 */
export enum AvatarTypes {
    SYSTEM_GENERATED = "SYSTEM_GENERATED",
    GRAVATAR = "GRAVATAR",
    URL = "URL"
}

type SystemGeneratedAvatarURLs = "system_gen_i_1";

/**
 * Interface for the i18n string of the component.
 */
export interface EditAvatarModalContentI18nInterface {
    gravatar: {
        heading: ReactNode;
        errors: {
            noAssociation: {
                header: ReactNode;
                content: ReactNode;
            };
        };
    };
    hostedAvatar: {
        heading: ReactNode;
        input: {
            errors: {
                http: {
                    header: ReactNode;
                    content: ReactNode;
                };
                invalid: {
                    content: string;
                    pointing: string;
                };
            };
            placeholder: string;
            hint: string;
            warnings: {
                dataURL: {
                    header: ReactNode;
                    content: ReactNode;
                };
            };
        };
    };
    systemGenAvatars: {
        heading: ReactNode;
        types: {
            initials: ReactNode;
        };
    };
}

/**
 * Edit Avatar modal.
 *
 * @param {EditAvatarModalPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const EditAvatarModal: FunctionComponent<EditAvatarModalPropsInterface> = (
    props: EditAvatarModalPropsInterface
): ReactElement => {

    const {
        cancelButtonText,
        className,
        emails,
        heading,
        imageUrl,
        name,
        onCancel,
        onSubmit,
        showHostedURLOption,
        showOptionTitle,
        submitButtonText,
        isSubmitting,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        translations,
        ...rest
    } = props;

    const [ selectedGravatarEmail, setSelectedGravatarEmail ] = useState<string>(undefined);
    const [ selectedGravatarSize, setSelectedGravatarSize ] = useState<number>(undefined);
    const [ isInitialGravatarRequestLoading, setIsInitialGravatarRequestLoading ] = useState<boolean>(false);
    const [ isGravatarQualified, setIsGravatarQualified ] = useState<boolean>(undefined);
    const [ gravatarURLs, setGravatarURLs ] = useState<Map<string, string>>(undefined);
    const [ selectedAvatarType, setSelectedAvatarType ] = useState<AvatarTypes>(undefined);
    const [ hostedURL, setHostedURL ] = useState<string>(undefined);
    const [ isGravatarUrl, setIsGravatarUrl ] = useState<boolean>(false);
    const [ hostedURLError, setHostedURLError ] = useState<LabelProps>(undefined);
    const [
        outputURL,
        setOutputURL
    ] = useState<SystemGeneratedAvatarURLs | string>(undefined);
    const [ isHostedURLValid, setIsHostedURLValid ] = useState<boolean>(undefined);
    const [
        isHostedURLValidationRequestLoading,
        setIsHostedURLValidationRequestLoading
    ] = useState<boolean>(false);

    const classes = classNames(
        "edit-avatar-modal",
        className
    );

    /**
     * Triggered on component mount.
     */
    useEffect(() => {
        setSelectedGravatarSize(GRAVATAR_IMAGE_MIN_SIZE);
    }, []);

    /**
     * Init selected gravatar email once `emails` prop is valid.
     */
    useEffect(() => {
        if (!emails || !Array.isArray(emails) || emails.length < 1) {
            return;
        }

        setSelectedGravatarEmail(emails[ 0 ]);
    }, [ emails ]);

    /**
     * Triggered when selected gravatar email changes.
     */
    useEffect(() => {
        if (!selectedGravatarEmail) {
            return;
        }

        setIsInitialGravatarRequestLoading(true);

        getGravatarImage(selectedGravatarEmail)
            .then(() => {
                setIsGravatarQualified(true);
            })
            .catch(() => {
                setIsGravatarQualified(false);
            })
            .finally(() => {
                setIsInitialGravatarRequestLoading(false);
            });
    }, [ selectedGravatarEmail ]);

    /**
     * Triggered when selected gravatar email or `isGravatarQualified` flag chages.
     */
    useEffect(() => {
        if (!selectedGravatarEmail || isGravatarQualified === undefined) {
            return;
        }

        const getURL = (fallback: GravatarFallbackTypes, forceDefault: boolean = true) =>
            ProfileUtils.buildGravatarURL(selectedGravatarEmail, selectedGravatarSize, null, fallback, forceDefault);

        const urls = new Map<string, string>();

        if (isGravatarQualified) {
            urls.set("Gravatar", getURL("default", false));
        }

        urls.set("Retro", getURL("retro"))
            .set("Default", getURL("default"))
            .set("Person", getURL("mp"))
            .set("Identicon", getURL("identicon"))
            .set("Monster", getURL("monsterid"))
            .set("Wavatar", getURL("wavatar"))
            .set("Robot", getURL("robohash"));

        setGravatarURLs(urls);
    }, [ selectedGravatarEmail, isGravatarQualified ]);

    /**
     * Set the Avatar types based on imageUrl.
     */
    useEffect(() => {
        if (imageUrl) {
            if (isGravatarUrl) {
                setOutputURL(imageUrl);
                setSelectedAvatarType(AvatarTypes.GRAVATAR);
            } else {
                setHostedURL(imageUrl);
                setSelectedAvatarType(AvatarTypes.URL);
            }
        } else {
            setSelectedAvatarType(AvatarTypes.SYSTEM_GENERATED);
        }
    }, [ imageUrl , isGravatarUrl ]);

    /**
     * Check the type of imageUrl.
     */
    useEffect(() => {

        if (gravatarURLs && imageUrl) {
            for (const [ , value ] of gravatarURLs) {
                if (imageUrl.localeCompare(value) == 0) {
                    setIsGravatarUrl(true);

                    break;
                }
            }
        }
    }, [ gravatarURLs ]);

    /**
     * Handles selected gravatar email change.
     *
     * @param {React.SyntheticEvent<HTMLElement>} e - Event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleGravatarEmailDropdownChange = (e: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        const { value } = data;

        setSelectedGravatarEmail(value as string);

        // Once the email selection is changed, switch the selected type to `Gravatar`.
        setSelectedAvatarType(AvatarTypes.GRAVATAR);

        // Set the default option.
        if (gravatarURLs) {
            setOutputURL(gravatarURLs.get("Gravatar") ?? gravatarURLs.get("Retro"));
        }
    };

    /**
     * Render the different gravatar options.
     *
     * @return {ReactElement[]}
     */
    const renderGravatarOptions = (): ReactElement[] => {

        if (!gravatarURLs) {
            return;
        }

        const elemArray: ReactElement[] = [];

        for (const [ key, value ] of gravatarURLs) {
            elemArray.push(
                <SelectionCard
                    id={ value }
                    size="x100"
                    showText={ showOptionTitle }
                    header={ key }
                    image={ (
                        <UserAvatar
                            size="little"
                            image={ value }
                        />
                    ) }
                    selected={ outputURL === value }
                    onClick={ handleGravatarOptionChange }
                />
            );
        }

        return elemArray;
    };

    /**
     * Handle selected avatar type change.
     *
     * @param {React.FormEvent<HTMLInputElement>} e - Event.
     * @param {CheckboxProps} data - Checkbox data.
     */
    const handleSelectedAvatarTypeChange = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        const { value } = data;

        setSelectedAvatarType(value as AvatarTypes);
        resolveOutputURLsOnAvatarTypeChange(value as AvatarTypes);
        resolveHostedURLFieldErrors(value as AvatarTypes, isHostedURLValid);
    };

    /**
     * Resolves the default option when the avatar type changes.
     *
     * @param {AvatarTypes} avatarType - Avatar Type.
     */
    const resolveOutputURLsOnAvatarTypeChange = (avatarType: AvatarTypes): void => {
        if (avatarType === AvatarTypes.SYSTEM_GENERATED) {
            setOutputURL(SystemGeneratedAvatars.get("Initials"));

            return;
        }

        if (avatarType === AvatarTypes.GRAVATAR && gravatarURLs) {
            setOutputURL(gravatarURLs.get("Gravatar") ?? gravatarURLs.get("Retro"));

            return;
        }

        setOutputURL(hostedURL);
    };

    /**
     * Handles gravatar option change,
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} e - Event.
     * @param {CardProps} data - Card data.
     */
    const handleGravatarOptionChange = (e: MouseEvent<HTMLAnchorElement>, data: CardProps): void => {
        const { id } = data;

        setOutputURL(id);
        setSelectedAvatarType(AvatarTypes.GRAVATAR);
    };

    /**
     * Handles system generated avatar option change.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} e - Event.
     * @param {CardProps} data - Card data.
     */
    const handleSystemGeneratedAvatarChange = (e: MouseEvent<HTMLAnchorElement>, data: CardProps): void => {
        const { id } = data;

        setOutputURL(id);
        setSelectedAvatarType(AvatarTypes.SYSTEM_GENERATED);
    };

    /**
     * Handle Hosted URL field on change event.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - Event.
     * @param {string} value - Input value.
     */
    const handleHostedURLFieldOnChange = (e: ChangeEvent<HTMLInputElement>,
        { value }: { value: string }): void => {

        setHostedURL(value);
        setOutputURL(value);
        validateHostedURL(value);
    };

    /**
     * Validates the Hosted Image URL.
     *
     * @param {string} url - Image URL.
     */
    const validateHostedURL = (url: string): void => {
        const isImageValid = (isValid: boolean) => {
            setIsHostedURLValid(isValid);
            resolveHostedURLFieldErrors(selectedAvatarType, isValid);
            setIsHostedURLValidationRequestLoading(false);
        };

        setIsHostedURLValidationRequestLoading(true);

        ImageUtils.isValidImageURL(url, isImageValid);
    };

    /**
     * Handles focus event of hosted URL input field.
     */
    const handleHostedURLFieldOnFocus = (): void => {
        setSelectedAvatarType(AvatarTypes.URL);
    };

    /**
     * Handles modal submit.
     *
     * @param {React.MouseEvent<HTMLButtonElement>} e - Event.
     */
    const handleModalSubmit = (e: MouseEvent<HTMLButtonElement>): void => {
        onSubmit(e, outputURL === SystemGeneratedAvatars.get("Initials") ? "" : outputURL);
    };

    /**
     * Resolves the errors of the hosted image URL field.
     *
     * @param {AvatarTypes} avatarType - Selected avatar type.
     * @param {boolean} isValid - Is avatar valid.
     */
    const resolveHostedURLFieldErrors = (avatarType?: AvatarTypes, isValid?: boolean): void => {

        if (isValid === true) {
            setHostedURLError(null);

            return;
        }

        if (avatarType !== AvatarTypes.URL) {
            setHostedURLError(null);

            return;
        }

        if (avatarType === AvatarTypes.URL && isValid === false) {
            setHostedURLError({
                content: translations.hostedAvatar.input.errors.invalid.content,
                pointing: "above"
            });

            return;
        }
    };

    /**
     * Resolves gravatar options validation message.
     * @return {React.ReactElement}
     */
    const resolveGravatarOptionsMessage = (): ReactElement => {
        if (isInitialGravatarRequestLoading || isGravatarQualified) {
            return null;
        }

        return (
            <Message
                warning
                visible
                size="tiny"
            >
                <Message.Header>
                    { translations.gravatar.errors.noAssociation.header }
                </Message.Header>
                <Message.Content>
                    It seems like the selected email is not registered on Gravatar. Sign up for a Gravatar
                    account by visiting &nbsp;<a href="https://www.gravatar.com">
                    Gravatar Official Website</a>&nbsp;or use one of the following.
                </Message.Content>
            </Message>
        );
    };

    /**
     * Resolves hosted URL validation message.
     * @return {React.ReactElement}
     */
    const resolveHostedURLMessage = (): ReactElement => {
        if (isHostedURLValidationRequestLoading || hostedURLError || !hostedURL) {
            return null;
        }

        if (URLUtils.isHttpUrl(hostedURL)) {
            return (
                <Message
                    warning
                    visible
                    size="tiny"
                    header={ translations.hostedAvatar.input.errors.http.header }
                    content={ translations.hostedAvatar.input.errors.http.content }
                />
            );
        }

        if (URLUtils.isDataUrl(hostedURL)) {
            return (
                <Message
                    warning
                    visible
                    size="tiny"
                    header={ translations.hostedAvatar.input.warnings.dataURL.header }
                    content={ translations.hostedAvatar.input.warnings.dataURL.content }
                />
            );
        }

        return null;
    };

    return (
        <Modal
            data-componentid={ componentId }
            data-testid={ testId }
            className={ classes }
            closeOnDimmerClick={ false }
            { ...rest }
        >
            <Modal.Header>{ heading }</Modal.Header>
            <Modal.Content>
                <Form>
                    <Grid>
                        {
                            name && (
                                <Grid.Row>
                                    <Grid.Column width={ 16 }>
                                        <div className="avatar-from-system">
                                            <div className="mb-3">
                                                <Form.Field>
                                                    <Checkbox
                                                        radio
                                                        value={ AvatarTypes.SYSTEM_GENERATED }
                                                        label={ translations.systemGenAvatars.heading }
                                                        checked={ selectedAvatarType === AvatarTypes.SYSTEM_GENERATED }
                                                        onChange={ handleSelectedAvatarTypeChange }
                                                    />
                                                </Form.Field>
                                            </div>
                                            <Card.Group className="avatar-from-system-card-group">
                                                <SelectionCard
                                                    id={ SystemGeneratedAvatars.get("Initials") }
                                                    size="x100"
                                                    showText={ showOptionTitle }
                                                    header={ translations.systemGenAvatars.types.initials }
                                                    image={ (
                                                        <UserAvatar
                                                            size="little"
                                                            name={ name }
                                                        />
                                                    ) }
                                                    selected={ outputURL === SystemGeneratedAvatars.get("Initials") }
                                                    onClick={ handleSystemGeneratedAvatarChange }
                                                />
                                            </Card.Group>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            selectedGravatarEmail && (
                                <Grid.Row>
                                    <Grid.Column width={ 16 }>
                                        <div className="avatar-from-gravatar">
                                            <div className="mb-3">
                                                <Form.Field>
                                                    <Checkbox
                                                        radio
                                                        value={ AvatarTypes.GRAVATAR }
                                                        label={ (
                                                            <label>
                                                                <>
                                                                    <span>{ translations.gravatar.heading }</span>
                                                                    <Dropdown
                                                                        text={ selectedGravatarEmail }
                                                                        options={
                                                                            emails
                                                                                .map((email: string, index: number) => {
                                                                                    return {
                                                                                        key: index,
                                                                                        text: email,
                                                                                        value: email
                                                                                    };
                                                                                })
                                                                        }
                                                                        onChange={ handleGravatarEmailDropdownChange }
                                                                    />
                                                                </>
                                                            </label>
                                                        ) }
                                                        checked={ selectedAvatarType === AvatarTypes.GRAVATAR }
                                                        onChange={ handleSelectedAvatarTypeChange }
                                                    />
                                                </Form.Field>
                                            </div>
                                            {
                                                !isInitialGravatarRequestLoading
                                                    ? (
                                                        <>
                                                            { resolveGravatarOptionsMessage() }
                                                            <Card.Group className="avatar-from-gravatar-card-group">
                                                                { renderGravatarOptions() }
                                                            </Card.Group>
                                                        </>
                                                    )
                                                    : (
                                                        <div className="avatar-types-loader-container">
                                                            <ContentLoader />
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            showHostedURLOption && (
                                <>
                                    <Grid.Row className="pb-0">
                                        <Grid.Column width={ 16 }>
                                            <div className="avatar-from-url-label">
                                                <Form.Field>
                                                    <Checkbox
                                                        radio
                                                        value={ AvatarTypes.URL }
                                                        label={ translations.hostedAvatar.heading }
                                                        checked={ selectedAvatarType === AvatarTypes.URL }
                                                        onChange={ handleSelectedAvatarTypeChange }
                                                    />
                                                </Form.Field>
                                                { resolveHostedURLMessage() }
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={ 10 } tablet={ 10 } mobile={ 16 }>
                                            <div className="avatar-from-url-field">
                                                <Form.Field
                                                    fluid
                                                    className="hosted-url-input"
                                                    control={ Input }
                                                    placeholder={ translations.hostedAvatar.input.placeholder }
                                                    onFocus={ handleHostedURLFieldOnFocus }
                                                    onChange={ handleHostedURLFieldOnChange }
                                                    error={ hostedURLError }
                                                    loading={ isHostedURLValidationRequestLoading }
                                                    value={ hostedURL }
                                                />
                                                {
                                                    hostedURL && isHostedURLValid && (
                                                        <UserAvatar
                                                            spaced="left"
                                                            size="mini"
                                                            isLoading={ isHostedURLValidationRequestLoading }
                                                            image={ hostedURL }
                                                        />
                                                    )
                                                }
                                            </div>
                                            <Hint>{ translations.hostedAvatar.input.hint }</Hint>
                                        </Grid.Column>
                                    </Grid.Row>
                                </>
                            )
                        }
                    </Grid>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton onClick={ onCancel }>
                    { cancelButtonText }
                </LinkButton>
                <PrimaryButton
                    disabled={
                        isInitialGravatarRequestLoading
                        || isHostedURLValidationRequestLoading
                        || !outputURL
                        || (selectedAvatarType === AvatarTypes.URL && !isHostedURLValid)
                        || (selectedAvatarType === AvatarTypes.URL && hostedURL === imageUrl)
                        || isSubmitting
                    }
                    loading={ isSubmitting }
                    onClick={ handleModalSubmit }
                >
                    { submitButtonText }
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the component.
 */
EditAvatarModal.defaultProps = {
    cancelButtonText: "Cancel",
    "data-componentid": "edit-avatar-modal",
    "data-testid": "edit-avatar-modal",
    dimmer: "blurring",
    heading: "Update profile picture",
    showHostedURLOption: false,
    showOptionTitle: false,
    submitButtonText: "Save",
    translations: {
        gravatar: {
            errors: {
                noAssociation: {
                    content: "It seems like the selected email is not registered on Gravatar. Sign up for a " +
                        "Gravatar account by visiting Gravatar official website or use one of the following.",
                    header: "No matching Gravatar image found!"
                }
            },
            heading: "Gravatar based on "
        },
        hostedAvatar: {
            heading: "Hosted Image",
            input: {
                errors: {
                    http: {
                        content: "The selected URL points to an insecure image served over HTTP. " +
                            "Please proceed with caution.",
                        header: "Insecure Content!"
                    },
                    invalid: {
                        content: "Please enter a valid image URL",
                        pointing: "above"
                    }
                },
                hint: "Enter a valid image URL which is hosted on a third party location.",
                placeholder: "Enter URL for the image.",
                warnings: {
                    dataURL: {
                        content: "Using Data URLs with large character count might result in database issues. " +
                            "Proceed with caution.",
                        header: "Double check the entered Data URL!"
                    }
                }
            }
        },
        systemGenAvatars: {
            heading: "System generated avatar",
            types: {
                initials: "Initials"
            }
        }
    }
};
