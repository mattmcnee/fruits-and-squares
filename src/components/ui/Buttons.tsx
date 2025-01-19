import { ReactNode, MouseEventHandler } from "react";
import LinkedInIcon from "/src/assets/linkedin-white.png";
import "./Buttons.scss";

interface ButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
}

interface BaseButtonProps extends ButtonProps {
    baseClassName: string;
    isIcon?: boolean;
}

const BaseButton = ({ baseClassName, className = "", onClick, children, type = "button", disabled = false, isIcon = false }: BaseButtonProps) => (
  <button
    type={type}
    className={`btn ${baseClassName} ${className} ${disabled ? "btn-disabled" : ""} ${isIcon ? "btn-icon" : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export const PrimaryButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-primary" className={className} onClick={onClick} type={type} disabled={disabled}>
    {children}
  </BaseButton>
);

export const SecondaryButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-secondary" className={className} onClick={onClick} type={type} disabled={disabled}>
    {children}
  </BaseButton>
);

export const TertiaryButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-tertiary" className={className} onClick={onClick} type={type} disabled={disabled}>
    {children}
  </BaseButton>
);

export const ClickableText = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-text" className={className} onClick={onClick} type={type} disabled={disabled}>
    {children}
  </BaseButton>
);

export const PrimaryIconButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-primary" className={className} onClick={onClick} type={type} disabled={disabled} isIcon={true}>
    {children}
  </BaseButton>
);

export const SecondaryIconButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-secondary" className={className} onClick={onClick} type={type} disabled={disabled} isIcon={true}>
    {children}
  </BaseButton>
);

export const TertiaryIconButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-tertiary" className={className} onClick={onClick} type={type} disabled={disabled} isIcon={true}>
    {children}
  </BaseButton>
);

export const AuthLinkedInButton = ({ onClick, children, type = "button", disabled = false, className = "" }: ButtonProps) => (
  <BaseButton baseClassName="btn-auth-linkedin" className={className} onClick={onClick} type={type} disabled={disabled}>
    <img className="btn-auth-icon" src={LinkedInIcon} alt="LinkedIn logo" />
    {children}
  </BaseButton>
);