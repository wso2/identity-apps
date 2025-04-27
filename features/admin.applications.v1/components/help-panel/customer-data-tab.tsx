import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    CopyInputField,
    Heading,
    Code,
    Hint,
    EmphasizedSegment,
    PrimaryButton
} from "@wso2is/react-components";
import { Grid, Divider, Icon } from "semantic-ui-react";

interface Props {
    appId: string;
    profileId: string;
    orgName: string;
    isHost: string;
}

const CustomerDataTabPane = ({
    appId,
    profileId,
    orgName,
    isHost
}: Props): React.ReactElement => {

    const [ currentKey, setCurrentKey ] = useState<string>(""); // 👈 Fix here
    const [ isSecretVisible, setIsSecretVisible ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const publishingEndpoint = `https://${isHost}/${orgName}/${appId}/Events`;
    const profileEndpoint = `https://${isHost}/${orgName}/profile/${profileId}`;
    const writekeyEndpoint = `http://localhost:8900/api/v1/events/write-key/${appId}`;

    const fetchWriteKey = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(writekeyEndpoint);
            if (response.data?.write_key) {
                setCurrentKey(response.data.write_key);
            }
        } catch (error) {
            console.error("Failed to fetch new write key:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWriteKey(); // 👈 Also automatically fetch at mount
    }, []);

    const handleRegenerate = () => {
        fetchWriteKey();
    };

    const commonInputStyle = {
        background: "#f9f9f9"
    };

    return (
        <EmphasizedSegment padded="very" className="form-container with-max-width">
            <Grid>
                <Grid.Row>
                    <Grid.Column>

                        <Heading as="h4">SDK Details</Heading>
                        <Heading as="h6" color="grey" compact>
                            Use the following configuration to integrate the tracker into your application.
                        </Heading>

                        <Divider hidden />

                        <Heading as="h5">Write Key</Heading>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column width={12}>
                                    <CopyInputField
                                        value={ currentKey }
                                        secret
                                        fluid
                                        isSecretVisible={ isSecretVisible }
                                        setIsSecretVisible={ setIsSecretVisible }
                                        showSecretLabel="View"
                                        hideSecretLabel="Hide"
                                        inputStyle={ commonInputStyle }
                                        data-componentid="customer-data-write-key"
                                        loading={ isLoading }
                                    />
                                </Grid.Column>
                                <Grid.Column width={4} textAlign="right">
                                    <PrimaryButton
                                        basic
                                        compact
                                        onClick={ handleRegenerate }
                                        loading={ isLoading }
                                        disabled={ isLoading }
                                        data-componentid="write-key-regenerate-button"
                                    >
                                        <Icon name="refresh" />
                                        Regenerate
                                    </PrimaryButton>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                        <Divider hidden />

                        <Heading as="h5">Publishing Endpoint</Heading>
                        <CopyInputField
                            value={ publishingEndpoint }
                            readOnly
                            fluid
                            inputStyle={ commonInputStyle }
                            data-componentid="customer-data-publishing-endpoint"
                        />

                        <Divider hidden />

                        <Heading as="h5">Profile Endpoint</Heading>
                        <CopyInputField
                            value={ profileEndpoint }
                            readOnly
                            fluid
                            inputStyle={ commonInputStyle }
                            data-componentid="customer-data-profile-endpoint"
                        />

                        <Divider section />

                        <Heading as="h5">
                            If you prefer to use our JavaScript <code>customer-data-tracker-sdk</code>
                        </Heading>

                        <p><strong>Step 1: Import SDK</strong></p>
                        <Code language="javascript">
{`import { CustomerDataTracker } from '@asgardeo/customer-data-tracker';`}
                        </Code>

                        <p><strong>Step 2: Configuration</strong></p>
                        <Code language="javascript">
{`const trackerConfig = {
    writeKey: "${currentKey}",
    appId: "${appId}",
    orgName: "${orgName}",
    publishing_endpoint: "${publishingEndpoint}",
    gather_consent: "true",
    auto_track_page_event: "true"
};`}
                        </Code>

                        <p><strong>Step 3: Initiate Tracker</strong></p>
                        <Code language="jsx">
{`<CustomerDataTracker config={trackerConfig}>
    <App />
</CustomerDataTracker>`}
                        </Code>

                        <p><strong>Step 4: Publish Events</strong></p>
                        <Code language="javascript">
{`tracker.track("category_searched", {
    action: "select_category",
    objecttype: "category",
    objectname: "cat"
});

tracker.identify("signed-up", {
    region: "us",
    username: "hello@wso2.com"
});

tracker.page("page_visited", {
    page_title: "select_category"
});`}
                        </Code>

                        <Divider hidden />

                        <Hint icon="info circle">
                            Follow the{" "}
                            <a
                                href="https://docs.asgardeo.io/customer-data-tracker"
                                target="_blank"
                                rel="noreferrer"
                            >
                                documentation
                            </a>{" "}
                            for the complete guide to track user interactions.
                        </Hint>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EmphasizedSegment>
    );
};

export default CustomerDataTabPane;
