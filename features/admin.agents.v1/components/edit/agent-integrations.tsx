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

import { CardActions, CardContent, Grid, Typography } from "@mui/material";
import Card from "@oxygen-ui/react/Card";
import { ChevronRightIcon } from "@oxygen-ui/react-icons";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { useState } from "react";
import { Icon, Input } from "semantic-ui-react";
import AddIntegrationWizard from "../wizards/add-integration-wizard";

export default function AgentIntegrations() {

    const [trigger, setTrigger] = useState(false);
    const [ integrations, setIntegrations ] = useState([
        {
          configured: false,
          id: 1,
          name: "Google Calendar",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
        },
        {
          configured: true,
          id: 2,
          name: "Slack",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg"
        },
        {
          configured: true,
          id: 3,
          name: "Microsoft Outlook",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg"
        },
        {
          configured: true,
          id: 4,
          name: "Trello",
          imageUrl: "https://static.macupdate.com/products/60125/m/trello-logo.png?v=1665560228"
        },
        {
          configured: false,
          id: 5,
          name: "Asana",
          imageUrl: "https://pipedream.com/s.v0/app_OVWhPX/logo/orig"
        },
        {
          configured: false,
          id: 6,
          name: "GitHub",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
        },
        {
          configured: true,
          id: 7,
          name: "Jira",
          imageUrl: "https://avatars.slack-edge.com/2018-11-09/476199963234_caeebdb247973fece066_512.png"
        },
        {
          configured: false,
          id: 8,
          name: "Notion",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"
        },
        {
          configured: true,
          id: 9,
          name: "Dropbox",
          imageUrl: "https://store-images.s-microsoft.com/image/apps.23871.13668225141277943.68205d94-7cbe-41f0-893f-53305fceb682.4c98395a-28d0-4eee-9b6e-08ecd210e980?h=210"
        }
      ])

    const [ selectedIntegration, setSelectedIntegration ] = useState<any>();

    return (<EmphasizedSegment padded="very" style={ { border: "none", padding: "21px" } }>
        <Typography variant="h4">
            Connections
        </Typography>
        <Typography variant="body1" className="mb-5" style={ { color: "#9c9c9c" } }>
            { /*eslint-disable-next-line react/no-unescaped-entities */ }
            Enable the agent to authenticate using connections.
        </Typography>

        <Input
            data-testid="user-mgt-groups-list-search-input"
            icon={ <Icon name="search"/> }
            onChange={ null }
            placeholder={ "Search integrations" }
            floated="left"
            size="large"
            style={ { width: "100%", marginBottom: "25px" } }
        />


        <Grid container spacing={ 2 }>
            { integrations.map((integration: any) => (
                <Grid
                    item
                    xs={ 12 }
                    sm={ 6 }
                    md={ 4 }
                    key={ integration.id }
                >
<Card
    style={{ cursor: "pointer", minHeight: "150px" }}
>
    <CardContent style={{ minHeight: "150px", paddingLeft: 0 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <img 
                src={integration.imageUrl} 
                alt={`${integration.name} logo`}
                style={{ width: "25px", height: "25px", marginRight: "12px" }}
            />
            <Typography variant="h6">{integration.name}</Typography>
        </div>
        {/* <Typography variant="body1" color="textSecondary" style={ { minHeight: "50px" } }>
            { integration?.description }
        </Typography> */}
        <Typography variant="body2" className="mt-2" style={{ color: "orange" }}>
            {integration.configured && (
                <>
                    <Icon name="check circle" />
                    Connected
                </>
            )}
        </Typography>
    </CardContent>
    <CardActions style={{ paddingLeft: 0 }}>
        { integration.configured && <Typography
            style={{
                color: "red",
                cursor: "pointer",
                marginRight: "20px"
            }}
            variant="body1"
        >
 Disconnect
                   

        </Typography>}

        <Typography
            style={{
                color: "orange",
                cursor: "pointer"
            }}
            variant="body1"
            onClick={() => setSelectedIntegration(integration)}
        >
            {integration.configured ? "Update" : (
                <>
                    Configure
                    <ChevronRightIcon className="info-card-inner-action-icon" />
                </>
            )}
        </Typography>
    </CardActions>
</Card>
                </Grid>
            )) }
        </Grid>

        { selectedIntegration && (<AddIntegrationWizard
            onUpdate={(appId: string) => {
                console.log(appId)
        const appsCopy = integrations;
        const index = appsCopy.findIndex((app: any) => app.id === appId);

        if (index !== -1) {
            appsCopy[index].configured = !appsCopy[index].configured; // Toggle the value
        }

        setIntegrations(appsCopy);
        setTrigger(!trigger)
            }}
            selectedIntegration={ selectedIntegration }
            onClose={ () => setSelectedIntegration(null) }
        />) }
    </EmphasizedSegment>);
}
