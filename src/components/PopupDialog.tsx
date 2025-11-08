/**
 * Popup Dialog Example
 * Matches the design from HTML template with glass morphism effects
 */
import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';

interface PopupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
    };
    secondary?: {
      label: string;
      onClick: () => void;
    };
  };
}

const PopupDialog: React.FC<PopupDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type = 'info',
  children,
  actions,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="ds-text-success h-6 w-6" />;
      case 'warning':
        return <AlertCircle className="ds-text-warning h-6 w-6" />;
      case 'error':
        return <AlertCircle className="ds-text-error h-6 w-6" />;
      default:
        return <Info className="ds-text-accent h-6 w-6" />;
    }
  };

  const getDialogStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/20';
      case 'warning':
        return 'border-yellow-500/20';
      case 'error':
        return 'border-red-500/20';
      default:
        return 'border-blue-500/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`ds-glass-card max-w-md ${getDialogStyles()}`}>
        <DialogHeader className="ds-flex ds-items-start ds-gap-4">
          <div className="ds-flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ds-flex-1">
            <DialogTitle className="ds-text-subtitle">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="ds-text-muted mt-2">
                {description}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        {children && (
          <div className="ds-mt-6">
            {children}
          </div>
        )}

        {actions && (
          <div className="ds-flex ds-justify-end ds-gap-3 ds-mt-8">
            {actions.secondary && (
              <Button
                variant="secondary"
                onClick={actions.secondary.onClick}
                className="ds-btn ds-btn-outline"
              >
                {actions.secondary.label}
              </Button>
            )}
            {actions.primary && (
              <Button
                onClick={actions.primary.onClick}
                className="ds-btn ds-btn-primary"
              >
                {actions.primary.label}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PopupDialog;