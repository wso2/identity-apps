/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import PropTypes from "prop-types";
import React from "react";
import { Button } from "semantic-ui-react";
import appleIcon from "../../assets/identity-providers/apple.svg";
import facebookIcon from "../../assets/identity-providers/facebook.svg";
import githubIcon from "../../assets/identity-providers/github.svg";
import googleIcon from "../../assets/identity-providers/google.svg";
import microsoftIcon from "../../assets/identity-providers/microsoft.svg";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";

const ButtonAdapter = ({ component, handleButtonAction }) => {

    const { translations } = useTranslations();

    /**
     * Resolves the provider icon based on the image URL.
     * @param imageUrl
     * @returns The resolved icon URL or null if not found.
     */
    const resolveProviderIcon = (imageUrl) => {
        if (!imageUrl) return null;

        if (imageUrl.includes("facebook")) return facebookIcon;
        if (imageUrl.includes("google")) return googleIcon;
        if (imageUrl.includes("microsoft")) return microsoftIcon;
        if (imageUrl.includes("github")) return githubIcon;
        if (imageUrl.includes("apple")) return appleIcon;

        return imageUrl;
    };

    switch (component.variant) {
        case "PRIMARY":
            return (
                <Button
                    className="ui primary fluid large button mt-4"
                    type={ component.config.type }
                    name={ component.id }
                    onClick={ component.config.type !== "submit"
                        ? () => handleButtonAction(component.id, {})
                        : null
                    }
                >
                    { resolveElementText(translations, component.config.text) }
                </Button>
            );
        case "SECONDARY":
            return (
                <Button
                    type={ component.config.type }
                    className="ui secondary fluid large button mt-4"
                    name={ component.id }
                    onClick={ component.config.type !== "submit"
                        ? () => handleButtonAction(component.id, {})
                        : null
                    }
                >
                    { resolveElementText(translations, component.config.text) }
                </Button>
            );
        case "TEXT":
            return (
                <Button
                    type={ component.type }
                    name={ component.id }
                    className="link mt-4"
                    onClick={ component.config.type !== "submit"
                        ? () => handleButtonAction(component.id, {})
                        : null
                    }
                >
                    { resolveElementText(translations, component.config.text) }
                </Button>
            );
        case "SOCIAL":
            return (
                <div className="social-login mt-4">
                    <Button
                        type={ component.config.type }
                        className="ui button social"
                        name={ component.id }
                        onClick={ () => handleButtonAction(component.id, {}) }
                    >
                        <img
                            className="ui image"
                            src={ resolveProviderIcon(component.config.image) }
                            alt="Connection Login icon"
                            role="presentation"
                        />
                        <span>{ resolveElementText(translations, component.config.text) }</span>
                    </Button>
                </div>
            );
        default:
            return (
                <Button
                    type={ component.type }
                    name={ component.id }
                    className="ui button mt-4"
                    onClick={ component.config.type !== "submit"
                        ? () => handleButtonAction(component.id, {})
                        : null
                    }
                >
                    { resolveElementText(translations, component.config.text) }
                </Button>
            );
    }
};

ButtonAdapter.propTypes = {
    component: PropTypes.shape({
        action: PropTypes.object.isRequired,
        config: PropTypes.shape({
            image: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired
        }).isRequired,
        id: PropTypes.string,
        type: PropTypes.string,
        variant: PropTypes.string
    }).isRequired,
    handleButtonAction: PropTypes.func.isRequired
};

export default ButtonAdapter;
