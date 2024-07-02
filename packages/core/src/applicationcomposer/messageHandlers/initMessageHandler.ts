/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import { InitResponseMessage, MessageType, WebviewContext, Command } from '../types'
import { getAmazonqAPI } from '../../amazonq/extApi'

export async function initMessageHandler(context: WebviewContext) {
    const filePath = context.defaultTemplatePath
    const qApi = await getAmazonqAPI()
    let isConnectedToCodeWhisperer = false
    if (qApi) {
        const authState = await qApi.authApi.getChatAuthState()
        isConnectedToCodeWhisperer =
            authState.codewhispererChat === 'connected' || authState.codewhispererChat === 'expired'
    }

    const responseMessage: InitResponseMessage = {
        messageType: MessageType.RESPONSE,
        command: Command.INIT,
        templateFileName: path.basename(filePath),
        templateFilePath: filePath,
        isConnectedToCodeWhisperer,
    }

    await context.panel.webview.postMessage(responseMessage)
}
