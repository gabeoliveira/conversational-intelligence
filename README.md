# Twilio Conversational Intelligence Service

## Overview

A Twilio Serverless Service to automatically run [Conversational Intelligence](https://www.twilio.com/docs/conversational-intelligence) upon Conversation close

## Features

- Twilio Function to Run Intelligence upon Conversation closing

## Prerequisites

- Node.js (v16+)
- npm
- [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit)

## Setup

### Serverless Deployment

1. Clone this repository

2. Navigate to the project directory:
   ```sh
   cd conversational-intelligence
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Copy the sample environment file and configure the environment variables:
   ```sh
   cp .env.example .env
   ```

Once created, open `.env` in your code editor. You are required to set the following environment variables for the app to function properly:
| Variable Name | Description | Example Value |
|-------------------|--------------------------------------------------|------------------------|
| `ACCOUNT_SID` | Your Twilio Account SID, which can be found in the Twilio Console. Needed for local testing only | `ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `AUTH_TOKEN` | Your Twilio Auth Token, which is also found in the Twilio Console. Needed for local testing only | `your_auth_token_here` |
| `INTELLIGENCE_SERVICE_SID` | The Conversational Intelligence Service SID. You can create one [here](https://console.twilio.com/us1/develop/conversational-intelligence/services). |`GAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`|
| `CONVERSATION_SERVICE_SID` | The Conversations Service SID you're monitoring, | `ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |

### Run the app locally

Once dependencies are installed, `.env` is set up, , run the service locally with the following command:

```sh
twilio serverless:start
```

### Deploying the service

To deploy the service into Twilio's cloud, run the following command:

```sh
twilio serverless:deploy
```

Take note of your function domain. You are going to use it later.

### 🚀 Deploying via GitHub Actions

If you prefer not to install the Twilio CLI or deploy manually, you can use the included GitHub Actions workflow:

#### 1. Fork or Clone the Repository

Fork this repository or clone it to your own GitHub account.

#### 2. Add GitHub Secrets

Go to **Settings > Secrets and variables > Actions > New repository secret** and add the following secrets:

| Secret Name                | Description                                  |
| -------------------------- | -------------------------------------------- |
| `TWILIO_ACCOUNT_SID`       | Your Twilio Account SID                      |
| `TWILIO_AUTH_TOKEN`        | Your Twilio Auth Token                       |
| `INTELLIGENCE_SERVICE_SID` | Your Conversational Intelligence Service SID |
| `CONVERSATION_SERVICE_SID` | Your Conversations Service SID               |

#### 3. Trigger the Workflow

Once the secrets are set up:

1. Navigate to the **Actions** tab on GitHub.
2. Select **Deploy to Twilio Serverless**.
3. Click **Run workflow**.
4. Wait for the workflow to complete — it will deploy your service to Twilio and print the Function URL in the logs.

> 📝 You can now use this Function URL in your Event Streams configuration (e.g., `https://your-service.twil.io/run-intelligence`).

### Setting up Event Streams

Once your service is deployed (either locally or in the cloud), you need to set up a Webhook to be triggered by an event. We recommend using [Event Streams](https://www.twilio.com/docs/events), as it gives you more control on which events you wish to receiving, while still allowing you to use the Conversations Post-Event Webhooks for other uses.

We also recommend you to monitor when a conversation is closed, as you know for sure the conversation is not gonna get any new messages, therefore avoiding running transcriptions multiple times. To set it up with this approach:

1. Create a [Event Sink](https://console.twilio.com/us1/develop/event-streams/sinks) by selecting **Create Sink**
2. Select Webhook filling the webhook details with `https://[your_function_domain]/run-intelligence` (if you are running the service locally, remember to expose port 3000 using a tool such as **ngrok**)
3. Create a new subscription by selecting **Create Subscription**
4. Select the newly created Sink
5. Select **Conversations** as the event type and **Conversation State > Updated** (you can select the most recent schema version)
6. Finish the Subscription Creation

### Working with Conversation Timeouts

Conversations allows you to define default timers for a conversation to transition to **inactive** and **closed**. You can change them [here](https://console.twilio.com/us1/develop/conversations/manage/defaults). Keep in mind timers must be defined using a ISO8601 format. For example, to define a 1-hour timer, you should define it as `PT1H`

## License

This project is licensed under the MIT License.
