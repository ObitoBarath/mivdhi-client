import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primeflex/themes/primeone-light.css';
import 'primeflex/themes/primeone-dark.css';

import { PrimeReactProvider } from 'primereact/api';


import PolicyTable from "./components/PolicyTable.tsx";

function App() {

  return (
    <>

        <PrimeReactProvider>
            <>
                <div className="flex justify-content-center align-items-center" style={{fontWeight : "bold" , fontSize   : "1rem"}}><label style={{color : "black"}}>Insurance Policies 💸</label></div>
                <div className="flex flex-col items-center justify-center min-h-svh">
                    <PolicyTable/>
                </div>
            </>
        </PrimeReactProvider>
    </>
  )
}

export default App
