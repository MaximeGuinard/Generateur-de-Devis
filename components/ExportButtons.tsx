import React from 'react';

interface ExportButtonsProps {
  onDownloadJpg: () => void;
  onExportExcel: () => void;
  hasActiveItems: boolean;
}

const Button: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode; bgColor: string; }> = ({ onClick, disabled, children, bgColor }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full md:w-auto flex-1 text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${bgColor} text-[#12272b]`}
  >
    {children}
  </button>
);

const ExportButtons: React.FC<ExportButtonsProps> = ({ onDownloadJpg, onExportExcel, hasActiveItems }) => {
  return (
    <div className="bg-[#1a3638] p-4 rounded-lg flex flex-col md:flex-row items-center justify-center gap-3">
      <Button onClick={onDownloadJpg} disabled={!hasActiveItems} bgColor="bg-[#f1fd0d]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 1a1 1 0 00-1 1v4a1 1 0 001 1h8a1 1 0 001-1V7a1 1 0 00-1-1H6zm1 2a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
        Télécharger JPG
      </Button>
      <Button onClick={onExportExcel} disabled={!hasActiveItems} bgColor="bg-[#abd8d8]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 1v12h12V4H4zm3 2a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1h1zm5 0a1 1 0 011 1v2a1 1 0 01-1 1h-1a1 1 0 01-1-1V7a1 1 0 011-1h1zM7 12a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2a1 1 0 011-1h1zm5 0a1 1 0 011 1v2a1 1 0 01-1 1h-1a1 1 0 01-1-1v-2a1 1 0 011-1h1z" /></svg>
        Exporter Excel
      </Button>
    </div>
  );
};

export default ExportButtons;