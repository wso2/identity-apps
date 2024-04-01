/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AnimatedAvatar, AppAvatar, EmptyPlaceholder, GenericIcon } from "@wso2is/react-components";
import { IdentifiableComponentInterface } from "@wso2is/core/src/models";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Card } from "semantic-ui-react";
import { AppState, getEmptyPlaceholderIllustrations } from "../../../admin.core.v1";
import { getInboundProtocolLogos } from "../../configs/ui";
import {
    ApplicationTemplateListItemInterface,
    AuthProtocolMetaListItemInterface
} from "../../models";
import { ApplicationManagementUtils } from "../../utils/application-management-utils";
import { InboundProtocolsMeta } from "../meta";

/**
 * Proptypes for the protocol selection wizard form component.
 */
interface ProtocolSelectionWizardFormPropsInterface extends IdentifiableComponentInterface {
    initialSelectedTemplate?: ApplicationTemplateListItemInterface;
    defaultTemplates: ApplicationTemplateListItemInterface[];
    onSubmit: (values: ApplicationTemplateListItemInterface) => void;
    triggerSubmit: boolean;
    selectedProtocols: string[];
    setSelectedCustomInboundProtocol: (selected: boolean) => void;
}

/**
 * Protocol selection wizard form component.
 *
 * @param props - Props injected to the component.
 * @returns Protocol selection wizard form component.
 */
export const ProtocolSelectionWizardForm: FunctionComponent<ProtocolSelectionWizardFormPropsInterface> = (
    props: ProtocolSelectionWizardFormPropsInterface
): ReactElement => {

    const {
        initialSelectedTemplate,
        selectedProtocols,
        onSubmit,
        setSelectedCustomInboundProtocol,
        triggerSubmit,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const customInboundProtocols: AuthProtocolMetaListItemInterface[] = useSelector((state: AppState) =>
        state.application.meta.customInboundProtocols);

    const [
        selectedTemplate,
        setSelectedTemplate
    ] = useState<ApplicationTemplateListItemInterface>(undefined);

    const [ availableCustomInboundProtocols, setAvailableCustomInboundProtocols ] =
        useState<ApplicationTemplateListItemInterface[]>(undefined);

    const [ isInboundProtocolsRequestLoading, setInboundProtocolsRequestLoading ] = useState<boolean>(false);

    const init: MutableRefObject<boolean> = useRef(true);

    /**
     */
    useEffect(() => {
        setInboundProtocolsRequestLoading(true);

        ApplicationManagementUtils.getCustomInboundProtocols(InboundProtocolsMeta, true)
            .finally(() => {
                setInboundProtocolsRequestLoading(false);
            });
    }, []);

    useEffect(() => {
        filterCustomProtocol();
    }, [ customInboundProtocols ]);

    /**
     * Called when submit is triggered.
     */
    useEffect(() => {
        if (init.current) {
            init.current = false;
        } else {
            onSubmit(selectedTemplate);
        }
    }, [ triggerSubmit ]);

    useEffect(() => {
        if (initialSelectedTemplate) {
            setSelectedTemplate(initialSelectedTemplate);
        }
    }, [ initialSelectedTemplate ]);

    /**
     * Filter already existing protocol from the custom inbound template.
     */
    const filterCustomProtocol = (): void => {
        const customTemplates: ApplicationTemplateListItemInterface[] = [];

        if (isInboundProtocolsRequestLoading) {
            return null;
        }

        if (customInboundProtocols?.length > 0) {
            customInboundProtocols.map((protocol: AuthProtocolMetaListItemInterface) => {
                const customTemplate: ApplicationTemplateListItemInterface = {
                    authenticationProtocol: protocol.name,
                    id: protocol.name,
                    image: protocol.name,
                    name: protocol.displayName
                };

                customTemplates.push(customTemplate);
            });

            setAvailableCustomInboundProtocols(customTemplates.filter(
                (temp: ApplicationTemplateListItemInterface) =>
                    !selectedProtocols.includes(temp.authenticationProtocol)));
        }
    };

    return (
        <>
            {
                availableCustomInboundProtocols?.length > 0 ? (
                    <Card.Group className="authenticators-grid">
                        {
                            availableCustomInboundProtocols && availableCustomInboundProtocols.map((
                                customInboundProtocol: ApplicationTemplateListItemInterface,
                                templateIndex: number
                            ) => (
                                <Card
                                    key={ templateIndex }
                                    onClick={ () => {
                                        setSelectedCustomInboundProtocol(true);
                                        setSelectedTemplate(customInboundProtocol);
                                    } }
                                    data-testid={ `${ componentId }-${ customInboundProtocol.name }` }
                                    selected={
                                        selectedTemplate?.id === customInboundProtocol.id
                                    }
                                    className={
                                        selectedTemplate?.id === customInboundProtocol.id
                                            ? "selection-info-card selected"
                                            : "selection-info-card"
                                    }
                                    size="small"
                                >
                                    <Card.Content className="p-4">
                                        <Card.Header
                                            textAlign="left"
                                            className="card-header ellipsis pt-1 inline"
                                            inline
                                        >
                                            {
                                                getInboundProtocolLogos()[customInboundProtocol.id] ? (
                                                    <GenericIcon
                                                        icon={ getInboundProtocolLogos()[customInboundProtocol.id] }
                                                        size="x22"
                                                        floated="left"
                                                        shape="square"
                                                        className="theme-icon hover-rounded card-image p-1"
                                                        inline
                                                    />
                                                ) : (
                                                    <AppAvatar
                                                        image={ (
                                                            <AnimatedAvatar
                                                                name={ customInboundProtocol.id }
                                                                size="mini"
                                                                data-componentid={
                                                                    `${ componentId }-item-image-inner` }
                                                            />
                                                        ) }
                                                        size="mini"
                                                        spaced="right"
                                                        data-testid={ `${ componentId }-item-image` }
                                                        inline
                                                    />
                                                )
                                            }
                                            { customInboundProtocol.name }
                                        </Card.Header>
                                        <Card.Description
                                            className="card-description"
                                        >
                                            { customInboundProtocol.description }
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            ))
                        }
                    </Card.Group>
                ) : (
                    <EmptyPlaceholder
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={
                            t("applications:edit.sections.access.addProtocolWizard" +
                                ".steps.protocolSelection.quickSetup.emptyPlaceholder.title")
                        }
                        subtitle={
                            t("applications:edit.sections.access.addProtocolWizard" +
                                ".steps.protocolSelection.quickSetup.emptyPlaceholder.subtitles")
                        }
                    />
                )
            }
        </>
    );
};

/**
 * Default props for the application protocol selection wizard form component.
 */
ProtocolSelectionWizardForm.defaultProps = {
    "data-componentid": "application-protocol-selection-wizard-form"
};
