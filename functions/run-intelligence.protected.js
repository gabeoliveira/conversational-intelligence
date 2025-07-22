const axios = require('axios');

exports.handler = async function (context, event, callback) {
  const { ACCOUNT_SID, AUTH_TOKEN, INTELLIGENCE_SERVICE_SID, CONVERSATION_SERVICE_SID } = context;
  const { ConversationSid, StateTo } = event['0'].data;

  console.log('Event received', event['0'].data);

  if (!ConversationSid || !StateTo) {
    return callback("Missing ConversationSid or State in webhook payload.");
  }

  if (StateTo !== 'closed') {
    console.log(`Ignoring state: ${StateTo}`);
    return callback(null, { success: false, reason: 'Conversation not closed.' });
  }

  const url = `https://conversations.twilio.com/v1/Services/${CONVERSATION_SERVICE_SID}/Conversations/${ConversationSid}/Export`;

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        IntelligenceServiceSid: INTELLIGENCE_SERVICE_SID
      }),
      {
        auth: {
          username: ACCOUNT_SID,
          password: AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('Export triggered:', response.data);
    return callback(null, { success: true, result: response.data });
  } catch (error) {
    console.error('Error exporting conversation:', error.response?.data || error.message);
    return callback(null, {
      success: false,
      error: error.response?.data || error.message
    });
  }
};
