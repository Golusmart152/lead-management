import React from 'react';
import { cn } from '../../lib/utils';

interface FormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const FormCard: React.FC<FormCardProps> = ({ children, className, ...props }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-14 px-4 relative z-10">
      <div className={cn("card-bg-neo w-full max-w-md p-8 md:p-10 shadow-2xl border border-[#24263d] space-y-7", className)} {...props}>
        {children}
      </div>
    </div>
  );
};

interface FormCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const FormCardHeader: React.FC<FormCardHeaderProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn("text-center pb-2 tracking-tight", className)} {...props}>
      {children}
    </div>
  );
};

interface FormCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

const FormCardTitle: React.FC<FormCardTitleProps> = ({ children, className, ...props }) => {
  return (
    <h2 className={cn("text-3xl font-bold text-white", className)} {...props}>
      {children}
    </h2>
  );
};

interface FormCardContentProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
}

const FormCardContent: React.FC<FormCardContentProps> = ({ children, className, ...props }) => {
  return (
    <form className={cn("space-y-6", className)} {...props}>
      {children}
    </form>
  );
};

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

const FormLabel: React.FC<FormLabelProps> = ({ children, className, ...props }) => {
  return (
    <label className={cn("text-sm font-medium text-[#a0a0b2] block mb-1", className)} {...props}>
      {children}
    </label>
  );
};

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692]",
        className
      )}
      {...props}
    />
  );
};

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={cn(
        "w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692] resize-none",
        className
      )}
      {...props}
    />
  );
};

interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex justify-end items-center space-x-3 pt-1", className)} {...props}>
      {children}
    </div>
  );
};

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  children: React.ReactNode;
  className?: string;
}

const FormButton: React.FC<FormButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseClasses = "py-2.5 px-3 text-sm transition";

  const variantClasses = {
    primary: "btn-accent",
    secondary: "btn-link",
    link: "btn-link text-xs"
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

interface FormLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
}

const FormLink: React.FC<FormLinkProps> = ({ children, className, ...props }) => {
  return (
    <a className={cn("btn-link text-xs", className)} {...props}>
      {children}
    </a>
  );
};

interface FormLinkContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const FormLinkContainer: React.FC<FormLinkContainerProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex justify-between items-center pt-0", className)} {...props}>
      {children}
    </div>
  );
};

export {
  FormCard,
  FormCardHeader,
  FormCardTitle,
  FormCardContent,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormActions,
  FormButton,
  FormLink,
  FormLinkContainer
};