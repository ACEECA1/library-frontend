export function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${active ? 'border-[#00502D] text-[#00502D]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}
    >
      {icon} {label}
    </button>
  );
}
