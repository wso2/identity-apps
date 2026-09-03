/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { AddCertificateFormComponent } from "@wso2is/admin.core.v1/components/add-certificate-form";
import Box from "@oxygen-ui/react/Box";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { CertificateManagementConstants } from "@wso2is/core/constants";
import { CertificateValidity, DisplayCertificate } from "@wso2is/core/models";
import { CertificateManagementUtils, URLUtils } from "@wso2is/core/utils";
import {
    EmphasizedSegment,
    Hint,
    LinkButton,
    Popup,
    PrimaryButton,
    UserAvatar
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Icon, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import {
    IssuerConfigInterface,
    IssuerConfigModalPropsInterface
} from "../models/presentation-definitions";

/**
 * Modal for adding or editing a single trusted issuer configuration.
 */
export const IssuerConfigModal: FunctionComponent<IssuerConfigModalPropsInterface> = ({
    isOpen,
    onClose,
    onSave,
    existingConfig,
    isSaving = false,
    "data-componentid": componentId = "issuer-config-modal"
}: IssuerConfigModalPropsInterface): ReactElement => {

    const { t, i18n } = useTranslation();

    const [ method, setMethod ] = useState<string>("x5c");
    const [ issuerUrl, setIssuerUrl ] = useState<string>("");
    const [ jwksUri, setJwksUri ] = useState<string>("");
    // Tracks the cert already saved in the config (edit mode). Cleared when user replaces it.
    const [ existingCert, setExistingCert ] = useState<string>("");
    const [ triggerCertUpload, setTriggerCertUpload ] = useState<boolean>(false);
    const [ showCertFinishButton, setShowCertFinishButton ] = useState<boolean>(false);
    // Set to true when "Add/Update" is clicked for a cert method so handleCertSubmit knows to save.
    const pendingSaveRef: MutableRefObject<boolean> = useRef<boolean>(false);

    useEffect((): void => {
        setMethod(existingConfig?.keySourceType ?? "x5c");
        setIssuerUrl(existingConfig?.issuerUrl ?? "");
        setJwksUri(existingConfig?.keySource ?? "");
        setExistingCert(existingConfig?.keySource ?? "");
        setTriggerCertUpload(false);
        setShowCertFinishButton(false);
        pendingSaveRef.current = false;
    }, [ existingConfig, isOpen ]);

    const handleMethodChange = (newMethod: string): void => {
        if (newMethod === method) return;
        setMethod(newMethod);
        setExistingCert("");
        setShowCertFinishButton(false);
    };

    const parsedCert: DisplayCertificate | null = useMemo((): DisplayCertificate | null => {
        if (!existingCert) return null;

        try {
            const rawPem: string = atob(existingCert);

            if (CertificateManagementUtils.canSafelyParseCertificate(rawPem)) {
                return CertificateManagementUtils.displayCertificate(null, rawPem);
            }

            return CertificateManagementConstants.DUMMY_DISPLAY_CERTIFICATE;
        } catch {
            return CertificateManagementConstants.DUMMY_DISPLAY_CERTIFICATE;
        }
    }, [ existingCert ]);

    const issuerUrlError: boolean = issuerUrl.trim().length > 0
        && !URLUtils.isHttpUrl(issuerUrl) && !URLUtils.isHttpsUrl(issuerUrl);
    const jwksUriError: boolean = jwksUri.trim().length > 0
        && !URLUtils.isHttpUrl(jwksUri) && !URLUtils.isHttpsUrl(jwksUri);

    const isSaveDisabled: boolean = (() => {
        if (method === "x5c") return !showCertFinishButton && !existingCert;
        if (method === "jwks_uri") return !issuerUrl.trim() || issuerUrlError || !jwksUri.trim() || jwksUriError;
        if (method === "pem") return !issuerUrl.trim() || issuerUrlError || (!showCertFinishButton && !existingCert);

        return true;
    })();

    const buildConfig = (cert: string): IssuerConfigInterface => ({
        keySourceType: method,
        ...(method !== "x5c" && { issuerUrl: issuerUrl.trim() || undefined }),
        ...((method === "x5c" || method === "pem") && { keySource: cert }),
        ...(method === "jwks_uri" && { keySource: jwksUri.trim() })
    });

    const handleSave = (): void => {
        if ((method === "x5c" || method === "pem") && showCertFinishButton) {
            // New cert staged in widget — trigger commit; handleCertSubmit completes the save.
            pendingSaveRef.current = true;
            setTriggerCertUpload((prev: boolean) => !prev);
        } else {
            onSave(buildConfig(existingCert));
        }
    };

    const handleCertSubmit = (base64Cert: string): void => {
        if (pendingSaveRef.current) {
            pendingSaveRef.current = false;
            onSave(buildConfig(base64Cert));
        }
    };

    const certValidityLabel = (): ReactNode => {
        if (!parsedCert || parsedCert.infoUnavailable) {
            return (
                <span className="with-muted-list-item-header">
                    { t("presentationDefinitions:editPage.issuerTrust.certificate.infoUnavailable") }
                </span>
            );
        }

        let icon: SemanticICONS;
        let iconColor: SemanticCOLORS;
        const validity: CertificateValidity = CertificateManagementUtils.determineCertificateValidityState({
            from: parsedCert.validFrom,
            to: parsedCert.validTill
        });

        switch (validity) {
            case CertificateValidity.VALID:
                icon = "check circle";
                iconColor = "green";
                break;
            case CertificateValidity.WILL_EXPIRE_SOON:
                icon = "exclamation circle";
                iconColor = "yellow";
                break;
            default:
                icon = "times circle";
                iconColor = "red";
        }

        const expiryLabel: string = parsedCert.validTill
            ? t("presentationDefinitions:editPage.issuerTrust.certificate.expiryDate", {
                date: new Date(parsedCert.validTill).toLocaleDateString(i18n.language)
            })
            : "";

        return (
            <>
                { CertificateManagementUtils.searchIssuerDNAlias(parsedCert.issuerDN) }
                { " " }
                <Popup
                    trigger={ <Icon name={ icon } color={ iconColor } /> }
                    content={ expiryLabel }
                    inverted
                    position="top left"
                    size="mini"
                />
            </>
        );
    };

    const clearCert = (): void => {
        setExistingCert("");
        setShowCertFinishButton(false);
    };

    const certLabel: string = method === "x5c"
        ? t("presentationDefinitions:editPage.issuerTrust.issuerConfig.keySource.x5cLabel")
        : t("presentationDefinitions:editPage.issuerTrust.issuerConfig.keySource.pemLabel");

    const certSection: ReactNode = (
        <Box sx={ { mt: 2 } }>
            <Typography component="div" color="text.secondary" variant="body1" style={ { marginBottom: "4px" } }>
                { certLabel }
            </Typography>
            { existingCert ? (
                <EmphasizedSegment>
                    <div style={ { alignItems: "center", display: "flex", gap: "1em" } }>
                        <UserAvatar
                            name={
                                parsedCert?.infoUnavailable
                                    ? CertificateManagementConstants.QUESTION_MARK
                                    : CertificateManagementUtils.searchIssuerDNAlias(parsedCert?.issuerDN)
                            }
                            size="mini"
                            floated="left"
                        />
                        <div style={ { flex: 1 } }>
                            <div>{ certValidityLabel() }</div>
                            { parsedCert && !parsedCert.infoUnavailable && (
                                <div style={ { color: "grey", fontSize: "13px" } }>
                                    { CertificateManagementUtils.getValidityPeriodInHumanReadableFormat(
                                        parsedCert.validFrom,
                                        parsedCert.validTill
                                    ) }
                                </div>
                            ) }
                        </div>
                        <Popup
                            trigger={
                                <Icon
                                    link
                                    name="pencil"
                                    size="small"
                                    color="grey"
                                    className="list-icon"
                                    onClick={ clearCert }
                                    data-componentid={ `${ componentId }-change-cert-button` }
                                />
                            }
                            content={ t(
                                "presentationDefinitions:editPage.issuerTrust.certificate.actions.change"
                            ) }
                            inverted
                            position="top center"
                            size="mini"
                        />
                        <Popup
                            trigger={
                                <Icon
                                    link
                                    name="trash alternate"
                                    size="small"
                                    color="grey"
                                    className="list-icon"
                                    onClick={ clearCert }
                                    data-componentid={ `${ componentId }-remove-cert-button` }
                                />
                            }
                            content={ t(
                                "presentationDefinitions:editPage.issuerTrust.certificate.actions.remove"
                            ) }
                            inverted
                            position="top center"
                            size="mini"
                        />
                    </div>
                </EmphasizedSegment>
            ) : (
                <AddCertificateFormComponent
                    triggerCertificateUpload={ triggerCertUpload }
                    onSubmit={ handleCertSubmit }
                    setShowFinishButton={ setShowCertFinishButton }
                    data-componentid={ `${ componentId }-cert-form` }
                />
            ) }
        </Box>
    );

    return (
        <Dialog
            open={ isOpen }
            fullWidth
            maxWidth={ false }
            onClose={ (_: unknown, reason: string): void => {
                if (reason !== "backdropClick") {
                    onClose();
                }
            } }
            PaperProps={ { sx: { maxWidth: 680, width: "100%" } } }
            data-componentid={ componentId }
        >
            <DialogTitle>
                { existingConfig
                    ? t("presentationDefinitions:editPage.issuerTrust.issuerConfig.editTitle")
                    : t("presentationDefinitions:editPage.issuerTrust.issuerConfig.addTitle")
                }
                <Typography variant="body2" color="text.secondary" sx={ { mt: 0.5 } }>
                    { t(
                        "presentationDefinitions:editPage.issuerTrust.issuerConfig.modalSubtitle"
                    ) }
                </Typography>
            </DialogTitle>
            <DialogContent dividers sx={ { minHeight: 560, paddingY: 2 } }>
                <FormControl fullWidth>
                    <Typography
                        component="div"
                        color="text.secondary"
                        variant="body1"
                        style={ { marginBottom: "4px" } }
                    >
                        { t(
                            "presentationDefinitions:editPage.issuerTrust.issuerConfig" +
                            ".keyResolutionMethod.label"
                        ) }
                    </Typography>
                    <RadioGroup
                        row
                        name="issuer-config-method"
                        value={ method }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                            handleMethodChange(e.target.value)
                        }
                        data-componentid={ `${ componentId }-method-group` }
                    >
                        <FormControlLabel
                            value="x5c"
                            control={ <Radio size="small" /> }
                            label={
                                <span style={ { alignItems: "center", display: "inline-flex", whiteSpace: "nowrap" } }>
                                    { t(
                                        "presentationDefinitions:editPage.issuerTrust" +
                                        ".keyResolutionMethod.options.x5c"
                                    ) }
                                    <Popup
                                        trigger={
                                            <Icon
                                                name="info circle"
                                                size="small"
                                                color="grey"
                                                className="ml-1"
                                            />
                                        }
                                        content={ t(
                                            "presentationDefinitions:editPage.issuerTrust" +
                                            ".keyResolutionMethod.optionHints.x5c"
                                        ) }
                                        inverted
                                        position="top center"
                                        size="mini"
                                    />
                                </span>
                            }
                            data-componentid={ `${ componentId }-method-x5c` }
                        />
                        <FormControlLabel
                            value="jwks_uri"
                            control={ <Radio size="small" /> }
                            label={
                                <span style={ { alignItems: "center", display: "inline-flex", whiteSpace: "nowrap" } }>
                                    { t(
                                        "presentationDefinitions:editPage.issuerTrust" +
                                        ".keyResolutionMethod.options.jwks_uri"
                                    ) }
                                    <Popup
                                        trigger={
                                            <Icon
                                                name="info circle"
                                                size="small"
                                                color="grey"
                                                className="ml-1"
                                            />
                                        }
                                        content={ t(
                                            "presentationDefinitions:editPage.issuerTrust" +
                                            ".keyResolutionMethod.optionHints.jwks_uri"
                                        ) }
                                        inverted
                                        position="top center"
                                        size="mini"
                                    />
                                </span>
                            }
                            data-componentid={ `${ componentId }-method-jwks-uri` }
                        />
                        <FormControlLabel
                            value="pem"
                            control={ <Radio size="small" /> }
                            label={
                                <span style={ { alignItems: "center", display: "inline-flex", whiteSpace: "nowrap" } }>
                                    { t(
                                        "presentationDefinitions:editPage.issuerTrust" +
                                        ".keyResolutionMethod.options.pem"
                                    ) }
                                    <Popup
                                        trigger={
                                            <Icon
                                                name="info circle"
                                                size="small"
                                                color="grey"
                                                className="ml-1"
                                            />
                                        }
                                        content={ t(
                                            "presentationDefinitions:editPage.issuerTrust" +
                                            ".keyResolutionMethod.optionHints.pem"
                                        ) }
                                        inverted
                                        position="top center"
                                        size="mini"
                                    />
                                </span>
                            }
                            data-componentid={ `${ componentId }-method-pem` }
                        />
                    </RadioGroup>
                </FormControl>

                { method !== "x5c" && (
                    <Box
                        key="issuer-url"
                        sx={ {
                            "@keyframes slideDown": {
                                from: { opacity: 0, transform: "translateY(-8px)" },
                                to: { opacity: 1, transform: "translateY(0)" }
                            },
                            animation: "slideDown 0.2s ease",
                            mt: 3
                        } }
                    >
                        <TextField
                            fullWidth
                            required
                            size="small"
                            margin="dense"
                            label={ t(
                                "presentationDefinitions:editPage.issuerTrust" +
                                ".issuerConfig.issuerUrl.label"
                            ) }
                            InputLabelProps={ { required: true } }
                            placeholder={ t(
                                "presentationDefinitions:editPage.issuerTrust" +
                                ".issuerConfig.issuerUrl.placeholder"
                            ) }
                            value={ issuerUrl }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                setIssuerUrl(e.target.value)
                            }
                            error={ issuerUrlError }
                            helperText={ issuerUrlError
                                ? t("presentationDefinitions:editPage.issuerTrust" +
                                    ".issuerConfig.issuerUrl.validationError")
                                : undefined
                            }
                            sx={ { mb: 0.5 } }
                            data-componentid={ `${ componentId }-issuer-url-input` }
                        />
                        <Hint compact>
                            { t(
                                "presentationDefinitions:editPage.issuerTrust.issuerConfig.issuerUrl.hint"
                            ) }
                        </Hint>
                    </Box>
                ) }

                { method === "jwks_uri" && (
                    <Box
                        key="jwks-uri"
                        sx={ {
                            "@keyframes slideDown": {
                                from: { opacity: 0, transform: "translateY(-8px)" },
                                to: { opacity: 1, transform: "translateY(0)" }
                            },
                            animation: "slideDown 0.2s ease",
                            mt: 2
                        } }
                    >
                        <TextField
                            fullWidth
                            required
                            size="small"
                            margin="dense"
                            label={ t(
                                "presentationDefinitions:editPage.issuerTrust.jwksUri.label"
                            ) }
                            InputLabelProps={ { required: true } }
                            placeholder={ t(
                                "presentationDefinitions:editPage.issuerTrust.jwksUri.placeholder"
                            ) }
                            value={ jwksUri }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                setJwksUri(e.target.value)
                            }
                            error={ jwksUriError }
                            helperText={ jwksUriError
                                ? t("presentationDefinitions:editPage.issuerTrust.jwksUri.validationError")
                                : undefined
                            }
                            sx={ { mb: 0.5 } }
                            data-componentid={ `${ componentId }-jwks-uri-input` }
                        />
                        <Hint compact>
                            { t("presentationDefinitions:editPage.issuerTrust.jwksUri.hint") }
                        </Hint>
                    </Box>
                ) }

                { (method === "x5c" || method === "pem") && (
                    <Box
                        key="cert-section"
                        sx={ {
                            "@keyframes slideDown": {
                                from: { opacity: 0, transform: "translateY(-8px)" },
                                to: { opacity: 1, transform: "translateY(0)" }
                            },
                            animation: "slideDown 0.2s ease"
                        } }
                    >
                        { certSection }
                    </Box>
                ) }
            </DialogContent>
            <DialogActions sx={ { paddingX: 2, paddingY: 1.5 } }>
                <LinkButton
                    onClick={ onClose }
                    data-componentid={ `${ componentId }-cancel-button` }
                >
                    { t("common:cancel") }
                </LinkButton>
                <PrimaryButton
                    disabled={ isSaveDisabled || isSaving }
                    loading={ isSaving }
                    onClick={ handleSave }
                    data-componentid={ `${ componentId }-save-button` }
                >
                    { existingConfig ? t("common:update") : t("common:add") }
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};
