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
import { GravatarFallbackTypes, TestableComponentInterface } from "@wso2is/core/models";
import { ProfileUtils } from "@wso2is/core/utils";
import React, {
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
    CardProps,
    Checkbox,
    CheckboxProps,
    Dropdown,
    DropdownProps,
    Form,
    Input,
    Message,
    Modal,
    ModalProps
} from "semantic-ui-react";
import { UserAvatar } from "../../avatar";
import { LinkButton, PrimaryButton } from "../../button";
import { SelectionCard } from "../../card";

/**
 * Edit Avatar Modal props interface.
 */
export interface EditAvatarModalPropsInterface extends ModalProps, TestableComponentInterface {
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
     * Secondary button text.
     */
    secondaryButtonText?: string;
    /**
     * Primary button text.
     */
    primaryButtonText?: string;
    /**
     * Callback function for the primary action button.
     */
    onPrimaryActionClick?: (e: MouseEvent<HTMLElement>) => void;
    /**
     * Callback function for the secondary action button.
     */
    onSecondaryActionClick?: (e: MouseEvent<HTMLElement>) => void;
}

const URL_INPUT_PROTOCOL_OPTIONS = [
    { key: 0, text: "https://", value: "https://" },
    { key: 1, text: "http://", value: "http://" }
];

const GRAVATAR_IMAGE_MIN_SIZE = 80;
const GRAVATAR_IMAGE_MAX_SIZE = 200;

const SystemGeneratedAvatars: Map<string, SystemGeneratedAvatarURLs> = new Map<string, SystemGeneratedAvatarURLs>([
    [ "Initials", "system_gen_i_1" ]
]);

export enum AvatarTypes {
    SYSTEM_GENERATED = "SYSTEM_GENERATED",
    GRAVATAR = "GRAVATAR",
    URL = "URL"
}

type SystemGeneratedAvatarURLs = "system_gen_i_1";

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
        emails,
        heading,
        name,
        onPrimaryActionClick,
        onSecondaryActionClick,
        primaryButtonText,
        secondaryButtonText,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const [ selectedGravatarEmail, setSelectedGravatarEmail ] = useState<string>(emails[ 0 ]);
    const [ selectedGravatarSize, setSelectedGravatarSize ] = useState<number>(GRAVATAR_IMAGE_MIN_SIZE);
    const [ isInitialGravatarRequestLoading, setIsInitialGravatarRequestLoading ] = useState<boolean>(false);
    const [ isGravatarQualified, setIsGravatarQualified ] = useState<boolean>(undefined);
    const [ gravatarURLs, setGravatarURLs ] = useState<Map<string, string>>(undefined);
    const [ selectedAvatarType, setSelectedAvatarType ] = useState<AvatarTypes>(undefined);
    const [
        outputURL,
        setOutputURL
    ] = useState<SystemGeneratedAvatarURLs | string>(undefined);

    useEffect(() => {
        setSelectedAvatarType(AvatarTypes.SYSTEM_GENERATED);
    }, []);

    useEffect(() => {
        if (!selectedGravatarEmail) {
            return;
        }

        setIsInitialGravatarRequestLoading(true);

        getGravatarImage(selectedGravatarEmail)
            .then((response) => {
                setIsGravatarQualified(true)
            })
            .catch((error) => {
                setIsGravatarQualified(false);
            })
            .finally(() => {
                setIsInitialGravatarRequestLoading(false);
            });
    }, [ selectedGravatarEmail ]);

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

    useEffect(() => {
        if (selectedAvatarType === AvatarTypes.SYSTEM_GENERATED) {
            setOutputURL(SystemGeneratedAvatars.get("Initials"));
        }

        if (selectedAvatarType === AvatarTypes.GRAVATAR) {
            setOutputURL(gravatarURLs.get("Gravatar") ?? gravatarURLs.get("Retro"));
        }

        if (selectedAvatarType === AvatarTypes.URL) {
            setOutputURL(gravatarURLs.get(""));
        }
    }, [ selectedAvatarType ]);

    const handleGravatarEmailDropdownChange = (e: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        const { value } = data;
        setSelectedGravatarEmail(value as string);
    };

    const renderGravatarOptions = () => {

        if (!gravatarURLs) {
            return;
        }

        const elemArray = [];

        for (const [ key, value ] of gravatarURLs) {
            elemArray.push(
                <SelectionCard
                    inline
                    id={ value }
                    size="x100"
                    header={ key }
                    image={
                        <UserAvatar
                            size="little"
                            image={ value }
                        />
                    }
                    selected={ outputURL === value }
                    onClick={ handleGravatarOptionChange }
                />
            )
        }

        return elemArray;
    };

    const handleSelectedAvatarTypeChange = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        const { value } = data;
        setSelectedAvatarType(value as AvatarTypes);
    };

    const handleGravatarOptionChange = (e: MouseEvent<HTMLAnchorElement>, data: CardProps) => {
        const { id } = data;

        setOutputURL(id);
        setSelectedAvatarType(AvatarTypes.GRAVATAR);
    };

    const handleSystemGeneratedAvatarChange = (e: MouseEvent<HTMLAnchorElement>, data: CardProps) => {
        const { id } = data;

        setOutputURL(id);
        setSelectedAvatarType(AvatarTypes.SYSTEM_GENERATED);
    };

    return (
        <Modal
            data-testid={ testId }
            { ...rest }
        >
            <Modal.Header>{ heading }</Modal.Header>
            <Modal.Content>
                <Form>
                    <div className="avatar-from-system mb-5">
                        <div className="mb-3">
                            <Form.Field>
                                <Checkbox
                                    radio
                                    value={ AvatarTypes.SYSTEM_GENERATED }
                                    label="System generated avatar"
                                    checked={ selectedAvatarType === AvatarTypes.SYSTEM_GENERATED }
                                    onChange={ handleSelectedAvatarTypeChange }
                                />
                            </Form.Field>
                        </div>
                        <SelectionCard
                            id={ SystemGeneratedAvatars.get("Initials") }
                            size="x100"
                            header="Initials"
                            image={
                                <UserAvatar
                                    size="little"
                                    name={ name }
                                />
                            }
                            selected={ outputURL === SystemGeneratedAvatars.get("Initials") }
                            onClick={ handleSystemGeneratedAvatarChange }
                        />
                    </div>
                    <div className="avatar-from-gravatar mb-5">
                        <div className="mb-3">
                            <Form.Field>
                                <Checkbox
                                    radio
                                    value={ AvatarTypes.GRAVATAR }
                                    label={
                                        <label>
                                            <>
                                                <span>Gravatar based on </span>
                                                <Dropdown
                                                    text={ selectedGravatarEmail }
                                                    options={
                                                        emails.map((email: string, index: number) => {
                                                            return {
                                                                key: index,
                                                                text: email,
                                                                value: email
                                                            }
                                                        })
                                                    }
                                                    onChange={ handleGravatarEmailDropdownChange }
                                                />
                                            </>
                                        </label>
                                    }
                                    checked={ selectedAvatarType === AvatarTypes.GRAVATAR }
                                    onChange={ handleSelectedAvatarTypeChange }
                                />
                            </Form.Field>
                        </div>
                        {
                            (!isInitialGravatarRequestLoading && !isGravatarQualified) && (
                                <Message
                                    warning
                                    visible
                                    size="tiny"
                                    header="No matching Gravatar image found!"
                                    content={
                                        <div>
                                            It seems like { selectedGravatarEmail } is not registered on Gravatar.
                                            Sign up for a Gravatar account by clicking <a>here</a> or use one of the
                                            following.
                                        </div>
                                    }
                                />
                            )
                        }
                        <div>
                            { renderGravatarOptions() }
                        </div>
                    </div>
                    <div className="avatar-from-url mb-5">
                        <div className="mb-3">
                            <Form.Field>
                                <Checkbox
                                    radio
                                    value={ AvatarTypes.URL }
                                    label="Hosted Image"
                                    checked={ selectedAvatarType === AvatarTypes.URL }
                                    onChange={ handleSelectedAvatarTypeChange }
                                />
                            </Form.Field>
                        </div>
                        <Input
                            label={
                                <Dropdown
                                    defaultValue="https://"
                                    options={ URL_INPUT_PROTOCOL_OPTIONS }
                                />
                            }
                            placeholder="Enter the image URL"
                        />
                    </div>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton onClick={ onSecondaryActionClick }>
                    { secondaryButtonText }
                </LinkButton>
                <PrimaryButton disabled={ !outputURL } onClick={ onPrimaryActionClick }>
                    { primaryButtonText }
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the component.
 */
EditAvatarModal.defaultProps = {
    "data-testid": "edit-avatar-modal",
    dimmer: "blurring",
    heading: "Update profile picture",
    primaryButtonText: "Save",
    secondaryButtonText: "Cancel"
};
