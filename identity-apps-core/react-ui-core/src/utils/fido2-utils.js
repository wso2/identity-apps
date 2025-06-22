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

export const executeFido2FLow = (flow, handleSubmit, setPasskeyError) => {

    if (flow.data.webAuthnData) {
        switch (flow.data.webAuthnData.action) {
            case "WEBAUTHN_CREATE":
                createPasskey(flow.data.webAuthnData)
                    .then(({ credentialResponse }) => {
                        const credential = JSON.stringify(credentialResponse);

                        handleSubmit({
                            actionId: "",
                            flowId: flow.flowId,
                            inputs: { credential }
                        });
                    })
                    .catch((err) => {
                        if (err instanceof DOMException && err.name === "InvalidStateError") {
                            setPasskeyError(
                                "This passkey is already registered with your account. You may try logging in instead."
                            );
                        } else {
                            setPasskeyError("Passkey enrollment cancelled or failed. Please try again.");
                        }
                    });
        }
    }
};

export const arrayBufferToBase64url = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";

    bytes.forEach((b) => (binary += String.fromCharCode(b)));

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const encodeCredential = (response) =>{
    if (response.u2fResponse) {
        return response;
    }

    let clientExtensionResults = {};

    try {
        clientExtensionResults = response.getClientExtensionResults();
    } catch (e) {
        console.error("getClientExtensionResults failed", e);
    }

    if (response.response.attestationObject) {
        return {
            id: response.id,
            response: {
                attestationObject: arrayBufferToBase64url(response.response.attestationObject),
                clientDataJSON: arrayBufferToBase64url(response.response.clientDataJSON)
            },
            clientExtensionResults,
            type: response.type
        };
    } else {
        return {
            id: response.id,
            response: {
                authenticatorData: arrayBufferToBase64url(response.response.authenticatorData),
                clientDataJSON: arrayBufferToBase64url(response.response.clientDataJSON),
                signature: arrayBufferToBase64url(response.response.signature),
                userHandle: response.response.userHandle
                    ? arrayBufferToBase64url(response.response.userHandle)
                    : null
            },
            clientExtensionResults,
            type: response.type
        };
    }
};

export const base64urlToUint8Array = (base64url) => {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
    const decoded = atob(base64 + pad);

    return new Uint8Array(decoded.split("").map((c) => c.charCodeAt(0)));
};

export const decodePublicKeyCredentialOptions = (request) => {
    return {
        ...request,
        attestation: "direct",
        challenge: base64urlToUint8Array(request.challenge),
        user: {
            ...request.user,
            id: base64urlToUint8Array(request.user.id)
        },
        excludeCredentials: (request.excludeCredentials || []).map((cred) => ({
            ...cred,
            id: base64urlToUint8Array(cred.id)
        }))
    };
};

export const createPasskey = async (webAuthnData) => {
    const options = decodePublicKeyCredentialOptions(webAuthnData.publicKeyCredentialCreationOptions);
    const credential = await navigator.credentials.create({ publicKey: options });

    if (!credential) {
        throw new Error("Credential creation failed");
    }

    return {
        credentialResponse: encodeCredential(credential)
    };
};
