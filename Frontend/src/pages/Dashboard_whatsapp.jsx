import React, { useState , useEffect} from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import VisualizarMensaje from "../components/Sidebar/VisualizarMensaje";
import EnviarMensaje from "../components/Sidebar/EnviarMensaje";


const DashboardWhatsapp = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

 

  return (
    <div className="flex h-screen w-full bg-[#111111] text-white overflow-hidden font-sans " >
      {/* Sidebar fijo (historial) */}
      <Sidebar onSelectMessage={setSelectedMessage} />

      {/* Panel derecho dinámico */}
      <div className="flex-1 overflow-hidden">
        {selectedMessage ? (
          <VisualizarMensaje
            mensaje={selectedMessage}
            onClose={() => setSelectedMessage(null)}
          />
        ) : (
          <EnviarMensaje />
        )}
      </div>
    </div>
  );
};


export default DashboardWhatsapp;

