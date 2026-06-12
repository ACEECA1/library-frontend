import { ReactNode } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export function InputField({ label, icon, rightElement, ...props }: InputFieldProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {rightElement}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input 
          {...props}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00502D] focus:border-transparent transition-shadow ${props.className || ''}`}
        />
      </div>
    </div>
  );
}
