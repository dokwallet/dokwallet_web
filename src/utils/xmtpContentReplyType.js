const ContentTypeCustomReply = {
  authorityId: 'com.dok.wallet',
  typeId: 'customReply',
  versionMajor: 1,
  versionMinor: 1,
};

class CustomReply {
  constructor(repliedMessage, repliedMessageId, message, senderAddress) {
    if (!repliedMessage || !repliedMessageId || !message || !senderAddress) {
      throw new Error('All parameters are required');
    }
    if (typeof senderAddress !== 'string' || !senderAddress.startsWith('0x')) {
      throw new Error('Invalid sender address format');
    }
    this.repliedMessage = repliedMessage;
    this.repliedMessageId = repliedMessageId;
    this.message = message;
    this.senderAddress = senderAddress;
  }
}

class ContentTypeCustomReplyCodec {
  get contentType() {
    return ContentTypeCustomReply;
  }

  encode(decoded) {
    if (!decoded || typeof decoded !== 'object') {
      throw new Error('Invalid decoded object');
    }
    if (
      !decoded.repliedMessage ||
      !decoded.repliedMessageId ||
      !decoded.message ||
      !decoded.senderAddress
    ) {
      throw new Error('Missing required parameters');
    }
    return {
      type: ContentTypeCustomReply,
      parameters: {
        repliedMessage: decoded.repliedMessage,
        repliedMessageId: decoded.repliedMessageId,
        message: decoded.message,
        senderAddress: decoded.senderAddress,
      },
      content: new Uint8Array(0),
    };
  }

  decode(encoded) {
    if (!encoded || !encoded.parameters) {
      throw new Error('Invalid encoded message format');
    }

    const repliedMessage = encoded.parameters.repliedMessage;
    const repliedMessageId = encoded.parameters.repliedMessageId;
    const message = encoded.parameters.message;
    const senderAddress = encoded.parameters.senderAddress;

    if (!repliedMessage || !repliedMessageId || !message || !senderAddress) {
      throw new Error('Missing required parameters in encoded message');
    }

    return new CustomReply(
      repliedMessage,
      repliedMessageId,
      message,
      senderAddress,
    );
  }

  fallback(content) {
    return 'ContentTypeCustomReply is not supported';
  }

  shouldPush() {
    return true;
  }
}

export {ContentTypeCustomReplyCodec, CustomReply, ContentTypeCustomReply};
