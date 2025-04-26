import {Client} from '@xmtp/xmtp-js';
import {IS_SANDBOX} from 'dok-wallet-blockchain-networks/config/config';
import {ContentTypeCustomReplyCodec} from './xmtpContentReplyType';

export const XMTP = {
  client: null,
  initializeClient: async ({wallet, address}) => {
    if (XMTP.client?.address !== address) {
      XMTP.client = await Client.create(wallet, {
        env: IS_SANDBOX ? 'dev' : 'production',
        codecs: [new ContentTypeCustomReplyCodec()],
      });
    }
  },
  getClient: () => {
    if (!XMTP.client) {
      console.warn('Please initialize client first');
      return;
    }
    return XMTP.client;
  },
  getConversations: async () => {
    if (!XMTP.client) {
      console.warn('Please initialize client first');
      return;
    }
    const conversations = await XMTP.client.conversations.list();
    await XMTP.client.contacts.refreshConsentList();
    return await XMTP.formatConversation(conversations);
  },
  checkAccountExists: async ({address}) => {
    if (!XMTP.client) {
      console.warn('Please initialize client first');
      return;
    }
    return await XMTP.client.canMessage(address);
  },
  getTotalMessagesCount: async ({topic}) => {
    if (!XMTP.client) {
      console.warn('Please initialize client first');
      return;
    }
    let convo;
    if (XMTP.client && XMTP.client.conversations) {
      for (const conversation of await XMTP.client.conversations.list()) {
        if (conversation?.topic === topic) {
          convo = conversation;
          break;
        }
      }
      if (convo) {
        const messages = await convo.messages();
        return messages?.length;
      }
    }
  },
  getMessages: async ({topic, limit = 20, before = null, prevMessages}) => {
    if (!XMTP.client) {
      console.warn('Please initialize client first');
      return;
    }
    let convo;
    for (const conversation of await XMTP.client.conversations.list()) {
      //find topic
      if (conversation?.topic === topic) {
        convo = conversation;
        break;
      }
    }
    if (convo) {
      let opts = {
        limit,
        direction: 'SORT_DIRECTION_DESCENDING',
      };

      if (before) {
        opts = {
          ...opts,
          endTime: before,
        };
      }

      const messages = await convo.messages(opts);
      const temp = XMTP.formatMessage(messages);
      const filtered = temp.filter(
        current => !prevMessages?.some(item => item?._id === current?._id),
      );

      return filtered;
    }
  },
  newConversation: async ({address}) => {
    if (!XMTP.client) {
      console.warn('Please initialize client first');
      return;
    }
    return await XMTP.client.conversations.newConversation(address);
  },
  getConversation: async ({topic, peerAddress, createdAt, version}) => {
    if (!XMTP.client) {
      console.warn('Please initialize client first');
      return;
    }

    let convo;
    if (XMTP.client && XMTP.client.conversations) {
      for (const conversation of await XMTP.client.conversations.list()) {
        //find topic
        if (conversation?.topic === topic) {
          convo = conversation;
          break;
        }
      }
    }

    if (convo) {
      return convo;
    }
  },
  blockConversation: async ({peerAddress}) => {
    if (!XMTP.client) {
      console.warn('Please initialize client first');
      return;
    }
    return await XMTP.client?.contacts.deny([peerAddress]);
  },
  unBlockConversation: async ({peerAddress}) => {
    if (!XMTP.client) {
      console.warn('Please initialize client first');
      return;
    }
    return await XMTP.client?.contacts.allow([peerAddress]);
  },
  formatMessage: messages => {
    const tempMesssages = Array.isArray(messages) ? messages : [];
    const finalMessages = [];
    let contentTypeCombined;
    for (let i = 0; i < tempMesssages.length; i++) {
      const msg = tempMesssages[i];
      contentTypeCombined = `${msg.contentType?.authorityId}/${msg.contentType?.typeId}:${msg.contentType?.versionMajor}.${msg.contentType?.versionMinor}`;
      if (contentTypeCombined === 'xmtp.org/text:1.0') {
        finalMessages.push({
          _id: msg.id,
          text: msg.content,
          createdAt: new Date(msg?.sent).toISOString(),
          user: {
            _id: msg?.senderAddress,
          },
        });
      } else if (contentTypeCombined === 'com.dok.wallet/customReply:1.1') {
        const customReply = msg.content;
        finalMessages.push({
          _id: msg.id,
          text: customReply.message,
          reference: customReply.repliedMessageId,
          repliedMessage: customReply.repliedMessage,
          repliedUserId: customReply.senderAddress,
          createdAt: new Date(msg?.sent).toISOString(),
          user: {
            _id: msg?.senderAddress,
          },
        });
      }
    }
    return finalMessages;
  },
  formatConversation: conversations => {
    const tempConversations = Array.isArray(conversations) ? conversations : [];
    const consents = tempConversations.map(item => item.consentState);
    return tempConversations.map((conv, index) => ({
      topic: conv.topic,
      peerAddress: conv.peerAddress,
      createdAt: new Date(conv.createdAt).toISOString(),
      version: conv.version,
      clientAddress: conv?.client?.address,
      consentState: consents[index],
    }));
  },
};
