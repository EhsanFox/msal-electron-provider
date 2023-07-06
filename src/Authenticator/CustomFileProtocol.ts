/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { AuthCodeListener } from "./AuthCodeListener";
import { Protocol, ProtocolRequest } from "electron";
import { normalize } from "path";
import { parse } from "url";

/**
 * CustomFileProtocolListener can be instantiated in order
 * to register and unregister a custom file protocol on which
 * MSAL can listen for Auth Code responses.
 */
export class CustomFileProtocolListener extends AuthCodeListener {
  constructor(private readonly protocol: Protocol, hostName: string) {
    super(hostName);
  }

  /**
   * Registers a custom file protocol on which the library will
   * listen for Auth Code response.
   */
  public start(): void {
    this.protocol.registerFileProtocol(
      this.host,
      (req: ProtocolRequest, callback: (data: string) => void) => {
        const requestUrl = parse(req.url, true);
        callback(normalize(`${__dirname}/${requestUrl.path}`));
      }
    );
  }

  /**
   * Unregisters a custom file protocol to stop listening for
   * Auth Code response.
   */
  public close() {
    this.protocol.unregisterProtocol(this.host);
  }
}
