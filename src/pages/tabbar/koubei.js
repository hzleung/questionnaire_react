import React from 'react';

export default class Koubei extends React.PureComponent {
  renderContent = () => {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <h1>TabBar Koubei Content</h1>
      </div>
    );
  };
  render() {
    return <>{this.renderContent()}</>;
  }
}
