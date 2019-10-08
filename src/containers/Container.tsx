import React from 'react';
import { Provider } from 'mobx-react';
import rootStore from '../store/store';
import '../style/index.less';
import { Button, Divider, Html, Image, Text, Social } from './extension';
import Transform from '../lib/transform';
import { Config } from '../lib/util';
import Wrapper from './Wrapper';


(window as any).rootStore = rootStore;

class DesignEditor extends React.Component<IDesignEditorProps> {

  componentDidMount() {
    const { onRef = () => {} } = this.props;
    this.initConfig();
    onRef({
      export: this.export,
      getData: this.getData,
      setData: this.setData,
    });
  }

  componentWillReceiveProps(nextProps, nextState){
    const { mentions } = this.props;
    if (mentions && JSON.stringify(Config.get('mentions')) !== JSON.stringify(mentions)) {
      Config.set('mentions', mentions);
    }
  }

  initConfig(){
    const { children, imageUploadUrl, onUpload, onUploadError, mentions, contents } = this.props;
    Config.set('imageUploadUrl', imageUploadUrl);
    onUpload && Config.set('onUpload', onUpload);
    onUploadError && Config.set('onUploadError', onUploadError);
    mentions && Config.set('mentions', mentions);
    contents && Config.set('contents', contents);
    [Button, Divider, Html, Image, Text, Social].forEach((Content: any) => {
      const content = new Content();
      Content.type = content.getContentType();
      if (Config.get('contents').some(type => type === Content.type)) {
        rootStore.DesignState.addExtension(Content)
        rootStore.DesignState.setAttribute(Content.type, content.getInitialAttribute());
      }
    });
    React.Children.forEach(children, (Child: any) => {
      if (Child) {
        const content = new Child.type()
        Child.type.type = content.getContentType();
        rootStore.DesignState.addExtension(Child.type);
        rootStore.DesignState.setAttribute(Child.type.type, content.getInitialAttribute());
      }
    });
  }

  export = () => {
    const rawData = this.getData();
    const transform = new Transform(rawData, rootStore.DesignState.getExtensions());
    return transform.toHtml();
  }

  getData = () => {
    return rootStore.DesignState.getData();
  }

  setData = (json) => {
    rootStore.DesignState.execCommand('setData', json);
  }

  render(){
    return <Provider rootStore={rootStore}>
        <Wrapper />
    </Provider>;
  }
}

interface IApi {
  export: () => void;
  getData: () => IKeyValueMap;
  setData: (json: IKeyValueMap) => void;
}

interface IDesignEditorProps {
  onRef?: (api: IApi) => void;
  mentions?: any;
  contents?: any;
  imageUploadUrl?: string;
  onUpload?: (data: IKeyValueMap) => string;
  onUploadError?: (error: Error) => void;
}

export default DesignEditor;
