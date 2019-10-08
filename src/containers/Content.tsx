import React from 'react';
import { inject, observer } from 'mobx-react';
import ContentFactory from './sidebar/ContentItems/ContentFactory';


@inject('rootStore')
@observer
class Content extends React.Component<IContentProps> {
  render(){
    const { rootStore } = this.props;
    return <ul className="ds_content">
      {rootStore.DesignState.extensions.map((Extension) => {
        const instance = new Extension();
        return ContentFactory(instance.getContentType(), instance.getLabel(), instance.getIconClass());
      })
        .map((Component, index) => <Component key={index}/>)}
    </ul>
  }
}

interface IContentProps {
  rootStore?: any;
}

export default Content;