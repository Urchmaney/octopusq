import {
    createRemoteComponent,
    createRequires
} from "@paciolan/remote-component";
import {resolve} from "remote-component.config";

// import DOMClient from 'react-dom/client'
// import jsxRuntime from 'react/jsx-runtime';

const requires = createRequires(resolve);

export const RemoteComponent = createRemoteComponent({ requires });