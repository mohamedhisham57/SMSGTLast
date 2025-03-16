import fetch from 'node-fetch';

class RouterClient {
  constructor(routerUrl, login, password) {
    this.routerUrl = routerUrl;
    this.login = login;
    this.password = password;
    this.token = null;
  }

  async connect() {
    try {
      // Get token from login
      const response = await fetch(`${this.routerUrl}/cgi-bin/luci/api/xqsystem/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.login,
          password: this.password,
        }),
      });

      const data = await response.json();
      
      if (data.token) {
        this.token = data.token;
        console.log('Successfully connected to router');
        return true;
      } else {
        throw new Error('Failed to get token from router');
      }
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  async execute(payload) {
    if (!this.token) {
      throw new Error('Not connected to router. Call connect() first');
    }

    try {
      const response = await fetch(`${this.routerUrl}/cgi-bin/luci/;stok=${this.token}/api/misystem/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return await response.json();
    } catch (error) {
      console.error('Command execution error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (!this.token) {
      return true;
    }

    try {
      await fetch(`${this.routerUrl}/cgi-bin/luci/;stok=${this.token}/api/xqsystem/logout`, {
        method: 'POST',
      });
      
      this.token = null;
      console.log('Successfully disconnected from router');
      return true;
    } catch (error) {
      console.error('Disconnection error:', error);
      throw error;
    }
  }
}

export default RouterClient;
