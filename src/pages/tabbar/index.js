import React from 'react';
import Link from 'umi/link';

export default class Index extends React.PureComponent {
  renderContent = () => {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <h1>TabBar Index Content</h1>
        <Link to="/list/index">go list page</Link>
		<div className="text-danger">text-danger</div>
      </div>
    );
  };

  render() {
    return <>{this.renderContent()}</>;
  }
}
