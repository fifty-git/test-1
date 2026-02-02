import React from "react";

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...rest }) => {
  return (
    <label className="block text-sm font-medium text-slate-700" {...rest}>
      {children}
    </label>
  );
};

export default Label;
