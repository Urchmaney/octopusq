import './App.css';
import { RemoteComponent } from './components/remote/RemoteComponent';
import { Workspace } from './components/workspace/Workspace';

function App() {
  return (
    <>
      <Workspace>
        <p>Show me love</p>
      </Workspace>
      <RemoteComponent url='https://raw.githubusercontent.com/urchmaney/octopusq/external_comp/sample/test.umd.cjs' />
    </>

  )
}
export default App
