import React from 'react';
import AppStore from '../../stores/AppStore'
import { Tabs } from '../ui'

class Database extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { db } = this.props.params;
    AppStore.setContentHeader(db);
  }

  render() {
    const { params, routes } = this.props;
    const { db } = params;
    const tabs = [
      { id: 'documents', name: 'Documents', to: `/databases/${db}/documents` },
      { id: 'channels', name: 'Channels', to: `/databases/${db}/channels` },
      { id: 'users', name: 'Users', to: `/databases/${db}/users` }
    ];
    return (
      <Tabs tabs={tabs} routes={routes} params={params}>
        {this.props.children}
      </Tabs>
    );
  }
}

export default Database;