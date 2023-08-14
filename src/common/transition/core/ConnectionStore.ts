import { Connection } from "mongoose";

import { TRANSACTION_KEY } from "@/common/transition/constants";

class ConnectionStore {
  private static instance: ConnectionStore = new ConnectionStore();
  private _connections: { [K: string]: Connection } = {};

  constructor() {
    return ConnectionStore.instance;
  }

  setConnection(connection: Connection, connectionName = TRANSACTION_KEY) {
    this._connections[connectionName] = connection;
  }

  getConnection(connectionName = TRANSACTION_KEY) {
    return this._connections[connectionName];
  }
}

export { ConnectionStore };
